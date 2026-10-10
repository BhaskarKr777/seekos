from datetime import datetime
from urllib.parse import urlparse
from app.search.models import SearchResult


def rank_results(results: list[SearchResult], query: str) -> list[SearchResult]:
    """
    Universal search relevance & ranking engine:
    1. Direct domain match (e.g. 'samsung' -> samsung.com, 'roblox' -> roblox.com).
    2. Exact title phrase match.
    3. Keyword coverage ratio in title & snippet.
    4. Provider score authority.
    5. Recency and stable tie-breaking.
    """
    if not results:
        return []

    clean_query = query.strip().lower()
    query_tokens = [w for w in clean_query.split() if len(w) > 0]

    indexed_results = list(enumerate(results))

    def compute_sort_key(item: tuple[int, SearchResult]):
        index, result = item
        title_lower = result.title.lower()
        url_lower = result.url.lower()
        domain = (result.domain or urlparse(result.url).netloc).lower()

        relevance_score = 0.0

        # 1. Direct Domain Match Boost (+100.0)
        # e.g., query "samsung" matching domain "samsung.com", "roblox" matching "roblox.com"
        for tok in query_tokens:
            if len(tok) >= 3 and (tok in domain or f"{tok}.com" in url_lower or f"{tok}.org" in url_lower or f"{tok}.net" in url_lower):
                relevance_score += 100.0
                break

        # 2. Exact Query Phrase Match in Title (+50.0)
        if clean_query in title_lower:
            relevance_score += 50.0

        # 3. Keyword Token Match Coverage (+20.0 max)
        matched_tokens = sum(1 for tok in query_tokens if tok in title_lower or tok in domain)
        token_coverage = matched_tokens / max(len(query_tokens), 1)
        relevance_score += (token_coverage * 20.0)

        # 4. Provider score (default 0.5)
        provider_score = result.score if result.score is not None else 0.5
        relevance_score += (provider_score * 5.0)

        # Snippet quality flag
        snippet_flag = 1 if result.snippet.strip() else 0

        # Published timestamp if present
        published_timestamp = 0.0
        if result.published_at and isinstance(result.published_at, datetime):
            published_timestamp = result.published_at.timestamp()

        return (
            relevance_score,
            snippet_flag,
            published_timestamp,
            -index,
        )

    sorted_items = sorted(
        indexed_results,
        key=compute_sort_key,
        reverse=True,
    )

    return [result for _, result in sorted_items]
