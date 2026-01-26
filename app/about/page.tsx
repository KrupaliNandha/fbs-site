"use client";

import Navbar from "@/app/Components/Navbar";
import Footer from "@/app/Components/Footer";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import "aos/dist/aos.css";
import SmoothScroll from "@/app/Components/SmoothScroll";
import Slider from "../Components/Slider";
// import { FaUser, FaRunning, FaHome, FaThumbsUp } from "react-icons/fa";
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
import { title } from "process";

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
                  About
                  <span className="text-pink-600"> US</span>
                </p>

                <p className="mt-5 text-gray-600 text-sm sm:text-base leading-relaxed max-w-md">
                  Our first priority is to satisfy our customers. We value the
                  time and money of our clients and work for their business. If
                  you place your trust in us, you will undoubtedly be able to
                  verify that our assertion that consumers come first is true.
                  Our clients get to experience a hassle free, consistent, top
                  quality, and best time saving services.
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
                  src="/About.jpg"
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
        <section className="container section-padding overflow-x-hidden">
          <div className="relative">
            {/* Background Image */}
            <Image
              src="/Section-1-About-4.png"
              alt="Printing Service"
              width={800}
              height={500}
              className=" w-full h-[850px] md:h-[900px] lg:h-[600px] object-fit rounded-xl shadow-lg"
            />

            {/* Overlay */}
            <div className="absolute inset-0 flex items-center">
              <div className="px-4 md:px-10 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-5 items-center">
                {/* Left Content */}
                <div data-aos="fade-right" className="text-center lg:text-left">
                  <h1 className="text-pink-700 text-3xl md:text-5xl font-bold hover:text-yellow-400">
                    Get to know us
                  </h1>

                  <p className="text-base md:text-xl font-semibold mt-3">
                    The goal of our business is to offer quick, affordable, and
                    easy service
                  </p>

                  <div className="mt-6 flex justify-center lg:justify-start">
                    <Link
                      href="/contact"
                      className="rounded-full bg-gradient-to-r from-pink-500 to-green-400 px-8 py-3 font-semibold text-white hover:scale-105 transition-transform duration-300"
                    >
                      Contact Us
                    </Link>
                  </div>

                  <div className="mt-6">
                    <div className="bg-pink-700 text-white rounded-lg right-10">
                      <p className="p-5 text-sm md:text-base">
                        The goal of our business is to offer quick, affordable,
                        and easy service, but we also place a great value on the
                        caliber of our goods. FBS blends quick turnaround time
                        with a keen eye towards quality. For companies of all
                        sizes, we are committed to offering premium printing,
                        graphic design, and signage solutions.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Right Image */}
                <div
                  data-aos="fade-left"
                  className="flex inset-1 justify-center"
                >
                  <Image
                    src="/Section-1-About-1.jpg"
                    alt="Printing Service"
                    width={600}
                    height={400}
                    className="w-full max-w-md h-[250px] md:h-[450px] object-cover rounded-2xl border-6 border-white shadow-lg"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section - 3 */}
        <section className="container section-padding">
          <div className="bg-gradient-to-r from-pink-600 to-pink-700 rounded-2xl px-6 py-12 text-white">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center max-w-7xl mx-auto">
              {/* Left Content */}
              <div data-aos="fade-right">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
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
                <p className="text-base md:text-lg text-pink-100 leading-relaxed">
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
            <h1
              data-aos="fade-up"
              className="text-center text-4xl md:text-5xl lg:text-6xl font-bold mb-12"
            >
              How does this work?
            </h1>

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
        <section data-aos="fade-up" className="container bg-white py-16">
          <div className="absolute -top-5 -left-20 w-72 h-72 bg-pink-300/30 rounded-full blur-3xl" />
          <div className="absolute top-60 -right-0 w-72 h-72 bg-green-300/30 rounded-full blur-3xl" />
          <div className="">
            {/* Heading */}
            <h2 className="text-4xl md:text-5xl font-bold text-center text-gray-900">
              FBS PRINTS
            </h2>

            <p className="max-w-4xl mx-auto text-center text-gray-600 text-lg mt-4 leading-relaxed">
              Every project is different, and we at our organization work
              closely with our clients to make sure we match their particular
              demands and specifications. Graphic design, big format printing,
              car wraps, and other services are among the many printing and
              signage solutions we provide. We have the knowledge and experience
              to complete any task, whether it’s a straightforward banner or a
              complicated advertising campaign.
            </p>

            {/* Services Card */}
            <div className="flex justify-center">
              <div className="w-full bg-white rounded-2xl shadow-xl p-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                  {services.map((service, index) => (
                    <div
                      data-aos="fade-up"
                      data-aos-delay={index * 150} // 👈 IMPORTANT
                      data-aos-duration="600"
                      key={index}
                      className="group flex items-center justify-center
                         gap-3 p-3 rounded-xl
                         border border-gray-100
                         hover:shadow-md hover:-translate-y-1
                         transition-all duration-300 bg-gray-5 bg-gradient-to-r from-gray-200 to-gray-200 "
                    >
                      <span className="text-3xl text-pink-600 group-hover:scale-110 transition">
                        {service.icon}
                      </span>

                      <span className="font-medium text-gray-800 text-center">
                        {service.label}
                      </span>
                      <span className="absolute -bottom-1 left-0 w-0 h-1 bg-gradient-to-r from-pink-500 to-green-400 group-hover:w-full transition-all duration-300 rounded-full" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <Slider />
        <Footer />
      </SmoothScroll>
    </>
  );
}
