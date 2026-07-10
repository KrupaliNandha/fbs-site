"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { type ServiceAreaCity } from "@/app/data/service-areas-data";
import "aos/dist/aos.css";

interface ServiceAreasClientProps {
  cities: ServiceAreaCity[];
}

export default function ServiceAreasClient({ cities }: ServiceAreasClientProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCities, setFilteredCities] = useState(cities);

  useEffect(() => {
    const initAOS = async () => {
      const AOS = (await import("aos")).default;
      AOS.init({
        duration: 1000,
        once: true,
        easing: "ease-in-out",
      });
    };
    initAOS();
  }, []);

  useEffect(() => {
    const lower = searchTerm.toLowerCase();
    const filtered = cities.filter(
      (c) =>
        c.name.toLowerCase().includes(lower) ||
        c.county.toLowerCase().includes(lower)
    );
    setFilteredCities(filtered);
  }, [searchTerm, cities]);

  return (
    <section className="container py-12">
      {/* Search Bar & Stats */}
      <div 
        className="max-w-4xl mx-auto mb-16 text-center"
        data-aos="fade-up"
      >
        <div className="relative inline-block w-full max-w-xl mx-auto">
          <input
            type="text"
            placeholder="Search your city or county..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-6 py-4 rounded-full border-2 border-primary-light bg-white text-primary-dark shadow-md focus:border-primary focus:outline-none text-lg transition-all duration-300"
          />
          <div className="absolute right-5 top-1/2 -translate-y-1/2 text-primary">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.637 10.637z"
              />
            </svg>
          </div>
        </div>
        <p className="mt-4 text-primary-dark/60 font-medium">
          Showing {filteredCities.length} of {cities.length} Illinois cities we serve
        </p>
      </div>

      {/* Cities Grid */}
      {filteredCities.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredCities.map((city, index) => (
            <div
              key={city.slug}
              data-aos="fade-up"
              data-aos-delay={(index % 4) * 100}
              className="group bg-white rounded-3xl border border-primary-light p-6 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col h-full hover:-translate-y-1"
            >
              <div className="flex-1">
                {/* City Card Header */}
                <div className="flex justify-between items-start mb-4">
                  <div className="bg-primary-light text-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                    {city.stateCode}
                  </div>
                  <span className="text-xs text-primary-dark/45 font-medium">
                    Updated {city.updatedAt}
                  </span>
                </div>

                {/* City Name */}
                <h3 className="text-2xl font-bold text-primary-dark group-hover:text-primary transition-colors duration-300">
                  {city.name}
                </h3>
                <p className="text-sm text-primary font-semibold mb-4">
                  {city.county}
                </p>

                {/* City Description Preview */}
                <p className="text-primary-dark/70 text-sm leading-relaxed mb-6 line-clamp-3">
                  {city.introduction}
                </p>

                {/* Landmarks */}
                <div className="mb-6">
                  <span className="text-xs font-bold text-primary-dark/45 uppercase tracking-wider block mb-2">
                    Key Landmark
                  </span>
                  <div className="flex flex-wrap gap-2">
                    <span className="inline-block bg-primary-light/40 text-primary-dark/80 text-xs font-medium px-3 py-1 rounded-full border border-primary-light">
                      {city.landmarks[0]}
                    </span>
                  </div>
                </div>
              </div>

              {/* View Page Link */}
              <Link
                href={`/service-areas/${city.slug}`}
                className="mt-auto inline-flex items-center justify-between w-full bg-primary-light text-primary group-hover:bg-primary group-hover:text-white px-5 py-3 rounded-2xl font-semibold transition-all duration-300"
              >
                <span>Explore Service Area</span>
                <span className="transform transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-primary-light/40 rounded-3xl max-w-md mx-auto">
          <p className="text-primary-dark/60 text-lg font-medium">
            No service areas found matching "{searchTerm}"
          </p>
          <button
            onClick={() => setSearchTerm("")}
            className="mt-4 px-6 py-2 bg-primary text-white rounded-full font-semibold shadow-md hover:bg-primary-dark transition-colors"
          >
            Clear Search
          </button>
        </div>
      )}
    </section>
  );
}
