import { Router, type Request, type Response, type NextFunction } from "express";
import multer from "multer";
import path from "path";
import fs from "fs/promises";
import sharp from "sharp";
import { getCurrentUser, requireAuth } from "../lib/auth.js";
import type { AuthUser } from "../lib/types.js";
import {
  listClients,
  getClientById,
  createClient,
  updateClient,
  deleteClient,
} from "../lib/canvas/clients.js";
import {
  listProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  getOrCreateShareToken,
  getProjectByShareToken,
} from "../lib/canvas/projects.js";
import {
  listProjectCanvases,
  createCanvasWithInitialVersion,
  addCanvasRevision,
  addCanvasRemarkAndStatus,
  deleteCanvas,
  updateCanvasInfo,
  updateCanvasSubImage,
  addCanvasSubImage,
  deleteCanvasSubImage,
  unbundleCollageCanvas,
} from "../lib/canvas/canvases.js";
import {
  listDiagramTemplates,
  getDiagramTemplateById,
  createDiagramTemplate,
  updateDiagramTemplate,
  deleteDiagramTemplate,
} from "../lib/canvas/diagrams.js";
import { processCanvasImage, UPLOADS_DIR } from "../lib/canvas/watermark.js";
import { createAutoCollageBuffer } from "../lib/canvas/collage.js";
import { query } from "../lib/db.js";

async function getDiagramTemplateImageBuffer(previewUrl?: string | null, tmplName?: string): Promise<Buffer> {
  if (previewUrl && previewUrl.startsWith("/uploads/")) {
    try {
      const relPath = previewUrl.replace(/^\/uploads\//, "");
      const fullPath = path.join(UPLOADS_DIR, relPath);
      const buf = await fs.readFile(fullPath);
      if (buf && buf.length > 0) return buf;
    } catch {
      // Fall through to dynamic SVG rendering if file read fails
    }
  }

  const safeTitle = (tmplName || "Diagram Layout Blueprint").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const svg = `
    <svg width="1600" height="1200" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#0f172a" />
      <g stroke="#38bdf8" stroke-width="2" stroke-dasharray="12,12" fill="none" opacity="0.4">
        <line x1="100" y1="0" x2="100" y2="1200" />
        <line x1="400" y1="0" x2="400" y2="1200" />
        <line x1="800" y1="0" x2="800" y2="1200" />
        <line x1="1200" y1="0" x2="1200" y2="1200" />
        <line x1="1500" y1="0" x2="1500" y2="1200" />
        <line x1="0" y1="100" x2="1600" y2="100" />
        <line x1="0" y1="300" x2="1600" y2="300" />
        <line x1="0" y1="600" x2="1600" y2="600" />
        <line x1="0" y1="900" x2="1600" y2="900" />
        <line x1="0" y1="1100" x2="1600" y2="1100" />
      </g>
      <rect x="60" y="60" width="1480" height="1080" fill="none" stroke="#38bdf8" stroke-width="6" />
      <text x="800" y="550" font-family="Arial, sans-serif" font-size="54" font-weight="bold" fill="#ffffff" text-anchor="middle">
        ${safeTitle}
      </text>
      <text x="800" y="630" font-family="Arial, sans-serif" font-size="28" font-weight="bold" fill="#38bdf8" text-anchor="middle">
        TECHNICAL ARCHITECTURAL BLUEPRINT
      </text>
    </svg>
  `;
  return sharp(Buffer.from(svg)).png().toBuffer();
}

async function rebuildCanvasCollageComposite(canvasId: number, versionId: number): Promise<void> {
  try {
    const [cRows] = await query<any[]>(
      `SELECT watermark_enabled, watermark_text, diagram_template_id FROM canvases WHERE id = ?`,
      [canvasId]
    );
    if (!cRows || cRows.length === 0) return;
    const canvas = cRows[0];
    const isWatermarkOn = Boolean(canvas.watermark_enabled);
    const watermarkText = canvas.watermark_text ? String(canvas.watermark_text) : undefined;

    const [subRows] = await query<any[]>(
      `SELECT original_image_url, watermarked_image_url FROM diagram_images WHERE canvas_id = ? AND version_id = ? ORDER BY sort_order ASC, id ASC`,
      [canvasId, versionId]
    );

    const imageBuffers: Buffer[] = [];

    if (canvas.diagram_template_id) {
      const [tmplRows] = await query<any[]>(
        `SELECT name, preview_url FROM diagram_templates WHERE id = ?`,
        [canvas.diagram_template_id]
      );
      if (tmplRows && tmplRows.length > 0) {
        const tmplBuf = await getDiagramTemplateImageBuffer(tmplRows[0].preview_url, tmplRows[0].name);
        if (tmplBuf) imageBuffers.push(tmplBuf);
      }
    }

    for (const row of subRows) {
      const imgUrl = String(row.original_image_url || row.watermarked_image_url || "");
      if (imgUrl.startsWith("/uploads/")) {
        try {
          const relPath = imgUrl.replace(/^\/uploads\//, "");
          const fullPath = path.join(UPLOADS_DIR, relPath);
          const buf = await fs.readFile(fullPath);
          if (buf && buf.length > 0) {
            imageBuffers.push(buf);
          }
        } catch (err) {
          console.error("Error reading sub-image file for collage rebuild:", err);
        }
      }
    }

    if (imageBuffers.length === 0) return;

    const collageBuf = await createAutoCollageBuffer(imageBuffers);
    const processed = await processCanvasImage(
      collageBuf,
      `collage_rev_${versionId}`,
      isWatermarkOn,
      watermarkText
    );

    await query(
      `UPDATE canvas_versions SET original_image_url = ?, watermarked_image_url = ?, thumbnail_url = ? WHERE id = ?`,
      [processed.originalUrl, processed.watermarkedUrl, processed.thumbnailUrl, versionId]
    );
  } catch (err) {
    console.error("Failed to rebuild canvas collage composite:", err);
  }
}

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 25 * 1024 * 1024 }, // 25MB max
});

