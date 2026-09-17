import { SaveOutlined, SearchOutlined, DownOutlined, UpOutlined, InfoCircleOutlined, ThunderboltOutlined } from "@ant-design/icons";
import { Button, Drawer, Form, InputNumber, Select, Slider, Pagination } from "antd";
import { useEffect, useState } from "react";

import { AppNavbar } from "../components/AppNavbar.jsx";
import { MapCanvas } from "../components/map/MapCanvas.jsx";
import { LayerPanel } from "../components/layers/LayerPanel.jsx";
import { MapLegend } from "../components/ui/MapLegend.jsx";
import { formatMinutes, formatRupiah, formatScore } from "../utils/format.js";

const formLabelClass = "!pb-1.5 !text-[13px] !font-medium";

function RecommendationForm({ apiStatus, stations, onSubmit, onReset }) {
  const [form] = Form.useForm();
  return (
    <section className="border-b border-[var(--border)] pb-7">
      <p className="mb-3 text-xs font-semibold tracking-[0.1em] text-[#0c8c5e]">
        PREFERENSI KAMU
      </p>
      <h1 className="m-0 text-[28px] leading-[1.1] font-medium tracking-[-0.045em]">
        Mulai dari yang penting.
      </h1>
      <p className="mt-3 mb-6 text-sm leading-6 text-[var(--muted)]">
        Kami bandingkan sewa, biaya hidup, waktu perjalanan, dan risiko banjir.
      </p>
      <Form
        form={form}
        className="grid gap-3.5"
        initialValues={{ budget: [1000000, 3000000], max_commute: 35 }}
        layout="vertical"
        onFinish={onSubmit}
      >
        <Form.Item
          className="!m-0"
          label="Rentang anggaran sewa (Rp)"
          labelCol={{ className: formLabelClass }}
          name="budget"
          rules={[{ required: true, message: "Pilih rentang anggaran sewa." }]}
        >
          <Slider
            range
            min={500000}
            max={10000000}
            step={100000}
            tooltip={{ formatter: (v) => formatRupiah(v) }}
          />
        </Form.Item>
        <Form.Item
          className="!m-0"
          label="Stasiun tujuan kerja"
          labelCol={{ className: formLabelClass }}
          name="work_station"
          rules={[{ required: true, message: "Pilih stasiun tujuan." }]}
        >
          <Select
            disabled={stations.length === 0}
            options={stations.map((station) => ({
              value: station.properties.station_name,
              label: station.properties.station_name,
            }))}
            placeholder={
              stations.length ? "Pilih stasiun" : "Menunggu data stasiun"
            }
          />
        </Form.Item>
        <Form.Item
          className="!m-0"
          label="Batas waktu perjalanan (satu arah)"
          labelCol={{ className: formLabelClass }}
          name="max_commute"
          rules={[{ required: true, message: "Pilih batas waktu." }]}
        >
          <Slider
            min={15}
            max={120}
            step={5}
            marks={{
              15: '15m',
              60: '60m',
              120: '120m'
            }}
            tooltip={{ formatter: (v) => `${v} menit` }}
          />
        </Form.Item>
        <Form.Item className="!m-0">
          <div className="flex gap-2">
            <Button
              className="!h-[42px] !rounded-lg"
              onClick={() => {
                form.resetFields();
                if (onReset) onReset();
              }}
            >
              Reset
            </Button>
            <Button
              block
              className="!h-[42px] !rounded-lg !border-[#0c8c5e] !bg-[#0c8c5e] !text-white !shadow-none hover:!border-[#087a51] hover:!bg-[#087a51]"
              disabled={stations.length === 0}
              htmlType="submit"
              icon={<SearchOutlined />}
              loading={apiStatus === "loading"}
              type="primary"
            >
              Cari kawasan
            </Button>
          </div>
        </Form.Item>
      </Form>
    </section>
  );
}

