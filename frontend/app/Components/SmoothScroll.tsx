"use client";

import { useEffect, ReactNode } from "react";
import Lenis from "@studio-freight/lenis";
import AOS from "aos";

interface Props {
  children: ReactNode;
}

export default function SmoothScroll({ children }: Props) {
  useEffect(() => {
    // 🚫 Disable Lenis on touch devices (FIXES the crash)
    if ("ontouchstart" in window) return;

    const lenis = new Lenis({
      duration: 2,
      smoothWheel: true,
      easing: (t: number) => 1 - Math.pow(1 - t, 4),
    });

    // Expose the Lenis instance globally so other components
    // (e.g. Preloader) can stop/start scrolling on demand
    (window as typeof window & { __lenis?: Lenis }).__lenis = lenis;

    const raf = (time: number) => {
      lenis.raf(time);
      AOS.refresh();
      requestAnimationFrame(raf);
    };

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
      delete (window as typeof window & { __lenis?: Lenis }).__lenis;
    };
  }, []);

  return (
    <div id="smooth-wrapper">
      <div id="smooth-content">{children}</div>
    </div>
  );
}