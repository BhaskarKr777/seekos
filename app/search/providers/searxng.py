from datetime import datetime
import httpx

from app.search.models import SearchOptions, SearchResult
from app.search.providers.base import SearchProvider


class SearXNGProvider(SearchProvider):
    name = "searxng"

    def __init__(self, base_url: str, timeout: float = 10.0):
        self.base_url = base_url.rstrip("/")
        self.timeout = timeout

    async def search(
        self,
        query: str,
        options: SearchOptions,
    ) -> list[SearchResult]:
        params = {
            "q": query,
            "format": "json",
            "pageno": options.page,
            "safesearch": 1,
            "categories": options.category,
        }

        if options.language:
            params["language"] = options.language

        if options.time_range:
            params["time_range"] = options.time_range

        try:
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                response = await client.get(
                    f"{self.base_url}/search",
                    params=params,
                )
                response.raise_for_status()
                payload = response.json()
        except httpx.HTTPError:
            # Do not fabricate search results when an upstream engine is down.
            # The orchestrator exposes the provider failure in its response.
            raise

        results = []
        for item in payload.get("results", []):
            published_at = self._parse_datetime(item.get("publishedDate"))

            thumbnail_url = item.get("thumbnail_src") or item.get("thumbnail") or item.get("img_src")
            img_url = item.get("img_src") or (item.get("url") if options.category == "images" else None)
            author = item.get("author") or item.get("uploader")
            duration = item.get("length")
            price_val = item.get("price")
            price = str(price_val) if price_val is not None else None
            currency = item.get("currency")
            item_category = item.get("category") or options.category

            results.append(
                SearchResult(
                    title=item.get("title", ""),
                    url=item.get("url", ""),
                    snippet=item.get("content", ""),
                    source=self.name,
                    published_at=published_at,
                    score=item.get("score"),
                    thumbnail_url=thumbnail_url,
                    img_url=img_url,
                    author=author,
                    duration=duration,
                    price=price,
                    currency=currency,
                    category=item_category,
                )
            )

        return results

    @staticmethod
    def _parse_datetime(value):
        if not value:
            return None
        if isinstance(value, datetime):
            return value
        try:
            return datetime.fromisoformat(value.replace("Z", "+00:00"))
        except (TypeError, ValueError):
            return None
