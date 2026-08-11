import type { Metadata } from "next";
import Script from "next/script";
import { notFound } from "next/navigation";
import productsData from "@/app/data/printing-products-detail.json";
import ProductDetailPageClient from "./ProductDetailPageClient";
import {
  absoluteUrl,
  buildAreaServedSchema,
  buildBreadcrumbSchema,
  buildFaqSchema,
  organizationId,
  siteConfig,
  toAbsoluteImageUrl,
} from "@/app/lib/seo";
import { getRequestBaseUrl } from "@/app/lib/request-url";

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

  const baseUrl = await getRequestBaseUrl();
  const canonical = absoluteUrl(`/services/printing-products/${product.slug}`, baseUrl);
  const imageUrl = toAbsoluteImageUrl(product.image, baseUrl);

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
      locale: siteConfig.locale,
      url: canonical,
      siteName: siteConfig.name,
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

  const baseUrl = await getRequestBaseUrl();
  const canonical = absoluteUrl(`/services/printing-products/${product.slug}`, baseUrl);
  const imageUrl = toAbsoluteImageUrl(product.image, baseUrl);

  const breadcrumbSchema = buildBreadcrumbSchema(
    [
      { name: "Home", path: "/" },
      { name: "Printing Products", path: "/services/printing-products" },
      { name: product.name, path: `/services/printing-products/${product.slug}` },
    ],
    canonical,
    baseUrl,
  );

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${canonical}#product`,
    name: product.name,
    image: [imageUrl],
    description: product.description,
    category: "Commercial Printing Product",
    brand: {
      "@type": "Brand",
      name: siteConfig.name,
    },
    offers: {
      "@type": "Offer",
      url: canonical,
      priceCurrency: "USD",
      priceSpecification: {
        "@type": "PriceSpecification",
        priceCurrency: "USD",
        description:
          "Custom quote based on product type, quantity, materials, finishing, and turnaround.",
      },
      itemCondition: "https://schema.org/NewCondition",
      availability: "https://schema.org/InStock",
      seller: {
        "@id": organizationId(baseUrl),
      },
      areaServed: buildAreaServedSchema(),
    },
  };

  const faqSchema = buildFaqSchema(`${canonical}#faq`, product.faqs);

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
