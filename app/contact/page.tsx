"use client";

import Navbar from "@/app/Components/Navbar";
import Footer from "@/app/Components/Footer";
import Image from "next/image";
import { useEffect, useState } from "react";
import "aos/dist/aos.css";
import SmoothScroll from "@/app/Components/SmoothScroll";
import Slider from "../Components/Slider";
import Link from "next/link";

import PageLoader from "../Components/Preloader";

import {
  FaTwitter,
  FaLinkedin,
  FaInstagram,
  FaFacebookF,
  FaDribbble,
  FaBehance,
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
} from "react-icons/fa";

export default function Page() {
  const socialIcons = [
    { name: "Twitter", Icon: FaTwitter, url: "https://twitter.com" },
    { name: "LinkedIn", Icon: FaLinkedin, url: "https://linkedin.com" },
    { name: "Instagram", Icon: FaInstagram, url: "https://instagram.com" },
    { name: "Facebook", Icon: FaFacebookF, url: "https://facebook.com" },
    { name: "Dribbble", Icon: FaDribbble, url: "https://dribbble.com" },
    { name: "Behance", Icon: FaBehance, url: "https://behance.net" },
  ];

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
      <PageLoader />
      <Navbar />
      <SmoothScroll>
        {/* Section - 1 */}
        <section className="container">
          <div className="relative bg-white rounded-[32px] shadow-xl overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2 items-center">
              <div
                data-aos="fade-right"
                className="relative z-10 bg-white border-l-4 border-pink-600 p-5 lg:p-8 lg:ml-14 lg:-mr-24 rounded-b-[32px] lg:rounded-2xl shadow-lg order-2 lg:order-1"
              >
                <div className="h-1 w-14 bg-pink-600 rounded-full mb-5"></div>

                <p className="mt-5 text-gray-600 font-bold text-4xl md:text-5xl lg:text-6xl text-center lg:text-start">
                  Contact
                  <span className="text-pink-700"> US</span>
                </p>

                <p className="mt-5 text-gray-600 text-sm sm:text-base leading-relaxed lg:max-w-md text-center lg:text-start">
                  Feel free to get in touch with us using the contact form
                  provided below. We will reply to your inquiry as quickly as
                  possible.
                </p>
              </div>

              <div
                data-aos="fade-left"
                className="relative h-[300px] sm:h-[400px] md:h-[480px] lg:h-[560px] order-1 lg:order-2"
              >
                <Image
                  src="/Conatct.jpeg"
                  alt="Printing Service"
                  fill
                  priority
                  className="object-cover rounded-t-[32px] lg:rounded-r-[32px] lg:rounded-t-none"
                />
                <div className="absolute inset-0 bg-gradient-to-l from-black/50 to-transparent rounded-t-[32px] lg:rounded-r-[32px] lg:rounded-t-none"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Section - 2 */}
        <section data-aos="fade-up" className="container section-padding">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2">
            {/* LEFT – Contact Info */}
            <div
              data-aos="fade-right"
              className="p-5 md:p-10 bg-pink-50 rounded-2xl shadow-lg flex flex-col gap-5"
            >
              <h2 className="text-4xl font-bold text-pink-700 text-center lg:text-start">
                Contact Me
              </h2>
              <p className="text-gray-600 leading-relaxed text-center lg:text-start">
                Reach out for inquiries, quotes, or just to say hello! We reply
                as fast as possible.
              </p>

              <div className="space-y-3">
                <div className="flex items-center gap-4 lg:justify-self-start justify-self-center items-center">
                  <FaMapMarkerAlt className="text-pink-700 text-2xl lg:text-3xl" />
                  <p className="text-lg font-medium text-gray-800">
                    Illinois, USA
                  </p>
                </div>
                <div className="flex items-center gap-4 lg:justify-self-start justify-self-center items-center">
                  <FaPhoneAlt className="text-pink-700 text-2xl lg:text-3xl" />
                  <p className="text-lg font-medium text-gray-800">
                    +1-855-222-1133
                  </p>
                </div>
                <div className="flex items-center gap-4 lg:justify-self-start justify-self-center items-center">
                  <FaEnvelope className="text-pink-700 text-2xl lg:text-3xl" />
                  <p className="text-lg font-medium text-gray-800">
                    info@fbsprints.com
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 mt-4 lg:justify-start justify-center items-center">
                {socialIcons.map(({ Icon, url, name }, i) => (
                  <Link
                    key={i}
                    href={url}
                    target="_blank"
                    aria-label={name}
                    className="w-12 h-12 flex items-center justify-center rounded-full bg-white shadow text-pink-700 hover:bg-pink-600 hover:text-white transition"
                  >
                    <Icon className="text-2xl " />
                  </Link>
                ))}
              </div>

              <div data-aos="fade-up" className="section-padding pt-10">
                <div className=" rounded-xl overflow-hidden shadow-lg">
                  <iframe
                    src="https://www.google.com/maps?q=Chicago,USA&output=embed"
                    className="w-full h-[300px] md:h-[300px]"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                </div>
              </div>
            </div>

            {/* RIGHT – Form */}
            <div
              data-aos="fade-left"
              className="p-10 bg-white rounded-2xl shadow-lg"
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center lg:text-start">
                Contact Us If You Need A <br />
                Custom Design Without Delay!
              </h2>

              <p className="mb-5 text-yellow-500 text-center lg:text-start">
                To Make An Appointment, Please Call Us. We Would Love To Pamper
                You!
              </p>

              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="First Name"
                    className="border border-gray-300 p-4 rounded-lg w-full focus:ring-2 focus:ring-pink-600 focus:outline-none transition"
                  />
                  <input
                    type="text"
                    placeholder="Last Name"
                    className="border border-gray-300 p-4 rounded-lg w-full focus:ring-2 focus:ring-pink-600 focus:outline-none transition"
                  />
                </div>
                <input
                  type="email"
                  placeholder="Email"
                  className="border border-gray-300 p-4 rounded-lg w-full focus:ring-2 focus:ring-pink-600 focus:outline-none transition"
                />
                <input
                  type="text"
                  placeholder="Subject"
                  className="border border-gray-300 p-4 rounded-lg w-full focus:ring-2 focus:ring-pink-600 focus:outline-none transition"
                />
                <textarea
                  placeholder="Message"
                  className="border border-gray-300 p-4 rounded-lg w-full min-h-[140px] focus:ring-2 focus:ring-pink-600 focus:outline-none transition"
                />
                <p className="text-center lg:text-start">
                  By filling this form, you have read, understood and agreed to
                  Terms and Condition&apos;s and Privacy Policy
                </p>
                <button className="w-full py-4 rounded-full bg-gradient-to-r from-pink-600 to-green-400 text-white font-bold text-lg hover:scale-105 transition-transform">
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </section>

        {/* Section - 3 */}
        <section className="container section-padding mx-auto">
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
