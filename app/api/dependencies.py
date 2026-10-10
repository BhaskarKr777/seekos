from app.core.config import get_settings
from app.search.orchestrator import SearchOrchestrator
from app.search.providers import default_registry


def get_orchestrator() -> SearchOrchestrator:
    settings = get_settings()
    providers = default_registry.create_enabled_providers(settings)
    return SearchOrchestrator(
        providers=providers,
        provider_timeout=settings.provider_timeout,
    )


# Default global instance for quick references
settings = get_settings()
orchestrator = get_orchestrator()