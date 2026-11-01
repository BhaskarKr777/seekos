import httpx
import pytest

from app.search.models import SearchOptions
from app.search.providers.searxng import SearXNGProvider


@pytest.mark.asyncio
async def test_searxng_provider_does_not_fabricate_results_on_connection_failure(monkeypatch):
    async def fail_get(self, *args, **kwargs):
        raise httpx.ConnectError("offline")

    monkeypatch.setattr(httpx.AsyncClient, "get", fail_get)
    provider = SearXNGProvider("http://search.example")

    with pytest.raises(httpx.ConnectError):
        await provider.search("seekos", SearchOptions())
