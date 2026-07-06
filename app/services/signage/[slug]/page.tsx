"use client";

import { useEffect, useState, useRef } from "react";
import {
  ChevronDown,
  Flag,
  MoveVertical,
  CircleDot,
  Layers,
  Info,
  FileText,
  FileImage,
  Download,
  Home,
  Droplet,
  Wrench,
  Briefcase,
  Check,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import productDetailData from "../../../data/product-detail.json";
import Navbar from "@/app/Components/Navbar";
import Footer from "@/app/Components/Footer";

/* ================================================================== */
/*  Data model (shape of the fetched JSON)                              */
/* ================================================================== */

type SizeId = string;
type GraphicId = string;
type BaseId = string;
type PackageId = string;
type TabId = "description" | "spec" | "file-setup";

interface SizeSpec {
  id: SizeId;
  label: string;
  assembledHeight: string;
  graphicSize: string;
  flagWeight: string;
  flagWithPoleWeight: string;
  poleSetPieces: string;
  heightFt: number;
  price: number;
}

interface GraphicOption {
  id: GraphicId;
  label: string;
  description: string;
  upcharge: number;
}

interface BaseHardwareSpec {
  id: BaseId;
  label: string;
  material: string;
  weight: string;
  use: string[];
  feature?: string;
  upcharge: number;
}

interface SelectOption {
  value: string;
  label: string;
}

interface GalleryItem {
  id: string;
  label: string;
  url?: string;
  kind:
    | "flag-front"
    | "flag-reverse"
    | "flag-double"
    | "pole"
    | "bases-row"
    | "base-single"
    | "diagram"
    | "icons";
}

interface TemplateLink {
  label: string;
}

interface TemplateRow {
  size: string;
  pdf: TemplateLink[];
  photoshop: TemplateLink[];
}

interface VariantOptionSet {
  graphics: GraphicOption[];
  baseSelectOptions: SelectOption[];
  carryBagOptions: SelectOption[];
}

interface ProductData {
  eyebrow: string;
  name: string;
  shortDescription: string;
  gallery: GalleryItem[];
  bullets: string[];
  packages: { id: PackageId; label: string; priceAdjustment: number }[];
  variantsData: Record<string, VariantOptionSet>;
  sizes: SizeSpec[];
  specImage: string;
  graphics: GraphicOption[];
  bases: BaseHardwareSpec[];
  baseSelectOptions: SelectOption[];
  carryBag: {
    label: string;
    weightSmallMedium: string;
    weightLargeXLarge: string;
    options: SelectOption[];
  };
  hardwareAndAssembly: { poleSet: string };
  description: {
    intro: string;
    printInfo: string;
    graphicTypes: { label: string; detail: string }[];
    baseInfo: string;
    applicationsLabel: string;
    applications: string;
  };
  materialSpec: {
    printMethod: string;
    graphicMaterial: string;
    washable: string;
  };
  fileSetup: {
    requirements: string[];
    tips: string[];
    templates: TemplateRow[];
    instructions: string[];
  };
}

function mapRawToProductData(raw: any): ProductData {
  // Use the first defined variant (e.g. "Flag + Pole") as the source of
  // truth for graphic/base/carry-bag select options shown at top-level
  // (used by the Spec tab, which isn't package-specific).
  const primaryVariant = raw.variants[0];

  return {
    eyebrow: "Product Details",
    name: raw.name,
    shortDescription: raw.Description.content[0],
    gallery: [
      {
        id: "main",
        label: "Main Image",
        kind: "flag-front",
        url: raw.images.mainImage,
      },
      ...raw.images.subImages.map((img: string, i: number) => ({
        id: `sub-${i}`,
        label: `Image ${i + 1}`,
        kind: "flag-front" as const,
        url: img,
      })),
    ],
    bullets: raw.features,
    packages: raw.variants.map((v: any) => ({
      id: v.productType.id,
      label: v.productType.name,
      priceAdjustment: 0,
    })),
    // Each productType (flag_pole / flag_only) keeps its own independent
    // graphic / base / carryBag option lists here — nothing is shared
    // or merged across variants.
    variantsData: raw.variants.reduce(
      (acc: Record<string, VariantOptionSet>, v: any) => {
        acc[v.productType.id] = {
          graphics: (v.graphic || []).map((g: any, i: number) => ({
            id: g.id,
            label: g.name,
            description: raw.Description.graphics[i] || "",
            upcharge: 0,
          })),
          // flag_only has no "base" key in the JSON at all -> this
          // resolves to [] for that variant, which is what drives hiding
          // the Base field for Flag Only further down.
          baseSelectOptions: (v.base || []).map((b: any) => ({
            value: b.id,
            label: b.name,
          })),
          carryBagOptions: (v.carryBag || []).map((c: any) => ({
            value: c.id,
            label: c.name,
          })),
        };
        return acc;
      },
      {},
    ),
    sizes: raw.spec.sizeSpecification.table.map((row: any) => ({
      id: row.size.toLowerCase().replace(/[^a-z0-9]/g, "-"),
      label: row.size,
      assembledHeight: row.assembledHeight,
      graphicSize: row.graphicSize,
      flagWeight: row.flagWeight,
      flagWithPoleWeight: row.flagWithPoleWeight,
      poleSetPieces: row.poleSetPieces,
      heightFt: parseFloat(row.assembledHeight),
      price: 0,
    })),
    specImage: raw.spec.sizeSpecification.image || "",
    graphics: primaryVariant.graphic.map((g: any, i: number) => ({
      id: g.id,
      label: g.name,
      description: raw.Description.graphics[i] || "",
      upcharge: 0,
    })),
    bases: raw.baseHardwareSpecifications.map((b: any) => ({
      id: b.id,
      label: b.name,
      material: b.specifications.material || "N/A",
      weight: b.specifications.weight || "N/A",
      use: [b.specifications.use || ""],
      feature: b.specifications.feature,
      upcharge: 0,
    })),
    baseSelectOptions: primaryVariant.base.map((b: any) => ({
      value: b.id,
      label: b.name,
    })),
    carryBag: {
      label: raw.spec.additionalAccessories.carryBag,
      weightSmallMedium:
        raw.spec.additionalAccessories.weight.find((w: any) => w.size === "S/M")
          ?.weight || "",
      weightLargeXLarge:
        raw.spec.additionalAccessories.weight.find(
          (w: any) => w.size === "L/XL",
        )?.weight || "",
      options: (primaryVariant.carryBag || []).map((c: any) => ({
        value: c.id,
        label: c.name,
      })),
    },
    hardwareAndAssembly: {
      poleSet: raw.spec.hardwareAndAssembly.poleSet,
    },
    description: {
      intro: raw.Description.content[0],
      printInfo: raw.Description.content[2],
      graphicTypes: raw.Description.graphics.map((g: string, i: number) => ({
        label: primaryVariant.graphic[i]?.name || "",
        detail: g,
      })),
      baseInfo: raw.Description.content[3],
      applicationsLabel: raw.Description.applications.title,
      applications: raw.Description.applications.content,
    },
    materialSpec: {
      printMethod: raw.spec.materialAndPrintSpecifications.printMethod,
      graphicMaterial: raw.spec.materialAndPrintSpecifications.graphicMaterial,
      washable: raw.spec.materialAndPrintSpecifications.washable,
    },
    fileSetup: {
      requirements: raw.fileSetup.requirements,
      tips: raw.fileSetup.additionalTips,
      templates: (raw.installationGuide?.templateDownloads || []).map((t: any) => ({
        size: t.size,
        pdf: Object.keys(t.pdf).map((k) => ({
          label: k
            .replace(/([A-Z])/g, " $1")
            .replace(/^./, (str) => str.toUpperCase()),
        })),
        photoshop: Object.keys(t.photoshop).map((k) => ({
          label: k
            .replace(/([A-Z])/g, " $1")
            .replace(/^./, (str) => str.toUpperCase()),
        })),
      })),
      instructions: raw.installationGuide?.instructions || [],
    },
  };
}

const DEFAULT_DATA_URL = "/data/product-detail.json";

/* ================================================================== */
/*  Breadcrumbs component                                                */
/* ================================================================== */

function Breadcrumbs({ productName }: { productName: string }) {
  return (
    <nav className="flex text-sm text-gray-500 mb-6 sm:mb-8" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-2">
        <li className="inline-flex items-center">
          <a href="/" className="inline-flex items-center hover:text-[#c6005c] transition-colors">
            Home
          </a>
        </li>
        <li>
          <div className="flex items-center">
            <span className="mx-1 text-gray-400">/</span>
            <a href="/services" className="hover:text-[#c6005c] transition-colors ml-1">
              Services
            </a>
          </div>
        </li>
        <li>
          <div className="flex items-center">
            <span className="mx-1 text-gray-400">/</span>
            <a href="/services/signage" className="hover:text-[#c6005c] transition-colors ml-1">
              Signage
            </a>
          </div>
        </li>
        <li aria-current="page">
          <div className="flex items-center">
            <span className="mx-1 text-gray-400">/</span>
            <span className="text-gray-900 font-medium ml-1">{productName}</span>
          </div>
        </li>
      </ol>
    </nav>
  );
}

/* ================================================================== */
/*  Component                                                            */
/* ================================================================== */

export default function ProductDetailPage({
  dataUrl = DEFAULT_DATA_URL,
}: {
  dataUrl?: string;
}) {
  const [product, setProduct] = useState<ProductData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [activeImageId, setActiveImageId] = useState<string | null>(null);
  const [packageId, setPackageId] = useState<PackageId | null>(null);
  const [sizeId, setSizeId] = useState<SizeId | null>(null);
  const [graphicId, setGraphicId] = useState<GraphicId | null>(null);
  const [baseId, setBaseId] = useState<BaseId | null>(null);
  const [carryBagId, setCarryBagId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabId>("description");

  // Fetch all product content from JSON — no static data lives in this file.
  useEffect(() => {
    let cancelled = false;

    async function loadProduct() {
      setLoading(true);
      setError(null);
      try {
        const data: ProductData = mapRawToProductData(productDetailData);
        if (cancelled) return;

        setProduct(data);
        setActiveImageId(data.gallery[0]?.id ?? null);

        const initialPackageId = data.packages[0]?.id ?? null;
        setPackageId(initialPackageId);

        setSizeId(
          data.sizes.find((s) => s.id === "large")?.id ??
            data.sizes[0]?.id ??
            null,
        );

        // Seed graphic/base/carryBag from THAT initial package's own
        // option set (not a generic top-level list), so the very first
        // render already matches whichever package button is active.
        const initialVariant = initialPackageId
          ? data.variantsData[initialPackageId]
          : undefined;
        setGraphicId(
          initialVariant?.graphics[0]?.id ?? data.graphics[0]?.id ?? null,
        );
        setBaseId(initialVariant?.baseSelectOptions[0]?.value ?? null);
        setCarryBagId(initialVariant?.carryBagOptions[0]?.value ?? null);
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
  }, []);

  // Whenever the person switches "What's included" (Flag + Pole <-> Flag
  // Only), that package's own graphic/base/carryBag lists take over. Any
  // previously selected id that doesn't exist in the new list (e.g. a
  // Base id when there is no Base for Flag Only, or a carryBag id of
  // "1"/"2" vs "no"/"yes") is reset to that variant's first option so the
  // dropdowns never silently point at an option that isn't really active.
  useEffect(() => {
    if (!product || !packageId) return;
    const variant = product.variantsData[packageId];
    if (!variant) return;

    setGraphicId((prev) =>
      variant.graphics.some((g) => g.id === prev)
        ? prev
        : (variant.graphics[0]?.id ?? null),
    );

    setBaseId((prev) =>
      variant.baseSelectOptions.length === 0
        ? null
        : variant.baseSelectOptions.some((b) => b.value === prev)
          ? prev
          : (variant.baseSelectOptions[0]?.value ?? null),
    );

    setCarryBagId((prev) =>
      variant.carryBagOptions.some((c) => c.value === prev)
        ? prev
        : (variant.carryBagOptions[0]?.value ?? null),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [packageId, product]);

  if (loading) return <StateScreen kind="loading" />;
  if (error || !product)
    return <StateScreen kind="error" message={error ?? "Product not found"} />;

  const currentVariant: VariantOptionSet = (packageId &&
    product.variantsData[packageId]) ||
    product.variantsData[product.packages[0].id] || {
      graphics: product.graphics || [],
      baseSelectOptions: product.baseSelectOptions || [],
      carryBagOptions: product.carryBag?.options || [],
    };

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
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <Breadcrumbs productName={product.name} />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          {/* -------------------------------------------------- */}
          {/* LEFT — Gallery                                       */}
          {/* -------------------------------------------------- */}
          <div className="lg:col-span-7">
            <div className="relative aspect-[4/5] sm:aspect-[16/11] lg:aspect-[16/12] w-full bg-gray-50 border border-gray-200 rounded-sm flex items-center justify-center overflow-hidden">
              {activeImage && <GalleryVisual item={activeImage} />}
            </div>

            {/* Thumbnails */}
            <div className="mt-3 grid grid-cols-5 sm:grid-cols-9 gap-2">
              {product.gallery.map((item) => {
                const active = item.id === activeImageId;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveImageId(item.id)}
                    aria-label={item.label}
                    aria-pressed={active}
                    className={`aspect-square rounded-sm border bg-gray-50 flex items-center justify-center transition-colors ${
                      active
                        ? "border-[#c6005c] ring-1 ring-[#c6005c]"
                        : "border-gray-200 hover:border-gray-400"
                    }`}
                  >
                    <GalleryVisual item={item} compact />
                  </button>
                );
              })}
            </div>

            {/* Bullets */}
            <FeatureGrid bullets={product.bullets} />
          </div>

          {/* -------------------------------------------------- */}
          {/* RIGHT — Buy box                                      */}
          {/* -------------------------------------------------- */}
          <div className="lg:col-span-5">
            {/* Eyebrow + title + description */}
            <p className="text-xs font-semibold uppercase tracking-wide text-[#c6005c]">
              {product.eyebrow}
            </p>
            <h1 className="mt-1.5 text-2xl sm:text-[28px] font-bold text-gray-900">
              {product.name}
            </h1>
            <p className="mt-3 text-sm sm:text-[14px] leading-relaxed text-gray-600">
              {product.shortDescription}
            </p>

            <div className="mt-6 border-2 rounded-2xl p-3 shadow-xl border-gray-100 pt-6 space-y-6">
              {/* What's included */}
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

              {/* Size */}
              <div>
                <p className="text-sm font-semibold text-gray-900 mb-2.5">
                  Size
                </p>
                <div className="grid grid-cols-4 gap-2.5">
                  {product.sizes.map((s) => {
                    const active = s.id === sizeId;
                    return (
                      <button
                        key={s.id}
                        onClick={() => setSizeId(s.id)}
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
                          {s.label}
                        </span>
                        <span className="block text-xs text-gray-500 mt-0.5">
                          {s.assembledHeight}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Graphic — options come from currentVariant, i.e. the
                  variant matching the selected package */}
              <FieldSelect
                icon={<FileImage className="h-3.5 w-3.5" />}
                label="Graphic"
                value={graphicId ?? ""}
                onChange={(value) => setGraphicId(value)}
                options={currentVariant.graphics.map((graphic) => ({
                  value: graphic.id,
                  label:
                    graphic.upcharge > 0
                      ? `${graphic.label} (+$${graphic.upcharge})`
                      : graphic.label,
                }))}
              />

              {/* Base — only rendered when the active package actually has
                  base options. Flag Only has none, so this field
                  disappears entirely when Flag Only is selected. */}
              {currentVariant.baseSelectOptions.length > 0 && (
                <FieldSelect
                  icon={<CircleDot className="h-3.5 w-3.5" />}
                  label="Base"
                  value={baseId ?? ""}
                  onChange={(value) => setBaseId(value)}
                  options={currentVariant.baseSelectOptions}
                />
              )}

              {/* Carry Bag — options come from currentVariant too, since
                  Flag + Pole and Flag Only use different option ids
                  ("1"/"2" vs "no"/"yes") for the same Yes/No choice */}
              <FieldSelect
                icon={<Briefcase className="h-3.5 w-3.5" />}
                label="Carry Bag"
                value={carryBagId ?? ""}
                onChange={(value) => setCarryBagId(value)}
                options={currentVariant.carryBagOptions}
              />
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
                sizes={product.sizes}
                specImage={product.specImage}
                materialSpec={product.materialSpec}
                carryBag={product.carryBag}
                bases={product.bases}
                hardwareAndAssembly={product.hardwareAndAssembly}
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
/*  Buy box helpers: field select, feature grid                        */
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
  options: SelectOption[];
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
  if (t.includes("polyester") || t.includes("mesh") || t.includes("sublimat"))
    return Droplet;
  if (t.includes("pole")) return Wrench;
  if (t.includes("base")) return CircleDot;
  if (t.includes("carry") || t.includes("bag")) return Briefcase;
  return Check;
}

function FeatureGrid({ bullets }: { bullets: string[] }) {
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
/*  Description tab                                                     */
/* ================================================================== */

function DescriptionTab({ data }: { data: ProductData["description"] }) {
  return (
    <div className="w-full">
      <h2 className="text-lg font-semibold text-gray-900">Description</h2>
      <p className="mt-3 text-sm sm:text-[15px] leading-relaxed text-gray-700">
        {data.intro}
      </p>
      <p className="mt-4 text-sm sm:text-[15px] leading-relaxed text-gray-700">
        {data.printInfo}
      </p>

      <ul className="mt-4 space-y-2.5">
        {data.graphicTypes.map((g) => (
          <li
            key={g.label}
            className="text-sm sm:text-[14px] leading-relaxed text-gray-700 flex items-start gap-2"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#c6005c] mt-2 shrink-0"></span>
            <span>
              <span className="font-semibold text-gray-900">{g.label}</span>{" "}
              {g.detail}
            </span>
          </li>
        ))}
      </ul>

      <p className="mt-4 text-sm sm:text-[15px] leading-relaxed text-gray-700">
        {data.baseInfo}
      </p>

      <h3 className="mt-6 text-sm font-semibold text-gray-900">
        {data.applicationsLabel}
      </h3>
      <p className="mt-1.5 text-sm sm:text-[15px] leading-relaxed text-gray-700">
        {data.applications}
      </p>
    </div>
  );
}

/* ================================================================== */
/*  Spec tab                                                             */
/* ================================================================== */

function formatSizeLabel(label: string) {
  const l = label.toLowerCase();
  if (l === "x-large" || l === "xlarge") return "XL";
  if (l === "xx-large" || l === "xxlarge") return "XXL";
  if (l === "large") return "L";
  if (l === "medium") return "M";
  if (l === "small") return "S";
  return label;
}

function SpecTab({
  sizes,
  specImage,
  materialSpec,
  carryBag,
  bases,
  hardwareAndAssembly,
}: {
  sizes: SizeSpec[];
  specImage: string;
  materialSpec: ProductData["materialSpec"];
  carryBag: ProductData["carryBag"];
  bases: BaseHardwareSpec[];
  hardwareAndAssembly: ProductData["hardwareAndAssembly"];
}) {
  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-900">Spec</h2>
      <p className="mt-2 text-sm text-gray-500">Size &amp; Specifications</p>

      <div className="mt-5 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        <div className="lg:col-span-5 flex flex-col">
          {specImage ? (
            <img
              src={
                specImage.startsWith("http") || specImage.startsWith("/")
                  ? specImage
                  : `/image/${specImage}`
              }
              alt="Size and Specifications Diagram"
              className="w-full h-auto object-contain rounded-2xl border border-gray-200 bg-gray-50"
              style={{ maxHeight: "360px" }}
            />
          ) : (
            <div className="w-full h-auto min-h-[300px] bg-gray-50 flex items-center justify-center text-sm text-gray-400 border border-gray-200 rounded-2xl">
              No diagram available
            </div>
          )}
        </div>

        <div className="lg:col-span-7">
          <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white">
            <table className="w-full text-sm border-collapse min-w-[560px]">
              <thead>
                <tr className="border-b border-gray-200 bg-white">
                  <th className="py-4 px-3 text-center font-bold text-gray-900 border-r border-gray-200 whitespace-nowrap">
                    Size
                  </th>
                  <th className="py-4 px-3 text-center font-bold text-gray-900 border-r border-gray-200">
                    Assembled
                    <br />
                    Height
                  </th>
                  <th className="py-4 px-3 text-center font-bold text-gray-900 border-r border-gray-200">
                    Graphic
                    <br />
                    Size
                  </th>
                  <th className="py-4 px-3 text-center font-bold text-gray-900 border-r border-gray-200">
                    Flag
                    <br />
                    Weight
                  </th>
                  <th className="py-4 px-3 text-center font-bold text-gray-900 border-r border-gray-200">
                    Flag w/ Pole
                    <br />
                    Weight
                  </th>
                  <th className="py-4 px-3 text-center font-bold text-gray-900">
                    Pole Set
                    <br />
                    Pieces
                  </th>
                </tr>
              </thead>
              <tbody>
                {[...sizes].reverse().map((s, idx) => (
                  <tr
                    key={s.id}
                    className={
                      idx !== sizes.length - 1
                        ? "border-b border-gray-200 bg-white"
                        : "bg-white"
                    }
                  >
                    <td className="py-6 px-3 text-center font-bold text-gray-900 border-r border-gray-200 whitespace-nowrap">
                      {formatSizeLabel(s.label)}
                    </td>
                    <td className="py-6 px-3 text-center font-bold text-[#c6005c] border-r border-gray-200 whitespace-nowrap">
                      {s.assembledHeight}
                    </td>
                    <td className="py-6 px-3 text-center text-gray-600 border-r border-gray-200 whitespace-nowrap">
                      {s.graphicSize}
                    </td>
                    <td className="py-6 px-3 text-center text-gray-600 border-r border-gray-200 whitespace-nowrap">
                      {s.flagWeight}
                    </td>
                    <td className="py-6 px-3 text-center text-gray-600 border-r border-gray-200 whitespace-nowrap">
                      {s.flagWithPoleWeight}
                    </td>
                    <td className="py-6 px-3 text-center text-gray-600 whitespace-nowrap">
                      {s.poleSetPieces}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Material & Print Specifications */}
      <div className="mt-10 grid grid-cols-1 sm:grid-cols-2">
        <div>
          <h3 className="text-sm font-semibold text-gray-900">
            Material &amp; Print Specifications
          </h3>
          <dl className="mt-3 space-y-1 text-sm">
            <SpecRow label="Print Method" value={materialSpec.printMethod} />
            <SpecRow
              label="Graphic Material"
              value={materialSpec.graphicMaterial}
            />
            <SpecRow label="Washable" value={materialSpec.washable} />
          </dl>

          <h3 className="mt-6 text-sm font-semibold text-gray-900">
            Additional Accessories
          </h3>
          <p className="mt-2 text-sm text-gray-700">
            Carry Bag (Optional): {carryBag.label}
          </p>
          <ul className="mt-1.5 space-y-1 text-sm text-gray-700 pl-4 list-disc marker:text-[#c6005c]">
            <li>S/M = {carryBag.weightSmallMedium}</li>
            <li>L/XL = {carryBag.weightLargeXLarge}</li>
          </ul>

          <h3 className="mt-6 text-sm font-semibold text-gray-900">
            Hardware &amp; Assembly
          </h3>
          <p className="mt-2 text-sm text-gray-700">
            Pole Set: {hardwareAndAssembly.poleSet}
          </p>
        </div>
      </div>

      {/* Base Hardware Specifications */}
      <div className="mt-10">
        <h3 className="text-sm font-semibold text-gray-900">
          Base Hardware Specifications
        </h3>
        <div className="mt-4 grid grid-cols-2 lg:grid-cols-4 gap-4">
          {bases.map((b) => (
            <div
              key={b.id}
              className="border border-gray-200 rounded-sm overflow-hidden"
            >
              <div className="aspect-square bg-gray-50 flex items-center justify-center">
                <BaseIcon id={b.id} />
              </div>
              <div className="p-3">
                <p className="text-sm font-semibold text-gray-900">{b.label}</p>
                <ul className="mt-1.5 space-y-1 text-xs text-gray-600">
                  <li>Material: {b.material}</li>
                  <li>Weight: {b.weight}</li>
                  {b.use.map((u) => (
                    <li key={u}>Use: {u}</li>
                  ))}
                  {b.feature && <li>Feature: {b.feature}</li>}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SpecRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-sm text-gray-700">
      <span className="font-medium text-gray-900">{label}:</span>{" "}
      <span>{value}</span>
    </div>
  );
}

function BaseIcon({ id }: { id: BaseId }) {
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

function FileSetupTab({ data }: { data: ProductData["fileSetup"] }) {
  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-900">File Setup</h2>

      <ul className="mt-4 space-y-2 max-w-3xl">
        {data.requirements.map((r) => (
          <li key={r} className="flex items-start gap-2 text-sm text-gray-700">
            <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[#c6005c] flex-shrink-0" />
            {r}
          </li>
        ))}
      </ul>

      <h3 className="mt-6 text-sm font-semibold text-gray-900">
        Additional Tips
      </h3>
      <ul className="mt-2 space-y-2 max-w-3xl">
        {data.tips.map((t) => (
          <li key={t} className="flex items-start gap-2 text-sm text-gray-700">
            <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[#c6005c] flex-shrink-0" />
            {t}
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ================================================================== */
/*  Gallery visual (placeholder art — swap for real photography)       */
/* ================================================================== */

function GalleryVisual({
  item,
  compact = false,
}: {
  item: GalleryItem;
  compact?: boolean;
}) {
  if (item.url) {
    return (
      <img
        src={item.url}
        alt={item.label}
        className={`object-contain w-full h-full ${compact ? "rounded-sm" : ""}`}
      />
    );
  }

  const size = compact ? "h-5 w-5 sm:h-6 sm:w-6" : "h-16 w-16 sm:h-24 sm:w-24";
  const color = "text-[#c6005c]";

  switch (item.kind) {
    case "flag-front":
    case "flag-reverse":
    case "flag-double":
      return (
        <div
          className={`flex flex-col items-center ${compact ? "gap-0.5" : "gap-2"}`}
        >
          <Flag className={`${size} ${color}`} strokeWidth={1.5} />
          {!compact && (
            <span className="text-xs text-gray-400">{item.label}</span>
          )}
        </div>
      );
    case "pole":
      return (
        <div
          className={`flex flex-col items-center ${compact ? "gap-0.5" : "gap-2"}`}
        >
          <MoveVertical className={`${size} text-gray-400`} strokeWidth={1.5} />
          {!compact && (
            <span className="text-xs text-gray-400">{item.label}</span>
          )}
        </div>
      );
    case "bases-row":
      return (
        <div className="flex items-center gap-1.5">
          <MoveVertical
            className={`${compact ? "h-4 w-4" : "h-8 w-8"} text-gray-400`}
          />
          <Layers
            className={`${compact ? "h-4 w-4" : "h-8 w-8"} text-gray-400`}
          />
          <CircleDot
            className={`${compact ? "h-4 w-4" : "h-8 w-8"} text-gray-400`}
          />
        </div>
      );
    case "base-single":
      return (
        <CircleDot className={`${size} text-gray-400`} strokeWidth={1.5} />
      );
    case "diagram":
      return (
        <div className="flex items-end gap-1.5">
          {[0.4, 0.6, 0.8, 1].map((h, i) => (
            <div
              key={i}
              className="w-3 sm:w-4 bg-gray-300 rounded-t-sm"
              style={{ height: `${h * (compact ? 20 : 64)}px` }}
            />
          ))}
        </div>
      );
    case "icons":
    default:
      return <Info className={`${size} text-gray-400`} strokeWidth={1.5} />;
  }
}
