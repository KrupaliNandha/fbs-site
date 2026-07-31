import { NextRequest, NextResponse } from "next/server";
import { getErrorResponse } from "@/app/lib/auth/errors";
import { requirePermission } from "@/app/lib/auth/session";
import { createUser, listUsers } from "@/app/lib/auth/users";

export const runtime = "nodejs";

export async function GET() {
  try {
    await requirePermission("users:read");
    return NextResponse.json({ users: listUsers() });
  } catch (error) {
    const { message, status } = getErrorResponse(error);
    return NextResponse.json({ message }, { status });
  }
}

export async function POST(request: NextRequest) {
  try {
    const actor = await requirePermission("users:create");
    const user = await createUser(await request.json(), actor.id);

    return NextResponse.json({ user }, { status: 201 });
  } catch (error) {
    const { message, status } = getErrorResponse(error);
    return NextResponse.json({ message }, { status });
  }
}
