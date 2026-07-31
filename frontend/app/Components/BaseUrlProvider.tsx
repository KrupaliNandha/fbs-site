"use client";

import { createContext, useContext, type ReactNode } from "react";
import { siteConfig } from "@/app/lib/seo";

const BaseUrlContext = createContext(siteConfig.url);

export function BaseUrlProvider({
  baseUrl,
  children,
}: {
  baseUrl: string;
  children: ReactNode;
}) {
  return (
    <BaseUrlContext.Provider value={baseUrl}>
      {children}
    </BaseUrlContext.Provider>
  );
}

export function useBaseUrl() {
  return useContext(BaseUrlContext);
}
