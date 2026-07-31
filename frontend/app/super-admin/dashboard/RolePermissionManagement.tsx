"use client";

import { useEffect, useState } from "react";
import { Save, SlidersHorizontal } from "lucide-react";
import { ROLE_LABELS } from "@/app/lib/auth/roles";
import type { AuthRole, Permission } from "@/app/lib/auth/types";
import { authApi } from "@/app/lib/client/auth-api";

type RoleRecord = {
  slug: AuthRole;
  name: string;
  permissions: Permission[];
};

export function RolePermissionManagement() {
  const [roles, setRoles] = useState<RoleRecord[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [drafts, setDrafts] = useState<Record<AuthRole, Permission[]>>({
    super_admin: [],
    designer: [],
    user: [],
  });
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [savingRole, setSavingRole] = useState<AuthRole | null>(null);

  async function loadRoles() {
    setError("");

    try {
      const response = await authApi.listRoles();
      setRoles(response.roles as RoleRecord[]);
      setPermissions(response.permissions);
      setDrafts(
        response.roles.reduce(
          (nextDrafts, role) => ({
            ...nextDrafts,
            [role.slug]: role.permissions as Permission[],
          }),
          { super_admin: [], designer: [], user: [] } as Record<AuthRole, Permission[]>,
        ),
      );
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Unable to load role permissions.",
      );
    }
  }

  useEffect(() => {
    void loadRoles();
  }, []);

  function togglePermission(role: AuthRole, permission: Permission) {
    if (role === "super_admin") {
      return;
    }

    const currentPermissions = drafts[role] ?? [];
    const nextPermissions = currentPermissions.includes(permission)
      ? currentPermissions.filter((item) => item !== permission)
      : [...currentPermissions, permission];

    setDrafts({ ...drafts, [role]: nextPermissions });
  }

  async function saveRole(role: AuthRole) {
    setSavingRole(role);
    setError("");
    setNotice("");

    try {
      const response = await authApi.updateRolePermissions(role, drafts[role] ?? []);
      setRoles(response.roles as RoleRecord[]);
      setNotice(`${ROLE_LABELS[role]} permissions updated.`);
      await loadRoles();
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "Unable to update role permissions.",
      );
    } finally {
      setSavingRole(null);
    }
  }

  return (
    <section className="mt-6 rounded-lg border border-black/10 bg-white p-5 shadow-sm">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="text-primary" size={22} />
          <div>
            <h2 className="text-lg font-bold text-primary-dark">
              Role Permissions
            </h2>
            <p className="text-sm text-primary-dark/60">
              Update the permissions assigned to Designer and User roles.
            </p>
          </div>
        </div>
      </div>

      {error ? (
        <p className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      {notice ? (
        <p className="mb-4 rounded-md bg-green-50 px-3 py-2 text-sm text-green-700">
          {notice}
        </p>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-3">
        {roles.map((role) => (
          <div key={role.slug} className="rounded-lg border border-black/10 p-4">
            <div className="mb-3 flex items-center justify-between gap-3">
              <h3 className="font-bold text-primary-dark">
                {ROLE_LABELS[role.slug]}
              </h3>
              <button
                type="button"
                onClick={() => void saveRole(role.slug)}
                disabled={role.slug === "super_admin" || savingRole === role.slug}
                className="inline-flex min-h-9 items-center gap-2 rounded-md border border-black/15 px-2 text-xs font-semibold text-primary-dark transition hover:bg-black/5 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Save size={15} />
                {savingRole === role.slug ? "Saving" : "Save"}
              </button>
            </div>

            <div className="space-y-2">
              {permissions.map((permission) => (
                <label
                  key={`${role.slug}-${permission}`}
                  className="flex items-center gap-2 text-sm text-primary-dark/75"
                >
                  <input
                    type="checkbox"
                    checked={(drafts[role.slug] ?? []).includes(permission)}
                    disabled={role.slug === "super_admin"}
                    onChange={() => togglePermission(role.slug, permission)}
                    className="h-4 w-4 accent-primary"
                  />
                  <span>{permission}</span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
