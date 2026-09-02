"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";
import BackToTop from "./BackToTop";

export default function PreloaderWrapper({
  children,
}: {
  children: React.ReactNode;
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
      {!isAuthOrDashboardRoute && <Navbar />}

      <main>{children}</main>

      {!isAuthOrDashboardRoute && (
        <>
          <Footer />
          <BackToTop />
        </>
      )}
    </>
  );
}
