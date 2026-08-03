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
  const [editingDiagram, setEditingDiagram] = useState<DiagramTemplateModel | null>(null);
  const [diagramForm, setDiagramForm] = useState({ name: "", description: "" });
  const [diagramImageFile, setDiagramImageFile] = useState<File | null>(null);
  const [savingDiagram, setSavingDiagram] = useState(false);
  const [deletingDiagramId, setDeletingDiagramId] = useState<number | null>(null);

  // Custom Delete Confirmation Modal State
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    id: number | null;
    deleting: boolean;
    onConfirm: () => Promise<void>;
  }>({
    isOpen: false,
    title: "",
    description: "",
    id: null,
    deleting: false,
    onConfirm: async () => {},
  });

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
  const [fullscreenCanvas, setFullscreenCanvas] = useState<{
    url: string;
    name: string;
    version: number;
    projectName?: string;
    status?: string;
    canvasType?: string;
    date?: string;
  } | null>(null);

  const backendHost = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

  // ESC Key listener
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setShowDiagramModal(false);
        setShowUploadModal(false);
        setShowEditCanvasModal(false);
        setDeleteModal({ isOpen: false, title: "", description: "", id: null, deleting: false, onConfirm: async () => {} });
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
        if (updated) {
          loadProjectDetails(updated.id);
        } else if (pData.length > 0) {
          loadProjectDetails(pData[0].id);
        } else {
          setSelectedProject(null);
        }
      } else if (pData.length > 0) {
        loadProjectDetails(pData[0].id);
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function loadProjectDetails(projectId: number) {
    try {
      const data = await canvasApi.getProject(projectId);
      setSelectedProject(data);
      if (targetCanvas) {
        const updatedCanvas = data.canvases?.find((c) => c.id === targetCanvas.id);
        if (updatedCanvas) {
          setTargetCanvas(updatedCanvas);
        } else {
          setTargetCanvas(null);
          setShowEditCanvasModal(false);
        }
      }
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    loadData();
  }, [search, activeTab]);

  // Diagram Template CRUD
  async function handleSaveDiagram(e: React.FormEvent) {
    e.preventDefault();
    if (!diagramForm.name.trim()) return;
    setSavingDiagram(true);
    try {
      const formData = new FormData();
      formData.append("name", diagramForm.name.trim());
      if (diagramForm.description.trim()) {
        formData.append("description", diagramForm.description.trim());
      }
      if (diagramImageFile) {
        formData.append("image", diagramImageFile);
      }

      if (editingDiagram) {
        await canvasApi.updateDiagramTemplate(editingDiagram.id, formData);
      } else {
        await canvasApi.createDiagramTemplate(formData);
      }

      setShowDiagramModal(false);
      setEditingDiagram(null);
      setDiagramForm({ name: "", description: "" });
      setDiagramImageFile(null);
      loadData();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to save diagram template.");
    } finally {
      setSavingDiagram(false);
    }
  }

  function handleOpenEditDiagram(d: DiagramTemplateModel) {
    setEditingDiagram(d);
    setDiagramForm({ name: d.name, description: d.description || "" });
    setDiagramImageFile(null);
    setShowDiagramModal(true);
  }

  function promptDeleteDiagram(d: DiagramTemplateModel) {
    setDeleteModal({
      isOpen: true,
      title: "Delete Diagram Template",
      description: `Are you sure you want to delete "${d.name}"? The diagram preview and structure will be permanently removed.`,
      id: d.id,
      deleting: false,
      onConfirm: async () => {
        setDeletingDiagramId(d.id);
        setDeleteModal((prev) => ({ ...prev, deleting: true }));
        try {
          await canvasApi.deleteDiagramTemplate(d.id);
          setDiagrams((prev) => prev.filter((item) => item.id !== d.id));
          setDeleteModal({ isOpen: false, title: "", description: "", id: null, deleting: false, onConfirm: async () => {} });
        } catch (err) {
          alert(err instanceof Error ? err.message : "Failed to delete diagram template.");
        } finally {
          setDeletingDiagramId(null);
          setDeleteModal((prev) => ({ ...prev, deleting: false }));
        }
      },
    });
  }

  function promptDeleteCanvas(canvasId: number, canvasName: string) {
    if (!selectedProject) return;
    setDeleteModal({
      isOpen: true,
      title: "Delete Canvas Entry",
      description: `Are you sure you want to delete canvas "${canvasName}"? All image files will be purged from storage.`,
      id: canvasId,
      deleting: false,
      onConfirm: async () => {
        setDeleteModal((prev) => ({ ...prev, deleting: true }));
        try {
          await canvasApi.deleteCanvas(canvasId);
          setSelectedProject((prev) =>
            prev ? { ...prev, canvases: prev.canvases?.filter((c) => c.id !== canvasId) } : prev
          );
          setProjects((prev) =>
            prev.map((p) =>
              p.id === selectedProject.id
                ? { ...p, canvases: p.canvases?.filter((c) => c.id !== canvasId) }
                : p
            )
          );
          setDeleteModal({ isOpen: false, title: "", description: "", id: null, deleting: false, onConfirm: async () => {} });
        } catch (err) {
          alert(err instanceof Error ? err.message : "Error deleting canvas");
        } finally {
          setDeleteModal((prev) => ({ ...prev, deleting: false }));
        }
      },
    });
  }

  // Upload Canvas
  async function handleUploadCanvas(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedProject || (selectedFiles.length === 0 && !canvasForm.diagramTemplateId)) return;

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
                      className={`border rounded-2xl p-3.5 bg-white space-y-3 shadow-sm hover:shadow-md transition ${
                        isChangesReq ? "border-amber-300 ring-2 ring-amber-400/20 bg-amber-50/20" : "border-slate-200"
                      }`}
                    >
                      {/* Card Image Box with Hover Overlay */}
                      <div
                        onClick={() =>
                          setFullscreenCanvas({
                            url: thumb,
                            name: c.name,
                            version: c.latestVersion?.versionNumber || 1,
                            projectName: selectedProject?.name,
                            status: c.status,
                            canvasType: c.canvasType,
                            date: new Date(c.updatedAt).toLocaleDateString(),
                          })
                        }
                        className="aspect-[4/3] bg-slate-900/5 rounded-xl overflow-hidden relative cursor-pointer group border border-slate-100"
                      >
                        <img src={thumb} alt={c.name} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-slate-950/45 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white text-xs font-bold gap-1.5 backdrop-blur-[1px]">
                          <Maximize2 size={16} /> Fullscreen Proof Sheet
                        </div>
                        <span className="absolute top-2 right-2 bg-slate-900/80 text-white text-[10px] font-mono font-bold px-2 py-0.5 rounded-md backdrop-blur-sm shadow">
                          v{c.latestVersion?.versionNumber || 1}
                        </span>
                        {c.watermarkEnabled && (
                          <span className="absolute bottom-2 left-2 bg-indigo-900/80 text-white text-[9px] font-bold px-1.5 py-0.5 rounded backdrop-blur-sm">
                            Watermarked
                          </span>
                        )}
                      </div>

                      {/* Info Area */}
                      <div>
                        <div className="flex items-center justify-between">
                          <h4 className="font-extrabold text-sm text-slate-900 truncate" title={c.name}>{c.name}</h4>
                          {getStatusBadge(c.status)}
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5 font-medium capitalize">Type: {c.canvasType}</p>

                        {/* Prominent Client Feedback Notice if Changes Requested */}
                        {isChangesReq && latestRemark && (
                          <div className="mt-2.5 p-2.5 rounded-xl bg-amber-100/80 border border-amber-300 text-amber-900 text-xs space-y-1">
                            <span className="font-bold flex items-center gap-1 text-[11px] uppercase tracking-wide">
                              <MessageSquare size={12} className="text-amber-700" /> Client Requested Changes:
                            </span>
                            <p className="italic text-[11px] text-amber-950 line-clamp-2">"{latestRemark.remark}"</p>
                          </div>
                        )}
                      </div>

                      {/* Action Toolbar */}
                      <div className="flex items-center justify-between border-t border-slate-100 pt-2.5 text-xs">
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
                          onClick={() => promptDeleteCanvas(c.id, c.name)}
                          className="text-rose-600 hover:text-rose-800 transition cursor-pointer font-bold flex items-center gap-1"
                        >
                          <Trash2 size={14} /> Delete
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
          <div className="flex items-center justify-between bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div>
              <h2 className="text-base font-extrabold text-slate-900">Diagram Layout Blueprints</h2>
              <p className="text-xs text-slate-500 mt-0.5">Manage system-wide technical blueprint templates and diagram layouts with photos.</p>
            </div>
            <button
              onClick={() => {
                setEditingDiagram(null);
                setDiagramForm({ name: "", description: "" });
                setDiagramImageFile(null);
                setShowDiagramModal(true);
              }}
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-sm transition cursor-pointer"
            >
              <Plus size={16} /> Add Diagram Blueprint
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {diagrams.map((d) => {
              const photoUrl = d.previewUrl ? `${backendHost}${d.previewUrl}` : null;
              return (
                <div key={d.id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4 flex flex-col justify-between">
                  <div className="space-y-3">
                    {photoUrl ? (
                      <div
                        onClick={() => setFullscreenCanvas({ url: photoUrl, name: d.name, version: 1 })}
                        className="w-full aspect-[16/9] bg-slate-100 rounded-xl overflow-hidden relative group border cursor-pointer"
                      >
                        <img src={photoUrl} alt={d.name} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white text-xs font-bold gap-1.5 backdrop-blur-[1px]">
                          <Eye size={16} /> View Fullscreen
                        </div>
                      </div>
                    ) : (
                      <div className="w-full h-32 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center border border-purple-100">
                        <Layers size={36} />
                      </div>
                    )}

                    <div>
                      <h3 className="font-extrabold text-slate-900 text-sm">{d.name}</h3>
                      {d.description && <p className="text-xs text-slate-500 mt-1">{d.description}</p>}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <button
                      onClick={() => handleOpenEditDiagram(d)}
                      className="text-indigo-600 hover:text-indigo-800 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition"
                    >
                      <Edit size={13} /> Edit Blueprint
                    </button>
                    <button
                      disabled={deletingDiagramId === d.id}
                      onClick={() => promptDeleteDiagram(d)}
                      className="text-rose-600 hover:text-rose-700 text-xs font-bold flex items-center gap-1.5 cursor-pointer disabled:opacity-50 transition"
                    >
                      {deletingDiagramId === d.id ? (
                        <>
                          <Loader2 size={13} className="animate-spin text-rose-600" /> Deleting...
                        </>
                      ) : (
                        <>
                          <Trash2 size={13} /> Delete
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* MODAL: CREATE / EDIT DIAGRAM TEMPLATE */}
      {showDiagramModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl animate-in fade-in zoom-in duration-200 my-auto flex flex-col">
            <div className="flex items-center justify-between border-b pb-3 flex-shrink-0">
              <h3 className="font-extrabold text-lg text-slate-900">
                {editingDiagram ? "Edit Diagram Blueprint" : "Add Diagram Blueprint"}
              </h3>
              <button onClick={() => setShowDiagramModal(false)} className="text-slate-400 hover:text-slate-700 cursor-pointer">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSaveDiagram} className="py-4 space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700">Blueprint Title</label>
                <input
                  required
                  value={diagramForm.name}
                  onChange={(e) => setDiagramForm({ ...diagramForm, name: e.target.value })}
                  className="w-full border rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-indigo-500/20 outline-none"
                  placeholder="e.g. Architectural Elevation Blueprint"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700">Description (Optional)</label>
                <textarea
                  rows={2}
                  value={diagramForm.description}
                  onChange={(e) => setDiagramForm({ ...diagramForm, description: e.target.value })}
                  className="w-full border rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-indigo-500/20 outline-none"
                  placeholder="Describe the diagram structure or specifications..."
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700">Diagram Photo</label>
                <input
                  type="file"
                  accept="image/png, image/jpeg, image/webp"
                  onChange={(e) => setDiagramImageFile(e.target.files?.[0] || null)}
                  className="mt-1 block w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer"
                />
              </div>

              <button
                disabled={savingDiagram || !diagramForm.name.trim()}
                type="submit"
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs shadow-sm transition flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                {savingDiagram ? <Loader2 size={16} className="animate-spin" /> : null}
                {savingDiagram ? "Saving Blueprint..." : editingDiagram ? "Update Diagram Blueprint" : "Create Diagram Blueprint"}
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
                    if (newFiles.length > 0 && !canvasForm.name.trim()) {
                      const cleanName = newFiles[0].name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
                      setCanvasForm((prev) => ({ ...prev, name: cleanName }));
                    }
                    setSelectedFiles((prev) => [...prev, ...newFiles]);
                  }}
                  className="mt-1 block w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer"
                />
              </div>

              {selectedFiles.length > 0 && (
                <div className="space-y-2 pt-1 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700">Selected Files ({selectedFiles.length})</span>
                    <button
                      type="button"
                      onClick={() => setSelectedFiles([])}
                      className="text-[11px] font-bold text-rose-600 hover:underline cursor-pointer"
                    >
                      Clear All
                    </button>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-56 overflow-y-auto p-2 bg-slate-50 rounded-2xl border border-slate-200">
                    {selectedFiles.map((file, idx) => {
                      const fileUrl = URL.createObjectURL(file);
                      return (
                        <div key={idx} className="bg-white p-2 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
                          <div className="relative aspect-square w-full bg-slate-100 rounded-lg overflow-hidden group border border-slate-100">
                            <img src={fileUrl} alt={file.name} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-slate-900/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-1.5 backdrop-blur-[1px]">
                              <button
                                type="button"
                                onClick={() => setFullscreenCanvas({ url: fileUrl, name: file.name, version: 1 })}
                                className="p-1.5 bg-white/90 text-slate-800 rounded-lg hover:bg-white hover:text-indigo-600 transition shadow cursor-pointer"
                                title="View Fullscreen Preview"
                              >
                                <Eye size={14} />
                              </button>
                              <button
                                type="button"
                                onClick={() => setSelectedFiles((prev) => prev.filter((_, i) => i !== idx))}
                                className="p-1.5 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition shadow cursor-pointer"
                                title="Remove File"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>
                          <div className="mt-2 px-0.5">
                            <p className="text-[11px] font-bold text-slate-800 truncate" title={file.name}>
                              {file.name}
                            </p>
                            <p className="text-[10px] text-slate-400 font-mono">
                              {(file.size / 1024).toFixed(0)} KB
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

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

      {/* CUSTOM DELETE CONFIRMATION MODAL */}
      {deleteModal.isOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl animate-in fade-in zoom-in duration-200 my-auto border border-rose-100 space-y-4">
            <div className="flex items-center gap-3.5 border-b pb-4 border-slate-100">
              <div className="w-11 h-11 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center flex-shrink-0 border border-rose-200">
                <Trash2 size={22} />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-slate-900">{deleteModal.title}</h3>
                <p className="text-xs text-rose-600 font-semibold mt-0.5">Confirmation Required</p>
              </div>
            </div>

            <div>
              <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-200 font-medium">
                {deleteModal.description}
              </p>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
              <button
                type="button"
                disabled={deleteModal.deleting}
                onClick={() => setDeleteModal({ isOpen: false, title: "", description: "", id: null, deleting: false, onConfirm: async () => {} })}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition disabled:opacity-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deleteModal.deleting}
                onClick={() => deleteModal.onConfirm()}
                style={{ backgroundColor: "#dc2626", color: "#ffffff" }}
                className="px-4.5 py-2 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-2 disabled:opacity-50 cursor-pointer shadow-md shadow-red-600/30 border-0"
              >
                {deleteModal.deleting ? <Loader2 size={14} className="animate-spin text-white" /> : <Trash2 size={14} className="text-white" />}
                {deleteModal.deleting ? "Deleting..." : "Delete Permanently"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FULLSCREEN LIGHTBOX PROOF SHEET MODAL */}
      {fullscreenCanvas && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setFullscreenCanvas(null);
          }}
          className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center p-4 sm:p-6 overflow-y-auto"
        >
          <button
            onClick={() => setFullscreenCanvas(null)}
            className="fixed top-5 right-5 text-white bg-slate-800/80 hover:bg-slate-700 p-3 rounded-full transition cursor-pointer z-50 shadow-xl border border-slate-700"
          >
            <X size={22} />
          </button>

          {/* Architectural Proof Sheet Container */}
          <div className="bg-white border-4 border-slate-900 rounded-2xl shadow-2xl max-w-5xl w-full flex flex-col justify-between overflow-hidden my-auto animate-in fade-in zoom-in duration-200">
            {/* High-Res Image Canvas Box */}
            <div className="relative bg-slate-100 p-6 flex items-center justify-center min-h-[420px] max-h-[70vh] overflow-hidden">
              <img
                src={fullscreenCanvas.url}
                alt={fullscreenCanvas.name}
                className="max-h-[65vh] w-auto object-contain rounded shadow-lg"
              />
              <span className="absolute top-4 right-4 bg-slate-900/90 text-white text-xs font-mono font-bold px-3 py-1 rounded-md backdrop-blur-sm shadow">
                PROOF SHEET V{fullscreenCanvas.version}
              </span>
            </div>

            {/* Architectural Title Block Footer Table */}
            <div className="border-t-4 border-slate-900 bg-white">
              <div className="grid grid-cols-12 border-b-2 border-slate-800 text-xs divide-x-2 divide-slate-800 font-sans">
                {/* Col 1: FBS SIGNS Brand & Company Address */}
                <div className="col-span-3 p-3 bg-slate-50 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-1.5 font-black text-slate-900 tracking-tight text-sm">
                      <span className="bg-amber-400 text-slate-950 px-1.5 py-0.5 rounded text-xs">FBS</span>
                      SIGNS & PRINTING
                    </div>
                    <p className="text-[10px] font-bold text-slate-600 mt-1.5 leading-tight uppercase">
                      750 WARRENVILLE RD<br />LISLE, IL 60532
                    </p>
                  </div>
                  <p className="text-[10px] font-mono text-indigo-700 font-bold mt-2">WWW.FBSSIGNS.COM</p>
                </div>

                {/* Col 2: Project & Canvas Titles */}
                <div className="col-span-3 p-3 flex flex-col justify-between">
                  <div>
                    <span className="font-extrabold text-slate-400 uppercase text-[9px] tracking-wider block">PROJECT NAME:</span>
                    <span className="font-black text-slate-900 text-sm block truncate" title={fullscreenCanvas.projectName}>{fullscreenCanvas.projectName || "PROJECT PROOF"}</span>
                  </div>
                  <div className="mt-2">
                    <span className="font-extrabold text-slate-400 uppercase text-[9px] tracking-wider block">CANVAS TITLE:</span>
                    <span className="font-bold text-indigo-900 text-xs block truncate" title={fullscreenCanvas.name}>{fullscreenCanvas.name}</span>
                  </div>
                </div>

                {/* Col 3: Approvals & Specifications */}
                <div className="col-span-3 p-3 flex flex-col justify-between">
                  <div>
                    <span className="font-extrabold text-slate-400 uppercase text-[9px] tracking-wider block">CLIENT APPROVAL STATUS:</span>
                    <div className="mt-1">{getStatusBadge(fullscreenCanvas.status || "pending")}</div>
                  </div>
                  <div className="mt-2 border-t border-slate-200 pt-1">
                    <span className="font-bold text-slate-500 text-[10px] block uppercase">TYPE: {fullscreenCanvas.canvasType || "COLLAGE"}</span>
                  </div>
                </div>

                {/* Col 4: Architectural Legal Disclaimer */}
                <div className="col-span-3 p-3 bg-slate-50 flex flex-col justify-between text-[9px] leading-tight text-slate-600">
                  <p className="italic text-[9px] leading-tight text-slate-500">
                    This design is the original and unpublished work of FBS SIGNS and may not be reproduced, copied or exhibited in any fashion without express written permission.
                  </p>
                  <div className="pt-2 border-t border-slate-300 font-mono text-[9px] font-bold text-slate-800 flex justify-between">
                    <span>SCALE: N.T.S.</span>
                    <span>DATE: {fullscreenCanvas.date || new Date().toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </SidebarLayout>
  );
}