export const canvasRouter = Router();

// ==========================================
// 1. PUBLIC / CLIENT SECURE REVIEW ENDPOINT
// ==========================================
canvasRouter.get("/review/:token", async (req, res) => {
  try {
    const token = String(req.params.token);
    const project = await getProjectByShareToken(token);

    if (!project) {
      res.status(404).json({ message: "Invalid or expired review link." });
      return;
    }

    // includeHistory: client review Activity panel needs status timeline
    const canvases = await listProjectCanvases(project.id, { includeHistory: true });
    res.json({ project, canvases });
  } catch (err) {
    res.status(500).json({ message: err instanceof Error ? err.message : "Error fetching review." });
  }
});

// ==========================================
// 2. CLIENT MANAGEMENT APIs (CRUD + Search + Pagination)
// ==========================================
canvasRouter.get("/clients", requireAuth(), async (req, res) => {
  try {
    const user = (req as any).user as AuthUser;
    const search = req.query.search ? String(req.query.search) : undefined;
    const page = req.query.page ? Number(req.query.page) : 1;
    const limit = req.query.limit ? Number(req.query.limit) : 10;

    const designerId = user.roles.includes("super_admin") ? undefined : user.id;

    const result = await listClients({ designerId, search, page, limit });
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err instanceof Error ? err.message : "Error listing clients." });
  }
});

canvasRouter.post("/clients", requireAuth(), async (req, res) => {
  try {
    const user = (req as any).user as AuthUser;
    const { name, email, phone, companyName } = req.body;

    if (!name || !email || !phone) {
      res.status(400).json({ message: "Name, email, and phone are required." });
      return;
    }

    const client = await createClient({
      designerId: user.id,
      name,
      email,
      phone,
      companyName,
    });
    res.status(201).json(client);
  } catch (err) {
    res.status(500).json({ message: err instanceof Error ? err.message : "Error creating client." });
  }
});

canvasRouter.put("/clients/:id", requireAuth(), async (req, res) => {
  try {
    const clientId = Number(req.params.id);
    const updated = await updateClient(clientId, req.body);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err instanceof Error ? err.message : "Error updating client." });
  }
});

canvasRouter.delete("/clients/:id", requireAuth(), async (req, res) => {
  try {
    const clientId = Number(req.params.id);
    await deleteClient(clientId);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err instanceof Error ? err.message : "Error deleting client." });
  }
});

// ==========================================
// 3. PROJECT MANAGEMENT APIs
// ==========================================
canvasRouter.get("/projects", requireAuth(), async (req, res) => {
  try {
    const user = (req as any).user as AuthUser;
    const search = req.query.search ? String(req.query.search) : undefined;
    const status = req.query.status ? String(req.query.status) : undefined;

    let designerId: number | undefined;
    let clientId: number | undefined;

    if (user.roles.includes("super_admin")) {
      // Super admin sees everything
    } else if (user.roles.includes("designer")) {
      designerId = user.id;
    } else {
      const clientList = await listClients({ search: user.email, limit: 1 });
      const clientMatch = clientList.clients.find((c) => c.email.toLowerCase() === user.email.toLowerCase());
      if (clientMatch) {
        clientId = clientMatch.id;
      } else {
        res.json([]);
        return;
      }
    }

    const projects = await listProjects({ designerId, clientId, search, status });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: err instanceof Error ? err.message : "Error listing projects." });
  }
});