function ResultsPanel({ apiStatus, onSave, onSelect, results, saveStatus }) {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  useEffect(() => {
    setCurrentPage(1);
  }, [results]);

  if (["idle", "empty", "error", "loading"].includes(apiStatus)) {
    const content = {
      idle: [
        "Kawasan yang cocok akan muncul di sini.",
        "Lengkapi preferensi untuk melihat pilihan tempat tinggalmu.",
      ],
      empty: [
        "Belum ada kawasan yang sesuai.",
        "Coba naikkan anggaran sewa atau batas waktu perjalananmu.",
      ],
      error: [
        "Pencarian belum tersedia.",
        "Periksa layanan rekomendasi atau rilis data lalu coba lagi.",
      ],
      loading: [
        "Sedang mencari kawasan...",
        "Tunggu sebentar ya.",
      ],
    }[apiStatus];
    return (
      <section className="pt-7">
        <p className="mb-3 text-xs font-semibold tracking-[0.1em] text-[#0c8c5e]">
          HASIL PENCARIAN
        </p>
        <h2 className="m-0 text-xl leading-[1.1] font-medium tracking-[-0.04em]">
          {content[0]}
        </h2>
        <p className="mt-2.5 mb-0 text-sm leading-6 text-[var(--muted)]">
          {content[1]}
        </p>
      </section>
    );
  }

  const startIndex = (currentPage - 1) * pageSize;
  const paginatedResults = results.slice(startIndex, startIndex + pageSize);

  return (
    <section className="pt-7" aria-live="polite">
      <p className="mb-3 text-xs font-semibold tracking-[0.1em] text-[#0c8c5e]">
        HASIL PENCARIAN
      </p>
      <h2 className="m-0 text-xl leading-[1.1] font-medium tracking-[-0.04em]">
        {results.length} kawasan untuk dipertimbangkan
      </h2>
      <div className="flex items-center justify-between mt-2.5">
        <span className="block text-xs text-[var(--muted)]">
          Urut berdasarkan skor keterjangkauan
        </span>
        <Button
          className="!h-8 !rounded-lg !border-[var(--border)] !bg-[var(--surface-raised)] !text-[var(--text)] !shadow-none"
          icon={<SaveOutlined />}
          loading={saveStatus === "saving"}
          onClick={onSave}
          size="small"
        >
          {saveStatus === "saved" ? "Tersimpan" : "Simpan"}
        </Button>
      </div>
      <div className="mt-[18px] grid gap-2">
        {paginatedResults.map((result, index) => (
          <ResultCard key={result.station_id} result={result} index={startIndex + index} onSelect={onSelect} />
        ))}
      </div>
      {results.length > pageSize && (
        <div className="mt-5 flex justify-center">
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={results.length}
            onChange={setCurrentPage}
            size="small"
            showSizeChanger={false}
          />
        </div>
      )}
    </section>
  );
}

