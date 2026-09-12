from app.core.config import get_settings
from app.search.orchestrator import SearchOrchestrator
from app.search.providers.searxng import SearXNGProvider


settings = get_settings()

provider = SearXNGProvider(
    base_url=settings.searxng_url
)

orchestrator = SearchOrchestrator(
    providers=[provider]
)