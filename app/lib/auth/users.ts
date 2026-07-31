import "server-only";

import type Database from "better-sqlite3";
import { ROLE_PERMISSIONS, isAuthRole } from "./roles";
import { getAuthDatabase } from "./db";
import { AuthError } from "./errors";
import { hashPassword, validatePasswordStrength } from "./password";
import type { AuthRole, AuthUser, Permission, UserPayload } from "./types";

type UserRow = {
  id: number;
  email: string;
  name: string;
  password_hash?: string;
  is_active: 0 | 1;
  roles: string | null;
  permissions: string | null;
  created_at: string;
  updated_at: string;
};

type RoleRow = {
  slug: AuthRole;
  name: string;
  description: string | null;
  permissions: string | null;
};

let bootstrapChecked = false;

const USER_SELECT = `
  SELECT
    users.id,
    users.email,
    users.name,
    users.is_active,
    users.created_at,
    users.updated_at,
    GROUP_CONCAT(DISTINCT roles.slug) AS roles,
    GROUP_CONCAT(DISTINCT permissions.slug) AS permissions
  FROM users
  LEFT JOIN user_roles ON user_roles.user_id = users.id
  LEFT JOIN roles ON roles.id = user_roles.role_id
  LEFT JOIN role_permissions ON role_permissions.role_id = roles.id
  LEFT JOIN permissions ON permissions.id = role_permissions.permission_id
`;

