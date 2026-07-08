"use client";

import Image from "next/image";
import { useEffect } from "react";
import "aos/dist/aos.css";
import Link from "next/link";

import seoServices from "../../data/seo-services.json";

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

  return (
    <>
      <main>
        {/* Section - 1 */}
        <section className="bg-gradient-to-br mt-24 xl:mt-20 from-gray-50 to-blue-50">
          <div className="container">
            <div className="mx-auto">
              <p className="text-gray-600 text-lg">
                <Link href="/" className="text-pink-600">
                  Home
                </Link>
                <span className="mx-2">&gt;</span>
                <span className="text-gray-800 font-semibold">SEO</span>
              </p>
              <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                {/* LEFT CONTENT – FIXED */}
                <div
                  data-aos="fade-right"
                  className="flex flex-col justify-center text-center lg:text-left space-y-5"
                >
                  <h1
                    className="font-semibold text-gray-950 leading-tight tracking-tight
    text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl"
                  >
                    SEO
                  </h1>

                  <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto lg:mx-0">
                    At FBS, we are not just another SEO agency, we are your
                    dedicated partner in achieving online success.
                  </p>
                </div>

                {/* Right Content - Image Grid */}
                <div className="relative">
                  <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-100 rounded-full opacity-50 blur-2xl"></div>
                  <div className="absolute bottom-20 -left-10 w-60 h-60 bg-pink-100 rounded-full opacity-50 blur-3xl"></div>
                  <div className="absolute top-32 right-10 w-32 h-32 bg-purple-100 rounded-full opacity-50 blur-2xl"></div>

                  <div className="relative grid grid-cols-3 sm:grid-cols-3 gap-3 sm:gap-4">
                    <div className="col-span-1 space-y-4 sm:space-y-6 sm:mt-16">
                      <div className="rounded-2xl aspect-square overflow-hidden relative float-1">
                        <Image
                          src="/images/services/direct-mail/direct-mail-marketing.webp"
                          alt="Local marketing campaign planning materials"
                          fill
                          className="object-cover"
                        />
                      </div>
                    </div>

                    <div className="col-span-1 space-y-4 sm:space-y-6 sm:mt-40">
                      <div className="rounded-2xl aspect-square overflow-hidden relative float-2">
                        <Image
                          src="/images/services/direct-mail/direct-mail-service.webp"
                          alt="Digital marketing and SEO support materials"
                          fill
                          className="object-cover"
                        />
                      </div>
                    </div>

                    <div className="col-span-1 space-y-6 sm:mt-16 ">
                      <div className="rounded-2xl aspect-square overflow-hidden relative float-1">
                        <Image
                          src="/images/shared/printing-materials-showcase.webp"
                          alt="Branded print assets supporting local campaigns"
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

        {/* Section - 2 */}
        <section className="container section-padding">
          <div className="bg-[#EC3392] rounded-2xl px-6 py-12 text-white">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center max-w-7xl mx-auto">
              <div data-aos="fade-right">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight text-center lg:text-start">
                  Your Partner in
                  <br />
                  <span className="text-black hover:text-yellow-300">SEO</span>
                  <br />
                  Excellence
                </h2>
              </div>

              <div data-aos="fade-left">
                <p className="text-base md:text-lg text-pink-100 leading-relaxed text-center lg:text-start">
                  Having a beautiful website isn't enough if no one can find it.
                  That's where our Search Engine Optimization (SEO) services
                  come in. At FBS Prints, we help your business climb the search
                  rankings, attract the right audience, and turn clicks into
                  customers. Whether you're a small local business or a growing
                  brand, our SEO strategies are tailored to put you ahead of the
                  competition.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section - 3 */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
              Our <span className="text-pink-600">SEO Services</span>
            </h2>

            <p className="mt-4 sm:mt-6 text-base sm:text-lg md:text-xl text-gray-600 font-medium">
              Don't be afraid to give up the good to go for the great
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {seoServices.map((item) => (
              <Link
                key={item.slug}
                href={`/services/seo/${item.slug}`}
                className="group rounded-2xl p-6 bg-white hover:shadow-xl transition duration-300 flex flex-col h-full cursor-pointer"
              >
                <div className="flex items-center gap-4 mb-5">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br from-pink-500 to-pink-600 flex items-center justify-center text-white shadow-md transition-transform duration-300 group-hover:scale-110">
                    <Image
                      src={item.image}
                      alt={item.title}
                      width={32}
                      height={32}
                      className="w-6 h-6 sm:w-8 sm:h-8 object-contain"
                    />
                  </div>

                  <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 group-hover:text-pink-600 transition-colors">
                    {item.title}
                  </h3>
                </div>

                <div className="w-10 h-[3px] bg-pink-500 mb-4 transition-all duration-300 group-hover:w-16"></div>

                <p className="text-gray-600 text-base sm:text-lg leading-relaxed mt-auto">
                  {item.shortDesc}
                </p>

                <span className="mt-4 text-sm font-semibold text-pink-600 inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                  Learn more <span aria-hidden="true">→</span>
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* Section - 4 */}
        <section className="relative mx-auto">
          <div className="container section-padding mx-auto max-w-6xl relative">
            <div className="relative w-full h-[420px] md:h-[520px] rounded-3xl overflow-hidden shadow-2xl">
              <Image
                src="/images/services/seo/seo-services-hero.webp"
                alt="Search engine optimization strategy and reporting visual"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/40"></div>
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
            <h2 className="text-center text-3xl sm:text-4xl md:text-5xl font-bold text-pink-700">
              Ready to grow? Start your SEO journey with FBS Signs today.
            </h2>
          </div>
          <div className="max-w-4xl mx-auto px-4">
            <p className="text-center text-xl md:text-2xl font-medium text-gray-700 leading-relaxed pt-8">
              Whether you are starting from scratch or looking to outrank established competitors,{" "}
              <span className="font-semibold text-gray-900">FBS Signs</span>{" "}
              builds an SEO strategy around your business goals — not a generic template. Contact us for a free audit and let us show you exactly where you stand.
            </p>
          </div>
        </section>
      </main>
    </>
  );
}