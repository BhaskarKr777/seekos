from app.search.providers.base import SearchProvider
from app.search.providers.registry import ProviderRegistry, default_registry
from app.search.providers.searxng import SearXNGProvider


def _searxng_factory(settings) -> SearchProvider:
    return SearXNGProvider(
        base_url=settings.searxng_url,
        timeout=settings.provider_timeout,
    )


# Register default providers
default_registry.register("searxng", _searxng_factory)

__all__ = [
    "SearchProvider",
    "SearXNGProvider",
    "ProviderRegistry",
    "default_registry",
]
