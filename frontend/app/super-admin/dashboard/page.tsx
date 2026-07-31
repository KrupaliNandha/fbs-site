import type { Metadata } from "next";
import { DashboardFrame } from "@/app/Components/auth/DashboardFrame";
import { requireRole } from "@/app/lib/auth/session";
import { RolePermissionManagement } from "./RolePermissionManagement";
import { UserManagement } from "./UserManagement";

export const metadata: Metadata = {
  title: "Super Admin Dashboard | FBS Prints",
};

export default async function SuperAdminDashboardPage() {
  const user = await requireRole("super_admin");

  return (
    <DashboardFrame
      title="Super Admin Dashboard"
      subtitle="Central account, role, and access management."
    >
      <UserManagement currentUserId={user.id} />
      <RolePermissionManagement />
    </DashboardFrame>
  );
}
