# Backend Runtime Data

This folder is a **pointer**, not a second pantry. At runtime, the kitchen
reads the scored GeoJSON from here (or from `data/outputs/` at the repo root,
controlled by the `SCORED_GEOJSON_PATH` setting in `.env`).

Do not store raw data or duplicates here. The single source of truth for all
project data is the root `data/` folder. See `docs/GUIDEBOOK.md` section 3.4.
