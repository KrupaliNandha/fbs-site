import type { Metadata } from "next";
import type { ReactNode } from "react";
import { RouteStructuredData } from "@/app/Components/RouteStructuredData";
import { buildPageMetadata } from "@/app/lib/seo";
import { getRequestBaseUrl } from "@/app/lib/request-url";

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata("/our-work", await getRequestBaseUrl());
}

export default function OurWorkLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <RouteStructuredData path="/our-work" />
      {children}
    </>
  );
}