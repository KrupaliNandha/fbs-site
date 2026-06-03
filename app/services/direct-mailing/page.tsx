"use client";

import Navbar from "@/app/Components/Navbar";
import Footer from "@/app/Components/Footer";
import Image from "next/image";
import { useEffect, useState } from "react";
import "aos/dist/aos.css";
import SmoothScroll from "@/app/Components/SmoothScroll";

import PageLoader from "../../Components/Preloader";
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
      description: "Target Your Routes",
      image: "/icons/settings.png",
    },
    {
      description: "Bundling the pieces in the required stacks",
      image: "/icons/mail-bundle.png",
    },
    {
      description:
        "Printing out and organize the facing slips and postal documents needed to present at the local branch.",
      image: "/icons/browser.png",
    },
    {
      description:
        "Boxing and organizing the appropriate number of bundles with the right paperwork.",
      image: "/icons/paperwork.png",
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
      {!loaderDone && <PageLoader onFinish={() => setLoaderDone(true)} />}

      <Navbar />
      <SmoothScroll>
        <main>
        {/* Section - 1 */}
        <section className="bg-gradient-to-br from-gray-50 to-blue-50">
          <div className="container">
            <div className="mx-auto">
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
                    Direct
                    <span className="text-pink-600"> Mailing</span>
                  </h1>

                  <p className="text-gray-600 text-lg">
                    <Link href="/" className="text-pink-600 hover:underline">
                      Home
                    </Link>
                    <span className="mx-2">&gt;</span>
                    <Link href="" className="text-pink-600">
                      Services
                    </Link>
                    <span className="mx-2">&gt;</span>
                    <span className="text-gray-800 font-semibold">
                      Direct Mailing
                    </span>
                  </p>
                  {/* Description */}
                  <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto lg:mx-0">
                    Reach your audience faster with our professional direct
                    mailing services. From designing and printing to addressing
                    and delivery, we handle the entire process to ensure your
                    message lands directly in the hands of your customers - on
                    time, every time.
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
                          src="/images/services/direct-mail/direct-mail-marketing.webp"
                          alt="Direct mail campaign materials"
                          fill
                          className="object-cover"
                        />
                      </div>
                    </div>

                    {/* Column 2 (Center) */}
                    <div className="col-span-1 space-y-4 sm:space-y-6 sm:mt-40">
                      <div className="rounded-2xl aspect-square overflow-hidden relative float-2">
                        <Image
                          src="/images/services/direct-mail/mailing-documentation.webp"
                          alt="Mailing documentation"
                          fill
                          className="object-fix"
                        />
                      </div>
                    </div>

                    {/* Column 3 – hidden on mobile */}
                    <div className="col-span-1 space-y-6 sm:mt-16 ">
                      <div className="rounded-2xl aspect-square overflow-hidden relative float-1">
                        <Image
                          src="/images/services/direct-mail/print-design-example.webp"
                          alt="Printed direct mail design"
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
          <div className="bg-gradient-to-r from-pink-600 to-pink-700 rounded-2xl px-6 py-12 text-white">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center max-w-7xl mx-auto">
              {/* Left Content */}
              <div data-aos="fade-right">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight text-center lg:text-start">
                  Design, Printed & Mailed
                  <br />
                  <span className="text-black hover:text-yellow-300">
                    All under one roof
                  </span>
                </h2>
              </div>

              {/* Right Content */}
              <div data-aos="fade-left">
                <p className="text-base md:text-lg text-pink-100 leading-relaxed text-center lg:text-start">
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
        <section className="container relative section-padding">
          {/* Background */}
          <div className="absolute inset-0 -z-10 bg-gradient-to-br from-pink-50 via-white to-purple-50" />

          <div className=" px-6">
            {/* Heading for the whole section */}
            <div className="text-center max-w-3xl mx-auto mb-16 space-y-5 lg:text-left lg:max-w-none lg:flex lg:flex-col lg:items-center">
              <span className="inline-block px-5 py-1 rounded-full bg-pink-100 text-pink-700 text-2xl font-semibold">
                Our Services
              </span>
            </div>

            {/* Main layout */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr_1fr] gap-8 items-start max-w-7xl mx-auto">
              {/* LEFT CARD – LEVEL 1 */}
              <div className="bg-white rounded-3xl p-6 shadow-lg hover:shadow-2xl transition">
                <h3 className="text-3xl font-bold mt-3 text-center">
                  Design & Print
                </h3>
                <p className="text-gray-600 mt-2 text-xl text-center">
                  Professional design with premium-quality printing handled by
                  FBS.
                </p>
                <Image
                  src="/images/shared/printing-materials-showcase.webp"
                  alt="Direct mail design and print preparation"
                  width={300}
                  height={200}
                  className="rounded-xl mt-4 object-cover justify-self-center lg:justify-self-start"
                />
              </div>

              {/* CENTER CONTENT + SHORT CARD – LEVEL 2 */}
              <div className="flex flex-col items-center text-center space-y-6">
                {/* Section content above card */}
                <div className="text-center max-w-3xl mx-auto mb-16 space-y-5 lg:text-left lg:max-w-none lg:flex lg:flex-col lg:items-center">
                  <h2 className="text-4xl md:text-5xl font-extrabold">
                    3 Levels of{" "}
                    <span className="bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                      Service
                    </span>
                  </h2>

                  <p className="text-lg text-gray-600 max-w-xl mt-2">
                    Choose the service level that fits your business goals.
                  </p>
                </div>
                {/* Short Level 2 card */}
                <div className="relative w-full max-w-full rounded-3xl overflow-hidden shadow-2xl">
                  <Image
                    src="/images/services/direct-mail/full-service-direct-mail.webp"
                    alt="Full-service direct mail production support"
                    width={300}
                    height={200}
                    className="w-full h-50 object-cover "
                  />

                  {/* Content overlay */}
                  <div className="absolute inset-0 bg-black/40 flex flex-col justify-end p-4">
                    <h3 className="text-2xl md:text-3xl font-extrabold text-white">
                      Printing & Bundling
                    </h3>
                    <div className="grid grid-cols-3 gap-5 mt-6">
                      {services.slice(0, 3).map((item, i) => (
                        <div
                          key={i}
                          className="bg-pink-50 rounded-xl p-4 flex justify-center"
                        >
                          <Image
                            src={item.image}
                            alt={item.description}
                            width={20}
                            height={20}
                            className="w-8 h-8 object-cover "
                          />
                          <p className="text-md font-medium text-gray-800">
                            {item.description || "Description"}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT CARD – LEVEL 3 */}
              <div className="bg-white rounded-3xl p-6 shadow-lg hover:shadow-2xl transition">
                <h3 className="text-3xl font-bold mt-3 text-center">
                  Full Service
                </h3>
                <p className="text-gray-600 mt-2 text-xl text-center">
                  End-to-end EDDM execution   from design to your customer’s
                  mailbox.
                </p>
                <Image
                  src="/images/services/direct-mail/full-service-direct-mail.webp"
                  alt="Direct mail campaign workflow and production support"
                  width={300}
                  height={200}
                  className="rounded-xl mt-4 object-cover justify-self-center lg:justify-self-start"
                />
              </div>
            </div>
          </div>
        </section>

        </main>
        <Footer />
      </SmoothScroll>
    </>
  );
}
