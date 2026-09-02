# Jangkau Development Guidebook

> This book is the single instruction manual for everyone who builds, tests,
> or ships code inside the ANKER-JANGKAU repository. Read it before you write
> your first line. Come back when you are not sure where a file belongs.
---

## Table of Contents

| Topic | Section |
| :--- | ---: |
| What Jangkau is (the product in one picture) | 1 |
| The house and its rooms (repo layout) | 2 |
| Complete folder tree | 3 |
| The four work streams explained | 4 |
| File naming law | 5 |
| Git workflow | 6 |
| How to set up your laptop | 7 |
| The daily work loop | 8 |
| How to add one feature | 9 |
| Rules for data (the pantry laws) | 10 |
| The recommend ticket and the reply card (API contract) | 11 |
| The 7 map sheets | 12 |
| Quality gates (when work is allowed to ship) | 13 |
| Deploy law (how the public link is born) | 14 |
| Team ownership | 15 |
| Forbidden list | 16 |
| Glossary (plain words) | 17 |
| Score formulas (do not change quietly) | A |
| File placement lookup table | B |

**Law 0.1.** One idea, one room, one name.
**Law 0.2.** If you cannot name the room, you are not ready to add the file.
**Law 0.3.** Numbers on the map come from the pantry and Saturday prep. The shop window does not invent numbers.

---

## 1. What Jangkau Is

Picture a kid who wants a house near a train station. The kid has three questions:

1. Can I pay the rent?
2. How long is the walk plus the train ride to work?
3. Will the street flood in January?

Jangkau is a **report card for each station area** on the KRL Bogor Line. The report card is one number from 0 to 100. A higher number means the area is a better fit for a tight budget, a fair commute, a fair food cost, and a lower flood risk.

The public site is a **shop window**. People look at a map. They flip 7 transparent sheets. They fill out a lunch ticket:

- Monthly rent budget (in rupiah)
- Work station (the KRL station they commute to)
- Maximum one-way commute in minutes

The **kitchen** (backend) checks the already scored sheet, throws out areas that break the ticket, sorts the rest from best score to worst, and fills in a sentence with real numbers. The kitchen does not make up a story.

The **Saturday prep** (pipeline) is the batch step that turns sealed jars of raw data into one scored GeoJSON sheet. This happens before the shop opens, not while a user waits.

---

## 2. The House and Its Rooms

### 2.1 The one-house rule

This repo is **one house with labeled rooms**. Frontend and backend live together on purpose.

Picture a toy house. The living room (map) and the kitchen (API) are in the same house so a visitor does not have to walk to a second address to get lunch. Data is the pantry. The pipeline is Saturday meal prep. Docs are the binder on the fridge.

We do **not** split this product into two GitHub repos. Two houses make two keys, two clocks, and two chances to get lost.

### 2.2 Room directory (top level)

| Room | Kid picture | Purpose |
| :--- | :--- | :--- |
| `frontend/` | Shop window | Browser code: map, 7 sheets, ticket form |
| `backend/` | Kitchen | FastAPI service: filter, rank, fill the sentence |
| `pipeline/` | Saturday meal prep | Batch scripts that build the scored sheet |
| `data/` | Pantry | Sealed jars, washed bowls, packed lunch |
| `docs/` | Fridge binder | This guidebook and contracts |
| `infra/` | Mailbox on the street | Host config (Vercel, redirects) |
| `scripts/` | Light switches | One-click setup and run on Windows |
| `.github/` | Doorbell rules | CI workflow, PR template, issue forms |

### 2.3 Placement function

Let `F` be a file you just made. Place `F` by the **first** matching row.

