/**
 * Seven transparent sheets stacked on the map.
 * Toggle order is the drawing order from bottom to top.
 */
export const MAP_LAYERS = [
  { id: "catchments", label: "Station catchments", kind: "fill", defaultOn: true },
  { id: "affordability", label: "Affordability score", kind: "fill", defaultOn: true },
  { id: "station-premium", label: "Station premium", kind: "circle", defaultOn: false },
  { id: "cost-of-living", label: "Daily living cost", kind: "fill", defaultOn: false },
  { id: "flood-risk", label: "Flood risk", kind: "fill", defaultOn: false },
  { id: "krl-network", label: "KRL line and stations", kind: "line", defaultOn: true },
  { id: "ai-highlight", label: "AI shortlist", kind: "fill", defaultOn: false },
];
