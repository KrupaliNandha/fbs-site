"use client";

import type {
  RelatedServiceLink,
  ServiceLocationPage,
} from "@/app/lib/service-location-pages";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import "aos/dist/aos.css";
import { serviceAreas } from "@/app/data/service-areas-data";

export default function ServiceLocationPageClient({
  page,
  relatedServices,
}: {
  page: ServiceLocationPage;
  relatedServices: RelatedServiceLink[];
}) {
  const [loaderDone, setLoaderDone] = useState(false);
  const matchingServiceArea = serviceAreas.find(
    (sa) => sa.name.toLowerCase() === page.location.city.toLowerCase()
  );

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

  return (
    <>
      <main>
        <section className="bg-gradient-to-br from-gray-50 to-blue-50">
          <div className="container">
            <div className="mx-auto">
              <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                <div
                  data-aos="fade-right"
                  className="flex flex-col justify-center text-center lg:text-left space-y-5"
                >
                  <div className="flex justify-center lg:justify-start">
                    <div className="inline-flex items-center gap-3 bg-pink-50 text-pink-500 px-5 py-2 rounded-full shadow-lg">
                      <span className="w-2 h-2 bg-pink-400 rounded-full animate-pulse" />
                      <span className="text-[11px] font-bold uppercase tracking-widest">
                        {page.heroBadge}
                      </span>
                    </div>
                  </div>

                  <h1
                    className="font-semibold text-gray-950 leading-tight tracking-tight
    text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl"
                  >
                    {page.heroTitle}
                  </h1>

                  <p className="text-gray-600 text-lg">
                    <Link href="/" className="text-pink-600 hover:underline">
                      Home
                    </Link>
                    <span className="mx-2">&gt;</span>
                    <Link
                      href={page.service.basePath}
                      className="text-pink-600 hover:underline"
                    >
                      {page.service.routeLabel}
                    </Link>
                    <span className="mx-2">&gt;</span>
                    <span className="text-gray-800 font-semibold">
                      {page.location.city}, {page.location.stateCode}
                    </span>
                  </p>

                  <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto lg:mx-0">
                    {page.heroDescription}
                  </p>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
                    <Link href="/contact">
                      <button className="group inline-flex items-center gap-3 bg-pink-700 text-white px-8 py-4 rounded-full font-semibold shadow-lg transition-all duration-300">
                        Request A Quote
                        <span className="transform transition-transform duration-300 group-hover:translate-x-1">
                          →
                        </span>
                      </button>
                    </Link>
                    <Link
                      href={page.service.basePath}
                      className="inline-flex items-center justify-center gap-3 border border-pink-200 bg-white text-pink-700 px-8 py-4 rounded-full font-semibold shadow-sm transition-all duration-300 hover:border-pink-400"
                    >
                      View Main Service Page
                    </Link>
                  </div>
                </div>

                <div className="relative">
                  <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-100 rounded-full opacity-50 blur-2xl" />
                  <div className="absolute bottom-20 -left-10 w-60 h-60 bg-pink-100 rounded-full opacity-50 blur-3xl" />
                  <div className="absolute top-32 right-10 w-32 h-32 bg-purple-100 rounded-full opacity-50 blur-2xl" />

                  <div className="relative grid grid-cols-3 sm:grid-cols-3 gap-3 sm:gap-4">
                    <div className="col-span-1 space-y-4 sm:space-y-6 sm:mt-16">
                      <div className="rounded-2xl aspect-square overflow-hidden relative float-1">
                        <Image
                          src={page.service.heroImages[0]}
                          alt={`${page.service.routeLabel} for ${page.location.city}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </div>

                    <div className="col-span-1 space-y-4 sm:space-y-6 sm:mt-40">
                      <div className="rounded-2xl aspect-square overflow-hidden relative float-2">
                        <Image
                          src={page.service.heroImages[1]}
                          alt={`${page.location.city} ${page.service.routeLabel}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </div>

                    <div className="col-span-1 space-y-6 sm:mt-16">
                      <div className="rounded-2xl aspect-square overflow-hidden relative float-1">
                        <Image
                          src={page.service.heroImages[2]}
                          alt={`${page.service.routeLabel} visual example for ${page.location.city}, ${page.location.stateCode}`}
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

        <section className="container section-padding">
          <div className="bg-gradient-to-r from-pink-600 to-pink-700 rounded-2xl px-6 py-12 text-white">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center max-w-7xl mx-auto">
              <div data-aos="fade-right">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight text-center lg:text-start">
                  {page.supportTitle}
                </h2>
              </div>

              <div data-aos="fade-left">
                <p className="text-base md:text-lg text-pink-100 leading-relaxed text-center lg:text-start">
                  {page.supportDescription}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="container section-padding">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
              {page.highlightsTitle}
            </h2>
            <p className="mt-4 sm:mt-6 text-base sm:text-lg md:text-xl text-gray-600 font-medium">
              Service options built for practical local campaigns and repeat use.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8">
            {page.service.highlights.map((highlight) => (
              <div
                key={highlight.title}
                className="group rounded-2xl p-6 bg-white hover:shadow-xl transition duration-300 flex flex-col h-full"
              >
                <div className="relative w-full h-[220px] rounded-2xl overflow-hidden mb-5">
                  <Image
                    src={highlight.image}
                    alt={highlight.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 group-hover:text-pink-600 transition-colors">
                  {highlight.title}
                </h3>
                <div className="w-10 h-[3px] bg-pink-500 my-4 transition-all duration-300 group-hover:w-16" />
                <p className="text-gray-600 text-base sm:text-lg leading-relaxed mt-auto">
                  {highlight.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="container section-padding">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-3xl p-8 shadow-lg">
              <h2 className="text-3xl md:text-4xl font-bold text-pink-700 mb-6">
                {page.benefitsTitle}
              </h2>
              <div className="grid gap-5">
                {page.service.benefits.map((benefit) => (
                  <div
                    key={benefit.title}
                    className="rounded-2xl border border-pink-100 bg-pink-50/60 p-5"
                  >
                    <h3 className="text-xl font-semibold text-gray-900">
                      {benefit.title}
                    </h3>
                    <p className="mt-2 text-gray-600 leading-relaxed">
                      {benefit.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-8">
              <div className="bg-white rounded-3xl p-8 shadow-lg">
                <h2 className="text-3xl md:text-4xl font-bold text-pink-700 mb-6">
                  About the {page.location.city} market
                </h2>
                <p className="text-gray-600 leading-relaxed text-base sm:text-lg">
                  {page.location.marketSummary}
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  {page.location.nearbyAreas.map((area) => (
                    <span
                      key={area}
                      className="inline-flex items-center rounded-full bg-pink-100 px-4 py-2 text-sm font-semibold text-pink-700"
                    >
                      {area}
                    </span>
                  ))}
                </div>
                {matchingServiceArea && (
                  <div className="mt-6 pt-6 border-t border-gray-100">
                    <Link
                      href={`/service-areas/${matchingServiceArea.slug}`}
                      className="inline-flex items-center gap-2 text-pink-700 font-bold hover:text-pink-800 transition-colors"
                    >
                      Explore All local services in {page.location.city} →
                    </Link>
                  </div>
                )}
              </div>

              <div className="bg-white rounded-3xl p-8 shadow-lg">
                <h2 className="text-3xl md:text-4xl font-bold text-pink-700 mb-6">
                  Common local project needs
                </h2>
                <div className="grid gap-3">
                  {page.location.businessNeeds.map((need) => (
                    <div
                      key={need}
                      className="flex items-center gap-4 border-b pb-4 group hover:translate-x-2 transition-all duration-300"
                    >
                      <div className="w-11 h-11 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center text-xl font-bold">
                        +
                      </div>
                      <h3 className="text-lg font-semibold text-gray-800 group-hover:text-pink-600">
                        {need}
                      </h3>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="container section-padding">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
              Other services in {page.location.city}, {page.location.stateCode}
            </h2>
            <p className="mt-4 text-base sm:text-lg md:text-xl text-gray-600 font-medium">
              Internal links that help visitors explore related support in the same city.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8">
            {relatedServices.map((service) => (
              <Link
                key={service.href}
                href={service.href}
                className="group rounded-2xl p-6 bg-white hover:shadow-xl transition duration-300 flex flex-col h-full"
              >
                <div className="relative w-full h-[220px] rounded-2xl overflow-hidden mb-5">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 group-hover:text-pink-600 transition-colors">
                  {service.title}
                </h3>
                <div className="w-10 h-[3px] bg-pink-500 my-4 transition-all duration-300 group-hover:w-16" />
                <p className="text-gray-600 text-base sm:text-lg leading-relaxed mt-auto">
                  {service.description}
                </p>
              </Link>
            ))}
          </div>
        </section>

        <section className="container section-padding">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
              FAQs for {page.service.routeLabel.toLowerCase()} in {page.location.city}
            </h2>
            <p className="mt-4 text-base sm:text-lg md:text-xl text-gray-600 font-medium">
              Clear answers for common local questions about scope, process, and next steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {page.faqs.map((faq) => (
              <div
                key={faq.question}
                className="rounded-2xl p-6 bg-white shadow-lg"
              >
                <h3 className="text-xl font-semibold text-gray-900">
                  {faq.question}
                </h3>
                <p className="mt-3 text-gray-600 leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="container section-padding">
          <div className="bg-gradient-to-r from-pink-600 to-pink-700 rounded-2xl px-6 py-12 text-white text-center">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
              {page.ctaTitle}
            </h2>
            <p className="max-w-3xl mx-auto mt-5 text-base md:text-lg text-pink-100 leading-relaxed">
              {page.ctaDescription} {page.location.ctaNote}
            </p>
            <div className="pt-8">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-pink-700 font-semibold shadow-lg transition-all duration-300 hover:scale-105"
              >
                Contact Us →
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
