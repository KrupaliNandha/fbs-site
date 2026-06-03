"use client";

import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

export default function HomeAosInit() {
  useEffect(() => {
    AOS.init({ duration: 2000, once: true, easing: "ease-in-out", offset: 100 });
  }, []);

  return null;
}
