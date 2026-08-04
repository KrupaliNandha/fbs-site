import { query, execute, withTransaction, ensureCanvasCollageSchema } from "../db.js";
import type { RowDataPacket, ResultSetHeader } from "mysql2/promise";
import { deleteUploadFilesByUrls } from "./watermark.js";

export type CanvasVersionRecord = {
  id: number;
  canvasId: number;
  versionNumber: number;
  originalImageUrl: string;
  watermarkedImageUrl: string;
  thumbnailUrl: string;
  metadata?: Record<string, unknown> | null;
  uploadedBy: number;
  createdAt: string;
};

export type CanvasRemarkRecord = {
  id: number;
  canvasId: number;
  versionId: number;
  imageId?: number | null;
  userId?: number | null;
  userName?: string | null;
  remark: string;
  statusAction: "approved" | "changes_requested" | "comment";
  createdAt: string;
};

export type DiagramImageRecord = {
  id: number;
  canvasId: number;
  versionId: number;
  originalImageUrl: string;
  watermarkedImageUrl: string;
  thumbnailUrl: string;
  caption?: string | null;
  status: "pending_review" | "approved" | "changes_requested";
  sortOrder: number;
  createdAt: string;
  remarks?: CanvasRemarkRecord[];
};

export type CanvasStatusHistoryRecord = {
  id: number;
  canvasId: number;
  actorUserId?: number | null;
  actorName?: string | null;
  oldStatus?: string | null;
  newStatus: string;
  note?: string | null;
  createdAt: string;
};

export type CanvasRecord = {
  id: number;
  projectId: number;
  name: string;
  canvasType: "individual" | "collage" | "diagram";
  diagramTemplateId?: number | null;
  watermarkEnabled: boolean;
  watermarkText?: string | null;
  status: "pending_review" | "reviewed" | "changes_requested" | "approved";
  createdBy: number;
  createdAt: string;
  updatedAt: string;
  latestVersion?: CanvasVersionRecord;
  versions?: CanvasVersionRecord[];
  remarks?: CanvasRemarkRecord[];
  history?: CanvasStatusHistoryRecord[];
  diagramImages?: DiagramImageRecord[];
};

