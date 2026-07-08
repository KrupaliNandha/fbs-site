"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
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
  ChevronDown,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";
import servicesData from "@/app/data/web-design.json";

interface Faq {
  q: string;
  a: string;
}

interface Service {
  slug: string;
  title: string;
  icon: string;
  img: string;
  description: string;
  features: string[];
  highlight: string;
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
  longContent?: string;
  faqs?: Faq[];
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

function FaqItem({ faq }: { faq: Faq }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-gray-100 rounded-xl bg-white overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
      >
        <span className="text-sm sm:text-base font-semibold text-gray-900">
          {faq.q}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-pink-600 shrink-0 transition-transform duration-300 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      <div
        className={`grid transition-all duration-300 ease-in-out ${
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <p className="px-5 pb-4 text-sm text-gray-600 leading-relaxed">
            {faq.a}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function WebDesignDetails({ service }: { service: Service }) {
  const Icon = iconMap[service.icon] ?? LayoutGrid;

  const relatedServices = (servicesData as Service[])
    .filter((s) => s.slug !== service.slug)
    .slice(0, 3);

  return (
    <>
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
                <div className="relative w-full aspect-4/3 rounded-3xl overflow-hidden shadow-2xl ring-1 ring-black/5">
                  <Image
                    src={service.img}
                    alt={service.title}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>

                <div className="absolute -bottom-6 left-6 right-6 sm:left-8 sm:right-auto sm:w-[85%] bg-white rounded-2xl shadow-xl px-6 py-4 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-pink-50 flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-pink-600" strokeWidth={2} />
                  </div>
                  <p className="text-sm sm:text-base font-semibold text-gray-800 leading-snug">
                    {service.highlight}
                  </p>
                </div>
              </div>

              {/* Keyword chips - visible SEO signal + quick-scan for visitors */}
              {service.keywords && service.keywords.length > 0 && (
                <div className="hidden lg:flex flex-wrap gap-2 mt-10">
                  {service.keywords.slice(0, 5).map((kw) => (
                    <span
                      key={kw}
                      className="text-xs font-medium text-pink-700 bg-pink-50 border border-pink-100 px-3 py-1.5 rounded-full"
                    >
                      {kw}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div>
              <span className="inline-block text-xs font-bold tracking-widest uppercase text-pink-600 bg-pink-50 px-3 py-1 rounded-full mb-5">
                Digital Solution
              </span>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight mb-6">
                <span className="bg-linear-to-r from-pink-600 via-fuchsia-600 to-purple-700 bg-clip-text text-transparent">
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
                      className="w-4 h-4 text-pink-600 mt-1 shrink-0"
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

        {/* SEO long-form content block */}
        {service.longContent && (
          <section className="max-w-7xl mx-auto px-4 sm:px-8 pb-16">
            <div className="relative rounded-3xl border border-pink-100 bg-linear-to-br from-pink-50 via-white to-purple-50 px-6 py-10 sm:px-10 sm:py-12 overflow-hidden">
              <div className="absolute -bottom-16 -right-16 w-56 h-56 bg-purple-100 rounded-full blur-3xl opacity-40 z-0" />
              <div className="relative max-w-3xl">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
                  Why {service.title} Matters for Your Business
                </h2>
                <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                  {service.longContent}
                </p>
              </div>
            </div>
          </section>
        )}

        {/* FAQ section */}
        {service.faqs && service.faqs.length > 0 && (
          <section className="max-w-7xl mx-auto px-4 sm:px-8 pb-20">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 text-center sm:text-left">
              Frequently Asked Questions
            </h2>
            <div className="space-y-3">
              {service.faqs.map((faq, i) => (
                <FaqItem key={i} faq={faq} />
              ))}
            </div>
          </section>
        )}

        {/* CTA */}
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

        {/* Related services */}
        {relatedServices.length > 0 && (
          <section className="max-w-7xl mx-auto px-4 sm:px-8 pb-24">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">
              Explore More Services
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {relatedServices.map((s) => {
                const RelIcon = iconMap[s.icon] ?? LayoutGrid;
                return (
                  <Link
                    key={s.slug}
                    href={`/services/web-design/${s.slug}`}
                    className="group flex items-start gap-4 bg-gray-50 border border-gray-100 rounded-2xl p-5 hover:border-pink-200 hover:bg-pink-50/50 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center shrink-0">
                      <RelIcon className="w-5 h-5 text-pink-600" strokeWidth={2} />
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-900 text-sm sm:text-base mb-1">
                        {s.title}
                      </p>
                      <span className="inline-flex items-center gap-1 text-xs sm:text-sm text-pink-600 font-medium">
                        Learn more
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </>
  );
}