| # | If `F` is... | Then put `F` in... |
| ---: | :--- | :--- |
| 1 | A page, a map control, CSS, or a browser call to the kitchen | `frontend/` |
| 2 | A route, a ticket shape, or the ranking sentence | `backend/` |
| 3 | A script that builds scores **before** the shop opens | `pipeline/` |
| 4 | A notebook used to try an idea | `pipeline/notebooks/` |
| 5 | An original MAPID or survey dump | `data/raw/` |
| 6 | External data (OSM, KRL, InaRISK, BPS, SINI) | `data/external/` |
| 7 | A half-washed table | `data/interim/` |
| 8 | An analysis-ready table | `data/processed/` |
| 9 | The packed scored GeoJSON | `data/outputs/` |
| 10 | A small GeoJSON the browser must load | `frontend/public/data/` |
| 11 | A how-to, a contract, or a method note | `docs/` |
| 12 | A host config (Vercel or equal) | `infra/` |
| 13 | A one-click setup or run script | `scripts/` |
| 14 | A CI workflow, PR template, or issue form | `.github/` |

**Tie-break.** If two rows both fit, pick the row with the smaller number. Do not copy the file into both rooms unless section 10 says a small public copy is allowed.

### 2.4 What never lives in this house

| Object | Why it stays out | Where it really lives |
| :--- | :--- | :--- |
| Competition PDFs, KTM photos, proposal drafts | Office paper, not product code | PMO folders outside this repo |
| A filled `.env` | The club password | Your laptop only |
| Raw MAPID dumps on GitHub | Bulky and sealed | `data/raw/` on disk, ignored by git |
| A second `node_modules` or `.venv` at repo root | Each room has its own toolbox | `frontend/node_modules`, `backend/.venv` |

---

## 3. Complete Folder Tree

This is the full map of every room and shelf in the house. Items marked **(NEW)** were added during the September 2026 restructure.

`
ANKER-JANGKAU/
|
|-- frontend/                      Shop window (browser code)
|   |-- public/
|   |   |-- data/                  Small GeoJSON the browser fetches
|   |   |-- images/                Static images (logo, icons)
|   |-- src/
|   |   |-- assets/                Imported assets (bundled by Vite)
|   |   |-- components/
|   |   |   |-- layers/            7-sheet toggle controls
|   |   |   |-- map/               Map initialization and interaction
|   |   |   |-- recommend/         Ticket form and result cards
|   |   |   |-- ui/                Legend, popups, shared widgets
|   |   |-- config/                Default center, zoom, layer list
|   |   |-- services/              API calls to the kitchen
|   |   |-- styles/                CSS files
|   |   |-- utils/                 Pure helper functions (NEW)
|   |   |-- main.js                Entry point
|   |-- tests/                     Frontend tests
|   |-- index.html                 Window frame
|   |-- package.json               Node dependencies
|   |-- vite.config.js             Build and dev server config
|
|-- backend/                       Kitchen (FastAPI service)
|   |-- app/
|   |   |-- api/
|   |   |   |-- v1/
|   |   |       |-- endpoints/     Route handlers (health, recommend)
|   |   |       |-- router.py      Version 1 route collector
|   |   |-- core/                  Config, startup, shared settings
|   |   |-- schemas/               Pydantic models (ticket in, card out)
|   |   |-- services/              Business logic (engine, data_loader)
|   |   |-- __init__.py
|   |   |-- main.py                Kitchen door
|   |-- data/                      Runtime data pointer (not a second pantry)
|   |-- tests/                     Backend tests (pytest)
|   |-- pyproject.toml             Python project metadata
|   |-- requirements.txt           Backend dependencies
|
|-- pipeline/                      Saturday meal prep (batch processing)
|   |-- ingest/                    Step 1: fetch from MAPID, OSM, etc.
|   |-- clean/                     Step 2: wash raw points
|   |-- spatial/                   Step 3: spatial join
|   |-- models/                    Steps 4-5: hedonic model and scoring
|   |-- export/                    Step 6: pack scored GeoJSON
|   |-- notebooks/                 Scratch paper (numbered 01-, 02-)
|   |-- tests/                     Pipeline tests (NEW)
|   |-- requirements.txt           Pipeline dependencies (NEW)
|   |-- README.md                  Stage order and instructions
|
|-- data/                          Pantry (all project data)
|   |-- raw/                       Sealed jars (never edit)
|   |-- external/                  Store-bought (OSM, BPS, InaRISK)
|   |-- interim/                   Washed and chopped
|   |-- processed/                 Analysis-ready
|   |-- outputs/                   Packed lunch (scored GeoJSON)
|
|-- docs/                          Fridge binder
|   |-- GUIDEBOOK.md               This file
|
|-- infra/                         Host config
|   |-- vercel.json                Vercel rewrite rules
|
|-- scripts/                       Light switches
|   |-- setup.ps1                  One-time setup
|   |-- dev.ps1                    Start both rooms
|
|-- .github/                       Doorbell rules (NEW)
|   |-- workflows/
|   |   |-- ci.yml                 Lint backend, build frontend
|   |-- pull_request_template.md   PR checklist
|   |-- ISSUE_TEMPLATE/
|       |-- bug_report.md          Bug report form
|       |-- feature_request.md     Feature request form
|
|-- .editorconfig                  Editor formatting rules
|-- .env.example                   Blank password card
|-- .gitattributes                 Line ending rules
|-- .gitignore                     What git must ignore
|-- CONTRIBUTING.md                How to send a change
|-- README.md                      The sign on the front lawn
`

