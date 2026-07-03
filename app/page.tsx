import Navbar from "@/app/Components/Navbar";
import Footer from "@/app/Components/Footer";
import Image from "next/image";
import Link from "next/link";
import Slider from "./Components/Slider";
import SmoothScroll from "@/app/Components/SmoothScroll";
import { RouteStructuredData } from "@/app/Components/RouteStructuredData";
import HomeAosInit from "./Components/HomeAosInit";
import HomePreloader from "./Components/HomePreloader";
import HomeStats from "./Components/HomeStats";
import HomeVideoHover from "./Components/HomeVideoHover";
import HomeContactSection from "./Components/HomeContactSection";

const ourServices = [
  {
    img: "/images/services/printing/printing-products-service.webp",
    title: "PRINT ON PRODUCT",
    des: "CUSTOMIZED PRINT",
    href: "/services/printing-products",
  },
  {
    img: "/images/services/direct-mail/direct-mail-service.webp",
    title: "DIRECT MAILING",
    des: "MARKETING",
    href: "/services/direct-mailing",
  },
  {
    img: "/images/services/signage/signage-service.webp",
    title: "SIGNAGE PRINTING",
    des: "VISIBLE YOUR BUSINESS",
    href: "/services/signage",
  },
  {
    img: "/images/services/web-design/web-design-service.webp",
    title: "WEBSITE DESIGN",
    des: "GROW ONLINE",
    href: "/services/web-design",
  },
  {
    img: "/images/services/seo/seo-service-card.webp",
    title: "SEO SERVICES",
    des: "OPTIMIZE YOUR BUSINESS ONLINE",
    href: "/services/seo",
  },
];

