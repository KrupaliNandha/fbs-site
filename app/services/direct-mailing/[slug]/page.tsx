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

  return items.slice(0, 8);
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
    <main className="bg-white mt-24">
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
              <dd className="text-sm font-semibold text-[#0F1B33]">{value}</dd>
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

          <div className="relative max-w-4xl mx-auto">
            {/* Heading */}
            <span className="inline-block px-3 py-1 rounded-full bg-white text-[#EC1279] text-xs font-bold tracking-wide shadow-sm mb-4">
              WHY IT WORKS
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F1B33]">
              Why {format.title} Matter for Your Business
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed text-slate-600 max-w-2xl">
              {buildWhyItMattersCopy(format)}
            </p>

            {/* Paper Stock / Mail Class cards */}
            <div className="mt-10 grid gap-5 sm:grid-cols-2">
              <div className="rounded-2xl bg-white border border-slate-100 shadow-sm p-6">
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="w-9 h-9 rounded-lg bg-pink-50 flex items-center justify-center">
                    <Layers className="h-4 w-4 text-[#EC1279]" />
                  </div>
                  <h3 className="text-sm font-bold text-[#0F1B33]">
                    Paper Stock
                  </h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {format.paperStock.map((stock) => (
                    <span
                      key={stock}
                      className="rounded-full bg-slate-50 border border-slate-200 px-3.5 py-1.5 text-xs font-medium text-slate-600"
                    >
                      {stock}
                    </span>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl bg-white border border-slate-100 shadow-sm p-6">
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="w-9 h-9 rounded-lg bg-pink-50 flex items-center justify-center">
                    <Sparkles className="h-4 w-4 text-[#EC1279]" />
                  </div>
                  <h3 className="text-sm font-bold text-[#0F1B33]">
                    Mail Class
                  </h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {format.mailClass.map((mc) => (
                    <span
                      key={mc}
                      className="rounded-full bg-slate-50 border border-slate-200 px-3.5 py-1.5 text-xs font-medium text-slate-600"
                    >
                      {mc}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Available Sizes */}
            {format.specs.length > 0 && (
              <div className="mt-6 rounded-2xl bg-white border border-slate-100 shadow-sm p-6">
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="w-9 h-9 rounded-lg bg-pink-50 flex items-center justify-center">
                    <Tag className="h-4 w-4 text-[#EC1279]" />
                  </div>
                  <h3 className="text-sm font-bold text-[#0F1B33]">
                    Available Sizes
                  </h3>
                </div>
                <div className="flex flex-wrap gap-3">
                  {format.specs.map((spec, i) => (
                    <div
                      key={`${spec.label}-${i}`}
                      className="rounded-xl bg-slate-50 px-5 py-2.5 text-[15px] font-semibold text-slate-700 border border-slate-200 transition-colors hover:border-pink-300 hover:bg-pink-50/50"
                    >
                      {spec.label.toLowerCase() !== "size" && (
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mr-1.5">
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

            <div className="rounded-2xl border border-slate-200 overflow-hidden divide-y divide-slate-200">
              {format.faqs.map((faq, index) => (
                <details
                  key={faq.question}
                  className={`group ${index % 2 === 0 ? "bg-white" : "bg-slate-50"}`}
                  {...(index === 0 ? { open: true } : {})}
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-5 text-left [&::-webkit-details-marker]:hidden">
                    <span className="text-base sm:text-lg font-semibold text-gray-900">
                      {faq.question}
                    </span>
                    <ChevronDown className="h-4 w-4 shrink-0 text-[#EC1279] transition-transform duration-300 group-open:rotate-180" />
                  </summary>
                  <p className="px-6 pb-5 text-sm text-slate-600 leading-relaxed">
                    {faq.answer}
                  </p>
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
                  <p className="text-sm text-slate-600 leading-relaxed">
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
