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
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import servicesData from "@/app/data/web-design.json";

interface Faq {
  q: string;
  a: string;
}

interface ProcessStep {
  step: string;
  description: string;
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
  benefits?: string[];
  process?: ProcessStep[];
  useCases?: string[];
  relatedServices?: string[];
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

function FaqAccordion({ faqs }: { faqs: Faq[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <div className="mx-auto grid max-w-4xl grid-cols-1 gap-3 sm:gap-4">
      {faqs.map((faq, index) => {
        const isOpen = openIndex === index;
        const panelId = `faq-panel-${index}`;
        const buttonId = `faq-button-${index}`;

        return (
          <div
            key={faq.q}
            style={isOpen ? { borderColor: "#EC1279" } : undefined}
            className={`overflow-hidden rounded-xl border-2 transition-all duration-300 sm:rounded-2xl ${isOpen
              ? "bg-white shadow-lg"
              : "border-transparent bg-white shadow-md duration-100 translate-y-0 hover:translate-y-[-2px] hover:shadow-lg"
              }`}
          >
            <h3 className="m-0">
              <button
                id={buttonId}
                type="button"
                onClick={() => toggle(index)}
                aria-expanded={isOpen}
                aria-controls={panelId}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left sm:px-6 sm:py-5"
              >
                <span
                  style={isOpen ? { color: "#EC1279" } : undefined}
                  className="text-sm font-semibold leading-snug text-gray-900 sm:text-base"
                >
                  {faq.q}
                </span>

                <ChevronDown
                  style={isOpen ? { color: "#EC1279" } : undefined}
                  className={`h-5 w-5 shrink-0 text-gray-900 transition-transform duration-300 ${isOpen ? "rotate-180" : ""
                    }`}
                />
              </button>
            </h3>

            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              className={`grid transition-all duration-300 ease-in-out ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                }`}
            >
              <div className="overflow-hidden">
                <p className="px-5 pb-4 text-sm leading-relaxed text-gray-500 sm:px-6 sm:pb-5 sm:text-base">
                  {faq.a}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function WebDesignDetails({ service }: { service: Service }) {
  const Icon = iconMap[service.icon] ?? LayoutGrid;

  const allServices = servicesData as Service[];

  // Use the curated relatedServices slugs from the data when available,
  // falling back to "any other service" only if none were specified.
  const relatedServices = service.relatedServices?.length
    ? service.relatedServices
        .map((slug) => allServices.find((s) => s.slug === slug))
        .filter((s): s is Service => Boolean(s))
        .slice(0, 3)
    : allServices.filter((s) => s.slug !== service.slug).slice(0, 3);

  return (
    <main className="bg-white mt-16">
      {/* ============================================================ */}
      {/* SECTION 1 — HERO                                              */}
      {/* ============================================================ */}
      <section className="mt-24 xl:mt-20 relative overflow-hidden">
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

          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
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
      {/* SECTION 3 — BENEFITS                                          */}
      {/* ============================================================ */}
      {service.benefits && service.benefits.length > 0 && (
        <section className="container pb-16">
          <div className="max-w-3xl mx-auto text-center mb-10">
            <span className="inline-block text-xs font-bold tracking-widest uppercase text-pink-600 bg-pink-50 px-3 py-1 rounded-full mb-4">
              The Payoff
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F1B33]">
              What You Actually Get
            </h2>
            <p className="text-slate-500 mt-2 text-sm sm:text-base">
              The real, lasting benefits of investing in{" "}
              {service.title.toLowerCase()}.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {service.benefits.map((benefit, i) => (
              <div
                key={i}
                className="flex items-start gap-4 rounded-2xl border border-slate-100 bg-slate-50/60 p-5 transition hover:border-pink-100 hover:bg-pink-50/40"
              >
                <div className="w-8 h-8 rounded-lg bg-[#0F1B33] flex items-center justify-center flex-shrink-0">
                  <Sparkles
                    className="w-4 h-4 text-[#EC1279]"
                    strokeWidth={2}
                  />
                </div>
                <p className="text-sm text-slate-700 leading-relaxed">
                  {benefit}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ============================================================ */}
      {/* SECTION 4 — PROCESS                                           */}
      {/* ============================================================ */}
      {service.process && service.process.length > 0 && (
        <section className="container py-16 sm:py-20">
          <div className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-12 sm:px-8 sm:py-16 shadow-sm">
            <div className="max-w-3xl mx-auto text-center mb-14">
              <span className="inline-block text-xs font-bold tracking-widest uppercase text-pink-600 bg-white px-3 py-1 rounded-full mb-4 shadow-sm">
                How We Work
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F1B33]">
                Our {service.title} Process
              </h2>
              <p className="text-slate-500 mt-2 text-sm sm:text-base">
                A clear, step-by-step path from first conversation to results.
              </p>
            </div>
 
            {/* ---- Horizontal row of step boxes, wraps naturally on smaller screens ---- */}
            <div className="grid gap-6 xl:gap-8 sm:grid-cols-2 lg:grid-cols-5 w-full mx-auto">
              {service.process.map((step, i) => (
                <div
                  key={i}
                  className="group relative flex flex-col rounded-2xl border border-slate-200 bg-white pt-8 pb-6 px-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-pink-200"
                >
                  {/* number badge overlapping the top edge of the box */}
                  <div className="absolute -top-5 left-5 flex w-10 h-10 items-center justify-center rounded-xl bg-[#EC1279] text-sm font-bold text-white shadow-md">
                    {String(i + 1).padStart(2, "0")}
                  </div>
 
                  <h3 className="mb-2 text-sm font-bold text-[#0F1B33] sm:text-base">
                    {step.step}
                  </h3>
                  <p className="text-sm leading-relaxed text-slate-500">
                    {step.description}
                  </p>
 
                  {/* connector arrow between boxes on desktop */}
                  {i < service.process!.length - 1 && (
                    <div className="hidden lg:flex absolute top-1/2 -right-3 xl:-right-4 translate-x-1/2 -translate-y-1/2 z-10 w-8 h-8 items-center justify-center rounded-full bg-white border border-slate-200 shadow-sm text-pink-500">
                      <ChevronRight className="w-4 h-4" strokeWidth={3} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ============================================================ */}
      {/* SECTION 5 — USE CASES                                         */}
      {/* ============================================================ */}
      {service.useCases && service.useCases.length > 0 && (
        <section className="container py-16 sm:py-20">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <span className="inline-block text-xs font-bold tracking-widest uppercase text-pink-600 bg-pink-50 px-3 py-1 rounded-full mb-4">
              Is This For You?
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F1B33]">
              Who {service.title} Is Built For
            </h2>
          </div>
 
          <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 max-w-5xl mx-auto">
            {service.useCases.map((useCase, i) => (
              <div
                key={i}
                className="group flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-pink-200 hover:shadow-md"
              >
                <div className="flex w-10 h-10 shrink-0 items-center justify-center rounded-full bg-pink-50 transition-colors duration-300 group-hover:bg-[#EC1279]">
                  <Check
                    className="w-5 h-5 text-[#EC1279] transition-colors duration-300 group-hover:text-white"
                    strokeWidth={2.5}
                  />
                </div>
                <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-medium">
                  {useCase}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ============================================================ */}
      {/* SECTION 6 — FAQ                                               */}
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

            <FaqAccordion faqs={service.faqs} />
          </div>
        </section>
      )}

      {/* ============================================================ */}
      {/* SECTION 7 — CTA                                               */}
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
      {/* SECTION 8 — Explore More Services                             */}
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
