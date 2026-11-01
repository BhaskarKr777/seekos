from datetime import datetime, timezone
from html import unescape
from html.parser import HTMLParser
import re
from urllib.parse import parse_qs, urlparse, urlsplit

import httpx

from app.search.models import SearchOptions, SearchResult
from app.search.providers.base import SearchProvider


class _DuckDuckGoParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.results: list[dict[str, str]] = []
        self._href = ""
        self._title_parts: list[str] = []
        self._snippet_parts: list[str] = []
        self._in_title = False
        self._in_snippet = False

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        attributes = dict(attrs)
        classes = attributes.get("class", "") or ""
        if tag == "a" and "result__a" in classes:
            self._href = attributes.get("href", "") or ""
            self._title_parts = []
            self._in_title = True
        elif "result__snippet" in classes:
            self._snippet_parts = []
            self._in_snippet = True

    def handle_endtag(self, tag: str) -> None:
        if tag == "a" and self._in_title:
            title = " ".join(self._title_parts).strip()
            if title and self._href:
                self.results.append({"title": title, "url": self._href, "snippet": ""})
            self._in_title = False
        elif self._in_snippet and tag in {"a", "div"}:
            if self.results:
                self.results[-1]["snippet"] = " ".join(self._snippet_parts).strip()
            self._in_snippet = False

    def handle_data(self, data: str) -> None:
        if self._in_title:
            self._title_parts.append(data)
        if self._in_snippet:
            self._snippet_parts.append(data)


