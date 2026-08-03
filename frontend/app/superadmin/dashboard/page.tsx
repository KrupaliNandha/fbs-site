"use client";

import { useEffect, useState } from "react";
import { AuthGuard } from "@/app/Components/auth/AuthGuard";
import { SidebarLayout, type SidebarNavItem } from "@/app/Components/auth/SidebarLayout";
import { UserManagement } from "@/app/super-admin/dashboard/UserManagement";
import { RolePermissionManagement } from "@/app/super-admin/dashboard/RolePermissionManagement";
import {
  canvasApi,
  type ProjectModel,
  type CanvasModel,
  type DiagramTemplateModel,
} from "@/app/lib/client/canvas-api";
import {
  FolderKanban,
  ShieldCheck,
  SlidersHorizontal,
  Layers,
  Plus,
  Trash2,
  Share2,
  Search,
  X,
  CheckCircle2,
  Clock,
  AlertCircle,
  Upload,
  Eye,
  RefreshCw,
  Loader2,
  Maximize2,
  MessageSquare,
  Edit,
} from "lucide-react";

export default function SuperAdminDashboardPage() {
  return (
    <AuthGuard requiredRole="super_admin">
      {(user) => <SuperAdminContent superAdminUser={user} />}
    </AuthGuard>
  );
}

