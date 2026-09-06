const env = import.meta.env;
export const MAP_DEFAULTS = {
  center: [
    Number(env.VITE_MAP_DEFAULT_CENTER_LNG) || 106.827,
    Number(env.VITE_MAP_DEFAULT_CENTER_LAT) || -6.261,
  ],
  zoom: Number(env.VITE_MAP_DEFAULT_ZOOM) || 10.5,
  style: env.VITE_MAPID_STYLE_URL || {
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
  hasMapidStyle: Boolean(env.VITE_MAPID_STYLE_URL),
};