export async function listProjectCanvases(projectId: number): Promise<CanvasRecord[]> {
  const [canvasRows] = await query<RowDataPacket[]>(
    `
      SELECT 
        id, project_id, name, canvas_type, diagram_template_id,
        watermark_enabled, watermark_text, status, created_by,
        created_at, updated_at
      FROM canvases
      WHERE project_id = ?
      ORDER BY id ASC
    `,
    [projectId],
  );

  if (canvasRows.length === 0) return [];

  const canvasIds = canvasRows.map((r) => Number(r.id));
  const placeholders = canvasIds.map(() => "?").join(",");

  const [
    [versionRows],
    [remarkRows],
    [diagRows],
    [historyRows]
  ] = await Promise.all([
    query<RowDataPacket[]>(
      `SELECT id, canvas_id, version_number, original_image_url, watermarked_image_url, thumbnail_url, metadata, uploaded_by, created_at
       FROM canvas_versions WHERE canvas_id IN (${placeholders}) ORDER BY version_number DESC`,
      canvasIds
    ),
    query<RowDataPacket[]>(
      `SELECT id, canvas_id, version_id, image_id, user_id, user_name, remark, status_action, created_at
       FROM canvas_remarks WHERE canvas_id IN (${placeholders}) ORDER BY id DESC`,
      canvasIds
    ),
    query<RowDataPacket[]>(
      `SELECT id, canvas_id, version_id, original_image_url, watermarked_image_url, thumbnail_url, caption, status, sort_order, created_at
       FROM diagram_images WHERE canvas_id IN (${placeholders}) ORDER BY sort_order ASC, id ASC`,
      canvasIds
    ),
    query<RowDataPacket[]>(
      `SELECT id, canvas_id, actor_user_id, actor_name, old_status, new_status, note, created_at
       FROM canvas_status_history WHERE canvas_id IN (${placeholders}) ORDER BY id ASC`,
      canvasIds
    )
  ]);

  // Group versions by canvas_id
  const versionsByCanvas: Record<number, CanvasVersionRecord[]> = {};
  for (const v of versionRows) {
    const cid = Number(v.canvas_id);
    if (!versionsByCanvas[cid]) versionsByCanvas[cid] = [];
    versionsByCanvas[cid].push({
      id: Number(v.id),
      canvasId: cid,
      versionNumber: Number(v.version_number),
      originalImageUrl: String(v.original_image_url),
      watermarkedImageUrl: String(v.watermarked_image_url),
      thumbnailUrl: String(v.thumbnail_url),
      metadata: v.metadata ? JSON.parse(String(v.metadata)) : null,
      uploadedBy: Number(v.uploaded_by),
      createdAt: new Date(v.created_at).toISOString(),
    });
  }

  // Group remarks by canvas_id
  const remarksByCanvas: Record<number, CanvasRemarkRecord[]> = {};
  for (const r of remarkRows) {
    const cid = Number(r.canvas_id);
    if (!remarksByCanvas[cid]) remarksByCanvas[cid] = [];
    remarksByCanvas[cid].push({
      id: Number(r.id),
      canvasId: cid,
      versionId: Number(r.version_id),
      imageId: r.image_id ? Number(r.image_id) : null,
      userId: r.user_id ? Number(r.user_id) : null,
      userName: r.user_name ? String(r.user_name) : "Client",
      remark: String(r.remark),
      statusAction: r.status_action as CanvasRemarkRecord["statusAction"],
      createdAt: new Date(r.created_at).toISOString(),
    });
  }

  // Group history by canvas_id
  const historyByCanvas: Record<number, CanvasStatusHistoryRecord[]> = {};
  for (const h of historyRows) {
    const cid = Number(h.canvas_id);
    if (!historyByCanvas[cid]) historyByCanvas[cid] = [];
    historyByCanvas[cid].push({
      id: Number(h.id),
      canvasId: cid,
      actorUserId: h.actor_user_id ? Number(h.actor_user_id) : null,
      actorName: h.actor_name ? String(h.actor_name) : "System",
      oldStatus: h.old_status ? String(h.old_status) : null,
      newStatus: String(h.new_status),
      note: h.note ? String(h.note) : null,
      createdAt: new Date(h.created_at).toISOString(),
    });
  }

  // Group diagram images by canvas_id + version_id
  const diagramImagesByCanvasVersion: Record<string, DiagramImageRecord[]> = {};
  for (const di of diagRows) {
    const key = `${di.canvas_id}_${di.version_id}`;
    if (!diagramImagesByCanvasVersion[key]) diagramImagesByCanvasVersion[key] = [];
    const imgId = Number(di.id);
    const cid = Number(di.canvas_id);
    const canvasRemarks = remarksByCanvas[cid] || [];
    const imgRemarks = canvasRemarks.filter((r) => r.imageId === imgId);

    diagramImagesByCanvasVersion[key].push({
      id: imgId,
      canvasId: cid,
      versionId: Number(di.version_id),
      originalImageUrl: String(di.original_image_url),
      watermarkedImageUrl: String(di.watermarked_image_url),
      thumbnailUrl: String(di.thumbnail_url),
      caption: di.caption ? String(di.caption) : null,
      status: (di.status as DiagramImageRecord["status"]) || "pending_review",
      sortOrder: Number(di.sort_order),
      createdAt: new Date(di.created_at).toISOString(),
      remarks: imgRemarks,
    });
  }

  return canvasRows.map((row) => {
    const canvasId = Number(row.id);
    const versions = versionsByCanvas[canvasId] || [];
    const remarks = remarksByCanvas[canvasId] || [];
    const history = historyByCanvas[canvasId] || [];
    const latestVersion = versions[0];

    const diagramImages = latestVersion
      ? diagramImagesByCanvasVersion[`${canvasId}_${latestVersion.id}`] || []
      : [];

    return {
      id: canvasId,
      projectId: Number(row.project_id),
      name: String(row.name),
      canvasType: row.canvas_type as CanvasRecord["canvasType"],
      diagramTemplateId: row.diagram_template_id ? Number(row.diagram_template_id) : null,
      watermarkEnabled: Boolean(row.watermark_enabled),
      watermarkText: row.watermark_text ? String(row.watermark_text) : null,
      status: row.status as CanvasRecord["status"],
      createdBy: Number(row.created_by),
      createdAt: new Date(row.created_at).toISOString(),
      updatedAt: new Date(row.updated_at).toISOString(),
      latestVersion,
      versions,
      remarks,
      history,
      diagramImages,
    };
  });
}

