import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Script from "next/script";
import servicesData from "../../../data/web-design.json";
import WebDesignDetails from "./WebDesignDetails";
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

interface Faq {
  q: string;
  a: string;
}

interface Service {
  slug: string;
  title: string;
  icon: string;
  img: string;
  description: string;
  features: string[];
  highlight: string;
  faqs?: Faq[];
}

const services = servicesData as Service[];

function getService(slug: string): Service | undefined {
  return services.find((service) => service.slug === slug);
}

// Pre-render a page for every slug in the JSON at build time
export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
}

// Per-page SEO metadata driven by the JSON data
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);

  if (!service) {
    return {
      title: "Service not found",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const baseUrl = await getRequestBaseUrl();
  const canonical = absoluteUrl(`/services/web-design/${service.slug}`, baseUrl);
  const image = toAbsoluteImageUrl(service.img, baseUrl);

  return {
    title: `${service.title} | FBS Prints`,
    description: service.highlight,
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
      title: `${service.title} | FBS Prints`,
      description: service.highlight,
      images: [{ url: image, width: 1200, height: 630, alt: service.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${service.title} | FBS Prints`,
      description: service.highlight,
      images: [image],
    },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = getService(slug);

  if (!service) {
    notFound();
  }

  const baseUrl = await getRequestBaseUrl();
  const canonical = absoluteUrl(`/services/web-design/${service.slug}`, baseUrl);
  const image = toAbsoluteImageUrl(service.img, baseUrl);

  const breadcrumbSchema = buildBreadcrumbSchema(
    [
      { name: "Home", path: "/" },
      { name: "Web Design", path: "/services/web-design" },
      { name: service.title, path: `/services/web-design/${service.slug}` },
    ],
    canonical,
    baseUrl,
  );

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${canonical}#service`,
    name: service.title,
    serviceType: "Web Design Service",
    description: service.highlight,
    url: canonical,
    image,
    provider: {
      "@id": organizationId(baseUrl),
    },
    areaServed: buildAreaServedSchema(),
  };

  const faqSchema = service.faqs?.length
    ? buildFaqSchema(
        `${canonical}#faq`,
        service.faqs.map((faq) => ({ question: faq.q, answer: faq.a })),
      )
    : null;

  return (
    <>
      <Script id={`web-design-breadcrumb-${service.slug}`} type="application/ld+json">
        {JSON.stringify(breadcrumbSchema)}
      </Script>
      <Script id={`web-design-service-${service.slug}`} type="application/ld+json">
        {JSON.stringify(serviceSchema)}
      </Script>
      {faqSchema ? (
        <Script id={`web-design-faq-${service.slug}`} type="application/ld+json">
          {JSON.stringify(faqSchema)}
        </Script>
      ) : null}
      <WebDesignDetails service={service} />
    </>
  );
}
