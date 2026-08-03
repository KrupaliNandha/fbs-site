"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, User as UserIcon, Loader2 } from "lucide-react";
import { authApi } from "@/app/lib/client/auth-api";

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
      <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
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
          <label className="block">
            <span className="text-xs font-bold text-slate-700">Full Name</span>
            <span className="mt-1 flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 focus-within:ring-2 focus-within:ring-indigo-500/20">
              <UserIcon size={18} className="text-slate-400" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="min-h-11 w-full outline-none text-xs text-slate-900"
                required
              />
            </span>
          </label>

          <label className="block">
            <span className="text-xs font-bold text-slate-700">Email Address</span>
            <span className="mt-1 flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 focus-within:ring-2 focus-within:ring-indigo-500/20">
              <Mail size={18} className="text-slate-400" />
              <input
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@example.com"
                className="min-h-11 w-full outline-none text-xs text-slate-900"
                required
              />
            </span>
          </label>

          <label className="block">
            <span className="text-xs font-bold text-slate-700">Create Password</span>
            <span className="mt-1 flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 focus-within:ring-2 focus-within:ring-indigo-500/20">
              <Lock size={18} className="text-slate-400" />
              <input
                type="password"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="min-h-11 w-full outline-none text-xs text-slate-900"
                required
              />
            </span>
          </label>

          <label className="block">
            <span className="text-xs font-bold text-slate-700">Confirm Password</span>
            <span className="mt-1 flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 focus-within:ring-2 focus-within:ring-indigo-500/20">
              <Lock size={18} className="text-slate-400" />
              <input
                type="password"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="min-h-11 w-full outline-none text-xs text-slate-900"
                required
              />
            </span>
          </label>

          {error ? (
            <p className="rounded-xl bg-rose-50 border border-rose-200 px-3 py-2 text-xs font-medium text-rose-700">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={isSubmitting}
            className="min-h-11 w-full rounded-xl bg-indigo-600 font-bold text-xs text-white transition hover:bg-indigo-700 disabled:opacity-60 cursor-pointer flex items-center justify-center gap-2 shadow-sm"
          >
            {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : null}
            {isSubmitting ? "Creating Account..." : "Create Account & Sign In"}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-slate-500">
          Already have an account?{" "}
          <Link href="/user/login" className="font-bold text-indigo-600 hover:underline">
            Sign In
          </Link>
        </div>
      </section>
    </main>
  );
}
