"use client";

import Navbar from "@/app/Components/Navbar";
import Footer from "@/app/Components/Footer";
import Image from "next/image";
import { useEffect, useState } from "react";
import "aos/dist/aos.css";
import SmoothScroll from "@/app/Components/SmoothScroll";
import Slider from "../Components/Slider";
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from "react-icons/fa";
import { PiLessThanBold } from "react-icons/pi";
import { PiGreaterThanBold } from "react-icons/pi";

export default function Page() {
  const [open, setOpen] = useState(false);

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
                src="/Conatct.jpeg"
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
                  Contact US
                </p>
                <p className="mb-2 w-full text-xl">
                  Feel free to get in touch with us using the contact form
                  provided below. We will reply to your inquiry as quickly as
                  possible.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section - 2 */}
        <section
          data-aos="fade-up"
          className="pt-10 px-4 relative overflow-x-hidden"
        >
          <div className="bg-black p-5">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-0 items-stretch">
              {/* LEFT SIDE – FORM */}
              <div data-aos="fade-right" className="bg-black p-6 md:p-10">
                <h1 className="text-white text-2xl md:text-3xl font-bold">
                  Contact Us If You Need A <br /> Custom Design Without Delay!
                </h1>

                <p className="text-lg md:text-xl text-yellow-400 pt-5 font-semibold">
                  To Make An Appointment, Please Call Us. We Would Love To
                  Pamper You!
                </p>

                {/* FORM GRID */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-5">
                  <div className="text-white flex flex-col">
                    <label>First Name</label>
                    <input
                      type="text"
                      placeholder="First Name"
                      className="bg-white p-3 rounded-lg text-black"
                    />
                  </div>

                  <div className="text-white flex flex-col">
                    <label>Last Name</label>
                    <input
                      type="text"
                      placeholder="Last Name"
                      className="bg-white p-3 rounded-lg text-black"
                    />
                  </div>

                  <div className="text-white flex flex-col">
                    <label>Email Id</label>
                    <input
                      type="email"
                      placeholder="Email Id"
                      className="bg-white p-3 rounded-lg text-black"
                    />
                  </div>

                  <div className="text-white flex flex-col">
                    <label>Company Name</label>
                    <input
                      type="text"
                      placeholder="Company Name"
                      className="bg-white p-3 rounded-lg text-black"
                    />
                  </div>
                </div>

                {/* TEXTAREA */}
                <div className="pt-5 text-white flex flex-col">
                  <label>Comments / Questions</label>
                  <textarea
                    placeholder="Comments / Questions"
                    className="bg-white min-h-[120px] p-3 rounded-lg text-black"
                  />
                </div>

                <p className="text-white pt-5 text-sm">
                  By filling this form, you agree to our Terms & Privacy Policy
                </p>

                <button className="mt-6 rounded-full bg-gradient-to-r from-pink-700 to-green-400 px-8 py-3 font-semibold text-white hover:scale-105 transition">
                  Send Message
                </button>
              </div>

              {/* RIGHT SIDE – IMAGE */}
              <div data-aos="fade-left" className="relative">
                <Image
                  src="/AdobeStock_163759063-scaled.jpeg"
                  alt="Contact"
                  width={500}
                  height={500}
                  className="object-fit w-full h-190"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Section - 3 */}
        <section className="px-4 pt-10">
          <Image
            src="/globe.png"
            alt="Logo"
            width={1500}
            height={500}
            className="w-full h-150"
          />
        </section>

        <Slider />
        <Footer />
      </SmoothScroll>
    </>
  );
}
