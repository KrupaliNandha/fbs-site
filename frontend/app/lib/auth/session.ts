import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ROLE_DASHBOARD_PATHS, ROLE_LOGIN_PATHS } from "./roles";
import type { AuthRole, AuthUser } from "./types";

export const SESSION_COOKIE_NAME = "fbs_session";

function getAuthApiBaseUrl() {
  return (
    process.env.AUTH_API_URL ??
    process.env.NEXT_PUBLIC_API_URL ??
    "http://localhost:4000"
  );
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!token) {
    return null;
  }

  try {
    const response = await fetch(`${getAuthApiBaseUrl()}/api/auth/me`, {
      headers: {
        Cookie: `${SESSION_COOKIE_NAME}=${token}`,
      },
      cache: "no-store",
    });

    if (!response.ok) {
      return null;
    }

    const data = (await response.json()) as { user?: AuthUser | null };
    return data.user ?? null;
  } catch (error) {
    console.error("[auth] Failed to resolve current user from backend.", error);
    return null;
  }
}

export async function requireRole(role: AuthRole): Promise<AuthUser> {
  const user = await getCurrentUser();

  if (!user) {
    redirect(ROLE_LOGIN_PATHS[role]);
  }

  if (!user.roles.includes(role)) {
    redirect(ROLE_DASHBOARD_PATHS[user.roles[0]] ?? "/");
  }

  return user;
}
