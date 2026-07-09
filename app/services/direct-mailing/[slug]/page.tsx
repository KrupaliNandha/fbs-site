import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import * as LucideIcons from "lucide-react";
import {
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock,
  Layers,
  Mail,
  Package,
  Sparkles,
  Tag,
} from "lucide-react";
import rawData from "../../../data/direct-mailing.json";

/* ---------------------------------------------------------------------- */
/*  Types                                                                  */
/* ---------------------------------------------------------------------- */

interface FormatSpec {
  label: string;
  value: string;
}

interface FormatFaq {
  question: string;
  answer: string;
}

interface MailFormat {
  id: string;
  slug: string;
  title: string;
  description: string;
  icon: string;
  img: string;
  detailsLabel: string;
  detailsValue: string;
  specs: FormatSpec[];
  bestFor: string[];
  tags: string[];
  paperStock: string[];
  printSides: string;
  finishingOptions: string[];
  mailClass: string[];
  turnaround: string;
  minQuantity: number;
  priceTier: string;
  designServiceAvailable: boolean;
  mailingListServiceAvailable: boolean;
  faqs: FormatFaq[];
  relatedFormats: string[];
}

interface DirectMailData {
  section: {
    eyebrow: string;
    title: string;
    description: string;
    sourceUrl: string;
  };
  formats: MailFormat[];
}

const data = rawData as DirectMailData;

/* ---------------------------------------------------------------------- */
/*  Inline data helpers (no separate lib file)                             */
/* ---------------------------------------------------------------------- */

function getAllFormats(): MailFormat[] {
  return data.formats;
}

function getFormatBySlug(slug: string): MailFormat | undefined {
  return data.formats.find((format) => format.slug === slug);
}

function getRelatedFormats(format: MailFormat): MailFormat[] {
  return getAllFormats().filter((item) => item.slug !== format.slug);
}

/* ---------------------------------------------------------------------- */
/*  Icon resolver                                                          */
/* ---------------------------------------------------------------------- */

function resolveIcon(iconName: string) {
  const IconComponent = (
    LucideIcons as unknown as Record<string, LucideIcons.LucideIcon>
  )[iconName];
  return IconComponent ?? Mail;
}

