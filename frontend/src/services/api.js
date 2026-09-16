import {
  demoDeleteSavedSearch,
  demoFetchSavedSearches,
  demoLogin,
  demoLogout,
  demoSaveSearch,
  demoSignUp,
} from "./demoAuth.js";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "";

let authDemoMode = false;

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

async function authRequest(path, options = {}) {
  try {
    return await request(path, options);
  } catch (error) {
    // If backend auth is unavailable (503), switch to demo mode
    if (
      error.message.includes("503") ||
      error.message.includes("unavailable") ||
      error.message.includes("Failed to fetch")
    ) {
      authDemoMode = true;
      throw error;
    }
    throw error;
  }
}

export async function fetchRecommendations(payload, signal) {
  return request("/api/v1/recommend", {
    method: "POST",
    signal,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export async function signUp(payload) {
  if (authDemoMode) return demoSignUp(payload);
  try {
    return await authRequest("/api/v1/auth/sign-up", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch {
    // Fall back to demo mode on any auth failure
    authDemoMode = true;
    return demoSignUp(payload);
  }
}

export async function login(payload) {
  if (authDemoMode) return demoLogin(payload);
  try {
    return await authRequest("/api/v1/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch {
    authDemoMode = true;
    return demoLogin(payload);
  }
}

export async function fetchSavedSearches(token) {
  if (authDemoMode) return demoFetchSavedSearches(token);
  try {
    return await authRequest("/api/v1/auth/saved-searches", {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch {
    authDemoMode = true;
    return demoFetchSavedSearches(token);
  }
}

export async function saveSearch(token, payload) {
  if (authDemoMode) return demoSaveSearch(token, payload);
  try {
    return await authRequest("/api/v1/auth/saved-searches", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
  } catch {
    authDemoMode = true;
    return demoSaveSearch(token, payload);
  }
}

export async function deleteSavedSearch(token, savedSearchId) {
  if (authDemoMode) return demoDeleteSavedSearch(token, savedSearchId);
  try {
    return await authRequest(
      `/api/v1/auth/saved-searches/${savedSearchId}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      },
    );
  } catch {
    authDemoMode = true;
    return demoDeleteSavedSearch(token, savedSearchId);
  }
}

export async function logout(token) {
  if (authDemoMode) return demoLogout();
  try {
    return await authRequest("/api/v1/auth/logout", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch {
    authDemoMode = true;
    return demoLogout();
  }
}

export function isInDemoAuthMode() {
  return authDemoMode;
}
