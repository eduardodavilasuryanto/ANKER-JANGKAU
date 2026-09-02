import "maplibre-gl/dist/maplibre-gl.css";
import "./styles/main.css";
import { createMap } from "./components/map/createMap.js";
import { mountLayerPanel } from "./components/layers/layerPanel.js";
import { mountRecommendPanel } from "./components/recommend/recommendPanel.js";
import { mountLegend } from "./components/ui/legend.js";
import { MAP_LAYERS } from "./config/layers.js";

const map = createMap("map");
mountLayerPanel(document.getElementById("layer-panel"), MAP_LAYERS);
mountRecommendPanel(document.getElementById("recommend-panel"));
mountLegend(document.getElementById("legend"));

map.on("load", () => {
  document.body.classList.add("map-ready");
});
