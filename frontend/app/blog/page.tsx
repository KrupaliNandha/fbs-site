import type { Metadata } from "next";
import Script from "next/script";
import BlogListClient from "@/app/blog/BlogListClient";
import { RouteStructuredData } from "@/app/Components/RouteStructuredData";
import { blogPosts } from "@/app/data/blog";
import { absoluteUrl, buildPageMetadata, siteConfig } from "@/app/lib/seo";
import { getRequestBaseUrl } from "@/app/lib/request-url";

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata("/blog", await getRequestBaseUrl());
}

export default async function BlogPage() {
  const baseUrl = await getRequestBaseUrl();
  const canonical = absoluteUrl("/blog", baseUrl);

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${canonical}#collection`,
    name: "FBS Prints Blog",
    description:
      "Guides and insights covering signage, printing, direct mail, web design, SEO, and local growth strategy.",
    url: canonical,
    isPartOf: {
      "@id": `${absoluteUrl("/", baseUrl)}#website`,
    },
    about: {
      "@id": `${absoluteUrl("/", baseUrl)}#organization`,
    },
    hasPart: {
      "@type": "ItemList",
      itemListElement: blogPosts.map((post, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: absoluteUrl(`/blog/${post.slug}`, baseUrl),
        name: post.title,
      })),
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      url: absoluteUrl("/", baseUrl),
    },
  };

  return (
    <>
      <RouteStructuredData path="/blog" />
      <Script id="blog-collection-schema" type="application/ld+json">
        {JSON.stringify(itemListSchema)}
      </Script>
      <BlogListClient posts={blogPosts} />
    </>
  );
}
