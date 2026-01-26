"use client";

import Navbar from "@/app/Components/Navbar";
import Footer from "@/app/Components/Footer";
import Image from "next/image";
import { useEffect } from "react";
import "aos/dist/aos.css";
import SmoothScroll from "@/app/Components/SmoothScroll";
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

  const steps = [
    {
      id: 1,
      text: "Business Card",
      pricedes: "Starting at $ 9.99",
      Icon: TiBusinessCard,
    },
    {
      id: 2,
      text: "Brochures",
      pricedes: "Starting at $ 9.99",
      Icon: FaRegNewspaper,
    },
    {
      id: 3,
      text: "Copy services",
      pricedes: "Starting at $ 9.99",
      Icon: ImFilesEmpty,
    },
    {
      id: 4,
      text: "T-shirt Prints",
      pricedes: "Starting at $ 9.99",
      Icon: FaTshirt,
    },
    {
      id: 5,
      text: "Calendars",
      pricedes: "Starting at $ 9.99",
      Icon: FaCalendarAlt,
    },
    {
      id: 6,
      text: "Banners",
      pricedes: "Starting at $ 9.99",
      Icon: FaSign,
    },
    {
      id: 7,
      text: "Carbonless Forms",
      pricedes: "Starting at $ 9.99",
      Icon: RiBillLine,
    },
    {
      id: 8,
      text: "Carryout Menus",
      pricedes: "Starting at $ 9.99",
      Icon: RiBillLine,
    },
    {
      id: 9,
      text: "Canvas",
      pricedes: "Starting at $ 9.99",
      Icon: FaRegFileImage,
    },
  ];

  const services = [
    { icon: <TiBusinessCard />, label: "Business Card" },
    { icon: <FaRegNewspaper />, label: "Brochures" },
    { icon: <ImFilesEmpty />, label: "Copy services" },
    { icon: <FaTshirt />, label: "T-shirt Prints" },
    { icon: <FaCalendarAlt />, label: "Calendars" },
    { icon: <FaSign />, label: "Banners" },
    { icon: <RiBillLine />, label: "Carbonless Forms" },
    { icon: <RiBillLine />, label: "Carryout Menus" },
    { icon: <FaRegFileImage />, label: "Canvas" },
  ];

  return (
    <>
      <Navbar />
      <SmoothScroll>
        {/* Section - 1 */}
        <section className="container mx-auto px-4 pt-14">
          <div className="relative bg-white rounded-[32px] shadow-xl overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2 items-center">
              {/* LEFT CONTENT */}
              <div
                data-aos="fade-right"
                className=" relative z-10 bg-white border-l-4 border-pink-600 p-5 sm:p-5 md:p-5 lg:p-8 lg:ml-14 lg:-mr-24 rounded-b-[32px] lg:rounded-2xl shadow-lg order-2 lg:order-1"
              >
                <div className="h-1 w-14 bg-pink-600 rounded-full mb-5"></div>

                <p className="mt-5 text-gray-600 font-bold text-4xl md:text-5xl lg:text-6xl text-center lg:text-start">
                  Printing
                  <span className="text-pink-600">Products</span>
                </p>

                <p className="mt-5 text-gray-600 text-sm sm:text-base leading-relaxed max-w-md">
                  We offer a comprehensive range of printing services for
                  products like business cards, brochures, flyers, posters, and
                  more. To ensure that your printed items are of the greatest
                  caliber, we use the most up-to-date printing technology and
                  premium materials. From design to finished product, our team
                  of qualified experts will collaborate with you to make sure
                  your project is finished to your satisfaction.
                </p>
              </div>

              {/* RIGHT IMAGE */}
              <div
                data-aos="fade-left"
                className="
          relative h-[300px] sm:h-[400px] md:h-[480px] lg:h-[560px]
          order-1 lg:order-2
        "
              >
                <Image
                  src="/Section-1-About-2.jpg"
                  alt="Printing Service"
                  fill
                  priority
                  className="object-cover rounded-t-[32px] lg:rounded-r-[32px] lg:rounded-t-none"
                />

                <div className="absolute inset-0 rounded-t-[32px] lg:rounded-r-[32px] lg:rounded-t-none bg-gradient-to-l from-black/50 to-transparent"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Section - 2 */}
        <section className="container section-padding">
          <div className="bg-gradient-to-r from-pink-600 to-pink-700 rounded-2xl px-6 py-12 text-white">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center max-w-7xl mx-auto">
              {/* Left Content */}
              <div data-aos="fade-right">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
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
                <p className="text-base md:text-lg text-pink-100 leading-relaxed">
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
                <div
                  key={item.id}
                  className="
            group hidden lg:flex h-[220px] bg-gray-200
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
              );
            })}
          </div>
        </section>

        {/* Section - 4 */}
        <section className="px-4 pt-10">
          <div className="bg-black">
            <div data-aos="fade-up" className="max-w-7xl mx-auto  p-5">
              <p className="text-5xl text-center text-white font-bold">
                What We Print
              </p>
              <p className="text-xl text-center text-white pt-3">
                Every project is different, and we at our organization work
                closely with our clients to make sure we match their particular
                demands and specifications. Graphic design, big format printing,
                car wraps, and other services are among the many printing and
                signage solutions we provide. We have the knowledge and
                experience to complete any task, whether it’s a straightforward
                banner or a complicated advertising campaign.
              </p>
              <div data-aos="fade-up" className="pt-5">
                <div className="flex justify-center">
                  {/* CARD */}
                  <div className="flex justify-center">
                    <div className="w-full max-w-4xl bg-white shadow-2xl rounded-xl p-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                        {services.map((service, index) => (
                          <div
                            key={index}
                            className="group flex flex-col items-center justify-center gap-3
                     p-6 rounded-lg cursor-pointer
                     hover:bg-gray-100 transition duration-300"
                          >
                            <span className="text-3xl text-pink-700 group-hover:scale-110 transition">
                              {service.icon}
                            </span>

                            <span className="font-medium text-gray-800 text-center">
                              {service.label}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </SmoothScroll>
    </>
  );
}
