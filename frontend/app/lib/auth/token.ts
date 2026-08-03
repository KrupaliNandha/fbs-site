import type { AuthRole, AuthUser } from "./types";
import { ROLE_DASHBOARD_PATHS } from "./roles";

const TOKEN_KEY = "fbs_token";
const USER_KEY = "fbs_user";

function getSessionAuthStorage(): Storage | null {
  if (typeof window === "undefined") return null;
  return window.sessionStorage;
}

function clearLegacyLocalAuthStorage() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(TOKEN_KEY);
  window.localStorage.removeItem(USER_KEY);
}

export function getStoredToken(): string | null {
  if (typeof window === "undefined") return null;
  clearLegacyLocalAuthStorage();
  return getSessionAuthStorage()?.getItem(TOKEN_KEY) ?? null;
}

export function setStoredToken(token: string) {
  clearLegacyLocalAuthStorage();
  getSessionAuthStorage()?.setItem(TOKEN_KEY, token);
}

export function removeStoredToken() {
  if (typeof window !== "undefined") {
    clearLegacyLocalAuthStorage();
    window.sessionStorage.removeItem(TOKEN_KEY);
    window.sessionStorage.removeItem(USER_KEY);
  }
}

export function getStoredUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  clearLegacyLocalAuthStorage();
  const data = getSessionAuthStorage()?.getItem(USER_KEY);
  if (!data) return null;
  try {
    return JSON.parse(data);
  } catch {
    return null;
  }
}

export function setStoredUser(user: AuthUser) {
  clearLegacyLocalAuthStorage();
  getSessionAuthStorage()?.setItem(USER_KEY, JSON.stringify(user));
}

export function decodeJwtPayload(
  token: string,
): { sub?: number; roles?: AuthRole[]; exp?: number } | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join(""),
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

export function getRoleFromToken(token?: string | null): AuthRole | null {
  const t = token ?? getStoredToken();
  if (!t) return null;
  const payload = decodeJwtPayload(t);
  if (payload && Array.isArray(payload.roles) && payload.roles.length > 0) {
    return payload.roles[0] as AuthRole;
  }
  return null;
}

export function getDashboardPathFromRole(role?: AuthRole | null): string {
  if (!role) return "/";
  return ROLE_DASHBOARD_PATHS[role] ?? "/";
}

export function getDashboardPathFromToken(token?: string | null): string {
  const role = getRoleFromToken(token);
  return getDashboardPathFromRole(role);
}
