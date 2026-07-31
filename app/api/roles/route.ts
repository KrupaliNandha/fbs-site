import { NextResponse } from "next/server";
import { getErrorResponse } from "@/app/lib/auth/errors";
import { requirePermission } from "@/app/lib/auth/session";
import { listPermissions, listRoles } from "@/app/lib/auth/users";

export const runtime = "nodejs";

export async function GET() {
  try {
    await requirePermission("roles:read");
    return NextResponse.json({ roles: listRoles(), permissions: listPermissions() });
  } catch (error) {
    const { message, status } = getErrorResponse(error);
    return NextResponse.json({ message }, { status });
  }
}
