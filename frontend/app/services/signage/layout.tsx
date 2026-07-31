import type { Metadata } from "next";
import type { ReactNode } from "react";
import { RouteStructuredData } from "@/app/Components/RouteStructuredData";
import { buildPageMetadata } from "@/app/lib/seo";
import { getRequestBaseUrl } from "@/app/lib/request-url";

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata("/services/signage", await getRequestBaseUrl());
}

export default function SignageLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <RouteStructuredData path="/services/signage" />
      {children}
    </>
  );
}
