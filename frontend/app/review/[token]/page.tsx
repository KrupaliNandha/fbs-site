"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  canvasApi,
  type ProjectModel,
  type CanvasModel,
} from "@/app/lib/client/canvas-api";
import {
  CheckCircle2,
  AlertCircle,
  Clock,
  ZoomIn,
  Layers,
  FileImage,
  LayoutGrid,
  History,
  MessageSquare,
  X,
  Share2,
  Loader2,
  Lock,
  ShieldCheck,
  List,
} from "lucide-react";
import { getStoredToken, getStoredUser } from "@/app/lib/auth/token";

export default function SecureCanvasReviewPage() {
  const params = useParams();
  const token = String(params.token || "");

  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [project, setProject] = useState<ProjectModel | null>(null);
  const [canvases, setCanvases] = useState<CanvasModel[]>([]);
  const [selectedCanvas, setSelectedCanvas] = useState<CanvasModel | null>(null);

  // Private Client Login Verification State
  const [isVerified, setIsVerified] = useState(false);
  const [clientEmailInput, setClientEmailInput] = useState("");
  const [loginError, setLoginError] = useState("");

  // Zoom / Lightbox modal state
  const [zoomImage, setZoomImage] = useState<string | null>(null);

  // Per-Image Remark & Submission State (Keyed by imageId for collage sub-images, or 0 for single canvas image)
  const [subImageRemarks, setSubImageRemarks] = useState<Record<number, string>>({});
  const [submittingImageId, setSubmittingImageId] = useState<number | null>(null);

  // Canvas Selector view mode
  const [canvasListViewMode, setCanvasListViewMode] = useState<"grid" | "list">("grid");

  const backendHost = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

  async function loadReviewData() {
    if (!token) return;
    setLoading(true);
    setError("");
    try {
      const data = await canvasApi.getPublicReview(token);
      setProject(data.project);
      setCanvases(data.canvases);

      // Check existing JWT token, logged-in user session, or client verification
      const localJwt = getStoredToken();
      const currentUser = getStoredUser();
      const storedAuth = typeof window !== "undefined" ? sessionStorage.getItem(`client_auth_${token}`) : null;

      if (localJwt || currentUser || (storedAuth && storedAuth.toLowerCase() === data.project.clientEmail.toLowerCase())) {
        setIsVerified(true);
      }

      if (data.canvases.length > 0 && !selectedCanvas) {
        setSelectedCanvas(data.canvases[0]);
      } else if (selectedCanvas) {
        const updated = data.canvases.find((c) => c.id === selectedCanvas.id);
        if (updated) setSelectedCanvas(updated);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load review project.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    setMounted(true);
    loadReviewData();
  }, [token]);

  // Global ESC key listener for zoom lightbox modal
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setZoomImage(null);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  function handleVerifyClientLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoginError("");

    if (!project) return;

    if (clientEmailInput.trim().toLowerCase() === project.clientEmail.toLowerCase()) {
      sessionStorage.setItem(`client_auth_${token}`, clientEmailInput.trim().toLowerCase());
      setIsVerified(true);
    } else {
      setLoginError("Verification failed: Email address does not match client records for this proof.");
    }
  }

  // Handle Per-Image Action (Approving or Requesting Changes on an individual photo)
  async function handleImageAction(
    imageId: number | null, // null for single image canvas
    statusAction: "approved" | "changes_requested",
  ) {
    if (!selectedCanvas || !selectedCanvas.latestVersion) return;
    const key = imageId || 0;
    const inputRemark = subImageRemarks[key]?.trim() || "";

    if (statusAction === "changes_requested" && !inputRemark) {
      alert("Please type a remark explaining what changes are needed for this image.");
      return;
    }

    setSubmittingImageId(key);
    try {
      await canvasApi.addRemark(selectedCanvas.id, {
        versionId: selectedCanvas.latestVersion.id,
        imageId: imageId || undefined,
        userName: project?.clientName || "Client Reviewer",
        remark: inputRemark || (statusAction === "approved" ? "Approved photo." : "Requested changes for this photo."),
        statusAction,
      });

      setSubImageRemarks((prev) => ({ ...prev, [key]: "" }));
      await loadReviewData();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to update image review status.");
    } finally {
      setSubmittingImageId(null);
    }
  }

  function getStatusBadge(status: string) {
    switch (status) {
      case "approved":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200">
            <CheckCircle2 size={14} /> Approved
          </span>
        );
      case "changes_requested":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700 border border-amber-200">
            <AlertCircle size={14} /> Changes Requested
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 border border-blue-200">
            <Clock size={14} /> Pending Review
          </span>
        );
    }
  }

  function getCanvasTypeBadge(type: string) {
    switch (type) {
      case "collage":
        return (
          <span className="inline-flex items-center gap-1 rounded bg-purple-50 px-2 py-0.5 text-xs font-medium text-purple-700">
            <LayoutGrid size={12} /> Auto Collage
          </span>
        );
      case "diagram":
        return (
          <span className="inline-flex items-center gap-1 rounded bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-700">
            <Layers size={12} /> Diagram Layout
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700">
            <FileImage size={12} /> Individual Canvas
          </span>
        );
    }
  }

  if (!mounted || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-medium text-slate-600">Loading design review details...</p>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] p-6">
        <div className="max-w-md w-full rounded-2xl bg-white border border-slate-200 p-8 text-center shadow-sm">
          <AlertCircle size={48} className="mx-auto text-amber-500 mb-4" />
          <h1 className="text-xl font-bold text-slate-900">Review Link Unavailable</h1>
          <p className="mt-2 text-sm text-slate-600">{error || "This review link may be invalid or expired."}</p>
        </div>
      </div>
    );
  }

  // PRIVATE CLIENT LOGIN VERIFICATION GATEWAY
  if (!isVerified) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 font-sans">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-2xl space-y-6 border border-slate-100">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
              <Lock size={28} />
            </div>
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
              Private Client Access
            </span>
            <h1 className="text-2xl font-black text-slate-900 mt-1">{project.name}</h1>
            <p className="text-xs text-slate-500">
              This proof review page is confidential. Please enter your registered client email address to view and review images.
            </p>
          </div>

          <form onSubmit={handleVerifyClientLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Client Email Address
              </label>
              <input
                required
                type="email"
                value={clientEmailInput}
                onChange={(e) => setClientEmailInput(e.target.value)}
                placeholder="Enter client email..."
                className="w-full rounded-xl border border-slate-300 p-3 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 outline-none transition"
              />
            </div>

            {loginError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-start gap-2">
                <AlertCircle size={16} className="text-rose-500 flex-shrink-0 mt-0.5" />
                <span>{loginError}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-extrabold text-sm shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <ShieldCheck size={18} /> Unlock Canvas Review
            </button>
          </form>
        </div>
      </div>
    );
  }

  const activeMainImage = selectedCanvas?.latestVersion?.watermarkedImageUrl
    ? `${backendHost}${selectedCanvas.latestVersion.watermarkedImageUrl}`
    : "/placeholder.png";

  const hasSubImages = selectedCanvas?.diagramImages && selectedCanvas.diagramImages.length > 0;

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col font-sans">
      {/* Top Header Bar */}
      <header className="sticky top-0 z-30 bg-white border-b border-slate-200/80 px-6 py-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full">
                Canvas Details & Approval
              </span>
              <span className="text-xs text-slate-500">• Verified Client Link</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mt-1">{project.name}</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Client: <strong className="text-slate-700">{project.clientName}</strong> ({project.clientEmail}) • Designer:{" "}
              <strong className="text-slate-700">{project.designerName}</strong>
            </p>
          </div>

          <div className="flex items-center gap-3">
            {getStatusBadge(project.status)}
            <button
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                alert("Canvas link copied to clipboard!");
              }}
              className="inline-flex items-center gap-2 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 px-3.5 py-2 rounded-lg transition"
            >
              <Share2 size={14} /> Copy Link
            </button>
          </div>
        </div>
      </header>

      {/* Main Standalone Canvas Workspace */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Column: Photos with Dedicated Request & Approve Controls */}
        <div className="lg:col-span-8 space-y-6">
          <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-6 space-y-6">
            {selectedCanvas ? (
              <>
                {/* Canvas Title Bar */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-slate-900">{selectedCanvas.name}</h2>
                    {getCanvasTypeBadge(selectedCanvas.canvasType)}
                    <span className="text-xs text-slate-400 font-mono">
                      (v{selectedCanvas.latestVersion?.versionNumber || 1})
                    </span>
                  </div>
                  <div>{getStatusBadge(selectedCanvas.status)}</div>
                </div>

                {/* PER-IMAGE APPROVAL WORKFLOW SECTION */}
                <div className="space-y-6">
                  <div className="p-3 bg-indigo-50/70 border border-indigo-100 rounded-xl flex items-center justify-between text-xs text-indigo-900">
                    <span className="font-semibold flex items-center gap-1.5">
                      <LayoutGrid size={15} className="text-indigo-600" /> Per-Image Review Workflow
                    </span>
                    <span className="text-[11px] text-indigo-700">
                      Each photo must be approved or requested changes individually below
                    </span>
                  </div>

                  {/* IF COLLAGE / MULTI-IMAGE CANVAS: Render each photo as an individual card */}
                  {hasSubImages ? (
                    <div className="space-y-6">
                      {selectedCanvas.diagramImages!.map((img, idx) => {
                        const imgUrl = `${backendHost}${img.watermarkedImageUrl}`;
                        const currentRemarkText = subImageRemarks[img.id] || "";
                        const isSubmitting = submittingImageId === img.id;

                        return (
                          <div
                            key={img.id}
                            className={`border rounded-2xl p-5 bg-white shadow-sm space-y-4 ${
                              img.status === "approved"
                                ? "border-emerald-300 ring-2 ring-emerald-400/20"
                                : img.status === "changes_requested"
                                ? "border-amber-300 ring-2 ring-amber-400/20"
                                : "border-slate-200"
                            }`}
                          >
                            {/* Photo Header */}
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-sm text-slate-800">
                                Photo #{idx + 1}: {img.caption || `Image Tile ${idx + 1}`}
                              </span>
                              {getStatusBadge(img.status)}
                            </div>

                            {/* Photo Image Frame with Fullscreen Zoom */}
                            <div className="relative aspect-[16/9] sm:aspect-[4/3] bg-slate-900/5 rounded-xl overflow-hidden group border border-slate-100">
                              <img
                                src={imgUrl}
                                alt={img.caption || `Photo ${idx + 1}`}
                                className="w-full h-full object-contain"
                              />
                              <button
                                onClick={() => setZoomImage(imgUrl)}
                                className="absolute inset-0 bg-slate-900/30 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white font-medium text-xs gap-1.5 backdrop-blur-[1px]"
                              >
                                <ZoomIn size={18} /> View Fullscreen
                              </button>
                            </div>

                            {/* Previous Remarks for this specific photo */}
                            {img.remarks && img.remarks.length > 0 && (
                              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
                                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide flex items-center gap-1">
                                  <MessageSquare size={13} /> Photo Remarks ({img.remarks.length})
                                </span>
                                <div className="space-y-1.5 max-h-32 overflow-y-auto">
                                  {img.remarks.map((r) => (
                                    <div key={r.id} className="text-xs text-slate-700 border-t border-slate-200/50 pt-1.5">
                                      <strong className="text-slate-800">{r.userName || "Client"}:</strong> "{r.remark}"
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Dedicated Per-Photo Remark & Action Buttons */}
                            <div className="space-y-3 border-t border-slate-100 pt-3">
                              <textarea
                                rows={2}
                                value={currentRemarkText}
                                onChange={(e) =>
                                  setSubImageRemarks({ ...subImageRemarks, [img.id]: e.target.value })
                                }
                                placeholder={`Write feedback or changes needed for Photo #${idx + 1}...`}
                                className="w-full rounded-xl border border-slate-200 p-3 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition"
                              />

                              <div className="grid grid-cols-2 gap-3">
                                <button
                                  disabled={isSubmitting}
                                  onClick={() => handleImageAction(img.id, "changes_requested")}
                                  className="w-full py-2.5 rounded-xl border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                                >
                                  {isSubmitting ? <Loader2 size={14} className="animate-spin" /> : <AlertCircle size={14} />}
                                  Request Changes
                                </button>

                                <button
                                  disabled={isSubmitting}
                                  onClick={() => handleImageAction(img.id, "approved")}
                                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                                >
                                  {isSubmitting ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle2 size={14} />}
                                  Approve Photo
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    /* SINGLE STANDALONE CANVAS PHOTO */
                    <div
                      className={`border rounded-2xl p-5 bg-white shadow-sm space-y-4 ${
                        selectedCanvas.status === "approved"
                          ? "border-emerald-300 ring-2 ring-emerald-400/20"
                          : selectedCanvas.status === "changes_requested"
                          ? "border-amber-300 ring-2 ring-amber-400/20"
                          : "border-slate-200"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-slate-800">
                          Photo: {selectedCanvas.name}
                        </span>
                        {getStatusBadge(selectedCanvas.status)}
                      </div>

                      {/* Photo Image Frame */}
                      <div className="relative flex items-center justify-center bg-slate-950/5 rounded-xl overflow-hidden group min-h-[380px] border border-slate-100">
                        <img
                          src={activeMainImage}
                          alt={selectedCanvas.name}
                          className="max-h-[500px] w-auto object-contain rounded"
                        />

                        {selectedCanvas.watermarkEnabled && (
                          <div className="absolute bottom-3 left-3 bg-slate-900/70 text-white text-[11px] px-2.5 py-1 rounded backdrop-blur-sm">
                            Protected Review Proof • Watermark Active
                          </div>
                        )}

                        <button
                          onClick={() => setZoomImage(activeMainImage)}
                          className="absolute inset-0 bg-slate-900/30 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white font-medium text-sm gap-2 backdrop-blur-[2px]"
                        >
                          <ZoomIn size={20} /> View Fullscreen
                        </button>
                      </div>

                      {/* Remarks History for this Single Photo */}
                      {selectedCanvas.remarks && selectedCanvas.remarks.length > 0 && (
                        <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
                          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide flex items-center gap-1">
                            <MessageSquare size={13} /> Photo Remarks ({selectedCanvas.remarks.length})
                          </span>
                          <div className="space-y-1.5 max-h-36 overflow-y-auto">
                            {selectedCanvas.remarks.map((r) => (
                              <div key={r.id} className="text-xs text-slate-700 border-t border-slate-200/50 pt-1.5">
                                <strong className="text-slate-800">{r.userName || "Client"}:</strong> "{r.remark}"
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Dedicated Per-Photo Action Form */}
                      <div className="space-y-3 border-t border-slate-100 pt-3">
                        <textarea
                          rows={3}
                          value={subImageRemarks[0] || ""}
                          onChange={(e) => setSubImageRemarks({ ...subImageRemarks, 0: e.target.value })}
                          placeholder="Write feedback or changes needed for this photo..."
                          className="w-full rounded-xl border border-slate-200 p-3 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition"
                        />

                        <div className="grid grid-cols-2 gap-3">
                          <button
                            disabled={submittingImageId === 0}
                            onClick={() => handleImageAction(null, "changes_requested")}
                            className="w-full py-2.5 rounded-xl border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                          >
                            {submittingImageId === 0 ? <Loader2 size={14} className="animate-spin" /> : <AlertCircle size={14} />}
                            Request Changes
                          </button>

                          <button
                            disabled={submittingImageId === 0}
                            onClick={() => handleImageAction(null, "approved")}
                            className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                          >
                            {submittingImageId === 0 ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle2 size={14} />}
                            Approve Photo
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-400 py-12">
                <FileImage size={40} className="mb-2" />
                <p>No canvas selected</p>
              </div>
            )}
          </div>

          {/* Canvas Selector Strip */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Project Canvases ({canvases.length})
              </h3>

              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
                <button
                  onClick={() => setCanvasListViewMode("grid")}
                  className={`p-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                    canvasListViewMode === "grid"
                      ? "bg-white text-indigo-600 shadow-sm"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                  title="Grid Thumbnails"
                >
                  <LayoutGrid size={14} />
                </button>
                <button
                  onClick={() => setCanvasListViewMode("list")}
                  className={`p-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                    canvasListViewMode === "list"
                      ? "bg-white text-indigo-600 shadow-sm"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                  title="Compact List View"
                >
                  <List size={14} />
                </button>
              </div>
            </div>

            {canvasListViewMode === "list" ? (
              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                {canvases.map((c) => {
                  const thumb = c.latestVersion?.thumbnailUrl
                    ? `${backendHost}${c.latestVersion.thumbnailUrl}`
                    : "/placeholder.png";
                  const isSelected = selectedCanvas?.id === c.id;

                  return (
                    <button
                      key={c.id}
                      onClick={() => setSelectedCanvas(c)}
                      className={`w-full p-2.5 rounded-xl border text-left transition flex items-center justify-between bg-white cursor-pointer ${
                        isSelected
                          ? "border-indigo-600 ring-2 ring-indigo-500/20 shadow-sm bg-indigo-50/20"
                          : "border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <img src={thumb} alt={c.name} className="w-10 h-10 object-cover rounded-lg flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-slate-800 truncate">{c.name}</p>
                          <p className="text-[10px] text-slate-400 font-mono">
                            v{c.latestVersion?.versionNumber || 1} • <span className="capitalize">{c.canvasType}</span>
                          </p>
                        </div>
                      </div>
                      <div className="flex-shrink-0">{getStatusBadge(c.status)}</div>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {canvases.map((c) => {
                  const thumb = c.latestVersion?.thumbnailUrl
                    ? `${backendHost}${c.latestVersion.thumbnailUrl}`
                    : "/placeholder.png";
                  const isSelected = selectedCanvas?.id === c.id;

                  return (
                    <button
                      key={c.id}
                      onClick={() => setSelectedCanvas(c)}
                      className={`p-2.5 rounded-xl border text-left transition flex flex-col justify-between bg-white cursor-pointer ${
                        isSelected
                          ? "border-indigo-600 ring-2 ring-indigo-500/20 shadow-sm"
                          : "border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <div className="aspect-[4/3] bg-slate-100 rounded-lg overflow-hidden mb-2 relative">
                        <img src={thumb} alt={c.name} className="w-full h-full object-cover" />
                        <span className="absolute bottom-1 right-1 text-[10px] bg-slate-900/80 text-white px-1.5 py-0.5 rounded font-mono">
                          v{c.latestVersion?.versionNumber || 1}
                        </span>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-800 truncate">{c.name}</p>
                        <div className="mt-1">{getStatusBadge(c.status)}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar Column: Revision Activity & Remarks Audit */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-5">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <History size={16} className="text-indigo-600" />
              <h3 className="text-sm font-bold text-slate-900">Activity & Status History</h3>
            </div>

            {selectedCanvas && (
              <div className="space-y-4">
                <div className="relative border-l-2 border-slate-200 ml-3 pl-4 space-y-4">
                  {selectedCanvas.history && selectedCanvas.history.length > 0 ? (
                    selectedCanvas.history.map((h) => (
                      <div key={h.id} className="relative">
                        <div className="absolute -left-[23px] top-1 w-3.5 h-3.5 rounded-full bg-indigo-600 border-2 border-white" />
                        <p className="text-xs font-bold text-slate-800">{h.newStatus.replace("_", " ").toUpperCase()}</p>
                        <p className="text-xs text-slate-500">{h.note}</p>
                        <span className="text-[10px] text-slate-400">
                          {new Date(h.createdAt).toLocaleString()} • {h.actorName}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-slate-400 italic">No status activity recorded yet.</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Fullscreen Lightbox Modal */}
      {zoomImage && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
          <button
            onClick={() => setZoomImage(null)}
            className="absolute top-5 right-5 text-white bg-slate-800 hover:bg-slate-700 p-2.5 rounded-full transition cursor-pointer"
          >
            <X size={20} />
          </button>
          <img src={zoomImage} alt="Fullscreen View" className="max-h-[90vh] max-w-[90vw] object-contain rounded-lg shadow-2xl" />
        </div>
      )}
    </div>
  );
}
