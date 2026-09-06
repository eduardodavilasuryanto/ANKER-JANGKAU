const API_BASE = import.meta.env.VITE_API_BASE_URL || "";

export async function fetchRecommendations(payload, signal) {
  const response = await fetch(`${API_BASE}/api/v1/recommend`, {
    method: "POST",
    signal,
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    const detail = await response.json().catch(() => ({}));
    throw new Error(
      detail.detail || `Layanan rekomendasi mengembalikan ${response.status}.`,
    );
  }
  return response.json();
}
