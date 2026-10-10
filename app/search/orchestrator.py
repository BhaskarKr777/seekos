import asyncio
import time
from urllib.parse import urlparse

from app.search.models import (
    ProviderStatus,
    SearchOptions,
    SearchResponse,
    SearchResult,
)
from app.search.normalization import canonicalize_url, is_safe_url, is_valid_url
from app.search.ranking import rank_results


class SearchOrchestrator:
    def __init__(self, providers, provider_timeout: float = 5.0):
        self.providers = providers
        self.provider_timeout = provider_timeout

    async def search(
        self,
        query: str,
        options: SearchOptions,
    ) -> SearchResponse:
        started = time.perf_counter()

        provider_results, provider_status = await self._search_providers(
            query,
            options,
        )

        results: list[SearchResult] = []
        seen_urls: set[str] = set()

        for provider_name, provider_items in provider_results:
            for item in provider_items:
                if not is_valid_url(item.url) or not is_safe_url(item.url):
                    continue

                canonical = canonicalize_url(item.url)
                if canonical in seen_urls:
                    continue

                seen_urls.add(canonical)

                domain = item.domain or urlparse(item.url).netloc
                normalized = item.model_copy(
                    update={
                        "source": provider_name,
                        "domain": domain,
                        "url": item.url.strip(),
                    }
                )
                results.append(normalized)

        # Apply deterministic ranking layer
        ranked = rank_results(results, query)
        final_results = ranked[: options.limit]

        took_ms = round((time.perf_counter() - started) * 1000)

        return SearchResponse(
            query=query,
            results=final_results,
            metadata={
                "total": len(final_results),
                "providers": [name for name, _ in provider_results],
                "provider_status": provider_status,
                "took_ms": took_ms,
            },
        )

    async def _search_providers(
        self,
        query: str,
        options: SearchOptions,
    ) -> tuple[
        list[tuple[str, list[SearchResult]]],
        list[ProviderStatus],
    ]:
        if not self.providers:
            return [], []

        tasks = [
            asyncio.wait_for(
                provider.search(query, options),
                timeout=self.provider_timeout,
            )
            for provider in self.providers
        ]

        provider_results = await asyncio.gather(
            *tasks,
            return_exceptions=True,
        )

        output: list[tuple[str, list[SearchResult]]] = []
        statuses: list[ProviderStatus] = []

        for provider, result in zip(self.providers, provider_results):
            if isinstance(result, asyncio.TimeoutError):
                statuses.append(
                    ProviderStatus(
                        name=provider.name,
                        status="timeout",
                    )
                )
                continue

            if isinstance(result, Exception):
                statuses.append(
                    ProviderStatus(
                        name=provider.name,
                        status="error",
                    )
                )
                continue

            statuses.append(
                ProviderStatus(
                    name=provider.name,
                    status="success",
                )
            )

            output.append((provider.name, result))

        return output, statuses