**Law 3.1.** If a folder is not in this tree, ask the team before creating it.
**Law 3.2.** If this tree and section 2.3 ever disagree, section 2.3 wins. Update this tree in the same pull request.

---

## 4. The Four Work Streams

### 4.1 Frontend: the shop window

**Path:** `frontend/`
**Job:** Show the map, the 7 sheets, the form, the cards.
**Stack:** Vite, HTML, CSS, vanilla JavaScript, MapLibre GL JS, MAPID MAPS basemap.

Picture a shop window with 7 overhead projector sheets. Each sheet answers one question. The kid can turn a sheet on or off. Clicking a colored area opens a card with numbers. The left panel is the lunch ticket form.

| Path | Job |
| :--- | :--- |
| `index.html` | The window frame |
| `src/main.js` | Turns the lights on |
| `src/components/map/` | The glass pane (MapLibre instance) |
| `src/components/layers/` | The 7 toggle sheets |
| `src/components/recommend/` | Ticket form and result cards |
| `src/components/ui/` | Legend, header bits, popups |
| `src/config/` | Default center, zoom, layer list, constants |
| `src/services/api.js` | Walks the ticket to the kitchen |
| `src/styles/` | All CSS files |
| `src/utils/` | Pure helper functions (formatting, color math) |
| `src/assets/` | Images and files bundled by Vite |
| `public/data/` | Small GeoJSON the browser may fetch directly |
| `tests/` | Frontend tests |

**Law 4.1.** The shop window may **display** a number. It may not **compute** the composite score.
**Law 4.2.** MAPID MAPS is the required basemap. The demo style in code is a cardboard stand-in for day one.
**Law 4.3.** Keep this window as plain web files plus MapLibre. Do not add a heavy extra library unless the whole team agrees in writing.

### 4.2 Backend: the kitchen

**Path:** `backend/`
**Job:** Take a ticket, return ranked cards with filled sentences.
**Stack:** Python 3.11+, FastAPI, Pydantic, uvicorn.

Picture a cafeteria kitchen. A kid slides a ticket under the glass. The cook does **not** taste a new recipe on the spot. The cook already has a scored menu from Saturday. The cook:

1. Drops rows where rent is greater than the budget
2. Drops rows where commute is greater than the max commute
3. Sorts remaining rows by `composite_score` from high to low
4. Fills a sentence template with each row's real numbers

| Path | Job |
| :--- | :--- |
| `app/main.py` | Kitchen door (FastAPI app) |
| `app/api/v1/` | Version 1 of the menu (routes) |
| `app/schemas/` | Shape of the ticket and the card (Pydantic models) |
| `app/services/engine.py` | Filter, sort, fill the sentence |
| `app/services/data_loader.py` | Read the scored sheet into memory |
| `app/core/config.py` | Settings loaded from `.env` |
| `tests/` | Taste tests (pytest) |

**Law 4.4.** Runtime AI is rule-based. No free chatbot. No invented prices.
**Law 4.5.** If a number is missing, say the standard line: "Primary data is thin. This estimate used spatial interpolation." Do not guess a pretty number.
**Law 4.6.** The kitchen reads a single scored GeoJSON. It does not run a database query or call a third-party API at request time.

### 4.3 Pipeline: Saturday meal prep

