import type { MetadataRoute } from "next";
import { absoluteUrl, publicPagePaths } from "@/app/lib/seo";
import { getServiceLocationPages } from "@/app/lib/service-location-pages";
import { serviceAreas } from "@/app/data/service-areas-data";
import { blogPosts } from "@/app/data/blog";

import printingProducts from "@/app/data/printing-products-detail.json";
import directMailData from "@/app/data/direct-mailing.json";
import seoServices from "@/app/data/seo-services.json";
import webDesignServices from "@/app/data/web-design.json";
import signageProducts from "@/app/data/product-detail.json";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.fbssigns.com";

const corePageLastModified: Record<string, string> = {
  "/": "2026-06-04",
  "/about": "2026-05-01",
  "/blog": "2026-07-09",
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
    changeFrequency: path === "/blog" ? "daily" : "weekly",
    priority: path === "/" ? 1 : path.startsWith("/services/") ? 0.9 : 0.8,
  }));

  const serviceLocationPages: MetadataRoute.Sitemap = getServiceLocationPages().map((page) => ({
    url: absoluteUrl(page.path, baseUrl),
    lastModified: new Date(page.location.updatedAt),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const printingProductPages: MetadataRoute.Sitemap = printingProducts.map((product) => ({
    url: absoluteUrl(`/services/printing-products/${product.slug}`, baseUrl),
    lastModified: new Date("2026-07-06"),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const directMailPages: MetadataRoute.Sitemap = directMailData.formats.map((format) => ({
    url: absoluteUrl(`/services/direct-mailing/${format.slug}`, baseUrl),
    lastModified: new Date("2026-07-06"),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const seoDetailPages: MetadataRoute.Sitemap = seoServices.map((service) => ({
    url: absoluteUrl(`/services/seo/${service.slug}`, baseUrl),
    lastModified: new Date("2026-07-06"),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const webDesignDetailPages: MetadataRoute.Sitemap = webDesignServices.map((service) => ({
    url: absoluteUrl(`/services/web-design/${service.slug}`, baseUrl),
    lastModified: new Date("2026-07-06"),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const signageDetailPages: MetadataRoute.Sitemap = signageProducts.map((product) => ({
    url: absoluteUrl(`/services/signage/${product.slug}`, baseUrl),
    lastModified: new Date("2026-07-06"),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const blogDetailPages: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: absoluteUrl(`/blog/${post.slug}`, baseUrl),
    lastModified: new Date(post.date),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const serviceAreaPages: MetadataRoute.Sitemap = [
    {
      url: absoluteUrl("/service-areas", baseUrl),
      lastModified: new Date("2026-07-06"),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...serviceAreas.map((city) => ({
      url: absoluteUrl(`/service-areas/${city.slug}`, baseUrl),
      lastModified: new Date(city.updatedAt),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];

  return [
    ...corePages,
    ...serviceLocationPages,
    ...printingProductPages,
    ...directMailPages,
    ...seoDetailPages,
    ...webDesignDetailPages,
    ...signageDetailPages,
    ...blogDetailPages,
    ...serviceAreaPages,
  ];
}
