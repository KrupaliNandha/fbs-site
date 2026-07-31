import "server-only";

import Database from "better-sqlite3";
import { mkdirSync } from "fs";
import path from "path";
import { ROLE_LABELS, ROLE_PERMISSIONS } from "./roles";
import type { AuthRole, Permission } from "./types";

const databasePath =
  process.env.AUTH_DATABASE_PATH ?? path.join(process.cwd(), "data", "auth.sqlite");

let database: Database.Database | null = null;

export function getAuthDatabase(): Database.Database {
  if (!database) {
    mkdirSync(path.dirname(databasePath), { recursive: true });
    database = new Database(databasePath);
    database.pragma("foreign_keys = ON");
    initializeAuthDatabase(database);
  }

  return database;
}

function initializeAuthDatabase(db: Database.Database) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS roles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL,
      description TEXT,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS permissions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT NOT NULL UNIQUE,
      description TEXT,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS role_permissions (
      role_id INTEGER NOT NULL,
      permission_id INTEGER NOT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (role_id, permission_id),
      FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
      FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL UNIQUE COLLATE NOCASE,
      name TEXT NOT NULL,
      password_hash TEXT NOT NULL,
      is_active INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS user_roles (
      user_id INTEGER NOT NULL,
      role_id INTEGER NOT NULL,
      assigned_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (user_id, role_id),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE RESTRICT
    );

    CREATE TABLE IF NOT EXISTS sessions (
      id TEXT PRIMARY KEY,
      user_id INTEGER NOT NULL,
      expires_at TEXT NOT NULL,
      revoked_at TEXT,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS audit_events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      actor_user_id INTEGER,
      action TEXT NOT NULL,
      target_user_id INTEGER,
      metadata TEXT,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (actor_user_id) REFERENCES users(id) ON DELETE SET NULL,
      FOREIGN KEY (target_user_id) REFERENCES users(id) ON DELETE SET NULL
    );

    CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);
    CREATE INDEX IF NOT EXISTS idx_user_roles_role_id ON user_roles(role_id);
    CREATE INDEX IF NOT EXISTS idx_role_permissions_permission_id ON role_permissions(permission_id);
  `);

  seedRolesAndPermissions(db);
}

function seedRolesAndPermissions(db: Database.Database) {
  const insertRole = db.prepare(
    "INSERT OR IGNORE INTO roles (slug, name, description) VALUES (?, ?, ?)",
  );
  const insertPermission = db.prepare(
    "INSERT OR IGNORE INTO permissions (slug, description) VALUES (?, ?)",
  );
  const insertRolePermission = db.prepare(
    `
      INSERT OR IGNORE INTO role_permissions (role_id, permission_id)
      SELECT roles.id, permissions.id
      FROM roles, permissions
      WHERE roles.slug = ? AND permissions.slug = ?
    `,
  );

  const transaction = db.transaction(() => {
    for (const [role, label] of Object.entries(ROLE_LABELS) as [AuthRole, string][]) {
      insertRole.run(role, label, `${label} application role`);
    }

    const permissions = new Set<Permission>();
    Object.values(ROLE_PERMISSIONS).forEach((items) => {
      items.forEach((permission) => permissions.add(permission));
    });

    permissions.forEach((permission) => {
      insertPermission.run(permission, `${permission} permission`);
    });

    for (const [role, permissionsForRole] of Object.entries(ROLE_PERMISSIONS) as [
      AuthRole,
      Permission[],
    ][]) {
      permissionsForRole.forEach((permission) => {
        insertRolePermission.run(role, permission);
      });
    }
  });

  transaction();
}
