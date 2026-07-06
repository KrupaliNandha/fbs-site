"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import {
  ChevronDown,
  Flag,
  MoveVertical,
  CircleDot,
  Layers,
  FileImage,
  Home,
  Droplet,
  Wrench,
  Briefcase,
  Zap,
  Palette,
  Check,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import productDetailData from "../../../data/product-detail.json";
import Navbar from "@/app/Components/Navbar";
import Footer from "@/app/Components/Footer";

/* ================================================================== */
/*  Generic data model                                                   */
/*                                                                        */
/*  These 17 product categories do NOT all share the same JSON shape —   */
/*  Advertising Flags has size/graphic/base/carryBag + a detailed        */
/*  spec.sizeSpecification table + baseHardwareSpecifications, while     */
/*  e.g. Vehicle Wraps has vehicleType/finish and a completely different  */
/*  spec object, and Banner Stands has yet another spec shape entirely.  */
/*  Rather than hardcoding fields that only exist for one category, this */
/*  page reads each variant's option groups and each product's spec      */
/*  object generically, so it renders correctly no matter which of the   */
/*  17 categories is loaded — including ones added later.                */
/* ================================================================== */

type PackageId = string;
type TabId = "description" | "spec" | "file-setup";

interface OptionItem {
  value: string;
  label: string;
}

interface OptionGroup {
  key: string; // raw JSON key, e.g. "graphic", "carryBag", "vehicleType"
  label: string; // human label, e.g. "Graphic", "Carry Bag", "Vehicle Type"
  options: OptionItem[];
}

interface GalleryItem {
  id: string;
  label: string;
  url?: string;
}

interface ProductData {
  slug: string;
  name: string;
  shortDescription: string;
  gallery: GalleryItem[];
  bullets: string[];
  packages: { id: PackageId; label: string }[];
  optionGroupsByPackage: Record<string, OptionGroup[]>;
  description: {
    paragraphs: string[];
    applications?: { title: string; content: string };
    extraNotes?: string[]; // e.g. Advertising Flags' Description.graphics
  };
  rawSpec: Record<string, any>;
  baseHardwareSpecifications?: any[];
  fileSetup: {
    requirements: string[];
    tips: string[];
  };
}

/* -------------------------------------------------------------- */
/*  Helpers: turn a raw JSON key into a human label                */
/* -------------------------------------------------------------- */

function labelizeKey(key: string): string {
  if (key.includes(" ")) {
    // Already spaced (e.g. "LED Light") — just make sure each word starts
    // with a capital, without touching existing acronyms like "LED".
    return key.replace(/\b\w/g, (c) => c.toUpperCase());
  }
  const spaced = key.replace(/([a-z0-9])([A-Z])/g, "$1 $2");
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}

function pickGroupIcon(key: string) {
  const k = key.toLowerCase();
  if (k === "size") return MoveVertical;
  if (
    k.includes("graphic") ||
    k.includes("finish") ||
    k.includes("lamin") ||
    k.includes("panel")
  )
    return FileImage;
  if (k.includes("base") || k.includes("stake") || k.includes("mount"))
    return CircleDot;
  if (k.includes("bag") || k.includes("case")) return Briefcase;
  if (
    k.includes("led") ||
    k.includes("light") ||
    k.includes("illumin") ||
    k.includes("power") ||
    k.includes("display")
  )
    return Zap;
  if (k.includes("color") || k.includes("backing")) return Palette;
  if (k.includes("side")) return Layers;
  return Check;
}

/* -------------------------------------------------------------- */
/*  Map one raw product object (any of the 17 categories) into the  */
/*  generic ProductData shape                                       */
/* -------------------------------------------------------------- */

