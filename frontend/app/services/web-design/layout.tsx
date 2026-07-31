import type { Metadata } from "next";
import type { ReactNode } from "react";
import { RouteStructuredData } from "@/app/Components/RouteStructuredData";
import { buildPageMetadata } from "@/app/lib/seo";
import { getRequestBaseUrl } from "@/app/lib/request-url";

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata("/services/web-design", await getRequestBaseUrl());
}

export default function WebDesignLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <RouteStructuredData path="/services/web-design" />
      {children}
    </>
  );
}