canvasRouter.post("/projects", requireAuth(), async (req, res) => {
  try {
    const user = (req as any).user as AuthUser;
    const { clientId, name, description } = req.body;

    if (!clientId || !name) {
      res.status(400).json({ message: "Client ID and project name are required." });
      return;
    }

    const project = await createProject({
      clientId: Number(clientId),
      designerId: user.id,
      name,
      description,
    });
    res.status(201).json(project);
  } catch (err) {
    res.status(500).json({ message: err instanceof Error ? err.message : "Error creating project." });
  }
});

canvasRouter.get("/projects/:id", requireAuth(), async (req, res) => {
  try {
    const projectId = Number(req.params.id);
    // Parallel: project meta + canvases (saves one remote MySQL RTT vs sequential)
    // includeHistory: activity timeline for client/designer project detail views
    const [project, canvases] = await Promise.all([
      getProjectById(projectId),
      listProjectCanvases(projectId, { includeHistory: true }),
    ]);
    if (!project) {
      res.status(404).json({ message: "Project not found." });
      return;
    }
    res.json({ ...project, canvases });
  } catch (err) {
    res.status(500).json({ message: err instanceof Error ? err.message : "Error fetching project." });
  }
});

canvasRouter.put("/projects/:id", requireAuth(), async (req, res) => {
  try {
    const projectId = Number(req.params.id);
    const updated = await updateProject(projectId, req.body);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err instanceof Error ? err.message : "Error updating project." });
  }
});

canvasRouter.delete("/projects/:id", requireAuth(), async (req, res) => {
  try {
    const projectId = Number(req.params.id);
    await deleteProject(projectId);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err instanceof Error ? err.message : "Error deleting project." });
  }
});

canvasRouter.get("/projects/:id/share", requireAuth(), async (req, res) => {
  try {
    const user = (req as any).user as AuthUser;
    const projectId = Number(req.params.id);
    const token = await getOrCreateShareToken(projectId, user.id);
    res.json({ shareToken: token });
  } catch (err) {
    res.status(500).json({ message: err instanceof Error ? err.message : "Error generating share token." });
  }
});

