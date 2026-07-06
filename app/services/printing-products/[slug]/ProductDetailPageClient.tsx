"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/app/Components/Navbar";
import Footer from "@/app/Components/Footer";
import PageLoader from "@/app/Components/Preloader";
import SmoothScroll from "@/app/Components/SmoothScroll";
import "aos/dist/aos.css";

// Icons for UI
import {
  ChevronDown,
  ArrowRight,
  Clock,
  ShieldCheck,
  Truck,
  Check,
  HelpCircle,
  Phone,
  Mail,
} from "lucide-react";

// Product-specific icons
import { TiBusinessCard } from "react-icons/ti";
import { ImFilesEmpty } from "react-icons/im";
import {
  FaTshirt,
  FaCalendarAlt,
  FaRegFileImage,
  FaRegNewspaper,
  FaSign,
} from "react-icons/fa";
import { RiBillLine } from "react-icons/ri";

// Types
interface FAQ {
  question: string;
  answer: string;
}

interface Specs {
  materials: string;
  sizes: string;
  turnaround: string;
  finishing: string;
}

interface Product {
  slug: string;
  name: string;
  title: string;
  metaDescription: string;
  intro: string;
  description: string;
  features: string[];
  specs: Specs;
  faqs: FAQ[];
  image: string;
}

interface ProductDetailPageClientProps {
  product: Product;
  allProducts: Product[];
}

// Map slug to React Icon for the related products section
function getProductIcon(slug: string) {
  switch (slug) {
    case "business-cards":
      return TiBusinessCard;
    case "brochures":
      return FaRegNewspaper;
    case "copy-services":
      return ImFilesEmpty;
    case "t-shirt-prints":
      return FaTshirt;
    case "calendars":
      return FaCalendarAlt;
    case "banners":
      return FaSign;
    case "carbonless-forms":
      return RiBillLine;
    case "carryout-menus":
      return RiBillLine;
    case "canvas":
      return FaRegFileImage;
    default:
      return RiBillLine;
  }
}

// Configurator options database
const productOptions: Record<
  string,
  {
    sizes: string[];
    materials: string[];
    finishes: string[];
  }
