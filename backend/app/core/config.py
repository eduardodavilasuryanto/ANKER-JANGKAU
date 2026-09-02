from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "Jangkau API"
    app_env: str = "development"
    app_host: str = "0.0.0.0"
    app_port: int = 8000
    scored_geojson_path: str = "../data/outputs/jangkau_bogor_line_scored.geojson"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )


settings = Settings()
