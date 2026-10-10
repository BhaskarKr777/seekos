from datetime import datetime
from app.search.models import SearchResult
from app.search.ranking import rank_results


def test_rank_results_prioritizes_keyword_matches_and_scores():
    r1 = SearchResult(
        title="Generic Web Page",
        url="https://example.com/1",
        snippet="some content",
        source="searxng",
        score=0.5,
    )
    r2 = SearchResult(
        title="Python Search Engine Guide",
        url="https://example.com/2",
        snippet="Learn about python search engines",
        source="searxng",
        score=0.9,
    )
    r3 = SearchResult(
        title="Python Guide",
        url="https://example.com/3",
        snippet="Python programming",
        source="searxng",
        published_at=datetime(2026, 1, 1),
    )

    ranked = rank_results([r1, r2, r3], query="python search")

    assert ranked[0].url == "https://example.com/2"
