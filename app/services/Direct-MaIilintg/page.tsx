"use client";

import Navbar from "@/app/Components/Navbar";
import Footer from "@/app/Components/Footer";
import Image from "next/image";
import { useEffect } from "react";
import "aos/dist/aos.css";
import SmoothScroll from "@/app/Components/SmoothScroll";

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
                src="/About.jpg"
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
                  About US
                </p>
                <p className="mb-2 w-full text-xl">
                  Our first priority is to satisfy our customers. We value the
                  time and money of our clients and work for their business. If
                  you place your trust in us, you will undoubtedly be able to
                  verify that our assertion that consumers come first is true.
                  Our clients get to experience a hassle free, consistent, top
                  quality, and best time saving services.
                </p>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </SmoothScroll>
    </>
  );
}
