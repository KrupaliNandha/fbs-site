"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import Preloader from "./Preloader";
import Navbar from "./Navbar";
import Footer from "./Footer";
import BackToTop from "./BackToTop";
import SmoothScroll from "./SmoothScroll";

export default function PreloaderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [navKey, setNavKey] = useState(0);
  const isFirstRender = useRef(true);

  // Combine pathname + search params so navigations that only change
  // query strings (e.g. filters, tabs) also count as a "new page"
  const routeKey = `${pathname}?${searchParams.toString()}`;

  useEffect(() => {
    // Skip re-triggering on the very first mount —
    // isLoading is already true by default for the initial load.
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    // Route changed (client-side navigation) — force a fresh Preloader
    // instance every time, even if isLoading was already true.
    setIsLoading(true);
    setNavKey((prev) => prev + 1);
  }, [routeKey]);

  return (
    <>
      {isLoading && (
        <Preloader key={navKey} onFinish={() => setIsLoading(false)} />
      )}

      <SmoothScroll>
        {!isLoading && <Navbar />}

        <main>{children}</main>

        {!isLoading && (
          <>
            <Footer />
            <BackToTop />
          </>
        )}
      </SmoothScroll>
    </>
  );
}