import { NextRequest, NextResponse } from "next/server";
import { getErrorResponse } from "@/app/lib/auth/errors";
import { isAuthRole } from "@/app/lib/auth/roles";
import { requirePermission } from "@/app/lib/auth/session";
import { listRoles, updateRolePermissions } from "@/app/lib/auth/users";
import type { Permission } from "@/app/lib/auth/types";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{ role: string }>;
};

export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    const { role } = await context.params;

    if (!isAuthRole(role)) {
      return NextResponse.json({ message: "Unsupported role." }, { status: 400 });
    }

    const body = await request.json();
    const permissions = Array.isArray(body.permissions)
      ? (body.permissions as Permission[])
      : null;

    if (!permissions) {
      return NextResponse.json(
        { message: "Permissions must be an array." },
        { status: 400 },
      );
    }

    const actor = await requirePermission("roles:update");
    updateRolePermissions(role, permissions, actor.id);

    return NextResponse.json({ roles: listRoles() });
  } catch (error) {
    const { message, status } = getErrorResponse(error);
    return NextResponse.json({ message }, { status });
  }
}
