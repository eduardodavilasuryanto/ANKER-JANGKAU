import { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";

import { MAP_DEFAULTS } from "../../config/map.js";

const LAYER_IDS = [
  "affordability",
  "catchments",
  "station-premium",
  "cost-of-living",
  "flood-risk",
  "krl-network",
  "station-markers",
  "ai-highlight",
];

function getBounds(
  coordinates,
  bounds = [Infinity, Infinity, -Infinity, -Infinity],
) {
  if (typeof coordinates[0] === "number") {
    bounds[0] = Math.min(bounds[0], coordinates[0]);
    bounds[1] = Math.min(bounds[1], coordinates[1]);
    bounds[2] = Math.max(bounds[2], coordinates[0]);
    bounds[3] = Math.max(bounds[3], coordinates[1]);
    return bounds;
  }

  coordinates.forEach((coordinate) => getBounds(coordinate, bounds));
  return bounds;
}

export function MapCanvas({
  release,
  activeLayers,
  selectedStationId,
  recommendationIds,
  onSelect,
  onMapError,
}) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    const map = new maplibregl.Map({
      container: containerRef.current,
      style: MAP_DEFAULTS.style,
      center: MAP_DEFAULTS.center,
      zoom: MAP_DEFAULTS.zoom,
      pitch: MAP_DEFAULTS.pitch,
      bearing: MAP_DEFAULTS.bearing,
      attributionControl: true,
    });

    map.addControl(new maplibregl.NavigationControl(), "top-right");
    map.on("load", () => setMapReady(true));
    map.on("error", (event) =>
      onMapError(event.error?.message || "Peta tidak dapat dimuat."),
    );
    mapRef.current = map;

    return () => map.remove();
  }, [onMapError]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;

    const observer = new ResizeObserver(() => mapRef.current?.resize());
    observer.observe(container);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    const catchments = release?.artifacts?.catchments;

    if (!mapReady || !map || !catchments || map.getSource("catchments")) return;

    map.addSource("catchments", { type: "geojson", data: catchments });
    map.addLayer({
      id: "affordability",
      type: "fill",
      source: "catchments",
      paint: {
        "fill-color": [
          "step",
          ["coalesce", ["get", "composite_score"], 0],
          "#d7f0e5",
          20,
          "#a9dec7",
          40,
          "#76c39d",
          60,
          "#3aa36f",
          80,
          "#0c8c5e",
        ],
        "fill-opacity": 0.7,
        "fill-outline-color": "#ffffff",
      },
    });
    map.addLayer({
      id: "catchments",
      type: "line",
      source: "catchments",
      paint: {
        "line-color": "#08090a",
        "line-width": 1.25,
        "line-dasharray": [2, 1],
      },
      layout: { visibility: "none" },
    });
    map.addLayer({
      id: "cost-of-living",
      type: "fill",
      source: "catchments",
      paint: {
        "fill-color": [
          "interpolate",
          ["linear"],
          ["coalesce", ["get", "avg_daily_spend"], 0],
          0,
          "#eff6ff",
          150000,
          "#0c8c5e",
        ],
        "fill-opacity": 0.68,
      },
      layout: { visibility: "none" },
    });
    map.addLayer({
      id: "flood-risk",
      type: "fill",
      source: "catchments",
      paint: {
        "fill-color": [
          "step",
          ["get", "flood_risk_score"],
          "#fef3c7",
          0.5,
          "#d97706",
          1,
          "#b45309",
        ],
        "fill-opacity": 0.62,
      },
      layout: { visibility: "none" },
    });
    map.addLayer({
      id: "ai-highlight",
      type: "line",
      source: "catchments",
      paint: { "line-color": "#08090a", "line-width": 4 },
      filter: ["==", ["get", "station_id"], ""],
      layout: { visibility: "none" },
    });
    map.addLayer({
      id: "selected-area",
      type: "line",
      source: "catchments",
      paint: { "line-color": "#000000", "line-width": 3 },
      filter: ["==", ["get", "station_id"], ""],
    });

    if (release.artifacts.network) {
      map.addSource("krl-network", {
        type: "geojson",
        data: release.artifacts.network,
      });
      map.addLayer({
        id: "krl-network",
        type: "line",
        source: "krl-network",
        paint: { "line-color": "#08090a", "line-width": 3 },
      });
    }
    if (release.artifacts.stations) {
      map.addSource("stations", {
        type: "geojson",
        data: release.artifacts.stations,
      });
      map.addLayer({
        id: "station-premium",
        type: "circle",
        source: "stations",
        paint: {
          "circle-radius": [
            "interpolate",
            ["linear"],
            ["coalesce", ["get", "housing_price"], 0],
            0,
            5,
            50000000,
            16,
          ],
          "circle-color": "#08090a",
          "circle-stroke-color": "#ffffff",
          "circle-stroke-width": 2,
        },
        layout: { visibility: "none" },
      });
      map.addLayer({
        id: "station-markers",
        type: "circle",
        source: "stations",
        paint: {
          "circle-radius": 5,
          "circle-color": "#ffffff",
          "circle-stroke-color": "#08090a",
          "circle-stroke-width": 2,
        },
      });
    }

    map.on("click", "affordability", (event) =>
      onSelect(event.features?.[0]?.properties?.station_id),
    );
    map.on("mouseenter", "affordability", () => {
      map.getCanvas().style.cursor = "pointer";
    });
    map.on("mouseleave", "affordability", () => {
      map.getCanvas().style.cursor = "";
    });
  }, [mapReady, onSelect, release]);

  useEffect(() => {
    const map = mapRef.current;
    if (!mapReady || !map?.isStyleLoaded()) return;

    LAYER_IDS.forEach((id) => {
      if (map.getLayer(id))
        map.setLayoutProperty(
          id,
          "visibility",
          activeLayers.includes(id) || id === "station-markers"
            ? "visible"
            : "none",
        );
    });
    if (map.getLayer("selected-area"))
      map.setFilter("selected-area", [
        "==",
        ["get", "station_id"],
        selectedStationId || "",
      ]);
    if (map.getLayer("ai-highlight"))
      map.setFilter("ai-highlight", [
        "in",
        ["get", "station_id"],
        ["literal", recommendationIds],
      ]);
  }, [activeLayers, mapReady, recommendationIds, release, selectedStationId]);

  useEffect(() => {
    const map = mapRef.current;
    const selectedFeature = release?.artifacts?.catchments?.features.find(
      (feature) => feature.properties.station_id === selectedStationId,
    );

    if (!mapReady || !map || !selectedFeature?.geometry?.coordinates) return;

    const [west, south, east, north] = getBounds(
      selectedFeature.geometry.coordinates,
    );
    if (![west, south, east, north].every(Number.isFinite)) return;

    map.fitBounds(
      [
        [west, south],
        [east, north],
      ],
      { padding: 96, maxZoom: 13, duration: 500 },
    );
  }, [mapReady, release, selectedStationId]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0"
      role="application"
      aria-label="Peta kawasan stasiun Lin Bogor"
    />
  );
}
