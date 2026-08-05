import { query, execute } from "../db.js";
import { generateSecureShareToken } from "./tokens.js";
import type { RowDataPacket, ResultSetHeader } from "mysql2/promise";

export type ProjectRecord = {
  id: number;
  clientId: number;
  clientName: string;
  clientEmail: string;
  designerId: number;
  designerName?: string;
  name: string;
  description?: string | null;
  status: "pending" | "in_review" | "changes_requested" | "approved";
  shareToken?: string;
  /** Latest canvas thumbnail for list/card previews */
  previewThumbnailUrl?: string | null;
  createdAt: string;
  updatedAt: string;
};

export async function listProjects(params: {
  designerId?: number;
  clientId?: number;
  search?: string;
  status?: string;
}): Promise<ProjectRecord[]> {
  const whereConditions: string[] = [];
  const queryParams: (string | number)[] = [];

  if (params.designerId) {
    whereConditions.push("projects.designer_id = ?");
    queryParams.push(params.designerId);
  }

  if (params.clientId) {
    whereConditions.push("projects.client_id = ?");
    queryParams.push(params.clientId);
  }

  if (params.status) {
    whereConditions.push("projects.status = ?");
    queryParams.push(params.status);
  }

  if (params.search?.trim()) {
    const searchPattern = `%${params.search.trim()}%`;
    whereConditions.push("(projects.name LIKE ? OR clients.name LIKE ?)");
    queryParams.push(searchPattern, searchPattern);
  }

  const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(" AND ")}` : "";

  const [rows] = await query<RowDataPacket[]>(
    `
      SELECT 
        projects.id,
        projects.client_id,
        clients.name AS client_name,
        clients.email AS client_email,
        projects.designer_id,
        users.name AS designer_name,
        projects.name,
        projects.description,
        projects.status,
        project_shares.share_token,
        projects.created_at,
        projects.updated_at,
        (
          SELECT cv.thumbnail_url
          FROM canvases c
          INNER JOIN canvas_versions cv ON cv.canvas_id = c.id
          WHERE c.project_id = projects.id
          ORDER BY c.id DESC, cv.version_number DESC
          LIMIT 1
        ) AS preview_thumbnail_url
      FROM projects
      JOIN clients ON clients.id = projects.client_id
      JOIN users ON users.id = projects.designer_id
      LEFT JOIN project_shares ON project_shares.project_id = projects.id
      ${whereClause}
      ORDER BY projects.id DESC
    `,
    queryParams,
  );

  return rows.map((row) => ({
    id: Number(row.id),
    clientId: Number(row.client_id),
    clientName: String(row.client_name),
    clientEmail: String(row.client_email),
    designerId: Number(row.designer_id),
    designerName: String(row.designer_name || "Designer"),
    name: String(row.name),
    description: row.description ? String(row.description) : null,
    status: row.status as ProjectRecord["status"],
    shareToken: row.share_token ? String(row.share_token) : undefined,
    previewThumbnailUrl: row.preview_thumbnail_url
      ? String(row.preview_thumbnail_url)
      : null,
    createdAt: new Date(row.created_at).toISOString(),
    updatedAt: new Date(row.updated_at).toISOString(),
  }));
}

export async function getProjectById(id: number): Promise<ProjectRecord | null> {
  const [rows] = await query<RowDataPacket[]>(
    `
      SELECT 
        projects.id,
        projects.client_id,
        clients.name AS client_name,
        clients.email AS client_email,
        projects.designer_id,
        users.name AS designer_name,
        projects.name,
        projects.description,
        projects.status,
        project_shares.share_token,
        projects.created_at,
        projects.updated_at
      FROM projects
      JOIN clients ON clients.id = projects.client_id
      JOIN users ON users.id = projects.designer_id
      LEFT JOIN project_shares ON project_shares.project_id = projects.id
      WHERE projects.id = ?
    `,
    [id],
  );

  if (!rows[0]) return null;

  return {
    id: Number(rows[0].id),
    clientId: Number(rows[0].client_id),
    clientName: String(rows[0].client_name),
    clientEmail: String(rows[0].client_email),
    designerId: Number(rows[0].designer_id),
    designerName: String(rows[0].designer_name || "Designer"),
    name: String(rows[0].name),
    description: rows[0].description ? String(rows[0].description) : null,
    status: rows[0].status as ProjectRecord["status"],
    shareToken: rows[0].share_token ? String(rows[0].share_token) : undefined,
    createdAt: new Date(rows[0].created_at).toISOString(),
    updatedAt: new Date(rows[0].updated_at).toISOString(),
  };
}

export async function createProject(data: {
  clientId: number;
  designerId: number;
  name: string;
  description?: string;
}): Promise<ProjectRecord> {
  const [result] = await execute<ResultSetHeader>(
    `
      INSERT INTO projects (client_id, designer_id, name, description, status)
      VALUES (?, ?, ?, ?, 'pending')
    `,
    [data.clientId, data.designerId, data.name.trim(), data.description?.trim() || null],
  );

  const projectId = Number(result.insertId);

  // Generate initial secure share token
  const shareToken = generateSecureShareToken();
  await execute<ResultSetHeader>(
    `
      INSERT INTO project_shares (project_id, share_token, created_by)
      VALUES (?, ?, ?)
    `,
    [projectId, shareToken, data.designerId],
  );

  const project = await getProjectById(projectId);
  if (!project) throw new Error("Failed to retrieve created project.");
  return project;
}

export async function updateProject(
  id: number,
  data: {
    name?: string;
    description?: string;
    status?: ProjectRecord["status"];
  },
): Promise<ProjectRecord> {
  const updates: string[] = [];
  const params: (string | number | null)[] = [];

  if (data.name !== undefined) {
    updates.push("name = ?");
    params.push(data.name.trim());
  }
  if (data.description !== undefined) {
    updates.push("description = ?");
    params.push(data.description.trim() || null);
  }
  if (data.status !== undefined) {
    updates.push("status = ?");
    params.push(data.status);
  }

  if (updates.length > 0) {
    params.push(id);
    await execute(`UPDATE projects SET ${updates.join(", ")} WHERE id = ?`, params);
  }

  const updated = await getProjectById(id);
  if (!updated) throw new Error("Project not found.");
  return updated;
}

import { deleteUploadFilesByUrls } from "./watermark.js";

export async function deleteProject(id: number): Promise<void> {
  const [canvases] = await query<RowDataPacket[]>(`SELECT id FROM canvases WHERE project_id = ?`, [id]);
  const canvasIds = canvases.map((c) => Number(c.id));

  if (canvasIds.length > 0) {
    const placeholders = canvasIds.map(() => "?").join(",");
    const [versionRows] = await query<RowDataPacket[]>(
      `SELECT original_image_url, watermarked_image_url, thumbnail_url FROM canvas_versions WHERE canvas_id IN (${placeholders})`,
      canvasIds,
    );
    const [diagRows] = await query<RowDataPacket[]>(
      `SELECT original_image_url, watermarked_image_url, thumbnail_url FROM diagram_images WHERE canvas_id IN (${placeholders})`,
      canvasIds,
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
  }

  await execute(`DELETE FROM projects WHERE id = ?`, [id]);
}

export async function getOrCreateShareToken(projectId: number, userId: number): Promise<string> {
  const [rows] = await query<RowDataPacket[]>(
    `SELECT share_token FROM project_shares WHERE project_id = ? LIMIT 1`,
    [projectId],
  );

  if (rows[0]?.share_token) {
    return String(rows[0].share_token);
  }

  const newToken = generateSecureShareToken();
  await execute<ResultSetHeader>(
    `
      INSERT INTO project_shares (project_id, share_token, created_by)
      VALUES (?, ?, ?)
    `,
    [projectId, newToken, userId],
  );
  return newToken;
}

export async function getProjectByShareToken(token: string): Promise<ProjectRecord | null> {
  const [rows] = await query<RowDataPacket[]>(
    `
      SELECT project_id FROM project_shares WHERE share_token = ? LIMIT 1
    `,
    [token],
  );

  if (!rows[0]?.project_id) return null;
  return getProjectById(Number(rows[0].project_id));
}
