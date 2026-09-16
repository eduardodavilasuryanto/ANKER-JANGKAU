/**
 * Demo-mode authentication using localStorage.
 * Used as a fallback when the D1/Cloudflare auth backend is unavailable (503).
 */

const DEMO_USERS_KEY = "jangkau-demo-users";
const DEMO_SEARCHES_KEY = "jangkau-demo-searches";

function getDemoUsers() {
  try {
    return JSON.parse(localStorage.getItem(DEMO_USERS_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveDemoUsers(users) {
  localStorage.setItem(DEMO_USERS_KEY, JSON.stringify(users));
}

function getDemoSearches() {
  try {
    return JSON.parse(localStorage.getItem(DEMO_SEARCHES_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveDemoSearches(searches) {
  localStorage.setItem(DEMO_SEARCHES_KEY, JSON.stringify(searches));
}

function generateId() {
  return crypto.randomUUID?.() || `demo-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export async function demoSignUp({ name, email, password }) {
  const users = getDemoUsers();
  const normalizedEmail = email.toLowerCase();

  if (users.find((u) => u.email === normalizedEmail)) {
    throw new Error("Email ini sudah terdaftar.");
  }

  const user = {
    id: generateId(),
    name: name.trim(),
    email: normalizedEmail,
    password,
    created_at: new Date().toISOString(),
  };
  users.push(user);
  saveDemoUsers(users);

  return {
    token: `demo-token-${generateId()}`,
    user: { id: user.id, name: user.name, email: user.email },
  };
}

export async function demoLogin({ email, password }) {
  const users = getDemoUsers();
  const user = users.find(
    (u) => u.email === email.toLowerCase() && u.password === password,
  );

  if (!user) {
    throw new Error("Email atau kata sandi salah.");
  }

  return {
    token: `demo-token-${generateId()}`,
    user: { id: user.id, name: user.name, email: user.email },
  };
}

export async function demoLogout() {
  // No-op in demo mode
}

export async function demoFetchSavedSearches(token) {
  const searches = getDemoSearches();
  const userId = extractUserIdFromToken(token);
  return searches
    .filter((s) => s.user_id === userId)
    .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
}

export async function demoSaveSearch(token, payload) {
  const searches = getDemoSearches();
  const userId = extractUserIdFromToken(token);
  const now = new Date().toISOString();
  const search = {
    id: generateId(),
    user_id: userId,
    label: payload.label,
    search_input: payload.search_input,
    search_result: payload.search_result,
    created_at: now,
    updated_at: now,
  };
  searches.push(search);
  saveDemoSearches(searches);
  return search;
}

export async function demoDeleteSavedSearch(token, searchId) {
  const searches = getDemoSearches();
  const userId = extractUserIdFromToken(token);
  saveDemoSearches(
    searches.filter((s) => !(s.id === searchId && s.user_id === userId)),
  );
}

function extractUserIdFromToken(token) {
  // In demo mode, we store the user id separately in the session
  // Fall back to searching by token pattern
  try {
    const session = JSON.parse(
      localStorage.getItem("jangkau-session") || "null",
    );
    return session?.user?.id || "unknown";
  } catch {
    return "unknown";
  }
}

export function isDemoMode() {
  return true; // Always demo in local dev without backend auth
}
