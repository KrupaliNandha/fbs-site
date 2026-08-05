"use client";

import Image from "next/image";
import { useEffect } from "react";
import type Lenis from "@studio-freight/lenis";

export default function Preloader({
  onFinish,
}: {
  onFinish: () => void;
}) {
  useEffect(() => {
    const lenis = (window as typeof window & { __lenis?: Lenis }).__lenis;

    // Stop Lenis smooth-scroll (desktop) while the preloader is visible
    lenis?.stop();

    // Fallback: lock native scroll too (covers touch devices where Lenis is disabled)
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const timer = setTimeout(() => {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
      onFinish();
    }, 1500);

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = originalOverflow;

      // Resume Lenis once the preloader unmounts
      const currentLenis = (window as typeof window & { __lenis?: Lenis }).__lenis;
      currentLenis?.start();
    };
  }, [onFinish]);

  return (
    <div className="fixed inset-0 z-50 min-h-screen bg-white flex items-center justify-center">
      <Image
        src="/images/brand/fbs-prints-logo.webp"
        alt="FBS Prints logo"
        width={102}
        height={82}
        className="animate-bounce w-[102px] h-auto"
      />
    </div>
  );
}