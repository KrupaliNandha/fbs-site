"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { authApi } from "@/app/lib/client/auth-api";

export function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    try {
      await authApi.logout();
    } finally {
      router.push("/");
      router.refresh();
    }
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="w-full flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl bg-rose-500/15 hover:bg-rose-600 text-rose-400 hover:text-white border border-rose-500/30 font-bold text-xs transition-all shadow-sm cursor-pointer hover:shadow-rose-600/30"
    >
      <LogOut size={16} />
      Sign out
    </button>
  );
}
