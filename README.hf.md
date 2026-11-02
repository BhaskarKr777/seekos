---
title: SeekOS API
emoji: 🔍
colorFrom: blue
colorTo: indigo
sdk: docker
app_port: 7860
pinned: false
---

# SeekOS API

Open-source, privacy-focused search backend powered by FastAPI.

- **API Docs**: [/docs](./docs)
- **Health**: [/api/v1/health](./api/v1/health)
- **Search**: `GET /api/v1/search?q=your+query`

## Environment Variables (set as Space Secrets)

| Variable | Description | Example |
|---|---|---|
| `ENABLED_PROVIDERS` | Comma-separated providers | `duckduckgo` |
| `CORS_ORIGINS` | Allowed frontend origins | `https://your-app.vercel.app` |
| `SEARXNG_URL` | Optional public SearXNG instance | `https://searx.be` |

