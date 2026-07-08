"use client";

import Navbar from "@/app/Components/Navbar";
import Footer from "@/app/Components/Footer";
import Image from "next/image";
import { useEffect, useState } from "react";
import "aos/dist/aos.css";
import { TiBusinessCard } from "react-icons/ti";
import { ImFilesEmpty } from "react-icons/im";
import {
  FaTshirt,
  FaCalendarAlt,
  FaRegFileImage,
  FaRegNewspaper,
  FaSign,
} from "react-icons/fa";
import { RiBillLine } from "react-icons/ri";
import Link from "next/link";

export default function Page() {
  const [loaderDone, setLoaderDone] = useState(false);

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

  const steps = [
    {
      id: 1,
      text: "Business Card",
      pricedes: "Starting at $ 9.99",
      Icon: TiBusinessCard,
      slug: "business-cards"
    },
    {
      id: 2,
      text: "Brochures",
      pricedes: "Starting at $ 9.99",
      Icon: FaRegNewspaper,
      slug: "brochures"
    },
    {
      id: 3,
      text: "Copy services",
      pricedes: "Starting at $ 9.99",
      Icon: ImFilesEmpty,
      slug: "copy-services"
    },
    {
      id: 4,
      text: "T-shirt Prints",
      pricedes: "Starting at $ 9.99",
      Icon: FaTshirt,
      slug: "t-shirt-prints"
    },
    {
      id: 5,
      text: "Calendars",
      pricedes: "Starting at $ 9.99",
      Icon: FaCalendarAlt,
      slug: "calendars"
    },
    {
      id: 6,
      text: "Banners",
      pricedes: "Starting at $ 9.99",
      Icon: FaSign,
      slug: "banners"
    },
    {
      id: 7,
      text: "Carbonless Forms",
      pricedes: "Starting at $ 9.99",
      Icon: RiBillLine,
      slug: "carbonless-forms"
    },
    {
      id: 8,
      text: "Carryout Menus",
      pricedes: "Starting at $ 9.99",
      Icon: RiBillLine,
      slug: "carryout-menus"
    },
    {
      id: 9,
      text: "Canvas",
      pricedes: "Starting at $ 9.99",
      Icon: FaRegFileImage,
      slug: "canvas"
    },
  ];

  return (
    <>
      <Navbar />
      <main>
        {/* Section - 1 */}
        <section className="bg-gradient-to-br mt-24 xl:mt-20 from-gray-50 to-blue-50">
          <div className="container">
            <div className="mx-auto">
              <p className="text-gray-600 text-lg">
                <Link href="/" className="text-pink-600">
                  Home
                </Link>
                <span className="mx-2">&gt;</span>
                <span className="text-gray-800 font-semibold">
                  Printing Services
                </span>
              </p>
              <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                {/* LEFT CONTENT – FIXED */}
                <div
                  data-aos="fade-right"
                  className="flex flex-col justify-center text-center lg:text-left space-y-5"
                >
                  {/* Heading */}
                  <h1
                    className="font-semibold text-gray-950 leading-tight tracking-tight
    text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl"
                  >
                    Printing
                    <span className="text-pink-600"> Products</span>
                  </h1>

                  {/* Description */}
                  <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto lg:mx-0">
                    We offer a comprehensive range of printing services for
                    products like business cards, brochures, flyers, posters,
                    and more. To ensure that your printed items are of the
                    greatest caliber, we use the most up-to-date printing
                    technology and premium materials. From design to finished
                    product, our team of qualified experts will collaborate with
                    you to make sure your project is finished to your
                    satisfaction.
                  </p>
                </div>

                {/* Right Content - Image Grid */}
                <div className="relative">
                  {/* Decorative circles */}
                  <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-100 rounded-full opacity-50 blur-2xl"></div>
                  <div className="absolute bottom-20 -left-10 w-60 h-60 bg-pink-100 rounded-full opacity-50 blur-3xl"></div>
                  <div className="absolute top-32 right-10 w-32 h-32 bg-purple-100 rounded-full opacity-50 blur-2xl"></div>

                  {/* Image grid */}
                  <div className="relative grid grid-cols-3 sm:grid-cols-3 gap-3 sm:gap-4">
                    {/* Column 1 */}
                    <div className="col-span-1 space-y-4 sm:space-y-6 sm:mt-16">
                      <div className="rounded-2xl aspect-square overflow-hidden relative float-1">
                        <Image
                          src="/images/shared/printing-materials-showcase.webp"
                          alt="Printed brochures and materials"
                          fill
                          className="object-cover"
                        />
                      </div>
                    </div>

                    {/* Column 2 (Center) */}
                    <div className="col-span-1 space-y-4 sm:space-y-6 sm:mt-40">
                      <div className="rounded-2xl aspect-square overflow-hidden relative float-2">
                        <Image
                          src="/images/services/printing/hotel-menu-printing.webp"
                          alt="Printed hotel menu"
                          fill
                          className="object-fix"
                        />
                      </div>
                    </div>

                    {/* Column 3 – hidden on mobile */}
                    <div className="col-span-1 space-y-6 sm:mt-16 ">
                      <div className="rounded-2xl aspect-square overflow-hidden relative float-1">
                        <Image
                          src="/images/services/printing/custom-calendar-printing.webp"
                          alt="Custom printed calendar"
                          fill
                          className="object-cover"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section - 2 */}
        <section className="container section-padding">
          <div className="bg-[#EC3392] rounded-2xl px-6 py-12 text-white">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center max-w-7xl mx-auto">
              {/* Left Content */}
              <div data-aos="fade-right">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight text-center lg:text-start">
                  Get your
                  <br />
                  <span className="text-black hover:text-yellow-300">
                    Printing Product
                  </span>
                  <br />
                  in Best Price.
                </h2>
              </div>

              {/* Right Content */}
              <div data-aos="fade-left">
                <p className="text-base md:text-lg text-pink-100 leading-relaxed text-center lg:text-start">
                  We offer a complete range of printing solutions to meet every
                  need – from business cards, brochures, and banners to t-shirt
                  prints, calendars, and custom canvas. Whether it’s carryout
                  menus, carbonless forms, or simple copy services, our prints
                  are sharp, vibrant, and tailored to your vision, ensuring your
                  brand stands out everywhere.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section - 3 */}
        <section data-aos="zoom-in" className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {steps.map((item) => {
              const Icon = item.Icon;

              return (
                <Link
                  key={item.id}
                  href={`/services/printing-products/${item.slug}`}
                >
                  <div

                    className="
                    group flex h-[220px] bg-gray-200
                    rounded-2xl items-center justify-center
                    overflow-hidden cursor-pointer
                    border-4 border-transparent
                    hover:border-yellow-400
                    transition-all duration-300
                  "
                  >
                    {/* Icon Center */}
                    <div className="item-center justify-center">
                      {Icon && (
                        <Icon
                          className="
                          w-15 h-15
                          transition-transform duration-300
                          group-hover:-rotate-15 justify-self-center text-pink-700
                        "
                        />
                      )}
                      <div className="text-center">
                        <h3 className="text-3xl text-black font-semibold">
                          {item.text}
                        </h3>
                        <p className="mt-2 text-black">{item.pricedes}</p>
                      </div>
                    </div>

                    {/* Text Content */}
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Section - 4 */}
        <section className="container section-padding">
          <div className="max-w-6xl mx-auto px-6">
            {/* Heading */}
            <div className="text-center mb-10">
              <h2 className="text-5xl font-bold text-pink-700">
                What{" "}
                <span className="bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                  {" "}
                  We
                </span>{" "}
                Print
              </h2>
              <p className="text-gray-500 mt-3 text-xl">
                Every project is different, and we at our organization work
                closely with our clients to make sure we match their particular
                demands and specifications. Graphic design, big format printing,
                car wraps, and other services are among the many printing and
                signage solutions we provide. We have the knowledge and
                experience to complete any task, whether it’s a straightforward
                banner or a complicated advertising campaign.
              </p>
            </div>

            {/* Services */}
            <div className="grid md:grid-cols-2 gap-x-14 gap-y-6">
              {steps.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 border-b pb-4 group hover:translate-x-2 transition-all duration-300"
                >
                  <div className="w-11 h-11 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center">
                    {item.Icon && <item.Icon className="w-5 h-5" />}
                  </div>

                  <h4 className="text-lg font-semibold text-gray-800 group-hover:text-pink-600">
                    {item.text}
                  </h4>
                </div>
              ))}
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
