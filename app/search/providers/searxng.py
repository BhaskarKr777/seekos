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
        }

        if options.language:
            params["language"] = options.language

        if options.time_range:
            params["time_range"] = options.time_range

        async with httpx.AsyncClient(timeout=self.timeout) as client:
            response = await client.get(
                f"{self.base_url}/search",
                params=params,
            )
            response.raise_for_status()
            payload = response.json()

        results = []
        for item in payload.get("results", []):
            published_at = self._parse_datetime(item.get("publishedDate"))

            results.append(
                SearchResult(
                    title=item.get("title", ""),
                    url=item.get("url", ""),
                    snippet=item.get("content", ""),
                    source=self.name,
                    published_at=published_at,
                    score=item.get("score"),
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
