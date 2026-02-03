"use client";

import Navbar from "@/app/Components/Navbar";
import Footer from "@/app/Components/Footer";
import Image from "next/image";
import { useEffect, useState } from "react";
import "aos/dist/aos.css";
import SmoothScroll from "@/app/Components/SmoothScroll";

import PageLoader from "../../Components/Preloader";

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
      title: "Email Marketing",
      image: "/icons/Email Marketing.png",
      description:
        "Email marketing is a digital marketing strategy that involves sending emails to a group of recipients with the goal of promoting services, building relationships with customers.",
    },
    {
      title: "Search Engine Optimization",
      image: "/icons/Search Engine Optimization.png",
      description:
        "Search Engine Optimization (SEO) is a digital marketing strategy and practice aimed at improving a website’s visibility in (SERPs) for specific keywords or phrases.",
    },
    {
      title: "Content Writing",
      image: "/icons/Content Writing.png",
      description:
        "Content writing is the practice of creating written material with the purpose of conveying information, engaging readers, and achieving specific communication goals.",
    },
    {
      title: "Digital Marketing Strategy",
      image: "/icons/Digital Marketing Strategy.png",
      description:
        "A digital marketing strategy is a comprehensive plan that outlines how a business will use digital channels and platforms to achieve its marketing and business objectives. It can help businesses reach their target effectively.",
    },
    {
      title: "Web Development",
      image: "/icons/Web development.png",
      description:
        "Web design and web development are two distinct but closely related disciplines that work together to create functional and visually appealing websites. Both works together to make final look.",
    },
    {
      title: "Social Media Management",
      image: "/icons/social-media-management.png",
      description:
        "Social media management refers to the process of creating, scheduling, analyzing, and engaging with content posted on social media platforms for businesses, organizations or individuals.",
    },
  ];

  const Digitalexp = [
    { title: "Portfolio Website", img: "/Web-design-1.jpeg" },
    { title: "E-Commerce Website", img: "/web-designs-2.jpeg" },
    { title: "Shopify Stores", img: "/web-design-3.jpeg" },
  ];

  const clientsuccess = [
    {
      title: "FBS created and executed an effective Google advertising plan.",
      description:
        "I recently completely redesigned my website with FBS and was blown away by the results. The designers and programmers on their team were very capable, accommodating, and easy to deal with.",
      name: "John",
      role: "Business Owner",
    },
    {
      title: "Thanks to FBS we are right where we wanted to be.",
      description:
        "It was a true delight to work with FBS. Their staff produced exactly what we needed and was incredibly competent and communicative. Our hazy concepts were transformed into a stunning and useful website by them. Our website design has drawn numerous praises, and we are delighted with the outcome.",
      name: "Sarah",
      role: "Marketing Director",
    },
    {
      title:
        "We doubled our leads & sales within 6 months! We highly recommend them.",
      description:
        "Working with the FBS team has been an incredible investment of our time and money. We doubled our leads and sales within six months! We highly recommend them.",
      name: "Juan Nelson",
    },
  ];

  return (
    <>
      {!loaderDone && <PageLoader onFinish={() => setLoaderDone(true)} />}
      <Navbar />
      <SmoothScroll>
        {/* Section - 1 */}
        <section className="container">
          <div className="relative bg-white rounded-[32px] shadow-xl overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2 items-center">
              {/* LEFT CONTENT */}
              <div
                data-aos="fade-right"
                className=" relative z-10 bg-white border-l-4 border-pink-600 p-5 sm:p-5 md:p-5 lg:p-8 lg:ml-14 lg:-mr-24 rounded-b-[32px] lg:rounded-2xl shadow-lg order-2 lg:order-1"
              >
                <div className="h-1 w-14 bg-pink-600 rounded-full mb-5"></div>

                <p className="mt-5 text-gray-600 font-bold text-4xl md:text-5xl lg:text-6xl text-center lg:text-start">
                  Web <span className="text-pink-700">Designing</span>
                </p>

                <p className="mt-5 text-gray-600 text-sm sm:text-base leading-relaxed lg:max-w-md text-center lg:text-start">
                  At FBS Prints, we create modern, user-friendly websites that
                  not only look great but also work seamlessly across all
                  devices. Our web design blends creativity with functionality -
                  helping your brand stand out, engage visitors, and drive real
                  results.
                </p>
              </div>

              {/* RIGHT IMAGE */}
              <div
                data-aos="fade-left"
                className="relative h-[300px] sm:h-[400px] md:h-[480px] lg:h-[560px] order-1 lg:order-2"
              >
                <Image
                  src="/Web Design-hero.png"
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
                  Our Web Design
                  <br />
                  <span className="text-black hover:text-yellow-300">
                    Is More Than Just An
                  </span>
                  <br />
                  Online Brochure
                </h2>
              </div>

              {/* Right Content */}
              <div data-aos="fade-left">
                <p className="text-base md:text-lg text-pink-100 leading-relaxed">
                  FBS Prints crafts visually striking, responsive, and
                  conversion-focused websites tailored to your brand. From clean
                  layouts to smooth user experiences, we ensure your online
                  presence makes a lasting impact and turns visitors into
                  customers.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section - 3 */}
        <section className="container relative bg-white py-10">
          {/* Soft background shapes */}
          <div className="absolute -top-32 -left-32 w-96 h-96 bg-pink-200 rounded-full blur-3xl opacity-40"></div>
          <div className="absolute top-1/2 -right-32 w-96 h-96 bg-purple-200 rounded-full blur-3xl opacity-40"></div>

          <div className="relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-20 ">
              <div
                data-aos="fade-right"
                className="relative flex justify-center"
              >
                {/* Floating card */}
                <div className="relative">
                  {/* shadow glow */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-pink-500 to-purple-500 blur-2xl opacity-30 rounded-3xl"></div>

                  <Image
                    src="/services-3.2.jpeg"
                    alt="Digital Services"
                    width={900}
                    height={600}
                    priority
                    className="relative rounded-3xl shadow-2xl w-full max-w-full"
                  />

                  {/* Floating stats */}
                  <div
                    data-aos="fade-up"
                    className="absolute -bottom-10 -left-6 bg-white rounded-2xl shadow-xl px-6 py-4"
                  >
                    <p className="text-xl">Business Growth</p>
                  </div>

                  <div
                    data-aos="fade-down"
                    className="absolute -top-4 -right-6 bg-white rounded-2xl shadow-xl px-6 py-4"
                  >
                    <p className="text-xl">Digital Solutions</p>
                  </div>
                </div>
              </div>

              {/* right CONTENT */}
              <div
                data-aos="fade-left"
                className="space-y-8 text-center lg:text-left"
              >
                <h1 className="text-4xl lg:text-6xl font-extrabold leading-tight text-gray-900">
                  We help brands{" "}
                  <span className="bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                    you take your business
                  </span>{" "}
                  to the next level
                </h1>

                <p className="text-xl text-gray-600 max-w-3xl mx-auto lg:mx-0">
                  we go beyond design – we build digital solutions that fuel
                  growth. Whether you need a powerful website, stronger online
                  visibility, or better customer engagement, our team helps you
                  create an online presence that drives sales and builds trust.
                  With the right blend of creativity, strategy, and technology,
                  we’ll take your business to the next level and keep you ahead
                  of the competition.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section - 4 */}
        <section className="container section-padding relative bg-white overflow-hidden">
          <div className=" mx-auto">
            {/* HEADING */}
            <div className="max-w-4xl mx-auto text-center mb-10">
              <h2 className="text-4xl md:text-5xl font-extrabold text-pink-700 leading-tight">
                Unique{" "}
                <span className="bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                  Bespoke Digital{" "}
                </span>
                Solutions
              </h2>

              <p className="mt-6 text-gray-600 text-lg leading-relaxed">
                We craft responsive, SEO-optimized, and scalable digital
                experiences. Our services combine design, development, and
                marketing to build a strong online presence.
              </p>
            </div>

            {/* SERVICES GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((item, index) => (
                <div
                  key={index}
                  className="group relative rounded-2xl bg-white border border-gray-200 p-8
          shadow-sm hover:shadow-xl hover:shadow-yellow-50 hover:-translate-y-1
          transition-all duration-300"
                >
                  {/* TOP ACCENT */}
                  <span
                    className="absolute top-0 left-0 h-1 w-0 bg-yellow-400 
            group-hover:w-full transition-all duration-300 rounded-t-2xl"
                  />

                  {/* ICON */}
                  <div
                    className="mb-6 w-20 h-20 p-3 rounded-xl bg-yellow-400/15
            flex items-center justify-center"
                  >
                    <Image
                      src={item.image}
                      alt={item.title}
                      width={50}
                      height={26}
                    />
                  </div>

                  {/* TITLE */}
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {item.title}
                  </h3>

                  {/* DESCRIPTION */}
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section - 5 */}
        <section
          data-aos="fade-up"
          className="container section-padding bg-white"
        >
          <div className="pt-5 space-y-6 mb-12 max-w-7xl mx-auto">
            <p className="text-center text-3xl lg:text-4xl xl:text-5xl font-bold mx-auto text-pink-700">
              &quot;Designing{" "}
              <span className="bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                Digital Experiences That Captivate, Inspire, And Leave a Lasting
              </span>{" "}
              Impression.&quot;
            </p>
            <p className="text-xl text-center font-semibold">
              Our commitment is to deliver web design solutions that not only
              meet but exceed our clients expectations, helping them achieve
              their online goals and stand out in the digital landscape.
            </p>
          </div>

          <div className="pt-7">
            <div className="px-4">
              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {Digitalexp.map((item, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-2xl p-4 text-center shadow-[0_20px_40px_rgba(0,0,0,0.08)] hover:-translate-y-2 hover:shadow-[0_30px_60px_rgba(0,0,0,0.12)] transition-all duration-300"
                  >
                    <div className="relative w-full h-[250px] rounded-xl overflow-hidden">
                      <Image
                        src={item.img}
                        alt={item.title}
                        fill
                        className="object-cover h-full w-full"
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
        </section>

        {/* Section - 6 */}
        <section className="container section-padding relative bg-white">
          <div className="mx-auto">
            {/* HEADING */}
            <div className="max-w-5xl mx-auto text-center mb-10">
              <h2 className="text-4xl md:text-5xl font-extrabold text-pink-700 tracking-tight">
                Our Clients’{" "}
                <span className="bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent relative">
                  Success
                  <span className="absolute -bottom-2 left-0 w-full h-1 bg-pink-200 rounded-full"></span>
                </span>{" "}
                Is Our Success
              </h2>

              <p className="mt-6 text-gray-600 text-lg md:text-xl leading-relaxed">
                We build intuitive, high-performing digital experiences for
                businesses of all sizes. From strategy and design to development
                and optimization, everything we do is focused on real growth and
                measurable results.
              </p>
            </div>

            {/* TESTIMONIAL GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10 pt-5">
              {clientsuccess.map((item, index) => (
                <div
                  key={index}
                  className="group relative bg-white rounded-3xl p-10
      border border-gray-200 shadow-sm
      hover:-translate-y-2 hover:shadow-2xl
      transition-all duration-300"
                >
                  {/* SUCCESS ICON IMAGE (instead of quote) */}
                  <div
                    className="absolute -top-10 left-8 w-18 h-18 rounded-full
        bg-white shadow-lg flex items-center justify-center"
                  >
                    <Image
                      src="/icons/Success.png" // ✔ success icon image
                      alt="Success"
                      width={35}
                      height={35}
                      className="h-15 w-15"
                    />
                  </div>

                  {/* TITLE */}
                  <p className="mt-6 text-lg font-semibold text-gray-900 mb-4 leading-snug">
                    {item.title}
                  </p>

                  {/* DESCRIPTION */}
                  <p className="text-gray-600 leading-relaxed mb-8">
                    {item.description}
                  </p>

                  {/* AUTHOR */}
                  <div className="pt-6 border-t border-gray-100">
                    <p className="text-pink-700 font-semibold text-xl">
                      {item.name}
                    </p>
                    <p className="text-lg text-gray-500">{item.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <Footer />
      </SmoothScroll>
    </>
  );
}
