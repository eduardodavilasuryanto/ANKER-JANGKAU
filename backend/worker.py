"""Cloudflare Workers entrypoint for the FastAPI application."""

# pyrefly: ignore [missing-import]
from workers import asgi

from app.main import app

# Cloudflare discovers this ASGI adapter when it starts the Python Worker.
Default = asgi.entrypoint(app)
