import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Script from "next/script";
import servicesData from "../../../data/web-design.json";
import WebDesignDetails from "./WebDesignDetails";
import { absoluteUrl, siteConfig } from "@/app/lib/seo";
import { getRequestBaseUrl } from "@/app/lib/request-url";

interface Service {
  slug: string;
  title: string;
  icon: string;
  img: string;
  description: string;
  features: string[];
  highlight: string;
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
  const image = service.img.startsWith("http") ? service.img : absoluteUrl(service.img, baseUrl);

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
  const image = service.img.startsWith("http") ? service.img : absoluteUrl(service.img, baseUrl);

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
        name: "Web Design",
        item: absoluteUrl("/services/web-design", baseUrl),
      },
      {
        "@type": "ListItem",
        position: 3,
        name: service.title,
        item: canonical,
      },
    ],
  };

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
      "@id": `${absoluteUrl("/", baseUrl)}#organization`,
    },
  };

  return (
    <>
      <Script id={`web-design-breadcrumb-${service.slug}`} type="application/ld+json">
        {JSON.stringify(breadcrumbSchema)}
      </Script>
      <Script id={`web-design-service-${service.slug}`} type="application/ld+json">
        {JSON.stringify(serviceSchema)}
      </Script>
      <WebDesignDetails service={service} />
    </>
  );
}
