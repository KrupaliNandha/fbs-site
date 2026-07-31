export const AUTH_ROLES = ["super_admin", "designer", "user"] as const;

export type AuthRole = (typeof AUTH_ROLES)[number];

export type Permission =
  | "users:read"
  | "users:create"
  | "users:update"
  | "users:delete"
  | "roles:read"
  | "roles:update"
  | "designer:dashboard"
  | "user:dashboard";

export type AuthUser = {
  id: number;
  email: string;
  name: string;
  isActive: boolean;
  roles: AuthRole[];
  permissions: Permission[];
  createdAt: string;
  updatedAt: string;
};

export type PublicUser = Omit<AuthUser, "permissions"> & {
  permissions?: Permission[];
};

export type LoginResponse = {
  user: AuthUser;
  redirectTo: string;
};

export type UserPayload = {
  email: string;
  name: string;
  role: AuthRole;
  password?: string;
  isActive?: boolean;
};
