"use client";

import Navbar from "@/app/Components/Navbar";
import Footer from "@/app/Components/Footer";
import Image from "next/image";
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

        {/* Section - 2 */}
        <section className="pt-10 px-4 overflow-x-hidden">
          <div className="relative">
            {/* Background Image */}
            <Image
              src="/Section-1-About-2.jpg"
              alt="Printing Service"
              width={1200}
              height={500}
              className=" w-full h-[750px] lg:h-[500px] object-cover rounded-xl shadow-lg"
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-black/60 flex items-center">
              <div className="px-4 md:px-10 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
                {/* Left Content */}
                <div data-aos="fade-right" className="text-center lg:text-left">
                  <h1 className="text-white text-3xl md:text-5xl font-bold hover:text-yellow-400">
                    Get to know us
                  </h1>

                  <p className="text-white text-base md:text-lg mt-3">
                    The goal of our business is to offer quick, affordable, and
                    easy service
                  </p>

                  <div className="mt-6 flex justify-center lg:justify-start">
                    <button className="rounded-full bg-gradient-to-r from-pink-700 to-green-400 px-8 py-3 font-semibold text-white hover:scale-105 transition-transform duration-300">
                      Contact Us
                    </button>
                  </div>

                  <div className="mt-6">
                    <div className="bg-pink-700 text-white rounded-lg">
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
                <div data-aos="fade-left" className="flex justify-center">
                  <Image
                    src="/Section-1-About-1.jpg"
                    alt="Printing Service"
                    width={600}
                    height={400}
                    className="w-full max-w-md h-[250px] md:h-[350px] object-cover rounded-2xl border-6 border-white shadow-lg"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section - 3 */}
        <section className="px-4 pt-10">
          <div className="bg-pink-700 p-5 text-white">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-center max-w-7xl mx-auto">
              <p data-aos="fade-right" className="text-4xl font-bold">
                We Offer <br />
                <span className="text-black hover:text-yellow-400">
                  A LOW PRICE GAURANTEE
                </span>{" "}
                <br />
                For All Of Our Services!
              </p>
              <div data-aos="fade-left" className="text-whit">
                <p className="text-md">
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
        <section className="px-4 pt-10">
          <div>
            <h1
              data-aos="fade-up"
              className="text-center text-5xl lg:text-6xl font-bold"
            >
              How does this work?
            </h1>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto pt-5">
            {workcard.map((item, index) => (
              /* card - 1 */
              <div
                key={`${item.id}-${index}`}
                data-aos="fade-up"
                className="bg-gray-200 rounded-bl-[100px] rounded-tr-[100px] 
                    p-6 flex flex-col items-center justify-self-center text-center
                    min-h-[300px]"
              >
                {/* Number Circle */}
                <div
                  className="bg-pink-700 rounded-full text-white 
                      h-12 w-12 flex items-center justify-center
                      text-2xl font-semibold  "
                >
                  {item.id}
                </div>

                {/* Title */}
                <h1 className="text-2xl md:text-3xl font-bold pt-5">
                  {item.title}
                </h1>

                {/* Description */}
                <p className="text-base md:text-lg font-medium pt-4">
                  {item.details}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Section - 5 */}
        <section data-aos="fade-up" className="px-4 pt-10">
          <div data-aos="fade-up" className="bg-black">
            <div data-aos="fade-up" className="max-w-7xl mx-auto  p-5">
              <p className="text-5xl text-center text-white font-bold">
                FBS PRINTS
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
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
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

        <Slider />
        <Footer />
      </SmoothScroll>
    </>
  );
}
