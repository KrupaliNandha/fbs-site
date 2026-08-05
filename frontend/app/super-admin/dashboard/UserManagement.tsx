"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { Edit, Plus, RefreshCw, ShieldCheck, Trash2 } from "lucide-react";
import { ROLE_LABELS } from "@/app/lib/auth/roles";
import type { AuthRole, AuthUser, UserPayload } from "@/app/lib/auth/types";
import { authApi } from "@/app/lib/client/auth-api";
import { Button, Card, Input, Label, Select, Badge } from "@/app/Components/ui";

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

type UserManagementProps = {
  currentUserId: number;
  currentUserRoles: AuthRole[];
};

export function UserManagement({
  currentUserId,
  currentUserRoles,
}: UserManagementProps) {
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
  const canManageSuperAdmins = currentUserRoles.includes("super_admin");

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
    if (user.roles.includes("super_admin") && !canManageSuperAdmins) {
      setError("Only a Super Admin can edit Super Admin accounts.");
      return;
    }

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

    if (user.roles.includes("super_admin") && !canManageSuperAdmins) {
      setError("Only a Super Admin can delete Super Admin accounts.");
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
      <Card className="p-5 shadow-sm">
        <div className="mb-4 flex items-center gap-2">
          <ShieldCheck className="text-primary" size={22} />
          <h2 className="text-lg font-bold text-primary-dark">
            {form.id ? "Edit Account" : "Create Account"}
          </h2>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-1.5">
            <Label>Name</Label>
            <Input
              value={form.name}
              onChange={(event) => setForm({ ...form, name: event.target.value })}
              className="h-11 text-sm"
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label>Email</Label>
            <Input
              type="email"
              value={form.email}
              onChange={(event) => setForm({ ...form, email: event.target.value })}
              className="h-11 text-sm"
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label>Role</Label>
            <Select
              value={form.role}
              onChange={(event) =>
                setForm({ ...form, role: event.target.value as AuthRole })
              }
              className="h-11 text-sm"
            >
              <option value="designer">{ROLE_LABELS.designer}</option>
              <option value="user">{ROLE_LABELS.user}</option>
              {canManageSuperAdmins ? (
                <option value="super_admin">{ROLE_LABELS.super_admin}</option>
              ) : null}
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label>
              Password{form.id ? " (leave blank to keep current)" : ""}
            </Label>
            <Input
              type="password"
              value={form.password}
              onChange={(event) =>
                setForm({ ...form, password: event.target.value })
              }
              className="h-11 text-sm"
              required={!form.id}
              autoComplete="new-password"
            />
          </div>

          <Label className="flex items-center gap-3 font-medium cursor-pointer">
            <Input
              type="checkbox"
              checked={form.isActive}
              onChange={(event) =>
                setForm({ ...form, isActive: event.target.checked })
              }
              className="h-4 w-4 accent-primary shadow-none border-slate-300"
            />
            Active account
          </Label>

          {editingUser ? (
            <p className="text-xs text-primary-dark/60">
              Editing {editingUser.email}
            </p>
          ) : null}

          {error ? (
            <p className="rounded-xl bg-red-50 border border-red-100 px-3 py-2 text-sm text-red-700">
              {error}
            </p>
          ) : null}

          {notice ? (
            <p className="rounded-xl bg-green-50 border border-green-100 px-3 py-2 text-sm text-green-700">
              {notice}
            </p>
          ) : null}

          <div className="flex gap-2">
            <Button
              type="submit"
              disabled={isSaving}
              className="flex-1 h-10 bg-primary hover:bg-primary/90 text-sm"
            >
              <Plus size={17} />
              {isSaving ? "Saving..." : form.id ? "Save" : "Create"}
            </Button>
            {form.id ? (
              <Button type="button" variant="outline" onClick={resetForm} className="h-10 text-sm">
                Cancel
              </Button>
            ) : null}
          </div>
        </form>
      </Card>

      <Card className="overflow-hidden shadow-sm p-0">
        <div className="flex items-center justify-between gap-4 border-b border-slate-100 p-5">
          <div>
            <h2 className="text-lg font-bold text-primary-dark">All Users</h2>
            <p className="text-sm text-primary-dark/60">
              Manage account access, roles, and status.
            </p>
          </div>
          <Button type="button" variant="outline" onClick={() => void loadUsers()}>
            <RefreshCw size={17} />
            Refresh
          </Button>
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
                      <Badge variant={user.isActive ? "success" : "secondary"}>
                        {user.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex flex-wrap gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => startEdit(user)}
                          disabled={
                            user.roles.includes("super_admin") &&
                            !canManageSuperAdmins
                          }
                        >
                          <Edit size={15} />
                          Edit
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="secondary"
                          className="border border-indigo-200 bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
                          onClick={async () => {
                            const newPass = window.prompt(`Set new password for ${user.email}:`);
                            if (!newPass) return;
                            try {
                              await authApi.updateUser(user.id, { password: newPass });
                              alert(`Password for ${user.email} updated successfully!`);
                            } catch (e) {
                              alert(e instanceof Error ? e.message : "Failed to reset password.");
                            }
                          }}
                          disabled={
                            user.roles.includes("super_admin") &&
                            !canManageSuperAdmins
                          }
                        >
                          Reset Pass
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => void toggleActive(user)}
                          disabled={
                            (user.id === currentUserId && user.isActive) ||
                            (user.roles.includes("super_admin") &&
                              !canManageSuperAdmins)
                          }
                        >
                          {user.isActive ? "Deactivate" : "Activate"}
                        </Button>
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="border border-red-200"
                          onClick={() => void removeUser(user)}
                          disabled={
                            user.id === currentUserId ||
                            (user.roles.includes("super_admin") &&
                              !canManageSuperAdmins)
                          }
                        >
                          <Trash2 size={15} />
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
