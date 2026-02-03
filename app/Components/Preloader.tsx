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
      onFinish();
    }, 1500);

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className="fixed inset-0 z-50 bg-white flex items-center justify-center">
      <Image
        src="/FBS-LOGO.png"
        alt="FBS Logo"
        width={100}
        height={80}
        className="animate-bounce"
      />
    </div>
  );
}
