# SeekOS — Open-Source Private Search Engine

<p align="center">
  <strong>A modern, privacy-focused, customizable metasearch engine with a Next.js interface and FastAPI backend.</strong>
</p>

<p align="center">
  <a href="https://seekos.vercel.app/"><img src="https://img.shields.io/badge/Live%20Demo-seekos.vercel.app-blue?style=for-the-badge&logo=vercel" alt="Live Demo" /></a>
  <a href="https://seekos-x3ar.onrender.com/docs"><img src="https://img.shields.io/badge/API%20Docs-FastAPI%20Swagger-009688?style=for-the-badge&logo=fastapi" alt="API Docs" /></a>
  <a href="#license"><img src="https://img.shields.io/badge/License-MIT-purple?style=for-the-badge" alt="License" /></a>
</p>

---

## 🌐 Live Deployments

| Component | Platform | URL |
|---|---|---|
| **Web Interface** | **Vercel** | [https://seekos.vercel.app](https://seekos.vercel.app/) |
| **Search API** | **Render** | [https://seekos-x3ar.onrender.com](https://seekos-x3ar.onrender.com) |
| **API Documentation** | **Render / Swagger** | [https://seekos-x3ar.onrender.com/docs](https://seekos-x3ar.onrender.com/docs) |

---

## 🌟 Key Features

- 🛡️ **Privacy by Design**: Zero search history tracking, no fingerprinting, and no personalized ad targeting.
- ⚡ **FastAPI High-Performance Async Backend**: Ultra-fast async query aggregation and streaming responses.
- 🎨 **Sleek Next.js 16 Web UI**: Built with TypeScript and Tailwind CSS, featuring smooth Dark and Light theme toggling with persistent preferences.
- 🔍 **Category Tabs**: Filter results seamlessly across **All**, **Images**, **Videos**, **News**, and **Shopping**.
- 🧩 **Modular Search Providers**: Decoupled provider architecture supporting DuckDuckGo and self-hosted SearXNG engines with fallback resilience.
- 🎯 **Universal Relevance Ranking**: Direct domain authority and brand matching that surfaces official portals first.
- 🔒 **SafeSearch Protection**: Configurable SafeSearch and domain blocklist to filter out adult, malicious, or spam domains.
- 🐳 **Self-Hostable**: Easily deployable with Docker Compose or as standalone cloud microservices (Vercel + Render).

---

## 🏗️ Architecture

```text
       ┌────────────────────────┐
       │   Next.js 16 Web UI    │  https://seekos.vercel.app
       └───────────┬────────────┘
                   │
                   ▼  REST API (/api/v1/search)
       ┌────────────────────────┐
       │    FastAPI Backend     │  https://seekos-x3ar.onrender.com
       └───────────┬────────────┘
                   │
                   ▼
       ┌────────────────────────┐
       │   SearchOrchestrator   │
       └───────────┬────────────┘
                   │
        ┌──────────┴──────────┐
        ▼                     ▼
┌──────────────┐      ┌──────────────┐
│  DuckDuckGo  │      │   SearXNG    │
│   Provider   │      │ (Optional)   │
└──────────────┘      └──────────────┘
        │                     │
        └──────────┬──────────┘
                   ▼
┌──────────────────────────────────────┐
│  Normalization & SafeSearch Filter   │
└──────────────────┬───────────────────┘
                   ▼
┌──────────────────────────────────────┐
│   Universal Relevance Ranking Engine │
└──────────────────┬───────────────────┘
                   ▼
┌──────────────────────────────────────┐
│       Standard SearchResponse       │
└──────────────────────────────────────┘
```

---

## 🚀 Quick Start (Local Development)

### Prerequisites
- Python 3.12+
- Node.js 20+ & npm
- *(Optional)* Docker & Docker Compose

### 1. Run with Docker Compose (Full Stack)

To run the frontend, backend, and a local SearXNG engine together:

```bash
docker compose up --build
```

- **Frontend**: [http://localhost:3000](http://localhost:3000)
- **API**: [http://localhost:8000](http://localhost:8000)
- **API Docs**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **SearXNG**: [http://localhost:8080](http://localhost:8080)

---

### 2. Run Manually for Local Development

#### Start Backend:
```bash
# Install Python dependencies
pip install -r requirements.txt

# Start FastAPI development server
uvicorn app.main:app --port 8000 --reload
```

#### Start Frontend:
```bash
cd frontend

# Install dependencies
npm install

# Start Next.js development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## ⚙️ Environment Variables

Create a `.env` file in the project root:

```env
APP_NAME=SeekOS
APP_VERSION=0.1.0
ENVIRONMENT=production

# Enabled search providers (comma-separated: duckduckgo, searxng)
ENABLED_PROVIDERS=duckduckgo

# SearXNG instance endpoint (if enabled)
SEARXNG_URL=http://localhost:8080
PROVIDER_TIMEOUT=5.0

# CORS Allowed Origins
CORS_ORIGINS=https://seekos.vercel.app,http://localhost:3000
```

Frontend `.env.local` (inside `./frontend`):
```env
NEXT_PUBLIC_API_BASE_URL=https://seekos-x3ar.onrender.com
```

---

## 🧪 Testing

Run backend unit and integration test suite:

```bash
python -m pytest
```

Build and lint frontend:

```bash
cd frontend
npm run build
npm run lint
```

---

## 📄 License

This project is open-source under the [MIT License](LICENSE).
