import { useState } from "react";
import {
  AppstoreOutlined,
  CloudOutlined,
  DollarOutlined,
  EnvironmentOutlined,
  HeatMapOutlined,
  NodeIndexOutlined,
  ThunderboltOutlined,
} from "@ant-design/icons";
import { Switch } from "antd";

const LAYER_DEFINITIONS = [
  {
    id: "affordability",
    label: "Keterjangkauan",
    description: "Skor 0–100 per kawasan",
    icon: <HeatMapOutlined />,
    color: "#0c8c5e",
  },
  {
    id: "catchments",
    label: "Catchment",
    description: "Batas kawasan stasiun",
    icon: <AppstoreOutlined />,
    color: "#08090a",
  },
  {
    id: "station-premium",
    label: "Harga Hunian",
    description: "Premi harga per stasiun",
    icon: <DollarOutlined />,
    color: "#08090a",
  },
  {
    id: "cost-of-living",
    label: "Biaya Hidup",
    description: "Biaya harian per kawasan",
    icon: <DollarOutlined />,
    color: "#0c8c5e",
  },
  {
    id: "flood-risk",
    label: "Risiko Banjir",
    description: "Tingkat bahaya banjir",
    icon: <CloudOutlined />,
    color: "#d97706",
  },
  {
    id: "krl-network",
    label: "Jaringan KRL",
    description: "Jalur dan stasiun KRL",
    icon: <NodeIndexOutlined />,
    color: "#08090a",
  },
  {
    id: "ai-highlight",
    label: "Sorotan AI",
    description: "Hasil rekomendasi terbaru",
    icon: <ThunderboltOutlined />,
    color: "#0c8c5e",
  },
];

export function LayerPanel({ activeLayers, onToggleLayer }) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="layer-panel">
      <button
        className="layer-panel-header"
        type="button"
        onClick={() => setIsCollapsed((v) => !v)}
        aria-expanded={!isCollapsed}
      >
        <EnvironmentOutlined />
        <span className="layer-panel-title">Lapisan Peta</span>
        <span
          className="layer-panel-chevron"
          data-collapsed={isCollapsed}
          aria-hidden="true"
        >
          ‹
        </span>
      </button>
      {!isCollapsed && (
        <div className="layer-panel-body">
          {LAYER_DEFINITIONS.map((layer) => {
            const isActive = activeLayers.includes(layer.id);
            return (
              <label className="layer-toggle" key={layer.id}>
                <span
                  className="layer-toggle-icon"
                  style={{
                    color: isActive ? layer.color : "var(--muted)",
                  }}
                >
                  {layer.icon}
                </span>
                <span className="layer-toggle-text">
                  <span className="layer-toggle-label">{layer.label}</span>
                  <span className="layer-toggle-desc">{layer.description}</span>
                </span>
                <Switch
                  checked={isActive}
                  size="small"
                  onChange={() => onToggleLayer(layer.id)}
                />
              </label>
            );
          })}
        </div>
      )}
    </div>
  );
}
