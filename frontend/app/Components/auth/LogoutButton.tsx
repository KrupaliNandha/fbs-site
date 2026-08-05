"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, X } from "lucide-react";
import { authApi } from "@/app/lib/client/auth-api";
import { Button } from "@/app/Components/ui";

export function LogoutButton() {
  const router = useRouter();
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  async function handleLogout() {
    setIsLoggingOut(true);
    try {
      await authApi.logout();
    } finally {
      router.push("/");
      router.refresh();
    }
  }

  return (
    <>
    <Button
      type="button"
      onClick={() => setShowConfirm(true)}
      className="w-full h-10 bg-white/10 hover:bg-white text-white hover:text-slate-900 border border-white/20 shadow-sm"
    >
      <LogOut size={16} />
      Sign out
    </Button>
    {showConfirm && (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
        role="dialog"
        aria-modal="true"
        aria-label="Confirm sign out"
        onClick={(event) => {
          if (event.target === event.currentTarget && !isLoggingOut) {
            setShowConfirm(false);
          }
        }}
      >
        <div className="w-full max-w-sm rounded-lg border border-slate-200 bg-white p-5 text-left text-slate-900 shadow-2xl">
          <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-base font-extrabold text-slate-900">
                Sign out?
              </h3>
              <p className="mt-1 text-sm font-medium text-slate-500">
                Please confirm before ending this session.
              </p>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              disabled={isLoggingOut}
              onClick={() => setShowConfirm(false)}
              className="text-slate-400 hover:text-slate-700"
              aria-label="Close logout confirmation"
            >
              <X size={18} />
            </Button>
          </div>

          <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm font-medium text-slate-700">
            You will be redirected to the home page after signing out.
          </div>

          <div className="mt-5 flex items-center justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              disabled={isLoggingOut}
              onClick={() => setShowConfirm(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              disabled={isLoggingOut}
              onClick={() => void handleLogout()}
              className="bg-slate-800 text-white hover:bg-slate-900"
            >
              <LogOut size={16} />
              {isLoggingOut ? "Signing out..." : "Yes, sign out"}
            </Button>
          </div>
        </div>
      </div>
    )}
    </>
  );
}
