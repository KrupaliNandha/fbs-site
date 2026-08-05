"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { authApi } from "@/app/lib/client/auth-api";
import { Button } from "@/app/Components/ui";

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
    <Button
      type="button"
      onClick={handleLogout}
      className="w-full h-10 bg-rose-500/15 hover:bg-rose-600 text-rose-400 hover:text-white border border-rose-500/30 shadow-sm hover:shadow-rose-600/30"
    >
      <LogOut size={16} />
      Sign out
    </Button>
  );
}