export async function getCanvasById(canvasId: number): Promise<CanvasRecord | null> {
  const [rows] = await query<RowDataPacket[]>(
    `SELECT project_id FROM canvases WHERE id = ?`,
    [canvasId],
  );
  if (!rows || rows.length === 0) return null;
  const projectId = Number(rows[0].project_id);
  const canvases = await listProjectCanvases(projectId);
  return canvases.find((c) => c.id === canvasId) || null;
}

export async function createCanvasWithInitialVersion(data: {
  projectId: number;
  name: string;
  canvasType: "individual" | "collage" | "diagram";
  diagramTemplateId?: number;
  watermarkEnabled: boolean;
  watermarkText?: string;
  createdBy: number;
  originalImageUrl: string;
  watermarkedImageUrl: string;
  thumbnailUrl: string;
  diagramImages?: Array<{
    originalUrl: string;
    watermarkedUrl: string;
    thumbnailUrl: string;
    caption?: string;
  }>;
  metadata?: Record<string, unknown>;
}): Promise<CanvasRecord> {
  let createdCanvasId = 0;

  await withTransaction(async (connection) => {
    // 1. Create canvas entry
    const [canvasResult] = await connection.execute<ResultSetHeader>(
      `
        INSERT INTO canvases (
          project_id, name, canvas_type, diagram_template_id,
          watermark_enabled, watermark_text, status, created_by
        ) VALUES (?, ?, ?, ?, ?, ?, 'pending_review', ?)
      `,
      [
        data.projectId,
        data.name.trim(),
        data.canvasType,
        data.diagramTemplateId ?? null,
        data.watermarkEnabled ? 1 : 0,
        data.watermarkText?.trim() || null,
        data.createdBy,
      ],
    );

    createdCanvasId = Number(canvasResult.insertId);

    // 2. Add initial version 1
    const [versionResult] = await connection.execute<ResultSetHeader>(
      `
        INSERT INTO canvas_versions (
          canvas_id, version_number, original_image_url,
          watermarked_image_url, thumbnail_url, metadata, uploaded_by
        ) VALUES (?, 1, ?, ?, ?, ?, ?)
      `,
      [
        createdCanvasId,
        data.originalImageUrl,
        data.watermarkedImageUrl,
        data.thumbnailUrl,
        data.metadata ? JSON.stringify(data.metadata) : null,
        data.createdBy,
      ],
    );

    const versionId = Number(versionResult.insertId);

    // Store diagram images in diagram_images table if present
    if (data.diagramImages && data.diagramImages.length > 0) {
      for (let i = 0; i < data.diagramImages.length; i++) {
        const img = data.diagramImages[i];
        await connection.execute<ResultSetHeader>(
          `
            INSERT INTO diagram_images (
              canvas_id, version_id, original_image_url, watermarked_image_url, thumbnail_url, caption, sort_order
            ) VALUES (?, ?, ?, ?, ?, ?, ?)
          `,
          [
            createdCanvasId,
            versionId,
            img.originalUrl,
            img.watermarkedUrl,
            img.thumbnailUrl,
            img.caption || null,
            i,
          ],
        );
      }
    }

    // 3. Log initial status history entry
    await connection.execute<ResultSetHeader>(
      `
        INSERT INTO canvas_status_history (
          canvas_id, actor_user_id, actor_name, old_status, new_status, note
        ) VALUES (?, ?, 'Designer', NULL, 'pending_review', 'Initial canvas uploaded')
      `,
      [createdCanvasId, data.createdBy],
    );

    // 4. Update project status to in_review
    await connection.execute<ResultSetHeader>(
      `UPDATE projects SET status = 'in_review' WHERE id = ?`,
      [data.projectId],
    );
  });

  const created = await getCanvasById(createdCanvasId);
  if (!created) throw new Error("Failed to load created canvas.");
  return created;
}

