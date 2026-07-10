import { absoluteUrl } from "@/app/lib/seo";
import { serviceAreas } from "@/app/data/service-areas-data";
import { blogPosts } from "@/app/data/blog";
import { getServiceLocationPages } from "@/app/lib/service-location-pages";
import printingProducts from "@/app/data/printing-products-detail.json";
import directMailData from "@/app/data/direct-mailing.json";
import seoServices from "@/app/data/seo-services.json";
import webDesignServices from "@/app/data/web-design.json";
import signageProducts from "@/app/data/product-detail.json";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.fbssigns.com";

function createSection(title: string, items: Array<{ label: string; url: string }>) {
  return [
    `## ${title}`,
    "",
    ...items.map((item) => `- [${item.label}](${item.url})`),
    "",
  ].join("\n");
}

export function GET() {
  const corePages = [
    { label: "Home", url: absoluteUrl("/", baseUrl) },
    { label: "About", url: absoluteUrl("/about", baseUrl) },
    { label: "Blog", url: absoluteUrl("/blog", baseUrl) },
    { label: "Contact", url: absoluteUrl("/contact", baseUrl) },
    { label: "FAQ", url: absoluteUrl("/faq", baseUrl) },
    { label: "Know Your Signs", url: absoluteUrl("/know-you", baseUrl) },
    { label: "Privacy", url: absoluteUrl("/privacy", baseUrl) },
    { label: "Service Areas", url: absoluteUrl("/service-areas", baseUrl) },
  ];

  const primaryServices = [
    { label: "Signage Services", url: absoluteUrl("/services/signage", baseUrl) },
    { label: "Printing Products", url: absoluteUrl("/services/printing-products", baseUrl) },
    { label: "Direct Mailing", url: absoluteUrl("/services/direct-mailing", baseUrl) },
    { label: "Web Design", url: absoluteUrl("/services/web-design", baseUrl) },
    { label: "SEO Services", url: absoluteUrl("/services/seo", baseUrl) },
  ];

  const serviceDetailPages = [
    ...printingProducts.map((product) => ({
      label: `Printing Product: ${product.name}`,
      url: absoluteUrl(`/services/printing-products/${product.slug}`, baseUrl),
    })),
    ...directMailData.formats.map((format) => ({
      label: `Direct Mail Format: ${format.title}`,
      url: absoluteUrl(`/services/direct-mailing/${format.slug}`, baseUrl),
    })),
    ...seoServices.map((service) => ({
      label: `SEO Service: ${service.title}`,
      url: absoluteUrl(`/services/seo/${service.slug}`, baseUrl),
    })),
    ...webDesignServices.map((service) => ({
      label: `Web Design Service: ${service.title}`,
      url: absoluteUrl(`/services/web-design/${service.slug}`, baseUrl),
    })),
    ...signageProducts.map((product) => ({
      label: `Signage Product: ${product.name}`,
      url: absoluteUrl(`/services/signage/${product.slug}`, baseUrl),
    })),
  ];

  const cityPages = serviceAreas.map((city) => ({
    label: `Service Area: ${city.city}, ${city.stateCode}`,
    url: absoluteUrl(`/service-areas/${city.slug}`, baseUrl),
  }));

  const serviceLocationPages = getServiceLocationPages().map((page) => ({
    label: `${page.service.routeLabel} in ${page.location.city}, ${page.location.stateCode}`,
    url: absoluteUrl(page.path, baseUrl),
  }));

  const blogPages = blogPosts.map((post) => ({
    label: `Blog: ${post.title}`,
    url: absoluteUrl(`/blog/${post.slug}`, baseUrl),
  }));

  const body = [
    "# FBS Signs Full LLM Index",
    "",
    "> Expanded canonical URL index for AI systems, retrieval agents, and research workflows.",
    "",
    createSection("Core Pages", corePages),
    createSection("Primary Services", primaryServices),
    createSection("Service Detail Pages", serviceDetailPages),
    createSection("City Service Areas", cityPages),
    createSection("Service Location Pages", serviceLocationPages),
    createSection("Blog Articles", blogPages),
  ].join("\n");

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
