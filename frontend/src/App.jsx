import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Button,
  Checkbox,
  Form,
  InputNumber,
  Popover,
  Select,
  Tooltip,
} from "antd";
import {
  AimOutlined,
  CloudOutlined,
  DeploymentUnitOutlined,
  FundOutlined,
  HomeOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SearchOutlined,
  WalletOutlined,
} from "@ant-design/icons";

import { MAP_LAYERS, VIEW_COPY } from "./config/layers.js";
import { MapCanvas } from "./components/map/MapCanvas.jsx";
import { fetchRecommendations } from "./services/api.js";
import { createDemoRecommendations } from "./services/demoRecommendations.js";
import { loadRelease } from "./services/datasets.js";
import { formatMinutes, formatRupiah, formatScore } from "./utils/format.js";

const LAYER_ICONS = {
  affordability: FundOutlined,
  catchments: AimOutlined,
  "station-premium": HomeOutlined,
  "cost-of-living": WalletOutlined,
  "flood-risk": CloudOutlined,
  "krl-network": DeploymentUnitOutlined,
  "ai-highlight": SearchOutlined,
};

function ViewNavigation({ activeView, onViewChange }) {
  return (
    <nav className="view-navigation" aria-label="Tampilan peta">
      <p className="eyebrow">TAMPILAN</p>
      {MAP_LAYERS.map((layer) => {
        const Icon = LAYER_ICONS[layer.id];

        return (
          <Tooltip key={layer.id} title={layer.label} placement="right">
            <Button
              className={`nav-item ${activeView === layer.id ? "is-active" : ""}`}
              type="text"
              icon={<Icon />}
              onClick={() => onViewChange(layer.id)}
              aria-label={layer.label}
            >
              <span className="nav-item-label">{layer.label}</span>
            </Button>
          </Tooltip>
        );
      })}
    </nav>
  );
}

function RecommendationForm({ stations, apiStatus, onSubmit }) {
  return (
    <section className="recommend-panel">
      <h2>Cari kawasan</h2>
      <Form
        layout="vertical"
        onFinish={onSubmit}
        initialValues={{ budget: 1800000, max_commute: 35 }}
      >
        <Form.Item
          label="Anggaran sewa bulanan (Rp)"
          name="budget"
          rules={[{ required: true }]}
        >
          <InputNumber
            min={100000}
            controls={false}
            className="form-control"
            formatter={(value) =>
              value === undefined || value === null
                ? ""
                : new Intl.NumberFormat("id-ID").format(value)
            }
            parser={(value) => Number(String(value || "").replace(/\D/g, ""))}
          />
        </Form.Item>
        <Form.Item
          label="Stasiun kerja"
          name="work_station"
          rules={[{ required: true }]}
        >
          <Select
            placeholder={
              stations.length ? "Pilih stasiun" : "Menunggu data stasiun"
            }
            disabled={stations.length === 0}
            options={stations.map((station) => ({
              value: station.properties.station_name,
              label: station.properties.station_name,
            }))}
          />
        </Form.Item>
        <Form.Item
          label="Batas waktu tempuh satu arah (menit)"
          name="max_commute"
          rules={[{ required: true }]}
        >
          <InputNumber min={5} controls={false} className="form-control" />
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            disabled={stations.length === 0}
            loading={apiStatus === "loading"}
          >
            Cari area terjangkau
          </Button>
        </Form.Item>
      </Form>
    </section>
  );
}

function RecommendationResults({ apiStatus, results, onSelect }) {
  if (apiStatus === "empty")
    return <p>Belum ada kawasan yang memenuhi preferensi ini.</p>;
  if (apiStatus === "error")
    return <p>Rekomendasi belum tersedia. Periksa layanan dan rilis data.</p>;

  return results.map((result, index) => (
    <button
      className="result-card"
      key={result.station_id}
      type="button"
      onClick={() => onSelect(result.station_id)}
    >
      <span>
        {index + 1}. {result.station_name}
      </span>
      <strong>{formatScore(result.composite_score)}/100</strong>
      <small>
        {formatRupiah(result.avg_rent)} ·{" "}
        {formatMinutes(result.total_commute_time)}
      </small>
      <p>{result.explanation}</p>
      {result.data_source === "interpolated" && (
        <em>Estimasi memakai interpolasi spasial.</em>
      )}
    </button>
  ));
}

