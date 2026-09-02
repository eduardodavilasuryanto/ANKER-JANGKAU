# Jangkau (Worth the Ride)

Public WebGIS for Team **Anker**, MAPID WebGIS Competition 2026.

Jangkau scores Bogor Line station areas on one 0 to 100 report card: rent, commute time, daily living cost, and flood risk. The map is the shop window. The FastAPI service is the kitchen. The pipeline cooks scores before the shop opens.

## Start here

1. Read **[docs/GUIDEBOOK.md](docs/GUIDEBOOK.md)**. That is the development book for this house.
2. Copy `.env.example` to `.env`.
3. Run setup, then run both rooms:

```powershell
.\scripts\setup.ps1
.\scripts\dev.ps1
```

| Room | Local address |
| --- | --- |
| Shop window (`frontend/`) | http://localhost:5173 |
| Kitchen docs (`backend/`) | http://localhost:8000/docs |

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
