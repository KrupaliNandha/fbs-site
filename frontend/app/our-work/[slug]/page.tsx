import type { Metadata } from "next";
import Script from "next/script";
import { notFound } from "next/navigation";
import portfolioData from "../../data/portfolio-content.json";
import {
  absoluteUrl,
  buildBreadcrumbSchema,
  buildFaqSchema,
  organizationId,
  siteConfig,
  toAbsoluteImageUrl,
} from "@/app/lib/seo";
import { getRequestBaseUrl } from "@/app/lib/request-url";
import OurWorkDetailClient, { type PortfolioItem } from "./OurWorkDetailClient";

const data = portfolioData as PortfolioItem[];

function buildProjectSchemas(item: PortfolioItem, baseUrl: string) {
  const canonical = absoluteUrl(item.link, baseUrl);
  const images = item.images.length ? item.images : [item.coverImage];
  const imageObjects = images.map((image, index) => ({
    "@type": "ImageObject",
    "@id": `${canonical}#image-${index + 1}`,
    url: toAbsoluteImageUrl(image, baseUrl),
    caption: `${item.title} project image ${index + 1}`,
  }));

  const projectSchema = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "@id": `${canonical}#project`,
    name: item.title,
    headline: item.seoTitle ?? item.title,
    description: item.extendedOverview || item.description,
    url: canonical,
    image: imageObjects,
    creator: {
      "@id": organizationId(baseUrl),
    },
    publisher: {
      "@id": organizationId(baseUrl),
    },
    about: item.category,
    keywords: item.tags.join(", "),
    ...(item.material && { material: item.material }),
    ...(item.testimonials.length > 0 && {
      review: item.testimonials.map((review) => ({
        "@type": "Review",
        reviewRating: {
          "@type": "Rating",
          ratingValue: review.rating,
          bestRating: 5,
          worstRating: 1,
        },
        author: {
          "@type": "Person",
          name: review.author,
        },
        reviewBody: review.quote,
      })),
    }),
  };

  const schemas: object[] = [
    buildBreadcrumbSchema(
      [
        { name: "Home", path: "/" },
        { name: "Our Work", path: "/our-work" },
        { name: item.title, path: item.link },
      ],
      canonical,
      baseUrl,
    ),
    projectSchema,
  ];

  if (item.faqs.length) {
    schemas.push(
      buildFaqSchema(
        `${canonical}#faq`,
        item.faqs.map((faq) => ({ question: faq.q, answer: faq.a })),
      ),
    );
  }

  if (item.processSteps.length) {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "HowTo",
      "@id": `${canonical}#process`,
      name: `How FBS Signs Builds ${item.title}`,
      step: item.processSteps.map((step) => ({
        "@type": "HowToStep",
        position: step.step,
        name: step.title,
        text: step.detail,
      })),
    });
  }

  if (item.glossaryTerms?.length) {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "DefinedTermSet",
      "@id": `${canonical}#glossary`,
      name: `${item.title} Glossary`,
      hasDefinedTerm: item.glossaryTerms.map((term) => ({
        "@type": "DefinedTerm",
        name: term.term,
        description: term.definition,
      })),
    });
  }

  return schemas;
}

export async function generateStaticParams() {
  return data.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const item = data.find((p) => p.slug === slug);

  if (!item) {
    return { title: "Project Not Found | FBS Signs" };
  }

  const baseUrl = await getRequestBaseUrl();
  const canonical = absoluteUrl(item.link, baseUrl);
  const image = toAbsoluteImageUrl(item.coverImage, baseUrl);

  return {
    title: item.seoTitle ?? item.title,
    description: item.description,
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
      title: item.seoTitle ?? item.title,
      description: item.description,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: item.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: item.seoTitle ?? item.title,
      description: item.description,
      images: [image],
    },
  };
}

export default async function OurWorkDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = data.find((p) => p.slug === slug);

  if (!item) {
    notFound();
  }

  const schemas = buildProjectSchemas(item, await getRequestBaseUrl());

  return (
    <>
      {schemas.map((schema, index) => (
        <Script
          key={`project-schema-${item.slug}-${index}`}
          id={`project-schema-${item.slug}-${index}`}
          type="application/ld+json"
        >
          {JSON.stringify(schema)}
        </Script>
      ))}
      <OurWorkDetailClient item={item} />
    </>
  );
}
