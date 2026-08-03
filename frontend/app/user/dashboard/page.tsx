"use client";

import { useEffect, useState } from "react";
import { AuthGuard } from "@/app/Components/auth/AuthGuard";
import { SidebarLayout, type SidebarNavItem } from "@/app/Components/auth/SidebarLayout";
import {
  canvasApi,
  type ProjectModel,
} from "@/app/lib/client/canvas-api";
import {
  FolderKanban,
  CheckCircle2,
  Clock,
  AlertCircle,
  Eye,
  FileImage,
} from "lucide-react";

export default function ClientDashboardPage() {
  return (
    <AuthGuard requiredRole="user">
      {(user) => <ClientDashboardContent clientUser={user} />}
    </AuthGuard>
  );
}

function ClientDashboardContent({ clientUser }: { clientUser: any }) {
  const [projects, setProjects] = useState<ProjectModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("projects");

  const navItems: SidebarNavItem[] = [
    { id: "projects", label: "My Design Proofs", icon: FolderKanban, badge: projects.length },
  ];

  useEffect(() => {
    async function loadClientProjects() {
      try {
        const data = await canvasApi.listProjects();
        setProjects(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadClientProjects();
  }, []);

  function getStatusBadge(status: string) {
    switch (status) {
      case "approved":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 size={13} /> Approved
          </span>
        );
      case "changes_requested":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full bg-amber-50 text-amber-700 border border-amber-200">
            <AlertCircle size={13} /> Changes Requested
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full bg-blue-50 text-blue-700 border border-blue-200">
            <Clock size={13} /> In Review
          </span>
        );
    }
  }

  return (
    <SidebarLayout
      title="Client Review Portal"
      subtitle="View, review, and submit feedback on your custom design proofs"
      roleName="Client User"
      userEmail={clientUser.email}
      userName={clientUser.name}
      navItems={navItems}
      activeTab={activeTab}
      onTabChange={setActiveTab}
    >
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-lg font-extrabold text-slate-900">Your Active Design Projects</h2>
            <p className="text-xs text-slate-500 mt-0.5">Assigned account: {clientUser.email}</p>
          </div>
        </div>

        {loading ? (
          <div className="py-12 text-center text-xs text-slate-500">Loading your project proofs...</div>
        ) : projects.length === 0 ? (
          <div className="py-16 text-center text-slate-400 space-y-2">
            <FileImage size={40} className="mx-auto text-slate-300" />
            <p className="font-semibold text-slate-700 text-sm">No active design projects found.</p>
            <p className="text-xs text-slate-500">When your designer creates a proof, it will appear here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {projects.map((p) => (
              <div
                key={p.id}
                onClick={() => {
                  if (p.shareToken) window.location.href = `/review/${p.shareToken}`;
                }}
                className="border border-slate-200 rounded-2xl p-5 bg-white hover:shadow-md hover:border-indigo-300 transition space-y-4 flex flex-col justify-between cursor-pointer"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between">
                    <h3 className="font-extrabold text-slate-900 text-base">{p.name}</h3>
                    {getStatusBadge(p.status)}
                  </div>
                  <p className="text-xs text-slate-500">
                    Designer: <strong className="text-slate-700">{p.designerName || "Designer"}</strong>
                  </p>
                  {p.description && <p className="text-xs text-slate-600 line-clamp-2">{p.description}</p>}
                </div>

                <div className="border-t border-slate-100 pt-3 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">Updated {new Date(p.updatedAt).toLocaleDateString()}</span>

                  {p.shareToken && (
                    <a
                      href={`/review/${p.shareToken}`}
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition shadow-sm"
                    >
                      <Eye size={14} /> Open Design Proof
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </SidebarLayout>
  );
}
