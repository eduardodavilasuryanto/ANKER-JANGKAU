# Backend (the kitchen)

This folder is the FastAPI service for Jangkau.

Picture a school cafeteria kitchen. The map in `frontend/` is the lunch line window. This kitchen takes a lunch ticket (budget, work station, max commute), checks the scored menu sheet, and hands back ranked station cards with a filled-in sentence. It does not invent prices.

## Run

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

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