// ==========================================
// 4. CANVAS UPLOAD & REVISION APIs
// ==========================================
canvasRouter.post(
  "/canvases/upload",
  requireAuth(),
  upload.array("files", 10),
  async (req, res) => {
    try {
      const user = (req as any).user as AuthUser;
      const files = (req.files as Express.Multer.File[]) || [];

      const {
        projectId,
        name,
        canvasType,
        diagramTemplateId,
        watermarkEnabled,
        watermarkText,
      } = req.body;

      if (!projectId || !name || !canvasType) {
        res.status(400).json({ message: "Project ID, canvas name, and canvas type are required." });
        return;
      }

      const isWatermarkOn = String(watermarkEnabled) === "true" || watermarkEnabled === true;
      const parsedProjectId = Number(projectId);
      const parsedDiagramId = diagramTemplateId ? Number(diagramTemplateId) : undefined;

      if (files.length === 0) {
        if (canvasType === "diagram" && parsedDiagramId) {
          const diagramTmpl = await getDiagramTemplateById(parsedDiagramId);
          const tmplUrl = diagramTmpl?.previewUrl || "/placeholder.png";

          const canvas = await createCanvasWithInitialVersion({
            projectId: parsedProjectId,
            name,
            canvasType: "diagram",
            diagramTemplateId: parsedDiagramId,
            watermarkEnabled: isWatermarkOn,
            watermarkText,
            createdBy: user.id,
            originalImageUrl: tmplUrl,
            watermarkedImageUrl: tmplUrl,
            thumbnailUrl: tmplUrl,
            diagramImages: [
              {
                originalUrl: tmplUrl,
                watermarkedUrl: tmplUrl,
                thumbnailUrl: tmplUrl,
                caption: diagramTmpl?.name || name,
              },
            ],
          });

          res.status(201).json([canvas]);
          return;
        }

        res.status(400).json({ message: "No image files or diagram blueprint selected." });
        return;
      }

      const createdCanvases = [];

      if (canvasType === "collage") {
        const imageBuffers = files.map((f) => f.buffer);
        const collageBuffer = await createAutoCollageBuffer(imageBuffers);

        const processed = await processCanvasImage(
          collageBuffer,
          `collage_${parsedProjectId}`,
          isWatermarkOn,
          watermarkText,
        );

        const processedCollageImages = [];
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          const proc = await processCanvasImage(
            file.buffer,
            `collage_${parsedProjectId}_tile_${i}`,
            isWatermarkOn,
            watermarkText,
          );
          processedCollageImages.push({
            originalUrl: proc.originalUrl,
            watermarkedUrl: proc.watermarkedUrl,
            thumbnailUrl: proc.thumbnailUrl,
            caption: file.originalname || `Image ${i + 1}`,
          });
        }

        const canvas = await createCanvasWithInitialVersion({
          projectId: parsedProjectId,
          name,
          canvasType: "collage",
          watermarkEnabled: isWatermarkOn,
          watermarkText,
          createdBy: user.id,
          originalImageUrl: processed.originalUrl,
          watermarkedImageUrl: processed.watermarkedUrl,
          thumbnailUrl: processed.thumbnailUrl,
          diagramImages: processedCollageImages,
        });
        createdCanvases.push(canvas);
      } else if (canvasType === "diagram") {
        const imageBuffers: Buffer[] = [];
        const processedDiagramImages = [];

        // 1. If blueprint layout template is selected, load and composite diagram template blueprint tile
        if (parsedDiagramId) {
          const diagramTmpl = await getDiagramTemplateById(parsedDiagramId);
          if (diagramTmpl) {
            const diagramBuf = await getDiagramTemplateImageBuffer(diagramTmpl.previewUrl, diagramTmpl.name);
            const proc = await processCanvasImage(
              diagramBuf,
              `diagram_tmpl_${parsedProjectId}`,
              isWatermarkOn,
              watermarkText,
            );
            processedDiagramImages.push({
              originalUrl: proc.originalUrl,
              watermarkedUrl: proc.watermarkedUrl,
              thumbnailUrl: proc.thumbnailUrl,
              caption: diagramTmpl.name || "Diagram Blueprint Layout",
            });
            imageBuffers.push(diagramBuf);
          }
        }

        // 2. Process all uploaded file tiles
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          const proc = await processCanvasImage(
            file.buffer,
            `diagram_${parsedProjectId}_${i}`,
            isWatermarkOn,
            watermarkText,
          );
          processedDiagramImages.push({
            originalUrl: proc.originalUrl,
            watermarkedUrl: proc.watermarkedUrl,
            thumbnailUrl: proc.thumbnailUrl,
            caption: file.originalname || `Photo Tile ${i + 1}`,
          });
          imageBuffers.push(file.buffer);
        }

        if (imageBuffers.length === 0) {
          res.status(400).json({ message: "No image files or diagram blueprint selected." });
          return;
        }

        // 3. Composite all tiles (blueprint layout + photos) into auto collage buffer
        const collageBuffer = await createAutoCollageBuffer(imageBuffers);
        const processedCollage = await processCanvasImage(
          collageBuffer,
          `diagram_collage_${parsedProjectId}`,
          isWatermarkOn,
          watermarkText,
        );

        // 4. Create diagram canvas with composite main proof image & attached sub-images
        const canvas = await createCanvasWithInitialVersion({
          projectId: parsedProjectId,
          name,
          canvasType: "diagram",
          diagramTemplateId: parsedDiagramId,
          watermarkEnabled: isWatermarkOn,
          watermarkText,
          createdBy: user.id,
          originalImageUrl: processedCollage.originalUrl,
          watermarkedImageUrl: processedCollage.watermarkedUrl,
          thumbnailUrl: processedCollage.thumbnailUrl,
          diagramImages: processedDiagramImages,
        });
        createdCanvases.push(canvas);
      } else {
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          const canvasName = files.length === 1 ? name : `${name} (${i + 1})`;

          const processed = await processCanvasImage(
            file.buffer,
            `canvas_${parsedProjectId}`,
            isWatermarkOn,
            watermarkText,
          );

          const canvas = await createCanvasWithInitialVersion({
            projectId: parsedProjectId,
            name: canvasName,
            canvasType: "individual",
            diagramTemplateId: parsedDiagramId,
            watermarkEnabled: isWatermarkOn,
            watermarkText,
            createdBy: user.id,
            originalImageUrl: processed.originalUrl,
            watermarkedImageUrl: processed.watermarkedUrl,
            thumbnailUrl: processed.thumbnailUrl,
          });
          createdCanvases.push(canvas);
        }
      }

      res.status(201).json(createdCanvases);
    } catch (err) {
      res.status(500).json({ message: err instanceof Error ? err.message : "Error uploading canvas." });
    }
  },
);

