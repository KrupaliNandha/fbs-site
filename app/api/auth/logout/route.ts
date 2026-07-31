import { NextResponse } from "next/server";
import {
  clearSessionCookie,
  logoutCurrentSession,
} from "@/app/lib/auth/session";

export const runtime = "nodejs";

export async function POST() {
  await logoutCurrentSession();

  const response = NextResponse.json({ ok: true });
  clearSessionCookie(response);

  return response;
}
