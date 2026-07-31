import type { Metadata } from "next";
import Script from "next/script";
import { notFound } from "next/navigation";
import ServiceLocationPageClient from "./ServiceLocationPageClient";
import {
  buildServiceLocationMetadata,
  getRelatedServiceLocationLinks,
  getServiceLocationPage,
  getServiceLocationPages,
  getServiceLocationSchemas,
} from "@/app/lib/service-location-pages";
import { getRequestBaseUrl } from "@/app/lib/request-url";

export const dynamicParams = false;

export function generateStaticParams() {
  return getServiceLocationPages().map((page) => ({
    serviceLocation: page.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ serviceLocation: string }>;
}): Promise<Metadata> {
  const { serviceLocation } = await params;
  const page = getServiceLocationPage(serviceLocation);

  if (!page) {
    notFound();
  }

  return buildServiceLocationMetadata(page, await getRequestBaseUrl());
}

export default async function ServiceLocationPage({
  params,
}: {
  params: Promise<{ serviceLocation: string }>;
}) {
  const { serviceLocation } = await params;
  const page = getServiceLocationPage(serviceLocation);

  if (!page) {
    notFound();
  }

  const baseUrl = await getRequestBaseUrl();
  const schemas = getServiceLocationSchemas(page, baseUrl);
  const relatedServices = getRelatedServiceLocationLinks(page);

  return (
    <>
      {schemas.map((schema, index) => (
        <Script
          key={`service-location-schema-${page.slug}-${index}`}
          id={`service-location-schema-${page.slug}-${index}`}
          type="application/ld+json"
        >
          {JSON.stringify(schema)}
        </Script>
      ))}
      <ServiceLocationPageClient page={page} relatedServices={relatedServices} />
    </>
  );
}
