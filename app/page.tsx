"use client";

import Navbar from "@/app/Components/Navbar";
import Footer from "@/app/Components/Footer";

import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import SmoothScroll from "@/app/Components/SmoothScroll";
import Link from "next/link";

import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from "react-icons/fa";
import { PiLessThanBold } from "react-icons/pi";
import { PiGreaterThanBold } from "react-icons/pi";

import Slider from "./Components/Slider";

import { FaRocket } from "react-icons/fa";
import { FaRegCalendarAlt } from "react-icons/fa";
import { FaWallet } from "react-icons/fa";

export default function Home() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    AOS.init({
      duration: 1200,
      once: true,
      easing: "ease-in-out",
      offset: 100,
    });
  }, []);

  function useCountUp(target: number, duration = 2000) {
    const [count, setCount] = useState(0);

    useEffect(() => {
      let start: number | null = null;
      let animationFrame: number;

      const step = (timestamp: number) => {
        if (!start) start = timestamp;
        const progress = timestamp - start;
        const progressRatio = Math.min(progress / duration, 1);
        setCount(Math.floor(progressRatio * target));

        if (progress < duration) {
          animationFrame = requestAnimationFrame(step);
        } else {
          setCount(target); // ensure final value is exact
        }
      };

      animationFrame = requestAnimationFrame(step);

      return () => cancelAnimationFrame(animationFrame);
    }, [target, duration]);

    return count;
  }

  const projects = useCountUp(150, 1000);
  const experience = useCountUp(25, 800);
  const funding = useCountUp(20, 900);

  const ourservies = [
    {
      img: "/Services-1.jpeg",
      title: "PRINT ON PRODUCT",
      des: "CUSTOMIZED PRINT",
      href: "/services/Printing-Product",
    },
    {
      img: "/Services-2.jpeg",
      title: "DIRECT MAILING",
      des: "MARKETING",
      href: "/services/Signage",
    },
    {
      img: "/Services-3.jpeg",
      title: "SIGNAGE PRINTING",
      des: "ViSIBLE YOUR BUSINESS",
      href: "/services/Direct-MaIilintg",
    },
    {
      img: "/Services-4.jpeg",
      title: "WEBSITE DESIGN",
      des: "GROW ONLINE",
      href: "/services/Web-Design",
    },
    {
      img: "/Services-5.jpeg",
      title: "SEO SERVICES",
      des: "OPTIMIZE YOUR BUSINESS ONLINE",
      href: "/services/SEO",
    },
  ];

  return (
    <>
      <Navbar />
      <SmoothScroll>
        {/* Hero Section */}
        <section className="pt-10">
          <div className="container mx-auto relative w-full overflow-hidden rounded-2xl">
            {/* HERO IMAGE */}
            <Image
              src="/Home-Hero.jpg"
              alt="Printing Service"
              width={1400}
              height={700}
              priority
              className="
        w-full
        h-[420px] sm:h-[480px] md:h-[550px] lg:h-[620px]
        object-cover
        rounded-2xl
      "
            />

            {/* DARK OVERLAY */}
            <div className="absolute inset-0 bg-black/55 rounded-2xl"></div>

            {/* HERO CONTENT */}
            <div className="absolute inset-0 z-10 flex items-center justify-center text-center px-4">
              <div
                data-aos="fade-up"
                className="text-white max-w-3xl space-y-3 sm:space-y-4"
              >
                <p className="text-sm sm:text-base md:text-lg font-medium">
                  We place a great value on the caliber of our goods.
                </p>

                <p className="text-sm sm:text-base md:text-lg font-medium">
                  FBS blends quick turnaround time with a keen eye towards
                  quality.
                </p>

                <p className="text-sm sm:text-base md:text-lg font-medium">
                  For companies of all sizes, we are committed to offering
                  premium printing, graphic design, and signage solutions.
                </p>

                <h1
                  className="pt-4 font-bold leading-tight
          text-3xl sm:text-4xl md:text-5xl lg:text-6xl"
                >
                  <span className="text-pink-500">PRICE GUARANTEE</span>
                  <br />
                  FOR ALL OF OUR SERVICES
                </h1>

                <p className="text-yellow-400 font-semibold text-sm sm:text-base pt-2">
                  GET YOUR PRINT NOW
                </p>

                <div className="pt-5">
                  <Link
                    href="/contact"
                    className="
              inline-block
              bg-gradient-to-r from-pink-500 to-green-400
              px-8 py-3
              text-sm sm:text-base
              font-semibold text-white
              rounded-full
              transition-transform duration-300
              hover:scale-105
            "
                  >
                    Contact Us
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section-2: Services */}
        <section className="container section-padding mx-auto">
          <div className="px-4">
            <h1
              data-aos="fade-up"
              className="uppercase p-5 text-5xl text-center text-pink-700 font-bold"
            >
              Look At Our Service
            </h1>
          </div>

          <div className="">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-7">
              {ourservies.map((item, index) => (
                <div
                  key={index}
                  className="bg-gray-200 p-3 rounded-2xl relative w-full shadow-lg transition-transform duration-300 hover:scale-105"
                >
                  {/* IMAGE */}
                  <img
                    src={item.img}
                    alt={item.title}
                    className="w-full h-[320px] object-cover rounded-xl"
                  />

                  {/* CONTENT */}
                  <div className="mt-5 pb-3">
                    <h2 className="text-2xl font-semibold">{item.title}</h2>
                    <p className="text-md text-gray-600">{item.des}</p>
                  </div>

                  {/* ARROW BUTTON */}
                  <Link href={item.href}>
                    <div
                      className="absolute bg-white rounded-full flex justify-center items-center
          origin-bottom-right -rotate-45
          w-14 h-14 bottom-4 -right-3
          md:w-12 md:h-12 cursor-pointer"
                    >
                      <div
                        className="bg-pink-700 text-white rounded-full text-xl flex justify-center items-center
            shadow-md hover:scale-110 transition-transform
            w-11 h-11 md:w-9 md:h-9"
                      >
                        →
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section-3: Video Section */}
        <section className="pt-10 px-4 overflow-x-hidden">
          <div className="relative group overflow-hidden shadow-lg rounded-2xl">
            <Image
              src="/AdobeStock.png"
              alt="Printing Service"
              width={800}
              height={500}
              className="w-full h-96 md:h-[500px] object-cover"
            />

            <video
              src="/fbs.mp4"
              muted
              loop
              playsInline
              className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition duration-500"
              onMouseEnter={(e) => e.currentTarget.play()}
              onMouseLeave={(e) => {
                e.currentTarget.pause();
                e.currentTarget.currentTime = 0;
              }}
            />
          </div>
        </section>

        {/* Section - 4 */}
        <section className="container section-padding overflow-x-hidden">
          <div className="rounded-2xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* LEFT CONTENT */}
              <div>
                <h1
                  className="
            font-bold text-pink-700
            text-3xl sm:text-4xl md:text-5xl lg:text-7xl
            text-center lg:text-left
          "
                >
                  Our Work
                </h1>

                {/* underline */}
                <div className="pt-5 flex justify-center lg:justify-start">
                  <div className="w-16 h-[3px] bg-pink-700 rounded-full"></div>
                </div>

                <p
                  data-aos="fade-right"
                  className="pt-6 text-sm sm:text-base md:text-lg text-gray-700 text-center lg:text-left"
                >
                  Over the years, we’ve turned countless ideas into high-quality
                  prints that leave a lasting impression. From small personal
                  projects to large corporate campaigns, our team blends
                  creativity with precision to deliver outstanding results every
                  time.
                </p>

                <p
                  data-aos="fade-left"
                  className="pt-5 text-sm sm:text-base md:text-lg text-gray-700 text-center lg:text-left"
                >
                  With decades of experience and a passion for excellence, we’ve
                  completed over 150 projects for clients across industries.
                  Every design, every print, and every detail reflects our
                  commitment to quality, innovation, and customer satisfaction.
                </p>
              </div>

              {/* RIGHT STATS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* PROJECTS */}
                <div className="bg-white rounded-2xl shadow-lg shadow-pink-100 p-6 flex items-start justify-between">
                  <div>
                    <h2 className="text-3xl sm:text-4xl font-bold text-pink-700">
                      {projects}+
                    </h2>
                    <p className="text-sm sm:text-base font-medium text-gray-600 mt-2">
                      Projects Done
                    </p>
                  </div>

                  <div className="bg-pink-100 p-3 rounded-xl">
                    <FaRocket className="text-pink-600 text-xl sm:text-2xl" />
                  </div>
                </div>

                {/* EXPERIENCE */}
                <div className="bg-white rounded-2xl shadow-lg shadow-pink-100 p-6 flex items-start justify-between">
                  <div>
                    <h2 className="text-3xl sm:text-4xl font-bold text-pink-700">
                      {experience}
                    </h2>
                    <p className="text-sm sm:text-base font-medium text-gray-600 mt-2">
                      Years of Experience
                    </p>
                  </div>

                  <div className="bg-pink-100 p-3 rounded-xl">
                    <FaRegCalendarAlt className="text-pink-600 text-xl sm:text-2xl" />
                  </div>
                </div>

                {/* FUNDING */}
                <div className="bg-white rounded-2xl shadow-lg shadow-pink-100 p-6 flex items-start justify-between sm:col-span-2">
                  <div>
                    <h2 className="text-3xl sm:text-4xl font-bold text-pink-700">
                      {funding}M
                    </h2>
                    <p className="text-sm sm:text-base font-medium text-gray-600 mt-2">
                      Total Funding
                    </p>
                  </div>

                  <div className="bg-pink-100 p-3 rounded-xl">
                    <FaWallet className="text-pink-600 text-xl sm:text-2xl" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section - 5 */}
        <section className="container section-padding overflow-x-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* TEXT CONTENT */}
            <div data-aos="fade-right" className="text-center md:text-left">
              <h1 className="uppercase text-lg sm:text-xl md:text-3xl font-semibold">
                Customized Printing to
              </h1>

              <h2
                className="
          uppercase font-bold text-pink-700
          text-4xl sm:text-6xl md:text-7xl lg:text-8xl
          pt-3 leading-tight
        "
              >
                achieve your <span className="text-black">Business goals</span>
              </h2>

              <p className="text-sm sm:text-base md:text-lg pt-4 text-gray-700">
                We create tailored printing solutions designed to make your
                brand stand out and your message clear. From eye-catching
                designs to premium materials, every print is crafted to support
                your marketing goals, engage your audience, and drive real
                results for your business.
              </p>

              <div className="pt-6 flex justify-center md:justify-start">
                <div className="w-16 h-[3px] bg-pink-700 rounded-full"></div>
              </div>
            </div>

            {/* IMAGE */}
            <div className="relative" data-aos="fade-left">
              <Image
                src="/Printing Gols.png"
                alt="Printing Service"
                width={800}
                height={500}
                className="
          w-full
          h-[220px] sm:h-[300px] md:h-[400px] lg:h-[500px]
          object-cover
          rounded-2xl
          shadow-xl shadow-pink-200
        "
              />
            </div>
          </div>
        </section>

        {/* Section - 6 */}
        <section className="container py-20">
          <div className="grid grid-cols-1 lg:grid-cols-3 rounded-3xl shadow-xl overflow-hidden">
            {/* LEFT CONTACT INFO */}
            <div className="bg-[#1c1c1c] text-white flex flex-col justify-center gap-14 p-10">
              <div className="flex flex-col items-center text-center gap-3">
                <FaMapMarkerAlt className="text-pink-600 text-3xl" />
                <p className="text-lg font-medium">Illinois, USA</p>
              </div>

              <div className="flex flex-col items-center text-center gap-3">
                <FaPhoneAlt className="text-pink-600 text-3xl" />
                <p className="text-lg font-medium">+1-855-222-1133</p>
              </div>

              <div className="flex flex-col items-center text-center gap-3">
                <FaEnvelope className="text-pink-600 text-3xl" />
                <p className="text-lg font-medium">info@fbsprints.com</p>
              </div>
            </div>

            {/* RIGHT FORM */}
            <div className="lg:col-span-2 bg-white p-5">
              {/* Heading */}
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-gray-900">
                  Contact Us If You Need A Custom
                  <span className="block text-pink-600">
                    Design Without Delay!
                  </span>
                </h2>
                <p className="mt-4 text-gray-600">
                  To make an appointment, please call us. We’d love to pamper
                  you!
                </p>
              </div>

              {/* Form */}
              <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    First Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your first name"
                    className="mt-2 w-full rounded-xl border px-4 py-3 focus:ring-2 focus:ring-pink-500"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Last Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your last name"
                    className="mt-2 w-full rounded-xl border px-4 py-3 focus:ring-2 focus:ring-pink-500"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Email Id
                  </label>
                  <input
                    type="email"
                    placeholder="Enter your email id"
                    className="mt-2 w-full rounded-xl border px-4 py-3 focus:ring-2 focus:ring-pink-500"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Company Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your company name"
                    className="mt-2 w-full rounded-xl border px-4 py-3 focus:ring-2 focus:ring-pink-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-gray-700">
                    Comments / Questions
                  </label>
                  <textarea
                    rows={5}
                    placeholder="Enter your message here..."
                    className="mt-2 w-full rounded-xl border px-4 py-3 focus:ring-2 focus:ring-pink-500"
                  ></textarea>
                </div>

                <div className="md:col-span-2 text-sm text-gray-500">
                  By filling this form, you agree to our
                  <span className="text-pink-600 font-medium">
                    {" "}
                    Terms & Conditions{" "}
                  </span>
                  and
                  <span className="text-pink-600 font-medium">
                    {" "}
                    Privacy Policy
                  </span>
                </div>

                <div className="md:col-span-2 flex justify-center lg:justify-end">
                  <button
                    type="submit"
                    className="rounded-full bg-gradient-to-r from-pink-500 to-green-400 px-8 py-3 text-white font-semibold shadow-lg hover:scale-105 transition"
                  >
                    Send Message
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>

        {/* Section - 7 */}
        <section data-aos="fade-up" className="pt-10 px-4">
          <div className=" rounded-xl overflow-hidden shadow-lg">
            <iframe
              src="https://www.google.com/maps?q=Chicago,USA&output=embed"
              className="w-full h-[300px] md:h-[450px]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </section>

        <Slider />
        <Footer />
      </SmoothScroll>
    </>
  );
}