export async function addCanvasRevision(data: {
  canvasId: number;
  uploadedBy: number;
  originalImageUrl: string;
  watermarkedImageUrl: string;
  thumbnailUrl: string;
  metadata?: Record<string, unknown>;
  newStatus?: CanvasRecord["status"];
}): Promise<CanvasRecord> {
  return withTransaction(async (connection) => {
    // Determine latest version number
    const [verRows] = await connection.execute<RowDataPacket[]>(
      `SELECT MAX(version_number) AS max_ver FROM canvas_versions WHERE canvas_id = ?`,
      [data.canvasId],
    );
    const nextVer = Number(verRows[0]?.max_ver || 0) + 1;

    // Insert new revision version
    await connection.execute<ResultSetHeader>(
      `
        INSERT INTO canvas_versions (
          canvas_id, version_number, original_image_url,
          watermarked_image_url, thumbnail_url, metadata, uploaded_by
        ) VALUES (?, ?, ?, ?, ?, ?, ?)
      `,
      [
        data.canvasId,
        nextVer,
        data.originalImageUrl,
        data.watermarkedImageUrl,
        data.thumbnailUrl,
        data.metadata ? JSON.stringify(data.metadata) : null,
        data.uploadedBy,
      ],
    );

    const targetStatus = data.newStatus || "pending_review";

    // Get current status
    const [canvasRows] = await connection.execute<RowDataPacket[]>(
      `SELECT project_id, status FROM canvases WHERE id = ?`,
      [data.canvasId],
    );
    const oldStatus = String(canvasRows[0]?.status || "pending_review");
    const projectId = Number(canvasRows[0]?.project_id);

    // Update status
    await connection.execute<ResultSetHeader>(
      `UPDATE canvases SET status = ? WHERE id = ?`,
      [targetStatus, data.canvasId],
    );

    // Log history
    await connection.execute<ResultSetHeader>(
      `
        INSERT INTO canvas_status_history (
          canvas_id, actor_user_id, actor_name, old_status, new_status, note
        ) VALUES (?, ?, 'Designer', ?, ?, ?)
      `,
      [data.canvasId, data.uploadedBy, oldStatus, targetStatus, `Uploaded Revision V${nextVer}`],
    );

    const canvases = await listProjectCanvases(projectId);
    const updated = canvases.find((c) => c.id === data.canvasId);
    if (!updated) throw new Error("Canvas not found.");
    return updated;
  });
}

export async function addCanvasRemarkAndStatus(data: {
  canvasId: number;
  versionId: number;
  imageId?: number;
  userId?: number;
  userName?: string;
  remark: string;
  statusAction: "approved" | "changes_requested" | "comment";
}): Promise<CanvasRecord> {
  return withTransaction(async (connection) => {
    // 1. Insert remark with image_id
    await connection.execute<ResultSetHeader>(
      `
        INSERT INTO canvas_remarks (
          canvas_id, version_id, image_id, user_id, user_name, remark, status_action
        ) VALUES (?, ?, ?, ?, ?, ?, ?)
      `,
      [
        data.canvasId,
        data.versionId,
        data.imageId ?? null,
        data.userId ?? null,
        data.userName?.trim() || "Client",
        data.remark.trim(),
        data.statusAction,
      ],
    );

    // 2. If imageId is provided, update individual image status
    if (data.imageId && (data.statusAction === "approved" || data.statusAction === "changes_requested")) {
      const imgStatus = data.statusAction === "approved" ? "approved" : "changes_requested";
      await connection.execute(
        `UPDATE diagram_images SET status = ? WHERE id = ? AND canvas_id = ?`,
        [imgStatus, data.imageId, data.canvasId],
      );
    }

    // 3. Determine new overall canvas status
    const [cRows] = await connection.execute<RowDataPacket[]>(
      `SELECT project_id, status FROM canvases WHERE id = ?`,
      [data.canvasId],
    );
    const oldStatus = String(cRows[0]?.status || "pending_review");
    const projectId = Number(cRows[0]?.project_id);

    let newStatus = oldStatus;

    // Check if there are diagram/collage sub-images for this canvas version
    const [subRows] = await connection.execute<RowDataPacket[]>(
      `SELECT status FROM diagram_images WHERE canvas_id = ? AND version_id = ?`,
      [data.canvasId, data.versionId],
    );

    if (subRows.length > 0) {
      const statuses = subRows.map((r) => String(r.status));
      if (statuses.every((s) => s === "approved")) {
        newStatus = "approved";
      } else if (statuses.some((s) => s === "changes_requested")) {
        newStatus = "changes_requested";
      } else {
        newStatus = "pending_review";
      }
    } else {
      if (data.statusAction === "approved") {
        newStatus = "approved";
      } else if (data.statusAction === "changes_requested") {
        newStatus = "changes_requested";
      }
    }

    if (newStatus !== oldStatus) {
      await connection.execute<ResultSetHeader>(
        `UPDATE canvases SET status = ? WHERE id = ?`,
        [newStatus, data.canvasId],
      );

      await connection.execute<ResultSetHeader>(
        `
          INSERT INTO canvas_status_history (
            canvas_id, actor_user_id, actor_name, old_status, new_status, note
          ) VALUES (?, ?, ?, ?, ?, ?)
        `,
        [
          data.canvasId,
          data.userId ?? null,
          data.userName || "Client",
          oldStatus,
          newStatus,
          data.remark,
        ],
      );
    }

    // 4. Update parent project overall status
    const [allC] = await connection.execute<RowDataPacket[]>(
      `SELECT status FROM canvases WHERE project_id = ?`,
      [projectId],
    );
    const projStatuses = allC.map((r) => String(r.status));
    let overallProjectStatus: "pending" | "in_review" | "changes_requested" | "approved" = "in_review";
    if (projStatuses.length > 0 && projStatuses.every((s) => s === "approved")) {
      overallProjectStatus = "approved";
    } else if (projStatuses.some((s) => s === "changes_requested")) {
      overallProjectStatus = "changes_requested";
    }

    await connection.execute<ResultSetHeader>(
      `UPDATE projects SET status = ? WHERE id = ?`,
      [overallProjectStatus, projectId],
    );

    const list = await listProjectCanvases(projectId);
    const updated = list.find((c) => c.id === data.canvasId);
    if (!updated) throw new Error("Canvas not found.");
    return updated;
  });
}