function MapLegend({ release }) {
  return (
    <aside className="legend" aria-label="Legenda peta">
      <h2>Skor keterjangkauan</h2>
      <ol className="legend-scale">
        <li>80–100 · paling terjangkau</li>
        <li>60–79 · terjangkau</li>
        <li>40–59 · sedang</li>
        <li>20–39 · kurang terjangkau</li>
        <li>0–19 · paling mahal relatif</li>
      </ol>
      <p>
        Data:{" "}
        {release.status === "ready"
          ? release.manifest.dataset_version
          : "belum tersedia"}
      </p>
    </aside>
  );
}

function LayerControls({ activeLayers, onChange }) {
  const content = (
    <div className="layer-list">
      {MAP_LAYERS.map((layer) => (
        <Checkbox
          key={layer.id}
          checked={activeLayers.includes(layer.id)}
          onChange={(event) => onChange(layer.id, event.target.checked)}
        >
          {layer.label}
        </Checkbox>
      ))}
    </div>
  );

  return (
    <Popover
      content={content}
      title="Layer peta"
      trigger="click"
      placement="bottomRight"
    >
      <Button className="layer-panel" icon={<DeploymentUnitOutlined />}>
        Layer peta
      </Button>
    </Popover>
  );
}

function DetailPanel({ release, selected }) {
  return (
    <section className="detail-panel">
      <div className="detail-title">
        <h2>{selected?.station_name || "Detail kawasan"}</h2>
        {selected && (
          <strong>{formatScore(selected.composite_score)}/100</strong>
        )}
      </div>
      {selected ? (
        <>
          <div className="metrics">
            <span>
              <small>Sewa rata-rata</small>
              {formatRupiah(selected.avg_rent)}
            </span>
            <span>
              <small>Biaya hidup harian</small>
              {formatRupiah(selected.avg_daily_spend)}
            </span>
            <span>
              <small>Waktu ke kerja</small>
              {formatMinutes(selected.total_commute_time)}
            </span>
            <span>
              <small>Risiko banjir</small>
              {selected.flood_risk_label || "Data belum tersedia"}
            </span>
          </div>
          <p className="data-note">
            Nilai mengikuti rilis {release.manifest.dataset_version}. Waktu
            tempuh membutuhkan stasiun kerja untuk menjadi tujuan-spesifik.
          </p>
        </>
      ) : (
        <p>
          Data rinci akan muncul setelah Anda memilih catchment. Angka kosong
          tidak ditafsirkan sebagai nol.
        </p>
      )}
    </section>
  );
}

