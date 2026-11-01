from functools import lru_cache
from typing import Any

from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "SeekOS"
    app_version: str = "0.1.0"
    environment: str = "development"

    # Local development works without Docker. Docker Compose enables SearXNG
    # explicitly while retaining DuckDuckGo as a resilient fallback.
    enabled_providers: list[str] = ["duckduckgo"]
    # Docker Compose overrides this with the service hostname.  Local development
    # talks to a locally exposed SearXNG port instead.
    searxng_url: str = "http://localhost:8080"
    provider_timeout: float = 5.0
    cors_origins: list[str] = ["http://localhost:3000"]

    database_url: str = "postgresql+psycopg://seekos:seekos@postgres:5432/seekos"
    redis_url: str = "redis://redis:6379/0"

    @field_validator("enabled_providers", mode="before")
    @classmethod
    def parse_enabled_providers(cls, v: Any) -> list[str]:
        if isinstance(v, str):
            if v.startswith("[") and v.endswith("]"):
                import json
                try:
                    return json.loads(v)
                except Exception:
                    pass
            return [p.strip() for p in v.split(",") if p.strip()]
        return v

    @field_validator("cors_origins", mode="before")
    @classmethod
    def parse_cors_origins(cls, v: Any) -> list[str]:
        if isinstance(v, str):
            if v.startswith("[") and v.endswith("]"):
                import json
                try:
                    return json.loads(v)
                except json.JSONDecodeError:
                    pass
            return [origin.strip() for origin in v.split(",") if origin.strip()]
        return v

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )


@lru_cache
def get_settings() -> Settings:
    return Settings()

