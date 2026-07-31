import type { Metadata } from "next";
import { LoginForm } from "@/app/Components/auth/LoginForm";

export const metadata: Metadata = {
  title: "Super Admin Login | FBS Prints",
};

export default function SuperAdminLoginPage() {
  return <LoginForm role="super_admin" title="Super Admin Login" />;
}
