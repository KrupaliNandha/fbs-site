import type { Metadata } from "next";
import { LoginForm } from "@/app/Components/auth/LoginForm";

export const metadata: Metadata = {
  title: "User Login | FBS Prints",
};

export default function UserLoginPage() {
  return <LoginForm role="user" title="User Login" />;
}
