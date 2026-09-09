const API_BASE = import.meta.env.VITE_API_BASE_URL || "";

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      Accept: "application/json",
      ...options.headers,
    },
  });

  if (!response.ok) {
    const detail = await response.json().catch(() => ({}));
    throw new Error(
      detail.detail || `Layanan mengembalikan ${response.status}.`,
    );
  }

  return response.status === 204 ? null : response.json();
}

export async function fetchRecommendations(payload, signal) {
  return request("/api/v1/recommend", {
    method: "POST",
    signal,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export function signUp(payload) {
  return request("/api/v1/auth/sign-up", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export function login(payload) {
  return request("/api/v1/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export function fetchSavedSearches(token) {
  return request("/api/v1/auth/saved-searches", {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export function saveSearch(token, payload) {
  return request("/api/v1/auth/saved-searches", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
}

export function deleteSavedSearch(token, savedSearchId) {
  return request(`/api/v1/auth/saved-searches/${savedSearchId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
}

export function logout(token) {
  return request("/api/v1/auth/logout", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });
}
