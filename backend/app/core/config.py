import os
from functools import lru_cache
from pathlib import Path

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


BACKEND_DIR = Path(__file__).resolve().parents[2]

ENV_FILES_BY_APP_ENV = {
    "development": ".env.dev",
    "dev": ".env.dev",
    "local": ".env.dev",
    "uat": ".env.uat",
    "staging": ".env.uat",
    "production": ".env.prod",
    "prod": ".env.prod",
}


def resolve_env_files() -> tuple[Path, Path]:
    """Return dotenv files loaded by Settings, in override order.

    `.env` is kept for backward compatibility. The selected environment file
    (`.env.dev`, `.env.uat`, or `.env.prod`) is loaded after `.env`, so it can
    override shared/default values.
    """
    default_env_file = BACKEND_DIR / ".env"

    explicit_env_file = os.getenv("ENV_FILE")
    if explicit_env_file:
        selected_env_file = Path(explicit_env_file)
        if not selected_env_file.is_absolute():
            selected_env_file = BACKEND_DIR / selected_env_file

        return (default_env_file, selected_env_file)

    app_env = os.getenv("APP_ENV", "development").strip().lower()
    selected_env_file_name = ENV_FILES_BY_APP_ENV.get(app_env, ".env.dev")
    return (default_env_file, BACKEND_DIR / selected_env_file_name)


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    app_name: str = Field(default="Household Maintenance Tracker API", alias="APP_NAME")
    app_env: str = Field(default="development", alias="APP_ENV")
    api_v1_prefix: str = Field(default="/api/v1", alias="API_V1_PREFIX")
    backend_cors_origins: str = Field(default="http://localhost:5173", alias="BACKEND_CORS_ORIGINS")
    mongodb_uri: str = Field(default="mongodb://localhost:27017", alias="MONGODB_URI")
    mongodb_database: str = Field(default="household_tracker_dev", alias="MONGODB_DATABASE")
    mongodb_server_selection_timeout_ms: int = Field(default=2000, alias="MONGODB_SERVER_SELECTION_TIMEOUT_MS")

    model_config = SettingsConfigDict(env_file=resolve_env_files(), env_file_encoding="utf-8", extra="ignore")

    @property
    def cors_origins(self) -> list[str]:
        """Return configured frontend origins as a clean list for CORS middleware."""
        return [origin.strip() for origin in self.backend_cors_origins.split(",") if origin.strip()]


@lru_cache
def get_settings() -> Settings:
    """Return cached application settings so configuration is loaded once."""
    return Settings()


settings = get_settings()