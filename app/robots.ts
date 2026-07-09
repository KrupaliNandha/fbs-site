import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/app/lib/seo";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.fbssigns.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/"],
      },
    ],
    sitemap: [
      absoluteUrl("/sitemap.xml", baseUrl),
      absoluteUrl("/blog-sitemap.xml", baseUrl),
      absoluteUrl("/image-sitemap.xml", baseUrl),
    ],
  };
}
