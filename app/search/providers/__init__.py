from app.search.providers.base import SearchProvider
from app.search.providers.registry import ProviderRegistry, default_registry
from app.search.providers.searxng import SearXNGProvider
from app.search.providers.duckduckgo import DuckDuckGoProvider


def _searxng_factory(settings) -> SearchProvider:
    return SearXNGProvider(
        base_url=settings.searxng_url,
        timeout=settings.provider_timeout,
    )


# Register default providers
default_registry.register("searxng", _searxng_factory)
default_registry.register("duckduckgo", lambda settings: DuckDuckGoProvider(settings.provider_timeout))

__all__ = [
    "SearchProvider",
    "SearXNGProvider",
    "DuckDuckGoProvider",
    "ProviderRegistry",
    "default_registry",
]
