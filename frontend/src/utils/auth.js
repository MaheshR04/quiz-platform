const ROLE_ALIAS = {
  user: "student"
};

export function normalizeRole(value) {
  const role = String(value || "").trim().toLowerCase();
  return ROLE_ALIAS[role] || role || "student";
}

export function getToken() {
  return localStorage.getItem("token");
}

export function decodeTokenPayload(token = getToken()) {
  try {
    if (!token) return {};
    const payload = token.split(".")[1];
    return JSON.parse(atob(payload));
  } catch {
    return {};
  }
}

export function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem("user")) || {};
  } catch {
    return {};
  }
}

export function getCurrentUser() {
  const payload = decodeTokenPayload();
  const stored = getStoredUser();

  return {
    ...payload,
    ...stored,
    role: normalizeRole(stored.role || payload.role)
  };
}

export function isTokenExpired(token = getToken()) {
  try {
    if (!token) return true;
    const payload = decodeTokenPayload(token);
    if (!payload.exp) return false;

    // JWT exp is in seconds, Date.now() is in milliseconds
    const now = Math.floor(Date.now() / 1000);
    return payload.exp < now;
  } catch {
    return true;
  }
}

export function clearAuth() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  localStorage.removeItem("currentQuiz");
}
