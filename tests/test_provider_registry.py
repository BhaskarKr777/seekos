from app.core.config import Settings
from app.search.models import SearchOptions, SearchResult
from app.search.providers.base import SearchProvider
from app.search.providers.registry import ProviderRegistry


class MockProvider(SearchProvider):
    name = "mock"

    async def search(self, query: str, options: SearchOptions) -> list[SearchResult]:
        return []


def test_provider_registry_register_and_create():
    registry = ProviderRegistry()
    registry.register("mock", lambda settings: MockProvider())

    assert "mock" in registry.list_registered()

    provider = registry.create_provider("mock", Settings())
    assert provider is not None
    assert provider.name == "mock"


def test_provider_registry_enabled_providers():
    registry = ProviderRegistry()
    registry.register("mock1", lambda s: MockProvider())

    settings = Settings(enabled_providers=["mock1", "unknown"])
    enabled = registry.create_enabled_providers(settings)

    assert len(enabled) == 1
    assert enabled[0].name == "mock"
