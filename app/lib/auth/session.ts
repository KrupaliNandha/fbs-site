import "server-only";

import { randomUUID } from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";
import { AuthError } from "./errors";
import { createSessionToken, verifySessionToken } from "./jwt";
import { ROLE_DASHBOARD_PATHS, ROLE_LOGIN_PATHS } from "./roles";
import { getAuthDatabase } from "./db";
import { verifyPassword } from "./password";
import {
  ensureBootstrapSuperAdmin,
  getUserByEmailWithPassword,
  getUserById,
} from "./users";
import type { AuthRole, AuthUser, Permission } from "./types";

export const SESSION_COOKIE_NAME = "fbs_session";
const SESSION_TTL_SECONDS = 60 * 60 * 8;

function getCookieOptions(expires: Date) {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires,
  };
}

function toSqlDate(date: Date): string {
  return date.toISOString();
}

export async function loginWithRole(
  email: string,
  password: string,
  requestedRole: AuthRole,
): Promise<{ user: AuthUser; token: string; expiresAt: Date; redirectTo: string }> {
  await ensureBootstrapSuperAdmin();

  const user = getUserByEmailWithPassword(email);

  if (!user || !(await verifyPassword(password, user.passwordHash))) {
    throw new AuthError("Invalid email or password.", 401);
  }

  if (!user.isActive) {
    throw new AuthError("This account is inactive.", 403);
  }

  if (!user.roles.includes(requestedRole)) {
    throw new AuthError("This login page is not enabled for your role.", 403);
  }

  const db = getAuthDatabase();
  const sessionId = randomUUID();
  const expiresAt = new Date(Date.now() + SESSION_TTL_SECONDS * 1000);
  const token = createSessionToken({
    sid: sessionId,
    sub: user.id,
    roles: user.roles,
    exp: Math.floor(expiresAt.getTime() / 1000),
  });

  db.prepare(
    `
      INSERT INTO sessions (id, user_id, expires_at)
      VALUES (?, ?, ?)
    `,
  ).run(sessionId, user.id, toSqlDate(expiresAt));

  return {
    user,
    token,
    expiresAt,
    redirectTo: ROLE_DASHBOARD_PATHS[requestedRole],
  };
}

export function setSessionCookie(
  response: NextResponse,
  token: string,
  expiresAt: Date,
) {
  response.cookies.set(SESSION_COOKIE_NAME, token, getCookieOptions(expiresAt));
}

export function clearSessionCookie(response: NextResponse) {
  response.cookies.set(SESSION_COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!token) {
    return null;
  }

  return getUserFromSessionToken(token);
}

export function getUserFromSessionToken(token: string): AuthUser | null {
  const payload = verifySessionToken(token);

  if (!payload) {
    return null;
  }

  const db = getAuthDatabase();
  const session = db
    .prepare(
      `
        SELECT id
        FROM sessions
        WHERE id = ?
          AND user_id = ?
          AND revoked_at IS NULL
          AND datetime(expires_at) > datetime('now')
        LIMIT 1
      `,
    )
    .get(payload.sid, payload.sub);

  if (!session) {
    return null;
  }

  const user = getUserById(payload.sub);

  if (!user?.isActive) {
    return null;
  }

  return user;
}

export async function logoutCurrentSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  const payload = token ? verifySessionToken(token) : null;

  if (!payload) {
    return;
  }

  getAuthDatabase()
    .prepare(
      "UPDATE sessions SET revoked_at = CURRENT_TIMESTAMP WHERE id = ? AND revoked_at IS NULL",
    )
    .run(payload.sid);
}

export async function requireUser(): Promise<AuthUser> {
  const user = await getCurrentUser();

  if (!user) {
    throw new AuthError("Authentication required.", 401);
  }

  return user;
}

export async function requirePermission(permission: Permission): Promise<AuthUser> {
  const user = await requireUser();

  if (!user.permissions.includes(permission)) {
    throw new AuthError("You do not have permission to perform this action.", 403);
  }

  return user;
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
