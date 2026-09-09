# Backend (the kitchen)

This folder is the FastAPI service and Cloudflare Worker for Jangkau.

The service forwards searches to the AI/Data team's recommendation API and stores user accounts and saved searches in Cloudflare D1. It does not calculate competition scores itself.

## Run

```bash
uv sync --group dev
uv run uvicorn app.main:app --reload --port 8000
```

On Windows PowerShell, activate with `\.venv\Scripts\Activate.ps1` instead. From the repository root, `./scripts/dev.sh` starts this service and the frontend together on macOS/Linux; `./scripts/dev.ps1` does the same on Windows.

Open `http://localhost:8000/docs` to see the live menu of routes.

### Run with Cloudflare bindings

Install [uv 0.12.3 or later](https://docs.astral.sh/uv/) and use Python 3.13 or later. Fill in the D1 database ID in `wrangler.jsonc` only after creating the database in Cloudflare. Do not commit a real database ID to a public repository.

```bash
uv run pywrangler dev
```

`pywrangler dev` runs the FastAPI app in the Workers runtime, including the local D1 binding. Use it to test sign-in and saved-search routes. It does not create or deploy Cloudflare resources.

Set these secrets in the local Worker environment before testing a live recommendation request. The AI/Data team owns their values and response data.

```bash
AI_RECOMMENDATION_API_URL=https://api.example.com/recommend
AI_RECOMMENDATION_API_KEY=replace-with-the-team-owned-key
```

## Test

```powershell
python -m pytest -q
```

## Layout

| Path | Job |
| --- | --- |
| `app/main.py` | FastAPI application |
| `app/worker.py` | Cloudflare ASGI entrypoint |
| `app/api/v1/` | Route list, version 1 |
| `app/schemas/` | Shape of tickets in and cards out |
| `app/api/v1/endpoints/recommend.py` | Validated proxy to the AI/Data API |
| `tests/` | Taste tests before serving |
| `migrations/` | D1 schema migrations |
| `wrangler.jsonc` | Worker and D1 binding configuration |
