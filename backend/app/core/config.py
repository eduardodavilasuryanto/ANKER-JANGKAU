from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict

# Only load the .env file when it actually exists (not in Cloudflare Workers).
_env_file = Path(".env") if Path(".env").exists() else None


class Settings(BaseSettings):
    app_name: str = "Jangkau API"
    app_env: str = "development"
    app_host: str = "0.0.0.0"
    app_port: int = 8000
    ai_recommendation_api_url: str = ""
    ai_recommendation_api_key: str = ""

    model_config = SettingsConfigDict(
        env_file=_env_file,
        env_file_encoding="utf-8",
        extra="ignore",
    )


settings = Settings()