canvasRouter.post(
  "/canvases/:id/revisions",
  requireAuth(),
  upload.single("file"),
  async (req, res) => {
    try {
      const user = (req as any).user as AuthUser;
      const canvasId = Number(req.params.id);
      const file = req.file;

      if (!file) {
        res.status(400).json({ message: "An image file is required for revision upload." });
        return;
      }

      const { watermarkEnabled, watermarkText, newStatus } = req.body;
      const isWatermarkOn = String(watermarkEnabled) === "true" || watermarkEnabled === true;

      const processed = await processCanvasImage(
        file.buffer,
        `rev_${canvasId}`,
        isWatermarkOn,
        watermarkText,
      );

      const updated = await addCanvasRevision({
        canvasId,
        uploadedBy: user.id,
        originalImageUrl: processed.originalUrl,
        watermarkedImageUrl: processed.watermarkedUrl,
        thumbnailUrl: processed.thumbnailUrl,
        newStatus: newStatus || "pending_review",
      });

      res.json(updated);
    } catch (err) {
      res.status(500).json({ message: err instanceof Error ? err.message : "Error adding revision." });
    }
  },
);

// ==========================================
// 5. CLIENT REMARKS & APPROVAL APIs
// ==========================================
canvasRouter.post("/canvases/:id/remarks", async (req, res) => {
  try {
    const canvasId = Number(req.params.id);
    const { versionId, imageId, userId, userName, remark, statusAction } = req.body;

    if (!versionId || !remark || !statusAction) {
      res.status(400).json({ message: "Version ID, remark text, and status action are required." });
      return;
    }

    const updated = await addCanvasRemarkAndStatus({
      canvasId,
      versionId: Number(versionId),
      imageId: imageId ? Number(imageId) : undefined,
      userId: userId ? Number(userId) : undefined,
      userName,
      remark,
      statusAction,
    });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err instanceof Error ? err.message : "Error adding remark." });
  }
});

canvasRouter.delete("/canvases/:id", requireAuth(), async (req, res) => {
  try {
    const canvasId = Number(req.params.id);
    await deleteCanvas(canvasId);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err instanceof Error ? err.message : "Error deleting canvas." });
  }
});

// Update canvas details (name, watermark)
canvasRouter.put("/canvases/:id", requireAuth(), async (req, res) => {
  try {
    const canvasId = Number(req.params.id);
    const { name, watermarkEnabled, watermarkText } = req.body;
    await updateCanvasInfo(canvasId, { name, watermarkEnabled, watermarkText });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err instanceof Error ? err.message : "Error updating canvas details." });
  }
});

// Replace an individual sub-image / tile within a canvas collage
canvasRouter.put(
  "/canvases/sub-images/:imageId",
  requireAuth(),
  upload.single("file"),
  async (req, res) => {
    try {
      const user = (req as any).user as AuthUser;
      const imageId = Number(req.params.imageId);
      const file = req.file;
      const { caption, watermarkEnabled, watermarkText } = req.body;

      let fileData: { originalImageUrl?: string; watermarkedImageUrl?: string; thumbnailUrl?: string } = {};

      if (file) {
        const isWatermarkOn = String(watermarkEnabled) === "true" || watermarkEnabled === true;
        const processed = await processCanvasImage(
          file.buffer,
          `sub_img_${imageId}`,
          isWatermarkOn,
          watermarkText,
        );
        fileData = {
          originalImageUrl: processed.originalUrl,
          watermarkedImageUrl: processed.watermarkedUrl,
          thumbnailUrl: processed.thumbnailUrl,
        };
      }

      const updated = await updateCanvasSubImage(imageId, {
        ...fileData,
        caption: caption !== undefined ? String(caption) : undefined,
        uploadedBy: user.id,
      });

      // Rebuild composite on the (possibly new) version after tile replace
      if (file) {
        await rebuildCanvasCollageComposite(updated.canvasId, updated.versionId);
      }

      res.json({ success: true, versionId: updated.versionId, canvasId: updated.canvasId });
    } catch (err) {
      res.status(500).json({ message: err instanceof Error ? err.message : "Error updating sub-image tile." });
    }
  },
);

