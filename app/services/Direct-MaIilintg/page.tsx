"use client";

import Navbar from "@/app/Components/Navbar";
import Footer from "@/app/Components/Footer";
import Image from "next/image";
import { useEffect } from "react";
import "aos/dist/aos.css";
import SmoothScroll from "@/app/Components/SmoothScroll";

import { FaUsers } from "react-icons/fa";
import { IoPrintSharp } from "react-icons/io5";
import { IoIosSettings } from "react-icons/io";
import { MdMailOutline } from "react-icons/md";

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

  const services = [
    {
      description: "Designing for Piece",
      image: "/icons/group.png",
    },
    {
      description: "Printing Your Piece",
      image: "/icons/printing.png",
    },
    {
      description:
        "Working with you closely to help you select the carrier routes you want to target.",
      image: "/icons/setting.png",
    },
    {
      description: "Bundling the pieces in the required stacks",
      image: "/icons/Mail bundle.png",
    },
    {
      description:
        "Printing out and organize the facing slips and postal documents needed to present at the local branch.",
      image: "/icons/browser.png",
    },
    {
      description:
        "Boxing and organizing the appropriate number of bundles with the right paperwork.",
      image: "/icons/paper work.png",
    },
    {
      description:
        "Identify which local post office each box/carrier route you need to deliver these pieces to.",
      image: "/icons/browser.png",
    },
    {
      description:
        "Ship you the boxes to be taken to the post office any time you desire.",
      image: "/icons/delivery-truck.png",
    },
    {
      description: "Bundling",
      image: "/icons/credit-card.png",
    },
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
                  DIRECT MAILING
                </p>

                <p className="mt-5 text-gray-600 text-sm sm:text-base leading-relaxed max-w-md">
                  Reach your audience faster with our professional direct
                  mailing services. From designing and printing to addressing
                  and delivery, we handle the entire process to ensure your
                  message lands directly in the hands of your customers - on
                  time, every time.
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
                  Design, Printed & Mailed
                  <br />
                  <span className="text-black hover:text-yellow-300">
                    All under one roof
                  </span>
                </h2>
              </div>

              {/* Right Content */}
              <div data-aos="fade-left">
                <p className="text-base md:text-lg text-pink-100 leading-relaxed">
                  Our clients appreciate the fact that we handle every aspect of
                  their print and direct mail marketing campaigns under one
                  roof. We provide direct mailing assistance with a focus on
                  designing and implementing direct mail campaigns for companies
                  of all sizes.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section - 3 */}
        <section className="container">
          <div>
            <h2 className="text-5xl font-bold text-center mb-8">
              We Offer <span className="text-pink-700">3 Level</span> of
              Services
            </h2>
            <p className="text-xl text-center font-semibold max-w-5xl mx-auto">
              We provide other services like email marketing and digital
              advertising in addition to developing and implementing direct mail
              campaigns, which may be combined with direct mail to form a full
              marketing strategy. Businesses who work with us stand to gain a
              number of advantages. One benefit is that hiring industry
              professionals to handle the design and mailing processes can save
              time and money. Additionally, it can guarantee that the mailing
              campaign is of the greatest caliber and complies with all relevant
              requirements.
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 pt-5 gap-5 lg:gap-10  max-w-7xl mx-auto">
            <div className="bg-yellow-400 p-5 rounded-xl justify-center items-center my-auto">
              <p className="text-center text-4xl lg:text-5xl font-semibold">
                FBS Handles Design & Print Only
              </p>
              <p className="text-center text-xl pt-5 max-w-5xl justify-center mx-auto">
                We provide other services like email marketing and digital
                advertising in addition to developing and implementing direct
                mail campaigns, which may be combined with direct mail to form a
                full marketing strategy. Businesses who work with us stand to
                gain a number of advantages. One benefit is that hiring industry
                professionals to handle the design and mailing processes can
                save time and money. Additionally, it can guarantee that the
                mailing campaign is of the greatest caliber and complies with
                all relevant requirements.
              </p>
            </div>
            <div>
              <Image
                src="/Section-1-About-2.jpg"
                alt="fbhbh"
                height={500}
                width={500}
                className="w-full h-full rounded-xl my-auto"
              />
            </div>
          </div>

          <div className="flex flex-col lg:flex-row pt-10 gap-10">
            <div className="my-auto justify-center item-center">
              <h2 className="text-center text-3xl font-semibold">
                FBS handles Printing, Paperwork & Bundling
              </h2>
              <div className="pt-3">
                <div className="h-1 w-14 bg-pink-700 rounded-full -mb-1 justify-center items-center mx-auto"></div>
              </div>
              <p className="text-center text-xl pt-5 max-w-5xl justify-center mx-auto">
                We design your printing material Send you the EDDM printed
                material. You register for an account on USPS EDDM website. You
                do all of the above mentioned in option 1 on your own. In
                essence you are simply ordering a properly EDDM formatted print
                job from FBS.
              </p>
            </div>
            <div className="">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 ">
                {services.map((item, index) => (
                  <div key={index} className="mb-4 bg-gray-50 p-5">
                    {item.image && (
                      <div className="shrink-0">
                        <Image
                          src={item.image}
                          alt={"Service Icon"}
                          width={40}
                          height={40}
                          className="object-contain"
                        />
                      </div>
                    )}
                    <p className="text-xl max-w-4xl pt-3">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </SmoothScroll>
    </>
  );
}