function mapRawToProductData(raw: any): ProductData {
  const variants: any[] = Array.isArray(raw.variants) ? raw.variants : [];

  const packages = variants.map((v, idx) => ({
    id: String(v?.productType?.id ?? idx),
    label: v?.productType?.name ?? `Option ${idx + 1}`,
  }));

  const optionGroupsByPackage: Record<string, OptionGroup[]> = {};
  variants.forEach((v, idx) => {
    const packageId = String(v?.productType?.id ?? idx);
    const groups: OptionGroup[] = [];
    Object.keys(v || {}).forEach((key) => {
      if (key === "productType") return;
      const arr = v[key];
      if (!Array.isArray(arr)) return;
      groups.push({
        key,
        label: labelizeKey(key),
        options: arr.map((item: any) => ({
          value: String(item?.id ?? item?.name ?? ""),
          label: item?.name ?? String(item?.id ?? ""),
        })),
      });
    });
    optionGroupsByPackage[packageId] = groups;
  });

  const descContent: string[] = Array.isArray(raw?.Description?.content)
    ? raw.Description.content
    : [];

  return {
    slug: raw?.slug ?? "",
    name: raw?.name ?? "Product",
    shortDescription: descContent[0] ?? "",
    gallery: [
      ...(raw?.images?.mainImage
        ? [
            {
              id: "main",
              label: "Main Image",
              url: raw.images.mainImage.startsWith("/")
                ? raw.images.mainImage
                : `/${raw.images.mainImage}`,
            },
          ]
        : []),
      ...(Array.isArray(raw?.images?.subImages)
        ? raw.images.subImages.map((img: string, i: number) => ({
            id: `sub-${i}`,
            label: `Image ${i + 1}`,
            url: img.startsWith("/") ? img : `/${img}`,
          }))
        : []),
    ],
    bullets: Array.isArray(raw?.features) ? raw.features : [],
    packages,
    optionGroupsByPackage,
    description: {
      paragraphs: descContent,
      applications: raw?.Description?.applications,
      extraNotes: Array.isArray(raw?.Description?.graphics)
        ? raw.Description.graphics
        : undefined,
    },
    rawSpec: raw?.spec ?? {},
    baseHardwareSpecifications: Array.isArray(raw?.baseHardwareSpecifications)
      ? raw.baseHardwareSpecifications
      : undefined,
    fileSetup: {
      requirements: Array.isArray(raw?.fileSetup?.requirements)
        ? raw.fileSetup.requirements
        : [],
      tips: Array.isArray(raw?.fileSetup?.additionalTips)
        ? raw.fileSetup.additionalTips
        : [],
    },
  };
}

/* ================================================================== */
/*  Breadcrumbs                                                          */
/* ================================================================== */

function Breadcrumbs({ productName }: { productName: string }) {
  return (
    <nav
      className="flex text-sm text-gray-500 mb-6 sm:mb-8"
      aria-label="Breadcrumb"
    >
      <ol className="inline-flex items-center space-x-1 md:space-x-2">
        <li className="inline-flex items-center">
          <a
            href="/"
            className="inline-flex items-center hover:text-[#c6005c] transition-colors"
          >
            Home
          </a>
        </li>
        <li>
          <div className="flex items-center">
            <span className="mx-1 text-gray-400">/</span>
            <a
              href="/services"
              className="hover:text-[#c6005c] transition-colors ml-1"
            >
              Services
            </a>
          </div>
        </li>
        <li>
          <div className="flex items-center">
            <span className="mx-1 text-gray-400">/</span>
            <a
              href="/services/signage"
              className="hover:text-[#c6005c] transition-colors ml-1"
            >
              Signage
            </a>
          </div>
        </li>
        <li aria-current="page">
          <div className="flex items-center">
            <span className="mx-1 text-gray-400">/</span>
            <span className="text-gray-900 font-medium ml-1">
              {productName}
            </span>
          </div>
        </li>
      </ol>
    </nav>
  );
}

/* ================================================================== */
/*  Component                                                            */
/* ================================================================== */

