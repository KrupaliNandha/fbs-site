import type { Metadata } from "next";
import Script from "next/script";
import { notFound } from "next/navigation";
import productDetailData from "@/app/data/product-detail.json";
import { getProductFaqs } from "@/app/data/Product-faqs-data";
import { absoluteUrl, siteConfig } from "@/app/lib/seo";
import { getRequestBaseUrl } from "@/app/lib/request-url";
import SignageDetailPageClient from "./SignageDetailPageClient";

type RawSignageProduct = {
  slug: string;
  name: string;
  images?: {
    mainImage?: string;
  };
  Description?: {
    content?: string[];
  };
  features?: string[];
};

const signageProducts = productDetailData as RawSignageProduct[];

function getSignageProduct(slug: string) {
  return signageProducts.find((item) => item.slug === slug);
}

function resolveImageUrl(imagePath: string | undefined, baseUrl: string) {
  if (!imagePath) {
    return absoluteUrl("/images/brand/fbs-prints-logo.webp", baseUrl);
  }

  const normalized = imagePath.startsWith("/") ? imagePath : `/${imagePath}`;
  return absoluteUrl(normalized, baseUrl);
}

function createDescription(product: RawSignageProduct) {
  const paragraph = product.Description?.content?.[0]?.trim();

  if (paragraph) {
    return paragraph.length > 180 ? `${paragraph.slice(0, 177).trimEnd()}...` : paragraph;
  }

  return `Explore ${product.name} from FBS Prints for commercial signage, branding, and visibility-focused installations.`;
}

export function generateStaticParams() {
  return signageProducts.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getSignageProduct(slug);

  if (!product) {
    return {
      title: "Signage Product | FBS Prints",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const baseUrl = await getRequestBaseUrl();
  const canonical = absoluteUrl(`/services/signage/${product.slug}`, baseUrl);
  const image = resolveImageUrl(product.images?.mainImage, baseUrl);
  const description = createDescription(product);

  return {
    title: `${product.name} | FBS Prints Signage`,
    description,
    keywords: [product.name, "custom signage", "business signs", "FBS Prints"],
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
      title: `${product.name} | FBS Prints Signage`,
      description,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: product.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.name} | FBS Prints Signage`,
      description,
      images: [image],
    },
  };
}

export default async function SignageProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getSignageProduct(slug);

  if (!product) {
    notFound();
  }

  const baseUrl = await getRequestBaseUrl();
  const canonical = absoluteUrl(`/services/signage/${product.slug}`, baseUrl);
  const image = resolveImageUrl(product.images?.mainImage, baseUrl);
  const description = createDescription(product);
  const faqs = getProductFaqs(product.slug)?.faqs ?? [];

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
        name: "Signage",
        item: absoluteUrl("/services/signage", baseUrl),
      },
      {
        "@type": "ListItem",
        position: 3,
        name: product.name,
        item: canonical,
      },
    ],
  };

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${canonical}#product`,
    name: product.name,
    description,
    image: [image],
    category: "Commercial Signage",
    brand: {
      "@type": "Brand",
      name: siteConfig.name,
    },
    offers: {
      "@type": "Offer",
      url: canonical,
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition",
      seller: {
        "@id": `${absoluteUrl("/", baseUrl)}#organization`,
      },
    },
  };

  const faqSchema = faqs.length > 0
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "@id": `${canonical}#faq`,
        mainEntity: faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.answer,
          },
        })),
      }
    : null;

  return (
    <>
      <Script id={`signage-breadcrumb-${product.slug}`} type="application/ld+json">
        {JSON.stringify(breadcrumbSchema)}
      </Script>
      <Script id={`signage-product-${product.slug}`} type="application/ld+json">
        {JSON.stringify(productSchema)}
      </Script>
      {faqSchema ? (
        <Script id={`signage-faq-${product.slug}`} type="application/ld+json">
          {JSON.stringify(faqSchema)}
        </Script>
      ) : null}
      <SignageDetailPageClient />
    </>
  );
}
