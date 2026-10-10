from typing import Callable, Dict
from app.core.config import Settings
from app.search.providers.base import SearchProvider


ProviderFactory = Callable[[Settings], SearchProvider]


class ProviderRegistry:
    def __init__(self):
        self._factories: Dict[str, ProviderFactory] = {}

    def register(self, name: str, factory: ProviderFactory) -> None:
        """Register a provider factory function under a name."""
        self._factories[name.lower()] = factory

    def get_factory(self, name: str) -> ProviderFactory | None:
        """Get the factory for a specific provider name."""
        return self._factories.get(name.lower())

    def create_provider(self, name: str, settings: Settings) -> SearchProvider | None:
        """Instantiate a provider if it is registered."""
        factory = self.get_factory(name)
        if factory is None:
            return None
        return factory(settings)

    def create_enabled_providers(self, settings: Settings) -> list[SearchProvider]:
        """Instantiate all providers specified in settings.enabled_providers."""
        providers = []
        for name in settings.enabled_providers:
            provider = self.create_provider(name, settings)
            if provider is not None:
                providers.append(provider)
        return providers

    def list_registered(self) -> list[str]:
        """Return list of all registered provider names."""
        return list(self._factories.keys())


# Global default registry instance
default_registry = ProviderRegistry()
