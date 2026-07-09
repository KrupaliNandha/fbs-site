import { blogPosts } from "@/app/data/blog";
import { absoluteUrl } from "@/app/lib/seo";
import printingProducts from "@/app/data/printing-products-detail.json";
import directMailData from "@/app/data/direct-mailing.json";
import seoServices from "@/app/data/seo-services.json";
import webDesignServices from "@/app/data/web-design.json";
import signageProducts from "@/app/data/product-detail.json";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.fbssigns.com";

function normalizeImageUrl(url: string | undefined) {
  if (!url) return null;
  return url.startsWith("http") ? url : absoluteUrl(url.startsWith("/") ? url : `/${url}`, baseUrl);
}

export function GET() {
  const imageEntries = new Map<string, string>();

  const addImage = (pagePath: string, imageUrl: string | null, title: string) => {
    if (!imageUrl) return;
    imageEntries.set(
      `${pagePath}:::${imageUrl}`,
      `  <url>
    <loc>${absoluteUrl(pagePath, baseUrl)}</loc>
    <image:image>
      <image:loc>${imageUrl}</image:loc>
      <image:title>${title}</image:title>
    </image:image>
  </url>`,
    );
  };

  blogPosts.forEach((post) => addImage(`/blog/${post.slug}`, normalizeImageUrl(post.image), post.title));
  printingProducts.forEach((product) =>
    addImage(`/services/printing-products/${product.slug}`, normalizeImageUrl(product.image), product.name),
  );
  directMailData.formats.forEach((format) =>
    addImage(`/services/direct-mailing/${format.slug}`, normalizeImageUrl(format.img), format.title),
  );
  seoServices.forEach((service) =>
    addImage(`/services/seo/${service.slug}`, normalizeImageUrl(service.heroImage), service.title),
  );
  webDesignServices.forEach((service) =>
    addImage(`/services/web-design/${service.slug}`, normalizeImageUrl(service.img), service.title),
  );
  signageProducts.forEach((product) =>
    addImage(`/services/signage/${product.slug}`, normalizeImageUrl(product.images?.mainImage), product.name),
  );

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${[...imageEntries.values()].join("\n")}
</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
    },
  });
}
