"use client";

import { useEffect, useState } from "react";
import { FiArrowUp } from "react-icons/fi";

export default function BackToTop() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setShow(window.scrollY > 300); // show after scroll
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (!show) return null;

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-6 right-6 z-50
      bg-primary hover:bg-primary-dark text-white
      w-12 h-12 rounded-full shadow-xl
      flex items-center justify-center
      transition-all duration-300"
      aria-label="Back to top"
    >
      <FiArrowUp className="text-xl" />
    </button>
  );
}