export async function deleteCanvas(canvasId: number): Promise<void> {
  const [versionRows] = await query<RowDataPacket[]>(
    `SELECT original_image_url, watermarked_image_url, thumbnail_url FROM canvas_versions WHERE canvas_id = ?`,
    [canvasId],
  );
  const [diagRows] = await query<RowDataPacket[]>(
    `SELECT original_image_url, watermarked_image_url, thumbnail_url FROM diagram_images WHERE canvas_id = ?`,
    [canvasId],
  );

  const urlsToDelete: string[] = [];
  for (const v of versionRows) {
    if (v.original_image_url) urlsToDelete.push(String(v.original_image_url));
    if (v.watermarked_image_url) urlsToDelete.push(String(v.watermarked_image_url));
    if (v.thumbnail_url) urlsToDelete.push(String(v.thumbnail_url));
  }
  for (const d of diagRows) {
    if (d.original_image_url) urlsToDelete.push(String(d.original_image_url));
    if (d.watermarked_image_url) urlsToDelete.push(String(d.watermarked_image_url));
    if (d.thumbnail_url) urlsToDelete.push(String(d.thumbnail_url));
  }

  await deleteUploadFilesByUrls(urlsToDelete);
  await execute(`DELETE FROM canvases WHERE id = ?`, [canvasId]);
}

export async function updateCanvasInfo(
  canvasId: number,
  data: { name?: string; watermarkEnabled?: boolean; watermarkText?: string },
): Promise<void> {
  const updates: string[] = [];
  const params: any[] = [];

  if (data.name !== undefined) {
    updates.push("name = ?");
    params.push(data.name);
  }
  if (data.watermarkEnabled !== undefined) {
    updates.push("watermark_enabled = ?");
    params.push(data.watermarkEnabled);
  }
  if (data.watermarkText !== undefined) {
    updates.push("watermark_text = ?");
    params.push(data.watermarkText);
  }

  if (updates.length > 0) {
    params.push(canvasId);
    await execute(`UPDATE canvases SET ${updates.join(", ")}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`, params);
  }
}