export default function ProductDetailPage() {
  const params = useParams<{ slug: string }>();
  const [product, setProduct] = useState<ProductData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [activeImageId, setActiveImageId] = useState<string | null>(null);
  const [packageId, setPackageId] = useState<PackageId | null>(null);
  // Generic selections: one value per option-group key (e.g.
  // { size: "3", graphic: "1", vehicleType: "2" }) instead of separate
  // hardcoded useState hooks per field.
  const [selections, setSelections] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState<TabId>("description");

  useEffect(() => {
    let cancelled = false;

    async function loadProduct() {
      setLoading(true);
      setError(null);
      try {
        const rawArray = Array.isArray(productDetailData)
          ? productDetailData
          : [productDetailData];
        const decodedSlug = decodeURIComponent(params?.slug || "");

        const raw =
          rawArray.find((item: any) => item.slug === decodedSlug) ||
          rawArray.find(
            (item: any) =>
              item.slug?.toLowerCase() === decodedSlug.toLowerCase(),
          ) ||
          rawArray[0];

        const data = mapRawToProductData(raw);
        if (cancelled) return;

        setProduct(data);
        setActiveImageId(data.gallery[0]?.id ?? null);

        const initialPackageId = data.packages[0]?.id ?? null;
        setPackageId(initialPackageId);

        const initialGroups = initialPackageId
          ? (data.optionGroupsByPackage[initialPackageId] ?? [])
          : [];
        const initialSelections: Record<string, string> = {};
        initialGroups.forEach((g) => {
          if (g.options[0]) initialSelections[g.key] = g.options[0].value;
        });
        setSelections(initialSelections);
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Failed to load product data",
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadProduct();
    return () => {
      cancelled = true;
    };
  }, [params?.slug]);

  // Whenever the active package changes, re-seed `selections` so every
  // group key matches what THIS package actually offers — any leftover
  // key/value from a previous package that no longer applies is dropped,
  // and any option value that no longer exists in the new package's list
  // is reset to that group's first option.
  useEffect(() => {
    if (!product || !packageId) return;
    const groups = product.optionGroupsByPackage[packageId] ?? [];

    setSelections((prev) => {
      const next: Record<string, string> = {};
      groups.forEach((g) => {
        const stillValid = g.options.some((o) => o.value === prev[g.key]);
        next[g.key] = stillValid ? prev[g.key] : (g.options[0]?.value ?? "");
      });
      return next;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [packageId, product]);

  if (loading) return <StateScreen kind="loading" />;
  if (error || !product)
    return <StateScreen kind="error" message={error ?? "Product not found"} />;

  const currentGroups: OptionGroup[] =
    (packageId && product.optionGroupsByPackage[packageId]) || [];

  const sizeGroup = currentGroups.find((g) => g.key.toLowerCase() === "size");
  const otherGroups = currentGroups.filter(
    (g) => g.key.toLowerCase() !== "size",
  );

  const activeImage =
    product.gallery.find((g) => g.id === activeImageId) ?? product.gallery[0];

  const tabs: { id: TabId; label: string }[] = [
    { id: "description", label: "Description" },
    { id: "spec", label: "Spec" },
    { id: "file-setup", label: "File Setup" },
  ];

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8 mt-30">
        <Breadcrumbs productName={product.name} />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          {/* -------------------------------------------------- */}
          {/* LEFT — Gallery                                       */}
          {/* -------------------------------------------------- */}
          <div className="lg:col-span-7">
            <div className="relative aspect-[4/5] sm:aspect-[16/11] lg:aspect-[16/12] w-full bg-gray-50 border border-gray-200 rounded-sm flex items-center justify-center overflow-hidden">
              {activeImage?.url ? (
                <img
                  src={activeImage.url}
                  alt={activeImage.label}
                  className="object-contain w-full h-full"
                />
              ) : (
                <Flag
                  className="h-16 w-16 sm:h-24 sm:w-24 text-[#c6005c]"
                  strokeWidth={1.5}
                />
              )}
            </div>

            {product.gallery.length > 1 && (
              <div className="mt-3 grid grid-cols-5 sm:grid-cols-9 gap-2">
                {product.gallery.map((item) => {
                  const active = item.id === activeImageId;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveImageId(item.id)}
                      aria-label={item.label}
                      aria-pressed={active}
                      className={`aspect-square rounded-sm border bg-gray-50 flex items-center justify-center overflow-hidden transition-colors ${
                        active
                          ? "border-[#c6005c] ring-1 ring-[#c6005c]"
                          : "border-gray-200 hover:border-gray-400"
                      }`}
                    >
                      {item.url ? (
                        <img
                          src={item.url}
                          alt={item.label}
                          className="object-contain w-full h-full"
                        />
                      ) : (
                        <Flag
                          className="h-5 w-5 text-[#c6005c]"
                          strokeWidth={1.5}
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            )}

            <FeatureGrid bullets={product.bullets} />
          </div>

          {/* -------------------------------------------------- */}
          {/* RIGHT — Buy box                                      */}
          {/* -------------------------------------------------- */}
          <div className="lg:col-span-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-[#c6005c]">
              Product Details
            </p>
            <h1 className="mt-1.5 text-2xl sm:text-[28px] font-bold text-gray-900">
              {product.name}
            </h1>
            <p className="mt-3 text-sm sm:text-[14px] leading-relaxed text-gray-600">
              {product.shortDescription}
            </p>

            <div className="mt-6 border-2 rounded-2xl p-3 shadow-xl border-gray-100 pt-6 space-y-6">
              {/* What's included — only shown if there's more than one package */}
              {product.packages.length > 1 && (
                <div>
                  <p className="text-sm font-semibold text-gray-900 mb-2.5">
                    What&apos;s included
                  </p>
                  <div className="flex flex-wrap gap-2.5">
                    {product.packages.map((p) => {
                      const active = p.id === packageId;
                      return (
                        <button
                          key={p.id}
                          onClick={() => setPackageId(p.id)}
                          aria-pressed={active}
                          className={`rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                            active
                              ? "border-[#c6005c] bg-[#c6005c]/5 text-[#c6005c]"
                              : "border-gray-300 text-gray-700 hover:border-gray-400"
                          }`}
                        >
                          {p.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Size — rendered as a prominent button grid if this
                  package defines a "size" group; otherwise skipped
                  entirely (e.g. Vehicle Wraps uses "vehicleType" instead,
                  which just shows up below as a normal dropdown) */}
              {sizeGroup && (
                <div>
                  <p className="text-sm font-semibold text-gray-900 mb-2.5">
                    {sizeGroup.label}
                  </p>
                  <div
                    className={`grid gap-2.5 ${
                      sizeGroup.options.length > 3
                        ? "grid-cols-4"
                        : "grid-cols-2"
                    }`}
                  >
                    {sizeGroup.options.map((opt) => {
                      const active = selections[sizeGroup.key] === opt.value;
                      return (
                        <button
                          key={opt.value}
                          onClick={() =>
                            setSelections((prev) => ({
                              ...prev,
                              [sizeGroup.key]: opt.value,
                            }))
                          }
                          aria-pressed={active}
                          className={`rounded-lg border px-2 py-2.5 text-center transition-colors ${
                            active
                              ? "border-[#c6005c] bg-[#c6005c]/5"
                              : "border-gray-300 hover:border-gray-400"
                          }`}
                        >
                          <span
                            className={`block text-sm font-semibold ${active ? "text-[#c6005c]" : "text-gray-900"}`}
                          >
                            {opt.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Every other option group this package defines, each as
                  its own dropdown — Graphic, Base, Carry Bag, Finish,
                  Coverage, LED Light, Illumination, whatever applies */}
              {otherGroups.map((group) => {
                const Icon = pickGroupIcon(group.key);
                return (
                  <FieldSelect
                    key={group.key}
                    icon={<Icon className="h-3.5 w-3.5" />}
                    label={group.label}
                    value={selections[group.key] ?? ""}
                    onChange={(value) =>
                      setSelections((prev) => ({ ...prev, [group.key]: value }))
                    }
                    options={group.options}
                  />
                );
              })}
            </div>
          </div>
        </div>

        {/* -------------------------------------------------- */}
        {/* Tabs                                                 */}
        {/* -------------------------------------------------- */}
        <div className="mt-10 sm:mt-12">
          <div className="border-b border-gray-200">
            <nav
              className="flex gap-6 sm:gap-8 min-w-max px-0.5"
              aria-label="Product information tabs"
            >
              {tabs.map((tab) => {
                const active = tab.id === activeTab;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    aria-selected={active}
                    className={`relative py-3 text-sm sm:text-[15px] font-medium whitespace-nowrap transition-colors ${
                      active
                        ? "text-[#c6005c]"
                        : "text-gray-500 hover:text-gray-800"
                    }`}
                  >
                    {tab.label}
                    {active && (
                      <span className="absolute left-0 right-0 -bottom-px h-0.5 bg-[#c6005c]" />
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="py-6 sm:py-8">
            {activeTab === "description" && (
              <DescriptionTab data={product.description} />
            )}
            {activeTab === "spec" && (
              <SpecTab
                spec={product.rawSpec}
                baseHardware={product.baseHardwareSpecifications}
              />
            )}
            {activeTab === "file-setup" && (
              <FileSetupTab data={product.fileSetup} />
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

/* ================================================================== */
/*  Loading / error state screen                                        */
/* ================================================================== */

function StateScreen({
  kind,
  message,
}: {
  kind: "loading" | "error";
  message?: string;
}) {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3 text-center px-6">
      {kind === "loading" ? (
        <>
          <Loader2 className="h-6 w-6 text-[#c6005c] animate-spin" />
          <p className="text-sm text-gray-500">Loading product details…</p>
        </>
      ) : (
        <>
          <AlertTriangle className="h-6 w-6 text-[#c6005c]" />
          <p className="text-sm font-medium text-gray-900">
            Couldn&apos;t load product details
          </p>
          <p className="text-sm text-gray-500">{message}</p>
        </>
      )}
    </div>
  );
}

/* ================================================================== */
/*  Buy box helpers                                                      */
/* ================================================================== */

function FieldSelect({
  icon,
  label,
  value,
  onChange,
  options,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: OptionItem[];
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (options.length === 0) return null;

  const selectedOption = options.find((o) => o.value === value) || options[0];

  return (
    <div>
      <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-900">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#c6005c]/10 text-[#c6005c]">
          {icon}
        </span>
        {label}
      </label>

      <div className="relative" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`
            w-full flex items-center justify-between
            rounded-lg border bg-white px-4 py-3
            text-sm font-medium text-gray-900 transition-colors
            focus:outline-none
            ${isOpen ? "border-[#c6005c]" : "border-gray-300 hover:border-gray-400"}
          `}
        >
          <span>{selectedOption?.label}</span>
          <ChevronDown
            className={`h-5 w-5 text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
          />
        </button>

        {isOpen && (
          <div className="absolute left-0 right-0 z-10 mt-1 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-xl">
            <ul className="max-h-60 overflow-auto p-1.5 text-sm text-gray-900 flex flex-col gap-0.5">
              {options.map((option) => (
                <li
                  key={option.value}
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                  className={`
                    cursor-pointer rounded-md px-3 py-2 transition-colors text-left
                    ${option.value === value ? "bg-[#c6005c]/10 text-[#c6005c] font-semibold" : "text-gray-900 hover:bg-gray-100"}
                  `}
                >
                  {option.label}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

function pickFeatureIcon(text: string) {
  const t = text.toLowerCase();
  if (t.includes("indoor") || t.includes("outdoor")) return Home;
  if (t.includes("sided")) return Layers;
  if (
    t.includes("polyester") ||
    t.includes("mesh") ||
    t.includes("sublimat") ||
    t.includes("fabric")
  )
    return Droplet;
  if (t.includes("pole") || t.includes("frame") || t.includes("aluminum"))
    return Wrench;
  if (t.includes("base") || t.includes("stake")) return CircleDot;
  if (t.includes("carry") || t.includes("bag") || t.includes("case"))
    return Briefcase;
  if (t.includes("led") || t.includes("light") || t.includes("illumin"))
    return Zap;
  return Check;
}

function FeatureGrid({ bullets }: { bullets: string[] }) {
  if (bullets.length === 0) return null;
  return (
    <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
      {bullets.map((b) => {
        const Icon = pickFeatureIcon(b);
        return (
          <div
            key={b}
            className="flex items-start gap-3 rounded-lg border border-gray-100 bg-gray-50 p-3"
          >
            <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#c6005c]/10 text-[#c6005c]">
              <Icon className="h-4 w-4" />
            </span>
            <span className="pt-1 text-sm leading-snug text-gray-700">{b}</span>
          </div>
        );
      })}
    </div>
  );
}

/* ================================================================== */
/*  Description tab — generic: paragraphs + optional applications +     */
/*  optional extra notes (e.g. Advertising Flags' per-graphic details)  */
/* ================================================================== */

function DescriptionTab({
  data,
}: {
  data: {
    paragraphs: string[];
    applications?: { title: string; content: string };
    extraNotes?: string[];
  };
}) {
  return (
    <div className="w-full">
      <h2 className="text-lg font-semibold text-gray-900">Description</h2>

      {data.paragraphs.map((p, i) => (
        <p
          key={i}
          className="mt-3 text-sm sm:text-[15px] leading-relaxed text-gray-700"
        >
          {p}
        </p>
      ))}

      {data.extraNotes && data.extraNotes.length > 0 && (
        <ul className="mt-4 space-y-2.5">
          {data.extraNotes.map((note, i) => (
            <li
              key={i}
              className="text-sm sm:text-[14px] leading-relaxed text-gray-700 flex items-start gap-2"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#c6005c] mt-2 shrink-0"></span>
              <span>{note}</span>
            </li>
          ))}
        </ul>
      )}

      {data.applications && (
        <>
          <h3 className="mt-6 text-sm font-semibold text-gray-900">
            {data.applications.title}
          </h3>
          <p className="mt-1.5 text-sm sm:text-[15px] leading-relaxed text-gray-700">
            {data.applications.content}
          </p>
        </>
      )}
    </div>
  );
}

/* ================================================================== */
/*  Spec tab — fully generic renderer over whatever raw.spec contains   */
/* ================================================================== */

function isPlainObject(v: any) {
  return v !== null && typeof v === "object" && !Array.isArray(v);
}

/* ---------------------------------------------------------------- */
/*  Special-case renderer for spec.sizeSpecification                  */
/*  (used by Advertising Flags — a curved flag-height diagram + a      */
/*  proper comparison table, instead of the generic card grid every   */
/*  other spec section gets)                                          */
/* ---------------------------------------------------------------- */

function abbreviateSizeLabel(label: string): string {
  const known: Record<string, string> = {
    "X-Large": "XL",
    Large: "L",
    Medium: "M",
    Small: "S",
  };
  return known[label] ?? label.charAt(0).toUpperCase();
}

function SizeSpecificationBlock({
  table,
  image,
}: {
  table: any[];
  image?: string;
}) {
  const [imgFailed, setImgFailed] = useState(false);
  const columns = Object.keys(table[0]).filter((k) => k !== "size");
  const rows = table.map((row) => ({
    ...row,
    _abbrev: abbreviateSizeLabel(row.size),
    _heightFt: parseFloat(String(row.assembledHeight)) || 0,
  }));
  const ascendingRows = [...rows].sort((a, b) => a._heightFt - b._heightFt);

  const showRealImage = !!image && !imgFailed;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
      <div className="lg:col-span-5">
        {showRealImage ? (
          <img
            src={image}
            alt="Size Specification Diagram"
            onError={() => setImgFailed(true)}
            className="w-full max-h-[260px] h-auto rounded-sm border border-gray-200 bg-gray-50 object-contain p-2"
          />
        ) : (
          <div className="w-full h-auto min-h-[300px] bg-gray-50 flex items-center justify-center text-sm text-gray-400 border border-gray-200 rounded-2xl">
            No diagram available
          </div>
        )}
      </div>

      <div className="lg:col-span-7 overflow-x-auto">
        <table className="w-full text-sm border-collapse min-w-[560px] border border-gray-200">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-center font-semibold text-gray-800 py-2.5 px-3 border-r border-gray-200">
                Size
              </th>
              {columns.map((col) => (
                <th
                  key={col}
                  className="text-center font-semibold text-gray-800 py-2.5 px-3 border-r border-gray-200 last:border-r-0 whitespace-nowrap"
                >
                  {labelizeKey(col)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ascendingRows.map((row) => (
              <tr
                key={row.size}
                className="border-b border-gray-100 last:border-b-0"
              >
                <td className="py-3 px-3 text-center font-semibold text-gray-900 border-r border-gray-200 whitespace-nowrap">
                  {row._abbrev}
                </td>
                {columns.map((col) => (
                  <td
                    key={col}
                    className={`py-3 px-3 text-center border-r border-gray-200 last:border-r-0 whitespace-nowrap ${
                      col === "assembledHeight"
                        ? "text-[#c6005c] font-medium"
                        : "text-gray-700"
                    }`}
                  >
                    {row[col]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Renders any value found inside raw.spec: strings, arrays of strings,
// arrays of objects (rendered as small cards), or nested objects
// (rendered as a labeled sub-block, recursively).
function SpecValue({ nodeKey, value }: { nodeKey: string; value: any }) {
  if (value == null || value === "") return null;

  // A string whose key mentions "image" is rendered as an image instead
  // of raw text (e.g. spec.sizeSpecification.image).
  if (typeof value === "string") {
    if (nodeKey.toLowerCase().includes("image")) {
      return (
        <img
          src={value}
          alt={labelizeKey(nodeKey)}
          className="w-full max-w-md h-auto rounded-lg border border-gray-200 bg-gray-50"
        />
      );
    }
    return <p className="text-sm text-gray-700">{value}</p>;
  }

  if (Array.isArray(value)) {
    if (value.length === 0) return null;

    // Array of plain strings -> bullet list
    if (value.every((v) => typeof v === "string")) {
      return (
        <ul className="space-y-1.5">
          {value.map((v, i) => (
            <li
              key={i}
              className="flex items-start gap-2 text-sm text-gray-700"
            >
              <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[#c6005c] flex-shrink-0" />
              {v}
            </li>
          ))}
        </ul>
      );
    }

    // Array of objects -> card grid (covers size tables, weight lists,
    // baseHardwareSpecifications entries, etc. uniformly)
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {value.map((item, i) => (
          <div
            key={i}
            className="border border-gray-200 rounded-lg p-3 bg-white"
          >
            {Object.entries(item).map(([k, v]) => (
              <SpecEntry
                key={k}
                label={labelizeKey(k)}
                nodeKey={k}
                value={v}
                compact
              />
            ))}
          </div>
        ))}
      </div>
    );
  }

  if (isPlainObject(value)) {
    return (
      <div className="space-y-2 border border-gray-200 rounded-lg p-3 bg-white">
        {Object.entries(value).map(([k, v]) => (
          <SpecEntry key={k} label={labelizeKey(k)} nodeKey={k} value={v} />
        ))}
      </div>
    );
  }

  return <p className="text-sm text-gray-700">{String(value)}</p>;
}

function SpecEntry({
  label,
  nodeKey,
  value,
  compact = false,
}: {
  label: string;
  nodeKey: string;
  value: any;
  compact?: boolean;
}) {
  if (value == null || value === "") return null;

  if (typeof value === "string" && !nodeKey.toLowerCase().includes("image")) {
    return (
      <p
        className={compact ? "text-xs text-gray-700" : "text-sm text-gray-700"}
      >
        <span className="font-medium text-gray-900">{label}:</span> {value}
      </p>
    );
  }

  return (
    <div className={compact ? "mt-1" : "mt-1.5"}>
      <p
        className={`font-medium text-gray-900 ${compact ? "text-xs" : "text-sm"}`}
      >
        {label}
      </p>
      <div className="mt-1">
        <SpecValue nodeKey={nodeKey} value={value} />
      </div>
    </div>
  );
}

function SpecTab({
  spec,
  baseHardware,
}: {
  spec: Record<string, any>;
  baseHardware?: any[];
}) {
  const entries = Object.entries(spec || {}).filter(([k]) => k !== "title");

  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-900">Spec</h2>

      {entries.length === 0 && (
        <p className="mt-3 text-sm text-gray-500">
          No specifications available for this product yet.
        </p>
      )}

      <div className="mt-5 space-y-8">
        {entries.map(([key, value]) => {
          const isSizeSpec =
            key === "sizeSpecification" &&
            isPlainObject(value) &&
            Array.isArray(value.table) &&
            value.table.length > 0 &&
            value.table[0]?.size &&
            value.table[0]?.assembledHeight;

          return (
            <div key={key}>
              {!isSizeSpec && (
                <h3 className="text-sm font-semibold text-gray-900">
                  {labelizeKey(key)}
                </h3>
              )}
              {isSizeSpec ? (
                <>
                  <p className="text-sm text-gray-500 -mt-1 mb-2.5">
                    Size &amp; Specifications
                  </p>
                  <SizeSpecificationBlock
                    table={value.table}
                    image={value.image}
                  />
                </>
              ) : (
                <div className="mt-2.5">
                  <SpecValue nodeKey={key} value={value} />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {baseHardware && baseHardware.length > 0 && (
        <div className="mt-10">
          <h3 className="text-sm font-semibold text-gray-900">
            Base Hardware Specifications
          </h3>
          <div className="mt-4 grid grid-cols-2 lg:grid-cols-4 gap-4">
            {baseHardware.map((b) => (
              <div
                key={b.id}
                className="border border-gray-200 rounded-sm overflow-hidden"
              >
                <div className="aspect-square bg-gray-50 flex items-center justify-center">
                  {b.image ? (
                    <img
                      src={b.image.startsWith("/") ? b.image : `/${b.image}`}
                      alt={b.name}
                      className="w-full h-full object-contain p-2"
                    />
                  ) : (
                    <BaseIcon id={b.id} />
                  )}
                </div>
                <div className="p-3">
                  <p className="text-sm font-semibold text-gray-900">
                    {b.name}
                  </p>
                  <div className="mt-1.5 space-y-1 text-xs text-gray-600">
                    {b.specifications &&
                      Object.entries(b.specifications).map(([k, v]) => (
                        <p key={k}>
                          {labelizeKey(k)}: {String(v)}
                        </p>
                      ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function BaseIcon({ id }: { id: string }) {
  const iconProps = { className: "h-8 w-8 text-gray-400" };
  switch (id) {
    case "ground_stake":
      return <MoveVertical {...iconProps} />;
    case "cross_base":
      return <Layers {...iconProps} />;
    case "water_bag":
      return <CircleDot {...iconProps} />;
    case "square_base":
      return <div className="h-8 w-8 rounded-sm bg-gray-300" />;
    default:
      return <CircleDot {...iconProps} />;
  }
}

/* ================================================================== */
/*  File Setup tab                                                       */
/* ================================================================== */

function FileSetupTab({
  data,
}: {
  data: { requirements: string[]; tips: string[] };
}) {
  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-900">File Setup</h2>

      {data.requirements.length > 0 && (
        <ul className="mt-4 space-y-2 max-w-3xl">
          {data.requirements.map((r) => (
            <li
              key={r}
              className="flex items-start gap-2 text-sm text-gray-700"
            >
              <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[#c6005c] flex-shrink-0" />
              {r}
            </li>
          ))}
        </ul>
      )}

      {data.tips.length > 0 && (
        <>
          <h3 className="mt-6 text-sm font-semibold text-gray-900">
            Additional Tips
          </h3>
          <ul className="mt-2 space-y-2 max-w-3xl">
            {data.tips.map((t) => (
              <li
                key={t}
                className="flex items-start gap-2 text-sm text-gray-700"
              >
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[#c6005c] flex-shrink-0" />
                {t}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
