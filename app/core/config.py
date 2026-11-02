import json
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
    enabled_providers: list[str] | str = ["duckduckgo"]
    # Docker Compose overrides this with the service hostname.  Local development
    # talks to a locally exposed SearXNG port instead.
    searxng_url: str = "http://localhost:8080"
    provider_timeout: float = 5.0
    cors_origins: list[str] | str = ["http://localhost:3000"]

    database_url: str = "postgresql+psycopg://seekos:seekos@postgres:5432/seekos"
    redis_url: str = "redis://redis:6379/0"

    @field_validator("enabled_providers", "cors_origins", mode="after")
    @classmethod
    def normalize_str_or_list(cls, v: Any) -> list[str]:
        if isinstance(v, str):
            v = v.strip()
            if v.startswith("[") and v.endswith("]"):
                try:
                    return json.loads(v)
                except Exception:
                    pass
            return [x.strip() for x in v.split(",") if x.strip()]
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

