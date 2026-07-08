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
  ChevronRight,
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

function FaqItem({ faq, index }: { faq: Faq; index: number }) {
  const [open, setOpen] = useState(index === 0);
  return (
    <div className={`group ${index % 2 === 0 ? "bg-white" : "bg-slate-50"}`}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
      >
        <span className="text-sm sm:text-base font-semibold text-slate-900">
          {faq.q}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-[#EC1279] shrink-0 transition-transform duration-300 ${
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
          <p className="px-6 pb-5 text-sm text-slate-600 leading-relaxed">
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
    <main className="bg-white mt-24">
      {/* ============================================================ */}
      {/* SECTION 1 — HERO                                              */}
      {/* ============================================================ */}
      <section className="mt-24 xl:mt-20 relative overflow-hidden">
        <div className="absolute -top-20 -left-24 w-72 h-72 bg-pink-100 rounded-full blur-3xl opacity-50 -z-10" />
        <div className="absolute top-40 -right-24 w-80 h-80 bg-purple-100 rounded-full blur-3xl opacity-50 -z-10" />

        <div className="container">
          {/* Breadcrumb */}
          <p className="text-slate-600 text-base sm:text-lg mb-8">
            <Link href="/" className="text-pink-600 font-medium">
              Home
            </Link>
            <span className="mx-2">&gt;</span>
            <Link
              href="/services/web-design"
              className="text-pink-600 font-medium"
            >
              Web Designing
            </Link>
            <span className="mx-2">&gt;</span>
            <span className="text-slate-800 font-semibold">
              {service.title}
            </span>
          </p>

          <div className="grid lg:grid-cols-[1.3fr_1fr] gap-10 lg:gap-16 items-start">
            {/* LEFT: image + floating highlight + keywords */}
            <div className="lg:sticky lg:top-6">
              <div className="relative w-full aspect-[4/3.2] rounded-3xl overflow-hidden shadow-xl">
                <Image
                  src={service.img}
                  alt={service.title}
                  fill
                  sizes="(min-width: 1024px) 55vw, 90vw"
                  className="object-cover"
                  priority
                />

                {/* Floating caption card */}
                <div className="absolute bottom-5 left-5 right-5 sm:right-auto sm:max-w-lg bg-white rounded-2xl shadow-lg px-6 py-4 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-pink-50 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-pink-600" strokeWidth={2} />
                  </div>
                  <p className="text-gray-900 font-semibold text-sm sm:text-base leading-snug">
                    {service.highlight}
                  </p>
                </div>
              </div>

              {/* Tag pills */}
              {service.keywords && service.keywords.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-5">
                  {service.keywords.slice(0, 5).map((kw) => (
                    <span
                      key={kw}
                      className="px-4 py-1.5 rounded-full bg-pink-50 text-pink-600 text-sm font-medium"
                    >
                      {kw}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* RIGHT: content */}
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
        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION 2 — SEO long-form content block                       */}
      {/* ============================================================ */}
      {service.longContent && (
        <section className="container py-16">
          <div className="relative rounded-3xl border border-pink-100 bg-linear-to-br from-pink-50 via-white to-purple-50 px-6 py-10 sm:px-10 sm:py-12 overflow-hidden shadow-sm">
            <div className="absolute -bottom-16 -right-16 w-56 h-56 bg-purple-100 rounded-full blur-3xl opacity-40 z-0" />
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-pink-100 rounded-full blur-3xl opacity-40 z-0" />

            <div className="relative max-w-3xl mx-auto">
              <span className="inline-block px-3 py-1 rounded-full bg-white text-[#EC1279] text-xs font-bold tracking-wide shadow-sm mb-4">
                WHY IT WORKS
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F1B33]">
                Why {service.title} Matters for Your Business
              </h2>
              <p className="mt-4 text-gray-600 leading-relaxed text-sm sm:text-base">
                {service.longContent}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* ============================================================ */}
      {/* SECTION 3 — FAQ                                               */}
      {/* ============================================================ */}
      {service.faqs && service.faqs.length > 0 && (
        <section className="container pb-16">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-center text-[#0F1B33]">
              Frequently Asked <span className="text-[#EC1279]">Questions</span>
            </h2>
            <p className="text-slate-500 text-center mt-2 mb-8 text-sm sm:text-base">
              Answers to common questions about {service.title.toLowerCase()}.
            </p>

            <div className="rounded-2xl border border-slate-200 overflow-hidden divide-y divide-slate-200">
              {service.faqs.map((faq, i) => (
                <FaqItem key={i} faq={faq} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ============================================================ */}
      {/* SECTION 4 — CTA                                               */}
      {/* ============================================================ */}
      <section className="container pb-16">
        <div className="rounded-3xl bg-[#0F1B33] px-8 py-12 text-center text-white sm:px-12 sm:py-14">
          <div className="mx-auto max-w-2xl">
            <h3 className="text-2xl font-bold">
              Ready to get started with {service.title}?
            </h3>
            <p className="mt-2 text-sm text-slate-300">
              Let&apos;s talk about what this looks like for your business.
            </p>
            <Link
              href="/contact"
              className="mt-6 inline-block rounded-full bg-[#EC1279] px-8 py-3 text-sm font-semibold text-white transition hover:bg-[#D40E6B]"
            >
              Book a Service
            </Link>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION 5 — Explore More Services                             */}
      {/* ============================================================ */}
      {relatedServices.length > 0 && (
        <section className="container py-16">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-center text-[#0F1B33] mb-10">
            Explore More Services
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {relatedServices.map((s) => {
              const RelIcon = iconMap[s.icon] ?? LayoutGrid;
              return (
                <Link
                  key={s.slug}
                  href={`/services/web-design/${s.slug}`}
                  className="group rounded-2xl border border-slate-200 bg-white p-6 transition hover:border-pink-200 hover:shadow-md"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-[#EC1279] flex items-center justify-center flex-shrink-0">
                      <RelIcon className="w-5 h-5 text-white" strokeWidth={2} />
                    </div>
                    <h3 className="text-base font-bold text-[#0F1B33]">
                      {s.title}
                    </h3>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed line-clamp-2">
                    {s.description}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[#EC1279]">
                    Learn more
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              );
            })}
          </div>
        </section>
      )}
    </main>
  );
}
