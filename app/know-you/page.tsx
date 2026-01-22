"use client";

import Navbar from "@/app/Components/Navbar";
import Footer from "@/app/Components/Footer";
import Image from "next/image";
import { useEffect } from "react";
import "aos/dist/aos.css";
import SmoothScroll from "@/app/Components/SmoothScroll";
import Slider from "../Components/Slider";
import { HiOutlineBuildingStorefront } from "react-icons/hi2";

/* ✅ NOT default */
function MapIcon({ top, left }: { top: string; left: string }) {
  return (
    <div
      className="absolute -translate-x-1/2 -translate-y-1/2 z-20"
      style={{ top, left }}
    >
      <div className="relative">
        {/* Pulse */}
        <span className="absolute inset-0 bg-pink-500 opacity-40 animate-ping"></span>

        {/* Icon */}
        <div className="relative w-10 h-10 bg-pink-600 flex items-center justify-center shadow-lg">
          <HiOutlineBuildingStorefront className="text-white text-lg" />
        </div>
      </div>
    </div>
  );
}

/* ✅ ONLY ONE default export */
export default function Page() {
  useEffect(() => {
    const initAOS = async () => {
      const AOS = (await import("aos")).default;
      AOS.init({
        duration: 1200,
        once: true,
        easing: "ease-in-out",
        offset: 100,
      });
    };

    initAOS();
  }, []);

  return (
    <>
      <Navbar />
      <SmoothScroll>
        {/* Section - 1 */}
        <section className="pt-10 px-4">
          <div className="grid lg:grid-cols-2 grid-cols-1 gap-4 place-items-center max-w-7xl mx-auto">
            {/* Hero Image */}
            <div className="w-full relative" data-aos="fade-right">
              <div className="w-70 h-50 top-105 right-89 xl:block hidden absolute border-2 rounded border-blue"></div>
              <div className="w-70 h-50 bottom-105 left-89 xl:block hidden absolute border-2 rounded border-blue"></div>

              <Image
                src="/Knowyouimg1.jpg"
                alt="Printing Service"
                width={500}
                height={500}
                className="w-130 h-100 md:w-145 md:h-150 object-fit relative justify-self-center lg:justify-start shadow-lg"
              />
            </div>

            {/* Hero Content */}
            <div className="flex h-full items-center justify-self-center text-center text-black px-4">
              <div data-aos="fade-left">
                <p className="mb-2 text-7xl font-semibold uppercase">
                  Know Your Signs
                </p>
                <p className="mb-2 w-full text-xl">
                  FBS Prints & Signs showcases an extensive collection of
                  business signage, awnings, and vehicle wraps we have designed
                  and installed for our clients. Our gallery is organized by
                  sign type, making it easy to browse options like channel
                  letters, LED displays, pylon signs, menu boards, and more.
                  You all also find behind-the-scenes photos highlighting the
                  sign-making process!
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section - 2 */}
        <section className="pt-10 px-4 overflow-x-hidden">
          <div className="relative">
            <Image
              src="/Scene-4-01.jpg"
              alt="City Map"
              width={1200}
              height={700}
              className="w-full h-[750px] lg:h-[700px] object-cover"
            />

            <MapIcon top="16%" left="14%" />
            <MapIcon top="28%" left="42%" />
            <MapIcon top="20%" left="72%" />
            <MapIcon top="30%" left="78%" />
            <MapIcon top="35%" left="55%" />
          </div>
        </section>

        <Slider />
        <Footer />
      </SmoothScroll>
    </>
  );
}
