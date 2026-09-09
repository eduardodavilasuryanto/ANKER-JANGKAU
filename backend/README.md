# Backend (the kitchen)

This folder is the FastAPI service for Jangkau.

Picture a school cafeteria kitchen. The map in `frontend/` is the lunch line window. This kitchen takes a lunch ticket (budget, work station, max commute), checks the scored menu sheet, and hands back ranked station cards with a filled-in sentence. It does not invent prices.

## Run

```bash
python3 -m venv .venv
source .venv/bin/activate
python -m pip install -r requirements.txt
python -m uvicorn app.main:app --reload --port 8000
```

On Windows PowerShell, activate with `\.venv\Scripts\Activate.ps1` instead. From the repository root, `./scripts/dev.sh` starts this service and the frontend together on macOS/Linux; `./scripts/dev.ps1` does the same on Windows.

Open `http://localhost:8000/docs` to see the live menu of routes.

## Test

```powershell
python -m pytest -q
```

## Layout

| Path | Job |
| --- | --- |
| `app/main.py` | Door of the kitchen |
| `app/api/v1/` | Route list, version 1 |
| `app/schemas/` | Shape of tickets in and cards out |
| `app/services/engine.py` | Filter, sort, fill the sentence |
| `app/services/data_loader.py` | Read the scored GeoJSON sheet |
| `tests/` | Taste tests before serving |
