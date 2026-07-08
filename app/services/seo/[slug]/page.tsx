import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2, ChevronDown } from "lucide-react";

import seoServices from "../../../data/seo-services.json";
import { iconMap } from "../../../Components/Iconsmap";

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Pre-render every service detail page at build time
export function generateStaticParams() {
  return seoServices.map((service) => ({ slug: service.slug }));
}

// Per-page <title> / meta description
export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const service = seoServices.find((s) => s.slug === slug);
  if (!service) return {};

  return {
    title: `${service.title} | FBS Signs SEO Services`,
    description: service.shortDesc,
  };
}

export default async function ServiceDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const service = seoServices.find((s) => s.slug === slug);

  if (!service) {
    notFound();
  }

  const Icon = iconMap[service.icon];
  const otherServices = seoServices
    .filter((s) => s.slug !== service.slug)
    .slice(0, 3);

  const badge = service.badge || "SEO SERVICE";
  const highlight = service.highlight || service.shortDesc;
  const tags: string[] = service.tags || [];
  const faqs = service.faqs || [];
  const overviewParagraphs = service.overview.split("\n\n").filter(Boolean);

  // JSON-LD structured data for FAQ rich results in Google
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.a,
      },
    })),
  };

  return (
    <main>
      {/* JSON-LD for FAQ rich snippets */}
      {faqs.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      )}

      {/* Section - 1: Hero (breadcrumb + split layout) */}
      <section className="mt-24 xl:mt-20">
        <div className="container">
          {/* Breadcrumb */}
          <p className="text-gray-600 text-base sm:text-lg mb-8">
            <Link href="/" className="text-pink-600 font-medium">
              Home
            </Link>
            <span className="mx-2">&gt;</span>
            <Link href="/services/seo" className="text-pink-600 font-medium">
              SEO
            </Link>
            <span className="mx-2">&gt;</span>
            <span className="text-gray-800 font-semibold">{service.title}</span>
          </p>

          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
            {/* LEFT: Image with floating caption + tags */}
            <div>
              <div className="relative w-full aspect-[4/3.2] rounded-3xl overflow-hidden shadow-xl">
                <Image
                  src={service.heroImage}
                  alt={`${service.title} visual`}
                  fill
                  className="object-cover"
                  priority
                />

                {/* Floating caption card */}
                <div className="absolute bottom-5 left-5 right-5 sm:right-auto sm:max-w-md bg-white rounded-2xl shadow-lg px-5 py-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-pink-50 flex items-center justify-center flex-shrink-0">
                    {Icon ? (
                      <Icon className="w-5 h-5 text-pink-600" />
                    ) : (
                      <div className="w-5 h-5 rounded bg-pink-600" />
                    )}
                  </div>
                  <p className="text-gray-900 font-semibold text-sm sm:text-base leading-snug">
                    {highlight}
                  </p>
                </div>
              </div>

              {/* Tag pills */}
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-5">
                  {tags.map((tag, i) => (
                    <span
                      key={i}
                      className="px-4 py-1.5 rounded-full bg-pink-50 text-pink-600 text-sm font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* RIGHT: Content */}
            <div>
              <span className="inline-block px-4 py-1.5 rounded-full bg-pink-100 text-pink-600 text-xs sm:text-sm font-bold tracking-wide mb-5">
                {badge}
              </span>

              <h1 className="font-extrabold leading-tight tracking-tight text-4xl sm:text-5xl md:text-6xl mb-6">
                <span className="bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                  {service.title}
                </span>
              </h1>

              <div className="space-y-4 mb-8">
                {overviewParagraphs.map((para, i) => (
                  <p
                    key={i}
                    className="text-gray-600 text-base sm:text-lg leading-relaxed"
                  >
                    {para}
                  </p>
                ))}
              </div>

              {/* What's included */}
              {service.benefits && service.benefits.length > 0 && (
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">
                    What&apos;s included
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    {service.benefits.map((benefit, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-3 bg-gray-50 rounded-xl p-4"
                      >
                        <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-pink-600 mt-0.5" />
                        <p className="text-gray-700 text-sm sm:text-base leading-snug">
                          {benefit}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Section - 2: Process */}
      {service.process && service.process.length > 0 && (
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 mt-8">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
              How It <span className="text-pink-600">Works</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {service.process.map((item, i) => (
              <div
                key={i}
                className="rounded-2xl p-6 bg-white hover:shadow-xl transition duration-300 flex flex-col h-full border border-gray-100"
              >
                <span className="text-pink-500 font-bold text-sm mb-3">
                  Step {i + 1}
                </span>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                  {item.step}
                </h3>
                <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Section - 3: Hero Image Banner */}
      <section className="relative mx-auto">
        <div className="container section-padding mx-auto max-w-6xl relative">
          <div className="relative w-full h-[320px] md:h-[420px] rounded-3xl overflow-hidden shadow-2xl">
            <Image
              src={service.Image}
              alt={`${service.title} visual`}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/40"></div>
            <div className="absolute inset-0 flex items-center justify-center px-6 md:px-12">
              <div className="max-w-3xl text-white">
                <h2 className="text-2xl md:text-3xl font-extrabold text-center leading-tight">
                  Ready to see results with {service.title}?
                </h2>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section - 4: FAQs (native details/summary accordion, no client JS needed) */}
      {faqs.length > 0 && (
        <section className="container section-padding">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
              Frequently Asked <span className="text-pink-600">Questions</span>
            </h2>
            <p className="mt-4 text-gray-600 text-base sm:text-lg">
              Answers to common questions about {service.title.toLowerCase()}.
            </p>
          </div>

          <div className="max-w-3xl mx-auto divide-y divide-gray-200 border border-gray-200 rounded-2xl overflow-hidden bg-white">
            {faqs.map((faq, i) => (
              <details key={i} className="group" open={i === 0}>
                <summary className="list-none cursor-pointer w-full flex items-center justify-between gap-4 px-5 sm:px-6 py-5 hover:bg-gray-50 transition-colors marker:content-none [&::-webkit-details-marker]:hidden">
                  <span className="text-base sm:text-lg font-semibold text-gray-900">
                    {faq.q}
                  </span>
                  <ChevronDown className="w-5 h-5 flex-shrink-0 text-pink-600 transition-transform duration-300 group-open:rotate-180" />
                </summary>
                <p className="px-5 sm:px-6 pb-5 text-gray-600 text-sm sm:text-base leading-relaxed">
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </section>
      )}

      {/* Section - 5: Related Services */}
      {otherServices.length > 0 && (
        <section className="container section-padding">
          <h2 className="text-center text-2xl sm:text-3xl font-bold text-gray-900 mb-10">
            Explore Other Services
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {otherServices.map((s) => {
              const OtherIcon = iconMap[s.icon];
              return (
                <Link
                  key={s.slug}
                  href={`/services/seo/${s.slug}`}
                  className="group rounded-2xl p-6 bg-white hover:shadow-xl transition duration-300 border border-gray-100"
                >
                  <div className="flex items-center gap-3 mb-3">
                    {OtherIcon && (
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-pink-500 to-pink-600 flex items-center justify-center text-white">
                        <OtherIcon className="w-5 h-5" />
                      </div>
                    )}
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 group-hover:text-pink-600 transition-colors">
                      {s.title}
                    </h3>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {s.shortDesc}
                  </p>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* Section - 6: CTA */}
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
          <div className="flex justify-center mt-8">
            <Link
              href="/services/seo"
              className="text-pink-600 font-semibold hover:underline"
            >
              ← Back to all SEO services
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}