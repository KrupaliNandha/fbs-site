import { Router, type Request, type Response, type NextFunction } from "express";
import multer from "multer";
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
  createDiagramTemplate,
  deleteDiagramTemplate,
} from "../lib/canvas/diagrams.js";
import { processCanvasImage } from "../lib/canvas/watermark.js";
import { createAutoCollageBuffer } from "../lib/canvas/collage.js";

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

    const canvases = await listProjectCanvases(project.id);
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
    const project = await getProjectById(projectId);
    if (!project) {
      res.status(404).json({ message: "Project not found." });
      return;
    }
    const canvases = await listProjectCanvases(projectId);
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

      if (files.length === 0) {
        res.status(400).json({ message: "No image files were uploaded." });
        return;
      }

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
        const processedDiagramImages = [];
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
            caption: file.originalname,
          });
        }

        const mainImage = processedDiagramImages[0];
        const canvas = await createCanvasWithInitialVersion({
          projectId: parsedProjectId,
          name,
          canvasType: "diagram",
          diagramTemplateId: parsedDiagramId,
          watermarkEnabled: isWatermarkOn,
          watermarkText,
          createdBy: user.id,
          originalImageUrl: mainImage.originalUrl,
          watermarkedImageUrl: mainImage.watermarkedUrl,
          thumbnailUrl: mainImage.thumbnailUrl,
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

      await updateCanvasSubImage(imageId, {
        ...fileData,
        caption: caption !== undefined ? String(caption) : undefined,
      });

      res.json({ success: true });
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

      const newId = await addCanvasSubImage(canvasId, Number(versionId), {
        originalImageUrl: processed.originalUrl,
        watermarkedImageUrl: processed.watermarkedUrl,
        thumbnailUrl: processed.thumbnailUrl,
        caption: caption || file.originalname,
      });

      res.json({ id: newId, success: true });
    } catch (err) {
      res.status(500).json({ message: err instanceof Error ? err.message : "Error adding sub-image to canvas." });
    }
  },
);

// Delete an individual sub-image from a collage
canvasRouter.delete("/canvases/sub-images/:imageId", requireAuth(), async (req, res) => {
  try {
    const imageId = Number(req.params.imageId);
    await deleteCanvasSubImage(imageId);
    res.json({ success: true });
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

canvasRouter.delete("/diagram-templates/:id", requireAuth(), async (req, res) => {
  try {
    const id = Number(req.params.id);
    await deleteDiagramTemplate(id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err instanceof Error ? err.message : "Error deleting diagram template." });
  }
});
