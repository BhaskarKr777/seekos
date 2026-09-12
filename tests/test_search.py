import pytest

from app.search.models import SearchOptions, SearchResult
from app.search.orchestrator import SearchOrchestrator


class FakeProvider:
    name = "fake"

    async def search(self, query, options):
        return [
            SearchResult(
                title=f"Result for {query}",
                url="https://example.com",
                snippet="test",
                source="fake",
            )
        ]


@pytest.mark.asyncio
async def test_search_returns_seekos_schema():
    orchestrator = SearchOrchestrator([FakeProvider()])

    response = await orchestrator.search("RAG", SearchOptions(limit=10))

    assert response.query == "RAG"
    assert response.metadata.providers == ["fake"]
    assert response.results[0].title == "Result for RAG"
