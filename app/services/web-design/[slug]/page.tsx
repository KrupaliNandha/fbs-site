import { notFound } from "next/navigation";
import type { Metadata } from "next";
import servicesData from "../../../data/web-design.json";
import WebDesignDetails from "./WebDesignDetails";

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
    return { title: "Service not found" };
  }

  return {
    title: `${service.title} | FBS Prints`,
    description: service.highlight,
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

  return <WebDesignDetails service={service} />;
}