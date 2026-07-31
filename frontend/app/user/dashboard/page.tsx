import type { Metadata } from "next";
import { UserRound } from "lucide-react";
import { DashboardFrame } from "@/app/Components/auth/DashboardFrame";
import { requireRole } from "@/app/lib/auth/session";

export const metadata: Metadata = {
  title: "User Dashboard | FBS Prints",
};

export default async function UserDashboardPage() {
  const user = await requireRole("user");

  return (
    <DashboardFrame title="User Dashboard" subtitle={`Signed in as ${user.name}`}>
      <section className="rounded-lg border border-black/10 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-md bg-primary-light text-primary">
            <UserRound size={22} />
          </span>
          <div>
            <h2 className="text-lg font-bold text-primary-dark">Account Area</h2>
            <p className="text-sm text-primary-dark/60">
              User-only account features and assigned workflows belong here.
            </p>
          </div>
        </div>
      </section>
    </DashboardFrame>
  );
}
