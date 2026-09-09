# Jangkau (Worth the Ride)

Public WebGIS for Team **Anker**, MAPID WebGIS Competition 2026.

Jangkau scores Bogor Line station areas on one 0 to 100 report card: rent, commute time, daily living cost, and flood risk. The map is the shop window. The FastAPI service is the kitchen. The pipeline cooks scores before the shop opens.

## Run locally

Install Node.js 20+ and Python 3.11+. The local prototype works with its bundled demonstration data; a live MAPID basemap and production data release need their team-owned configuration.

### macOS and Linux

```bash
./scripts/setup.sh
./scripts/dev.sh
```

### Windows PowerShell

```powershell
.\scripts\setup.ps1
.\scripts\dev.ps1
```

`dev.sh` keeps both services in one terminal. `dev.ps1` opens one PowerShell window for each service.

### Run each service manually

Use this when you want separate terminals or need to inspect one service at a time.

```bash
# Terminal 1: FastAPI
cd backend
python3 -m venv .venv
source .venv/bin/activate
python -m pip install -r requirements.txt
python -m uvicorn app.main:app --reload --port 8000
```

```bash
# Terminal 2: React + Vite
cd frontend
npm install
npm run dev
```

| Room | Local address |
| --- | --- |
| Shop window (`frontend/`) | http://localhost:5173 |
| Kitchen docs (`backend/`) | http://localhost:8000/docs |

For a real MAPID basemap, create `frontend/.env.local` and set `VITE_MAPID_STYLE_URL` to the approved MAPID MapLibre style URL. See [frontend/README.md](frontend/README.md) for the full environment-variable reference.

## House map

```
frontend/     map, 7 layers, recommend form   (WebGIS Developer, UI/UX)
backend/      POST /api/v1/recommend          (WebGIS Developer)
pipeline/     ingest, clean, join, score      (AI / Data)
data/         pantry: raw is sealed           (AI / Data)
docs/         this team's how-to              (Project Lead)
infra/        public host config              (WebGIS Developer)
scripts/      Windows setup and run           (all)
```

## Product rules (short)

- One repo for frontend and backend. Do not split the house.
- The browser displays numbers. It does not invent the composite score.
- Recommend is a rule engine: filter, rank, fill a sentence. No free chatbot.
- Raw data is frozen. Washed copies go forward, never back.
- MAPID MAPS is the required basemap. Host the public link on HTTPS.

Full placement law, API contract, layer list, and score formulas: **[docs/GUIDEBOOK.md](docs/GUIDEBOOK.md)**.  
How to send a change: **[CONTRIBUTING.md](CONTRIBUTING.md)**.

## Team

Anker (Anak Kereta). Lead: Eduardo Davila Suryanto.

Competition office files (proposal, survey forms, member proofs) live in the PMO tree, not in this code house.
