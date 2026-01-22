"use client";

import Navbar from "@/app/Components/Navbar";
import Footer from "@/app/Components/Footer";

import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import SmoothScroll from "@/app/Components/SmoothScroll";

import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from "react-icons/fa";
import { PiLessThanBold } from "react-icons/pi";
import { PiGreaterThanBold } from "react-icons/pi";

import Slider from "./Components/Slider";

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

  function useCountUp(target: number, speed = 20) {
    const [count, setCount] = useState(0);
    const started = useRef(false);

    useEffect(() => {
      if (started.current) return;
      started.current = true;

      let current = 0;
      const interval = setInterval(() => {
        current += 1;
        setCount(current);

        if (current >= target) {
          clearInterval(interval);
        }
      }, speed);

      return () => clearInterval(interval);
    }, [target, speed]);

    return count;
  }

  const projects = useCountUp(150, 10);
  const experience = useCountUp(25, 80);
  const funding = useCountUp(20, 80);

  return (
    <>
      <Navbar />
      <SmoothScroll>
        {/* Hero Section */}
        <section className="pt-10 px-4">
          <div className="grid lg:grid-cols-2 grid-cols-1 gap-4 place-items-center max-w-7xl mx-auto">
            {/* Hero Image */}
            <div className="w-full relative" data-aos="fade-right">
              <div className="w-70 h-50 top-105 right-89 xl:block hidden absolute border-2 rounded border-blue"></div>
              <div className="w-70 h-50 bottom-105 left-89 xl:block hidden absolute border-2 rounded border-blue"></div>

              <Image
                src="/Home-Hero.jpg"
                alt="Printing Service"
                width={500}
                height={500}
                className="w-130 h-100 md:w-145 md:h-150 object-fit relative justify-self-center lg:justify-start shadow-lg"
              />
            </div>

            {/* Hero Content */}
            <div className="flex h-full items-center justify-self-center text-center text-black px-4">
              <div data-aos="fade-left">
                <p className="mb-2 text-md">
                  We place a great value on the caliber of our goods.
                </p>
                <p className="mb-2 text-md">
                  FBS blends quick turnaround time with a keen eye towards
                  quality.
                </p>
                <p className="mb-2 text-md">
                  For companies of all sizes, we are committed to offering
                  premium printing, graphic design, and signage solutions.
                </p>

                <h1 className="text-4xl font-bold md:text-6xl">
                  PRICE GUARANTEE <br />
                  FOR ALL OF OUR SERVICES
                </h1>

                <p className="mt-6 text-yellow-400 font-semibold">
                  GET YOUR PRINT NOW
                </p>

                <button className="mt-6 rounded-full bg-gradient-to-r from-pink-700 to-green-400 px-8 py-3 font-semibold text-white hover:scale-105 transition-transform duration-300">
                  Contact Us
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Section-2: Services */}
        <section className="pt-10">
          <div className="px-4">
            <h1
              data-aos="fade-up"
              className="uppercase text-5xl text-center  font-bold"
            >
              Look At Our Service
            </h1>
          </div>
          <div className="px-4 mt-10">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-5">
              {/* Service card - 1 */}
              <div
                className="relative group overflow-hidden"
                data-aos="zoom-in"
                data-aos-delay="100"
              >
                <Image
                  src="/Services-1.jpeg"
                  alt="Print On Product"
                  width={500}
                  height={500}
                  className="w-full h-80 object-cover shadow-lg rounded-2xl"
                />

                <div className="absolute inset-0 flex flex-col text-center items-center justify-center rounded-2xl bg-black/40 text-white translate-y-[-100%] group-hover:translate-y-0 transition-transform duration-500 ease-in-out">
                  <h3 className="text-4xl lg:text-5xl xl:text-6xl font-bold mb-2 uppercase">
                    Print On <br /> Product
                  </h3>
                  <p className="text-lg px-4 text-center">CUSTOMIZED PRINT</p>
                </div>
              </div>

              {/* Service card - 2 */}
              <div
                className="relative group overflow-hidden"
                data-aos="zoom-in"
                data-aos-delay="200"
              >
                <Image
                  src="/Services-2.jpeg"
                  alt="Direct Mailing"
                  width={500}
                  height={500}
                  className="w-full h-80 object-cover shadow-lg rounded-2xl"
                />

                <div className="absolute inset-0 flex flex-col text-center items-center justify-center rounded-2xl bg-black/40 text-white translate-y-[-100%] group-hover:translate-y-0 transition-transform duration-500 ease-in-out">
                  <h3 className="text-4xl lg:text-5xl xl:text-6xl font-bold mb-2 uppercase">
                    Direct <br /> Mailing
                  </h3>
                  <p className="text-lg px-4 text-center">MARKETING</p>
                </div>
              </div>

              {/* Service card - 3 */}
              <div
                className="relative group overflow-hidden"
                data-aos="zoom-in"
                data-aos-delay="300"
              >
                <Image
                  src="/Services-3.jpeg"
                  alt="Signage Printing"
                  width={500}
                  height={500}
                  className="w-full h-80 object-cover shadow-lg rounded-2xl"
                />

                <div className="absolute inset-0 flex flex-col text-center items-center justify-center rounded-2xl bg-black/40 text-white translate-y-[-100%] group-hover:translate-y-0 transition-transform duration-500 ease-in-out">
                  <h3 className="text-4xl lg:text-5xl xl:text-6xl font-bold mb-2 uppercase">
                    SignAge <br /> Printing
                  </h3>
                  <p className="text-lg px-4 text-center">
                    VISIBLE YOUR BUSINESS
                  </p>
                </div>
              </div>

              {/* Service card - 4 */}
              <div
                className="relative group overflow-hidden"
                data-aos="zoom-in"
                data-aos-delay="400"
              >
                <Image
                  src="/Services-4.jpeg"
                  alt="Website Design"
                  width={500}
                  height={500}
                  className="w-full h-80 object-cover shadow-lg rounded-2xl"
                />

                <div className="absolute inset-0 flex flex-col text-center items-center justify-center rounded-2xl bg-black/40 text-white translate-y-[-100%] group-hover:translate-y-0 transition-transform duration-500 ease-in-out">
                  <h3 className="text-4xl lg:text-5xl xl:text-6xl font-bold mb-2 uppercase">
                    Website <br /> Design
                  </h3>
                  <p className="text-lg px-4 text-center">GROW ONLINE</p>
                </div>
              </div>

              {/* Service card - 5 */}
              <div
                className="relative group overflow-hidden"
                data-aos="zoom-in"
                data-aos-delay="500"
              >
                <Image
                  src="/Services-5.jpeg"
                  alt="SEO Services"
                  width={500}
                  height={500}
                  className="w-full h-80 object-cover shadow-lg rounded-2xl"
                />

                <div className="absolute inset-0 flex flex-col text-center items-center justify-center rounded-2xl bg-black/40 text-white translate-y-[-100%] group-hover:translate-y-0 transition-transform duration-500 ease-in-out">
                  <h3 className="text-4xl lg:text-5xl xl:text-6xl font-bold mb-2 uppercase">
                    SEO <br /> Services
                  </h3>
                  <p className="text-lg px-4 text-center">
                    OPTIMIZE YOUR BUSINESS ONLINE
                  </p>
                </div>
              </div>
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
        <section className="pt-10 px-4 overflow-x-hidden">
          <div className="bg-gray-200 rounded-xl p-5">
            <div className="px-4">
              <h1 className="text-center text-7xl font-bold text-pink-700">
                Our Work
              </h1>
            </div>
            <div className="grid grid-col-1 lg:grid-cols-2 gap-10 pt-5 max-w-7xl mx-auto">
              <div className="text-xl">
                <p data-aos="fade-right" className="text-center lg:text-start">
                  Over the years, we’ve turned countless ideas into high-quality
                  prints that leave a lasting impression. From small personal
                  projects to large corporate campaigns, our team blends
                  creativity with precision to deliver outstanding results every
                  time.
                </p>
              </div>

              <div className="text-xl">
                <p data-aos="fade-left" className="text-center lg:text-start">
                  With decades of experience and a passion for excellence, we’ve
                  completed over 150 projects for clients across industries.
                  Every design, every print, and every detail reflects our
                  commitment to quality, innovation, and customer satisfaction.
                </p>
              </div>
            </div>
            <div className="max-w-7xl mx-auto flex grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 py-5 ">
              <div className="text-center">
                <h1 className="text-5xl font-bold text-pink-700">{projects}+</h1>
                <p className="text-lg font-semibold">Project Done</p>
              </div>

              <div className="text-center">
                <h1 className="text-5xl font-bold text-pink-700">
                  {experience}
                </h1>
                <p className="text-lg font-semibold">year of Exprince</p>
              </div>

              <div className="text-center">
                <h1 className="text-5xl font-bold text-pink-700">{funding}M</h1>
                <p className="text-lg font-semibold">Total Funding</p>
              </div>
            </div>
          </div>
        </section>

        {/* Section - 5 */}
        <section className="pt-10 px-4 overflow-x-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 justify-center items-center">
            <div className="text-center" data-aos="fade-right">
              <h1 className="uppercase text-5xl font-bold">
                Customized Printing to
              </h1>
              <h2 className="uppercase text-5xl font-bold text-pink-700 pt-3">
                achieve your Business goals
              </h2>
              <p className="text-lg pt-3">
                We create tailored printing solutions designed to make your
                brand stand out and your message clear. From eye-catching
                designs to premium materials, every print is crafted to support
                your marketing goals, engage your audience, and drive real
                results for your business.
              </p>
            </div>

            <div className="relative" data-aos="fade-left">
              <Image
                src="/Section - 5.jpeg"
                alt="Printing Service"
                width={800}
                height={500}
                className="w-full h-96 md:h-[500px] object-cover"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                <div className="bg-black opacity-70 p-10 items-center justify-center">
                  <h1 className="text-white text-3xl font-bold text-center">
                    Customized <br /> Printing <br /> Goals
                  </h1>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section - 6 */}
        <section
          data-aos="fade-up"
          className="max-w-7xl mx-auto pt-10 px-4 relative overflow-x-hidden"
        >
          {/* FORM SECTION */}
          <div className="bg-black rounded-lg p-6 md:p-15">
            <h1 className="text-white text-2xl md:text-3xl font-bold">
              Contact Us If You Need A <br /> Custom Design Without Delay!
            </h1>

            <p className="text-lg md:text-xl text-yellow-400 pt-5 font-semibold">
              To Make An Appointment, Please Call Us. We Would Love To Pamper
              You!
            </p>

            {/* FORM GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-5">
              <div className="text-white flex flex-col">
                <label>First Name</label>
                <input
                  type="text"
                  placeholder="First Name"
                  className="bg-white w-full p-3 rounded-lg text-black"
                />
              </div>

              <div className="text-white flex flex-col">
                <label>Last Name</label>
                <input
                  type="text"
                  placeholder="Last Name"
                  className="bg-white w-full p-3 rounded-lg text-black"
                />
              </div>

              <div className="text-white flex flex-col">
                <label>Email Id</label>
                <input
                  type="email"
                  placeholder="Email Id"
                  className="bg-white w-full p-3 rounded-lg text-black"
                />
              </div>

              <div className="text-white flex flex-col">
                <label>Company Name</label>
                <input
                  type="text"
                  placeholder="Company Name"
                  className="bg-white w-full p-3 rounded-lg text-black"
                />
              </div>
            </div>

            {/* TEXTAREA */}
            <div className="pt-5">
              <div className="text-white flex flex-col">
                <label>Comments / Questions</label>
                <textarea
                  placeholder="Comments / Questions"
                  className="bg-white w-full min-h-[120px] p-3 rounded-lg text-black"
                />
              </div>
            </div>

            <p className="text-white pt-5 text-sm">
              By filling this form, you have read, understood and agreed to
              Terms and Condition and Privacy Policy
            </p>

            <button className="mt-6 rounded-full bg-gradient-to-r from-pink-700 to-green-400 px-8 py-3 font-semibold text-white hover:scale-105 transition-transform duration-300">
              Send Message
            </button>
          </div>

          {/* RIGHT SIDE ARROW BUTTON */}
          <button
            onClick={() => setOpen(!open)}
            className="hidden md:flex absolute top-1/2 -right-3 bg-black text-white w-20 h-20 rounded-full items-center justify-center text-2xl"
          >
            {open ? <PiLessThanBold /> : <PiGreaterThanBold />}
          </button>

          {/* RIGHT SIDE CONTACT PANEL */}
          {open && (
            <div className="hidden md:block absolute top-62 right-14 bg-white p-6 rounded-lg w-72 shadow-2xl">
              <div className="space-y-5 text-center">
                <Image
                  src="/FBS-LOGO.png"
                  alt="Logo"
                  width={70}
                  height={50}
                  className="mx-auto"
                />

                <div>
                  <FaMapMarkerAlt className="text-pink-700 text-3xl mx-auto" />
                  <p className="font-semibold">Illinois, USA</p>
                </div>

                <div>
                  <FaPhoneAlt className="text-pink-700 text-3xl mx-auto" />
                  <p className="font-semibold">+91 98765 43210</p>
                </div>

                <div>
                  <FaEnvelope className="text-pink-700 text-3xl mx-auto" />
                  <p className="font-semibold">info@example.com</p>
                </div>
              </div>
            </div>
          )}
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
