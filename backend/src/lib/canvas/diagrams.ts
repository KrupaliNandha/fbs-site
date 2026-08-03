import { query, execute } from "../db.js";
import type { RowDataPacket, ResultSetHeader } from "mysql2/promise";

export type DiagramTemplateRecord = {
  id: number;
  name: string;
  description?: string | null;
  previewUrl?: string | null;
  templateStructure?: Record<string, unknown> | null;
  createdAt: string;
  updatedAt: string;
};

export async function seedDefaultDiagramTemplatesIfEmpty(): Promise<void> {
  const [rows] = await query<RowDataPacket[]>("SELECT COUNT(*) AS total FROM diagram_templates");
  if (Number(rows[0]?.total || 0) > 0) {
    return;
  }

  const defaults = [
    {
      name: "Diagram A - Standard Grid Layout",
      description: "4-panel symmetrical technical blueprint layout",
      previewUrl: "/uploads/defaults/diagram_a.svg",
    },
    {
      name: "Diagram B - Hero & Detail Showcase",
      description: "1 primary hero focus image with 3 side detail specification panels",
      previewUrl: "/uploads/defaults/diagram_b.svg",
    },
    {
      name: "Diagram C - Architectural Elevation",
      description: "Horizontal front elevation and side cross-section diagram layout",
      previewUrl: "/uploads/defaults/diagram_c.svg",
    },
    {
      name: "Diagram D - Modular Blueprint Breakdown",
      description: "Multi-layered component breakdown with measurement callouts",
      previewUrl: "/uploads/defaults/diagram_d.svg",
    },
  ];

  for (const d of defaults) {
    await execute<ResultSetHeader>(
      `
        INSERT INTO diagram_templates (name, description, preview_url)
        VALUES (?, ?, ?)
      `,
      [d.name, d.description, d.previewUrl],
    );
  }
}

export async function listDiagramTemplates(): Promise<DiagramTemplateRecord[]> {
  const [rows] = await query<RowDataPacket[]>(
    `
      SELECT id, name, description, preview_url, template_structure, created_at, updated_at
      FROM diagram_templates
      ORDER BY id ASC
    `,
  );

  return rows.map((row) => ({
    id: Number(row.id),
    name: String(row.name),
    description: row.description ? String(row.description) : null,
    previewUrl: row.preview_url ? String(row.preview_url) : null,
    templateStructure: row.template_structure ? JSON.parse(String(row.template_structure)) : null,
    createdAt: new Date(row.created_at).toISOString(),
    updatedAt: new Date(row.updated_at).toISOString(),
  }));
}

export async function createDiagramTemplate(data: {
  name: string;
  description?: string;
  previewUrl?: string;
  templateStructure?: Record<string, unknown>;
}): Promise<DiagramTemplateRecord> {
  const [result] = await execute<ResultSetHeader>(
    `
      INSERT INTO diagram_templates (name, description, preview_url, template_structure)
      VALUES (?, ?, ?, ?)
    `,
    [
      data.name.trim(),
      data.description?.trim() || null,
      data.previewUrl?.trim() || null,
      data.templateStructure ? JSON.stringify(data.templateStructure) : null,
    ],
  );

  const [rows] = await query<RowDataPacket[]>(
    `SELECT id, name, description, preview_url, template_structure, created_at, updated_at FROM diagram_templates WHERE id = ?`,
    [result.insertId],
  );

  const row = rows[0];
  return {
    id: Number(row.id),
    name: String(row.name),
    description: row.description ? String(row.description) : null,
    previewUrl: row.preview_url ? String(row.preview_url) : null,
    templateStructure: row.template_structure ? JSON.parse(String(row.template_structure)) : null,
    createdAt: new Date(row.created_at).toISOString(),
    updatedAt: new Date(row.updated_at).toISOString(),
  };
}

export async function updateDiagramTemplate(
  id: number,
  data: {
    name?: string;
    description?: string | null;
    previewUrl?: string | null;
  },
): Promise<DiagramTemplateRecord> {
  const updates: string[] = [];
  const params: any[] = [];

  if (data.name !== undefined) {
    updates.push("name = ?");
    params.push(data.name.trim());
  }
  if (data.description !== undefined) {
    updates.push("description = ?");
    params.push(data.description ? data.description.trim() : null);
  }
  if (data.previewUrl !== undefined) {
    updates.push("preview_url = ?");
    params.push(data.previewUrl ? data.previewUrl.trim() : null);
  }

  if (updates.length > 0) {
    params.push(id);
    await execute(`UPDATE diagram_templates SET ${updates.join(", ")}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`, params);
  }

  const [rows] = await query<RowDataPacket[]>(
    `SELECT id, name, description, preview_url, template_structure, created_at, updated_at FROM diagram_templates WHERE id = ?`,
    [id],
  );

  if (rows.length === 0) throw new Error("Diagram template not found.");

  const row = rows[0];
  return {
    id: Number(row.id),
    name: String(row.name),
    description: row.description ? String(row.description) : null,
    previewUrl: row.preview_url ? String(row.preview_url) : null,
    templateStructure: row.template_structure ? JSON.parse(String(row.template_structure)) : null,
    createdAt: new Date(row.created_at).toISOString(),
    updatedAt: new Date(row.updated_at).toISOString(),
  };
}

export async function deleteDiagramTemplate(id: number): Promise<void> {
  await execute(`DELETE FROM diagram_templates WHERE id = ?`, [id]);
}

export async function getDiagramTemplateById(id: number): Promise<DiagramTemplateRecord | null> {
  const [rows] = await query<RowDataPacket[]>(
    `SELECT id, name, description, preview_url, template_structure, created_at, updated_at FROM diagram_templates WHERE id = ?`,
    [id],
  );
  if (rows.length === 0) return null;
  const row = rows[0];
  return {
    id: Number(row.id),
    name: String(row.name),
    description: row.description ? String(row.description) : null,
    previewUrl: row.preview_url ? String(row.preview_url) : null,
    templateStructure: row.template_structure ? JSON.parse(String(row.template_structure)) : null,
    createdAt: new Date(row.created_at).toISOString(),
    updatedAt: new Date(row.updated_at).toISOString(),
  };
}
