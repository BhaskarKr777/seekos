from fastapi.testclient import TestClient

from app.api.dependencies import get_orchestrator
from app.main import app
from app.search.models import SearchResult
from app.search.orchestrator import SearchOrchestrator

client = TestClient(app)


class MockProvider:
    name = "mock"

    async def search(self, query, options):
        return [
            SearchResult(
                title=f"Mock result for {query}",
                url="https://mock.example.com/item",
                snippet="Mock snippet text",
                source="mock",
            )
        ]


def test_api_search_success():
    def override_get_orchestrator():
        return SearchOrchestrator([MockProvider()])

    app.dependency_overrides[get_orchestrator] = override_get_orchestrator
    try:
        response = client.get("/api/v1/search?q=fastapi&limit=5")
        assert response.status_code == 200
        data = response.json()
        assert data["query"] == "fastapi"
        assert len(data["results"]) == 1
        assert data["results"][0]["title"] == "Mock result for fastapi"
        assert data["metadata"]["providers"] == ["mock"]
    finally:
        app.dependency_overrides.clear()


def test_api_search_validation_error():
    # Empty query should fail validation with 422
    response = client.get("/api/v1/search?q=")
    assert response.status_code == 422

    # Limit too large (>50) should fail validation with 422
    response = client.get("/api/v1/search?q=test&limit=100")
    assert response.status_code == 422
