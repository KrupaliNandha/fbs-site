"use client";

import Image from "next/image";
import Link from "next/link";
import Navbar from "@/app/Components/Navbar";
import Footer from "@/app/Components/Footer";
import {
  Mail,
  Search,
  PenTool,
  TrendingUp,
  Code2,
  Share2,
  LayoutGrid,
  ShoppingCart,
  Store,
  Check,
  type LucideIcon,
} from "lucide-react";
import SmoothScroll from "@/app/Components/SmoothScroll";

interface Service {
  slug: string;
  title: string;
  icon: string;
  img: string;
  description: string;
  features: string[];
  highlight: string;
}

const iconMap: Record<string, LucideIcon> = {
  Mail,
  Search,
  PenTool,
  TrendingUp,
  Code2,
  Share2,
  LayoutGrid,
  ShoppingCart,
  Store,
};

export default function WebDesignDetails({ service }: { service: Service }) {
  const Icon = iconMap[service.icon] ?? LayoutGrid;

  return (
    <>
      <SmoothScroll children={undefined} />
      <Navbar />
      <div className="bg-white mt-24">
        {/* Breadcrumb */}
        <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-8 text-sm">
          <Link href="/" className="text-pink-600">
            Home
          </Link>
          <span className="mx-2 text-gray-400">&gt;</span>
          <Link href="/services/web-design" className="text-pink-600">
            Web Designing
          </Link>
          <span className="mx-2 text-gray-400">&gt;</span>
          <span className="text-gray-800 font-semibold">{service.title}</span>
        </div>

        {/* Hero: framed image with floating highlight badge + content */}
        <section className="max-w-7xl mx-auto px-4 sm:px-8 pt-10 pb-16 relative overflow-hidden">
          <div className="absolute -top-20 -left-24 w-72 h-72 bg-pink-100 rounded-full blur-3xl opacity-50 -z-10" />
          <div className="absolute top-40 -right-24 w-80 h-80 bg-purple-100 rounded-full blur-3xl opacity-50 -z-10" />

          <div className="grid lg:grid-cols-[1.3fr_1fr] gap-12 lg:gap-16 items-start">
            <div className="lg:sticky lg:top-6">
              <div className="relative">
                <div className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl ring-1 ring-black/5">
                  <Image
                    src={service.img}
                    alt={service.title}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>

                <div className="absolute -bottom-6 left-6 right-6 sm:left-8 sm:right-auto sm:w-[85%] bg-white rounded-2xl shadow-xl px-6 py-4 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-pink-50 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-pink-600" strokeWidth={2} />
                  </div>
                  <p className="text-sm sm:text-base font-semibold text-gray-800 leading-snug">
                    {service.highlight}
                  </p>
                </div>
              </div>
            </div>

            <div>
              <span className="inline-block text-xs font-bold tracking-widest uppercase text-pink-600 bg-pink-50 px-3 py-1 rounded-full mb-5">
                Digital Solution
              </span>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight mb-6">
                <span className="bg-gradient-to-r from-pink-600 via-fuchsia-600 to-purple-700 bg-clip-text text-transparent">
                  {service.title}
                </span>
              </h1>

              <p className="text-gray-600 leading-relaxed mb-8 sm:mb-10">
                {service.description}
              </p>

              <h2 className="text-lg font-bold text-gray-900 mb-4">
                What&apos;s included
              </h2>

              <div className="grid sm:grid-cols-2 gap-3">
                {service.features.map((feature, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 bg-gray-50 border border-gray-100 rounded-xl p-4"
                  >
                    <Check
                      className="w-4 h-4 text-pink-600 mt-1 flex-shrink-0"
                      strokeWidth={3}
                    />
                    <span className="text-sm text-gray-700 leading-snug">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 sm:px-8 pb-20">
          <div className="bg-[#EC3392] rounded-2xl px-8 py-10 sm:px-12 sm:py-12 text-white flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="text-center sm:text-left">
              <h3 className="text-2xl sm:text-3xl font-bold mb-1">
                Ready to get started with {service.title}?
              </h3>
              <p className="text-pink-100">
                Let&apos;s talk about what this looks like for your business.
              </p>
            </div>
            <Link
              href="/contact-us"
              className="whitespace-nowrap bg-white text-pink-600 font-semibold px-6 py-3 rounded-full hover:bg-gray-100 transition-colors"
            >
              Book a Service
            </Link>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}