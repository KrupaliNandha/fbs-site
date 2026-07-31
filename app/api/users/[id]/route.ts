import { NextRequest, NextResponse } from "next/server";
import { getErrorResponse } from "@/app/lib/auth/errors";
import { requirePermission } from "@/app/lib/auth/session";
import { deleteUser, updateUser } from "@/app/lib/auth/users";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{ id: string }>;
};

async function getUserId(context: RouteContext) {
  const { id } = await context.params;
  const userId = Number(id);

  if (!Number.isInteger(userId) || userId <= 0) {
    return null;
  }

  return userId;
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    const userId = await getUserId(context);

    if (!userId) {
      return NextResponse.json({ message: "Invalid user id." }, { status: 400 });
    }

    const actor = await requirePermission("users:update");
    const user = await updateUser(userId, await request.json(), actor.id);

    return NextResponse.json({ user });
  } catch (error) {
    const { message, status } = getErrorResponse(error);
    return NextResponse.json({ message }, { status });
  }
}

export async function DELETE(_request: NextRequest, context: RouteContext) {
  try {
    const userId = await getUserId(context);

    if (!userId) {
      return NextResponse.json({ message: "Invalid user id." }, { status: 400 });
    }

    const actor = await requirePermission("users:delete");
    deleteUser(userId, actor.id);

    return NextResponse.json({ ok: true });
  } catch (error) {
    const { message, status } = getErrorResponse(error);
    return NextResponse.json({ message }, { status });
  }
}
