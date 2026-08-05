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
import { Button, Card, Input, Label } from "@/app/Components/ui";

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
    const token = getStoredToken();
    if (token) {
      const userRole = getRoleFromToken(token);
      if (userRole) {
        router.push(getDashboardPathFromRole(userRole));
      }
    }
  }, [router]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const response = await authApi.login(role, email, password);
      const userRole =
        getRoleFromToken(response.token) ||
        (response.user?.roles?.[0] as AuthRole) ||
        role;

      router.push(getDashboardPathFromRole(userRole));
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
      <Card className="w-full max-w-md p-6 shadow-sm">
        <div className="mb-6">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">
            FBS Prints
          </p>
          <h1 className="mt-2 text-2xl font-bold text-primary-dark">{title}</h1>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-1.5">
            <Label htmlFor="login-email">Email</Label>
            <div className="relative">
              <Mail
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
              />
              <Input
                id="login-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="h-11 pl-9 text-sm"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="login-password">Password</Label>
            <div className="relative">
              <Lock
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
              />
              <Input
                id="login-password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="h-11 pl-9 text-sm"
                required
              />
            </div>
          </div>

          {error ? (
            <p className="rounded-xl bg-red-50 border border-red-100 px-3 py-2 text-sm text-red-700">
              {error}
            </p>
          ) : null}

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-11 text-sm bg-primary hover:bg-primary/90"
          >
            {isSubmitting ? "Signing in..." : "Sign in"}
          </Button>
        </form>

        {role === "user" && (
          <div className="mt-6 text-center text-xs text-slate-500">
            Don&apos;t have an account or password yet?{" "}
            <a
              href="/user/register"
              className="font-bold text-indigo-600 hover:underline"
            >
              Create Account / Set Password
            </a>
          </div>
        )}
      </Card>
    </main>
  );
}
