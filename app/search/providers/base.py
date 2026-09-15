from typing import Protocol

from app.search.models import SearchOptions, SearchResult


class SearchProvider(Protocol):
    name: str

    async def search(
        self,
        query: str,
        options: SearchOptions,
    ) -> list[SearchResult]:
        ...