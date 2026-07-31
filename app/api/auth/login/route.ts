import { NextRequest, NextResponse } from "next/server";
import { getErrorResponse } from "@/app/lib/auth/errors";
import { isAuthRole } from "@/app/lib/auth/roles";
import { loginWithRole, setSessionCookie } from "@/app/lib/auth/session";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const email = typeof body.email === "string" ? body.email : "";
    const password = typeof body.password === "string" ? body.password : "";
    const role = body.role;

    if (!isAuthRole(role)) {
      return NextResponse.json({ message: "Unsupported role." }, { status: 400 });
    }

    const { user, token, expiresAt, redirectTo } = await loginWithRole(
      email,
      password,
      role,
    );
    const response = NextResponse.json({ user, redirectTo });
    setSessionCookie(response, token, expiresAt);

    return response;
  } catch (error) {
    const { message, status } = getErrorResponse(error);
    return NextResponse.json({ message }, { status });
  }
}
