from datetime import datetime

from pydantic import BaseModel, Field


class SearchOptions(BaseModel):
    page: int = Field(default=1, ge=1)
    limit: int = Field(default=10, ge=1, le=50)
    language: str | None = None
    time_range: str | None = None


class SearchResult(BaseModel):
    title: str
    url: str
    snippet: str = ""
    source: str
    domain: str | None = None
    published_at: datetime | None = None
    score: float | None = None


class SearchMetadata(BaseModel):
    total: int
    providers: list[str]
    took_ms: int


class SearchResponse(BaseModel):
    query: str
    results: list[SearchResult]
    metadata: SearchMetadata
