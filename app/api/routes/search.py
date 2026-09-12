from fastapi import APIRouter, HTTPException, Query

from app.api.dependencies import orchestrator
from app.search.models import SearchOptions, SearchResponse

router = APIRouter()


@router.get("/search", response_model=SearchResponse)
async def search(
    q: str = Query(..., min_length=1, max_length=500),
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=50),
    language: str | None = Query(None, min_length=2, max_length=10),
    time_range: str | None = Query(None),
):
    options = SearchOptions(
        page=page,
        limit=limit,
        language=language,
        time_range=time_range,
    )

    try:
        return await orchestrator.search(q, options)
    except Exception as exc:
        raise HTTPException(
            status_code=502,
            detail="Search provider failed",
        ) from exc