**Path:** `pipeline/`
**Job:** Turn sealed jars into one scored GeoJSON **before** the shop opens.

Picture a family chopping vegetables on Saturday. Monday breakfast is then a 2-minute plate, not a 2-hour cook. Users must not wait while we grind a hedonic model.

| Step | Folder | Script | Input | Output |
| ---: | :--- | :--- | :--- | :--- |
| 1 | `ingest/` | `01_fetch_mapid.py` | MAPID APIs, OSM, KRL, InaRISK | `data/raw/`, `data/external/` |
| 2 | `clean/` | `02_clean_points.py` | Raw points | `data/interim/points_clean.*` |
| 3 | `spatial/` | `03_spatial_join.py` | Clean points + isochrones | `data/interim/points_joined.*` |
| 4 | `models/` | `04_hedonic.py` | Joined points | Model coefficients |
| 5 | `models/` | `05_score.py` | Joined catchments + coefficients | `data/processed/catchments_scored.*` |
| 6 | `export/` | `06_export_geojson.py` | Processed catchments | `data/outputs/jangkau_bogor_line_scored.geojson` |

Run order matters. Do not skip a step. Do not run step 5 before step 4.

**Law 4.7.** Notebooks are scratch paper. Stable logic moves into a numbered `.py` script in the correct stage folder.
**Law 4.8.** The shop window and the kitchen never import a notebook.
**Law 4.9.** Pipeline dependencies are listed in `pipeline/requirements.txt`. Install them in a separate virtual environment or share the backend's `.venv`.

### 4.4 Data: the pantry

**Path:** `data/`

| Shelf | Kid picture | Rule |
| :--- | :--- | :--- |
| `raw/` | Sealed lunchbox | Never open to "fix" a value |
| `external/` | Store-bought flour | Same freeze rule as raw |
| `interim/` | Washed and chopped | OK to rewrite as the recipe improves |
| `processed/` | Mixed batter | Analysis-ready |
| `outputs/` | Packed lunch | The scored GeoJSON both rooms eat |

**Law 4.10.** Git keeps the shelves and the labels. Git does not keep the groceries. See `.gitignore` for the full list of ignored data files.
**Law 4.11.** `backend/data/` is a **runtime pointer**, not a second pantry. The single source of truth for project data is the root `data/` folder.

---

## 5. File Naming Law

| Situation | Pattern | Example |
| :--- | :--- | :--- |
| Regular JavaScript source | `camelCase.js` | `createMap.js`, `layerPanel.js` |
| Regular Python source | `snake_case.py` | `data_loader.py`, `config.py` |
| Config or manifest | `lowercase.ext` | `package.json`, `pyproject.toml` |
| Markdown documents | `UPPER_OR_TITLE.md` | `GUIDEBOOK.md`, `README.md` |
| Pipeline scripts | `NN_description.py` (two-digit prefix) | `01_fetch_mapid.py` |
| Notebooks | `NN-description.ipynb` (two-digit prefix) | `01-explore-properti.ipynb` |
| Dated files | `YYYY-MM-DD_description` (ISO date) | `2026-09-01_survey_log.md` |
| Environment files | `.env.example` committed, `.env` ignored | |

**Law 5.1.** JavaScript uses `camelCase` file names. Python uses `snake_case`.
**Law 5.2.** Pipeline scripts are numbered in execution order. Gaps are fine (01, 02, 03 then 06).
**Law 5.3.** No spaces in file names. Use hyphens or underscores.
**Law 5.4.** No `final_final_v3` files. Archive superseded files in the PMO `99-archive` folder, outside this repo.

---

## 6. Git Workflow

### 6.1 Branch model

`
main                     the public-ready trunk
  |-- feat/short-name    new feature
  |-- fix/short-name     bug fix
  |-- docs/short-name    documentation only
`

### 6.2 Daily flow

`
1. git checkout main
2. git pull
3. git checkout -b feat/short-name
4. ... make changes in ONE room ...
5. git add -p                       (stage carefully)
6. git commit -m "add layer toggle for flood risk"
7. git push -u origin feat/short-name
8. Open a pull request using the template
`

### 6.3 Commit rules

