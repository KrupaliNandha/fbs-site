import type { MetadataRoute } from "next";
import { absoluteUrl, publicPagePaths } from "@/app/lib/seo";
import { getServiceLocationPages } from "@/app/lib/service-location-pages";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.fbssigns.com";

const corePageLastModified: Record<string, string> = {
  "/": "2026-06-04",
  "/about": "2026-05-01",
  "/contact": "2026-05-01",
  "/faq": "2026-06-04",
  "/know-you": "2026-05-01",
  "/privacy": "2026-04-01",
  "/services/printing-products": "2026-05-15",
  "/services/direct-mailing": "2026-05-15",
  "/services/signage": "2026-05-15",
  "/services/web-design": "2026-05-15",
  "/services/seo": "2026-06-04",
};

export default function sitemap(): MetadataRoute.Sitemap {
  const corePages: MetadataRoute.Sitemap = publicPagePaths.map((path) => ({
    url: absoluteUrl(path, baseUrl),
    lastModified: new Date(corePageLastModified[path] ?? "2026-05-01"),
  }));

  const serviceLocationPages: MetadataRoute.Sitemap = getServiceLocationPages().map((page) => ({
    url: absoluteUrl(page.path, baseUrl),
    lastModified: new Date(page.location.updatedAt),
  }));

  return [...corePages, ...serviceLocationPages];
}