> = {
  "business-cards": {
    sizes: [
      'Standard (3.5" x 2")',
      'Square (2.5" x 2.5")',
      'Slim (3.5" x 1.75")',
    ],
    materials: [
      "14pt Premium Matte",
      "16pt Premium Glossy (UV)",
      "18pt Extra-Thick Soft-Touch",
    ],
    finishes: ["None", "Rounded Corners", "Spot UV", "Foil Stamping"],
  },
  brochures: {
    sizes: ['8.5" x 11"', '8.5" x 14"', '11" x 17"'],
    materials: ["100lb Gloss Text", "80lb Matte Text", "100lb Gloss Cover"],
    finishes: ["Tri-Fold", "Bi-Fold", "Z-Fold", "Gate-Fold"],
  },
  "copy-services": {
    sizes: [
      'Letter (8.5" x 11")',
      'Legal (8.5" x 14")',
      'Tabloid (11" x 17")',
    ],
    materials: [
      "20lb Bond (B&W)",
      "24lb Bright White",
      "28lb Premium Color Text",
    ],
    finishes: [
      "Loose Sheets",
      "Spiral Coil Binding",
      "Comb Binding",
      "Stapled Booklets",
    ],
  },
  "t-shirt-prints": {
    sizes: ["Small", "Medium", "Large", "XL", "2XL", "3XL"],
    materials: [
      "100% Ringspun Cotton",
      "Cotton-Poly Blend",
      "Tri-Blend Premium",
    ],
    finishes: ["Front Print Only", "Front & Back Print", "Sleeve Print Add-on"],
  },
  calendars: {
    sizes: [
      'Wall (8.5" x 11" folded)',
      'Desk (8.5" x 5.5")',
      'Poster Planners (11" x 17")',
    ],
    materials: [
      "100lb Gloss Cover / 80lb Gloss Text Inside",
      "100lb Matte Cover / 80lb Matte Text Inside",
    ],
    finishes: ["Saddle-Stitched (Stapled)", "Wire-O Spiral Bound"],
  },
  banners: {
    sizes: ["3' x 6'", "4' x 8'", "6' x 12'", "Custom Size"],
    materials: [
      "13oz Scrim Vinyl (Outdoor)",
      "15oz Premium Blockout (Double-sided)",
      "8oz Wind-Resistant Mesh",
    ],
    finishes: ["Hems & Grommets", "Pole Pockets", "Cut Edge Only"],
  },
  "carbonless-forms": {
    sizes: ['Letter (8.5" x 11")', 'Half-Letter (5.5" x 8.5")'],
    materials: [
      "2-Part (Duplicate - White/Canary)",
      "3-Part (Triplicate - White/Canary/Pink)",
      "4-Part (Quadruplicate)",
    ],
    finishes: [
      "Padded Sets (Glued edge)",
      "NCR Booklet (with wrap cover)",
      "Numbered NCR Forms",
    ],
  },
  "carryout-menus": {
    sizes: ['8.5" x 11"', '8.5" x 14"', '11" x 17"'],
    materials: [
      "70lb Budget Gloss",
      "80lb Standard Matte",
      "100lb Premium Gloss Text",
    ],
    finishes: ["Tri-Fold", "Bi-Fold", "Z-Fold", "Flat Sheet"],
  },
  canvas: {
    sizes: ['8" x 10"', '12" x 18"', '18" x 24"', '24" x 36"'],
    materials: [
      'Museum Poly-Cotton Canvas (Standard Wrap 0.75")',
      'Premium Poly-Cotton Canvas (Gallery Wrap 1.5")',
    ],
    finishes: ["Image Stretch (Wrap sides)", "Mirrored Borders", "Solid Color Borders"],
  },
};