| Rule | Example |
| :--- | :--- |
| Present tense | "add flood layer" not "added flood layer" |
| English | "fix budget validation" not "perbaiki validasi" |
| One idea per commit | Do not mix a CSS fix and a new endpoint |
| Small commits | If a diff is over 300 lines, split it |

**Law 6.1.** Never push directly to `main`. Always use a branch and a pull request.
**Law 6.2.** Never commit `.env`, API keys, raw data dumps, or `node_modules`.
**Law 6.3.** The `.github/pull_request_template.md` auto-fills when you open a PR. Fill every checkbox honestly.

---

## 7. How to Set Up Your Laptop

### 7.1 Prerequisites

| Tool | Minimum version | Check command |
| :--- | :--- | :--- |
| Python | 3.11 | `python --version` |
| Node.js | 20 | `node --version` |
| npm | 10 | `npm --version` |
| Git | 2.40 | `git --version` |

### 7.2 One-time setup

`powershell
git clone https://github.com/YOUR-ORG/ANKER-JANGKAU.git
cd ANKER-JANGKAU
.\scripts\setup.ps1
`

The setup script does three things:

1. Copies `.env.example` to `.env` (fill in MAPID keys later)
2. Creates `backend/.venv` and installs Python dependencies
3. Runs `npm install` inside `frontend/`

### 7.3 Start developing

`powershell
.\scripts\dev.ps1
`

This opens two windows:

| Window | Address | What it runs |
| :--- | :--- | :--- |
| Kitchen | http://localhost:8000/docs | FastAPI with auto-reload |
| Shop window | http://localhost:5173 | Vite dev server |

The Vite dev server proxies `/api` requests to the backend. You do not need to worry about CORS during local development.

### 7.4 Pipeline setup (if you work on data)

`powershell
cd pipeline
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
`

The pipeline has its own `requirements.txt` because it needs heavy geospatial libraries (geopandas, statsmodels, shapely) that the backend does not need.

---

## 8. The Daily Work Loop

Think of a school day: arrive, pick up your assignment, work, clean up, leave.

`
1. Pull main             git checkout main && git pull
2. Branch off             git checkout -b feat/my-task
3. Open the right room    cd frontend  OR  cd backend
4. Run the dev server     (already running from dev.ps1)
5. Write code             one idea at a time
6. Test                   pytest -q  OR  npm run build
7. Commit                 git add -p && git commit -m "..."
8. Push and PR            git push -u origin feat/my-task
`

**Law 8.1.** Work in one room at a time unless a change in one room forces a matching change in another (for example, adding a field to the ticket requires touching both `backend/app/schemas/` and `frontend/src/services/api.js`).

---

## 9. How to Add One Feature

This is a step-by-step recipe. Replace the bracketed words with your actual feature.

| Step | Action | Example |
| ---: | :--- | :--- |
| 1 | Check placement function (section 2.3) | "This is a new map layer, so it goes in `frontend/src/components/layers/`" |
| 2 | Branch off main | `git checkout -b feat/flood-layer` |
| 3 | Write the code | Create `floodLayer.js` |
| 4 | Write or update a test | Add a unit test or check the build |
| 5 | Run the gate | `npm run build` passes |
| 6 | Commit with a clear message | `git commit -m "add flood risk layer toggle"` |
| 7 | Push and open a PR | Fill the PR template, check every box |
| 8 | Ask a teammate to review | At least one approval before merge |

**Law 9.1.** No feature ships without passing the quality gate for its room (section 13).
**Law 9.2.** If the feature changes the API contract (section 11), update this guidebook in the same pull request.

---

## 10. Rules for Data (The Pantry Laws)

### 10.1 The five shelves

| Shelf | Analogy | Mutable? | Tracked by git? |
| :--- | :--- | :---: | :---: |
| `data/raw/` | Sealed lunchbox from the store | No | No (just `.gitkeep`) |
| `data/external/` | Flour bought at the supermarket | No | No (just `.gitkeep`) |
| `data/interim/` | Chopped vegetables | Yes | No |
| `data/processed/` | Mixed batter ready for the oven | Yes | No |
| `data/outputs/` | Packed lunch ready to serve | Yes | No (small ones may be committed) |

