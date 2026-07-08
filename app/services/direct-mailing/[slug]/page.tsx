import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Check,
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
import SmoothScroll from "../../../Components/SmoothScroll";

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

// One short punch-line for the caption card that overlaps the hero image,
// mirroring "Turns one-time buyers into repeat customers" on the reference.
function buildHeroCaption(format: MailFormat): string {
  return format.bestFor[0] ?? `Built for ${format.title.toLowerCase()}`;
}

function buildWhyItMattersCopy(format: MailFormat): string {
  const stock = format.paperStock[0]?.toLowerCase() ?? "premium stock";
  const mailClass = format.mailClass[0];
  return `${format.title} built on ${stock} hold up in the mailbox and in the hand, which matters more than most people expect — a flimsy piece reads as a flimsy brand. We produce every run on ${mailClass} timelines your campaign can actually plan around, with a ${format.turnaround.toLowerCase()} turnaround so a seasonal push doesn't stall in production. Because everything is printed and finished in-house, changes to quantity, stock, or finishing don't mean starting the quote over.`;
}

// Pair up bestFor + finishing/service items into "What's Included" card copy,
// each with a short title + one-line supporting detail (2 lines like reference).
function buildIncludedCards(
  format: MailFormat,
): { title: string; detail: string }[] {
  const cards: { title: string; detail: string }[] = [];

  format.bestFor.forEach((item) => {
    cards.push({
      title: item,
      detail: `Optimized paper, finishing, and format choices for ${item.toLowerCase()}.`,
    });
  });

  cards.push({
    title: format.printSides,
    detail: `Printed on ${format.paperStock[0]?.toLowerCase() ?? "premium stock"}.`,
  });

  format.finishingOptions.forEach((option) => {
    cards.push({
      title: `${option}`,
      detail: `Available finishing option for this format.`,
    });
  });

  if (format.designServiceAvailable) {
    cards.push({
      title: "In-house design service",
      detail: "Our team can design the piece for you, start to finish.",
    });
  }
  if (format.mailingListServiceAvailable) {
    cards.push({
      title: "Mailing list sourcing",
      detail: "We can source and target the mailing list for you.",
    });
  }

  return cards;
}

/* ---------------------------------------------------------------------- */
/*  Page                                                                    */
/* ---------------------------------------------------------------------- */

