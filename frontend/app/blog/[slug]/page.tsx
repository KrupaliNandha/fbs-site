import type { Metadata } from "next";
import Script from "next/script";
import { notFound } from "next/navigation";
import BlogDetailClient from "@/app/blog/[slug]/BlogDetailClient";
import { blogPosts, getBlogPost } from "@/app/data/blog";
import { absoluteUrl, siteConfig } from "@/app/lib/seo";
import { getRequestBaseUrl } from "@/app/lib/request-url";

type BlogDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: BlogDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) {
    return {
      title: "Blog Article | FBS Prints",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const baseUrl = await getRequestBaseUrl();
  const canonical = absoluteUrl(`/blog/${post.slug}`, baseUrl);
  const image = post.image.startsWith("http") ? post.image : absoluteUrl(post.image, baseUrl);

  return {
    title: `${post.title} | FBS Prints Blog`,
    description: post.excerpt,
    keywords: post.tags,
    alternates: {
      canonical,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    openGraph: {
      type: "article",
      locale: siteConfig.locale,
      url: canonical,
      siteName: siteConfig.name,
      title: post.title,
      description: post.excerpt,
      publishedTime: new Date(`${post.date}T00:00:00`).toISOString(),
      authors: [post.author.name],
      tags: post.tags,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: [image],
    },
  };
}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) {
    notFound();
  }

  const baseUrl = await getRequestBaseUrl();
  const canonical = absoluteUrl(`/blog/${post.slug}`, baseUrl);
  const image = post.image.startsWith("http") ? post.image : absoluteUrl(post.image, baseUrl);

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": `${canonical}#breadcrumb`,
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: absoluteUrl("/", baseUrl),
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blog",
        item: absoluteUrl("/blog", baseUrl),
      },
      {
        "@type": "ListItem",
        position: 3,
        name: post.title,
        item: canonical,
      },
    ],
  };

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${canonical}#article`,
    headline: post.title,
    description: post.excerpt,
    image: [image],
    datePublished: new Date(`${post.date}T00:00:00`).toISOString(),
    dateModified: new Date(`${post.date}T00:00:00`).toISOString(),
    mainEntityOfPage: canonical,
    url: canonical,
    articleSection: post.category,
    keywords: post.tags.join(", "),
    author: {
      "@type": "Organization",
      name: post.author.name,
      url: absoluteUrl("/", baseUrl),
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      logo: {
        "@type": "ImageObject",
        url: absoluteUrl("/images/brand/fbs-prints-logo.webp", baseUrl),
      },
    },
  };

  return (
    <>
      <Script id={`blog-breadcrumb-${post.slug}`} type="application/ld+json">
        {JSON.stringify(breadcrumbSchema)}
      </Script>
      <Script id={`blog-article-${post.slug}`} type="application/ld+json">
        {JSON.stringify(articleSchema)}
      </Script>
      <BlogDetailClient post={post} />
    </>
  );
}