**Law 10.1 (sealed jar).** Never edit or overwrite anything in `data/raw/` or `data/external/`. If the raw data has errors, fix them in the pipeline and write the clean version to `data/interim/`. The raw file stays exactly as it arrived.

**Law 10.2 (one-way flow).** Data flows left to right: `raw` then `interim` then `processed` then `outputs`. Never write backwards.

**Law 10.3 (public copy).** A small scored GeoJSON (under 5 MB) may be copied to `frontend/public/data/` so the map loads it. This is the only allowed duplication. The copy is a read-only snapshot, not a second source of truth.

### 10.2 Wash bounds

Every point must pass these filters before it moves past `interim/`:

| Dataset | Keep a row only if |
| :--- | :--- |
| Property Go | `100,000 <= rent <= 50,000,000` |
| Menu Go | `1,000 <= food_price <= 200,000` |
| Struk Go | `1,000 <= amount <= 5,000,000` |
| Any point | longitude in `[106.5, 107.5]`, latitude in `[-6.8, -6.0]`, not `(0, 0)` |

**Law 10.4 (photos become numbers).** Listing and receipt photos are converted to numeric attributes. We do not store personal data. We do not publish raw receipts.

**Law 10.5 (GitHub is not a hard drive).** Bulk GIS files (`.gpkg`, `.shp`, `.tif`) stay on disk. They are listed in `.gitignore`. Only small, scored outputs may be committed.

---

## 11. API Contract (The Lunch Ticket)

**Route:** `POST /api/v1/recommend`
**Time budget:** Reply in under 800 milliseconds when the scored sheet is in memory.

### 11.1 Ticket in (request body)

`json
{
  "budget": 1800000,
  "work_station": "Tebet",
  "max_commute": 35
}
`

| Field | Type | Bounds |
| :--- | :--- | :--- |
| `budget` | integer, IDR per month | 100,000 to 50,000,000 |
| `work_station` | string | 2 to 80 characters |
| `max_commute` | integer, minutes | 5 to 180 |

### 11.2 Filter and sort logic

Keep a catchment `c` only if both conditions are true:

`
c.avg_rent           <=  budget
c.total_commute_time <=  max_commute
`

Sort kept rows by `composite_score` descending (highest first).

### 11.3 Sentence templates

Let `S` be the `composite_score`.

| Condition | Sentence to fill |
| :--- | :--- |
| `S >= 75` | "Station area [Name]: strongly recommended (score [S]). Estimated kos rent Rp[rent]/month ([pct]% under your budget). Total travel time to [work] is about [Y] minutes. Flood risk is [Z]." |
| `50 <= S < 75` | "Station area [Name]: fairly reachable (score [S]). Estimated kos rent Rp[rent]/month. Travel time to work is about [Y] minutes. Flood risk is [Z]." |
| `S < 50` | "Station area [Name]: less efficient (score [S]). Rent or daily living cost is high for this budget. Travel time is [Y] minutes." |

Every square bracket is a real field from the scored sheet. If a field was spatially interpolated, append: "Primary data is thin. This estimate used spatial interpolation."

### 11.4 Scored GeoJSON properties

File: `data/outputs/jangkau_bogor_line_scored.geojson`

| Property | Type | Meaning |
| :--- | :--- | :--- |
| `station_id` | string | Stable station code |
| `station_name` | string | Display name |
| `isochrone_min` | integer | 15, 30, or 45 |
| `avg_rent` | float | Mean kos rent, IDR per month |
| `avg_food_price` | float | Mean food price per portion, IDR |
| `avg_daily_spend` | float | Mean daily spend, IDR |
| `flood_risk_score` | float | 0.0, 0.5, or 1.0 |
| `station_premium_rate` | float | Hedonic coefficient b1, IDR per minute |
| `composite_score` | float | 0.0 to 100.0 |
| `hotspot_cluster` | string | High-High, Low-Low, or Not Significant |
| `data_source` | string | `primary` or `interpolated` |
| `last_updated` | string | ISO 8601 date |
| `total_commute_time` | float | Minutes from this catchment to work station |

---

## 12. The 7 Transparent Sheets