export async function updateCanvasSubImage(
  imageId: number,
  data: {
    originalImageUrl?: string;
    watermarkedImageUrl?: string;
    thumbnailUrl?: string;
    caption?: string;
  },
): Promise<void> {
  return withTransaction(async (connection) => {
    // 1. Get current image row info
    const [imgRows] = await connection.execute<RowDataPacket[]>(
      `SELECT canvas_id, version_id FROM diagram_images WHERE id = ?`,
      [imageId],
    );
    if (imgRows.length === 0) throw new Error("Sub-image tile not found.");
    const { canvas_id: canvasId, version_id: versionId } = imgRows[0];

    const updates: string[] = ["status = 'pending_review'"];
    const params: any[] = [];

    if (data.originalImageUrl) {
      updates.push("original_image_url = ?");
      params.push(data.originalImageUrl);
    }
    if (data.watermarkedImageUrl) {
      updates.push("watermarked_image_url = ?");
      params.push(data.watermarkedImageUrl);
    }
    if (data.thumbnailUrl) {
      updates.push("thumbnail_url = ?");
      params.push(data.thumbnailUrl);
    }
    if (data.caption !== undefined) {
      updates.push("caption = ?");
      params.push(data.caption);
    }

    params.push(imageId);
    await connection.execute(`UPDATE diagram_images SET ${updates.join(", ")} WHERE id = ?`, params);

    // 2. Reset overall canvas status if needed
    const [subRows] = await connection.execute<RowDataPacket[]>(
      `SELECT status FROM diagram_images WHERE canvas_id = ? AND version_id = ?`,
      [canvasId, versionId],
    );
    const statuses = subRows.map((r) => String(r.status));
    let newStatus = "pending_review";
    if (statuses.every((s) => s === "approved")) {
      newStatus = "approved";
    } else if (statuses.some((s) => s === "changes_requested")) {
      newStatus = "changes_requested";
    }

    await connection.execute(`UPDATE canvases SET status = ? WHERE id = ?`, [newStatus, canvasId]);
  });
}

export async function addCanvasSubImage(
  canvasId: number,
  versionId: number,
  data: {
    originalImageUrl: string;
    watermarkedImageUrl: string;
    thumbnailUrl: string;
    caption?: string;
  },
): Promise<number> {
  return withTransaction(async (connection) => {
    // 1. Check existing count of sub-images
    const [existingRows] = await connection.execute<RowDataPacket[]>(
      `SELECT COUNT(*) as count FROM diagram_images WHERE canvas_id = ? AND version_id = ?`,
      [canvasId, versionId],
    );
    const existingCount = Number(existingRows[0]?.count || 0);

    // If 0 existing sub-images, preserve the main version's initial image as Tile #1
    if (existingCount === 0) {
      const [verRows] = await connection.execute<RowDataPacket[]>(
        `SELECT original_image_url, watermarked_image_url, thumbnail_url FROM canvas_versions WHERE id = ?`,
        [versionId],
      );
      if (verRows.length > 0 && verRows[0].original_image_url) {
        await connection.execute(
          `
            INSERT INTO diagram_images (
              canvas_id, version_id, original_image_url, watermarked_image_url, thumbnail_url, caption, status, sort_order
            ) VALUES (?, ?, ?, ?, ?, 'Photo 1', 'pending_review', 0)
          `,
          [
            canvasId,
            versionId,
            verRows[0].original_image_url,
            verRows[0].watermarked_image_url || verRows[0].original_image_url,
            verRows[0].thumbnail_url || verRows[0].original_image_url,
          ],
        );
      }
    }

    const [sortRows] = await connection.execute<RowDataPacket[]>(
      `SELECT COALESCE(MAX(sort_order), 0) as max_sort FROM diagram_images WHERE canvas_id = ? AND version_id = ?`,
      [canvasId, versionId],
    );
    const nextSort = Number(sortRows[0]?.max_sort || 0) + 1;

    const [res] = await connection.execute<ResultSetHeader>(
      `
        INSERT INTO diagram_images (
          canvas_id, version_id, original_image_url, watermarked_image_url, thumbnail_url, caption, status, sort_order
        ) VALUES (?, ?, ?, ?, ?, ?, 'pending_review', ?)
      `,
      [
        canvasId,
        versionId,
        data.originalImageUrl,
        data.watermarkedImageUrl,
        data.thumbnailUrl,
        data.caption || null,
        nextSort,
      ],
    );

    await connection.execute(
      `UPDATE canvases SET status = 'pending_review', canvas_type = 'collage' WHERE id = ?`,
      [canvasId],
    );

    return res.insertId;
  });
}

