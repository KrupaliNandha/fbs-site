"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import portfolioData from "../../data/portfolio-content.json";

export interface PortfolioItem {
  id: string;
  slug: string;
  category: string;
  title: string;
  coverImage: string;
  images: string[];
  link: string;
  description: string;
  features: string[];
  idealFor: string[];
  material: string | null;
  popular: boolean;
  seoTitle: string;
  tags: string[];
  sizeRange: string | null;
  turnaroundDays: string | null;
  warranty: string | null;
  relatedSlugs: string[];
  faqs: { q: string; a: string }[];
  colorOptions: string | null;
  maintenanceTip: string | null;
  processSteps: { step: number; title: string; detail: string }[];
  whyChooseUs: string[];
  pricingNote: string;
  cta: string;
  specTable: { label: string; value: string }[];
  testimonials: {
    quote: string;
    author: string;
    role: string;
    rating: number;
  }[];
}

export default function OurWorkDetailClient({ item }: { item: PortfolioItem }) {
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    const initAOS = async () => {
      const AOS = (await import("aos")).default;
      AOS.init({ duration: 1000, once: true, easing: "ease-in-out" });
    };
    initAOS();
  }, []);

  const data = portfolioData as PortfolioItem[];
  const relatedItems = data.filter((p) => item.relatedSlugs.includes(p.slug));

  return (
    <main>
      {/* Section - 1: Hero */}
      <section className="bg-gradient-to-br mt-24 xl:mt-20 from-white to-primary-light">
        <div className="container">
          <div className="mx-auto py-10">
            <p className="text-primary-dark/70 mb-6">
              <Link href="/" className="text-primary text-lg">
                Home
              </Link>
              <span className="mx-2 text-lg">&gt;</span>
              <Link href="/our-work" className="text-primary text-lg">
                Our Work
              </Link>
              <span className="mx-2 text-lg">&gt;</span>
              <span className="text-primary-dark text-lg">{item.title}</span>
            </p>

            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
              <div className="flex flex-col gap-4">
                <div className="relative rounded-2xl overflow-hidden aspect-video shadow-xl">
                  <Image
                    key={activeImage}
                    src={item.images[activeImage] || item.images[0]}
                    alt={`${item.title} - image ${activeImage + 1}`}
                    fill
                    priority
                    className="object-cover transition-opacity duration-500"
                  />
                </div>

                {item.images.length > 1 && (
                  <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                    {item.images.map((img, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveImage(i)}
                        className={`relative flex-shrink-0 w-18 h-18 sm:w-20 sm:h-20 rounded-xl overflow-hidden border-2 transition-all ${
                          activeImage === i
                            ? "border-primary scale-105 shadow-md"
                            : "border-transparent opacity-70 hover:opacity-100"
                        }`}
                      >
                        <Image
                          src={img}
                          alt={`${item.title} thumbnail ${i + 1}`}
                          fill
                          className="object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}

                {item.idealFor.length > 0 && (
                  <div className="bg-white rounded-2xl p-4 sm:p-5 mt-6 flex flex-wrap items-center gap-4 sm:gap-8 shadow-sm">
                    <div className="flex items-center gap-2 text-primary-dark uppercase tracking-widest text-[11px] font-bold shrink-0">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                        />
                      </svg>
                      <span>Ideal For</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                      {item.idealFor.map((audience, i) => (
                        <span
                          key={i}
                          className="px-4 py-1.5 rounded-full bg-primary/5 text-primary font-medium text-[13px] sm:text-sm"
                        >
                          {audience}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-col justify-center text-center lg:text-left space-y-5 lg:sticky lg:top-32">
                <p className="text-primary font-semibold uppercase tracking-wide text-sm">
                  {item.category}
                </p>
                <h1 className="font-semibold text-primary-dark leading-tight tracking-tight text-4xl sm:text-5xl md:text-6xl">
                  {item.title}
                </h1>
                <p className="text-primary-dark/70 text-base sm:text-lg max-w-2xl mx-auto lg:mx-0">
                  {item.description}
                </p>

                {item.features.length > 0 && (
                  <div className="text-left mx-auto lg:mx-0 max-w-2xl pt-2 pb-2">
                    <h3 className="text-lg font-bold text-primary-dark mb-4">
                      Features
                    </h3>
                    <ul className="space-y-2">
                      {item.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <span className="mt-2 w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                          <span className="text-primary-dark/80 text-sm">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="flex justify-center lg:justify-start pt-2">
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-2 rounded-full bg-primary px-8 py-3 text-white font-semibold shadow-lg hover:scale-105 transition-all duration-300"
                  >
                    Get a Free Quote
                    <span>→</span>
                  </Link>
                </div>

                {item.maintenanceTip && (
                  <div className="mt-8 p-6 rounded-xl bg-primary/5 border border-black text-left">
                    <p className="text-sm font-bold text-primary mb-1 uppercase tracking-wider">
                      Maintenance Tip
                    </p>
                    <p className="text-primary-dark/80 text-sm leading-relaxed">
                      {item.maintenanceTip}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section - 2: Specifications (Redesigned & Moved) */}
      {item.specTable.length > 0 && (
        <section className="container pt-12 md:pt-16">
        <h2 className="text-primary text-center text-4xl md:text-5xl font-bold mb-12">
            Technical{" "}
            <span className="bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent">
              Specifications
            </span>
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-6 w-full">
            {item.specTable.map((spec, i) => (
              <div
                key={i}
                className="h-full flex flex-col justify-center bg-white border border-primary-light/50 rounded-2xl p-5 text-center shadow-sm hover:shadow-md transition-all duration-300"
              >
                <p className="text-primary text-xs font-bold uppercase tracking-wide mb-2">
                  {spec.label}
                </p>
                <p className="font-semibold text-primary-dark text-sm leading-snug">
                  {spec.value}
                </p>
              </div>
            ))}
          </div>

          {item.pricingNote && (
            <p className="text-center text-primary-dark/70 max-w-3xl mx-auto mt-10 text-sm">
              {item.pricingNote}
            </p>
          )}
        </section>
      )}

      {/* Section - 3: Why Choose Us */}
      {item.whyChooseUs.length > 0 && (
        <section className="container pt-12 md:pt-16">
          <div className="bg-white rounded-2xl p-8 md:p-12 border border-black max-w-5xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center text-primary-dark">
              Why Choose Us
            </h2>
            <div className="grid sm:grid-cols-3 gap-6 md:gap-8 text-center">
              {item.whyChooseUs.map((point, i) => (
                <div key={i} className="flex flex-col items-center">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-primary/5 mb-4 flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-5 h-5 text-primary"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <p className="text-primary-dark font-medium text-[13px] md:text-sm leading-relaxed max-w-[250px] mx-auto">
                    {point}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Section - 5: Process Steps */}
      {item.processSteps.length > 0 && (
        <section className="container section-padding">
          <h2 className="text-primary text-center text-4xl md:text-5xl font-bold mb-12">
            How{" "}
            <span className="bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent">
              It Works
            </span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {item.processSteps.map((step) => (
              <div
                key={step.step}
                className="group bg-white rounded-2xl p-8 text-center shadow-lg hover:shadow-2xl transition-all duration-300"
              >
                <div className="mx-auto mb-6 h-14 w-14 rounded-full bg-primary text-white flex items-center justify-center text-xl font-bold group-hover:scale-110 transition">
                  {step.step}
                </div>
                <h3 className="text-xl font-semibold mb-4 text-primary-dark">
                  {step.title}
                </h3>
                <p className="text-primary-dark/70 text-sm leading-relaxed">
                  {step.detail}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Section - 6: Testimonials */}
      {item.testimonials.length > 0 && (
        <section className="container section-padding">
          <h2 className="text-primary text-center text-4xl md:text-5xl font-bold mb-12">
            What Clients{" "}
            <span className="bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent">
              Say
            </span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {item.testimonials.map((t, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-8 shadow-lg flex flex-col justify-between"
              >
                <div>
                  <div className="flex gap-1 mb-4 text-primary">
                    {Array.from({ length: t.rating }).map((_, idx) => (
                      <span key={idx}>★</span>
                    ))}
                  </div>
                  <p className="text-primary-dark/80 italic leading-relaxed">
                    “{t.quote}”
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-primary-dark/10">
                  <p className="font-semibold text-primary-dark">{t.author}</p>
                  <p className="text-sm text-primary-dark/60">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Section - 7: FAQs */}
      {item.faqs.length > 0 && (
        <section className="container section-padding">
          <h2 className="text-primary text-center text-4xl md:text-5xl font-bold mb-12">
            Frequently Asked{" "}
            <span className="bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent">
              Questions
            </span>
          </h2>

          <div className="max-w-3xl mx-auto space-y-4">
            {item.faqs.map((faq, i) => (
              <details
                key={i}
                className="group bg-white rounded-2xl p-6 shadow-md open:shadow-lg transition-all"
              >
                <summary className="flex justify-between items-center cursor-pointer font-semibold text-primary-dark list-none">
                  {faq.q}
                  <span className="text-primary text-xl group-open:rotate-45 transition-transform">
                    +
                  </span>
                </summary>
                <p className="text-primary-dark/70 mt-4 leading-relaxed">
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </section>
      )}

      {/* Section - 8: Related Work */}
      {relatedItems.length > 0 && (
        <section className="container py-16 md:py-24">
          <div className="flex justify-between items-end mb-8">
            <h2 className="text-primary-dark text-3xl font-bold">
              Related Work
            </h2>
            <Link
              href="/our-work"
              className="text-primary font-semibold text-sm hover:underline flex items-center gap-1"
            >
              View All Work <span>→</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
            {relatedItems.map((related) => (
              <Link
                key={related.id}
                href={related.link}
                className="group flex flex-col sm:flex-row bg-white rounded-2xl overflow-hidden border border-black hover:shadow-lg transition-all duration-300"
              >
                <div className="relative w-full sm:w-2/5 aspect-[4/3] sm:aspect-auto">
                  <Image
                    src={related.coverImage}
                    alt={related.title}
                    fill
                    sizes="(max-width: 640px) 100vw, 40vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                <div className="p-6 sm:p-8 flex flex-col justify-center w-full sm:w-3/5">
                  <h3 className="text-xl font-bold text-primary mb-3">
                    {related.title}
                  </h3>
                  <p className="text-primary-dark/80 text-[15px] leading-relaxed mb-4 line-clamp-3">
                    {related.description}
                  </p>
                  {related.turnaroundDays && (
                    <p className="text-primary-dark font-bold text-xs">
                      {related.turnaroundDays} day turnaround
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Section - 9: Final CTA */}
      <section className="container section-padding">
        <div className="bg-primary rounded-2xl px-6 py-12 text-white text-center max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{item.cta}</h2>
          <div className="pt-4">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-3 text-primary font-semibold shadow-lg hover:scale-105 transition-all duration-300"
            >
              Get a Free Quote
              <span>→</span>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