Picture 7 clear pages stacked on a light box. The bottom page is the land. The top page is the shortlist glow.

| Order | Sheet name | User sees | Default state |
| ---: | :--- | :--- | :--- |
| 1 | Catchments | 15 / 30 / 45 minute walk-and-ride bowls | On |
| 2 | Affordability score | Green to red report cards | On |
| 3 | Station premium | How rent changes with extra minutes | Off |
| 4 | Daily living cost | Food and receipt cost per bowl | Off |
| 5 | Flood risk | Hazard overlay | Off |
| 6 | KRL line and stations | Tracks and dots | On |
| 7 | AI shortlist | Bowls that passed the ticket | Off (turns on after search) |

**Law 12.1.** Each sheet can be turned off alone.
**Law 12.2.** Clicking a bowl opens a card: rent, food, commute, flood, data source.
**Law 12.3.** Isochrones are "how far before the bell rings," not "a circle drawn with a ruler." They follow real walking and transit networks.

---

## 13. Quality Gates

A change may merge only if the matching gates are green.

| Room | Gate command | What it checks |
| :--- | :--- | :--- |
| `backend/` | `python -m pytest -q` | All backend tests pass |
| `frontend/` | `npm run build` | Build completes without errors |
| `frontend/` | Manual check | Looks correct on desktop and a phone-wide window |
| `pipeline/` | Run the script | Writes to the right shelf; a sample row prints correctly |
| Any scored number | Peer review | A second person can retell how the number was born |

**Law 13.1 (feature freeze).** After 11 September 2026, only bug fixes and documentation land on `main`. No new features.
**Law 13.2 (page load).** The public map should open in under 3 seconds on a phone once layers are pre-cooked.
**Law 13.3 (API speed).** The `/recommend` endpoint replies in under 800 milliseconds.
**Law 13.4 (CI).** The `.github/workflows/ci.yml` runs backend tests and frontend build on every push and pull request to `main`. A red CI means the PR cannot merge.

---

## 14. Deploy Law

**Law 14.1.** The shop window is public HTTPS (Vercel, Netlify, or equal).
**Law 14.2.** The kitchen can be a small cloud function or a container. It reads the scored sheet from disk or a CDN. It does not need a live database at request time.
**Law 14.3.** Keys live in the host's secret manager, not in git.
**Law 14.4.** Deploy a thin window early (Milestone 6). Do not wait for perfect scores to put a URL on the street.
**Law 14.5.** The `infra/vercel.json` file controls path rewrites. API calls from the browser hit `/api/*` and Vercel proxies them to the backend.

---

## 15. Team Ownership

| Room | First owner | Backup |
| :--- | :--- | :--- |
| `frontend/` | WebGIS Developer | UI/UX Designer |
| `backend/` | WebGIS Developer | AI/Data Analyst |
| `pipeline/` and `data/` | AI/Data Analyst | WebGIS Developer |
| `docs/` | Project Lead | Business Analyst |
| `infra/` | WebGIS Developer | Project Lead |
| `.github/` | Project Lead | WebGIS Developer |

The full RACI matrix for the whole product lives in the PMO playbook. This table is only for **this repo**.

---

## 16. Forbidden List

These are the things you must not do in this repo. Think of them as the fire safety rules of the house.

1. Do not cook scores in the browser.
2. Do not open a free chatbot on the public site.
3. Do not edit sealed jars in `data/raw/` or `data/external/`.
4. Do not commit `.env` or API keys.
5. Do not add ArcGIS or any proprietary GIS tool. Analysis tools are open source only.
6. Do not expand to other KRL lines during the competition window.
7. Do not add a native Android or iOS app.
8. Do not add payments, booking, or live train tracking.
9. Do not rename rooms (`frontend`, `backend`, `pipeline`, `data`) without a written team decision.
10. Do not leave `final_final_v3` files. Archive in the PMO `99-archive` folder, outside this repo.
11. Do not push directly to `main`. Always use a branch and a pull request.
12. Do not add a heavy JavaScript framework (React, Vue, Angular) without written team agreement. The shop window is vanilla JS plus MapLibre.

---

## 17. Glossary (Plain Words)

