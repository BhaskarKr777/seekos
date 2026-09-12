import pytest

from app.search.models import SearchOptions, SearchResult
from app.search.orchestrator import SearchOrchestrator


class FakeProvider:
    name = "fake"

    async def search(self, query, options):
        return [
            SearchResult(title="A", url="https://example.com/a", source="fake"),
            SearchResult(title="A duplicate", url="https://example.com/a", source="fake"),
            SearchResult(title="B", url="https://example.org/b", source="fake"),
        ]


@pytest.mark.asyncio
async def test_orchestrator_deduplicates_urls():
    orchestrator = SearchOrchestrator([FakeProvider()])

    response = await orchestrator.search(
        "test",
        SearchOptions(limit=10),
    )

    assert len(response.results) == 2
    assert response.results[0].domain == "example.com"
