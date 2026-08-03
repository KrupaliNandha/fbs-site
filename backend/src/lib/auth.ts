import { randomUUID } from "crypto";
import type { Request } from "express";
import { AuthError } from "./errors.js";
import { createAuthToken, verifyAuthToken } from "./jwt.js";
import { initializeAuthDatabase } from "./db.js";
import { verifyPassword } from "./password.js";
import { getUserByEmailWithPassword, getUserById } from "./users.js";
import type { AuthRole, AuthUser, Permission } from "./types.js";

const TOKEN_TTL_SECONDS = 60 * 60 * 8;

export async function loginWithRole(
  email: string,
  password: string,
  requestedRole?: AuthRole,
): Promise<{ user: AuthUser; token: string; expiresAt: Date }> {
  const user = await getUserByEmailWithPassword(email);

  if (!user || !(await verifyPassword(password, user.passwordHash))) {
    throw new AuthError("Invalid email or password.", 401);
  }

  if (!user.isActive) {
    throw new AuthError("This account is inactive.", 403);
  }

  const activeRole =
    requestedRole && user.roles.includes(requestedRole)
      ? requestedRole
      : user.roles[0];

  if (!activeRole) {
    throw new AuthError("This account does not have a role assigned.", 403);
  }

  const tokenId = randomUUID();
  const expiresAt = new Date(Date.now() + TOKEN_TTL_SECONDS * 1000);
  const token = createAuthToken({
    tid: tokenId,
    sub: user.id,
    roles: user.roles,
    exp: Math.floor(expiresAt.getTime() / 1000),
  });

  return {
    user,
    token,
    expiresAt,
  };
}

export async function getUserFromToken(token: string): Promise<AuthUser | null> {
  const payload = verifyAuthToken(token);

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
  let token: string | undefined;

  if (req.headers.authorization?.startsWith("Bearer ")) {
    token = req.headers.authorization.substring(7).trim();
  }

  if (!token || typeof token !== "string") {
    return null;
  }

  return getUserFromToken(token);
}

export async function logoutUser() {
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

export function requireAuth() {
  return async (req: Request, res: any, next: any) => {
    const user = await getCurrentUser(req);
    if (!user) {
      res.status(401).json({ message: "Authentication required." });
      return;
    }
    (req as any).user = user;
    next();
  };
}
