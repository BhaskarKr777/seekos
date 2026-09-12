# SeekOS Backend v0.1

Backend foundation for SeekOS: a private, modular, open-source search engine.

## What works

- FastAPI application
- `/api/v1/health`
- `/api/v1/search`
- Pluggable `SearchProvider` interface
- SearXNG provider
- Normalized SeekOS result schema
- URL deduplication
- Pydantic validation
- Unit tests
- Docker Compose with SearXNG, PostgreSQL and Redis

## Run locally with Docker

```bash
docker compose up --build
```

Then:

```bash
curl "http://localhost:8000/api/v1/health"
curl "http://localhost:8000/api/v1/search?q=RAG"
```

API docs:

```text
http://localhost:8000/docs
```

SearXNG:

```text
http://localhost:8080
```

## Run tests

```bash
pip install -r requirements.txt
pytest
```

## Architecture

```text
Client
  |
  v
FastAPI
  |
  v
SearchOrchestrator
  |
  v
SearchProvider
  |
  +--> SearXNGProvider
  |
  v
SeekOS SearchResult
```

The provider boundary is intentional: SearXNG can be replaced or supplemented later without changing the public SeekOS response schema.

## Current limitations

v0.1 deliberately does not include:

- AI answers
- RAG
- embeddings
- Qdrant
- crawling
- authentication
- advanced ranking
- search history
- frontend

Those belong to later milestones.