export default function Home() {
  return (
    <>
      <RouteStructuredData path="/" />
      <HomeAosInit />
      <HomePreloader />
      <Navbar />
      <SmoothScroll>
        <main>
          {/* Hero Section */}
          <section className="bg-gradient-to-br from-gray-50 to-blue-50">
            <div className="container">
              <div className="mx-auto">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                  {/* LEFT CONTENT */}
                  <div
                    data-aos="fade-right"
                    className="flex flex-col justify-center text-center lg:text-left space-y-5"
                  >
                    <div className="flex justify-center lg:justify-start">
                      <div className="inline-flex items-center gap-3 bg-pink-50 text-pink-500 px-5 py-2 rounded-full shadow-lg">
                        <span className="w-2 h-2 bg-pink-400 rounded-full animate-pulse" />
                        <span className="text-[11px] font-bold uppercase tracking-widest">
                          Printing &amp; Branding Experts
                        </span>
                      </div>
                    </div>

                    <h1
                      className="font-semibold text-gray-950 leading-tight tracking-tight
                      text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl"
                    >
                      Signage &amp; Printing{" "}
                      <br />
                      <span className="text-pink-700">
                        For Illinois Businesses
                      </span>
                    </h1>

                    <p className="text-gray-600 text-base sm:text-lg max-w-xl mx-auto lg:mx-0">
                      FBS Signs delivers custom business signage, large-format printing,
                      direct mail, web design, and SEO services for businesses across
                      Illinois and nationwide. Price guarantee on all services.
                    </p>

                    <div className="flex justify-center lg:justify-start pt-4">
                      <Link href="/contact">
                        <button className="group inline-flex items-center gap-3 bg-pink-700 text-white px-8 py-4 rounded-full font-semibold shadow-lg transition-all duration-300">
                          Get a Free Quote
                          <span className="transform transition-transform duration-300 group-hover:translate-x-1">
                            →
                          </span>
                        </button>
                      </Link>
                    </div>
                  </div>

                  {/* Right Content - Image Grid */}
                  <div className="relative">
                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-100 rounded-full opacity-50 blur-2xl"></div>
                    <div className="absolute bottom-20 -left-10 w-60 h-60 bg-pink-100 rounded-full opacity-50 blur-3xl"></div>
                    <div className="absolute top-32 right-10 w-32 h-32 bg-purple-100 rounded-full opacity-50 blur-2xl"></div>

                    <div className="relative grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                      <div className="col-span-1 space-y-4 sm:space-y-6 sm:mt-16">
                        <div className="rounded-2xl aspect-square overflow-hidden relative float-1">
                          <Image
                            src="/images/shared/printing-materials-showcase.webp"
                            alt="Printed materials showcase"
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="rounded-2xl aspect-square overflow-hidden relative float-2">
                          <Image
                            src="/images/services/signage/signage-service.webp"
                            alt="Business signage display"
                            fill
                            className="object-cover"
                          />
                        </div>
                      </div>

                      <div className="col-span-1 space-y-4 sm:space-y-6">
                        <div className="rounded-2xl aspect-square sm:aspect-[3/4] overflow-hidden relative float-2">
                          <Image
                            src="/images/home/printing-branding-hero.webp"
                            alt="FBS Signs project showcase"
                            fill
                            priority
                            className="object-cover"
                          />
                        </div>
                        <div className="rounded-2xl aspect-square overflow-hidden relative float-1">
                          <Image
                            src="/images/shared/website-design-showcase.webp"
                            alt="Website design showcase"
                            fill
                            className="object-cover"
                          />
                        </div>
                      </div>

                      <div className="col-span-1 space-y-6 sm:mt-16 hidden sm:block">
                        <div className="rounded-2xl aspect-square overflow-hidden relative float-1">
                          <Image
                            src="/images/services/printing/printing-products-service.webp"
                            alt="Custom printing product display"
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="rounded-2xl aspect-square overflow-hidden relative float-2">
                          <Image
                            src="/images/services/direct-mail/direct-mail-service.webp"
                            alt="Direct mailing marketing materials"
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
          <Slider />
          {/* Services Section */}
          <section className="container section-padding mx-auto">
            <div className="px-4">
              <h2
                data-aos="fade-up"
                className="uppercase p-5 text-5xl text-center text-pink-700 font-bold"
              >
                Look{" "}
                <span className="bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                  At Our
                </span>{" "}
                Services
              </h2>
            </div>

            <div className="pt-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-7">
                {ourServices.map((item, index) => (
                  <div
                    key={index}
                    className="bg-gray-200 p-3 rounded-2xl relative w-full shadow-lg transition-transform duration-300 hover:scale-105"
                  >
                    <Image
                      src={item.img}
                      alt={item.title}
                      width={640}
                      height={320}
                      className="w-full h-[200px] sm:h-[300px] md:h-[320px] object-cover rounded-xl"
                    />
                    <div className="mt-5 pb-3">
                      <h2 className="text-lg sm:text-xl md:text-2xl font-semibold">
                        {item.title}
                      </h2>
                      <p className="text-sm md:text-md text-gray-600">
                        {item.des}
                      </p>
                    </div>
                    <Link href={item.href}>
                      <div
                        className="absolute bg-white rounded-full flex justify-center items-center
                        origin-bottom-right -rotate-45
                        w-14 h-14 bottom-4 -right-3
                        md:w-12 md:h-12 cursor-pointer"
                      >
                        <div
                          className="bg-pink-700 text-white rounded-full text-xl flex justify-center items-center
                          shadow-md hover:scale-110 transition-transform
                          w-11 h-11 md:w-9 md:h-9"
                        >
                          →
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Video Section */}
          <HomeVideoHover />

          {/* Stats Section */}
          <section className="container section-padding overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center max-w-[85rem] mx-auto">
              <div data-aos="fade-right" className="text-center lg:text-left">
                <h2 className="text-4xl sm:text-5xl font-bold text-pink-700 leading-tight">
                  Our Work
                </h2>
                <div className="pt-5 flex justify-center lg:justify-start">
                  <div className="w-16 h-[3px] bg-pink-700 rounded-full"></div>
                </div>
                <div className="space-y-5 mt-6">
                  <p className="text-gray-600 text-base sm:text-xl font-semibold">
                    Over the years, FBS Signs has turned countless ideas into
                    high-quality prints and signage that leave a lasting impression.
                    From small local businesses to large franchise rollouts across
                    Illinois, our team blends creativity with precision to deliver
                    outstanding results every time.
                  </p>
                  <p className="text-gray-600 text-base sm:text-xl font-semibold max-w-4xl mx-auto lg:mx-0">
                    With over 25 years of experience and a passion for excellence,
                    we have completed more than 150 projects for clients across
                    industries including QSR restaurants, hospitality, retail, and
                    professional services. Every design, every print, and every
                    sign reflects our commitment to quality and customer satisfaction.
                  </p>
                </div>
              </div>

              {/* Animated stats (client component) — shows static values on first render for crawlers */}
              <HomeStats />
            </div>
          </section>

          {/* Printing Goals Section */}
          <section className="container section-padding">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div data-aos="fade-right" className="text-center md:text-left">
                <h2 className="uppercase text-lg sm:text-xl md:text-3xl font-semibold">
                  Customized Printing to
                </h2>
                <h2
                  className="uppercase font-bold text-pink-700 text-3xl
                  sm:text-4xl md:text-6xl lg:text-7xl
                  pt-3 leading-tight"
                >
                  achieve{" "}
                  <span className="bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                    Your
                  </span>{" "}
                  Business Goals
                </h2>
                <p className="text-sm sm:text-base md:text-lg pt-4 text-gray-700">
                  We create tailored printing and signage solutions designed to make your
                  brand stand out and your message clear. From eye-catching
                  designs to premium materials, every print and sign is crafted to support
                  your marketing goals, engage your audience, and drive real
                  results for your business.
                </p>
                <div className="pt-6 flex justify-center md:justify-start">
                  <div className="w-16 h-[3px] bg-pink-700 rounded-full"></div>
                </div>
              </div>

              <div className="relative" data-aos="fade-left">
                <Image
                  src="/images/home/printing-business-goals.webp"
                  alt="Custom printing and signage materials supporting business growth goals"
                  width={800}
                  height={500}
                  className="w-full h-[220px] sm:h-[300px] md:h-[400px] lg:h-[500px] object-cover rounded-2xl shadow-xl shadow-pink-20"
                />
              </div>
            </div>
          </section>

          {/* Contact Section */}
          <HomeContactSection />

          {/* Map Section */}
          <section
            data-aos="fade-up"
            className="container section-padding pt-10 px-4"
          >
            <div className="rounded-xl overflow-hidden shadow-lg">
              <iframe
                src="https://www.google.com/maps?q=Chicago,USA&output=embed"
                className="w-full h-[300px] md:h-[450px]"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="FBS Signs service area map"
              />
            </div>
          </section>
        </main>
        <Footer />
      </SmoothScroll>
    </>
  );
}
