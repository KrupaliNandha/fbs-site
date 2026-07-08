"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import "aos/dist/aos.css";

// Lucide Icons
import {
  Mail,
  Phone,
  Clock,
  Check,
  ShieldCheck,
  Truck,
  ArrowRight,
  Users,
  Target,
  TrendingUp,
  FileText,
  MapPin,
  Sparkles,
  Database,
  MailOpen,
  Calendar,
  Layers,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  HelpCircle,
} from "lucide-react";

// Shared format data (same JSON used by app/services/direct-mailing/[slug]/page.tsx)
import rawData from "../../data/direct-mailing.json";

interface MailFormat {
  id: string;
  slug: string;
  title: string;
  description: string;
  icon: string;
  img: string;
  detailsLabel: string;
  detailsValue: string;
}

const directMailFormats = (rawData as { formats: MailFormat[] }).formats;

export default function DirectMailingPage() {
  const [loaderDone, setLoaderDone] = useState(false);

  // Carousel Images
  const carouselImages = [
    {
      src: "/images/services/direct-mail/direct-mail-marketing.webp",
      alt: "Direct Mail Marketing Materials Showcase",
    },
    {
      src: "/images/services/direct-mail/mailing-documentation.webp",
      alt: "Mailing Documentation and Sorting Preparation",
    },
    {
      src: "/images/services/direct-mail/print-design-example.webp",
      alt: "Printed Direct Mail Design and Catalogs Showcase",
    },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [carouselImages.length]);

  // Estimator States
  const [selectedMailer, setSelectedMailer] = useState("postcard");
  const [selectedService, setSelectedService] = useState("eddm");
  const [selectedQuantity, setSelectedQuantity] = useState("2500");

  // FAQ Accordion State
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const toggleFaq = (idx: number) => {
    setOpenFaqIndex((prev) => (prev === idx ? null : idx));
  };

  useEffect(() => {
    const initAOS = async () => {
      const AOS = (await import("aos")).default;
      AOS.init({
        duration: 1000,
        once: true,
        easing: "ease-in-out",
        offset: 80,
      });
    };
    initAOS();
  }, []);

  // Estimator Pricing Logic
  const mailerRates: Record<string, number> = {
    postcard: 0.32,
    letter: 0.45,
    catalog: 1.15,
    "self-mailer": 0.52,
  };

  const serviceRates: Record<string, number> = {
    eddm: 0.19, // Postage rate per piece for EDDM
    targeted: 0.28, // Regular marketing postage
    "full-service": 0.35, // Premium sorting & addressing list service
  };

  const qty = parseInt(selectedQuantity) || 1000;
  const unitCost = mailerRates[selectedMailer] + serviceRates[selectedService];
  const totalCost = unitCost * qty;

  // FAQ Data
  const faqs = [
    {
      q: "What is Every Door Direct Mail (EDDM)?",
      a: "EDDM is a USPS service that lets you target specific carrier routes in neighborhoods without having to buy mailing lists or address each piece. It's the most cost-effective way to send postcards to local residents.",
    },
    {
      q: "Do I need to purchase a list of addresses?",
      a: "Not necessarily. If you use EDDM, no list is needed. For targeted demographic mailings, we can help you purchase or rent a high-quality list tailored to parameters like age, income, and homeownership.",
    },
    {
      q: "What is the typical turnaround time for mailings?",
      a: "Once your print design files are finalized and approved, printing and postage bundling preparation usually takes 3 to 5 business days. Postal delivery times depend on the postage level selected (First Class vs. Standard).",
    },
    {
      q: "Can I personalize individual mail pieces?",
      a: "Yes! Using Variable Data Printing (VDP), we can print unique recipient names, localized offers, customized coupon codes, and personalized QR codes on each mailer to increase engagement.",
    },
    {
      q: "What is NCOA processing?",
      a: "National Change of Address (NCOA) matches list names and addresses against USPS database changes to update moved addresses, reducing returned mail and saving you budget.",
    },
    {
      q: "How is postage handled?",
      a: "Postage is processed directly through our commercial mailing permit to unlock bulk automation discounts. We calculate and pre-bundle postage fees as part of your custom campaign quote.",
    },
  ];

  return (
    <>
      <main>
        {/* Section 1: Hero Section */}
        <section className="bg-gradient-to-br mt-24 xl:mt-20 from-rose-50 via-white to-blue-50">
          <div className="container py-10 sm:py-16 md:py-20 lg:py-24">
            <p className="text-sm text-gray-600 sm:text-lg">
              <Link href="/" className="text-pink-600">
                Home
              </Link>
              <span className="mx-2">&gt;</span>
              <span className="font-semibold text-gray-800">Direct Mailing</span>
            </p>
            <div className="grid items-center gap-10 sm:gap-12 lg:grid-cols-2 lg:gap-20">
              {/* Left Content */}
              <div
                data-aos="fade-right"
                className="flex flex-col justify-center space-y-5 sm:space-y-6 text-center lg:text-left"
              >
                <div className="flex justify-center lg:justify-start">
                  <div className="inline-flex items-center gap-2 sm:gap-3 rounded-full border border-pink-100 bg-white px-4 py-1.5 sm:px-5 sm:py-2 shadow-sm">
                    <span className="h-2 w-2 rounded-full bg-pink-500 animate-pulse" />
                    <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.15em] sm:tracking-[0.2em] text-pink-600">
                      Print & Post Solutions
                    </span>
                  </div>
                </div>

                <h1 className="text-3xl font-semibold leading-tight tracking-tight text-gray-950 sm:text-5xl md:text-6xl lg:text-7xl">
                  Direct Mail
                  <span className="text-pink-600"> Marketing</span>
                </h1>

                <p className="mx-auto max-w-2xl text-sm text-gray-600 sm:text-lg lg:mx-0">
                  Reach target demographics and neighborhoods directly in their mailboxes.
                  From premium printing and addressing to mail-list building and direct postal drop-offs,
                  we handle everything under one roof.
                </p>

                <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-3 sm:gap-4">
                  <a
                    href="#estimator"
                    className="w-full sm:w-auto text-center rounded-2xl bg-pink-700 hover:bg-pink-850 text-white font-bold px-6 py-3.5 sm:px-8 sm:py-4 transition shadow-lg text-sm"
                  >
                    Estimate Campaign Cost
                  </a>
                  <a
                    href="tel:+18552221133"
                    className="w-full sm:w-auto rounded-2xl border border-pink-200 bg-white hover:bg-pink-50/40 text-pink-700 font-bold px-6 py-3.5 sm:px-8 sm:py-4 transition shadow-sm text-sm flex items-center justify-center gap-2"
                  >
                    <Phone className="w-4 h-4" />
                    Call to Discuss
                  </a>
                </div>
              </div>

              {/* Right Content - Carousel */}
              <div className="relative group" data-aos="fade-left">
                <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-pink-100/60 blur-3xl" />
                <div className="absolute -left-10 bottom-16 h-56 w-56 rounded-full bg-blue-100/60 blur-3xl" />

                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[20px] sm:rounded-[28px] border border-gray-200 bg-white shadow-[0_25px_80px_rgba(15,23,42,0.10)]">
                  {/* Slides */}
                  {carouselImages.map((img, index) => (
                    <div
                      key={index}
                      className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
                        }`}
                    >
                      <Image
                        src={img.src}
                        alt={img.alt}
                        fill
                        className="object-cover"
                        priority={index === 0}
                      />
                    </div>
                  ))}

                  {/* Navigation Arrows */}
                  <button
                    onClick={() =>
                      setCurrentSlide((prev) => (prev - 1 + carouselImages.length) % carouselImages.length)
                    }
                    className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-25 flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-white/90 backdrop-blur-md text-gray-800 border border-gray-100 shadow-md opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 hover:bg-white active:scale-95"
                    aria-label="Previous slide"
                  >
                    <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
                  </button>

                  <button
                    onClick={() =>
                      setCurrentSlide((prev) => (prev + 1) % carouselImages.length)
                    }
                    className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-25 flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-white/90 backdrop-blur-md text-gray-800 border border-gray-100 shadow-md opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 hover:bg-white active:scale-95"
                    aria-label="Next slide"
                  >
                    <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
                  </button>

                  {/* Dot Indicators */}
                  <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
                    {carouselImages.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`h-2 rounded-full transition-all duration-300 ${index === currentSlide ? "w-6 bg-pink-600" : "w-2 bg-white/60 hover:bg-white"
                          }`}
                        aria-label={`Go to slide ${index + 1}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Core Strategy Cards (Why Direct Mail Works) */}
        <section className="container py-10 sm:py-14 md:py-20 bg-white">
          <div className="mx-auto mb-10 sm:mb-16 max-w-3xl text-center" data-aos="fade-up">
            <span className="mb-2 block text-xs sm:text-sm font-semibold uppercase tracking-widest text-pink-600">
              Marketing Intelligence
            </span>
            <h2 className="text-2xl font-bold sm:text-3xl md:text-5xl text-gray-900">
              Why Direct Mail Delivers Results
            </h2>
            <p className="mt-3 text-sm sm:text-base text-gray-600">
              In a highly saturated digital ecosystem, physical mail stands out, legitimizes brands,
              and achieves incredible response rates when backed by targeted data.
            </p>
          </div>

          <div className="grid gap-6 sm:gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div
              className="rounded-3xl border border-gray-100 bg-gray-50/50 p-6 sm:p-8 shadow-sm hover:shadow-md transition duration-300"
              data-aos="fade-up"
              data-aos-delay="0"
            >
              <div className="mb-5 flex h-9 w-9 items-center justify-center rounded-xl bg-pink-100 text-pink-700">
                <Target className="h-5 w-5" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-950 mb-3">Hyper-Targeted Data</h3>
              <p className="text-sm leading-relaxed text-gray-600">
                Maximize conversion rates by targeting recipients based on exact demographic criteria
                such as household income, age, marital status, and homeownership. Alternatively, Every Door
                Direct Mail (EDDM) lets you target specific neighborhood carrier routes to achieve 100%
                geographic saturation. Precision targeting guarantees your mail reaches high-intent local audiences.
              </p>
            </div>

            <div
              className="rounded-3xl border border-gray-100 bg-gray-50/50 p-6 sm:p-8 shadow-sm hover:shadow-md transition duration-300"
              data-aos="fade-up"
              data-aos-delay="100"
            >
              <div className="mb-5 flex h-9 w-9 items-center justify-center rounded-xl bg-pink-100 text-pink-700">
                <Sparkles className="h-5 w-5" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-950 mb-3">Tactile & Tangible Impact</h3>
              <p className="text-sm leading-relaxed text-gray-600">
                In a saturated digital environment, physical mail stands out in a crowded mailbox. The
                tactile sensation of handling a premium paper stock creates a psychological connection
                and trust that digital screens cannot match. Enhancing your pieces with custom coatings,
                die-cut shapes, or soft-touch laminates ensures your brand leaves a lasting, positive impression.
              </p>
            </div>

            <div
              className="rounded-3xl border border-gray-100 bg-gray-50/50 p-6 sm:p-8 shadow-sm hover:shadow-md transition duration-300 sm:col-span-2 lg:col-span-1"
              data-aos="fade-up"
              data-aos-delay="200"
            >
              <div className="mb-5 flex h-9 w-9 items-center justify-center rounded-xl bg-pink-100 text-pink-700">
                <TrendingUp className="h-5 w-5" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-950 mb-3">Omnichannel ROI Boost</h3>
              <p className="text-sm leading-relaxed text-gray-600">
                Direct mail campaigns achieve maximum ROI when integrated into an omnichannel marketing
                strategy. By incorporating custom landing page URLs, unique QR codes, and coordinated digital
                re-targeting ads, you can increase response rates by over 28%. Combining physical print and
                digital touchpoints creates a seamless path to buy.
              </p>
            </div>
          </div>
        </section>

        {/* Section 2.5: Direct Mail Performance Statistics & Industry Data */}
        <section className="px-4 sm:px-6 my-8 sm:my-12" data-aos="fade-up">
          <div className="mx-auto max-w-7xl rounded-[24px] sm:rounded-[32px] bg-gradient-to-br from-slate-900 via-gray-950 to-pink-950 text-white p-6 sm:p-10 md:p-16 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-pink-600/10 blur-3xl" />
            <div className="absolute bottom-0 left-0 h-96 w-96 rounded-full bg-blue-600/10 blur-3xl" />

            <div className="relative z-10 grid gap-8 sm:gap-12 lg:grid-cols-[1fr_2fr] items-center">
              {/* Header info */}
              <div>
                <span className="inline-block rounded-full bg-pink-500/20 border border-pink-500/30 px-3 py-1 text-xs font-bold uppercase tracking-wider text-pink-400">
                  Market Research Data
                </span>
                <h2 className="mt-4 text-2xl sm:text-3xl font-extrabold tracking-tight text-white md:text-4xl">
                  Direct Mail Performance Metrics
                </h2>
                <p className="mt-4 text-sm text-gray-300 leading-relaxed">
                  Official industry data shows that print marketing delivers a tactile reliability
                  and conversion power that digital channels struggle to replicate.
                </p>
                <div className="mt-6 border-t border-slate-800 pt-4">
                  <span className="block text-[11px] font-semibold uppercase tracking-widest text-pink-400">
                    Sources & Attribution
                  </span>
                  <span className="mt-1 block text-xs text-gray-400 leading-relaxed">
                    USPS Delivers, Association of National Advertisers (ANA), and Lob State of Direct Mail Reports.
                  </span>
                </div>
              </div>

              {/* Grid of stats */}
              <div className="grid gap-4 sm:gap-6 grid-cols-2">
                <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-4 sm:p-6 backdrop-blur-sm">
                  <div className="text-2xl sm:text-4xl font-extrabold text-pink-500 md:text-5xl">90%</div>
                  <h4 className="mt-2 text-xs sm:text-sm font-bold text-white">Household Open Rate</h4>
                  <p className="mt-2 hidden sm:block text-xs leading-relaxed text-gray-450">
                    Over 90% of direct mail is opened and reviewed by recipients, compared to average email open rates of just 20%.
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-4 sm:p-6 backdrop-blur-sm">
                  <div className="text-2xl sm:text-4xl font-extrabold text-pink-500 md:text-5xl">17 Days</div>
                  <h4 className="mt-2 text-xs sm:text-sm font-bold text-white">Average Household Lifespan</h4>
                  <p className="mt-2 hidden sm:block text-xs leading-relaxed text-gray-450">
                    Physical mailers are kept in households for an average of 17 days, offering continuous brand impressions.
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-4 sm:p-6 backdrop-blur-sm">
                  <div className="text-2xl sm:text-4xl font-extrabold text-pink-500 md:text-5xl">9.0%</div>
                  <h4 className="mt-2 text-xs sm:text-sm font-bold text-white">Warm List Response Rate</h4>
                  <p className="mt-2 hidden sm:block text-xs leading-relaxed text-gray-450">
                    Warm house lists yield response rates up to 9% (and acquisition campaigns average 5%), beating email by 10x.
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-4 sm:p-6 backdrop-blur-sm">
                  <div className="text-2xl sm:text-4xl font-extrabold text-pink-500 md:text-5xl">112%</div>
                  <h4 className="mt-2 text-xs sm:text-sm font-bold text-white">Median Campaign ROI</h4>
                  <p className="mt-2 hidden sm:block text-xs leading-relaxed text-gray-450">
                    Direct mail offers a median return on investment of 112% when combined with digital retargeting tactics.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Direct Mail Format Examples — now sourced from JSON + linked to /[slug] */}
        <section className="bg-gray-50 py-10 sm:py-16 md:py-24">
          <div className="container">
            <div className="mx-auto mb-10 sm:mb-16 max-w-3xl text-center" data-aos="fade-up">
              <span className="mb-2 block text-xs sm:text-sm font-semibold uppercase tracking-widest text-pink-600">
                Production Formats
              </span>
              <h2 className="text-2xl font-bold sm:text-3xl md:text-5xl text-gray-900">
                Popular Direct Mail Formats
              </h2>
              <p className="mt-3 text-sm sm:text-base text-gray-600">
                We custom print and process several major mail styles. Tailor dimensions,
                paper weights, and folding specifications for your unique branding goals.
              </p>
            </div>

            <div className="grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
              {directMailFormats.map((format, idx) => (
                <Link
                  key={format.slug}
                  href={`/services/direct-mailing/${format.slug}`}
                  className="group flex flex-col rounded-3xl bg-white p-6 shadow-md hover:shadow-lg hover:-translate-y-0.5 transition duration-300"
                  data-aos="fade-up"
                  data-aos-delay={idx * 100}
                >
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-pink-50 text-pink-600">
                    <FileText className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-950">{format.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray-600 flex-grow">
                    {format.description}
                  </p>
                  <div className="mt-4 flex items-center justify-between gap-3 border-t border-gray-100 pt-3">
                    <span className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                      {format.detailsLabel}: {format.detailsValue}
                    </span>
                    <ChevronRight className="h-4 w-4 shrink-0 text-pink-500 opacity-0 -translate-x-1 transition duration-300 group-hover:opacity-100 group-hover:translate-x-0" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Section 4: Mailing Lists & Guidelines */}
        <section className="container py-10 sm:py-16 md:py-24">
          <div className="grid items-center gap-8 sm:gap-12 lg:grid-cols-2 lg:gap-20">
            <div className="relative" data-aos="fade-right">
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[20px] sm:rounded-[28px] border border-gray-200 bg-white shadow-lg">
                <Image
                  src="/images/services/direct-mail/mailing-documentation.webp"
                  alt="Mailing documentation processing"
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            <div className="space-y-5 sm:space-y-6" data-aos="fade-left">
              <span className="block text-xs sm:text-sm font-semibold uppercase tracking-widest text-pink-600">
                Data & Postal Processing
              </span>
              <h2 className="text-2xl font-bold text-gray-950 sm:text-3xl md:text-4xl">
                Post-Office Ready Logistics
              </h2>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                Avoid logistics stress. We coordinate with the postal authorities, process lists,
                and optimize bundle configurations to qualify your campaign for the lowest possible automation postage rates.
              </p>

              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-pink-100 text-pink-600">
                    <Check className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-sm sm:text-base font-bold text-gray-900">List Cleansing & NCOA</h4>
                    <p className="text-sm text-gray-600">
                      We process lists against the National Change of Address database (NCOA) to prevent delivery failures.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-pink-100 text-pink-600">
                    <Check className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-sm sm:text-base font-bold text-gray-900">Mailing Permit & Sorting</h4>
                    <p className="text-sm text-gray-600">
                      Utilize our permit or inject your custom permit indicators to enjoy bulk commercial rate discounts.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-pink-100 text-pink-600">
                    <Check className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-sm sm:text-base font-bold text-gray-900">EDDM Setup (Every Door Direct Mail)</h4>
                    <p className="text-sm text-gray-600">
                      Target local zip code maps route-by-route. The USPS delivers a mail piece to every address on the chosen path.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 5: Industries we serve */}
        <section className="bg-gradient-to-br from-pink-50 via-white to-purple-50 py-10 sm:py-16 md:py-24">
          <div className="container">
            <div className="mx-auto mb-10 sm:mb-16 max-w-3xl text-center" data-aos="fade-up">
              <span className="mb-2 block text-xs sm:text-sm font-semibold uppercase tracking-widest text-pink-600">
                Target Industries
              </span>
              <h2 className="text-2xl font-bold sm:text-3xl md:text-5xl text-gray-900">
                Who Benefits From Direct Mail?
              </h2>
              <p className="mt-3 text-sm sm:text-base text-gray-600">
                Across dozens of business sectors, print marketing represents a primary acquisition channel with excellent ROI.
              </p>
            </div>

            <div className="grid gap-5 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  title: "Retail & E-commerce",
                  desc: "Announce seasonal sales, distribute catalogs, and send catalog vouchers to win back inactive web shoppers.",
                },
                {
                  title: "Non-profit Organizations",
                  desc: "Conduct annual fundraisers and donation campaigns using reply cards and return envelopes to raise money.",
                },
                {
                  title: "Real Estate Agencies",
                  desc: "Promote new listings, local houses sold, open house events, and establish regional expertise in key neighborhoods.",
                },
                {
                  title: "Healthcare Providers",
                  desc: "Dentists, family clinics, and local hospitals use direct mail for scheduling appointment reminders and health tips.",
                },
                {
                  title: "Home Service Companies",
                  desc: "HVAC repairs, cleaning companies, roofers, and landscapers drop EDDM flyers in local target neighborhoods.",
                },
                {
                  title: "Local Shops & Restaurants",
                  desc: "Bring people in with grand opening notifications, food menu brochures, and neighborhood dining coupon codes.",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="rounded-3xl border border-white/60 bg-white/70 p-6 backdrop-blur-sm shadow-sm hover:shadow-md hover:bg-white transition duration-300"
                  data-aos="fade-up"
                  data-aos-delay={i * 100}
                >
                  <h3 className="text-base sm:text-lg font-bold text-gray-950 flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-pink-500 shrink-0" />
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-gray-600">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section 6: Interactive Cost Estimator & Contact */}
        <section id="estimator" className="container py-10 sm:py-14 md:py-20">
          <div className="grid items-start gap-8 lg:grid-cols-2 lg:gap-12">
            {/* Left Column: Information Card */}
            <div data-aos="fade-right" className="space-y-5 sm:space-y-6">
              <span className="inline-flex rounded-full bg-pink-50 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-pink-700">
                Campaign Calculator
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-pink-700">
                Direct Mail Budget Estimator
              </h2>
              <p className="text-sm sm:text-base leading-relaxed text-gray-650">
                Select your mailing format, list logistics, and quantity targets to get an instant
                project projection. We help you fine-tune these dimensions to match your postage discount goals.
              </p>

              <div className="rounded-2xl border border-gray-100 bg-gray-50/50 p-5 sm:p-6 space-y-4">
                <div className="flex gap-3">
                  <ShieldCheck className="h-5 w-5 text-pink-600 shrink-0 mt-0.5" />
                  <p className="text-sm text-gray-700">
                    <strong>Lowest Postage Rates:</strong> We execute full postal presorts, automation grouping, and tray packaging.
                  </p>
                </div>
                <div className="flex gap-3">
                  <Truck className="h-5 w-5 text-pink-600 shrink-0 mt-0.5" />
                  <p className="text-sm text-gray-700">
                    <strong>Full Mail Drop:</strong> Ship direct to regional hubs or drop off at local post offices to match target drop dates.
                  </p>
                </div>
                <div className="flex gap-3">
                  <Clock className="h-5 w-5 text-pink-600 shrink-0 mt-0.5" />
                  <p className="text-sm text-gray-700">
                    <strong>Fast Processing:</strong> Typically printed, sorted, and delivered to post office hubs in 3-5 business days.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column: Calculator Widget */}
            <div data-aos="fade-left">
              <div className="rounded-[20px] sm:rounded-[28px] border border-pink-100 bg-white p-5 shadow-[0_18px_60px_rgba(236,72,153,0.10)] sm:p-8">
                <div className="mb-6">
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-950">
                    Build Your Campaign Specs
                  </h3>
                  <p className="mt-2 text-sm text-gray-600">
                    Adjust fields below to update direct mail pricing estimation.
                  </p>
                </div>

                <div className="space-y-5">
                  {/* Mailer Selector */}
                  <div className="rounded-2xl border border-gray-100 bg-gray-50/80 p-4">
                    <label className="mb-3 block text-sm font-semibold text-gray-800">
                      Mailer Format
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                      {[
                        { val: "postcard", label: "Postcards" },
                        { val: "letter", label: "Letters" },
                        { val: "catalog", label: "Catalogs" },
                        { val: "self-mailer", label: "Self-Mailers" },
                      ].map((m) => (
                        <button
                          key={m.val}
                          type="button"
                          onClick={() => setSelectedMailer(m.val)}
                          className={`rounded-xl border px-3 py-2 text-xs font-semibold transition ${selectedMailer === m.val
                            ? "border-pink-600 bg-pink-50 text-pink-700"
                            : "border-gray-200 bg-white text-gray-700 hover:border-pink-300"
                            }`}
                        >
                          {m.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Service Level */}
                  <div className="rounded-2xl border border-gray-100 bg-gray-50/80 p-4">
                    <label className="mb-3 block text-sm font-semibold text-gray-800">
                      Mailing List Service Type
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {[
                        { val: "eddm", label: "EDDM (Target Entire Postal Routes)" },
                        { val: "targeted", label: "Targeted Demographics List" },
                        { val: "full-service", label: "Premium Cleansed List Drop" },
                      ].map((s) => (
                        <button
                          key={s.val}
                          type="button"
                          onClick={() => setSelectedService(s.val)}
                          className={`rounded-xl border px-4 py-2.5 text-xs font-semibold text-left transition ${selectedService === s.val
                            ? "border-pink-600 bg-pink-50 text-pink-700"
                            : "border-gray-200 bg-white text-gray-700 hover:border-pink-300"
                            }`}
                        >
                          {s.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Quantity */}
                  <div className="rounded-2xl border border-gray-100 bg-gray-50/80 p-4">
                    <label className="mb-3 block text-sm font-semibold text-gray-800">
                      Mailing Volume
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {["1000", "2500", "5000", "10000"].map((q) => (
                        <button
                          key={q}
                          type="button"
                          onClick={() => setSelectedQuantity(q)}
                          className={`rounded-xl border py-2 text-xs font-semibold transition ${selectedQuantity === q
                            ? "border-pink-600 bg-pink-50 text-pink-700"
                            : "border-gray-200 bg-white text-gray-700 hover:border-pink-300"
                            }`}
                        >
                          {parseInt(q).toLocaleString()}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Price Projection Output */}
                  <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-gray-50 to-pink-50/40 p-5">
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-sm font-medium text-gray-600">
                        Est. Unit Cost (Print + Mail)
                      </span>
                      <span className="text-base font-bold text-gray-900">
                        ${unitCost.toFixed(2)} / ea
                      </span>
                    </div>

                    <div className="mt-3 flex items-center justify-between gap-4 border-t border-gray-200 pt-3">
                      <span className="text-sm font-medium text-gray-600">
                        Estimated Total Budget
                      </span>
                      <span className="text-lg sm:text-xl font-bold text-pink-700">
                        ${totalCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>

                  {/* Direct Contact Actions (No submission form) */}
                  <div className="pt-2 grid gap-3 sm:grid-cols-2">
                    <a
                      href="tel:+18552221133"
                      className="flex h-14 w-full items-center justify-center gap-2.5 rounded-2xl bg-pink-700 px-4 sm:px-6 text-center text-xs sm:text-sm font-bold text-white shadow-lg transition duration-300 hover:scale-[1.01] hover:bg-pink-800"
                    >
                      <Phone className="h-4 w-4 shrink-0" />
                      Call to Order: +1-855-222-1133
                    </a>

                    <a
                      href={`mailto:info@fbsprints.com?subject=${encodeURIComponent(
                        `Direct Mail Campaign Request`
                      )}&body=${encodeURIComponent(
                        `I would like to inquire about a direct mail campaign with the following configurations:\n\n` +
                        `- Mailer Format: ${selectedMailer}\n` +
                        `- Mailing Service: ${selectedService}\n` +
                        `- Target Quantity: ${qty}\n` +
                        `- Estimated Pricing: $${totalCost.toFixed(2)}\n\n` +
                        `Please contact me to discuss finalizing the list processing and file requirements.`
                      )}`}
                      className="flex h-14 w-full items-center justify-center gap-2.5 rounded-2xl border border-pink-200 bg-pink-50/40 px-4 sm:px-6 text-center text-xs sm:text-sm font-bold text-pink-700 transition duration-300 hover:scale-[1.01] hover:bg-pink-50"
                    >
                      <Mail className="h-4 w-4 shrink-0" />
                      Email Specifications Directly
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 7: FAQs (Accordion Style) */}
        <section className="container py-14 md:py-20 border-t border-gray-100">
          <div className="mx-auto mb-12 max-w-3xl text-center">
            <span className="mb-2 block text-sm font-semibold uppercase tracking-widest text-pink-600">
              FAQ Support
            </span>
            <h2 className="text-3xl font-extrabold leading-tight text-gray-900 sm:text-4xl md:text-5xl">
              Direct Mail FAQ
            </h2>
            <p className="mt-4 text-base font-medium text-gray-600 sm:text-lg">
              Answers to common questions about direct mail printing, postage rates, and delivery logistics.
            </p>
          </div>

          <div className="mx-auto max-w-4xl space-y-4">
            {faqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className={`overflow-hidden rounded-2xl border bg-white shadow-sm transition-all duration-300 ${isOpen
                    ? "border-pink-600 shadow-md"
                    : "border-gray-100 hover:border-pink-200"
                    }`}
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(idx)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                  >
                    <span
                      className={`text-base font-bold sm:text-lg ${isOpen ? "text-pink-600" : "text-gray-900"
                        }`}
                    >
                      {faq.q}
                    </span>
                    <ChevronDown
                      className={`h-5 w-5 shrink-0 text-gray-500 transition-transform duration-300 ${isOpen ? "rotate-180 text-pink-600" : "rotate-0"
                        }`}
                    />
                  </button>

                  <div
                    className={`grid transition-all duration-300 ease-in-out ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                      }`}
                  >
                    <div className="overflow-hidden">
                      <p className="px-6 pb-5 text-sm leading-relaxed text-gray-600 sm:text-base">
                        {faq.a}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>
    </>
  );
}