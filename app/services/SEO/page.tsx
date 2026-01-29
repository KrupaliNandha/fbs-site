"use client";

import Navbar from "@/app/Components/Navbar";
import Footer from "@/app/Components/Footer";
import Image from "next/image";
import { useEffect } from "react";
import "aos/dist/aos.css";
import SmoothScroll from "@/app/Components/SmoothScroll";
import {
  Search,
  Settings,
  Cpu,
  MapPin,
  PenTool,
  Link2,
  BarChart3,
  Eye,
} from "lucide-react";

import PageLoader from "../../Components/Preloader";

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
    { title: "Website Audit & SEO Strategy", icon: Search },
    { title: "On-Page Optimization", icon: Settings },
    { title: "Technical SEO", icon: Cpu },
    { title: "Local SEO", icon: MapPin },
    { title: "Content Creation & Optimization", icon: PenTool },
    { title: "Link Building & Authority Growth", icon: Link2 },
    { title: "Tracking & Reporting", icon: BarChart3 },
    { title: "Competitor Analysis", icon: Eye },
  ];

  const steps = [
    {
      image: "/icons/Website Audit & SEO Strategy.png",
      title: "Website Audit & SEO Strategy",
      desc: "We start with a complete website audit to identify opportunities, fix issues, and create a strategy tailored to your goals.",
    },
    {
      image: "/icons/On-Page Optimization.png",
      title: "On-Page Optimization",
      desc: "From keyword research to meta tags, headings, and content improvements, we optimize every page for search engines and users.",
    },
    {
      image: "/icons/Technical SEO.png",
      title: "Technical SEO",
      desc: "Fast-loading, mobile-friendly, and error-free websites perform better in rankings. We handle site speed, indexing, structured data, and technical fixes.",
    },
    {
      image: "/icons/Local SEO.png",
      title: "Local SEO ",
      desc: "Get found by customers near you! We optimize your Google Business Profile, local citations, and location-based keywords so you dominate local searches.",
    },
    {
      image: "/icons/Content Creation & Optimization.png",
      title: "Content Creation & Optimization",
      desc: "Get found by customers near you! We optimize your Google Business Profile, local citations, and location-based keywords so you dominate local searches.",
    },
    {
      image: "/icons/Link Building & Authority Growth.png",
      title: "Link Building & Authority Growth",
      desc: "We build high quality backlinks that increase your website’s credibility and push you higher on search engines.",
    },
    {
      image: "/icons/Tracking & Reporting.png",
      title: "Tracking & Reporting",
      desc: "You’ll receive transparent reports that show keyword rankings, traffic growth, and ROI. No fluff, just results.",
    },
    {
      image: "/icons/Tracking & Reporting.png",
      title: "Tracking & Reporting",
      desc: "You’ll receive transparent reports that show keyword rankings, traffic growth, and ROI. No fluff, just results.",
    },
    {
      image: "/icons/competitor-analysis.png",
      title: "Competitor Analysis",
      desc: "We keep an eye on what your competitors are doing online tracking their keywords, backlinks, and strategies so we can position your business a step ahead.",
    },
  ];

  return (
    <>
      <PageLoader />
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
                  SEO
                </p>

                <p className="mt-5 text-gray-600 text-sm sm:text-base leading-relaxed lg:max-w-md text-center lg:text-start">
                  At FBS, we are not just another SEO agency, we are your
                  dedicated partner in achieving online success.
                </p>
              </div>

              {/* RIGHT IMAGE */}
              <div
                data-aos="fade-left"
                className="relative h-[300px] sm:h-[400px] md:h-[480px] lg:h-[560px] order-1 lg:order-2"
              >
                <Image
                  src="/seo-service.jpeg"
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
                  Your Partner in
                  <br />
                  <span className="text-black hover:text-yellow-300">SEO</span>
                  <br />
                  Excellence
                </h2>
              </div>

              {/* Right Content */}
              <div data-aos="fade-left">
                <p className="text-base md:text-lg text-pink-100 leading-relaxed">
                  Having a beautiful website isn’t enough if no one can find it.
                  That’s where our Search Engine Optimization (SEO) services
                  come in. At FBS Prints, we help your business climb the search
                  rankings, attract the right audience, and turn clicks into
                  customers. Whether you’re a small local business or a growing
                  brand, our SEO strategies are tailored to put you ahead of the
                  competition.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section - 3 */}
        <section className="container section-padding mx-auto">
          {/* Heading */}
          <div className="text-center max-w-3xl mx-auto mb-5">
            <h2 className="text-5xl md:text-5xl font-extrabold text-gray-900 leading-tight">
              Our <span className="text-pink-600">SEO Services</span>
            </h2>
            <p className="mt-6 text-xl text-gray-600 font-medium">
              Don’t be afraid to give up the good to go for the great
            </p>
          </div>

          {/* Services */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-5">
            {steps.map((item, i) => (
              <div
                key={i}
                className="group rounded-2xl p-6  hover:shadow-2xl transition duration-300 flex flex-col h-full"
              >
                <div className="flex items-center gap-4 mb-6">
                  {/* Icon */}
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-pink-500 to-pink-600 flex items-center justify-center text-white shadow-md transition-transform duration-300 group-hover:scale-110">
                    <img
                      src={item.image} // your image URL
                      alt={item.title} // accessible alt text
                      className="w-10 h-10 object-contain"
                    />{" "}
                  </div>

                  {/* Title */}
                  <h3 className="text-2xl font-semibold text-gray-900 group-hover:text-pink-600 transition-colors">
                    {item.title}
                  </h3>
                </div>

                {/* Accent line */}
                <div className="w-12 h-[3px] bg-pink-500 mb-4 transition-all duration-300 group-hover:w-16"></div>

                {/* Description */}
                <p className="text-gray-600 text-lg leading-relaxed mt-auto">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Section - 4 */}
        <section className="relative mx-auto">
          <div className="container section-padding mx-auto max-w-6xl relative">
            {/* Image Wrapper */}
            <div className="relative w-full h-[420px] md:h-[520px] rounded-3xl overflow-hidden shadow-2xl">
              {/* Image */}
              <img
                src="/seo-services-2.jpeg"
                alt="SEO Business"
                className="w-full h-full object-cover"
              />

              {/* Dark Overlay for Readability */}
              <div className="absolute inset-0 bg-black/40"></div>

              {/* Text ON Image */}
              <div className="absolute inset-0 flex items-center justify-center px-6 md:px-12">
                <div className="max-w-4xl text-white">
                  <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-4 leading-tight">
                    Why SEO Matters for Your Business
                  </h2>

                  <p className="text-base md:text-2xl leading-relaxed text-center text-white/100">
                    90% of online experiences start with a search engine. If
                    you&apos;re not on the first page of Google, you&apos;re
                    losing business. SEO builds trust, visibility, and long-term
                    growth.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section - 5 */}
        <section className="container section-padding">
          <div>
            <h1 className="text-center text-5xl font-bold text-pink-700">
              Do not wait – start your SEO journey with FBS PRINTING now!
            </h1>
          </div>
          <div className="max-w-4xl mx-auto px-4">
            <p className="text-center text-xl md:text-2xl font-medium text-gray-700 leading-relaxed pt-8">
              Feel free to adapt and customize this content to best represent
              <span className="font-semibold text-gray-900"> FBS PRINTING</span>
              &apos;s unique services, values, and branding.
            </p>
          </div>
        </section>

        <Footer />
      </SmoothScroll>
    </>
  );
}
