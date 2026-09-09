import { useCallback, useEffect, useMemo, useState } from "react";
import { ConfigProvider, theme as antdTheme } from "antd";
import { useLocation, useNavigate } from "react-router-dom";

import { UserAccountDrawer } from "./components/UserAccountDrawer.jsx";
import { LandingPage } from "./pages/LandingPage.jsx";
import { SearchPage } from "./pages/SearchPage.jsx";
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
import { formatRupiah } from "./utils/format.js";

function readStoredTheme() {
  return window.localStorage.getItem("jangkau-theme") === "dark";
}

function readStoredSession() {
  try {
    return JSON.parse(window.localStorage.getItem("jangkau-session") || "null");
  } catch {
    return null;
  }
}

export default function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const isSearchRoute = location.pathname === "/cari-kawasan";
  const [isDark, setIsDark] = useState(readStoredTheme);
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
  const [session, setSession] = useState(readStoredSession);

  useEffect(() => {
    document.documentElement.dataset.theme = isDark ? "dark" : "light";
    window.localStorage.setItem("jangkau-theme", isDark ? "dark" : "light");
  }, [isDark]);

  useEffect(() => {
    const controller = new AbortController();
    loadRelease(controller.signal)
      .then(setRelease)
      .catch((error) =>
        setRelease({ status: "unavailable", reason: error.message }),
      );
    return () => controller.abort();
  }, []);

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
  const onMapError = useCallback((message) => setMapError(message), []);
  const openSearch = useCallback(() => navigate("/cari-kawasan"), [navigate]);
  const selectArea = useCallback((stationId) => {
    setSelectedStationId(stationId);
    setIsDetailOpen(true);
  }, []);
  const toggleTheme = useCallback(() => setIsDark((current) => !current), []);

  const loadSavedSearches = useCallback(async (token) => {
    try {
      setSavedSearches(await fetchSavedSearches(token));
    } catch {
      setSavedSearches([]);
    }
  }, []);

  useEffect(() => {
    if (session?.token) loadSavedSearches(session.token);
  }, [loadSavedSearches, session?.token]);

  async function submitAccount(mode, values) {
    try {
      const nextSession =
        mode === "sign-up" ? await signUp(values) : await login(values);
      window.localStorage.setItem(
        "jangkau-session",
        JSON.stringify(nextSession),
      );
      setSession(nextSession);
      setIsAccountOpen(false);
    } catch (error) {
      window.alert(error.message);
    }
  }

  async function signOut() {
    if (session?.token) await logout(session.token).catch(() => null);
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

  const page = isSearchRoute ? (
    <SearchPage
      apiStatus={apiStatus}
      isDark={isDark}
      isDetailOpen={isDetailOpen}
      mapStatus={mapStatus}
      recommendationIds={recommendationIds}
      release={release}
      results={results}
      saveStatus={saveStatus}
      selected={selected}
      selectedStationId={selectedStationId}
      session={session}
      stations={stations}
      onCloseDetail={() => setIsDetailOpen(false)}
      onMapError={onMapError}
      onOpenAccount={() => setIsAccountOpen(true)}
      onSave={saveCurrentSearch}
      onSelect={selectArea}
      onSubmit={submitRecommendation}
      onToggleTheme={toggleTheme}
    />
  ) : (
    <LandingPage
      isDark={isDark}
      session={session}
      onOpenAccount={() => setIsAccountOpen(true)}
      onStartSearch={openSearch}
      onToggleTheme={toggleTheme}
    />
  );

  return (
    <ConfigProvider
      theme={{
        algorithm: isDark
          ? antdTheme.darkAlgorithm
          : antdTheme.defaultAlgorithm,
        token: {
          borderRadius: 6,
          colorPrimary: "#0c8c5e",
          fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif",
        },
      }}
    >
      {page}
      <UserAccountDrawer
        open={isAccountOpen}
        savedSearches={savedSearches}
        session={session}
        onClose={() => setIsAccountOpen(false)}
        onDeleteSearch={removeSavedSearch}
        onLoadSearch={loadSavedSearch}
        onLogout={signOut}
        onSubmit={submitAccount}
      />
    </ConfigProvider>
  );
}
