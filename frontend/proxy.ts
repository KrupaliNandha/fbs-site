import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const canonicalUrl = new URL(
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.fbssigns.com",
);

const productionHosts = new Set([
  "fbsprints.com",
  "www.fbsprints.com",
  "fbssigns.com",
  "www.fbssigns.com",
]);

const legacyPathRedirects: Record<string, string> = {
  "/services/printing-product": "/services/printing-products",
  "/services/direct-maiilintg": "/services/direct-mailing",
};

export function proxy(request: NextRequest) {
  const url = request.nextUrl.clone();
  const originalPathname = url.pathname;
  const forwardedHost = request.headers.get("x-forwarded-host")?.split(",")[0]?.trim();
  const requestHost = (forwardedHost ?? request.headers.get("host") ?? "")
    .split(":")[0]
    .toLowerCase();

  if (productionHosts.has(requestHost) && requestHost !== canonicalUrl.hostname) {
    const destination = new URL(`${url.pathname}${url.search}`, canonicalUrl);
    return NextResponse.redirect(destination, 308);
  }

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