export default async function DirectMailFormatPage({ params }: PageProps) {
  const { slug } = await params;
  const format = getFormatBySlug(slug);
  if (!format) notFound();

  const related = getRelatedFormats(format);
  const includedCards = buildIncludedCards(format);

  return (
    <SmoothScroll>
      <main className="bg-white mt-24">
      {/* Breadcrumb */}
      <div className="mx-auto max-w-6xl px-6 pt-8">
        <nav className="flex items-center gap-1.5 text-sm">
          <Link href="/" className="font-medium text-[#EC1279]">
            Home
          </Link>
          <span className="text-slate-400">&gt;</span>
          <Link
            href="/services/direct-mailing"
            className="font-medium text-[#EC1279]"
          >
            Direct Mailing
          </Link>
          <span className="text-slate-400">&gt;</span>
          <span className="font-semibold text-slate-900">{format.title}</span>
        </nav>
      </div>

      {/* ------------------------------------------------------------ */}
      {/* HERO — image left (with overlapping caption card), content    */}
      {/* right (eyebrow, title, description, tags, what's included)    */}
      {/* ------------------------------------------------------------ */}
      <section className="mx-auto max-w-6xl px-6 pb-20 pt-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-start">
          {/* Left: image + overlapping caption + tags */}
          <div>
            <div className="relative overflow-hidden rounded-3xl">
              <div className="relative aspect-square w-full">
                <Image
                  src={format.img}
                  alt={format.title}
                  fill
                  sizes="(min-width: 1024px) 45vw, 90vw"
                  className="object-cover"
                  priority
                />
              </div>
            </div>

            {/* Floating caption card, overlapping the bottom edge of the image */}
            <div className="relative z-10 -mt-8 ml-6 mr-6 flex items-center gap-3 rounded-2xl border border-slate-100 bg-white px-5 py-4 shadow-lg shadow-slate-900/10 sm:mr-16">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#FDE8F2]">
                <Mail className="h-4 w-4 text-[#EC1279]" />
              </span>
              <span className="text-sm font-semibold text-[#0F1B33]">
                {buildHeroCaption(format)}
              </span>
            </div>

            {/* Tag pills */}
            <div className="mt-6 flex flex-wrap gap-2">
              {format.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-[#FDE8F2] px-3 py-1.5 text-xs font-semibold text-[#EC1279]"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Right: eyebrow, title, description, CTA-adjacent What's Included */}
          <div>
            <span className="inline-block rounded-full bg-[#FDE8F2] px-3 py-1 text-xs font-bold uppercase tracking-[0.1em] text-[#EC1279]">
              Production Format
            </span>
            <h1 className="mt-4 bg-gradient-to-r from-[#EC1279] to-[#7C3AED] bg-clip-text text-4xl font-extrabold leading-tight tracking-tight text-transparent sm:text-5xl">
              {format.title}
            </h1>
            <p className="mt-5 text-[15px] leading-relaxed text-slate-600">
              {format.description}
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/contact"
                className="rounded-full bg-[#EC1279] px-6 py-3 text-sm font-semibold text-white shadow-sm shadow-[#EC1279]/30 transition hover:bg-[#D40E6B]"
              >
                Get a Quote
              </Link>
              <Link
                href="/services/direct-mailing"
                className="rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400"
              >
                Compare All Formats
              </Link>
            </div>

            <h2 className="mt-10 text-base font-bold text-[#0F1B33]">
              What&apos;s included
            </h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {includedCards.map((card, i) => (
                <div
                  key={`${card.title}-${i}`}
                  className="flex items-start gap-2.5 rounded-2xl border border-slate-100 bg-slate-50 p-4"
                >
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#EC1279]">
                    <Check className="h-3 w-3 text-white" strokeWidth={3} />
                  </span>
                  <span className="text-sm leading-snug text-slate-700">
                    <span className="font-semibold text-[#0F1B33]">
                      {card.title}
                    </span>{" "}
                    <span className="text-slate-500">{card.detail}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Quick facts strip */}
      <section className="mx-auto max-w-6xl px-6 pb-16">
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

      {/* ------------------------------------------------------------ */}
      {/* Why This Format Matters                                       */}
      {/* ------------------------------------------------------------ */}
      <section className="mx-auto max-w-6xl px-6 pb-16">
        <div className="relative rounded-3xl border border-pink-100 bg-gradient-to-br from-pink-50 via-white to-purple-50 px-6 py-10 sm:px-10 sm:py-12 overflow-hidden shadow-sm">
          <div className="absolute -bottom-16 -right-16 w-56 h-56 bg-purple-100 rounded-full blur-3xl opacity-40 z-0" />
          <div className="relative max-w-3xl mx-auto">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
              Why {format.title} Matter for Your Business
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed text-slate-600">
              {buildWhyItMattersCopy(format)}
            </p>

            <div className="mt-8 grid gap-6 sm:grid-cols-2">
              <div>
                <div className="flex items-center gap-2">
                  <Layers className="h-4 w-4 text-[#EC1279]" />
                  <h3 className="text-sm font-bold text-[#0F1B33]">
                    Paper Stock
                  </h3>
                </div>
                <ul className="mt-3 space-y-1.5 text-sm text-slate-600">
                  {format.paperStock.map((stock) => (
                    <li key={stock}>{stock}</li>
                  ))}
                </ul>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-[#EC1279]" />
                  <h3 className="text-sm font-bold text-[#0F1B33]">
                    Mail Class
                  </h3>
                </div>
                <ul className="mt-3 space-y-1.5 text-sm text-slate-600">
                  {format.mailClass.map((mc) => (
                    <li key={mc}>{mc}</li>
                  ))}
                </ul>
              </div>
            </div>

            {format.specs.length > 0 && (
              <div className="mt-8 border-t border-pink-100/60 pt-6">
                <h3 className="text-sm font-bold text-[#0F1B33] mb-4">
                  Available Sizes
                </h3>
                <div className="flex flex-wrap gap-3">
                  {format.specs.map((spec, i) => (
                    <div
                      key={`${spec.label}-${i}`}
                      className="rounded-xl bg-white px-5 py-2.5 text-[15px] font-semibold text-slate-700 shadow-sm border border-slate-200 transition-colors hover:border-pink-300"
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

      {/* ------------------------------------------------------------ */}
      {/* FAQ                                                            */}
      {/* ------------------------------------------------------------ */}
      {format.faqs?.length > 0 && (
        <section className="mx-auto max-w-3xl px-6 pb-16">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 text-center sm:text-left">
            Frequently Asked Questions
          </h2>
          <div className="space-y-3">
            {format.faqs.map((faq, index) => (
              <details
                key={faq.question}
                className="group border border-gray-100 rounded-xl bg-white overflow-hidden shadow-sm"
                {...(index === 0 ? { open: true } : {})}
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-left [&::-webkit-details-marker]:hidden">
                  <span className="text-sm sm:text-base font-semibold text-gray-900">
                    {faq.question}
                  </span>
                  <ChevronDown className="h-4 w-4 shrink-0 text-[#EC1279] transition-transform duration-300 group-open:rotate-180" />
                </summary>
                <p className="px-5 pb-4 text-sm text-gray-600 leading-relaxed">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </section>
      )}

      {/* ------------------------------------------------------------ */}
      {/* CTA banner                                                     */}
      {/* ------------------------------------------------------------ */}
      <section className="mx-auto max-w-7xl px-6 pb-16">
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

      {/* ------------------------------------------------------------ */}
      {/* Explore More Formats                                          */}
      {/* ------------------------------------------------------------ */}
      {related.length > 0 && (
        <section className="mx-auto max-w-6xl px-6 py-16">
          <h2 className="text-lg font-bold text-[#0F1B33]">
            Explore More Formats
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {related.map((item) => (
              <Link
                key={item.slug}
                href={`/services/direct-mailing/${item.slug}`}
                className="group flex items-center justify-between rounded-2xl border border-slate-200 px-5 py-4 text-sm font-medium text-slate-700 transition hover:border-[#F5C4DF] hover:bg-[#FDE8F2] hover:text-[#EC1279]"
              >
                {item.title}
                <ChevronRight className="h-4 w-4 shrink-0 transition group-hover:translate-x-0.5" />
              </Link>
            ))}
          </div>
        </section>
      )}
      </main>
    </SmoothScroll>
  );
}