class DuckDuckGoProvider(SearchProvider):
    """A no-key fallback provider supporting general, image, video, news, and shopping filters."""

    name = "duckduckgo"

    def __init__(self, timeout: float = 10.0):
        self.timeout = timeout

    async def search(self, query: str, options: SearchOptions) -> list[SearchResult]:
        category = options.category or "general"
        async with httpx.AsyncClient(timeout=self.timeout, follow_redirects=True) as client:
            if category in ("images", "videos", "news"):
                vqd = await self._get_vqd(client, query, category)
                if vqd:
                    if category == "images":
                        items = await self._search_images(client, query, options, vqd)
                        if items:
                            return items
                    elif category == "videos":
                        items = await self._search_videos(client, query, options, vqd)
                        if items:
                            return items
                    elif category == "news":
                        items = await self._search_news(client, query, options, vqd)
                        if items:
                            return items

            if category == "shopping":
                items = await self._search_shopping(client, query, options)
                if items:
                    return items

            # Default or fallback to general web search
            return await self._search_html(client, query, options)

    async def _get_vqd(self, client: httpx.AsyncClient, query: str, category: str) -> str | None:
        try:
            category_params: dict[str, dict[str, str]] = {
                "images": {"ia": "images", "iax": "images"},
                "videos": {"ia": "videos", "iax": "videos"},
                "news": {"ia": "news", "iax": "news"},
                "shopping": {"ia": "products", "iax": "products"},
            }
            params: dict[str, str] = {"q": query, "t": "h_"}
            if category in category_params:
                params.update(category_params[category])

            resp = await client.get(
                "https://duckduckgo.com/",
                params=params,
                headers={
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
                },
            )
            match = (
                re.search(r"vqd=([0-9-_]+)", resp.text)
                or re.search(r'vqd="([^"]+)"', resp.text)
                or re.search(r"vqd='([^']+)'", resp.text)
            )
            return match.group(1) if match else None
        except Exception:
            return None

    async def _search_images(
        self, client: httpx.AsyncClient, query: str, options: SearchOptions, vqd: str
    ) -> list[SearchResult]:
        try:
            resp = await client.get(
                "https://duckduckgo.com/i.js",
                params={
                    "l": options.language or "wt-wt",
                    "o": "json",
                    "q": query,
                    "vqd": vqd,
                    "f": ",,,",
                    "p": "1",
                },
                headers={
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
                    "Referer": "https://duckduckgo.com/",
                    "Accept": "*/*",
                },
            )
            if resp.status_code == 200:
                data = resp.json()
                results = []
                for item in data.get("results", []):
                    img_url = item.get("image")
                    thumb_url = item.get("thumbnail")
                    page_url = item.get("url") or img_url
                    if not page_url:
                        continue
                    snippet_text = f"{item.get('width', '')}x{item.get('height', '')}" if item.get("width") else ""
                    results.append(
                        SearchResult(
                            title=item.get("title") or "Image result",
                            url=page_url,
                            snippet=snippet_text,
                            source=self.name,
                            domain=item.get("source") or urlparse(page_url).netloc,
                            thumbnail_url=thumb_url,
                            img_url=img_url,
                            category="images",
                        )
                    )
                if results:
                    start = (options.page - 1) * options.limit
                    return results[start : start + options.limit]
        except Exception:
            pass

        return await self._search_wiki_images(client, query, options)

    async def _search_wiki_images(
        self, client: httpx.AsyncClient, query: str, options: SearchOptions
    ) -> list[SearchResult]:
        try:
            resp = await client.get(
                "https://en.wikipedia.org/w/api.php",
                params={
                    "action": "query",
                    "format": "json",
                    "generator": "search",
                    "gsrsearch": query,
                    "gsrlimit": min(options.limit * options.page, 30),
                    "prop": "pageimages|extracts|info",
                    "inprop": "url",
                    "piprop": "thumbnail|original",
                    "pithumbsize": 600,
                    "exintro": 1,
                    "explaintext": 1,
                },
                headers={
                    "User-Agent": "SeekOS/1.0 (contact: admin@seekos.local)",
                    "Accept": "application/json",
                },
            )
            if resp.status_code != 200:
                return []
            data = resp.json()
            pages = data.get("query", {}).get("pages", {})
            results = []
            for p in pages.values():
                thumb = p.get("thumbnail", {}).get("source")
                orig = p.get("original", {}).get("source") or thumb
                if not thumb:
                    continue
                page_url = p.get("fullurl") or f"https://en.wikipedia.org/wiki/{p.get('title', '')}"
                snippet = p.get("extract", "")
                if snippet and len(snippet) > 150:
                    snippet = snippet[:147] + "..."
                results.append(
                    SearchResult(
                        title=p.get("title") or "Image result",
                        url=page_url,
                        snippet=snippet,
                        source=self.name,
                        domain="wikipedia.org",
                        thumbnail_url=thumb,
                        img_url=orig,
                        category="images",
                    )
                )
            start = (options.page - 1) * options.limit
            return results[start : start + options.limit]
        except Exception:
            return []

    async def _search_videos(
        self, client: httpx.AsyncClient, query: str, options: SearchOptions, vqd: str
    ) -> list[SearchResult]:
        try:
            resp = await client.get(
                "https://duckduckgo.com/v.js",
                params={
                    "l": options.language or "wt-wt",
                    "o": "json",
                    "q": query,
                    "vqd": vqd,
                    "f": ",,,",
                    "p": "1",
                },
                headers={
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
                    "Referer": "https://duckduckgo.com/",
                    "Accept": "*/*",
                },
            )
            if resp.status_code != 200:
                return []
            data = resp.json()
            results = []
            for item in data.get("results", []):
                video_url = item.get("content")
                if not video_url:
                    continue
                images_dict = item.get("images") or {}
                thumb_url = (
                    images_dict.get("medium")
                    or images_dict.get("large")
                    or images_dict.get("small")
                    or item.get("image")
                )

                published_at = None
                if item.get("published"):
                    try:
                        published_at = datetime.fromisoformat(item["published"].replace("Z", "+00:00"))
                    except Exception:
                        pass

                results.append(
                    SearchResult(
                        title=item.get("title") or "Video result",
                        url=video_url,
                        snippet=item.get("description") or "",
                        source=self.name,
                        domain=item.get("publisher") or urlparse(video_url).netloc,
                        thumbnail_url=thumb_url,
                        author=item.get("uploader") or item.get("publisher"),
                        duration=item.get("duration"),
                        published_at=published_at,
                        category="videos",
                    )
                )
            start = (options.page - 1) * options.limit
            return results[start : start + options.limit]
        except Exception:
            return []

    async def _search_news(
        self, client: httpx.AsyncClient, query: str, options: SearchOptions, vqd: str
    ) -> list[SearchResult]:
        try:
            resp = await client.get(
                "https://duckduckgo.com/news.js",
                params={
                    "l": options.language or "wt-wt",
                    "o": "json",
                    "q": query,
                    "vqd": vqd,
                    "p": "1",
                },
                headers={
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
                    "Referer": "https://duckduckgo.com/",
                    "Accept": "*/*",
                },
            )
            if resp.status_code != 200:
                return []
            data = resp.json()
            results = []
            for item in data.get("results", []):
                url = item.get("url")
                if not url:
                    continue
                published_at = None
                date_val = item.get("date")
                if date_val:
                    try:
                        published_at = datetime.fromtimestamp(date_val, tz=timezone.utc)
                    except Exception:
                        pass

                results.append(
                    SearchResult(
                        title=item.get("title") or "News headline",
                        url=url,
                        snippet=item.get("body") or "",
                        source=self.name,
                        domain=item.get("source") or urlparse(url).netloc,
                        thumbnail_url=item.get("image"),
                        author=item.get("source"),
                        published_at=published_at,
                        category="news",
                    )
                )
            start = (options.page - 1) * options.limit
            return results[start : start + options.limit]
        except Exception:
            return []

    async def _search_shopping(
        self, client: httpx.AsyncClient, query: str, options: SearchOptions
    ) -> list[SearchResult]:
        shopping_query = f"{query} buy online store"
        general_results = await self._search_html(client, shopping_query, options)
        results = []
        price_regex = re.compile(r"(\$|€|£|₹)\s?(\d+(?:,\d{3})*(?:\.\d{2})?)")
        for res in general_results:
            match = price_regex.search(res.snippet) or price_regex.search(res.title)
            price_str = None
            currency_str = None
            if match:
                currency_str = match.group(1)
                price_str = f"{currency_str}{match.group(2)}"

            results.append(
                res.model_copy(
                    update={
                        "category": "shopping",
                        "price": price_str,
                        "currency": currency_str,
                    }
                )
            )
        return results

    async def _search_html(
        self, client: httpx.AsyncClient, query: str, options: SearchOptions
    ) -> list[SearchResult]:
        response = await client.get(
            "https://html.duckduckgo.com/html/",
            params={"q": query, "kl": options.language or "wt-wt", "kp": "1"},
            headers={"User-Agent": "SeekOS/0.1 (+https://localhost)"},
        )
        response.raise_for_status()

        parser = _DuckDuckGoParser()
        parser.feed(response.text)
        start = (options.page - 1) * options.limit
        selected = parser.results[start : start + options.limit]
        return [
            SearchResult(
                title=unescape(item["title"]),
                url=self._target_url(item["url"]),
                snippet=unescape(item["snippet"]),
                source=self.name,
                domain=urlparse(self._target_url(item["url"])).netloc,
                category=options.category or "general",
            )
            for item in selected
        ]

    @staticmethod
    def _target_url(url: str) -> str:
        if url.startswith("//"):
            url = f"https:{url}"
        parsed = urlsplit(url)
        if parsed.netloc.endswith("duckduckgo.com"):
            target = parse_qs(parsed.query).get("uddg", [None])[0]
            if target:
                return target
        return url