function SuperAdminContent({ superAdminUser }: { superAdminUser: any }) {
  const [activeTab, setActiveTab] = useState("projects");
  const [projects, setProjects] = useState<ProjectModel[]>([]);
  const [diagrams, setDiagrams] = useState<DiagramTemplateModel[]>([]);
  const [search, setSearch] = useState("");
  const [selectedProject, setSelectedProject] = useState<ProjectModel | null>(null);

  // Diagram Template Modal State
  const [showDiagramModal, setShowDiagramModal] = useState(false);
  const [diagramForm, setDiagramForm] = useState({ name: "", description: "", previewUrl: "" });
  const [savingDiagram, setSavingDiagram] = useState(false);

  // Upload Canvas Modal State
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [canvasForm, setCanvasForm] = useState({
    name: "",
    canvasType: "individual" as "individual" | "collage" | "diagram",
    diagramTemplateId: "",
    watermarkEnabled: true,
    watermarkText: "CONFIDENTIAL REVIEW",
  });
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadingCanvas, setUploadingCanvas] = useState(false);

  // Edit Canvas / Revision Modal State
  const [showEditCanvasModal, setShowEditCanvasModal] = useState(false);
  const [targetCanvas, setTargetCanvas] = useState<CanvasModel | null>(null);
  const [revisionFile, setRevisionFile] = useState<File | null>(null);
  const [uploadingRevision, setUploadingRevision] = useState(false);

  // Fullscreen Preview State
  const [fullscreenCanvas, setFullscreenCanvas] = useState<{ url: string; name: string; version: number } | null>(null);

  const backendHost = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

  // ESC Key listener
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setShowDiagramModal(false);
        setShowUploadModal(false);
        setShowEditCanvasModal(false);
        setFullscreenCanvas(null);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const navItems: SidebarNavItem[] = [
    { id: "projects", label: "Client Projects", icon: FolderKanban, badge: projects.length },
    { id: "users", label: "User Accounts", icon: ShieldCheck },
    { id: "roles", label: "Role Permissions", icon: SlidersHorizontal },
    { id: "diagrams", label: "Diagram Templates", icon: Layers, badge: diagrams.length },
  ];

  async function loadData() {
    try {
      const pData = await canvasApi.listProjects(search);
      const dData = await canvasApi.listDiagramTemplates();
      setProjects(pData);
      setDiagrams(dData);
      if (selectedProject) {
        const updated = pData.find((p) => p.id === selectedProject.id);
        if (updated) loadProjectDetails(updated.id);
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function loadProjectDetails(projectId: number) {
    try {
      const data = await canvasApi.getProject(projectId);
      setSelectedProject(data);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    loadData();
  }, [search]);

  // Create Diagram Template
  async function handleCreateDiagram(e: React.FormEvent) {
    e.preventDefault();
    setSavingDiagram(true);
    try {
      await canvasApi.createDiagramTemplate(diagramForm);
      setShowDiagramModal(false);
      setDiagramForm({ name: "", description: "", previewUrl: "" });
      loadData();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to create diagram template.");
    } finally {
      setSavingDiagram(false);
    }
  }

  async function handleDeleteDiagram(id: number) {
    if (!confirm("Delete this diagram template?")) return;
    try {
      await canvasApi.deleteDiagramTemplate(id);
      loadData();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete diagram template.");
    }
  }

  // Upload Canvas
  async function handleUploadCanvas(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedProject || selectedFiles.length === 0) return;

    setUploadingCanvas(true);
    try {
      const formData = new FormData();
      formData.append("projectId", String(selectedProject.id));
      formData.append("name", canvasForm.name);
      formData.append("canvasType", canvasForm.canvasType);
      if (canvasForm.diagramTemplateId) {
        formData.append("diagramTemplateId", canvasForm.diagramTemplateId);
      }
      formData.append("watermarkEnabled", String(canvasForm.watermarkEnabled));
      formData.append("watermarkText", canvasForm.watermarkText);

      selectedFiles.forEach((file) => formData.append("files", file));

      await canvasApi.uploadCanvas(formData);
      setShowUploadModal(false);
      setSelectedFiles([]);
      setCanvasForm({
        name: "",
        canvasType: "individual",
        diagramTemplateId: "",
        watermarkEnabled: true,
        watermarkText: "CONFIDENTIAL REVIEW",
      });
      loadProjectDetails(selectedProject.id);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploadingCanvas(false);
    }
  }

  // Upload Revision
  async function handleUploadRevision(e: React.FormEvent) {
    e.preventDefault();
    if (!targetCanvas || !revisionFile || !selectedProject) return;

    setUploadingRevision(true);
    try {
      const formData = new FormData();
      formData.append("file", revisionFile);
      formData.append("watermarkEnabled", String(targetCanvas.watermarkEnabled));
      formData.append("watermarkText", targetCanvas.watermarkText || "");

      await canvasApi.uploadRevision(targetCanvas.id, formData);
      setShowEditCanvasModal(false);
      setTargetCanvas(null);
      setRevisionFile(null);
      loadProjectDetails(selectedProject.id);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Revision upload failed");
    } finally {
      setUploadingRevision(false);
    }
  }

  function getStatusBadge(status: string) {
    switch (status) {
      case "approved":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-semibold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 size={12} /> Approved
          </span>
        );
      case "changes_requested":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-semibold rounded-full bg-amber-50 text-amber-700 border border-amber-200">
            <AlertCircle size={12} /> Changes Requested
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-semibold rounded-full bg-blue-50 text-blue-700 border border-blue-200">
            <Clock size={12} /> In Review
          </span>
        );
    }
  }

  return (
    <SidebarLayout
      title="Super Admin Command Center"
      subtitle="Full control of User Accounts, Role Permissions, Projects Directory & Diagram Blueprints"
      roleName="Super Admin"
      userEmail={superAdminUser.email}
      userName={superAdminUser.name}
      navItems={navItems}
      activeTab={activeTab}
      onTabChange={setActiveTab}
    >
      {/* TAB 1: CLIENT PROJECTS DIRECTORY */}
      {activeTab === "projects" && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-extrabold text-slate-900">Global Projects Directory</h2>
                <p className="text-xs text-slate-500">All design projects across designers and clients</p>
              </div>

              <div className="relative">
                <Search size={15} className="absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs w-64 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
            </div>

            <div className="overflow-x-auto border border-slate-100 rounded-xl">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase">
                    <th className="py-3 px-4">Project Name</th>
                    <th className="py-3 px-4">Client</th>
                    <th className="py-3 px-4">Designer</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {projects.map((p) => (
                    <tr
                      key={p.id}
                      onClick={() => loadProjectDetails(p.id)}
                      className={`hover:bg-slate-50/60 transition cursor-pointer ${
                        selectedProject?.id === p.id ? "bg-indigo-50/40" : ""
                      }`}
                    >
                      <td className="py-3 px-4 font-bold text-slate-900">{p.name}</td>
                      <td className="py-3 px-4 text-slate-600">{p.clientName}</td>
                      <td className="py-3 px-4 text-slate-600">{p.designerName || "Designer"}</td>
                      <td className="py-3 px-4">{getStatusBadge(p.status)}</td>
                      <td className="py-3 px-4 text-right">
                        {p.shareToken && (
                          <a
                            href={`/review/${p.shareToken}`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 font-bold text-indigo-600 hover:underline cursor-pointer"
                          >
                            <Share2 size={13} /> Open Review
                          </a>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Super Admin Canvas Upload & Workspace */}
          {selectedProject && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">
                    Project Workspace: {selectedProject.name}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Client: {selectedProject.clientName} ({selectedProject.clientEmail})
                  </p>
                </div>
                <button
                  onClick={() => setShowUploadModal(true)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-sm transition cursor-pointer"
                >
                  <Upload size={14} /> Upload Canvas Proof
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {selectedProject.canvases?.map((c) => {
                  const thumb = c.latestVersion?.thumbnailUrl
                    ? `${backendHost}${c.latestVersion.thumbnailUrl}`
                    : "/placeholder.png";
                  const isChangesReq = c.status === "changes_requested";
                  const latestRemark = c.remarks && c.remarks.length > 0 ? c.remarks[0] : null;

                  return (
                    <div
                      key={c.id}
                      className={`border rounded-2xl p-3 bg-slate-50/50 space-y-3 ${
                        isChangesReq ? "border-amber-300 ring-2 ring-amber-400/20 bg-amber-50/30" : "border-slate-200"
                      }`}
                    >
                      <div
                        onClick={() =>
                          setFullscreenCanvas({
                            url: thumb,
                            name: c.name,
                            version: c.latestVersion?.versionNumber || 1,
                          })
                        }
                        className="aspect-[4/3] bg-slate-900/5 rounded-xl overflow-hidden relative cursor-pointer group"
                      >
                        <img src={thumb} alt={c.name} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white text-xs font-bold gap-1">
                          <Maximize2 size={18} /> Fullscreen View
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold text-sm text-slate-800 truncate">{c.name}</h4>
                          {getStatusBadge(c.status)}
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5 capitalize">Type: {c.canvasType}</p>

                        {isChangesReq && latestRemark && (
                          <div className="mt-2 p-2 rounded-xl bg-amber-100/70 border border-amber-300 text-amber-900 text-xs">
                            <span className="font-bold flex items-center gap-1 text-[10px] uppercase">
                              <MessageSquare size={11} className="text-amber-700" /> Requested Changes:
                            </span>
                            <p className="italic text-[11px] line-clamp-2">"{latestRemark.remark}"</p>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between border-t border-slate-200/80 pt-2 text-xs">
                        <button
                          onClick={() => {
                            setTargetCanvas(c);
                            setShowEditCanvasModal(true);
                          }}
                          className="text-indigo-600 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <Edit size={13} /> {isChangesReq ? "View Changes & Upload Revision" : "Edit Canvas"}
                        </button>
                        <button
                          onClick={async () => {
                            if (confirm("Delete this canvas entry?")) {
                              await canvasApi.deleteCanvas(c.id);
                              loadProjectDetails(selectedProject.id);
                            }
                          }}
                          className="text-rose-600 hover:text-rose-800 transition cursor-pointer"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: USER ACCOUNTS */}
      {activeTab === "users" && (
        <UserManagement
          currentUserId={superAdminUser.id}
          currentUserRoles={superAdminUser.roles}
        />
      )}

      {/* TAB 3: ROLE PERMISSIONS */}
      {activeTab === "roles" && <RolePermissionManagement />}

      {/* TAB 4: DIAGRAM BLUEPRINTS */}
      {activeTab === "diagrams" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-extrabold text-slate-900">Diagram Layout Blueprints</h2>
            <button
              onClick={() => setShowDiagramModal(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-sm transition cursor-pointer"
            >
              <Plus size={15} /> Add Template
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {diagrams.map((d) => (
              <div key={d.id} className="bg-white border rounded-2xl p-5 shadow-sm flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl">
                    <Layers size={24} />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-sm">{d.name}</h3>
                    <p className="text-xs text-slate-500 mt-1">{d.description}</p>
                  </div>
                </div>

                <button onClick={() => handleDeleteDiagram(d.id)} className="text-rose-500 hover:text-rose-700 cursor-pointer p-1">
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL: CREATE DIAGRAM TEMPLATE */}
      {showDiagramModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl animate-in fade-in zoom-in duration-200 my-auto max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between border-b pb-3 flex-shrink-0">
              <h3 className="font-extrabold text-lg text-slate-900">Add Diagram Template</h3>
              <button onClick={() => setShowDiagramModal(false)} className="text-slate-400 hover:text-slate-700 cursor-pointer">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleCreateDiagram} className="overflow-y-auto flex-1 py-3 space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700">Template Name</label>
                <input
                  required
                  value={diagramForm.name}
                  onChange={(e) => setDiagramForm({ ...diagramForm, name: e.target.value })}
                  className="w-full border rounded-xl p-2.5 text-xs outline-none"
                  placeholder="E.g. Structural Blueprint Panel D"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700">Description</label>
                <textarea
                  required
                  value={diagramForm.description}
                  onChange={(e) => setDiagramForm({ ...diagramForm, description: e.target.value })}
                  className="w-full border rounded-xl p-2.5 text-xs outline-none"
                  rows={3}
                />
              </div>
              <button
                disabled={savingDiagram}
                type="submit"
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs shadow-sm transition flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer mt-2"
              >
                {savingDiagram ? <Loader2 size={16} className="animate-spin" /> : null}
                {savingDiagram ? "Saving Template..." : "Save Diagram Template"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: UPLOAD CANVAS FOR SUPER ADMIN */}
      {showUploadModal && selectedProject && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl animate-in fade-in zoom-in duration-200 my-auto max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between border-b pb-3 flex-shrink-0">
              <h3 className="font-extrabold text-lg text-slate-900">Upload Design Canvases</h3>
              <button onClick={() => setShowUploadModal(false)} className="text-slate-400 hover:text-slate-700 cursor-pointer">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleUploadCanvas} className="overflow-y-auto flex-1 py-3 space-y-4 pr-1">
              <div>
                <label className="text-xs font-bold text-slate-700">Canvas Name / Title</label>
                <input
                  required
                  value={canvasForm.name}
                  onChange={(e) => setCanvasForm({ ...canvasForm, name: e.target.value })}
                  className="w-full border rounded-xl p-2.5 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700">Canvas Type</label>
                  <select
                    value={canvasForm.canvasType}
                    onChange={(e) => setCanvasForm({ ...canvasForm, canvasType: e.target.value as any })}
                    className="w-full border rounded-xl p-2.5 text-xs bg-white cursor-pointer"
                  >
                    <option value="individual">Individual Canvas</option>
                    <option value="collage">Auto Collage Grid</option>
                    <option value="diagram">Diagram Blueprint</option>
                  </select>
                </div>

                {canvasForm.canvasType === "diagram" && (
                  <div>
                    <label className="text-xs font-bold text-slate-700">Blueprint Layout</label>
                    <select
                      value={canvasForm.diagramTemplateId}
                      onChange={(e) => setCanvasForm({ ...canvasForm, diagramTemplateId: e.target.value })}
                      className="w-full border rounded-xl p-2.5 text-xs bg-white cursor-pointer"
                    >
                      <option value="">Select Blueprint</option>
                      {diagrams.map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700">Select Image File(s)</label>
                <input
                  type="file"
                  multiple
                  accept="image/png, image/jpeg, image/webp"
                  onChange={(e) => {
                    const newFiles = Array.from(e.target.files || []);
                    setSelectedFiles((prev) => [...prev, ...newFiles]);
                  }}
                  className="mt-1 block w-full text-xs text-slate-500 cursor-pointer"
                />
              </div>

              <button
                disabled={uploadingCanvas || selectedFiles.length === 0}
                type="submit"
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs transition flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                {uploadingCanvas ? <Loader2 size={16} className="animate-spin" /> : null}
                {uploadingCanvas ? "Uploading..." : "Upload Canvases"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDIT CANVAS / REVISION */}
      {showEditCanvasModal && targetCanvas && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl animate-in fade-in zoom-in duration-200 my-auto max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between border-b pb-3 flex-shrink-0">
              <h3 className="font-extrabold text-lg text-slate-900">Manage Canvas: {targetCanvas.name}</h3>
              <button onClick={() => setShowEditCanvasModal(false)} className="text-slate-400 hover:text-slate-700 cursor-pointer">
                <X size={18} />
              </button>
            </div>
            <div className="overflow-y-auto flex-1 py-4 space-y-4">
              {targetCanvas.remarks && targetCanvas.remarks.length > 0 && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl space-y-2 text-xs">
                  <span className="font-bold text-amber-900 uppercase">Client Feedback History</span>
                  {targetCanvas.remarks.map((r) => (
                    <div key={r.id} className="p-2 bg-white border border-amber-200 rounded">
                      <p className="font-bold text-slate-800">{r.userName || "Client"}:</p>
                      <p className="text-slate-600">"{r.remark}"</p>
                    </div>
                  ))}
                </div>
              )}

              <form onSubmit={handleUploadRevision} className="space-y-3 pt-2">
                <label className="text-xs font-bold text-slate-700">Upload Revision Image File</label>
                <input
                  type="file"
                  required
                  accept="image/png, image/jpeg, image/webp"
                  onChange={(e) => setRevisionFile(e.target.files?.[0] || null)}
                  className="mt-1 block w-full text-xs text-slate-500 cursor-pointer"
                />

                <button
                  disabled={uploadingRevision || !revisionFile}
                  type="submit"
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  {uploadingRevision ? <Loader2 size={16} className="animate-spin" /> : <RefreshCw size={14} />}
                  {uploadingRevision ? "Uploading..." : `Submit Revision V${(targetCanvas.latestVersion?.versionNumber || 1) + 1}`}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* FULLSCREEN LIGHTBOX */}
      {fullscreenCanvas && (
        <div
          onClick={() => setFullscreenCanvas(null)}
          className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer"
        >
          <button onClick={() => setFullscreenCanvas(null)} className="absolute top-5 right-5 text-white bg-slate-800 p-3 rounded-full cursor-pointer z-50">
            <X size={24} />
          </button>
          <img src={fullscreenCanvas.url} alt={fullscreenCanvas.name} className="max-h-[92vh] max-w-[94vw] object-contain rounded-xl shadow-2xl" />
        </div>
      )}
    </SidebarLayout>
  );
}
