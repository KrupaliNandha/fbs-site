"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { Edit, Plus, RefreshCw, ShieldCheck, Trash2 } from "lucide-react";
import { ROLE_LABELS } from "@/app/lib/auth/roles";
import type { AuthRole, AuthUser, UserPayload } from "@/app/lib/auth/types";
import { authApi } from "@/app/lib/client/auth-api";

type UserFormState = {
  id?: number;
  email: string;
  name: string;
  role: AuthRole;
  password: string;
  isActive: boolean;
};

const emptyForm: UserFormState = {
  email: "",
  name: "",
  role: "user",
  password: "",
  isActive: true,
};

export function UserManagement({ currentUserId }: { currentUserId: number }) {
  const [users, setUsers] = useState<AuthUser[]>([]);
  const [form, setForm] = useState<UserFormState>(emptyForm);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const editingUser = useMemo(
    () => users.find((user) => user.id === form.id),
    [form.id, users],
  );

  async function loadUsers() {
    setIsLoading(true);
    setError("");

    try {
      const response = await authApi.listUsers();
      setUsers(response.users);
    } catch (loadError) {
      setError(
        loadError instanceof Error ? loadError.message : "Unable to load users.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void loadUsers();
  }, []);

  function startEdit(user: AuthUser) {
    setNotice("");
    setError("");
    setForm({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.roles[0] ?? "user",
      password: "",
      isActive: user.isActive,
    });
  }

  function resetForm() {
    setForm(emptyForm);
    setError("");
    setNotice("");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setNotice("");
    setIsSaving(true);

    const payload: UserPayload = {
      email: form.email,
      name: form.name,
      role: form.role,
      isActive: form.isActive,
      ...(form.password ? { password: form.password } : {}),
    };

    try {
      if (form.id) {
        await authApi.updateUser(form.id, payload);
        setNotice("User updated.");
      } else {
        await authApi.createUser(payload);
        setNotice("User created.");
      }

      resetForm();
      await loadUsers();
    } catch (saveError) {
      setError(
        saveError instanceof Error ? saveError.message : "Unable to save user.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  async function toggleActive(user: AuthUser) {
    setError("");
    setNotice("");

    try {
      await authApi.updateUser(user.id, { isActive: !user.isActive });
      setNotice(user.isActive ? "User deactivated." : "User activated.");
      await loadUsers();
    } catch (toggleError) {
      setError(
        toggleError instanceof Error
          ? toggleError.message
          : "Unable to update user status.",
      );
    }
  }

  async function removeUser(user: AuthUser) {
    if (user.id === currentUserId) {
      setError("You cannot delete your own account while signed in.");
      return;
    }

    const confirmed = window.confirm(`Delete ${user.email}?`);

    if (!confirmed) {
      return;
    }

    setError("");
    setNotice("");

    try {
      await authApi.deleteUser(user.id);
      setNotice("User deleted.");
      await loadUsers();
    } catch (deleteError) {
      setError(
        deleteError instanceof Error ? deleteError.message : "Unable to delete user.",
      );
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(320px,380px)_1fr]">
      <section className="rounded-lg border border-black/10 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center gap-2">
          <ShieldCheck className="text-primary" size={22} />
          <h2 className="text-lg font-bold text-primary-dark">
            {form.id ? "Edit Account" : "Create Account"}
          </h2>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <label className="block">
            <span className="text-sm font-medium text-primary-dark">Name</span>
            <input
              value={form.name}
              onChange={(event) => setForm({ ...form, name: event.target.value })}
              className="mt-1 min-h-11 w-full rounded-md border border-black/15 px-3 outline-none focus:border-primary"
              required
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-primary-dark">Email</span>
            <input
              type="email"
              value={form.email}
              onChange={(event) => setForm({ ...form, email: event.target.value })}
              className="mt-1 min-h-11 w-full rounded-md border border-black/15 px-3 outline-none focus:border-primary"
              required
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-primary-dark">Role</span>
            <select
              value={form.role}
              onChange={(event) =>
                setForm({ ...form, role: event.target.value as AuthRole })
              }
              className="mt-1 min-h-11 w-full rounded-md border border-black/15 px-3 outline-none focus:border-primary"
            >
              <option value="designer">{ROLE_LABELS.designer}</option>
              <option value="user">{ROLE_LABELS.user}</option>
              <option value="super_admin">{ROLE_LABELS.super_admin}</option>
            </select>
          </label>

          <label className="block">
            <span className="text-sm font-medium text-primary-dark">
              Password{form.id ? " (leave blank to keep current)" : ""}
            </span>
            <input
              type="password"
              value={form.password}
              onChange={(event) =>
                setForm({ ...form, password: event.target.value })
              }
              className="mt-1 min-h-11 w-full rounded-md border border-black/15 px-3 outline-none focus:border-primary"
              required={!form.id}
              autoComplete="new-password"
            />
          </label>

          <label className="flex items-center gap-3 text-sm font-medium text-primary-dark">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(event) =>
                setForm({ ...form, isActive: event.target.checked })
              }
              className="h-4 w-4 accent-primary"
            />
            Active account
          </label>

          {editingUser ? (
            <p className="text-xs text-primary-dark/60">
              Editing {editingUser.email}
            </p>
          ) : null}

          {error ? (
            <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </p>
          ) : null}

          {notice ? (
            <p className="rounded-md bg-green-50 px-3 py-2 text-sm text-green-700">
              {notice}
            </p>
          ) : null}

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex min-h-10 flex-1 items-center justify-center gap-2 rounded-md bg-primary px-3 text-sm font-semibold text-white transition hover:bg-primary/90 disabled:opacity-60"
            >
              <Plus size={17} />
              {isSaving ? "Saving..." : form.id ? "Save" : "Create"}
            </button>
            {form.id ? (
              <button
                type="button"
                onClick={resetForm}
                className="min-h-10 rounded-md border border-black/15 px-3 text-sm font-semibold text-primary-dark transition hover:bg-black/5"
              >
                Cancel
              </button>
            ) : null}
          </div>
        </form>
      </section>

      <section className="overflow-hidden rounded-lg border border-black/10 bg-white shadow-sm">
        <div className="flex items-center justify-between gap-4 border-b border-black/10 p-5">
          <div>
            <h2 className="text-lg font-bold text-primary-dark">All Users</h2>
            <p className="text-sm text-primary-dark/60">
              Manage account access, roles, and status.
            </p>
          </div>
          <button
            type="button"
            onClick={() => void loadUsers()}
            className="inline-flex min-h-10 items-center gap-2 rounded-md border border-black/15 px-3 text-sm font-semibold text-primary-dark transition hover:bg-black/5"
          >
            <RefreshCw size={17} />
            Refresh
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="bg-black/[0.03] text-primary-dark">
              <tr>
                <th className="px-5 py-3 font-semibold">Name</th>
                <th className="px-5 py-3 font-semibold">Email</th>
                <th className="px-5 py-3 font-semibold">Role</th>
                <th className="px-5 py-3 font-semibold">Status</th>
                <th className="px-5 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/10">
              {isLoading ? (
                <tr>
                  <td className="px-5 py-6 text-primary-dark/60" colSpan={5}>
                    Loading users...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td className="px-5 py-6 text-primary-dark/60" colSpan={5}>
                    No users found.
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id}>
                    <td className="px-5 py-4 font-medium text-primary-dark">
                      {user.name}
                    </td>
                    <td className="px-5 py-4 text-primary-dark/70">{user.email}</td>
                    <td className="px-5 py-4 text-primary-dark/70">
                      {user.roles
                        .map((role) => ROLE_LABELS[role] ?? role)
                        .join(", ")}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-2 py-1 text-xs font-semibold ${
                          user.isActive
                            ? "bg-green-50 text-green-700"
                            : "bg-black/5 text-primary-dark/60"
                        }`}
                      >
                        {user.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => startEdit(user)}
                          className="inline-flex min-h-9 items-center gap-2 rounded-md border border-black/15 px-2 text-xs font-semibold text-primary-dark transition hover:bg-black/5"
                        >
                          <Edit size={15} />
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => void toggleActive(user)}
                          disabled={user.id === currentUserId && user.isActive}
                          className="min-h-9 rounded-md border border-black/15 px-2 text-xs font-semibold text-primary-dark transition hover:bg-black/5 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {user.isActive ? "Deactivate" : "Activate"}
                        </button>
                        <button
                          type="button"
                          onClick={() => void removeUser(user)}
                          disabled={user.id === currentUserId}
                          className="inline-flex min-h-9 items-center gap-2 rounded-md border border-red-200 px-2 text-xs font-semibold text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <Trash2 size={15} />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
