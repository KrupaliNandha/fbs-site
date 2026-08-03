"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Mail } from "lucide-react";
import { authApi } from "@/app/lib/client/auth-api";
import type { AuthRole } from "@/app/lib/auth/types";
import {
  getDashboardPathFromRole,
  getRoleFromToken,
  getStoredToken,
} from "@/app/lib/auth/token";

type LoginFormProps = {
  role: AuthRole;
  title: string;
};

export function LoginForm({ role, title }: LoginFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // If token already exists in localStorage, decode role and redirect
    const token = getStoredToken();
    if (token) {
      const userRole = getRoleFromToken(token);
      if (userRole) {
        const targetPath = getDashboardPathFromRole(userRole);
        router.push(targetPath);
      }
    }
  }, [router]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const response = await authApi.login(role, email, password);
      // Detect role from JWT token stored in localStorage or from returned user
      const userRole =
        getRoleFromToken(response.token) ||
        (response.user?.roles?.[0] as AuthRole) ||
        role;

      const targetPath = getDashboardPathFromRole(userRole);
      router.push(targetPath);
      router.refresh();
    } catch (loginError) {
      setError(
        loginError instanceof Error
          ? loginError.message
          : "Unable to sign in right now.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-dvh bg-[#f7f8fb] px-5 py-10 flex items-center justify-center">
      <section className="w-full max-w-md rounded-lg border border-black/10 bg-white p-6 shadow-sm">
        <div className="mb-6">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">
            FBS Prints
          </p>
          <h1 className="mt-2 text-2xl font-bold text-primary-dark">{title}</h1>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <label className="block">
            <span className="text-sm font-medium text-primary-dark">Email</span>
            <span className="mt-1 flex items-center gap-2 rounded-md border border-black/15 bg-white px-3">
              <Mail size={18} className="text-primary-dark/50" />
              <input
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="min-h-11 w-full outline-none"
                required
              />
            </span>
          </label>

          <label className="block">
            <span className="text-sm font-medium text-primary-dark">Password</span>
            <span className="mt-1 flex items-center gap-2 rounded-md border border-black/15 bg-white px-3">
              <Lock size={18} className="text-primary-dark/50" />
              <input
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="min-h-11 w-full outline-none"
                required
              />
            </span>
          </label>

          {error ? (
            <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={isSubmitting}
            className="min-h-11 w-full rounded-md bg-primary px-4 font-semibold text-white transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
          >
            {isSubmitting ? "Signing in..." : "Sign in"}
          </button>
        </form>

        {role === "user" && (
          <div className="mt-6 text-center text-xs text-slate-500">
            Don&apos;t have an account or password yet?{" "}
            <a href="/user/register" className="font-bold text-indigo-600 hover:underline">
              Create Account / Set Password
            </a>
          </div>
        )}
      </section>
    </main>
  );
}
