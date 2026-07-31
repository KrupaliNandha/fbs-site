import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const legacyPathRedirects: Record<string, string> = {
  "/services/printing-product": "/services/printing-products",
  "/services/direct-maiilintg": "/services/direct-mailing",
};

export function proxy(request: NextRequest) {
  const url = request.nextUrl.clone();
  const originalPathname = url.pathname;

  if (
    originalPathname.startsWith("/_next") ||
    originalPathname.startsWith("/api") ||
    /\.[^/]+$/.test(originalPathname)
  ) {
    return NextResponse.next();
  }

  const normalizedPathname =
    legacyPathRedirects[originalPathname.toLowerCase()] ??
    originalPathname.toLowerCase();

  if (normalizedPathname !== originalPathname) {
    url.pathname = normalizedPathname;
    return NextResponse.redirect(url, 308);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|api|.*\\..*).*)"],
};