/* ---------------------------------------------------------------------- */
/*  Static params + metadata                                               */
/* ---------------------------------------------------------------------- */

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getAllFormats().map((format) => ({ slug: format.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const format = getFormatBySlug(slug);
  if (!format) return {};

  return {
    title: `${format.title} | Direct Mail Formats | FBS Signs`,
    description: format.description,
    openGraph: {
      title: format.title,
      description: format.description,
      images: [{ url: format.img }],
    },
  };
}

/* ---------------------------------------------------------------------- */
/*  Copy helpers                                                           */
/* ---------------------------------------------------------------------- */

function buildHeroCaption(format: MailFormat): string {
  return format.bestFor[0] ?? `Built for ${format.title.toLowerCase()}`;
}

function buildWhyItMattersCopy(format: MailFormat): string {
  const stock = format.paperStock[0]?.toLowerCase() ?? "premium stock";
  const mailClass = format.mailClass[0];
  return `${format.title} built on ${stock} hold up in the mailbox and in the hand, which matters more than most people expect — a flimsy piece reads as a flimsy brand. We produce every run on ${mailClass} timelines your campaign can actually plan around, with a ${format.turnaround.toLowerCase()} turnaround so a seasonal push doesn't stall in production. Because everything is printed and finished in-house, changes to quantity, stock, or finishing don't mean starting the quote over.`;
}

// Short, single-line "What's included" statements.
function buildIncludedItems(format: MailFormat): string[] {
  const items: string[] = [];

  format.bestFor.forEach((item) => {
    items.push(`Purpose-built for ${item.toLowerCase()}`);
  });

  items.push(
    `${format.printSides} on ${format.paperStock[0]?.toLowerCase() ?? "premium stock"}`,
  );

  format.finishingOptions.forEach((option) => {
    items.push(`${option} finishing available`);
  });

  if (format.designServiceAvailable) {
    items.push("In-house design service, start to finish");
  }
  if (format.mailingListServiceAvailable) {
    items.push("Mailing list sourcing and targeting included");
  }

  return items.slice(0, 6);
}

/* ---------------------------------------------------------------------- */
/*  Page                                                                    */
/* ---------------------------------------------------------------------- */

export default async function DirectMailFormatPage({ params }: PageProps) {
  const { slug } = await params;
  const format = getFormatBySlug(slug);
  if (!format) notFound();

  const related = getRelatedFormats(format);
  const includedItems = buildIncludedItems(format);
  const badge = format.tags[0]
    ? format.tags[0].toUpperCase()
    : "PRODUCTION FORMAT";

  return (
    <main className="bg-white mt-16">
      {/* ============================================================ */}
      {/* SECTION 1 — HERO                                              */}
      {/* ============================================================ */}
      <section className="mt-24 xl:mt-20">
        <div className="container">
          {/* Breadcrumb */}
          <p className="text-slate-600 text-base sm:text-lg mb-8">
            <Link href="/" className="text-pink-600 font-medium">
              Home
            </Link>
            <span className="mx-2">&gt;</span>
            <Link
              href="/services/direct-mailing"
              className="text-pink-600 font-medium"
            >
              Direct Mailing
            </Link>
            <span className="mx-2">&gt;</span>
            <span className="text-slate-800 font-semibold">{format.title}</span>
          </p>

          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
            {/* LEFT: image with floating caption + tags */}
            <div>
              <div className="relative w-full aspect-[4/3.2] rounded-3xl overflow-hidden shadow-xl">
                <Image
                  src={format.img}
                  alt={`${format.title} visual`}
                  fill
                  sizes="(min-width: 1024px) 45vw, 90vw"
                  className="object-cover"
                  priority
                />

                {/* Floating caption card, positioned over the image */}
                <div className="absolute bottom-5 left-5 right-5 sm:right-auto sm:max-w-md bg-white rounded-2xl shadow-lg px-5 py-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-pink-50 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-pink-600" />
                  </div>
                  <p className="text-slate-900 font-semibold text-sm sm:text-base leading-snug">
                    {buildHeroCaption(format)}
                  </p>
                </div>
              </div>

              {/* Tag pills */}
              <div className="flex flex-wrap gap-2 mt-5">
                {format.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-4 py-1.5 rounded-full bg-pink-50 text-pink-600 text-sm font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* RIGHT: content */}
            <div>
              <span className="inline-block px-4 py-1.5 rounded-full bg-pink-100 text-pink-600 text-xs sm:text-sm font-bold tracking-wide mb-5">
                {badge}
              </span>

              <h1 className="font-extrabold leading-tight tracking-tight text-4xl sm:text-5xl md:text-6xl mb-6">
                <span className="bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                  {format.title}
                </span>
              </h1>

              <p className="text-slate-600 text-base sm:text-lg leading-relaxed mb-8">
                {format.description}
              </p>

              {/* What's included */}
              {includedItems.length > 0 && (
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-4">
                    What&apos;s included
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    {includedItems.map((item, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-3 bg-slate-50 rounded-xl p-4"
                      >
                        <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-pink-600 mt-0.5" />
                        <p className="text-slate-700 text-sm sm:text-base leading-snug">
                          {item}
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

      {/* ============================================================ */}
      {/* SECTION 2 — Quick facts strip                                 */}
      {/* ============================================================ */}
      <section className="container pb-16 pt-16">
        <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-slate-200 bg-slate-200 sm:grid-cols-4">
          {[
            { icon: Clock, label: "Turnaround", value: format.turnaround },
            {
              icon: Package,
              label: "Min. Quantity",
              value: format.minQuantity.toLocaleString(),
            },
            {
              icon: Mail,
              label: format.detailsLabel,
              value: format.detailsValue,
            },
            { icon: Tag, label: "Price Tier", value: format.priceTier },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex flex-col gap-2 bg-white p-5">
              <Icon className="h-4 w-4 text-[#EC1279]" />
              <dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                {label}
              </dt>
              <dd className="text-md font-semibold text-[#0F1B33]">{value}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* ============================================================ */}
      {/* SECTION 3 — Why This Format Matters                           */}
      {/* ============================================================ */}
      <section className="container pb-16">
        <div className="relative rounded-3xl border border-pink-100 bg-gradient-to-br from-pink-50 via-white to-purple-50 px-6 py-10 sm:px-10 sm:py-12 overflow-hidden shadow-sm">
          <div className="absolute -bottom-16 -right-16 w-56 h-56 bg-purple-100 rounded-full blur-3xl opacity-40 z-0" />
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-pink-100 rounded-full blur-3xl opacity-40 z-0" />

          <div className="relative z-10 max-w-6xl mx-auto">
            {/* Heading */}
            <div className="text-center max-w-3xl mx-auto mb-12">
              <span className="inline-block px-4 py-1.5 rounded-full bg-white text-[#EC1279] text-[11px] font-extrabold uppercase tracking-[0.15em] shadow-sm mb-4">
                Why It Works
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F1B33] mb-5">
                Why {format.title} Matter for Your Business
              </h2>
              <p className="text-base sm:text-lg leading-relaxed text-slate-600">
                {buildWhyItMattersCopy(format)}
              </p>
            </div>

            {/* Features Grid: Paper Stock, Mail Class, Sizes */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {/* Card 1: Paper Stock */}
              <div className="rounded-3xl bg-white/80 backdrop-blur-sm border border-white shadow-xl shadow-slate-200/40 p-6 sm:p-8 hover:-translate-y-1 transition-transform duration-300">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-100 to-pink-50 flex items-center justify-center shadow-sm">
                    <Layers className="h-6 w-6 text-[#EC1279]" />
                  </div>
                  <h3 className="text-lg font-bold text-[#0F1B33]">
                    Paper Stock
                  </h3>
                </div>
                <div className="flex flex-col gap-3">
                  {format.paperStock.map((stock) => (
                    <div
                      key={stock}
                      className="flex items-center justify-between rounded-xl bg-slate-50/80 border border-slate-100 px-4 py-3 text-[15px] font-semibold text-slate-700"
                    >
                      {stock}
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Card 2: Mail Class */}
              <div className="rounded-3xl bg-white/80 backdrop-blur-sm border border-white shadow-xl shadow-slate-200/40 p-6 sm:p-8 hover:-translate-y-1 transition-transform duration-300">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-100 to-purple-50 flex items-center justify-center shadow-sm">
                    <Sparkles className="h-6 w-6 text-[#7C3AED]" />
                  </div>
                  <h3 className="text-lg font-bold text-[#0F1B33]">
                    Mail Class
                  </h3>
                </div>
                <div className="flex flex-col gap-3">
                  {format.mailClass.map((mc) => (
                    <div
                      key={mc}
                      className="flex items-center justify-between rounded-xl bg-slate-50/80 border border-slate-100 px-4 py-3 text-[15px] font-semibold text-slate-700"
                    >
                      {mc}
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Card 3: Available Sizes */}
              {format.specs.length > 0 && (
                <div className="rounded-3xl bg-white/80 backdrop-blur-sm border border-white shadow-xl shadow-slate-200/40 p-6 sm:p-8 sm:col-span-2 lg:col-span-1 hover:-translate-y-1 transition-transform duration-300">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center shadow-sm">
                      <Tag className="h-6 w-6 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-bold text-[#0F1B33]">
                      Available Sizes
                    </h3>
                  </div>
                  <div className="flex flex-wrap lg:flex-col gap-3">
                    {format.specs.map((spec, i) => (
                      <div
                        key={`${spec.label}-${i}`}
                        className="flex-1 min-w-[120px] lg:w-full flex items-center justify-center lg:justify-start rounded-xl bg-blue-50/50 px-4 py-3 text-[15px] font-bold text-slate-600 border border-slate-100 transition-colors hover:border-blue-300 hover:bg-blue-50"
                      >
                        {spec.label.toLowerCase() !== "size" && (
                          <span className="text-[11px] uppercase tracking-wider text-slate-600 mr-2">
                            {spec.label}
                          </span>
                        )}
                        {spec.value}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION 4 — FAQ + CTA banner                                  */}
      {/* ============================================================ */}
      {format.faqs?.length > 0 && (
        <section className="container pb-16">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-center text-[#0F1B33]">
              Frequently Asked <span className="text-[#EC1279]">Questions</span>
            </h2>
            <p className="text-slate-500 text-center mt-2 mb-8 text-sm sm:text-base">
              Answers to common questions about {format.title.toLowerCase()}.
            </p>

            <div className="mx-auto grid max-w-4xl grid-cols-1 gap-3 sm:gap-4">
              {format.faqs.map((faq, index) => (
                <details
                  key={index}
                  name="direct-mailing-faq"
                  className="group overflow-hidden rounded-xl border-2 border-transparent bg-white shadow-md transition-all duration-300 hover:-translate-y-[2px] hover:shadow-lg open:border-[#EC1279] open:shadow-lg sm:rounded-2xl"
                  open={index === 0}
                >
                  <summary className="list-none cursor-pointer flex w-full items-center justify-between gap-4 px-5 py-4 text-left sm:px-6 sm:py-5 marker:content-none [&::-webkit-details-marker]:hidden">
                    <span className="text-sm font-semibold leading-snug text-gray-900 transition-colors duration-300 group-open:text-[#EC1279] sm:text-base">
                      {faq.question}
                    </span>
                    <ChevronDown className="h-5 w-5 shrink-0 text-gray-900 transition-transform duration-300 group-open:rotate-180 group-open:text-[#EC1279]" />
                  </summary>
                  <div className="overflow-hidden px-5 pb-4 sm:px-6 sm:pb-5">
                    <p className="text-sm leading-relaxed text-gray-500 sm:text-base">
                      {faq.answer}
                    </p>
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="container pb-16">
        <div className="rounded-3xl bg-[#0F1B33] px-8 py-12 text-center text-white sm:px-12 sm:py-14">
          <div className="mx-auto max-w-2xl">
            <h3 className="text-2xl font-bold">
              Ready to get started with {format.title}?
            </h3>
            <p className="mt-2 text-sm text-slate-300">
              Let&apos;s talk about what this looks like for your business.
            </p>
            <Link
              href="/contact"
              className="mt-6 inline-block rounded-full bg-[#EC1279] px-8 py-3 text-sm font-semibold text-white transition hover:bg-[#D40E6B]"
            >
              Get a Quote
            </Link>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION 5 — Explore More Formats                              */}
      {/* ============================================================ */}
      {related.length > 0 && (
        <section className="container py-16">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-center text-[#0F1B33] mb-10">
            Explore More Formats
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((item) => {
              const ItemIcon = resolveIcon(item.icon);
              return (
                <Link
                  key={item.slug}
                  href={`/services/direct-mailing/${item.slug}`}
                  className="group rounded-2xl border border-slate-200 bg-white p-6 transition hover:border-pink-200 hover:shadow-md"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-[#EC1279] flex items-center justify-center flex-shrink-0">
                      <ItemIcon className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-base font-bold text-[#0F1B33]">
                      {item.title}
                    </h3>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed line-clamp-2">
                    {item.description}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[#EC1279]">
                    Learn more
                    <ChevronRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                  </span>
                </Link>
              );
            })}
          </div>
        </section>
      )}
    </main>
  );
}
