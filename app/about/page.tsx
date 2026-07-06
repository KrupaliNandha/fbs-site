"use client";

import Navbar from "@/app/Components/Navbar";
import Footer from "@/app/Components/Footer";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import "aos/dist/aos.css";
import SmoothScroll from "@/app/Components/SmoothScroll";
import Slider from "../Components/Slider";
import PageLoader from "../Components/Preloader";
import {
  FaPrint,
  FaSign,
  FaMapSigns,
  FaUmbrella,
  FaMailBulk,
  FaGlobe,
  FaSearch,
  FaMobileAlt,
} from "react-icons/fa";

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
    { icon: <FaPrint />, label: "Printing Products" },
    { icon: <FaSign />, label: "Signage" },
    { icon: <FaMapSigns />, label: "Wall & Street Signs" },
    { icon: <FaUmbrella />, label: "Awning & Canopy" },
    { icon: <FaMailBulk />, label: "Direct Mailing" },
    { icon: <FaGlobe />, label: "Web Designing" },
    { icon: <FaSearch />, label: "SEO" },
    { icon: <FaMobileAlt />, label: "Mobile Apps" },
  ];

  const workcard = [
    {
      id: 1,
      title: "Book a Call",
      details:
        "This process typically starts with a consultation meeting with our customer to understand the business needs, goals,requirements, and target audience.",
    },
    {
      id: 2,
      title: "Confirm Service",
      details:
        "  The customer then selects a service from our range of facilities such as printing, direct mailing, signage and web designing services.",
    },
    {
      id: 3,
      title: "Boost your Sales",
      details:
        " Our team starts working on services confirmed by client and provide an ongoing support to make sure that we meet client needs & expectations",
    },
  ];

  return (
    <>
      {!loaderDone && <PageLoader onFinish={() => setLoaderDone(true)} />}
      <Navbar />
      <SmoothScroll>
        <main>
        {/* Section - 1 */}
        <section className="bg-gradient-to-br mt-24 xl:mt-20 from-gray-50 to-blue-50">
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
                    About
                    <span className="text-pink-600"> us</span>
                  </h1>

                  <p className="text-gray-600">
                    <Link href="/" className="text-pink-600 hover:underline text-lg">
                      Home
                    </Link>
                    <span className="mx-2 text-lg">&gt;</span>
                    <Link
                      href="/about"
                      className="text-gray-800 hover:underline text-lg"
                    >
                      About us
                    </Link>
                  </p>

                  {/* Description */}
                  <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto lg:mx-0">
                    Our first priority is to satisfy our customers. We value the
                    time and money of our clients and work for their business.
                    If you place your trust in us, you will undoubtedly be able
                    to verify that our assertion that consumers come first is
                    true. Our clients get to experience a hassle free,
                    consistent, top quality, and best time saving services.
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
                          alt="Printed marketing materials"
                          fill
                          className="object-cover"
                        />
                      </div>
                    </div>

                    {/* Column 2 (Center) */}
                    <div className="col-span-1 space-y-4 sm:space-y-6 sm:mt-40">
                      <div className="rounded-2xl aspect-square overflow-hidden relative float-2">
                        <Image
                          src="/images/shared/website-design-showcase.webp"
                          alt="Digital design showcase"
                          fill
                          className="object-cover"
                        />
                      </div>
                    </div>

                    {/* Column 3 – hidden on mobile */}
                    <div className="col-span-1 space-y-6 sm:mt-16 ">
                      <div className="rounded-2xl aspect-square overflow-hidden relative float-1">
                        <Image
                          src="/images/services/printing/printing-products-service.webp"
                          alt="Custom print product sample"
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
        <section className="relative overflow-hidden py-10">
          {/* Background Glow */}
          <div className="absolute inset-0 -z-10 " />

          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-14">
              {/* LEFT CONTENT */}
              <div
                data-aos="fade-up"
                className="space-y-6 text-center lg:text-left"
              >          
                {/* Badge */}
                <span className="inline-block rounded-full bg-pink-100 px-4 py-1 text-sm font-semibold text-pink-600">
                  About FBS Printing
                </span>

                <h2 className="text-4xl md:text-5xl font-extrabold leading-tight">
                  Printing that’s
                  <span className="text-pink-600">
                    {" "}
                    fast, bold & reliable
                  </span>
                </h2>

                <p className="text-gray-600 text-base md:text-xl leading-relaxed max-w-2xl mx-auto lg:mx-0">
                  The goal of our business is to offer quick, affordable, and
                  easy service, but we also place a great value on the caliber
                  of our goods. FBS blends quick turnaround time with a keen eye
                  towards quality. For companies of all sizes, we are committed
                  to offering premium printing, graphic design, and signage
                  solutions.
                </p>

                {/* CTA */}
                <div className="pt-6">
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-2 rounded-full bg-pink-600 px-8 py-3 text-white font-semibold shadow-lg hover:scale-105 transition-all duration-300"
                  >
                    Contact Us
                    <span>→</span>
                  </Link>
                </div>
              </div>

              {/* RIGHT IMAGE */}
              <div data-aos="fade-left" className="relative">
                <div className="absolute -inset-3 rounded-3xl bg-gradient-to-r from-pink-400 to-green-400 blur-2xl opacity-30"></div>

                <Image
                  src="/images/about/about-fbs-prints-team.webp"
                  alt="FBS Prints team collaborating on print and branding projects"
                  width={700}
                  height={500}
                  priority
                  className="relative w-full h-[320px] md:h-[450px] object-cover rounded-3xl"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Section - 3 */}
        <section className="container section-padding">
          <div className="bg-gradient-to-r from-pink-600 to-pink-700 rounded-2xl px-6 py-12 text-white">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center max-w-7xl mx-auto ">
              {/* Left Content */}
              <div data-aos="fade-right">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight text-center lg:text-start">
                  We Offer <br />
                  <span className="text-black hover:text-yellow-300">
                    A Low Price Guarantee
                  </span>
                  <br />
                  On All Our Services
                </h2>
              </div>

              {/* Right Content */}
              <div data-aos="fade-left">
                <p className="text-base md:text-lg text-pink-100 leading-relaxed text-center lg:text-start">
                  Customer loyalty is fueled by affordable prices, high quality,
                  originality, and our business practices. Every day, thousands
                  of companies and individuals rely on FBS for their printing,
                  signage, and marketing requirements, enhancing the company’s
                  reputation for providing products and services of the highest
                  quality, dependability, affordability, and variety. We care
                  for our customers and most importantly their money and time.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section - 4 */}
        <section className="container section-padding">
          <div className="">
            {/* Heading */}
            <h2
              data-aos="fade-up"
              className="text-pink-700 text-center text-4xl md:text-5xl font-bold mb-12"
            >
              How{" "}
              <span className="bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                {" "}
                Does This
              </span>{" "}
              Work?
            </h2>

            {/* Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {workcard.map((item, index) => (
                <div
                  key={`${item.id}-${index}`}
                  data-aos="fade-up"
                  className="group bg-white rounded-2xl p-8 text-center 
                     shadow-lg hover:shadow-2xl transition-all duration-300"
                >
                  {/* Step Number */}
                  <div
                    className="mx-auto mb-6 h-14 w-14 rounded-full 
                       bg-pink-600 text-white flex items-center 
                       justify-center text-xl font-bold
                       group-hover:scale-110 transition"
                  >
                    {item.id}
                  </div>

                  {/* Title */}
                  <h2 className="text-xl md:text-2xl font-semibold mb-4">
                    {item.title}
                  </h2>

                  {/* Description */}
                  <p className="text-gray-600 text-base leading-relaxed">
                    {item.details}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section - 5 */}
        <section className="container section-padding">
          <div className="max-w-6xl mx-auto px-6">
            {/* Heading */}
            <div className="text-center mb-10">
              <h2 className="text-5xl font-bold text-pink-700">
                FBS{" "}
                <span className="bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                  PRINTS
                </span>
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
              {services.map((item, i) => (
                <div
                  key={i}
                  className="border-b pb-4 group transition-all duration-300
                 flex justify-center"
                >
                  {/* INNER CONTENT */}
                  <div
                    className="flex items-center gap-4 w-full 
                      group-hover:translate-x-2 transition-all duration-300"
                  >
                    {/* ICON */}
                    <div
                      className="w-11 h-11 flex-shrink-0 rounded-full bg-pink-100
                        text-pink-600 flex items-center justify-center"
                    >
                      {item.icon}
                    </div>

                    {/* TEXT */}
                    <h4
                      className="text-lg font-semibold text-gray-800
                       group-hover:text-pink-600"
                    >
                      {item.label}
                    </h4>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        <Slider />
        </main>
        <Footer />
      </SmoothScroll>
    </>
  );
}
