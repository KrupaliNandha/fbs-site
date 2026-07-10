"use client";

import { useRef } from "react";
import { FaRocket, FaRegCalendarAlt, FaWallet } from "react-icons/fa";
import { useCountUpOnView } from "@/app/hooks/useCountUpOnView";

export default function HomeStats() {
  const ref = useRef<HTMLDivElement>(null);
  const projects = useCountUpOnView(ref, 150, 1500, true);
  const experience = useCountUpOnView(ref, 25, 1000, true);
  const funding = useCountUpOnView(ref, 20, 1000, true);

  return (
    <div
      ref={ref}
      data-aos="fade-left"
      className="relative flex justify-center mt-10 lg:mt-0"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 lg:gap-8">
        <div className="flex justify-center items-center">
          <div className="bg-white w-52 h-52 sm:w-60 sm:h-60 rounded-2xl flex flex-col items-center justify-center shadow-lg">
            <FaRocket className="text-primary text-4xl mb-4" />
            <h2 className="text-4xl font-bold text-primary-dark">
              {projects || 150}+
            </h2>
            <p className="mt-2 text-primary-dark/60 text-sm sm:text-base">
              Projects Done
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-6 items-center lg:items-start">
          <div className="bg-white w-52 h-52 sm:w-60 sm:h-60 rounded-2xl flex flex-col items-center justify-center shadow-lg">
            <FaRegCalendarAlt className="text-primary text-4xl mb-4" />
            <h2 className="text-4xl font-bold text-primary-dark">
              {experience || 25}
            </h2>
            <p className="mt-2 text-primary-dark/60 text-sm sm:text-base">
              Years of experience
            </p>
          </div>

          <div className="bg-white w-52 h-52 sm:w-60 sm:h-60 rounded-2xl flex flex-col items-center justify-center shadow-lg">
            <FaWallet className="text-primary text-4xl mb-4" />
            <h2 className="text-4xl font-bold text-primary-dark">
              {funding || 20}M
            </h2>
            <p className="mt-2 text-primary-dark/60 text-sm sm:text-base">
              Total Funding
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
