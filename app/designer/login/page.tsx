import type { Metadata } from "next";
import { LoginForm } from "@/app/Components/auth/LoginForm";

export const metadata: Metadata = {
  title: "Designer Login | FBS Prints",
};

export default function DesignerLoginPage() {
  return <LoginForm role="designer" title="Designer Login" />;
}
