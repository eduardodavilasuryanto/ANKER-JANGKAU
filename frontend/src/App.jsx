import { useCallback, useEffect, useMemo, useState } from "react";
import { Button, Drawer, Form, Input, InputNumber, Select } from "antd";
import {
  ArrowRightOutlined,
  DeleteOutlined,
  EnvironmentOutlined,
  LoginOutlined,
  SaveOutlined,
  SearchOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";

import { MapCanvas } from "./components/map/MapCanvas.jsx";
import {
  deleteSavedSearch,
  fetchRecommendations,
  fetchSavedSearches,
  login,
  logout,
  saveSearch,
  signUp,
} from "./services/api.js";
import { createDemoRecommendations } from "./services/demoRecommendations.js";
import { loadRelease } from "./services/datasets.js";
import { formatMinutes, formatRupiah, formatScore } from "./utils/format.js";

const SEARCH_LAYERS = ["affordability", "krl-network", "ai-highlight"];
const formLabelClass = "!pb-1.5 !text-[13px] !font-medium !text-[#1b1b1b]";

function RecommendationForm({ stations, apiStatus, onSubmit }) {
  return (
    <section className="border-b border-black/10 pb-7">
      <p className="mb-3 text-xs font-semibold tracking-[0.1em] text-[#0c8c5e]">
        PREFERENSI KAMU
      </p>
      <h1 className="m-0 text-[28px] leading-[1.1] font-medium tracking-[-0.045em] text-[#1b1b1b]">
        Mulai dari yang penting.
      </h1>
      <p className="mt-3 mb-6 text-sm leading-6 text-neutral-600">
        Kami bandingkan sewa, biaya hidup, waktu perjalanan, dan risiko banjir.
      </p>
      <Form
        layout="vertical"
        onFinish={onSubmit}
        initialValues={{ budget: 1800000, max_commute: 35 }}
        className="grid gap-3.5"
      >
        <Form.Item
          label="Anggaran sewa bulanan (Rp)"
          name="budget"
          rules={[{ required: true, message: "Masukkan anggaran sewa." }]}
          className="!m-0"
          labelCol={{ className: formLabelClass }}
        >
          <InputNumber
            min={100000}
            controls={false}
            className="!w-full"
            formatter={(value) =>
              value === undefined || value === null
                ? ""
                : new Intl.NumberFormat("id-ID").format(value)
            }
            parser={(value) => Number(String(value || "").replace(/\D/g, ""))}
          />
        </Form.Item>
        <Form.Item
          label="Stasiun tujuan kerja"
          name="work_station"
          rules={[{ required: true, message: "Pilih stasiun tujuan." }]}
          className="!m-0"
          labelCol={{ className: formLabelClass }}
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
          label="Waktu perjalanan satu arah (menit)"
          name="max_commute"
          rules={[{ required: true, message: "Masukkan batas waktu." }]}
          className="!m-0"
          labelCol={{ className: formLabelClass }}
        >
          <InputNumber min={5} max={180} controls={false} className="!w-full" />
        </Form.Item>
        <Form.Item className="!m-0">
          <Button
            className="!h-[42px] !rounded-lg !border-[#0c8c5e] !bg-[#0c8c5e] !text-white !shadow-none hover:!border-[#087a51] hover:!bg-[#087a51]"
            type="primary"
            htmlType="submit"
            icon={<SearchOutlined />}
            disabled={stations.length === 0}
            loading={apiStatus === "loading"}
            block
          >
            Cari kawasan
          </Button>
        </Form.Item>
      </Form>
    </section>
  );
}

function ResultsPanel({ apiStatus, results, onSave, onSelect, saveStatus }) {
  if (apiStatus === "idle" || apiStatus === "empty" || apiStatus === "error") {
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
        <h2 className="m-0 text-xl leading-[1.1] font-medium tracking-[-0.04em] text-[#1b1b1b]">
          {content[0]}
        </h2>
        <p className="mt-2.5 mb-0 text-sm leading-6 text-neutral-600">
          {content[1]}
        </p>
      </section>
    );
  }

  return (
    <section className="pt-7" aria-live="polite">
      <div className="grid gap-2.5">
        <div>
          <p className="mb-3 text-xs font-semibold tracking-[0.1em] text-[#0c8c5e]">
            HASIL PENCARIAN
          </p>
          <h2 className="m-0 text-xl leading-[1.1] font-medium tracking-[-0.04em] text-[#1b1b1b]">
            {results.length} kawasan untuk dipertimbangkan
          </h2>
        </div>
        <span className="text-xs text-neutral-500">
          Urut berdasarkan skor keterjangkauan
        </span>
      </div>
      <div className="mt-[18px] grid gap-2">
        {results.map((result, index) => (
          <button
            className="grid w-full grid-cols-[28px_minmax(0,1fr)_auto] items-center gap-3 border-t border-black/10 bg-transparent py-3.5 text-left text-[#1b1b1b] last:border-b hover:[&_strong]:underline hover:[&_strong]:underline-offset-3 focus-visible:[&_strong]:underline"
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
              <small className="overflow-hidden text-ellipsis whitespace-nowrap text-xs text-neutral-600">
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
        className="!mt-5 !h-10 !rounded-lg !border-[#1b1b1b] !bg-white !text-[#1b1b1b] !shadow-none"
        icon={<SaveOutlined />}
        loading={saveStatus === "saving"}
        onClick={onSave}
        block
      >
        {saveStatus === "saved" ? "Pencarian tersimpan" : "Simpan pencarian"}
      </Button>
    </section>
  );
}

function AccountDrawer({
  onClose,
  onDeleteSearch,
  onLoadSearch,
  onLogout,
  onSubmit,
  open,
  savedSearches,
  session,
}) {
  const [mode, setMode] = useState("login");

  if (session) {
    return (
      <Drawer title="Akun saya" open={open} onClose={onClose} width={360}>
        <div className="grid gap-6">
          <div>
            <p className="m-0 text-base font-medium text-[#1b1b1b]">
              {session.user.name}
            </p>
            <p className="mt-1 mb-0 text-sm text-neutral-600">
              {session.user.email}
            </p>
          </div>
          <section>
            <h2 className="m-0 text-sm font-semibold text-[#1b1b1b]">
              Pencarian tersimpan
            </h2>
            {savedSearches.length ? (
              <div className="mt-3 grid divide-y divide-black/10 border-y border-black/10">
                {savedSearches.map((search) => (
                  <div className="flex items-center gap-2 py-3" key={search.id}>
                    <button
                      className="min-w-0 flex-1 border-0 bg-transparent p-0 text-left"
                      type="button"
                      onClick={() => onLoadSearch(search)}
                    >
                      <strong className="block truncate text-sm font-medium text-[#1b1b1b]">
                        {search.label}
                      </strong>
                      <span className="mt-1 block text-xs text-neutral-500">
                        {new Date(search.updated_at).toLocaleDateString(
                          "id-ID",
                        )}
                      </span>
                    </button>
                    <Button
                      aria-label={`Hapus ${search.label}`}
                      icon={<DeleteOutlined />}
                      type="text"
                      onClick={() => onDeleteSearch(search.id)}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-3 mb-0 text-sm leading-6 text-neutral-600">
                Simpan pencarian untuk membukanya lagi di sini.
              </p>
            )}
          </section>
          <Button icon={<LoginOutlined />} onClick={onLogout}>
            Keluar
          </Button>
        </div>
      </Drawer>
    );
  }

  const isSignUp = mode === "sign-up";
  return (
    <Drawer
      title={isSignUp ? "Buat akun" : "Masuk"}
      open={open}
      onClose={onClose}
      width={360}
    >
      <p className="mt-0 mb-6 text-sm leading-6 text-neutral-600">
        Masuk untuk menyimpan pencarian dan membukanya kembali nanti.
      </p>
      <Form
        className="grid gap-1"
        layout="vertical"
        onFinish={(values) => onSubmit(mode, values)}
      >
        {isSignUp ? (
          <Form.Item
            label="Nama"
            name="name"
            rules={[{ required: true, message: "Masukkan nama." }]}
          >
            <Input autoComplete="name" />
          </Form.Item>
        ) : null}
        <Form.Item
          label="Email"
          name="email"
          rules={[
            {
              required: true,
              type: "email",
              message: "Masukkan email yang valid.",
            },
          ]}
        >
          <Input autoComplete="email" inputMode="email" />
        </Form.Item>
        <Form.Item
          label="Kata sandi"
          name="password"
          rules={[
            { required: true, min: 8, message: "Gunakan minimal 8 karakter." },
          ]}
        >
          <Input.Password
            autoComplete={isSignUp ? "new-password" : "current-password"}
          />
        </Form.Item>
        <Button className="!mt-2 !h-10" htmlType="submit" type="primary">
          {isSignUp ? "Buat akun" : "Masuk"}
        </Button>
      </Form>
      <Button
        className="!mt-4 !px-0"
        type="link"
        onClick={() => setMode(isSignUp ? "login" : "sign-up")}
      >
        {isSignUp ? "Sudah punya akun? Masuk" : "Belum punya akun? Buat akun"}
      </Button>
    </Drawer>
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
    <div className="p-2">
      <p className="mb-3 text-xs font-semibold tracking-[0.1em] text-[#0c8c5e]">
        KAWASAN TERPILIH
      </p>
      <div className="flex items-baseline justify-between gap-4">
        <h2 className="m-0 text-[32px] leading-[1.1] font-medium tracking-[-0.045em] text-[#1b1b1b]">
          {selected.station_name}
        </h2>
        <strong className="whitespace-nowrap text-lg">
          {formatScore(selected.composite_score)}/100
        </strong>
      </div>
      <p className="mt-4 mb-6 text-sm leading-6 text-neutral-600">
        {selected.data_source === "interpolated"
          ? "Nilai ini merupakan estimasi interpolasi spasial."
          : "Nilai ini berasal dari data yang tersedia pada rilis saat ini."}
      </p>
      <dl className="m-0 grid grid-cols-2 gap-px border border-black/10 bg-black/10 max-[480px]:grid-cols-1">
        {metrics.map(([label, value]) => (
          <div className="bg-white p-3.5" key={label}>
            <dt className="text-xs text-neutral-500">{label}</dt>
            <dd className="mt-1.5 text-sm font-medium">{value}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-5 mb-0 text-sm leading-6 text-neutral-600">
        Rilis data: {release.manifest?.dataset_version || "belum tersedia"}
      </p>
    </div>
  );
}

function MapStatus({ message, dark = false }) {
  if (!message) return null;

  return (
    <div
      className={`absolute z-10 left-5 bottom-5 max-w-80 rounded-lg border px-3 py-2.5 text-[13px] leading-[1.45] ${
        dark
          ? "border-white/30 bg-black/60 text-white"
          : "border-black/10 bg-white text-[#1b1b1b]"
      }`}
      role="status"
    >
      {message}
    </div>
  );
}

export default function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const isSearchRoute = location.pathname === "/cari-kawasan";
  const [release, setRelease] = useState({ status: "loading" });
  const [selectedStationId, setSelectedStationId] = useState("");
  const [recommendationIds, setRecommendationIds] = useState([]);
  const [results, setResults] = useState([]);
  const [apiStatus, setApiStatus] = useState("idle");
  const [mapError, setMapError] = useState("");
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [lastSearch, setLastSearch] = useState(null);
  const [saveStatus, setSaveStatus] = useState("idle");
  const [savedSearches, setSavedSearches] = useState([]);
  const [session, setSession] = useState(() => {
    try {
      return JSON.parse(
        window.localStorage.getItem("jangkau-session") || "null",
      );
    } catch {
      return null;
    }
  });

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
  const mapStatus =
    mapError ||
    release.reason ||
    (release.status !== "ready" ? "Memuat peta dan data…" : "");

  const openSearch = useCallback(() => {
    navigate("/cari-kawasan");
  }, [navigate]);

  const loadSavedSearches = useCallback(async (token) => {
    try {
      setSavedSearches(await fetchSavedSearches(token));
    } catch {
      setSavedSearches([]);
    }
  }, []);

  useEffect(() => {
    if (session?.token) {
      loadSavedSearches(session.token);
    }
  }, [loadSavedSearches, session?.token]);

  function setAuthenticatedSession(nextSession) {
    window.localStorage.setItem("jangkau-session", JSON.stringify(nextSession));
    setSession(nextSession);
  }

  async function submitAccount(mode, values) {
    try {
      const nextSession =
        mode === "sign-up" ? await signUp(values) : await login(values);
      setAuthenticatedSession(nextSession);
      setIsAccountOpen(false);
    } catch (error) {
      window.alert(error.message);
    }
  }

  async function signOut() {
    if (session?.token) {
      await logout(session.token).catch(() => null);
    }
    window.localStorage.removeItem("jangkau-session");
    setSavedSearches([]);
    setSession(null);
    setIsAccountOpen(false);
  }

  async function saveCurrentSearch() {
    if (!lastSearch || !results.length) return;
    if (!session?.token) {
      setIsAccountOpen(true);
      return;
    }

    setSaveStatus("saving");
    try {
      await saveSearch(session.token, {
        label: `${lastSearch.work_station} · ${formatRupiah(lastSearch.budget)}`,
        search_input: lastSearch,
        search_result: { results },
      });
      await loadSavedSearches(session.token);
      setSaveStatus("saved");
    } catch (error) {
      setSaveStatus("idle");
      window.alert(error.message);
    }
  }

  async function removeSavedSearch(savedSearchId) {
    if (!session?.token) return;
    try {
      await deleteSavedSearch(session.token, savedSearchId);
      await loadSavedSearches(session.token);
    } catch (error) {
      window.alert(error.message);
    }
  }

  function loadSavedSearch(savedSearch) {
    const savedResults = savedSearch.search_result?.results || [];
    setResults(savedResults);
    setRecommendationIds(savedResults.map((item) => item.station_id));
    setLastSearch(savedSearch.search_input);
    setApiStatus(savedResults.length ? "success" : "empty");
    navigate("/cari-kawasan");
    setIsAccountOpen(false);
  }

  const selectArea = useCallback((stationId) => {
    setSelectedStationId(stationId);
    setIsDetailOpen(true);
  }, []);

  async function submitRecommendation(values) {
    setApiStatus("loading");
    setIsDetailOpen(false);

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
      setLastSearch(payload);
      setSaveStatus("idle");
      setApiStatus(nextResults.length ? "success" : "empty");
    } catch {
      setResults([]);
      setRecommendationIds([]);
      setApiStatus("error");
    }
  }

  const map = (
    <MapCanvas
      release={release.status === "ready" ? release : null}
      activeLayers={SEARCH_LAYERS}
      selectedStationId={selectedStationId}
      recommendationIds={recommendationIds}
      onSelect={isSearchRoute ? selectArea : openSearch}
      onMapError={onMapError}
    />
  );

  if (!isSearchRoute) {
    return (
      <main className="relative grid min-h-screen grid-rows-[auto_1fr_auto] overflow-hidden bg-black font-sans text-white">
        <div
          className="absolute inset-0 overflow-hidden bg-[#06130d]"
          aria-hidden="true"
        >
          <div className="landing-background absolute inset-0" />
          <div className="landing-curve-overlay absolute inset-0" />
        </div>
        <header className="relative z-1 flex h-[72px] items-center justify-between border-b border-white/20 px-8 text-sm font-medium max-[480px]:px-4">
          <a
            className="text-base font-semibold tracking-[-0.05em] text-white no-underline"
            href="#top"
          >
            JANGKAU
          </a>
          <Button
            className="!text-white"
            type="text"
            icon={<UserOutlined />}
            onClick={() => setIsAccountOpen(true)}
          >
            {session ? session.user.name : "Masuk"}
          </Button>
        </header>
        <section
          className="relative z-1 w-[calc(100%-48px)] max-w-[760px] self-center justify-self-center py-20 text-center max-[480px]:w-[calc(100%-32px)] max-[480px]:max-w-[560px]"
          id="top"
        >
          <p className="mb-3 text-xs font-semibold tracking-[0.1em] text-[#a7e4c7]">
            TEMUKAN TEMPAT PULANGMU
          </p>
          <h1 className="m-0 text-[clamp(44px,7vw,82px)] leading-[0.98] font-medium tracking-[-0.065em]">
            Mau tinggal di kawasan seperti apa?
          </h1>
          <p className="mx-auto mt-7 mb-0 max-w-[520px] text-lg leading-[1.5] max-[480px]:text-base">
            Cari kawasan dekat KRL yang sesuai dengan sewa, biaya hidup, dan
            waktu perjalananmu.
          </p>
          <Button
            className="!mt-8 !h-auto !rounded-lg !border-[#0c8c5e] !bg-[#0c8c5e] !px-[18px] !py-[11px] !text-white !shadow-none hover:!border-[#087a51] hover:!bg-[#087a51]"
            type="primary"
            size="large"
            icon={<ArrowRightOutlined />}
            iconPosition="end"
            onClick={openSearch}
          >
            Cari kawasan
          </Button>
        </section>
        <div className="relative z-1 flex items-center gap-2 px-8 pb-6 text-[13px] text-white/75 max-[480px]:px-4 max-[480px]:pb-5">
          <EnvironmentOutlined /> Lin Bogor
        </div>
        <AccountDrawer
          open={isAccountOpen}
          session={session}
          savedSearches={savedSearches}
          onClose={() => setIsAccountOpen(false)}
          onSubmit={submitAccount}
          onLogout={signOut}
          onLoadSearch={loadSavedSearch}
          onDeleteSearch={removeSavedSearch}
        />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f5f5f5] font-sans text-[#1b1b1b]">
      <header className="flex h-16 items-center justify-between border-b border-black/10 bg-white px-6 max-[480px]:px-4">
        <button
          className="border-0 bg-transparent p-0 text-base font-semibold tracking-[-0.05em]"
          type="button"
          onClick={() => navigate("/")}
        >
          JANGKAU
        </button>
        <div className="flex items-center gap-1">
          <Button
            type="text"
            icon={<UserOutlined />}
            onClick={() => setIsAccountOpen(true)}
          >
            {session ? session.user.name : "Masuk"}
          </Button>
        </div>
      </header>
      <div className="grid min-h-[calc(100vh-64px)] grid-cols-[minmax(340px,430px)_minmax(0,1fr)] max-[800px]:flex max-[800px]:flex-col">
        <aside className="z-2 overflow-y-auto border-r border-black/10 bg-white p-6 max-[800px]:overflow-visible max-[480px]:p-4">
          <RecommendationForm
            stations={stations}
            apiStatus={apiStatus}
            onSubmit={submitRecommendation}
          />
          <ResultsPanel
            apiStatus={apiStatus}
            results={results}
            saveStatus={saveStatus}
            onSave={saveCurrentSearch}
            onSelect={selectArea}
          />
        </aside>
        <section
          className="relative min-h-[540px] bg-[#dfe5e1] max-[800px]:min-h-[62vh]"
          aria-label="Peta kawasan Lin Bogor"
        >
          {map}
          <MapStatus message={mapStatus} />
          <p className="absolute right-3.5 bottom-3.5 z-2 m-0 rounded bg-white/88 px-2 py-1.5 text-[11px] text-neutral-600">
            Peta kawasan Lin Bogor
          </p>
        </section>
      </div>
      <Drawer
        title={null}
        open={isDetailOpen && Boolean(selected)}
        onClose={() => setIsDetailOpen(false)}
        placement="right"
        width={420}
      >
        <AreaDetail release={release} selected={selected} />
      </Drawer>
      <AccountDrawer
        open={isAccountOpen}
        session={session}
        savedSearches={savedSearches}
        onClose={() => setIsAccountOpen(false)}
        onSubmit={submitAccount}
        onLogout={signOut}
        onLoadSearch={loadSavedSearch}
        onDeleteSearch={removeSavedSearch}
      />
    </main>
  );
}