export async function deleteCanvasSubImage(imageId: number): Promise<void> {
  return withTransaction(async (connection) => {
    const [imgRows] = await connection.execute<RowDataPacket[]>(
      `SELECT canvas_id, version_id FROM diagram_images WHERE id = ?`,
      [imageId],
    );
    if (imgRows.length === 0) return;
    const { canvas_id: canvasId, version_id: versionId } = imgRows[0];

    await connection.execute(`DELETE FROM diagram_images WHERE id = ?`, [imageId]);

    // Recalculate status
    const [subRows] = await connection.execute<RowDataPacket[]>(
      `SELECT status FROM diagram_images WHERE canvas_id = ? AND version_id = ?`,
      [canvasId, versionId],
    );
    let newStatus = "pending_review";
    if (subRows.length > 0) {
      const statuses = subRows.map((r) => String(r.status));
      if (statuses.every((s) => s === "approved")) {
        newStatus = "approved";
      } else if (statuses.some((s) => s === "changes_requested")) {
        newStatus = "changes_requested";
      }
    }
    await connection.execute(`UPDATE canvases SET status = ? WHERE id = ?`, [newStatus, canvasId]);
  });
}

export async function unbundleCollageCanvas(canvasId: number): Promise<CanvasRecord[]> {
  return withTransaction(async (connection) => {
    // 1. Get canvas record
    const [cRows] = await connection.execute<RowDataPacket[]>(
      `SELECT project_id, name, watermark_enabled, watermark_text, created_by FROM canvases WHERE id = ?`,
      [canvasId],
    );
    if (cRows.length === 0) throw new Error("Canvas not found.");
    const canvas = cRows[0];

    // 2. Get latest version
    const [vRows] = await connection.execute<RowDataPacket[]>(
      `SELECT id FROM canvas_versions WHERE canvas_id = ? ORDER BY version_number DESC LIMIT 1`,
      [canvasId],
    );
    if (vRows.length === 0) throw new Error("Canvas version not found.");
    const versionId = Number(vRows[0].id);

    // 3. Get sub-images belonging to this collage
    const [subRows] = await connection.execute<RowDataPacket[]>(
      `SELECT id, original_image_url, watermarked_image_url, thumbnail_url, caption, status FROM diagram_images WHERE canvas_id = ? AND version_id = ? ORDER BY sort_order ASC, id ASC`,
      [canvasId, versionId],
    );

    if (subRows.length === 0) {
      throw new Error("No individual images found in this collage to unbundle.");
    }

    const createdIds: number[] = [];

    // 4. For each sub-image tile, create a new individual canvas
    for (let i = 0; i < subRows.length; i++) {
      const tile = subRows[i];
      const name = tile.caption || `${canvas.name} - Photo ${i + 1}`;

      const [cRes] = await connection.execute<ResultSetHeader>(
        `
          INSERT INTO canvases (
            project_id, name, canvas_type, diagram_template_id, watermark_enabled, watermark_text, status, created_by
          ) VALUES (?, ?, 'individual', NULL, ?, ?, ?, ?)
        `,
        [
          canvas.project_id,
          name,
          canvas.watermark_enabled,
          canvas.watermark_text,
          tile.status || "pending_review",
          canvas.created_by,
        ],
      );
      const newCanvasId = cRes.insertId;
      createdIds.push(newCanvasId);

      // Create version 1 for this new individual canvas
      await connection.execute(
        `
          INSERT INTO canvas_versions (
            canvas_id, version_number, original_image_url, watermarked_image_url, thumbnail_url, created_by
          ) VALUES (?, 1, ?, ?, ?, ?)
        `,
        [
          newCanvasId,
          tile.original_image_url,
          tile.watermarked_image_url,
          tile.thumbnail_url,
          canvas.created_by,
        ],
      );

      // Move tile's client remarks over to new canvas
      await connection.execute(
        `UPDATE canvas_remarks SET canvas_id = ?, image_id = NULL WHERE image_id = ?`,
        [newCanvasId, tile.id],
      );
    }

    // 5. Delete original collage canvas
    await connection.execute(`DELETE FROM canvases WHERE id = ?`, [canvasId]);

    // 6. Return updated project canvases list
    return listProjectCanvases(Number(canvas.project_id));
  });
}
