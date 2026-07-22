import type { Metadata } from "next";
import { notFound } from "next/navigation";
import portfolioData from "../../data/portfolio-content.json";
import OurWorkDetailClient, { PortfolioItem } from "./OurWorkDetailClient";

const data = portfolioData as PortfolioItem[];

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

  return {
    title: item.seoTitle,
    description: item.description,
    openGraph: {
      title: item.seoTitle,
      description: item.description,
      images: [item.coverImage],
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

  return <OurWorkDetailClient item={item} />;
}