export default function ProductDetailPageClient({
  product,
  allProducts,
}: ProductDetailPageClientProps) {
  const [loaderDone, setLoaderDone] = useState(false);

  const options = productOptions[product.slug] || {
    sizes: ["Standard"],
    materials: ["Premium Stock"],
    finishes: ["Standard Finish"],
  };

  const [selectedSize, setSelectedSize] = useState(options.sizes[0]);
  const [selectedMaterial, setSelectedMaterial] = useState(options.materials[0]);
  const [selectedFinish, setSelectedFinish] = useState(options.finishes[0]);

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
  }, [product.slug]);

  const relatedProducts = allProducts
    .filter((p) => p.slug !== product.slug)
    .slice(0, 4);

  return (
    <>
      {!loaderDone && <PageLoader onFinish={() => setLoaderDone(true)} />}
      <Navbar />

      <SmoothScroll>
        <main>
          {/* Section 1: Hero */}
          <section className="bg-gradient-to-br from-rose-50 via-white to-blue-50">
            <div className="container py-16 md:py-20 lg:py-24">
              <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
                {/* Left Content */}
                <div
                  data-aos="fade-right"
                  className="flex flex-col justify-center space-y-6 text-center lg:text-left"
                >
                  <div className="flex justify-center lg:justify-start">
                    <div className="inline-flex items-center gap-3 rounded-full border border-pink-100 bg-white px-5 py-2 shadow-sm">
                      <span className="h-2 w-2 rounded-full bg-pink-500 animate-pulse" />
                      <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-pink-600">
                        Premium Printing Product
                      </span>
                    </div>
                  </div>

                  <h1 className="text-4xl font-semibold leading-tight tracking-tight text-gray-950 sm:text-5xl md:text-6xl lg:text-7xl">
                    {product.name.split(" ")[0]}
                    <span className="text-pink-600">
                      {" "}
                      {product.name.split(" ").slice(1).join(" ") || "Services"}
                    </span>
                  </h1>

                  <p className="text-base text-gray-600 sm:text-lg">
                    <Link href="/" className="text-pink-600 hover:underline">
                      Home
                    </Link>
                    <span className="mx-2">&gt;</span>
                    <Link
                      href="/services/printing-products"
                      className="text-pink-600 hover:underline"
                    >
                      Printing Services
                    </Link>
                    <span className="mx-2">&gt;</span>
                    <span className="font-semibold text-gray-800">{product.name}</span>
                  </p>

                  <p className="mx-auto max-w-2xl text-base text-gray-600 sm:text-lg lg:mx-0">
                    {product.intro}
                  </p>

                  <div className="grid max-w-xl gap-3 pt-2 sm:grid-cols-2 lg:mx-0 mx-auto">
                    {product.features.map((feature, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-3 rounded-2xl border border-pink-100 bg-white p-4 shadow-sm"
                      >
                        <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-pink-50 text-pink-600">
                          <Check className="h-4 w-4" />
                        </div>
                        <p className="text-sm leading-snug text-gray-700">{feature}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right Content */}
                <div className="relative" data-aos="fade-left">
                  <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-pink-100/60 blur-3xl" />
                  <div className="absolute -left-10 bottom-16 h-56 w-56 rounded-full bg-blue-100/60 blur-3xl" />

                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[28px] border border-gray-200 bg-white shadow-[0_25px_80px_rgba(15,23,42,0.10)]">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover"
                      priority
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Section 2: Banner */}
          <section className="container py-10 md:py-14">
            <div className="overflow-hidden rounded-[28px] bg-gradient-to-r from-pink-600 to-pink-700 px-6 py-12 text-white md:px-10">
              <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-8 lg:grid-cols-2">
                <div data-aos="fade-right">
                  <h2 className="text-center text-3xl font-bold leading-tight lg:text-left md:text-4xl lg:text-5xl">
                    Premium Custom Printing
                    <br />
                    <span className="text-black">At Competitive Pricing.</span>
                  </h2>
                </div>

                <div data-aos="fade-left">
                  <p className="text-center text-base leading-relaxed text-pink-100 md:text-lg lg:text-left">
                    All our products are crafted with high-definition digital
                    technology and premium substrates to make a lasting impression.
                    Check options below and get an instantaneous design estimate today.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 3: Specs & Customizer */}
          <section className="container py-14 md:py-20">
            {/* Product Overview (Full Width) */}
            <div className="mb-8" data-aos="fade-up">
              <div className="rounded-[28px] border border-gray-100 bg-white p-8 shadow-lg">
                <h2 className="mb-6 text-3xl font-bold text-pink-700">
                  Product Overview
                </h2>
                <p className="whitespace-pre-line text-base leading-relaxed text-gray-600 sm:text-lg">
                  {product.description}
                </p>
              </div>
            </div>

            {/* Side-by-Side layout: 50% Technical Specs, 50% Build Your Print Order */}
            <div className="grid items-start gap-8 lg:grid-cols-2 lg:gap-12">
              {/* Technical Specifications (50% width) */}
              <div data-aos="fade-right">
                <div className="rounded-[28px] border border-gray-100 bg-white p-8 shadow-lg">
                  <h2 className="mb-6 text-3xl font-bold text-pink-700">
                    Technical Specifications
                  </h2>

                  <div className="grid gap-6 sm:grid-cols-2">
                    <div className="space-y-5 border-b border-slate-100 pb-4 sm:border-b-0 sm:border-r sm:pb-0 sm:pr-6">
                      <div>
                        <span className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                          Materials & stock
                        </span>
                        <span className="text-base font-medium text-gray-800">
                          {product.specs.materials}
                        </span>
                      </div>

                      <div>
                        <span className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                          Available Sizes
                        </span>
                        <span className="text-base font-medium text-gray-800">
                          {product.specs.sizes}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-5 sm:pl-2">
                      <div>
                        <span className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                          Turnaround Time
                        </span>
                        <span className="text-base font-medium text-gray-800">
                          {product.specs.turnaround}
                        </span>
                      </div>

                      <div>
                        <span className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                          Finishing options
                        </span>
                        <span className="text-base font-medium text-gray-800">
                          {product.specs.finishing}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Customizer Card: Build Your Print Order (50% width) */}
              <div data-aos="fade-left">
                <div className="rounded-[28px] border border-pink-100 bg-white p-6 shadow-[0_18px_60px_rgba(236,72,153,0.10)] sm:p-8">
                  <div className="mb-6">
                    <span className="inline-flex rounded-full bg-pink-50 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-pink-700">
                      Interactive customizer
                    </span>

                    <h3 className="mt-3 text-2xl font-bold text-gray-950">
                      Build Your Print Order
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-gray-600">
                      Choose your preferred size, stock, and finishing options to
                      prepare a faster and more accurate quote request.
                    </p>
                  </div>

                  <div className="space-y-5">
                    {/* Size Selector */}
                    <div className="rounded-2xl border border-gray-100 bg-gray-50/80 p-4">
                      <label className="mb-3 block text-sm font-semibold text-gray-800">
                        Select Dimension / Size
                      </label>

                      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                        {options.sizes.map((size) => (
                          <button
                            key={size}
                            type="button"
                            onClick={() => setSelectedSize(size)}
                            className={`min-h-[48px] rounded-xl border px-3 py-2 text-sm font-medium transition-all duration-200 ${selectedSize === size
                                ? "border-pink-600 bg-pink-50 text-pink-700 shadow-sm"
                                : "border-gray-200 bg-white text-gray-700 hover:border-pink-300 hover:bg-pink-50/40"
                              }`}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Material Selector */}
                    <FieldSelect
                      label="Choose Stock / Material"
                      value={selectedMaterial}
                      onChange={setSelectedMaterial}
                      options={options.materials.map((mat) => ({
                        value: mat,
                        label: mat,
                      }))}
                    />

                    {/* Finish Selector */}
                    <FieldSelect
                      label="Finishing & Specialty Add-ons"
                      value={selectedFinish}
                      onChange={setSelectedFinish}
                      options={options.finishes.map((f) => ({
                        value: f,
                        label: f,
                      }))}
                    />

                    {/* Price & Turnaround */}
                    <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-gray-50 to-pink-50/40 p-5">
                      <div className="flex items-center justify-between gap-4">
                        <span className="text-sm font-medium text-gray-600">
                          Estimated Pricing
                        </span>
                        <span className="text-xl font-bold text-gray-900">
                          Starting at $9.99
                        </span>
                      </div>

                      <div className="mt-3 flex items-center justify-between gap-4 border-t border-gray-200 pt-3">
                        <span className="flex items-center gap-2 text-sm font-medium text-gray-600">
                          <Clock className="h-4 w-4 text-pink-600" />
                          Ready In
                        </span>
                        <span className="text-sm font-semibold text-gray-800">
                          {product.specs.turnaround}
                        </span>
                      </div>
                    </div>

                    {/* Direct Contact Actions (No submission form) */}
                    <div className="space-y-3 pt-2">
                      <a
                        href="tel:+18552221133"
                        className="flex h-14 w-full items-center justify-center gap-2.5 rounded-2xl bg-pink-700 px-6 text-center text-sm font-bold text-white shadow-lg transition-all duration-300 hover:scale-[1.01] hover:bg-pink-800"
                      >
                        <Phone className="h-4 w-4" />
                        Call to Order: +1-855-222-1133
                      </a>

                      <a
                        href={`mailto:info@fbsprints.com?subject=${encodeURIComponent(
                          `Quote Request: ${product.name}`
                        )}&body=${encodeURIComponent(
                          `I would like to get a quote for ${product.name} with the following specifications:\n\n` +
                            `- Size: ${selectedSize}\n` +
                            `- Material: ${selectedMaterial}\n` +
                            `- Finishing: ${selectedFinish}\n\n` +
                            `Please get back to me with estimated pricing.`
                        )}`}
                        className="flex h-14 w-full items-center justify-center gap-2.5 rounded-2xl border border-pink-200 bg-pink-50/40 px-6 text-center text-sm font-bold text-pink-700 transition-all duration-300 hover:scale-[1.01] hover:bg-pink-50"
                      >
                        <Mail className="h-4 w-4" />
                        Email Specs Directly
                      </a>
                    </div>

                    {/* Trust Badges */}
                    <div className="grid grid-cols-3 gap-3 border-t border-slate-100 pt-4">
                      <div className="rounded-2xl bg-gray-50 px-3 py-4 text-center">
                        <ShieldCheck className="mx-auto mb-2 h-5 w-5 text-pink-600" />
                        <span className="block text-[11px] font-semibold uppercase tracking-wide text-gray-600">
                          100% Quality
                        </span>
                      </div>

                      <div className="rounded-2xl bg-gray-50 px-3 py-4 text-center">
                        <Truck className="mx-auto mb-2 h-5 w-5 text-pink-600" />
                        <span className="block text-[11px] font-semibold uppercase tracking-wide text-gray-600">
                          Fast Shipping
                        </span>
                      </div>

                      <div className="rounded-2xl bg-gray-50 px-3 py-4 text-center">
                        <Check className="mx-auto mb-2 h-5 w-5 text-pink-600" />
                        <span className="block text-[11px] font-semibold uppercase tracking-wide text-gray-600">
                          Design Check
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Section 4: Ordering Process */}
          <section className="bg-gradient-to-r from-pink-600 to-pink-700 py-16 text-white md:py-24">
            <div className="container mx-auto px-4 md:px-6">
              <div className="mx-auto mb-16 max-w-2xl text-center" data-aos="fade-up">
                <span className="mb-2 block text-sm font-semibold uppercase tracking-widest text-black">
                  Our Process
                </span>
                <h2 className="text-3xl font-bold md:text-5xl">
                  How to Order in 4 Easy Steps
                </h2>
                <p className="mt-3 text-base text-pink-100">
                  We have refined our design, printing, and delivery process to
                  make it completely seamless for local businesses.
                </p>
              </div>

              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  {
                    step: "01",
                    title: "Submit Specs & Quote",
                    desc: "Fill our quote request with your desired sizes, paper stock, and quantities.",
                  },
                  {
                    step: "02",
                    title: "Send Artwork / Request Design",
                    desc: "Provide your design files (PDF/JPEG) or work directly with our expert graphic design team.",
                  },
                  {
                    step: "03",
                    title: "Approve Digital Proof",
                    desc: "Review and approve our digital PDF proof. We verify sizing and resolution before printing.",
                  },
                  {
                    step: "04",
                    title: "Print & Fast Delivery",
                    desc: "We print your order using cutting-edge presses and deliver it to your location on time.",
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    data-aos="fade-up"
                    data-aos-delay={i * 100}
                    className="group relative rounded-2xl border border-white/10 bg-white/10 p-6 transition duration-300 hover:bg-white/15"
                  >
                    <span className="absolute right-4 top-4 select-none font-mono text-5xl font-black text-white/10 transition duration-300 group-hover:text-white/20">
                      {item.step}
                    </span>
                    <h3 className="relative z-10 pt-6 text-lg font-bold text-white transition group-hover:text-yellow-300">
                      {item.title}
                    </h3>
                    <p className="relative z-10 mt-2 text-sm leading-relaxed text-pink-100">
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Section 5: FAQs */}
          <section className="container py-14 md:py-20">
            <div className="mx-auto mb-12 max-w-3xl text-center">
              <h2 className="text-3xl font-extrabold leading-tight text-gray-900 sm:text-4xl md:text-5xl">
                FAQs for {product.name}
              </h2>
              <p className="mt-4 text-base font-medium text-gray-600 sm:text-lg md:text-xl">
                Clear answers for common questions about our{" "}
                {product.name.toLowerCase()} printing.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {product.faqs.map((faq) => (
                <div
                  key={faq.question}
                  className="rounded-2xl border border-gray-100 bg-white p-6 shadow-lg"
                >
                  <h3 className="flex items-start gap-2.5 text-xl font-semibold text-gray-900">
                    <HelpCircle className="mt-0.5 h-5 w-5 shrink-0 text-pink-600" />
                    {faq.question}
                  </h3>
                  <p className="mt-3 pl-7 text-sm leading-relaxed text-gray-650">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Section 6: Other Printing Products */}
          <section className="container py-14 md:py-20">
            <div className="mx-auto mb-12 max-w-3xl text-center">
              <h2 className="text-3xl font-extrabold leading-tight text-gray-900 sm:text-4xl md:text-5xl">
                Other Services We Offer
              </h2>
              <p className="mt-4 text-base font-medium text-gray-600 sm:text-lg md:text-xl">
                Explore our full line of visual branding and print products to
                support your business campaigns.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
              {relatedProducts.map((p) => {
                const IconComponent = getProductIcon(p.slug);
                return (
                  <Link
                    key={p.slug}
                    href={`/services/printing-products/${p.slug}`}
                    className="group flex h-full flex-col rounded-2xl border border-gray-100 bg-white p-6 transition duration-300 hover:shadow-xl"
                  >
                    <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-pink-100 text-pink-700 transition duration-300 group-hover:scale-110">
                      <IconComponent className="h-6 w-6" />
                    </div>
                    <h3 className="text-2xl font-semibold text-gray-900 transition-colors group-hover:text-pink-650">
                      {p.name}
                    </h3>
                    <div className="my-4 h-[3px] w-10 bg-pink-500 transition-all duration-300 group-hover:w-16" />
                    <p className="mt-auto line-clamp-3 text-base leading-relaxed text-gray-600">
                      {p.intro}
                    </p>
                  </Link>
                );
              })}
            </div>
          </section>
        </main>

        <Footer />
      </SmoothScroll>
    </>
  );
}

interface SelectOption {
  value: string;
  label: string;
}

function FieldSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
        buttonRef.current?.focus();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const selectedOption = useMemo(
    () => options.find((o) => o.value === value) || options[0],
    [options, value]
  );

  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-gray-800">{label}</label>

      <div className="relative z-20" ref={dropdownRef}>
        <button
          ref={buttonRef}
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className={`group flex h-14 w-full items-center justify-between rounded-2xl border bg-white px-4 text-left transition-all duration-200 ${isOpen
              ? "border-pink-600 ring-4 ring-pink-100 shadow-lg"
              : "border-gray-200 hover:border-pink-300 hover:shadow-sm"
            }`}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
        >
          <span className="pr-3 text-sm font-medium text-gray-800">
            {selectedOption?.label}
          </span>

          <div
            className={`flex h-9 w-9 items-center justify-center rounded-xl border transition-all ${isOpen
                ? "border-pink-200 bg-pink-50 text-pink-600"
                : "border-gray-200 bg-gray-50 text-gray-500 group-hover:border-pink-200 group-hover:text-pink-600"
              }`}
          >
            <ChevronDown
              className={`h-4 w-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""
                }`}
            />
          </div>
        </button>

        {isOpen && (
          <div className="absolute left-0 right-0 top-[calc(100%+10px)] z-50 rounded-2xl border border-gray-200 bg-white p-2 shadow-[0_20px_50px_rgba(15,23,42,0.16)]">
            <ul role="listbox" className="max-h-64 space-y-1 overflow-y-auto">
              {options.map((option) => {
                const active = option.value === value;

                return (
                  <li key={option.value}>
                    <button
                      type="button"
                      onClick={() => {
                        onChange(option.value);
                        setIsOpen(false);
                      }}
                      className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-left text-sm transition-colors ${active
                          ? "bg-pink-50 font-semibold text-pink-700"
                          : "text-gray-700 hover:bg-gray-50"
                        }`}
                    >
                      <span>{option.label}</span>
                      {active && <Check className="h-4 w-4 text-pink-600" />}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}