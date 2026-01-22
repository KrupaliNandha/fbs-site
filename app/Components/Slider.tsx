"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

export default function Slider() {
  const sliderRef = useRef<HTMLDivElement>(null);

  const sliders = [
    "/Buffalo-Wild-Wings.png",
    "/CD-one-price.png",
    "/City-bird-tenders.png",
    "/Cricket-wireless.png",
    "/Currito.png",
    "/Daves-Hot-Chicken.png",
    "/Dunkins.png",
    "/Holiday-inn-a.png",
    "/Jimmy-johns-N.png",
    "/MCALISTER.png",
    "/Motel-6-a.png",
    "/Papa-johns.png",
    "/Popayes.png",
    "/rosattis.png",
    "/Subway.png",
    "/Wingstop.png",
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
    <div data-aos="fade-up" className="w-full overflow-hidden pt-10 px-4">
      <div>
        <h1 className="text-5xl font-bold text-center">Trusted by Leading Brands</h1>
      </div>
      <div
        ref={sliderRef}
        className="flex gap-40 overflow-x-hidden whitespace-nowrap pt-10"
      >
        {/* duplicate images for seamless loop */}
        {[...sliders, ...sliders, ...sliders].map((src, index) => (
          <div key={index} className="min-w-[200px] flex justify-center">
            <Image
              src={src}
              alt="brand logo"
              width={200}
              height={100}
              className="object-contain"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
