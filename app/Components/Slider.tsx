"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

export default function Slider() {
  const sliderRef = useRef<HTMLDivElement>(null);

  const sliders = [
    { src: "/Buffalo-Wild-Wings.png", alt: "Buffalo Wild Wings logo" },
    { src: "/CD-one-price.png", alt: "CD One Price Cleaners logo" },
    { src: "/City-bird-tenders.png", alt: "City Bird Tenders logo" },
    { src: "/Cricket-wireless.png", alt: "Cricket Wireless logo" },
    { src: "/Currito.png", alt: "Currito logo" },
    { src: "/Daves-Hot-Chicken.png", alt: "Dave's Hot Chicken logo" },
    { src: "/Dunkins.png", alt: "Dunkin' logo" },
    { src: "/Holiday-inn-a.png", alt: "Holiday Inn logo" },
    { src: "/Jimmy-johns-N.png", alt: "Jimmy John's logo" },
    { src: "/MCALISTER.png", alt: "McAlister's logo" },
    { src: "/Motel-6-a.png", alt: "Motel 6 logo" },
    { src: "/Papa-johns.png", alt: "Papa Johns logo" },
    { src: "/Popayes.png", alt: "Popeyes logo" },
    { src: "/rosattis.png", alt: "Rosati's logo" },
    { src: "/Subway.png", alt: "Subway logo" },
    { src: "/Wingstop.png", alt: "Wingstop logo" },
  ];

  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    let animationId: number;

    const scroll = () => {
      slider.scrollLeft += 1;

      // Reset when end reached
      if (slider.scrollLeft >= slider.scrollWidth - slider.clientWidth) {
        slider.scrollLeft = 0;
      }

      animationId = requestAnimationFrame(scroll);
    };

    animationId = requestAnimationFrame(scroll);

    return () => cancelAnimationFrame(animationId);
  }, []);

  return (
    <div
      data-aos="fade-up"
      className="w-full overflow-hidden py-20"
    >
      <div>
        <h2 className="text-4xl md:text-5xl font-bold text-center text-primary">
          Trusted{" "}
          <span className="bg-linear-to-r from-primary to-primary-dark bg-clip-text text-transparent">
            by Leading
          </span>{" "}
          Brands
        </h2>
        <div
          ref={sliderRef}
          className="flex gap-40 overflow-x-hidden whitespace-nowrap pt-10"
        >
          {/* duplicate images for seamless loop */}
          {[...sliders, ...sliders, ...sliders].map((item, index) => (
            <div
              key={`${item.src}-${index}`}
              className="min-w-50 flex justify-center mt-20"
            >
              <Image
                src={item.src}
                alt={item.alt}
                width={200}
                height={100}
                className="object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
