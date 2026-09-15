import asyncio
import time
from urllib.parse import urlparse

from app.search.models import SearchOptions, SearchResponse, SearchResult


class SearchOrchestrator:
    def __init__(self, providers):
        self.providers = providers

    async def search(
        self,
        query: str,
        options: SearchOptions,
    ) -> SearchResponse:
        started = time.perf_counter()

        provider_results = await self._search_providers(query, options)

        results: list[SearchResult] = []
        seen_urls: set[str] = set()

        for provider_name, provider_items in provider_results:
            for item in provider_items:
                normalized = item.model_copy(
                    update={
                        "source": provider_name,
                        "domain": item.domain or urlparse(item.url).netloc,
                    }
                )

                if normalized.url in seen_urls:
                    continue

                seen_urls.add(normalized.url)
                results.append(normalized)

        results = results[: options.limit]

        took_ms = round(
            (time.perf_counter() - started) * 1000
        )

        return SearchResponse(
            query=query,
            results=results,
            metadata={
                "total": len(results),
                "providers": [
                    name for name, _ in provider_results
                ],
                "took_ms": took_ms,
            },
        )

    async def _search_providers(
        self,
        query: str,
        options: SearchOptions,
    ) -> list[tuple[str, list[SearchResult]]]:

        tasks = [
            provider.search(query, options)
            for provider in self.providers
        ]

        provider_results = await asyncio.gather(
            *tasks,
            return_exceptions=True,
        )

        output: list[tuple[str, list[SearchResult]]] = []

        for provider, result in zip(
            self.providers,
            provider_results,
        ):
            if isinstance(result, Exception):
                continue

            output.append(
                (provider.name, result)
            )

        return output