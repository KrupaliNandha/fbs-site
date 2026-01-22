"use client";

import Navbar from "@/app/Components/Navbar";
import Footer from "@/app/Components/Footer";
import Image from "next/image";
import { useEffect } from "react";
import "aos/dist/aos.css";
import SmoothScroll from "@/app/Components/SmoothScroll";
import {
  Flag,
  RectangleVertical,
  ScrollText,
  Lightbulb,
  Tent,
  Store,
  PanelTop,
  MessageSquare,
  Type,
  Landmark,
  Signpost,
  Presentation,
  Truck,
  Car,
  Sticker,
  Plus,
} from "lucide-react";
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
      text: "Advertising Flags",
      Icon: TiBusinessCard,
    },
    {
      id: 2,
      text: "Banner Stands",
      Icon: FaRegNewspaper,
    },
    {
      id: 3,
      text: "Banner",
      Icon: ImFilesEmpty,
    },
    {
      id: 4,
      text: "Custom Neon LED",
      Icon: FaTshirt,
    },
    {
      id: 5,
      text: "Custom Event Tents",
      Icon: FaCalendarAlt,
    },
    {
      id: 6,
      text: "Canopy/Awning",
      Icon: FaSign,
    },
    {
      id: 7,
      text: "LED Light Box",
      Icon: RiBillLine,
    },
    {
      id: 8,
      text: "LED Message Board",
      Icon: RiBillLine,
    },
    {
      id: 9,
      text: "LED Channel Letters",
      Icon: FaRegFileImage,
    },
    {
      id: 10,
      text: "Advertising Flags",
      Icon: TiBusinessCard,
    },
    {
      id: 11,
      text: "Banner Stands",
      Icon: FaRegNewspaper,
    },
    {
      id: 12,
      text: "Banner",
      Icon: ImFilesEmpty,
    },
    {
      id: 13,
      text: "Custom Neon LED",
      Icon: FaTshirt,
    },
    {
      id: 14,
      text: "Custom Event Tents",
      Icon: FaCalendarAlt,
    },
    {
      id: 15,
      text: "Canopy/Awning",
      Icon: FaSign,
    },
    {
      id: 16,
      text: "LED Light Box",
      Icon: RiBillLine,
    },
    {
      id: 17,
      text: "LED Message Board",
      Icon: RiBillLine,
    },
    {
      id: 18,
      text: "LED Channel Letters",
      Icon: FaRegFileImage,
    },
  ];

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
                src="/Signage-hero.jpeg"
                alt="Printing Service"
                width={1000}
                height={500}
                className="w-130 h-100 md:w-145 md:h-150 object-fit relative justify-self-center lg:justify-start shadow-lg"
              />
            </div>

            {/* Hero Content */}
            <div className="flex h-full items-center justify-self-center text-center text-black px-4">
              <div data-aos="fade-left">
                <p className="mb-2 text-7xl font-semibold uppercase">Signage</p>
                <p className="mb-2 w-full text-xl">
                  Any business needs signage services since they are so
                  significant for bringing in consumers, enhancing brand
                  recognition, and conveying important messages.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section - 2 */}
        <section className="px-4 pt-10">
          <div className="bg-pink-700 p-5 text-white">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-center max-w-7xl mx-auto">
              <p data-aos="fade-right" className="text-4xl font-bold">
                Get your <br />
                <span className="text-black hover:text-yellow-400">
                  Business Signage
                </span>{" "}
                <br />
                in Best Price.
              </p>
              <div data-aos="fade-left" className="text-whit">
                <p className="text-md">
                  Businesses may stand out from the competition and leave a
                  positive impression on potential clients by using effective
                  signage. Our signage services are intended to assist
                  businesses in producing eye-catching, effective signage that
                  draws customers and raises brand awareness. A variety of sign
                  products, such as banners, decals, car wraps, and more, are
                  available from us. We will collaborate with you to design
                  signage that satisfies your unique requirements and advances
                  your commercial objectives.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section - 3 */}
        <section data-aos="zoom-in" className="px-4 pt-10">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
                    </div>
                  </div>

                  {/* Text Content */}
                </div>
              );
            })}
          </div>
        </section>


        {/* Section - 4 */}
        <section>
          
        </section>

        <Footer />
      </SmoothScroll>
    </>
  );
}
