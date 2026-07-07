"use client";

import Image from "next/image";
import { useEffect } from "react";

export default function Preloader({
  onFinish,
}: {
  onFinish: () => void;
}) {
  useEffect(() => {
    const timer = setTimeout(() => {
      // Scroll to top before finishing the preload
      window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
      onFinish();
    }, 1500);

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className="fixed inset-0 z-50 bg-white flex items-center justify-center">
      <Image
        src="/images/brand/fbs-prints-logo.webp"
        alt="FBS Prints logo"
        width={100}
        height={80}
        className="animate-bounce"
      />
    </div>
  );
}