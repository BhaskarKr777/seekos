from functools import lru_cache
from typing import Any

from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "SeekOS"
    app_version: str = "0.1.0"
    environment: str = "development"

    enabled_providers: list[str] = ["searxng"]
    searxng_url: str = "http://searxng:8080"
    provider_timeout: float = 5.0

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

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )


@lru_cache
def get_settings() -> Settings:
    return Settings()

