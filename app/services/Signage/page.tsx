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

  const steps = [
    {
      id: 1,
      text: "Advertising Flags",
      image: "/icons/Advertising Flags.png",
    },
    {
      id: 2,
      text: "Banner Stands",
      image: "/icons/Banner Stands.png",
    },
    {
      id: 3,
      text: "Banner",
      image: "/icons/Banner.png",
    },
    {
      id: 4,
      text: "Custom Neon LED",
      image: "/icons/Custom Neon LED.png",
    },
    {
      id: 5,
      text: "Custom Event Tents",
      image: "/icons/Custom Event Tents.png",
    },
    {
      id: 6,
      text: "Canopy/Awning",
      image: "/icons/CanopyAwning.png",
    },
    {
      id: 7,
      text: "LED Light Box",
      image: "/icons/LED Light Box.png",
    },
    {
      id: 8,
      text: "LED Message Board",
      image: "/icons/LED Message Board.png",
    },
    {
      id: 9,
      text: "LED Channel Letters",
      image: "/icons/LED Channel Letters.png",
    },
    {
      id: 10,
      text: "Monument Signs",
      image: "/icons/Monument Signs.png",
    },
    {
      id: 11,
      text: "Pylon Signs",
      image: "/icons/Pylon Signs.png",
    },
    {
      id: 12,
      text: "Signicade A Frame",
      image: "/icons/Signicade A Frame.png",
    },
    {
      id: 13,
      text: "Trade Show Products",
      image: "/icons/Trade Show Products.png",
    },
    {
      id: 14,
      text: "Vehicle Graphics",
      image: "/icons/Vehicle Graphics.png",
    },
    {
      id: 15,
      text: "Vehicle Wraps",
      image: "/icons/Vehicle Wraps.png",
    },
    {
      id: 16,
      text: "Window Lettering",
      image: "/icons/Window Lettering.png",
    },
    {
      id: 17,
      text: "Yard Signs",
      image: "/icons/Yard Signs.png",
    },
    {
      id: 18,
      text: "And More",
      image: "/icons/And More.png",
    },
  ];

  const services = [
    { title: "Awning & Canopy", img: "/Awning -Canopy.png" },
    { title: "Car Wrap", img: "/Car Wrap.png" },
    { title: "Exterior Monuments", img: "/Exterior Monuments.png" },
    { title: "Wall Sign", img: "/Wall Sign.png" },
    { title: "Street Sign", img: "/Street Sign.png" },
    { title: "Window Graphics", img: "/Window Graphics.png" },
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
                  Signage
                </p>

                <p className="mt-5 text-gray-600 text-sm sm:text-base leading-relaxed max-w-md">
                  Any business needs signage services since they are so
                  significant for bringing in consumers, enhancing brand
                  recognition, and conveying important messages.
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
                  src="/Services-3.jpeg"
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
                    Business Signage
                  </span>
                  <br />
                  in Best Price.
                </h2>
              </div>

              {/* Right Content */}
              <div data-aos="fade-left">
                <p className="text-base md:text-lg text-pink-100 leading-relaxed">
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
        <section data-aos="zoom-in" className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {steps.map((item) => {
              return (
                <div
                  key={item.id}
                  className="
        group flex h-[220px] bg-gray-200
        rounded-2xl items-center justify-center
        overflow-hidden cursor-pointer
        border-4 border-transparent
        hover:border-yellow-400
        transition-all duration-300
      "
                >
                  <div className="flex flex-col items-center justify-center gap-4">
                    {/* PNG IMAGE ICON */}
                    {item.image && (
                      <Image
                        src={item.image}
                        alt={item.text}
                        width={80}
                        height={60}
                        className=" transition-transform duration-300
              group-hover:-rotate-12"
                      />
                    )}

                    <h3 className="text-xl text-black font-semibold text-center">
                      {item.text}
                    </h3>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Section - 4 */}
        <section data-aos="fade-up" className="container py-10">
          <div className="absolute -top-5 -left-20 w-72 h-72 bg-pink-300/30 rounded-full blur-3xl" />
          <div className="absolute top-60 -right-0 w-72 h-72 bg-green-300/30 rounded-full blur-3xl" />

          <div className=" ">
            {/* Heading */}
            <p
              className="text-4xl md:text-5xl font-bold text-center text-pink-700">
              What <span className="bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">We</span> Print
            </p>
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
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
                  {steps.map((steps, index) => (
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
                        <img
                          src={steps.image}
                          alt={steps.text}
                          className="w-8 h-8"
                        />
                      </span>

                      <span className="font-medium text-gray-800 text-center">
                        {steps.text}
                      </span>
                      <span className="absolute -bottom-1 left-0 w-0 h-1 bg-gradient-to-r from-pink-500 to-green-400 group-hover:w-full transition-all duration-300 rounded-full" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-15">
              <p className="text-center text-xl font-semibold">
                Allow Us to make your imagination com true! FBS SIGNS is a
                well-respected sign fabricator nationwide. We know how to take
                our clients’ input and make it come alive. Our illuminated signs
                are with the brightest leds and highest quality which will draw
                customers into your business. Most popular signage are channel
                letters, which are illuminated signs. They are beneficial for
                companies located in shopping centers because we can install
                low-wattage LED lights. We can design your channel letters based
                on your design ideas and landlord specifications, and municipal
                regulations. Most importantly, we understand the importance of
                professionalism and hard work. You can trust us to get the job
                done front start to finish.
              </p>
            </div>

            <div className="pt-15">
              <div className="px-4">
                <div className="max-w-7xl mx-auto grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                  {services.map((item, index) => (
                    <div
                      key={index}
                      className="bg-white rounded-2xl p-4 text-center shadow-[0_20px_40px_rgba(0,0,0,0.08)] hover:-translate-y-2 hover:shadow-[0_30px_60px_rgba(0,0,0,0.12)] transition-all duration-300"
                    >
                      <div className="relative w-full h-[250px] rounded-xl overflow-hidden">
                        <Image
                          src={item.img}
                          alt={item.title}
                          fill
                          className="object-cover"
                        />
                      </div>

                      <h3 className="mt-4 text-lg font-semibold text-gray-700">
                        {item.title}
                      </h3>
                    </div>
                  ))}
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