function mapUser(row: UserRow): AuthUser {
  return {
    id: row.id,
    email: row.email,
    name: row.name,
    isActive: row.is_active === 1,
    roles: splitCsv(row.roles).filter(isAuthRole),
    permissions: splitCsv(row.permissions) as Permission[],
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function splitCsv(value: string | null): string[] {
  return value ? value.split(",").filter(Boolean) : [];
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function assertEmail(email: string) {
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new AuthError("Enter a valid email address.");
  }
}

function assertName(name: string) {
  if (name.trim().length < 2) {
    throw new AuthError("Name must be at least 2 characters.");
  }
}

function assertRole(role: string): asserts role is AuthRole {
  if (!isAuthRole(role)) {
    throw new AuthError("Unsupported role.");
  }
}

function audit(
  db: Database.Database,
  action: string,
  actorUserId?: number,
  targetUserId?: number,
  metadata?: Record<string, unknown>,
) {
  db.prepare(
    `
      INSERT INTO audit_events (actor_user_id, action, target_user_id, metadata)
      VALUES (?, ?, ?, ?)
    `,
  ).run(
    actorUserId ?? null,
    action,
    targetUserId ?? null,
    metadata ? JSON.stringify(metadata) : null,
  );
}

export async function ensureBootstrapSuperAdmin() {
  if (bootstrapChecked) {
    return;
  }

  bootstrapChecked = true;

  const email = process.env.AUTH_BOOTSTRAP_SUPER_ADMIN_EMAIL;
  const password = process.env.AUTH_BOOTSTRAP_SUPER_ADMIN_PASSWORD;

  if (!email || !password) {
    return;
  }

  const db = getAuthDatabase();
  const existingSuperAdmin = db
    .prepare(
      `
        SELECT users.id
        FROM users
        JOIN user_roles ON user_roles.user_id = users.id
        JOIN roles ON roles.id = user_roles.role_id
        WHERE roles.slug = 'super_admin'
        LIMIT 1
      `,
    )
    .get();

  if (existingSuperAdmin) {
    return;
  }

  await createUser(
    {
      email,
      name: process.env.AUTH_BOOTSTRAP_SUPER_ADMIN_NAME ?? "Super Admin",
      password,
      role: "super_admin",
      isActive: true,
    },
    undefined,
    "bootstrap_super_admin",
  );
}

export function getUserByEmailWithPassword(email: string): (AuthUser & { passwordHash: string }) | null {
  const db = getAuthDatabase();
  const row = db
    .prepare(
      `
        ${USER_SELECT}, users.password_hash
        WHERE users.email = ?
        GROUP BY users.id
      `,
    )
    .get(normalizeEmail(email)) as UserRow | undefined;

  if (!row || !row.password_hash) {
    return null;
  }

  return { ...mapUser(row), passwordHash: row.password_hash };
}

export function getUserById(id: number): AuthUser | null {
  const db = getAuthDatabase();
  const row = db
    .prepare(
      `
        ${USER_SELECT}
        WHERE users.id = ?
        GROUP BY users.id
      `,
    )
    .get(id) as UserRow | undefined;

  return row ? mapUser(row) : null;
}

export function listUsers(): AuthUser[] {
  const db = getAuthDatabase();
  const rows = db
    .prepare(
      `
        ${USER_SELECT}
        GROUP BY users.id
        ORDER BY users.created_at DESC, users.id DESC
      `,
    )
    .all() as UserRow[];

  return rows.map(mapUser);
}

export function listRoles() {
  const db = getAuthDatabase();
  const rows = db
    .prepare(
      `
        SELECT
          roles.slug,
          roles.name,
          roles.description,
          GROUP_CONCAT(permissions.slug) AS permissions
        FROM roles
        LEFT JOIN role_permissions ON role_permissions.role_id = roles.id
        LEFT JOIN permissions ON permissions.id = role_permissions.permission_id
        GROUP BY roles.id
        ORDER BY roles.id
      `,
    )
    .all() as RoleRow[];

  return rows.map((role) => ({
    ...role,
    permissions: splitCsv(role.permissions) as Permission[],
  }));
}

export function listPermissions(): Permission[] {
  const db = getAuthDatabase();
  const rows = db
    .prepare("SELECT slug FROM permissions ORDER BY slug")
    .all() as { slug: Permission }[];

  return rows.map((row) => row.slug);
}

export function updateRolePermissions(
  role: AuthRole,
  permissions: Permission[],
  actorUserId?: number,
) {
  assertRole(role);

  const uniquePermissions = [...new Set(permissions)];
  const availablePermissions = new Set(listPermissions());
  const invalidPermissions = uniquePermissions.filter(
    (permission) => !availablePermissions.has(permission),
  );

  if (invalidPermissions.length > 0) {
    throw new AuthError("One or more permissions are invalid.");
  }

  if (role === "super_admin") {
    const requiredSuperAdminPermissions = ROLE_PERMISSIONS.super_admin;
    const missingRequiredPermission = requiredSuperAdminPermissions.find(
      (permission) => !uniquePermissions.includes(permission),
    );

    if (missingRequiredPermission) {
      throw new AuthError(
        "Super Admin permissions must include full system access.",
      );
    }
  }

  const db = getAuthDatabase();

  db.transaction(() => {
    const roleRow = db
      .prepare("SELECT id FROM roles WHERE slug = ?")
      .get(role) as { id: number } | undefined;

    if (!roleRow) {
      throw new AuthError("Role not found.", 404);
    }

    db.prepare("DELETE FROM role_permissions WHERE role_id = ?").run(roleRow.id);

    const insertRolePermission = db.prepare(
      `
        INSERT INTO role_permissions (role_id, permission_id)
        SELECT ?, id FROM permissions WHERE slug = ?
      `,
    );

    uniquePermissions.forEach((permission) => {
      insertRolePermission.run(roleRow.id, permission);
    });

    audit(db, "update_role_permissions", actorUserId, undefined, {
      role,
      permissions: uniquePermissions,
    });
  })();
}

export async function createUser(
  payload: UserPayload,
  actorUserId?: number,
  action = "create_user",
): Promise<AuthUser> {
  assertRole(payload.role);
  assertEmail(payload.email);
  assertName(payload.name);

  if (!payload.password) {
    throw new AuthError("Password is required.");
  }

  const passwordError = validatePasswordStrength(payload.password);

  if (passwordError) {
    throw new AuthError(passwordError);
  }

  const db = getAuthDatabase();
  const passwordHash = await hashPassword(payload.password);
  const email = normalizeEmail(payload.email);

  try {
    const userId = db.transaction(() => {
      const result = db
        .prepare(
          `
            INSERT INTO users (email, name, password_hash, is_active)
            VALUES (?, ?, ?, ?)
          `,
        )
        .run(email, payload.name.trim(), passwordHash, payload.isActive === false ? 0 : 1);

      db.prepare(
        `
          INSERT INTO user_roles (user_id, role_id)
          SELECT ?, id FROM roles WHERE slug = ?
        `,
      ).run(result.lastInsertRowid, payload.role);

      audit(db, action, actorUserId, Number(result.lastInsertRowid), {
        role: payload.role,
      });

      return Number(result.lastInsertRowid);
    })();

    const user = getUserById(userId);

    if (!user) {
      throw new AuthError("Unable to load created user.", 500);
    }

    return user;
  } catch (error) {
    if (
      error instanceof Error &&
      "code" in error &&
      error.code === "SQLITE_CONSTRAINT_UNIQUE"
    ) {
      throw new AuthError("A user with this email already exists.", 409);
    }

    throw error;
  }
}

export async function updateUser(
  id: number,
  payload: Partial<UserPayload>,
  actorUserId?: number,
): Promise<AuthUser> {
  const currentUser = getUserById(id);

  if (!currentUser) {
    throw new AuthError("User not found.", 404);
  }

  if (payload.email !== undefined) {
    assertEmail(payload.email);
  }

  if (payload.name !== undefined) {
    assertName(payload.name);
  }

  if (payload.role !== undefined) {
    assertRole(payload.role);
  }

  let passwordHash: string | undefined;

  if (payload.password) {
    const passwordError = validatePasswordStrength(payload.password);

    if (passwordError) {
      throw new AuthError(passwordError);
    }

    passwordHash = await hashPassword(payload.password);
  }

  const db = getAuthDatabase();

  try {
    db.transaction(() => {
      db.prepare(
        `
          UPDATE users
          SET
            email = COALESCE(?, email),
            name = COALESCE(?, name),
            password_hash = COALESCE(?, password_hash),
            is_active = COALESCE(?, is_active),
            updated_at = CURRENT_TIMESTAMP
          WHERE id = ?
        `,
      ).run(
        payload.email ? normalizeEmail(payload.email) : null,
        payload.name ? payload.name.trim() : null,
        passwordHash ?? null,
        payload.isActive === undefined ? null : payload.isActive ? 1 : 0,
        id,
      );

      if (payload.role) {
        db.prepare("DELETE FROM user_roles WHERE user_id = ?").run(id);
        db.prepare(
          `
            INSERT INTO user_roles (user_id, role_id)
            SELECT ?, id FROM roles WHERE slug = ?
          `,
        ).run(id, payload.role);
      }

      if (payload.isActive === false) {
        db.prepare(
          "UPDATE sessions SET revoked_at = CURRENT_TIMESTAMP WHERE user_id = ? AND revoked_at IS NULL",
        ).run(id);
      }

      audit(db, "update_user", actorUserId, id, {
        emailChanged: payload.email !== undefined,
        nameChanged: payload.name !== undefined,
        role: payload.role,
        isActive: payload.isActive,
        passwordChanged: Boolean(passwordHash),
      });
    })();

    const updatedUser = getUserById(id);

    if (!updatedUser) {
      throw new AuthError("Unable to load updated user.", 500);
    }

    return updatedUser;
  } catch (error) {
    if (
      error instanceof Error &&
      "code" in error &&
      error.code === "SQLITE_CONSTRAINT_UNIQUE"
    ) {
      throw new AuthError("A user with this email already exists.", 409);
    }

    throw error;
  }
}

export function deleteUser(id: number, actorUserId?: number) {
  const db = getAuthDatabase();
  const user = getUserById(id);

  if (!user) {
    throw new AuthError("User not found.", 404);
  }

  db.transaction(() => {
    audit(db, "delete_user", actorUserId, id, { email: user.email });
    db.prepare("DELETE FROM users WHERE id = ?").run(id);
  })();
}
