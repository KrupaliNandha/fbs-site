"use client";

import { usePathname } from "next/navigation";

export default function PreloaderWrapper({
  children,
  navbar,
  footer,
}: {
  children: React.ReactNode;
  navbar: React.ReactNode;
  footer: React.ReactNode;
}) {
  const pathname = usePathname();

  const isAuthOrDashboardRoute =
    pathname.startsWith("/admin") ||
    pathname.startsWith("/superadmin") ||
    pathname.startsWith("/super-admin") ||
    pathname.startsWith("/designer") ||
    pathname.startsWith("/user") ||
    pathname.startsWith("/review");

  return (
    <>
      {!isAuthOrDashboardRoute && navbar}

      <main>{children}</main>

      {!isAuthOrDashboardRoute && footer}
    </>
  );
}
