"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import "aos/dist/aos.css";
import portfolioData from "../data/portfolio-content.json";

interface PortfolioItem {
  id: string;
  slug: string;
  category: string;
  title: string;
  coverImage: string;
  link: string;
  description: string;
  popular: boolean;
}

const ITEMS_PER_PAGE = 9;

export default function OurWorkPage() {
  const data = portfolioData as PortfolioItem[];

  const [currentPage, setCurrentPage] = useState<number>(1);

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

  const totalPages = Math.max(1, Math.ceil(data.length / ITEMS_PER_PAGE));

  const paginated = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return data.slice(start, start + ITEMS_PER_PAGE);
  }, [data, currentPage]);

  const heroImages = [
    {
      coverImage: "/images/OurWork_Products/LED_Digital_Signs/LED_Digital_Signs_1.webp",
      title: "Canopies & Awnings",
    },
    {
      coverImage: "/images/OurWork_Products/Custom_Illuminated_Interior_Signs/Custom_Illuminated_Interior_Signs_1.webp",
      title: "Front Lit Channel Letters",
    },
    {
      coverImage: "/images/OurWork_Products/WindowWall_Graphics/WindowWall_Graphics_1.webp",
      title: "Window & Wall Graphics",
    },
  ];

  return (
    <main>
      {/* Section - 1 (Hero, matches About page structure) */}
      <section className="bg-gradient-to-br mt-24 xl:mt-20 from-white to-primary-light">
        <div className="container">
          <div className="mx-auto">
            <p className="text-primary-dark/70">
              <Link href="/" className="text-primary text-lg">
                Home
              </Link>
              <span className="mx-2 text-lg">&gt;</span>
              <span className="text-primary-dark text-lg">Our Work</span>
            </p>

            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 mt-10 lg:mt-0 items-center">
              {/* LEFT CONTENT */}
              <div
                data-aos="fade-right"
                className="flex flex-col justify-center text-center lg:text-left space-y-5"
              >
                <h1
                  className="font-semibold text-primary-dark leading-tight tracking-tight
                  text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl"
                >
                  Our <span className="text-primary">Work</span>
                </h1>

                <p className="text-primary-dark/70 text-base sm:text-lg max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                  Discover our completed custom signage, printing, and branding
                  projects designed to help businesses make a lasting
                  impression. From illuminated signs and vehicle wraps to
                  banners, storefront graphics, and trade show displays, our
                  work reflects over 25 years of expertise, precision, and
                  quality.
                </p>
              </div>

              {/* RIGHT - Image Grid */}
              <div className="relative">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary-light rounded-full opacity-50 blur-2xl"></div>
                <div className="absolute bottom-20 -left-10 w-60 h-60 bg-primary-light rounded-full opacity-50 blur-3xl"></div>
                <div className="absolute top-32 right-10 w-32 h-32 bg-primary-light rounded-full opacity-50 blur-2xl"></div>

                <div className="relative grid grid-cols-3 sm:grid-cols-3 gap-3 sm:gap-4">
                  <div className="col-span-1 space-y-4 sm:space-y-6 sm:mt-16">
                    <div className="rounded-2xl aspect-square overflow-hidden relative float-1">
                      <Image
                        src={heroImages[0]?.coverImage}
                        alt={heroImages[0]?.title || "FBS Signs project"}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>

                  <div className="col-span-1 space-y-4 sm:space-y-6 sm:mt-40">
                    <div className="rounded-2xl aspect-square overflow-hidden relative float-2">
                      <Image
                        src={heroImages[1]?.coverImage}
                        alt={heroImages[1]?.title || "FBS Signs project"}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>

                  <div className="col-span-1 space-y-6 sm:mt-16">
                    <div className="rounded-2xl aspect-square overflow-hidden relative float-1">
                      <Image
                        src={heroImages[2]?.coverImage}
                        alt={heroImages[2]?.title || "FBS Signs project"}
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

      {/* Section - 2 (Category Filter + Grid + Pagination) */}
      <section className="container section-padding">
        {/* Section Heading */}
        <div className="text-center mb-10" data-aos="fade-up">
          <h2 className="text-4xl md:text-5xl font-bold text-primary-dark mb-4">
            Explore Our <span className="text-primary">Portfolio</span>
          </h2>
          <p className="text-primary-dark/70 text-base md:text-lg max-w-2xl mx-auto">
            Browse through our extensive collection of past projects to find
            inspiration for your next signage, printing, or branding project.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {paginated.map((item, index) => (
            <Link
              key={item.id}
              href={item.link}
              data-aos="fade-up"
              data-aos-delay={(index % 3) * 100}
              className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={item.coverImage}
                  alt={item.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />

                <div className="absolute inset-0 bg-black/5 group-hover:bg-black/10 transition-colors duration-300" />
              </div>

              <div className="p-6 flex-grow flex flex-col">
                <h3 className="text-xl font-bold text-primary-dark group-hover:text-primary transition-colors duration-300 mb-3">
                  {item.title}
                </h3>
                <p className="text-primary-dark/70 text-sm line-clamp-3 mb-6 flex-grow">
                  {item.description}
                </p>
                <div className="inline-flex items-center gap-2 text-primary font-bold text-sm transition-colors mt-auto">
                  View Details
                  <ArrowRight className="w-4 h-4 transition group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {paginated.length === 0 && (
          <p className="text-center text-primary-dark/60 mt-10">
            No projects found.
          </p>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-16 border-t border-primary-light pt-8" data-aos="fade-up">
            <div className="flex items-center justify-between gap-3 sm:hidden">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-primary-light bg-white text-primary-dark/80 transition duration-300 hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Previous Page"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>

              <div className="min-w-0 rounded-full bg-white px-5 py-2 text-center text-sm font-bold text-primary-dark shadow-sm border border-primary-light/50">
                Page {currentPage} of {totalPages}
              </div>

              <button
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-primary-light bg-white text-primary-dark/80 transition duration-300 hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Next Page"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>

            <div className="hidden justify-center items-center gap-2 sm:flex">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="flex items-center justify-center w-10 h-10 rounded-full border border-primary-light bg-white text-primary-dark/80 hover:border-primary hover:text-primary disabled:opacity-40 disabled:cursor-not-allowed transition duration-300"
                aria-label="Previous Page"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={`page-${page}`}
                  onClick={() => setCurrentPage(page)}
                  className={`w-10 h-10 rounded-full font-bold text-sm transition duration-300 flex items-center justify-center ${
                    currentPage === page
                      ? "bg-primary text-white shadow-md shadow-primary-light"
                      : "border border-primary-light bg-white text-primary-dark/80 hover:border-primary hover:text-primary"
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="flex items-center justify-center w-10 h-10 rounded-full border border-primary-light bg-white text-primary-dark/80 hover:border-primary hover:text-primary disabled:opacity-40 disabled:cursor-not-allowed transition duration-300"
                aria-label="Next Page"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
