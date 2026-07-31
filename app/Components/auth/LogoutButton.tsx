"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { authApi } from "@/app/lib/client/auth-api";

export function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await authApi.logout();
    router.push("/");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="inline-flex min-h-10 items-center gap-2 rounded-md border border-black/15 px-3 text-sm font-semibold text-primary-dark transition hover:bg-black/5"
    >
      <LogOut size={17} />
      Sign out
    </button>
  );
}
