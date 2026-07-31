import "server-only";

import { headers } from "next/headers";
import { resolveBaseUrl } from "@/app/lib/seo";

export async function getRequestBaseUrl() {
  const headerStore = await headers();

  return resolveBaseUrl(
    headerStore.get("x-forwarded-host") ?? headerStore.get("host"),
    headerStore.get("x-forwarded-proto"),
  );
}
