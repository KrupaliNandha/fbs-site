"use client";

import type {
  AuthRole,
  AuthUser,
  LoginResponse,
  Permission,
  UserPayload,
} from "@/app/lib/auth/types";

type RoleResponse = {
  roles: {
    slug: AuthRole;
    name: string;
    description: string | null;
    permissions: string[];
  }[];
  permissions: Permission[];
};

class ApiClientError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = "ApiClientError";
  }
}

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new ApiClientError(
      typeof data.message === "string" ? data.message : "Request failed.",
      response.status,
    );
  }

  return data as T;
}

export const authApi = {
  login(role: AuthRole, email: string, password: string) {
    return request<LoginResponse>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ role, email, password }),
    });
  },

  logout() {
    return request<{ ok: boolean }>("/api/auth/logout", { method: "POST" });
  },

  me() {
    return request<{ user: AuthUser }>("/api/auth/me");
  },

  listUsers() {
    return request<{ users: AuthUser[] }>("/api/users");
  },

  createUser(payload: UserPayload) {
    return request<{ user: AuthUser }>("/api/users", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  updateUser(id: number, payload: Partial<UserPayload>) {
    return request<{ user: AuthUser }>(`/api/users/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
  },

  deleteUser(id: number) {
    return request<{ ok: boolean }>(`/api/users/${id}`, { method: "DELETE" });
  },

  listRoles() {
    return request<RoleResponse>("/api/roles");
  },

  updateRolePermissions(role: AuthRole, permissions: Permission[]) {
    return request<Pick<RoleResponse, "roles">>(`/api/roles/${role}/permissions`, {
      method: "PATCH",
      body: JSON.stringify({ permissions }),
    });
  },
};