// Add a new sub-image to a collage
canvasRouter.post(
  "/canvases/:id/sub-images",
  requireAuth(),
  upload.single("file"),
  async (req, res) => {
    try {
      const user = (req as any).user as AuthUser;
      const canvasId = Number(req.params.id);
      const file = req.file;
      if (!file) {
        res.status(400).json({ message: "File is required." });
        return;
      }
      const { versionId, caption, watermarkEnabled, watermarkText } = req.body;
      const isWatermarkOn = String(watermarkEnabled) === "true" || watermarkEnabled === true;

      const processed = await processCanvasImage(
        file.buffer,
        `sub_add_${canvasId}`,
        isWatermarkOn,
        watermarkText,
      );

      const added = await addCanvasSubImage(canvasId, Number(versionId), {
        originalImageUrl: processed.originalUrl,
        watermarkedImageUrl: processed.watermarkedUrl,
        thumbnailUrl: processed.thumbnailUrl,
        caption: caption || file.originalname,
        uploadedBy: user.id,
      });

      // Rebuild composite on the new version with the added tile
      await rebuildCanvasCollageComposite(canvasId, added.versionId);

      res.json({ id: added.id, versionId: added.versionId, success: true });
    } catch (err) {
      res.status(500).json({ message: err instanceof Error ? err.message : "Error adding sub-image to canvas." });
    }
  },
);

// Delete an individual sub-image from a collage
canvasRouter.delete("/canvases/sub-images/:imageId", requireAuth(), async (req, res) => {
  try {
    const user = (req as any).user as AuthUser;
    const imageId = Number(req.params.imageId);

    const deleted = await deleteCanvasSubImage(imageId, user.id);

    if (deleted) {
      await rebuildCanvasCollageComposite(deleted.canvasId, deleted.versionId);
    }

    res.json({ success: true, versionId: deleted?.versionId });
  } catch (err) {
    res.status(500).json({ message: err instanceof Error ? err.message : "Error deleting sub-image tile." });
  }
});

canvasRouter.post("/canvases/:id/unbundle", requireAuth(), async (req, res) => {
  try {
    const canvasId = Number(req.params.id);
    const canvases = await unbundleCollageCanvas(canvasId);
    res.json(canvases);
  } catch (err) {
    res.status(500).json({ message: err instanceof Error ? err.message : "Error converting collage to individual canvases." });
  }
});

// ==========================================
// 6. DIAGRAM TEMPLATES APIs (Super Admin)
// ==========================================
canvasRouter.get("/diagram-templates", async (_req, res) => {
  try {
    const templates = await listDiagramTemplates();
    res.json(templates);
  } catch (err) {
    res.status(500).json({ message: err instanceof Error ? err.message : "Error listing diagram templates." });
  }
});

canvasRouter.post("/diagram-templates", requireAuth(), upload.single("image"), async (req, res) => {
  try {
    const { name, description } = req.body;
    let previewUrl = req.body.previewUrl;

    if (!name) {
      res.status(400).json({ message: "Diagram blueprint name is required." });
      return;
    }

    if (req.file) {
      const processed = await processCanvasImage(
        req.file.buffer,
        `diagram_tmpl_${Date.now()}`,
        false,
      );
      previewUrl = processed.watermarkedUrl;
    }

    const created = await createDiagramTemplate({
      name,
      description,
      previewUrl,
    });
    res.status(201).json(created);
  } catch (err) {
    res.status(500).json({ message: err instanceof Error ? err.message : "Error creating diagram blueprint." });
  }
});

canvasRouter.put("/diagram-templates/:id", requireAuth(), upload.single("image"), async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { name, description } = req.body;
    let previewUrl = req.body.previewUrl;

    if (req.file) {
      const processed = await processCanvasImage(
        req.file.buffer,
        `diagram_tmpl_${Date.now()}`,
        false,
      );
      previewUrl = processed.watermarkedUrl;
    }

    const updated = await updateDiagramTemplate(id, {
      name,
      description,
      previewUrl,
    });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err instanceof Error ? err.message : "Error updating diagram blueprint." });
  }
});

canvasRouter.delete("/diagram-templates/:id", requireAuth(), async (req, res) => {
  try {
    const id = Number(req.params.id);
    await deleteDiagramTemplate(id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err instanceof Error ? err.message : "Error deleting diagram template." });
  }
});
