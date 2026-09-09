# Frontend (the shop window)

This folder is the public WebGIS for Jangkau.

Picture a shop window on a busy street. People look through the glass (the map). They flip transparent sheets (the 7 layers). They fill a lunch ticket on the left (budget, work station, max commute). The kitchen in `backend/` cooks the shortlist. This folder never cooks the numbers. It only shows them.

## Run

```bash
npm install
npm run dev
```

Open `http://localhost:5173`. Vite proxies `/api` requests to the FastAPI service at port 8000 during local development. The bundled demonstration release can be viewed without the backend; start the backend to exercise the production recommendation route.

## Local environment

Vite reads frontend environment files from this directory. Copy `.env.example` to `.env.local` for local values:

```dotenv
VITE_MAPID_API_KEY=YOUR-DOMAIN-RESTRICTED-BROWSER-KEY
# Optional override when MAPID supplies a custom style URL.
VITE_MAPID_STYLE_URL=
VITE_API_BASE_URL=
VITE_RELEASE_MANIFEST_URL=
VITE_MAP_DEFAULT_CENTER_LNG=106.827
VITE_MAP_DEFAULT_CENTER_LAT=-6.261
VITE_MAP_DEFAULT_ZOOM=11
```

`VITE_*` variables are embedded in the browser build. Only place a MAPID credential here if MAPID explicitly issued it as a public, domain-restricted browser key. Never put a server-only credential in this file.

## Layout

| Path | Job |
| --- | --- |
| `index.html` | The frame of the window |
| `src/main.jsx` | Starts React and the shared Ant Design theme |
| `src/App.jsx` | Application shell, controls, recommendation UI, and detail views |
| `src/components/map/` | MapLibre + MAPID basemap and data overlays |
| `src/services/api.js` | Walks the ticket to the kitchen |
| `public/data/` | Small GeoJSON the map can load in the browser |

Basemap must be MAPID MAPS when the team key is in `.env`. The demo style is only a stand-in so the window opens on day one.
