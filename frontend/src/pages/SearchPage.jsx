import { SaveOutlined, SearchOutlined } from "@ant-design/icons";
import { Button, Drawer, Form, InputNumber, Select } from "antd";

import { AppNavbar } from "../components/AppNavbar.jsx";
import { MapCanvas } from "../components/map/MapCanvas.jsx";
import { formatMinutes, formatRupiah, formatScore } from "../utils/format.js";

const SEARCH_LAYERS = ["affordability", "krl-network", "ai-highlight"];
const formLabelClass = "!pb-1.5 !text-[13px] !font-medium";

function RecommendationForm({ apiStatus, stations, onSubmit }) {
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
        className="grid gap-3.5"
        initialValues={{ budget: 1800000, max_commute: 35 }}
        layout="vertical"
        onFinish={onSubmit}
      >
        <Form.Item
          className="!m-0"
          label="Anggaran sewa bulanan (Rp)"
          labelCol={{ className: formLabelClass }}
          name="budget"
          rules={[{ required: true, message: "Masukkan anggaran sewa." }]}
        >
          <InputNumber
            className="!w-full"
            controls={false}
            formatter={(value) =>
              value === undefined || value === null
                ? ""
                : new Intl.NumberFormat("id-ID").format(value)
            }
            min={100000}
            parser={(value) => Number(String(value || "").replace(/\D/g, ""))}
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
          label="Waktu perjalanan satu arah (menit)"
          labelCol={{ className: formLabelClass }}
          name="max_commute"
          rules={[{ required: true, message: "Masukkan batas waktu." }]}
        >
          <InputNumber className="!w-full" controls={false} max={180} min={5} />
        </Form.Item>
        <Form.Item className="!m-0">
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
        </Form.Item>
      </Form>
    </section>
  );
}

function ResultsPanel({ apiStatus, onSave, onSelect, results, saveStatus }) {
  if (["idle", "empty", "error"].includes(apiStatus)) {
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

  return (
    <section className="pt-7" aria-live="polite">
      <p className="mb-3 text-xs font-semibold tracking-[0.1em] text-[#0c8c5e]">
        HASIL PENCARIAN
      </p>
      <h2 className="m-0 text-xl leading-[1.1] font-medium tracking-[-0.04em]">
        {results.length} kawasan untuk dipertimbangkan
      </h2>
      <span className="mt-2.5 block text-xs text-[var(--muted)]">
        Urut berdasarkan skor keterjangkauan
      </span>
      <div className="mt-[18px] grid gap-2">
        {results.map((result, index) => (
          <button
            className="grid w-full grid-cols-[28px_minmax(0,1fr)_auto] items-center gap-3 border-t border-[var(--border)] bg-transparent py-3.5 text-left text-[var(--text)] last:border-b hover:[&_strong]:underline"
            key={result.station_id}
            type="button"
            onClick={() => onSelect(result.station_id)}
          >
            <span className="text-xs font-semibold text-[#0c8c5e]">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className="grid min-w-0 gap-1">
              <strong className="text-[15px] font-medium">
                {result.station_name}
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
        ))}
      </div>
      <Button
        block
        className="!mt-5 !h-10 !rounded-lg !border-[var(--border)] !bg-[var(--surface-raised)] !text-[var(--text)] !shadow-none"
        icon={<SaveOutlined />}
        loading={saveStatus === "saving"}
        onClick={onSave}
      >
        {saveStatus === "saved" ? "Pencarian tersimpan" : "Simpan pencarian"}
      </Button>
    </section>
  );
}

function AreaDetail({ release, selected }) {
  if (!selected) return null;
  const metrics = [
    ["Sewa rata-rata", formatRupiah(selected.avg_rent)],
    ["Biaya hidup harian", formatRupiah(selected.avg_daily_spend)],
    ["Waktu ke kerja", formatMinutes(selected.total_commute_time)],
    ["Risiko banjir", selected.flood_risk_label || "Belum tersedia"],
  ];
  return (
    <div className="p-2 text-[var(--text)]">
      <p className="mb-3 text-xs font-semibold tracking-[0.1em] text-[#0c8c5e]">
        KAWASAN TERPILIH
      </p>
      <div className="flex items-baseline justify-between gap-4">
        <h2 className="m-0 text-[32px] leading-[1.1] font-medium tracking-[-0.045em]">
          {selected.station_name}
        </h2>
        <strong className="whitespace-nowrap text-lg">
          {formatScore(selected.composite_score)}/100
        </strong>
      </div>
      <p className="mt-4 mb-6 text-sm leading-6 text-[var(--muted)]">
        {selected.data_source === "interpolated"
          ? "Nilai ini merupakan estimasi interpolasi spasial."
          : "Nilai ini berasal dari data yang tersedia pada rilis saat ini."}
      </p>
      <dl className="m-0 grid grid-cols-2 gap-px border border-[var(--border)] bg-[var(--border)] max-[480px]:grid-cols-1">
        {metrics.map(([label, value]) => (
          <div className="bg-[var(--surface)] p-3.5" key={label}>
            <dt className="text-xs text-[var(--muted)]">{label}</dt>
            <dd className="mt-1.5 text-sm font-medium">{value}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-5 mb-0 text-sm leading-6 text-[var(--muted)]">
        Rilis data: {release.manifest?.dataset_version || "belum tersedia"}
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
            activeLayers={SEARCH_LAYERS}
            recommendationIds={recommendationIds}
            release={release.status === "ready" ? release : null}
            selectedStationId={selectedStationId}
            onMapError={onMapError}
            onSelect={onSelect}
          />
          <MapStatus message={mapStatus} />
          <p className="absolute right-3.5 bottom-3.5 z-2 m-0 rounded bg-[var(--surface-raised)]/90 px-2 py-1.5 text-[11px] text-[var(--muted)]">
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
        <AreaDetail release={release} selected={selected} />
      </Drawer>
    </main>
  );
}
