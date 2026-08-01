"""
Centralized configuration loaded from environment variables via pydantic-settings.

All settings are validated at startup; the application will refuse to start
if required values (e.g. GROQ_API_KEY) are missing.
"""

from functools import lru_cache
from typing import List

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application-wide settings sourced from .env / environment."""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
    )

    # ── Application ────────────────────────────────────
    APP_NAME: str = "AI Study Assistant"
    APP_VERSION: str = "0.1.0"
    DEBUG: bool = False

    # ── MySQL ──────────────────────────────────────────
    MYSQL_HOST: str = "localhost"
    MYSQL_PORT: int = 3306
    MYSQL_USER: str = "root"
    MYSQL_PASSWORD: str = ""
    MYSQL_DATABASE: str = "ai_study_assistant"

    # ── Groq API ─────────────────────────────────────
    GROQ_API_KEY: str = ""

    # ── CORS ───────────────────────────────────────────
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:5173",
        "https://final-project-eight-dusky.vercel.app",
    ]

    # ── Logging ────────────────────────────────────────
    LOG_LEVEL: str = "INFO"

    @property
    def DATABASE_URL(self) -> str:
        """Build a SQLAlchemy-compatible MySQL connection string."""
        return (
            f"mysql+pymysql://{self.MYSQL_USER}:{self.MYSQL_PASSWORD}"
            f"@{self.MYSQL_HOST}:{self.MYSQL_PORT}/{self.MYSQL_DATABASE}"
            "?charset=utf8mb4"
        )


@lru_cache
def get_settings() -> Settings:
    """Return a cached singleton of the application settings."""
    return Settings()
