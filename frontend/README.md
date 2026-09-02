# Frontend (the shop window)

This folder is the public WebGIS for Jangkau.

Picture a shop window on a busy street. People look through the glass (the map). They flip transparent sheets (the 7 layers). They fill a lunch ticket on the left (budget, work station, max commute). The kitchen in `backend/` cooks the shortlist. This folder never cooks the numbers. It only shows them.

## Run

```powershell
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`. Start the backend on port 8000 first if you want the recommend button to work.

## Layout

| Path | Job |
| --- | --- |
| `index.html` | The frame of the window |
| `src/main.js` | Starts the map, panels, and legend |
| `src/components/map/` | The glass: MapLibre + MAPID basemap |
| `src/components/layers/` | The 7 transparent sheets |
| `src/components/recommend/` | The lunch-ticket form and result cards |
| `src/components/ui/` | Header pieces, legend, popups |
| `src/services/api.js` | Walks the ticket to the kitchen |
| `public/data/` | Small GeoJSON the map can load in the browser |

Basemap must be MAPID MAPS when the team key is in `.env`. The demo style is only a stand-in so the window opens on day one.
