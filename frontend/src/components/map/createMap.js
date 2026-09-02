import maplibregl from "maplibre-gl";
import { MAP_DEFAULTS } from "../../config/map.js";

export function createMap(containerId) {
  return new maplibregl.Map({
    container: containerId,
    style: MAP_DEFAULTS.style,
    center: MAP_DEFAULTS.center,
    zoom: MAP_DEFAULTS.zoom,
    attributionControl: true,
  });
}