function ResultCard({ result, index, onSelect }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="border-t border-[var(--border)] last:border-b py-2">
      <button
        className="grid w-full grid-cols-[28px_minmax(0,1fr)_auto] items-center gap-3 bg-transparent py-1.5 text-left text-[var(--text)] hover:[&_strong]:underline"
        type="button"
        onClick={() => onSelect(result.station_id)}
      >
        <span className="text-xs font-semibold text-[#0c8c5e]">
          {String(index + 1).padStart(2, "0")}
        </span>
        <span className="grid min-w-0 gap-1">
          <strong className="text-[15px] font-medium flex items-center gap-2">
            {result.station_name}
            {result.flood_risk_label && (
              <span className={`text-[10px] px-1.5 py-0.5 rounded-sm border ${
                result.flood_risk_score >= 1 ? 'border-red-300 text-red-600 bg-red-50' :
                result.flood_risk_score >= 0.5 ? 'border-amber-300 text-amber-600 bg-amber-50' :
                'border-green-300 text-green-600 bg-green-50'
              }`}>
                Banjir: {result.flood_risk_label}
              </span>
            )}
          </strong>
          <small className="overflow-hidden text-ellipsis whitespace-nowrap text-xs text-[var(--muted)]">
            {formatRupiah(result.avg_rent)} / bulan ·{" "}
            {formatMinutes(result.total_commute_time)}
          </small>
        </span>
        <span className="text-lg font-semibold">
          {formatScore(result.composite_score)}
        </span>
      </button>
      {result.explanation && (
        <div className="mt-1 pl-[40px] pr-2 pb-2">
          <button
            className="flex items-center gap-1 text-[11px] text-[#0c8c5e] bg-transparent border-0 p-0 hover:underline"
            onClick={() => setExpanded(!expanded)}
          >
            <InfoCircleOutlined /> {expanded ? "Tutup penjelasan" : "Lihat penjelasan AI"}
            {expanded ? <UpOutlined className="text-[9px]" /> : <DownOutlined className="text-[9px]" />}
          </button>
          {expanded && (
            <p className="mt-2 mb-1 text-xs text-[var(--muted)] leading-relaxed bg-[var(--surface-raised)] p-2 rounded border border-[var(--border)]">
              {result.explanation}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

function AreaDetail({ release, selected, results }) {
  if (!selected) return null;
  
  const capitalize = (s) => s ? s.charAt(0).toUpperCase() + s.slice(1) : "Belum tersedia";
  
  const metrics = [
    ["Sewa rata-rata", formatRupiah(selected.avg_rent)],
    ["Biaya hidup harian", formatRupiah(selected.avg_daily_spend)],
    ["Waktu ke kerja", formatMinutes(selected.total_commute_time)],
    ["Risiko banjir", capitalize(selected.flood_risk_label)],
    ["Jumlah kos", selected.kost_count != null ? `${selected.kost_count} unit` : "Belum tersedia"],
  ];
  
  const resultMatch = results?.find(r => r.station_id === selected.station_id);

  return (
    <div className="p-2" style={{ color: "var(--text)" }}>
      <p className="mb-3 text-xs font-semibold tracking-[0.1em] text-[#0c8c5e]">
        KAWASAN TERPILIH
      </p>
      <div className="flex items-baseline justify-between gap-4">
        <h2 className="m-0 text-[32px] leading-[1.1] font-medium tracking-[-0.045em]" style={{ color: "var(--text)" }}>
          {selected.station_name}
        </h2>
        <strong className="whitespace-nowrap text-lg" style={{ color: "var(--text)" }}>
          {formatScore(selected.composite_score)}/100
        </strong>
      </div>
      <p className="mt-4 mb-6 text-sm leading-6" style={{ color: "var(--muted)" }}>
        {selected.data_source === "interpolated"
          ? "Nilai ini merupakan estimasi interpolasi spasial."
          : "Nilai ini berasal dari data yang tersedia pada rilis saat ini."}
      </p>
      
      {resultMatch?.explanation && (
        <div className="mb-6 rounded-lg p-3.5" style={{ background: "var(--surface-raised)", border: "1px solid var(--border)" }}>
          <div className="flex items-center gap-2 mb-2 text-[#0c8c5e]">
            <ThunderboltOutlined />
            <span className="text-xs font-semibold tracking-[0.05em]">ANALISIS AI</span>
          </div>
          <p className="m-0 text-[13px] leading-relaxed" style={{ color: "var(--text)" }}>
            {resultMatch.explanation}
          </p>
        </div>
      )}

      <dl className="m-0 grid grid-cols-2 gap-px max-[480px]:grid-cols-1 rounded-lg overflow-hidden" style={{ border: "1px solid var(--border)", background: "var(--border)" }}>
        {metrics.map(([label, value]) => (
          <div className="p-3.5" key={label} style={{ background: "var(--surface-raised)" }}>
            <dt className="text-xs" style={{ color: "var(--muted)" }}>{label}</dt>
            <dd className="mt-1.5 text-sm font-medium" style={{ color: "var(--text)" }}>{value}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-5 mb-0 text-sm leading-6 flex justify-between" style={{ color: "var(--muted)" }}>
        <span>Rilis data: {release.manifest?.dataset_version || "belum tersedia"}</span>
        {selected.last_updated && <span>Diperbarui: {selected.last_updated}</span>}
      </p>
    </div>
  );
}

function MapStatus({ message }) {
  if (!message) return null;
  return (
    <div
      className="absolute z-10 left-5 bottom-5 max-w-80 rounded-lg border border-[var(--border)] bg-[var(--surface-raised)] px-3 py-2.5 text-[13px] leading-[1.45] text-[var(--text)]"
      role="status"
    >
      {message}
    </div>
  );
}

export function SearchPage({
  apiStatus,
  isDark,
  mapStatus,
  onMapError,
  onOpenAccount,
  onSave,
  onSelect,
  onSubmit,
  onReset,
  onToggleTheme,
  recommendationIds,
  release,
  results,
  saveStatus,
  selected,
  selectedStationId,
  session,
  stations,
  isDetailOpen,
  onCloseDetail,
}) {
  const [activeLayers, setActiveLayers] = useState(["affordability", "krl-network", "ai-highlight"]);

  const handleToggleLayer = (layerId) => {
    setActiveLayers((current) =>
      current.includes(layerId)
        ? current.filter((id) => id !== layerId)
        : [...current, layerId]
    );
  };

  return (
    <main
      className={`theme-${isDark ? "dark" : "light"} min-h-screen bg-[var(--page-bg)] text-[var(--text)]`}
    >
      <AppNavbar
        isDark={isDark}
        onOpenAccount={onOpenAccount}
        onToggleTheme={onToggleTheme}
        session={session}
        variant="search"
      />
      <div className="grid min-h-[calc(100vh-64px)] grid-cols-[minmax(340px,430px)_minmax(0,1fr)] max-[800px]:flex max-[800px]:flex-col">
        <aside className="z-2 overflow-y-auto border-r border-[var(--border)] bg-[var(--surface)] p-6 max-[800px]:overflow-visible max-[480px]:p-4">
          <RecommendationForm
            apiStatus={apiStatus}
            stations={stations}
            onSubmit={onSubmit}
            onReset={onReset}
          />
          <ResultsPanel
            apiStatus={apiStatus}
            results={results}
            saveStatus={saveStatus}
            onSave={onSave}
            onSelect={onSelect}
          />
        </aside>
        <section
          className="relative min-h-[540px] overflow-hidden bg-[#dfe5e1] max-[800px]:min-h-[62vh]"
          aria-label="Peta kawasan Lin Bogor"
        >
          <MapCanvas
            activeLayers={activeLayers}
            recommendationIds={recommendationIds}
            release={release.status === "ready" ? release : null}
            selectedStationId={selectedStationId}
            onMapError={onMapError}
            onSelect={onSelect}
          />
          <MapStatus message={mapStatus} />
          
          {/* Legend and Layer Panel overlays */}
          <div className="absolute top-4 right-4 z-10 flex flex-col items-end gap-4 pointer-events-none [&>*]:pointer-events-auto">
            <LayerPanel activeLayers={activeLayers} onToggleLayer={handleToggleLayer} />
          </div>
          
          <div className="absolute bottom-10 right-4 z-10 pointer-events-none [&>*]:pointer-events-auto">
            <MapLegend activeLayers={activeLayers} />
          </div>

          <p className="absolute right-3.5 bottom-1.5 z-2 m-0 rounded bg-[var(--surface-raised)]/90 px-2 py-1 text-[10px] text-[var(--muted)] pointer-events-none">
            Peta kawasan Lin Bogor
          </p>
        </section>
      </div>
      <Drawer
        open={isDetailOpen && Boolean(selected)}
        placement="right"
        size="default"
        title={null}
        onClose={onCloseDetail}
      >
        <AreaDetail release={release} selected={selected} results={results} />
      </Drawer>
    </main>
  );
}
