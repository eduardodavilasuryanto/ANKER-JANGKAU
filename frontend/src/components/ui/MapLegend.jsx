const SCORE_LEGEND = {
  breaks: [0, 20, 40, 60, 80],
  labels: ["Sangat Rendah", "Rendah", "Sedang", "Tinggi", "Sangat Tinggi"],
  colors: ["#d7f0e5", "#a9dec7", "#76c39d", "#3aa36f", "#0c8c5e"],
};

const FLOOD_LEGEND = {
  items: [
    { label: "Rendah", color: "#fef3c7" },
    { label: "Sedang", color: "#d97706" },
    { label: "Tinggi", color: "#b45309" },
  ],
};

const COST_LEGEND = {
  labels: ["Rendah", "Tinggi"],
  colors: ["#eff6ff", "#0c8c5e"],
};

function ScoreLegend() {
  return (
    <div className="map-legend-section">
      <span className="map-legend-label">Skor Keterjangkauan</span>
      <div className="map-legend-bar">
        {SCORE_LEGEND.colors.map((color, i) => (
          <div
            className="map-legend-swatch"
            key={i}
            style={{ background: color }}
            title={SCORE_LEGEND.labels[i]}
          />
        ))}
      </div>
      <div className="map-legend-ticks">
        <span>0</span>
        <span>20</span>
        <span>40</span>
        <span>60</span>
        <span>80</span>
        <span>100</span>
      </div>
    </div>
  );
}

function FloodLegend() {
  return (
    <div className="map-legend-section">
      <span className="map-legend-label">Risiko Banjir</span>
      <div className="map-legend-items">
        {FLOOD_LEGEND.items.map((item) => (
          <div className="map-legend-item" key={item.label}>
            <span
              className="map-legend-dot"
              style={{ background: item.color }}
            />
            <span>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function CostLegend() {
  return (
    <div className="map-legend-section">
      <span className="map-legend-label">Biaya Hidup Harian</span>
      <div className="map-legend-gradient">
        <div
          className="map-legend-gradient-bar"
          style={{
            background: `linear-gradient(to right, ${COST_LEGEND.colors[0]}, ${COST_LEGEND.colors[1]})`,
          }}
        />
        <div className="map-legend-ticks">
          <span>{COST_LEGEND.labels[0]}</span>
          <span>{COST_LEGEND.labels[1]}</span>
        </div>
      </div>
    </div>
  );
}

export function MapLegend({ activeLayers }) {
  const showScore = activeLayers.includes("affordability");
  const showFlood = activeLayers.includes("flood-risk");
  const showCost = activeLayers.includes("cost-of-living");

  if (!showScore && !showFlood && !showCost) return null;

  return (
    <div className="map-legend" role="complementary" aria-label="Legenda peta">
      {showScore && <ScoreLegend />}
      {showFlood && <FloodLegend />}
      {showCost && <CostLegend />}
    </div>
  );
}
