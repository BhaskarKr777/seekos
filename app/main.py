from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes.health import router as health_router
from app.api.routes.search import router as search_router


app = FastAPI(
    title="SeekOS API",
    version="0.1.0",
    description="Open-source, private, customizable search backend.",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(
    health_router,
    prefix="/api/v1",
)

app.include_router(
    search_router,
    prefix="/api/v1",
    tags=["search"],
)


@app.get("/")
async def root():
    return {
        "name": "SeekOS",
        "version": "0.1.0",
    }