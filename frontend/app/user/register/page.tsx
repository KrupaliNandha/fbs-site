"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, User as UserIcon, Loader2 } from "lucide-react";
import { authApi } from "@/app/lib/client/auth-api";
import { Button, Card, Input, Label } from "@/app/Components/ui";

export default function UserRegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);
    try {
      await authApi.register(name, email, password);
      router.push("/user/dashboard");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-dvh bg-[#f7f8fb] px-5 py-10 flex items-center justify-center">
      <Card className="w-full max-w-md p-6 shadow-sm">
        <div className="mb-6">
          <p className="text-xs font-bold uppercase tracking-wider text-indigo-600">
            FBS Prints Portal
          </p>
          <h1 className="mt-1 text-2xl font-bold text-slate-900">Create Account</h1>
          <p className="text-xs text-slate-500 mt-1">
            Register your email and set up your password to manage your projects.
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-1.5">
            <Label htmlFor="reg-name">Full Name</Label>
            <div className="relative">
              <UserIcon
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
              />
              <Input
                id="reg-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="h-11 pl-9"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="reg-email">Email Address</Label>
            <div className="relative">
              <Mail
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
              />
              <Input
                id="reg-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@example.com"
                className="h-11 pl-9"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="reg-password">Create Password</Label>
            <div className="relative">
              <Lock
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
              />
              <Input
                id="reg-password"
                type="password"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="h-11 pl-9"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="reg-confirm">Confirm Password</Label>
            <div className="relative">
              <Lock
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
              />
              <Input
                id="reg-confirm"
                type="password"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="h-11 pl-9"
                required
              />
            </div>
          </div>

          {error ? (
            <p className="rounded-xl bg-rose-50 border border-rose-200 px-3 py-2 text-xs font-medium text-rose-700">
              {error}
            </p>
          ) : null}

          <Button type="submit" disabled={isSubmitting} className="w-full h-11">
            {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : null}
            {isSubmitting ? "Creating Account..." : "Create Account & Sign In"}
          </Button>
        </form>

        <div className="mt-6 text-center text-xs text-slate-500">
          Already have an account?{" "}
          <Link href="/user/login" className="font-bold text-indigo-600 hover:underline">
            Sign In
          </Link>
        </div>
      </Card>
    </main>
  );
}
