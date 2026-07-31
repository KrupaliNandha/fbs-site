import type { ReactNode } from "react";
import { LogoutButton } from "./LogoutButton";

type DashboardFrameProps = {
  title: string;
  subtitle: string;
  children: ReactNode;
};

export function DashboardFrame({ title, subtitle, children }: DashboardFrameProps) {
  return (
    <main className="min-h-dvh bg-[#f7f8fb]">
      <header className="border-b border-black/10 bg-white px-5 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-primary">
              FBS Prints
            </p>
            <h1 className="text-2xl font-bold text-primary-dark">{title}</h1>
            <p className="mt-1 text-sm text-primary-dark/60">{subtitle}</p>
          </div>
          <LogoutButton />
        </div>
      </header>
      <div className="mx-auto max-w-7xl px-5 py-6">{children}</div>
    </main>
  );
}
