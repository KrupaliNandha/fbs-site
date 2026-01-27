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
                  DIRECT <span className="text-pink-700">MAILING</span>
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
        <section className="bg-white container section-padding">
          <div className=" mx-auto px-6 space-y-5">
            {/* SECTION HEADING */}
            <div className="text-center max-w-4xl mx-auto space-y-6">
              <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900">
                We Offer <span className="bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">3 Levels</span> of
                Services
              </h2>

              <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
                Beyond direct mail campaigns, we combine email marketing and
                digital advertising to create a complete strategy that saves
                time, reduces cost, and ensures top-quality results.
              </p>
            </div>

            {/* LEVEL 1 – DESIGN & PRINT */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
              <div className="bg-gradient-to-br from-yellow-400 to-yellow-300 rounded-3xl p-10 shadow-xl hover:scale-105 transition-transform duration-300">
                <h3 className="text-3xl md:text-4xl font-bold text-gray-900 text-center">
                  FBS Handles Design & Print Only
                </h3>

                <p className="mt-6 text-lg text-gray-800 leading-relaxed text-center">
                  We provide other services like email marketing and digital
                  advertising in addition to developing and implementing direct
                  mail campaigns, which may be combined with direct mail to form
                  a full marketing strategy. Businesses who work with us stand
                  to gain a number of advantages. One benefit is that hiring
                  industry professionals to handle the design and mailing
                  processes can save time and money. Additionally, it can
                  guarantee that the mailing campaign is of the greatest caliber
                  and complies with all relevant requirements.
                </p>
              </div>

              <Image
                src="/Section-1-About-2.jpg"
                alt="Design & Print"
                width={600}
                height={500}
                className="rounded-3xl shadow-xl h-full w-full object-cover"
              />
            </div>

            {/* LEVEL 2 – PRINTING, PAPERWORK & BUNDLING */}
            <div className="pt-5">
              <div className="text-center max-w-3xl mx-auto space-y-6">
                <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900">
                  Printing, <span className="bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">Paperwork </span>  & Bundling
                </h2>

                <div className="flex justify-center">
                  <span className="h-1 w-20 bg-pink-600 rounded-full"></span>
                </div>

                <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
                  We design your printing materials, guide you through USPS EDDM
                  registration, and deliver perfectly formatted EDDM print jobs
                  — all handled by FBS.
                </p>
              </div>
            </div>

            {/* SERVICES GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 max-w-7xl mx-auto pt-5">
              {services.map((item, index) => (
                <div
                  key={index}
                  className="bg-white rounded-3xl p-8 shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border-2 border-gray-200"
                >
                  <div className="w-16 h-16 bg-pink-50 rounded-xl  flex items-center justify-self-center justify-center mx-auto">
                    <Image
                      src={item.image}
                      alt="Service Icon"
                      width={32}
                      height={32}
                    />
                  </div>

                  <p className="mt-6 text-gray-700 text-lg leading-relaxed text-center">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>

            {/* LEVEL 3 – FULL SERVICE */}
            <div className="pt-5">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <Image
                  src="/service-3.1.jpeg"
                  alt="Full Service"
                  width={1400}
                  height={700}
                  className="w-full h-[600px] object-cover"
                />

                <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>

                <div className="absolute inset-0 flex items-center justify-center px-6">
                  <div className="max-w-5xl text-center space-y-6">
                    <h2 className="text-3xl md:text-5xl font-extrabold text-white">
                      From Design to Your Customer’s Mailbox
                    </h2>

                    <div className="bg-white/10 backdrop-blur-lg border border-white/50 rounded-3xl p-8">
                      <p className="text-white text-lg md:text-xl leading-relaxed">
                        With the launch of EDDM in 2011, FBS has been involved.
                        We have a thorough understanding of the programme and
                        have mailed millions of items throughout the country.
                        Our approach offers a remarkable return on your
                        investment and is inexpensive. Do you desire more
                        clients? FBS can assist you! The most effective direct
                        mail item for restaurants is their menu. For several of
                        our customers, mailing menus has helped increase sales
                        by a factor of two, three, even four. Every year, we
                        print and mail millions of menus, so we are well aware
                        of your requirements for success.
                      </p>
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
