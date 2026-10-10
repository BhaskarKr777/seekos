import pytest

from app.search.models import SearchOptions, SearchResult
from app.search.normalization import canonicalize_url, is_valid_url
from app.search.orchestrator import SearchOrchestrator


class FakeProvider:
    name = "fake"

    async def search(self, query, options):
        return [
            SearchResult(title="A", url="https://EXAMPLE.com/a/", source="fake"),
            SearchResult(title="A duplicate", url="https://example.com/a?utm_source=test", source="fake"),
            SearchResult(title="B", url="https://example.org:443/b", source="fake"),
        ]


@pytest.mark.asyncio
async def test_orchestrator_deduplicates_and_canonicalizes_urls():
    orchestrator = SearchOrchestrator([FakeProvider()])

    response = await orchestrator.search(
        "test",
        SearchOptions(limit=10),
    )

    assert len(response.results) == 2
    assert response.results[0].domain == "EXAMPLE.com"


def test_is_valid_url():
    assert is_valid_url("https://example.com/page")
    assert is_valid_url("http://localhost:8080/search")
    assert not is_valid_url("ftp://example.com")
    assert not is_valid_url("not a url")
    assert not is_valid_url("")


def test_canonicalize_url():
    assert canonicalize_url("HTTPS://Example.COM:443/test//path/?utm_source=abc&q=1#fragment") == "https://example.com/test/path?q=1"
    assert canonicalize_url("http://example.com:80/") == "http://example.com/"
