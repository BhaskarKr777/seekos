from abc import ABC, abstractmethod

from app.search.models import SearchOptions, SearchResult


class SearchProvider(ABC):
    name: str

    @abstractmethod
    async def search(
        self,
        query: str,
        options: SearchOptions,
    ) -> list[SearchResult]:
        raise NotImplementedError
