const API_BASE = import.meta.env.VITE_API_BASE_URL || "";

export async function fetchRecommendations(payload) {
  const response = await fetch(`${API_BASE}/api/v1/recommend`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    throw new Error(`Kitchen returned ${response.status}`);
  }
  return response.json();
}
