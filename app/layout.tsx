import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import BackToTop from "./Components/BackToTop";
import { buildPageMetadata, siteConfig } from "@/app/lib/seo";
import { GlobalStructuredData } from "@/app/Components/RouteStructuredData";
import { BaseUrlProvider } from "./Components/BaseUrlProvider";
import { getRequestBaseUrl } from "@/app/lib/request-url";
import PreloaderWrapper from "./Components/PreloaderWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = await getRequestBaseUrl();
  const homeMetadata = buildPageMetadata("/", baseUrl);

  return {
    metadataBase: new URL(baseUrl),
    applicationName: siteConfig.name,
    title: homeMetadata.title,
    description: homeMetadata.description,
    keywords: homeMetadata.keywords,
    alternates: homeMetadata.alternates,
    robots: homeMetadata.robots,
    openGraph: homeMetadata.openGraph,
    twitter: homeMetadata.twitter,
    category: "business",
    referrer: "origin-when-cross-origin",
    verification: {
      google: "IKMOipJylldwdtghGqF1-RJ0lXH4mPxw6CxUqMs9e_c",
    },
    icons: {
      icon: "/FBS.ico",
      shortcut: "/FBS.ico",
      apple: "/FBS.ico",
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const baseUrl = await getRequestBaseUrl();

  return (
    <html lang="en" className="lenis lenis-smooth lenis-scrolling">
      <head>
        <link rel="preconnect" href="https://www.google.com" />
        <link rel="dns-prefetch" href="https://www.google.com" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <BaseUrlProvider baseUrl={baseUrl}>
          <GlobalStructuredData />
          <PreloaderWrapper>
            {children}
            <BackToTop />
          </PreloaderWrapper>
        </BaseUrlProvider>
      </body>
    </html>
  );
}