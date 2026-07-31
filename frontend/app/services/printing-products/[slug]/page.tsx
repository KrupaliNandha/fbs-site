import type { Metadata } from "next";
import Script from "next/script";
import { notFound } from "next/navigation";
import productsData from "@/app/data/printing-products-detail.json";
import ProductDetailPageClient from "./ProductDetailPageClient";

// Statically generate pages for all 9 printing products
export function generateStaticParams() {
  return productsData.map((p) => ({
    slug: p.slug,
  }));
}

// Generate rich dynamic metadata for SEO
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = productsData.find((p) => p.slug === slug);

  if (!product) {
    notFound();
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.fbssigns.com";
  const canonical = `${baseUrl}/services/printing-products/${product.slug}`;
  const imageUrl = `${baseUrl}${product.image}`;

  return {
    title: product.title,
    description: product.metaDescription,
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
      type: "website",
      locale: "en_US",
      url: canonical,
      siteName: "FBS Prints",
      title: product.title,
      description: product.metaDescription,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: product.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: product.title,
      description: product.metaDescription,
      images: [imageUrl],
    },
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = productsData.find((p) => p.slug === slug);

  if (!product) {
    notFound();
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.fbssigns.com";
  const canonical = `${baseUrl}/services/printing-products/${product.slug}`;
  const imageUrl = `${baseUrl}${product.image}`;

  // 1. Breadcrumb Schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": `${canonical}#breadcrumb`,
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: `${baseUrl}/`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Services",
        item: `${baseUrl}/#services`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "Printing Products",
        item: `${baseUrl}/services/printing-products`,
      },
      {
        "@type": "ListItem",
        position: 4,
        name: product.name,
        item: canonical,
      },
    ],
  };

  // 2. Product & Offer Schema
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${canonical}#product`,
    name: product.name,
    image: imageUrl,
    description: product.description,
    brand: {
      "@type": "Brand",
      name: "FBS Prints",
    },
    offers: {
      "@type": "Offer",
      url: canonical,
      priceCurrency: "USD",
      price: "9.99",
      priceValidUntil: "2027-12-31",
      itemCondition: "https://schema.org/NewCondition",
      availability: "https://schema.org/InStock",
      seller: {
        "@type": "LocalBusiness",
        name: "FBS Prints",
        url: baseUrl,
      },
    },
  };

  // 3. FAQ Schema
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${canonical}#faq`,
    mainEntity: product.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  const schemas = [breadcrumbSchema, productSchema, faqSchema];

  return (
    <>
      {schemas.map((schema, index) => (
        <Script
          key={`product-schema-${product.slug}-${index}`}
          id={`product-schema-${product.slug}-${index}`}
          type="application/ld+json"
        >
          {JSON.stringify(schema)}
        </Script>
      ))}
      <ProductDetailPageClient product={product} allProducts={productsData} />
    </>
  );
}
