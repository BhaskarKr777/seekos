import asyncio
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


class FailingProvider:
    name = "failing"

    async def search(self, query, options):
        raise RuntimeError("provider failed")


class SlowProvider:
    name = "slow"

    async def search(self, query, options):
        await asyncio.sleep(2)
        return []


@pytest.mark.asyncio
async def test_search_returns_seekos_schema():
    orchestrator = SearchOrchestrator([FakeProvider()])

    response = await orchestrator.search(
        "RAG",
        SearchOptions(limit=10),
    )

    assert response.query == "RAG"
    assert response.metadata.providers == ["fake"]

    assert response.metadata.provider_status[0].name == "fake"
    assert response.metadata.provider_status[0].status == "success"

    assert response.results[0].title == "Result for RAG"


@pytest.mark.asyncio
async def test_search_keeps_results_when_provider_fails():
    orchestrator = SearchOrchestrator(
        [
            FakeProvider(),
            FailingProvider(),
        ]
    )

    response = await orchestrator.search(
        "RAG",
        SearchOptions(limit=10),
    )

    assert response.query == "RAG"
    assert response.metadata.providers == ["fake"]

    assert response.metadata.provider_status[0].name == "fake"
    assert response.metadata.provider_status[0].status == "success"

    assert response.metadata.provider_status[1].name == "failing"
    assert response.metadata.provider_status[1].status == "error"

    assert len(response.results) == 1
    assert response.results[0].title == "Result for RAG"


@pytest.mark.asyncio
async def test_search_times_out_slow_provider():
    orchestrator = SearchOrchestrator(
        [
            FakeProvider(),
            SlowProvider(),
        ],
        provider_timeout=0.05,
    )

    response = await orchestrator.search(
        "RAG",
        SearchOptions(limit=10),
    )

    assert response.metadata.providers == ["fake"]

    assert response.metadata.provider_status[0].name == "fake"
    assert response.metadata.provider_status[0].status == "success"

    assert response.metadata.provider_status[1].name == "slow"
    assert response.metadata.provider_status[1].status == "timeout"

    assert len(response.results) == 1