function LocationTable({ features, onSelect }) {
  return (
    <section className="location-table">
      <h2>Daftar kawasan</h2>
      {features.length ? (
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Kawasan</th>
                <th>Skor</th>
                <th>Sewa</th>
              </tr>
            </thead>
            <tbody>
              {features.map((feature) => (
                <tr key={feature.properties.station_id}>
                  <td>
                    <button
                      type="button"
                      onClick={() => onSelect(feature.properties.station_id)}
                    >
                      {feature.properties.station_name}
                    </button>
                  </td>
                  <td>{formatScore(feature.properties.composite_score)}</td>
                  <td>{formatRupiah(feature.properties.avg_rent)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>Rilis data belum dimuat.</p>
      )}
    </section>
  );
}

export default function App() {
  const [release, setRelease] = useState({ status: "loading" });
  const [activeView, setActiveView] = useState("affordability");
  const [activeLayers, setActiveLayers] = useState([
    "affordability",
    "krl-network",
  ]);
  const [selectedStationId, setSelectedStationId] = useState("");
  const [recommendationIds, setRecommendationIds] = useState([]);
  const [results, setResults] = useState([]);
  const [apiStatus, setApiStatus] = useState("idle");
  const [mapError, setMapError] = useState("");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    loadRelease(controller.signal)
      .then(setRelease)
      .catch((error) =>
        setRelease({ status: "unavailable", reason: error.message }),
      );
    return () => controller.abort();
  }, []);

  const onMapError = useCallback((message) => setMapError(message), []);
  const features = release.artifacts?.catchments?.features || [];
  const stations = release.artifacts?.stations?.features || [];
  const selected = useMemo(
    () =>
      features.find(
        (feature) => feature.properties.station_id === selectedStationId,
      )?.properties,
    [features, selectedStationId],
  );

  function selectView(view) {
    setActiveView(view);
    setActiveLayers(
      view === "ai-highlight"
        ? ["affordability", "krl-network", "ai-highlight"]
        : [...new Set([view, "krl-network"])],
    );
  }

  function setLayerVisibility(layerId, isVisible) {
    setActiveLayers((current) =>
      isVisible
        ? [...new Set([...current, layerId])]
        : current.filter((id) => id !== layerId),
    );
  }

  async function submitRecommendation(values) {
    setApiStatus("loading");
    selectView("ai-highlight");

    try {
      const payload = {
        budget: Number(values.budget),
        work_station: String(values.work_station),
        max_commute: Number(values.max_commute),
      };
      const body = release.manifest?.is_demo
        ? {
            results: createDemoRecommendations(
              payload,
              release.artifacts.catchments,
            ),
          }
        : await fetchRecommendations(payload);
      const nextResults = body.results || [];
      setResults(nextResults);
      setRecommendationIds(nextResults.map((item) => item.station_id));
      setApiStatus(nextResults.length ? "success" : "empty");
    } catch {
      setResults([]);
      setRecommendationIds([]);
      setApiStatus("error");
    }
  }

  const [title, description] = VIEW_COPY[activeView];
  const mapStatus =
    mapError ||
    release.reason ||
    (release.status !== "ready" ? "Memuat rilis data…" : "");

  return (
    <div id="app" className={isSidebarCollapsed ? "is-sidebar-collapsed" : ""}>
      <header className="topbar">
        <a className="brand" href="#ringkasan">
          <span>
            <strong>JANGKAU</strong>
            <small>WebGIS Keterjangkauan</small>
          </span>
        </a>
        <div className="topbar-context">Lin Bogor</div>
      </header>
      <aside className={`sidebar ${isSidebarCollapsed ? "is-collapsed" : ""}`}>
        <Button
          className="sidebar-toggle"
          htmlType="button"
          icon={
            isSidebarCollapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />
          }
          aria-expanded={!isSidebarCollapsed}
          aria-label={
            isSidebarCollapsed ? "Buka panel navigasi" : "Tutup panel navigasi"
          }
          title={isSidebarCollapsed ? "Buka panel" : "Tutup panel"}
          onClick={() => setIsSidebarCollapsed((current) => !current)}
        />
        <ViewNavigation activeView={activeView} onViewChange={selectView} />
      </aside>
      <main className="workspace">
        <section className="workspace-heading">
          <h1>{title}</h1>
          <p>{description}</p>
        </section>
        {activeView === "ai-highlight" && (
          <>
            <RecommendationForm
              stations={stations}
              apiStatus={apiStatus}
              onSubmit={submitRecommendation}
            />
            <RecommendationResults
              apiStatus={apiStatus}
              results={results}
              onSelect={setSelectedStationId}
            />
          </>
        )}
        <section className="map-shell">
          <MapCanvas
            release={release.status === "ready" ? release : null}
            activeLayers={activeLayers}
            selectedStationId={selectedStationId}
            recommendationIds={recommendationIds}
            onSelect={setSelectedStationId}
            onMapError={onMapError}
          />
          {mapStatus && (
            <div className="map-status" role="status">
              {mapStatus}
            </div>
          )}
          <MapLegend release={release} />
          <LayerControls
            activeLayers={activeLayers}
            onChange={setLayerVisibility}
          />
        </section>
        <DetailPanel release={release} selected={selected} />
        <LocationTable features={features} onSelect={setSelectedStationId} />
      </main>
    </div>
  );
}
