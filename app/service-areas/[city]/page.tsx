import type { Metadata } from "next";
import Script from "next/script";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import Navbar from "@/app/Components/Navbar";
import Footer from "@/app/Components/Footer";
import { serviceAreas, getServiceArea } from "@/app/data/service-areas-data";
import { getRequestBaseUrl } from "@/app/lib/request-url";
import { absoluteUrl } from "@/app/lib/seo";
import { getLocationMarkets } from "@/app/lib/service-location-pages";

interface PageProps {
  params: Promise<{ city: string }>;
}

export function generateStaticParams() {
  return serviceAreas.map((city) => ({
    city: city.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { city } = await params;
  const area = getServiceArea(city);

  if (!area) {
    return {};
  }

  const baseUrl = await getRequestBaseUrl();
  const canonical = absoluteUrl(`/service-areas/${area.slug}`, baseUrl);

  return {
    title: `Custom Signs, Print & SEO in ${area.name}, IL | ${area.county} | FBS Signs`,
    description: `Need signage or marketing in ${area.name}, IL? FBS Signs provides storefront signs, commercial printing, direct mail, web design, and local SEO across ${area.county}.`,
    alternates: {
      canonical,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
  };
}

export default async function CityServiceAreaPage({ params }: PageProps) {
  const { city } = await params;
  const area = getServiceArea(city);

  if (!area) {
    notFound();
  }

  const baseUrl = await getRequestBaseUrl();
  const canonical = absoluteUrl(`/service-areas/${area.slug}`, baseUrl);

  // Schemas
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": `${canonical}#breadcrumb`,
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: absoluteUrl("/", baseUrl),
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Service Areas",
        item: absoluteUrl("/service-areas", baseUrl),
      },
      {
        "@type": "ListItem",
        position: 3,
        name: area.name,
        item: canonical,
      },
    ],
  };

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${canonical}#local-business`,
    name: `FBS Signs - ${area.name} Service Area`,
    description: `FBS Signs provides custom signage, printing products, direct mailing, web design, and SEO services for businesses in ${area.name}, Illinois.`,
    url: canonical,
    telephone: "+1-855-222-1133",
    image: absoluteUrl("/images/brand/fbs-prints-logo.webp", baseUrl),
    logo: absoluteUrl("/images/brand/fbs-prints-logo.webp", baseUrl),
    address: {
      "@type": "PostalAddress",
      addressLocality: area.name,
      addressRegion: area.stateCode,
      addressCountry: "US",
    },
    areaServed: {
      "@type": "City",
      name: area.name,
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: `FBS Signs Services in ${area.name}, IL`,
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Custom Signage Services",
            description: "Custom storefront signs, LED channel letters, window vinyls, and vehicle wraps."
          }
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Commercial Printing Products",
            description: "Premium business cards, brochures, restaurant menus, catalogs, and marketing handouts."
          }
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Targeted Direct Mailing",
            description: "Route-based Every Door Direct Mail (EDDM) and direct mailing campaigns targeting local zip codes."
          }
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Responsive Web Design",
            description: "Custom lead-generation websites, mobile-friendly layouts, and service landing pages."
          }
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Local SEO & Optimization",
            description: "Google Map Pack ranking, localized search visibility, and directory listings optimization."
          }
        }
      ]
    }
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${canonical}#faq`,
    mainEntity: area.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  const markets = getLocationMarkets();
  const matchingMarket = markets.find(
    (m) => m.city.toLowerCase() === area.name.toLowerCase()
  );

  const getServiceLink = (genericPath: string) => {
    if (!matchingMarket) return genericPath;

    if (genericPath === "/services/signage") {
      return `/services/signage-in-${matchingMarket.slug}`;
    }
    if (genericPath === "/services/printing-products") {
      return `/services/printing-products-in-${matchingMarket.slug}`;
    }
    if (genericPath === "/services/direct-mailing") {
      return `/services/direct-mail-services-in-${matchingMarket.slug}`;
    }
    if (genericPath === "/services/web-design") {
      return `/services/web-design-in-${matchingMarket.slug}`;
    }
    if (genericPath === "/services/seo") {
      return `/services/seo-services-in-${matchingMarket.slug}`;
    }
    return genericPath;
  };

  const services = [
    {
      title: "Custom Signage Services",
      desc: "From illuminated LED channel letters to window graphics, vehicle wraps, and monumental property signs, we build high-impact signage tailored to local codes.",
      href: getServiceLink("/services/signage"),
      image: "/images/services/signage/signage-service.webp",
    },
    {
      title: "Commercial Printing Products",
      desc: "Keep your brand consistent with business cards, banners, menus, brochures, and sales kits manufactured to premium specs and repeat-ready.",
      href: getServiceLink("/services/printing-products"),
      image: "/images/services/printing/printing-products-service.webp",
    },
    {
      title: "Targeted Direct Mailing",
      desc: "Coordinate end-to-end direct mail and EDDM campaigns targeting postal routes in specific residential neighborhoods to acquire local leads.",
      href: getServiceLink("/services/direct-mailing"),
      image: "/images/services/direct-mail/direct-mail-service.webp",
    },
    {
      title: "Responsive Web Design",
      desc: "Convert search traffic with fast-loading, mobile-friendly business websites and service pages built for credibility and clear leads.",
      href: getServiceLink("/services/web-design"),
      image: "/images/services/web-design/web-design-service.webp",
    },
    {
      title: "Local SEO & Optimization",
      desc: "Rank in regional search results and map packs with structured optimization that aligns search engines with your local operations.",
      href: getServiceLink("/services/seo"),
      image: "/images/services/seo/seo-service-card.webp",
    },
  ];

  return (
    <>
      <Script
        id="service-area-breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <Script
        id="service-area-localbusiness-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <Script
        id="service-area-faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <Navbar />
      <main className="bg-gradient-to-br from-gray-50 via-white to-pink-50/10 min-h-screen">

        {/* Hero Section */}
        <section className="bg-gradient-to-br from-gray-900 to-pink-950 text-white xl:pt-28 pt-20 pb-20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-pink-700/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-900/20 rounded-full blur-3xl" />

          <div className="container relative z-10 max-w-6xl mx-auto px-4">
            <div className="flex justify-center lg:justify-start">
              <div className="inline-flex items-center gap-3 bg-pink-500/10 text-pink-300 px-5 py-2 rounded-full border border-pink-500/20 shadow-lg mb-6">
                <span className="w-2 h-2 bg-pink-400 rounded-full animate-pulse" />
                <span className="text-[11px] font-bold uppercase tracking-widest">
                  {area.name} Service Area
                </span>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight tracking-tight mb-6">
                  Signage, Printing &amp; SEO in <br />
                  <span className="bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                    {area.name}, IL
                  </span>
                </h1>

                {/* Breadcrumbs */}
                <div className="flex items-center gap-2 text-sm text-gray-400 mb-6 font-medium">
                  <Link href="/" className="hover:text-pink-400 transition-colors">Home</Link>
                  <span>/</span>
                  <Link href="/service-areas" className="hover:text-pink-400 transition-colors">Service Areas</Link>
                  <span>/</span>
                  <span className="text-pink-300 font-bold">{area.name}</span>
                </div>

                <p className="text-gray-300 text-base sm:text-lg leading-relaxed mb-8">
                  {area.introduction}
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    href="/contact"
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-pink-700 hover:bg-pink-800 text-white px-8 py-4 font-bold shadow-lg transition-all duration-300"
                  >
                    Request a Free Quote
                  </Link>
                  <Link
                    href="/service-areas"
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-gray-600 hover:bg-white/10 text-white px-8 py-4 font-semibold transition-all duration-300"
                  >
                    View All Service Cities
                  </Link>
                </div>
              </div>

              {/* Right Side Visuals */}
              <div className="relative">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-100/10 rounded-full blur-2xl" />
                <div className="absolute bottom-20 -left-10 w-60 h-60 bg-pink-100/10 rounded-full blur-3xl" />
                <div className="grid grid-cols-2 gap-4">
                  <div className="relative h-60 rounded-2xl overflow-hidden shadow-md float-1">
                    <Image
                      src="/images/services/signage/signage-service.webp"
                      alt="Custom storefront sign"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="relative h-60 rounded-2xl overflow-hidden shadow-md float-2 mt-8">
                    <Image
                      src="/images/services/printing/printing-products-service.webp"
                      alt="High quality print collateral"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* AI & Search Engine Optimization Answer Box (AEO/GEO Section) */}
        <section className="container py-12 px-4 max-w-5xl mx-auto">
          <div className="bg-gradient-to-br from-pink-50/60 via-white to-purple-50/40 rounded-3xl p-8 md:p-10 border border-pink-100/80 shadow-md">
            <div className="flex items-center gap-3 mb-6">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-pink-100 text-pink-600 font-bold text-sm">
                ✨
              </span>
              <h2 className="text-2xl font-extrabold text-gray-900 leading-tight">
                Local Quick Answers: Services in {area.name}, IL
              </h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white/85 p-6 rounded-2xl border border-pink-50/60 shadow-sm hover:shadow-md transition-shadow duration-300">
                <h3 className="text-base font-bold text-gray-900 mb-2">What marketing &amp; branding services are available in {area.name}?</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  FBS Signs provides end-to-end design, fabrication, and marketing services in {area.name}, IL. This includes custom storefront signs, business print collateral, targeted direct mailing (EDDM), modern web design, and local SEO services tailored to the regional business market.
                </p>
              </div>
              <div className="bg-white/85 p-6 rounded-2xl border border-pink-50/60 shadow-sm hover:shadow-md transition-shadow duration-300">
                <h3 className="text-base font-bold text-gray-900 mb-2">How does FBS Signs handle zoning regulations for custom signage in {area.name}?</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  We manage the entire commercial sign permit and approval process directly with {area.name}'s building division and zoning board. Our custom exterior signs, channel letters, and monument graphics are engineered to meet all local zoning requirements.
                </p>
              </div>
              <div className="bg-white/85 p-6 rounded-2xl border border-pink-50/60 shadow-sm hover:shadow-md transition-shadow duration-300">
                <h3 className="text-base font-bold text-gray-900 mb-2">Can I launch target mailers in specific carrier routes in the {area.name} area?</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Yes. We specialize in planning and executing targeted Every Door Direct Mail (EDDM) campaigns, matching your print collateral to specific postal carrier routes and residential areas in {area.name} to maximize local lead acquisition.
                </p>
              </div>
              <div className="bg-white/85 p-6 rounded-2xl border border-pink-50/60 shadow-sm hover:shadow-md transition-shadow duration-300">
                <h3 className="text-base font-bold text-gray-900 mb-2">Why is local SEO vital for business growth in {area.county}?</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Optimizing your local online footprint ensures that your business ranks at the top of local map packs and regional searches. By integrating structured schema markup, local landing pages, and geographical citations, we build trust with search engines and LLM answer engines.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Localized GEO Section */}
        <section className="container py-16 px-4">
          <div className="bg-white rounded-3xl p-8 md:p-12 border border-pink-50 shadow-xl max-w-5xl mx-auto grid md:grid-cols-2 gap-10 items-center">
            <div>
              <span className="text-pink-600 font-bold text-xs uppercase tracking-widest block mb-2">
                GEO &amp; Local Focus
              </span>
              <h2 className="text-3xl font-extrabold text-gray-900 mb-4 leading-tight">
                Serving the {area.name} Community
              </h2>
              <div className="w-12 h-1 bg-pink-600 rounded-full mb-6" />
              <p className="text-gray-600 leading-relaxed mb-6">
                {area.localSeoContent}
              </p>

              <h3 className="text-lg font-bold text-gray-900 mb-3">Key Locations &amp; Landmarks:</h3>
              <div className="flex flex-wrap gap-2">
                {area.landmarks.map((landmark) => (
                  <span
                    key={landmark}
                    className="inline-flex items-center bg-pink-50 text-pink-700 text-xs font-semibold px-3 py-1.5 rounded-full border border-pink-100"
                  >
                    {landmark}
                  </span>
                ))}
              </div>
            </div>
            <div className="relative h-[250px] md:h-[350px] rounded-2xl overflow-hidden shadow-md">
              <iframe
                src={`https://www.google.com/maps?q=${encodeURIComponent(
                  `${area.name}, ${area.stateCode}, USA`
                )}&output=embed`}
                className="w-full h-full border-0"
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title={`${area.name} regional map`}
              />
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="container py-12 px-4 bg-pink-50/30 rounded-3xl max-w-6xl mx-auto mb-16">
          <div className="text-center mb-12">
            <span className="text-pink-600 font-bold text-xs uppercase tracking-widest block mb-2">
              Why Partner With Us
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight">
              Why Choose FBS Signs in {area.name}
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {area.whyChooseUs.map((point) => (
              <div
                key={point.title}
                className="bg-white p-8 rounded-2xl border border-pink-50 shadow-md flex flex-col h-full hover:shadow-lg transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-pink-100 text-pink-600 flex items-center justify-center font-bold text-xl mb-6">
                  ✓
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{point.title}</h3>
                <p className="text-gray-600 leading-relaxed text-sm">{point.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Services Offered Section */}
        <section className="container py-12 px-4 max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-pink-600 font-bold text-xs uppercase tracking-widest block mb-2">
              Our Services
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight">
              Services Available in {area.name}
            </h2>
            <p className="text-gray-600 mt-3 text-base max-w-2xl mx-auto">
              {area.servicesDescription}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <div
                key={service.title}
                className="group bg-white rounded-3xl border border-pink-50 p-6 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col h-full hover:-translate-y-1"
              >
                <div className="relative h-48 w-full rounded-2xl overflow-hidden mb-6">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 group-hover:text-pink-700 transition-colors mb-3">
                  {service.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-6 flex-grow">
                  {service.desc}
                </p>
                <Link
                  href={service.href}
                  className="inline-flex items-center justify-between w-full bg-pink-50 text-pink-700 group-hover:bg-pink-700 group-hover:text-white px-5 py-3 rounded-2xl font-semibold transition-all duration-300"
                >
                  <span>Learn More</span>
                  <span className="transform transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* FAQs section */}
        <section className="container py-16 px-4 max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-pink-600 font-bold text-xs uppercase tracking-widest block mb-2">
              Frequently Asked Questions
            </span>
            <h2 className="text-3xl font-extrabold text-gray-900 leading-tight">
              {area.name} Service FAQs
            </h2>
          </div>

          <div className="space-y-4">
            {area.faqs.map((faq, index) => (
              <details
                key={index}
                className="group border border-pink-100 bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 [&_summary::-webkit-details-marker]:hidden"
              >
                <summary className="flex items-center justify-between cursor-pointer focus:outline-none">
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-pink-700 transition-colors">
                    {faq.question}
                  </h3>
                  <span className="ml-1.5 flex-shrink-0 rounded-full bg-pink-50 text-pink-700 p-1.5 group-open:rotate-180 transition-transform duration-300">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="2.5"
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                    </svg>
                  </span>
                </summary>
                <p className="mt-4 text-gray-600 leading-relaxed text-sm border-t border-gray-50 pt-4">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </section>

        {/* Nearby Cities Matrix */}
        <section className="container py-12 px-4 max-w-6xl mx-auto mb-16">
          <div className="text-center mb-8">
            <span className="text-pink-600 font-bold text-xs uppercase tracking-widest block mb-2">
              Regional Coverage
            </span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 leading-tight">
              Other Service Areas Near {area.name}
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {area.nearbyCities.map((cityName, idx) => {
              const citySlug = area.nearbyCitySlugs[idx];
              return (
                <Link
                  key={citySlug + "-" + idx}
                  href={`/service-areas/${citySlug}`}
                  className="flex items-center justify-center p-4 rounded-xl border border-pink-100 bg-white text-gray-800 text-sm font-semibold hover:border-pink-600 hover:text-pink-700 hover:shadow-md transition-all duration-300 text-center"
                >
                  {cityName}
                </Link>
              );
            })}
          </div>
        </section>

        {/* CTA Section */}
        <section className="container py-12 px-4 mb-16">
          <div className="bg-gradient-to-r from-pink-600 to-pink-700 rounded-3xl px-6 py-12 text-white text-center max-w-5xl mx-auto shadow-xl">
            <h2 className="text-3xl md:text-4xl font-extrabold leading-tight">
              Ready to Grow Your Presence in {area.name}?
            </h2>
            <p className="max-w-2xl mx-auto mt-4 text-base md:text-lg text-pink-100 leading-relaxed">
              Connect with our local experts today. We provide free consultations, local code advice, and detailed quotes.
            </p>
            <div className="pt-8">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-pink-700 font-bold shadow-lg transition-all duration-300 hover:scale-105"
              >
                Get A Free Quote
              </Link>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
