"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export default function Preloader() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate a short loading time (2 seconds)
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  if (!loading) return null; // hide preloader after loading

  return (
    <div className="fixed inset-0 z-50 bg-white flex items-center justify-center overflow-hidden">
      <div className="max-w-full max-h-full">
        <Image
          src="/FBS-LOGO.png"
          alt="FBS Logo"
          width={100}
          height={80}
          className="animate-bounce"
          style={{ maxWidth: "100%", height: "auto" }}
        />
      </div>
    </div>
  );
}
