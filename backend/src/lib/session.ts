import { randomUUID } from "crypto";
import type { CookieOptions, Request, Response } from "express";
import { AuthError } from "./errors.js";
import { createSessionToken, verifySessionToken } from "./jwt.js";
import { ROLE_DASHBOARD_PATHS } from "./roles.js";
import { initializeAuthDatabase } from "./db.js";
import { verifyPassword } from "./password.js";
import { getUserByEmailWithPassword, getUserById } from "./users.js";
import type { AuthRole, AuthUser, Permission } from "./types.js";

export const SESSION_COOKIE_NAME = "fbs_session";
const SESSION_TTL_SECONDS = 60 * 60 * 8;

function getCookieOptions(expires: Date): CookieOptions {
  return {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires,
  };
}

export async function loginWithRole(
  email: string,
  password: string,
  requestedRole: AuthRole,
): Promise<{ user: AuthUser; token: string; expiresAt: Date; redirectTo: string }> {
  const user = await getUserByEmailWithPassword(email);

  if (!user || !(await verifyPassword(password, user.passwordHash))) {
    throw new AuthError("Invalid email or password.", 401);
  }

  if (!user.isActive) {
    throw new AuthError("This account is inactive.", 403);
  }

  if (!user.roles.includes(requestedRole)) {
    throw new AuthError("This login page is not enabled for your role.", 403);
  }

  const sessionId = randomUUID();
  const expiresAt = new Date(Date.now() + SESSION_TTL_SECONDS * 1000);
  const token = createSessionToken({
    sid: sessionId,
    sub: user.id,
    roles: user.roles,
    exp: Math.floor(expiresAt.getTime() / 1000),
  });

  return {
    user,
    token,
    expiresAt,
    redirectTo: ROLE_DASHBOARD_PATHS[requestedRole],
  };
}

export function setSessionCookie(res: Response, token: string, expiresAt: Date) {
  res.cookie(SESSION_COOKIE_NAME, token, getCookieOptions(expiresAt));
}

export function clearSessionCookie(res: Response) {
  res.cookie(SESSION_COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
}

export async function getUserFromSessionToken(token: string): Promise<AuthUser | null> {
  const payload = verifySessionToken(token);

  if (!payload) {
    return null;
  }

  const user = await getUserById(payload.sub);

  if (!user?.isActive) {
    return null;
  }

  return user;
}

export async function getCurrentUser(req: Request): Promise<AuthUser | null> {
  const token = req.cookies?.[SESSION_COOKIE_NAME];

  if (!token || typeof token !== "string") {
    return null;
  }

  return getUserFromSessionToken(token);
}

export async function logoutCurrentSession() {
  await initializeAuthDatabase();
}

export async function requireUser(req: Request): Promise<AuthUser> {
  const user = await getCurrentUser(req);

  if (!user) {
    throw new AuthError("Authentication required.", 401);
  }

  return user;
}

export async function requirePermission(
  req: Request,
  permission: Permission,
): Promise<AuthUser> {
  const user = await requireUser(req);

  if (!user.permissions.includes(permission)) {
    throw new AuthError("You do not have permission to perform this action.", 403);
  }

  return user;
}