| Word you will see | Kid picture | Precise meaning in this project |
| :--- | :--- | :--- |
| Monorepo | One toy house | Frontend, backend, pipeline, and data in one git repo |
| Frontend | Shop window | Files the browser runs (HTML, CSS, JS) |
| Backend | Kitchen | FastAPI service that answers tickets |
| Pipeline | Saturday prep | Batch scripts that build the scored sheet before users arrive |
| Isochrone | How far before the bell rings | A polygon showing equal travel time: 15, 30, or 45 minutes |
| Catchment | The bowl around a station | One isochrone polygon for one station |
| Composite score | Report card | One number from 0 to 100 per catchment |
| Hedonic model | Price tag with reasons | A math formula that explains rent by time, size, and type |
| Rule engine | Cookie cutter | Filter, sort, fill a sentence. No free story. |
| GeoJSON | Coloring-book outlines with notes | Geographic shapes plus property fields in a standard format |
| `.env` | Club password | A local secrets file, never committed to git |
| CI | Doorbell camera | A robot that checks your code before it enters the house |
| PR (pull request) | Permission slip | A request to merge your branch into main |
| Vite | Fast oven | The tool that bundles and serves the frontend files |
| FastAPI | Express kitchen | The Python framework that runs the backend |
| MapLibre | Map glass | The open-source library that draws the map in the browser |
| MAPID MAPS | Official street view | The required basemap from the competition platform |
| Pydantic | Ticket inspector | The library that checks ticket shape and data types |

---

## Appendix A. Score Formulas (Do Not Change Quietly)

### A.1 Rent model (hedonic regression)

`
rent = b0 + b1 * travel_time + b2 * size + b3 * kos_flag + b4 * house_flag + e
`

| Symbol | Meaning |
| :--- | :--- |
| `b0` | Base rent (intercept) |
| `b1` | Station premium: how much rent changes per extra minute of travel |
| `b2` | Size premium: how much rent changes per square meter |
| `b3` | Kos discount: adjustment for boarding house type |
| `b4` | House premium: adjustment for standalone house type |
| `e` | Error term (what the model cannot explain) |

### A.2 Composite score (0 to 100)

`
score = 0.40 * rent_score
      + 0.30 * time_score
      + 0.20 * living_cost_score
      - 0.10 * flood_penalty
`

| Component | Range | High is... |
| :--- | :--- | :--- |
| `rent_score` | 0 to 100 | More affordable |
| `time_score` | 0 to 100 | Shorter commute |
| `living_cost_score` | 0 to 100 | Lower daily costs |
| `flood_penalty` | 0 to 10 | Higher flood risk (subtracted) |

**Law A.1.** Weights move only with a written team decision. Any code change must match this appendix. Any appendix change must match the code. Update both in the same pull request.

---

## Appendix B. File Placement Lookup

This is a quick-reference version of section 2.3. If you just made something and need to know where it goes, scan this table.

| You just made... | Put it in... |
| :--- | :--- |
| A MapLibre layer toggle | `frontend/src/components/layers/` |
| Recommend form or card CSS | `frontend/src/styles/` |
| A helper function (format, color, math) | `frontend/src/utils/` |
| A call to `/api/v1/recommend` | `frontend/src/services/api.js` |
| A popup or legend widget | `frontend/src/components/ui/` |
| A new ticket field | `backend/app/schemas/recommend.py` plus a test |
| A new ranking rule | `backend/app/services/engine.py` plus a test |
| A MAPID download script | `pipeline/ingest/` |
| A point wash script | `pipeline/clean/` |
| An isochrone join | `pipeline/spatial/` |
| A hedonic, IDW, or Gi* model | `pipeline/models/` |
| A scored GeoJSON export | `pipeline/export/` then `data/outputs/` |
| An original CSV from MAPID | `data/raw/` (not tracked by git) |
| A how-to paragraph | `docs/` |
| A Vercel rewrite rule | `infra/` |
| A CI workflow or issue template | `.github/` |

If this table and section 2.3 ever disagree, section 2.3 wins. Update this table in the same pull request.

---

*Last updated: 2026-09-03. Maintainer: Project Lead.*
