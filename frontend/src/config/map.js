const env = import.meta.env;
const mapidStyleUrl =
  env.VITE_MAPID_STYLE_URL ||
  (env.VITE_MAPID_API_KEY
    ? `https://basemap.mapid.io/styles/street-2d-building/style.json?key=${encodeURIComponent(env.VITE_MAPID_API_KEY)}`
    : "");

export const MAP_DEFAULTS = {
  center: [
    Number(env.VITE_MAP_DEFAULT_CENTER_LNG) || 106.8271129,
    Number(env.VITE_MAP_DEFAULT_CENTER_LAT) || -6.1754398,
  ],
  zoom: Number(env.VITE_MAP_DEFAULT_ZOOM) || 15.5,
  pitch: Number(env.VITE_MAP_DEFAULT_PITCH) || 60,
  bearing: Number(env.VITE_MAP_DEFAULT_BEARING) || 0,
  style: mapidStyleUrl || {
    version: 8,
    sources: {},
    layers: [
      {
        id: "paper",
        type: "background",
        paint: { "background-color": "#f2f2f2" },
      },
    ],
  },
  hasMapidStyle: Boolean(mapidStyleUrl),
};
