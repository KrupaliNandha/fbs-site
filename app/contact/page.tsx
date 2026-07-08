"use client";

import Navbar from "@/app/Components/Navbar";
import Footer from "@/app/Components/Footer";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import "aos/dist/aos.css";
import Slider from "../Components/Slider";
import Link from "next/link";
import ContactFormSubmit, {
  type SubmissionState,
} from "../Components/ContactFormSubmit";
import FloatingToast from "../Components/FloatingToast";

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
  const [loaderDone, setLoaderDone] = useState(false);
  const [toastState, setToastState] = useState<SubmissionState>({
    type: "idle",
    message: "",
  });
  const [showToast, setShowToast] = useState(false);
  const toastTimerRef = useRef<number | null>(null);

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

  useEffect(() => {
    return () => {
      if (toastTimerRef.current !== null) {
        window.clearTimeout(toastTimerRef.current);
      }
    };
  }, []);

  function handleSubmissionStateChange(state: SubmissionState) {
    setToastState(state);

    if (toastTimerRef.current !== null) {
      window.clearTimeout(toastTimerRef.current);
    }

    if (state.type === "idle") {
      setShowToast(false);
      return;
    }

    setShowToast(true);
    toastTimerRef.current = window.setTimeout(() => {
      setShowToast(false);
    }, 3500);
  }

  return (
    <>
      <FloatingToast submissionState={toastState} visible={showToast} />
      <Navbar />
      <main>
        {/* Section - 1 */}
        <section className="bg-gradient-to-br mt-24 xl:mt-20 from-gray-50 to-blue-50">
          <div className="container">
            <div className="mx-auto">
              <p className="text-gray-600">
                <Link
                  href="/"
                  className="text-pink-600 text-lg"
                >
                  Home
                </Link>
                <span className="mx-2 text-lg">&gt;</span>
                <Link
                  href="/about"
                  className="text-gray-800 text-lg"
                >
                  Contact US
                </Link>
              </p>
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
                    Contact
                    <span className="text-pink-700"> US</span>
                  </h1>

                  {/* Description */}
                  <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto lg:mx-0">
                    Feel free to get in touch with us using the contact form
                    provided below. We will reply to your inquiry as quickly as
                    possible.
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
                          src="/images/contact/business-communication-office.webp"
                          alt="Business communication workspace"
                          fill
                          className="object-cover"
                        />
                      </div>
                    </div>

                    {/* Column 2 (Center) */}
                    <div className="col-span-1 space-y-4 sm:space-y-6 sm:mt-40">
                      <div className="rounded-2xl aspect-square overflow-hidden relative float-2">
                        <Image
                          src="/images/contact/contact-support-hero.webp"
                          alt="FBS Prints customer support representative"
                          fill
                          className="object-fix"
                        />
                      </div>
                    </div>

                    {/* Column 3 – hidden on mobile */}
                    <div className="col-span-1 space-y-6 sm:mt-16 ">
                      <div className="rounded-2xl aspect-square overflow-hidden relative float-1">
                        <Image
                          src="/images/contact/customer-support-team.webp"
                          alt="Customer support team"
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
                    Serving Naperville & Schaumburg, IL
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
                    src="https://www.google.com/maps?q=Illinois,USA&output=embed"
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

              <ContactFormSubmit
                variant="contact"
                onSubmissionStateChange={handleSubmissionStateChange}
              />
            </div>
          </div>
        </section>

        {/* Section - 3 */}
        <section className=" section-padding mx-auto">
          <Image
            src="/images/contact/global-business-illustration.webp"
            alt="Global business illustration"
            width={1500}
            height={500}
            className="w-full h-auto"
          />
        </section>

        <Slider />
      </main>
      <Footer />
    </>
  );
}
