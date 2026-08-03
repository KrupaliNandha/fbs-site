import { query, execute } from "../db.js";
import type { RowDataPacket, ResultSetHeader } from "mysql2/promise";

export type ClientRecord = {
  id: number;
  designerId: number | null;
  name: string;
  email: string;
  phone: string;
  companyName?: string | null;
  createdAt: string;
  updatedAt: string;
};

export async function listClients(params: {
  designerId?: number;
  search?: string;
  page?: number;
  limit?: number;
}): Promise<{ clients: ClientRecord[]; total: number; page: number; totalPages: number }> {
  const page = Math.max(1, params.page || 1);
  const limit = Math.max(1, Math.min(100, params.limit || 10));
  const offset = (page - 1) * limit;

  const whereConditions: string[] = [];
  const queryParams: (string | number)[] = [];

  if (params.designerId) {
    whereConditions.push("(clients.designer_id = ? OR clients.designer_id IS NULL)");
    queryParams.push(params.designerId);
  }

  if (params.search?.trim()) {
    const searchPattern = `%${params.search.trim()}%`;
    whereConditions.push(
      "(clients.name LIKE ? OR clients.email LIKE ? OR clients.phone LIKE ? OR clients.company_name LIKE ?)",
    );
    queryParams.push(searchPattern, searchPattern, searchPattern, searchPattern);
  }

  const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(" AND ")}` : "";

  const [countRows] = await query<RowDataPacket[]>(
    `SELECT COUNT(*) AS total FROM clients ${whereClause}`,
    queryParams,
  );
  const total = Number(countRows[0]?.total ?? 0);

  const [rows] = await query<RowDataPacket[]>(
    `
      SELECT id, designer_id, name, email, phone, company_name, created_at, updated_at
      FROM clients
      ${whereClause}
      ORDER BY id DESC
      LIMIT ? OFFSET ?
    `,
    [...queryParams, limit, offset],
  );

  const clients: ClientRecord[] = rows.map((row) => ({
    id: Number(row.id),
    designerId: row.designer_id ? Number(row.designer_id) : null,
    name: String(row.name),
    email: String(row.email),
    phone: String(row.phone),
    companyName: row.company_name ? String(row.company_name) : null,
    createdAt: new Date(row.created_at).toISOString(),
    updatedAt: new Date(row.updated_at).toISOString(),
  }));

  return {
    clients,
    total,
    page,
    totalPages: Math.ceil(total / limit) || 1,
  };
}

export async function getClientById(id: number): Promise<ClientRecord | null> {
  const [rows] = await query<RowDataPacket[]>(
    `
      SELECT id, designer_id, name, email, phone, company_name, created_at, updated_at
      FROM clients
      WHERE id = ?
    `,
    [id],
  );

  if (!rows[0]) return null;

  return {
    id: Number(rows[0].id),
    designerId: rows[0].designer_id ? Number(rows[0].designer_id) : null,
    name: String(rows[0].name),
    email: String(rows[0].email),
    phone: String(rows[0].phone),
    companyName: rows[0].company_name ? String(rows[0].company_name) : null,
    createdAt: new Date(rows[0].created_at).toISOString(),
    updatedAt: new Date(rows[0].updated_at).toISOString(),
  };
}

export async function createClient(data: {
  designerId?: number;
  name: string;
  email: string;
  phone: string;
  companyName?: string;
}): Promise<ClientRecord> {
  const [result] = await execute<ResultSetHeader>(
    `
      INSERT INTO clients (designer_id, name, email, phone, company_name)
      VALUES (?, ?, ?, ?, ?)
    `,
    [
      data.designerId ?? null,
      data.name.trim(),
      data.email.trim().toLowerCase(),
      data.phone.trim(),
      data.companyName?.trim() || null,
    ],
  );

  const client = await getClientById(Number(result.insertId));
  if (!client) throw new Error("Failed to retrieve created client.");
  return client;
}

export async function updateClient(
  id: number,
  data: {
    name?: string;
    email?: string;
    phone?: string;
    companyName?: string;
  },
): Promise<ClientRecord> {
  const updates: string[] = [];
  const params: (string | number | null)[] = [];

  if (data.name !== undefined) {
    updates.push("name = ?");
    params.push(data.name.trim());
  }
  if (data.email !== undefined) {
    updates.push("email = ?");
    params.push(data.email.trim().toLowerCase());
  }
  if (data.phone !== undefined) {
    updates.push("phone = ?");
    params.push(data.phone.trim());
  }
  if (data.companyName !== undefined) {
    updates.push("company_name = ?");
    params.push(data.companyName.trim() || null);
  }

  if (updates.length > 0) {
    params.push(id);
    await execute(`UPDATE clients SET ${updates.join(", ")} WHERE id = ?`, params);
  }

  const updated = await getClientById(id);
  if (!updated) throw new Error("Client not found.");
  return updated;
}

export async function deleteClient(id: number): Promise<void> {
  await execute(`DELETE FROM clients WHERE id = ?`, [id]);
}
