# SeekOS — Open-Source Search Platform

SeekOS is an open-source, self-hostable, privacy-focused, customizable search platform with a modular FastAPI backend and a Next.js search UI.

## Overview & Status

- **Milestone A (Backend)**: Complete, stable, documented, and fully verified with 12 automated unit/integration tests.
- **Milestone B (Frontend)**: Built in `./frontend` using Next.js 16, TypeScript, and Tailwind CSS with dual (Dark & Light) theme support and SafeSearch filtering.

### Key Capabilities

- **FastAPI Async Backend API**: Endpoint `/api/v1/search` with OpenAPI documentation at `/docs`.
- **Next.js Web Interface**: Search UI on `http://localhost:3000` with query URL synchronization, page pagination, result limit controls, and provider health badges.
- **Universal Google / Bing Style Ranking**: Direct domain authority resolver and phrase relevance matcher prioritizing official brand portals (e.g., `rockstargames.com` for GTA 6, `samsung.com` for Samsung, `apple.com` for Apple App Store).
- **SafeSearch & Content Protection**: SafeSearch parameter enforcement and domain blocklist filtering for adult, torrent, or malicious URLs.
- **Dark & Light Mode**: Dual theme switcher using custom palette tokens with persistent `localStorage` preference.
- **Extensible Provider Architecture**: Decoupled `SearchProvider` protocol and `ProviderRegistry` for adding custom providers.
- **Docker Compose Setup**: Services configured for API, Next.js Frontend, SearXNG, PostgreSQL, and Redis.

---

## Quick Start

### Option 1: Run with Docker Compose (Recommended)

Start all services (API, Frontend, SearXNG, PostgreSQL, Redis):

```bash
docker compose up --build
```

Access services:
- **Web App**: `http://localhost:3000`
- **FastAPI API**: `http://localhost:8000`
- **API Documentation**: `http://localhost:8000/docs`
- **SearXNG Engine**: `http://localhost:8080`

### Option 2: Run Locally for Development

1. **Start Backend**:
   ```bash
   python -m uvicorn app.main:app --port 8000 --reload
   ```

2. **Start Frontend**:
   ```bash
   cd frontend
   npm run dev
   ```

3. Open `http://localhost:3000` in your browser.

---

## Environment Configuration

Configure `.env` in the root directory:

```env
APP_NAME=SeekOS
APP_VERSION=0.1.0
ENVIRONMENT=development

# Enabled search providers
ENABLED_PROVIDERS=searxng

# SearXNG endpoint & timeout
SEARXNG_URL=http://searxng:8080
PROVIDER_TIMEOUT=5.0

# Database & Cache settings
DATABASE_URL=postgresql+psycopg://seekos:POSTGRES_PASSWORD@postgres:5432/seekos
REDIS_URL=redis://redis:6379/0
```

---

## Running Tests

Run backend unit and integration test suite:

```bash
python -m pytest
```

Build and check frontend:

```bash
cd frontend
npm run build
```

---

## Architecture Diagram

```text
Next.js Web UI (localhost:3000)
         |
         v
   FastAPI (/api/v1/search)
         |
         v
   SearchOrchestrator
         |
    +----+----+
    |         |
    v         v
 ProviderRegistry
    |
    +--> SearXNGProvider (searxng:8080 / Local Dev Fallback)
    |
    v
 SafeSearch & URL Canonicalization
    |
    v
 Universal Relevance Ranking Engine
    |
    v
 SeekOS SearchResponse Schema
```
