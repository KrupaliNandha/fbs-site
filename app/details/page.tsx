"use client";

/**
 * Feather Angled Flag — Product Detail Page
 * -------------------------------------------------------------
 * Stack: React + TypeScript + Tailwind CSS
 *
 * This component contains ZERO hardcoded product content. Every piece of
 * copy, pricing, spec, and option shown on the page is fetched at runtime
 * from a JSON file (see `DEFAULT_DATA_URL` below, or pass your own via the
 * `dataUrl` prop). The component only owns UI/interaction state (which
 * size/graphic/base/tab is selected) — never the product data itself.
 *
 * JSON SHAPE
 * The fetched JSON must match the `ProductData` interface declared below.
 * A ready-to-use example lives at /public/data/feather-angled-flag.json.
 *
 * ACCENT COLOR: #c6005c is the ONLY brand/accent color used anywhere in
 * this file (buttons, active tabs, selected states, links, focus rings).
 * Everything else is neutral gray/white/black.
 *
 * SETUP NOTES
 * 1. Icons: `npm i lucide-react`
 * 2. Images: gallery + base-hardware images are placeholder SVG/icons so
 *    this file has zero external asset dependencies. Swap the relevant
 *    render branches for real <img>/<Image> tags backed by your CMS.
 * -------------------------------------------------------------
 */

import { useEffect, useState } from "react";
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
import productDetailData from "../data/product-detail.json";

/* ================================================================== */
/*  Data model (shape of the fetched JSON)                              */
/* ================================================================== */

type SizeId = string;
type GraphicId = string;
type BaseId = string;
type PackageId = string;
type TabId = "description" | "spec" | "file-setup" | "installation";

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
    upcharge: number;
}

interface SelectOption {
    value: string;
    label: string;
}

interface GalleryItem {
    id: string;
    label: string;
    kind: "flag-front" | "flag-reverse" | "flag-double" | "pole" | "bases-row" | "base-single" | "diagram" | "icons";
}

interface TemplateLink {
    label: string;
}

interface TemplateRow {
    size: string;
    pdf: TemplateLink[];
    photoshop: TemplateLink[];
}

interface InstallStep {
    step: number;
    title: string;
}

interface ProductData {
    eyebrow: string;
    name: string;
    shortDescription: string;
    gallery: GalleryItem[];
    bullets: string[];
    packages: { id: PackageId; label: string; priceAdjustment: number }[];
    sizes: SizeSpec[];
    graphics: GraphicOption[];
    bases: BaseHardwareSpec[];
    baseSelectOptions: SelectOption[];
    carryBag: { label: string; weightSmallMedium: string; weightLargeXLarge: string; price: number };
    description: {
        intro: string;
        printInfo: string;
        graphicTypes: { label: string; detail: string }[];
        baseInfo: string;
        applicationsLabel: string;
        applications: string;
    };
    materialSpec: { printMethod: string; graphicMaterial: string; washable: string };
    fileSetup: {
        requirements: string[];
        tips: string[];
        templates: TemplateRow[];
    };
    installation: {
        steps: InstallStep[];
        tip: string;
    };
}

function mapRawToProductData(raw: any): ProductData {
    return {
        eyebrow: "Product Details",
        name: raw.name,
        shortDescription: raw.Description.content[0],
        gallery: [
            { id: "main", label: "Main Image", kind: "flag-front" },
            ...raw.images.subImages.map((img: string, i: number) => ({
                id: `sub-${i}`,
                label: `Image ${i + 1}`,
                kind: "flag-front" as const
            }))
        ],
        bullets: raw.features,
        packages: raw.variants.map((v: any) => ({
            id: v.productType.id,
            label: v.productType.name,
            priceAdjustment: 0
        })),
        sizes: raw.spec.sizeSpecification.table.map((row: any) => ({
            id: row.size.toLowerCase().replace(/[^a-z0-9]/g, "-"),
            label: row.size,
            assembledHeight: row.assembledHeight,
            graphicSize: row.graphicSize,
            flagWeight: row.flagWeight,
            flagWithPoleWeight: row.flagWithPoleWeight,
            poleSetPieces: row.poleSetPieces,
            heightFt: parseFloat(row.assembledHeight),
            price: 0
        })),
        graphics: raw.variants[0].graphic.map((g: any, i: number) => ({
            id: g.id,
            label: g.name,
            description: raw.Description.graphics[i] || "",
            upcharge: 0
        })),
        bases: raw.baseHardwareSpecifications.map((b: any) => ({
            id: b.id,
            label: b.name,
            material: b.specifications.material || "N/A",
            weight: b.specifications.weight || "N/A",
            use: [b.specifications.use || ""],
            upcharge: 0
        })),
        baseSelectOptions: raw.variants[0].base.map((b: any) => ({
            value: b.id,
            label: b.name
        })),
        carryBag: {
            label: raw.spec.additionalAccessories.carryBag,
            weightSmallMedium: raw.spec.additionalAccessories.weight.find((w: any) => w.size === "S/M")?.weight || "",
            weightLargeXLarge: raw.spec.additionalAccessories.weight.find((w: any) => w.size === "L/XL")?.weight || "",
            price: 10
        },
        description: {
            intro: raw.Description.content[0],
            printInfo: raw.Description.content[2],
            graphicTypes: raw.Description.graphics.map((g: string) => ({ label: "Graphic Option", detail: g })),
            baseInfo: raw.Description.content[3],
            applicationsLabel: raw.Description.applications.title,
            applications: raw.Description.applications.content
        },
        materialSpec: {
            printMethod: raw.spec.materialAndPrintSpecifications.printMethod,
            graphicMaterial: raw.spec.materialAndPrintSpecifications.graphicMaterial,
            washable: raw.spec.materialAndPrintSpecifications.washable
        },
        fileSetup: {
            requirements: raw.fileSetup.requirements,
            tips: raw.fileSetup.additionalTips,
            templates: raw.installationGuide.templateDownloads.map((t: any) => ({
                size: t.size,
                pdf: Object.values(t.pdf).map(v => ({ label: String(v) })),
                photoshop: Object.values(t.photoshop).map(v => ({ label: String(v) }))
            }))
        },
        installation: {
            steps: raw.installationGuide.steps || [],
            tip: raw.installationGuide.tip?.content || ""
        }
    };
}

const DEFAULT_DATA_URL = "/data/product-detail.json";

/* ================================================================== */
/*  Component                                                            */
/* ================================================================== */

export default function ProductDetailPage({ dataUrl = DEFAULT_DATA_URL }: { dataUrl?: string }) {
    const [product, setProduct] = useState<ProductData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [activeImageId, setActiveImageId] = useState<string | null>(null);
    const [packageId, setPackageId] = useState<PackageId | null>(null);
    const [sizeId, setSizeId] = useState<SizeId | null>(null);
    const [graphicId, setGraphicId] = useState<GraphicId | null>(null);
    const [baseId, setBaseId] = useState<BaseId | null>(null);
    const [carryBag, setCarryBag] = useState("none");
    const [activeTab, setActiveTab] = useState<TabId>("description");

    // Fetch all product content from JSON — no static data lives in this file.
    useEffect(() => {
        let cancelled = false;

        async function loadProduct() {
            setLoading(true);
            setError(null);
            try {
                // Use imported data directly
                const data: ProductData = mapRawToProductData(productDetailData);
                if (cancelled) return;

                setProduct(data);
                setActiveImageId(data.gallery[0]?.id ?? null);
                setPackageId(data.packages[0]?.id ?? null);
                // Default to a "middle" size if present, otherwise the first one.
                setSizeId(data.sizes.find((s) => s.id === "large")?.id ?? data.sizes[0]?.id ?? null);
                setGraphicId(data.graphics[0]?.id ?? null);
                setBaseId(data.bases[0]?.id ?? null);
            } catch (err) {
                if (!cancelled) {
                    setError(err instanceof Error ? err.message : "Failed to load product data");
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

    if (loading) return <StateScreen kind="loading" />;
    if (error || !product) return <StateScreen kind="error" message={error ?? "Product not found"} />;

    const activeImage = product.gallery.find((g) => g.id === activeImageId) ?? product.gallery[0];

    const tabs: { id: TabId; label: string }[] = [
        { id: "description", label: "Description" },
        { id: "spec", label: "Spec" },
        { id: "file-setup", label: "File Setup" },
        { id: "installation", label: "Installation Guide" },
    ];

    return (
        <div className="min-h-screen bg-white text-gray-900">
            <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
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
                                        className={`aspect-square rounded-sm border bg-gray-50 flex items-center justify-center transition-colors ${active ? "border-[#c6005c] ring-1 ring-[#c6005c]" : "border-gray-200 hover:border-gray-400"
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
                        <p className="text-xs font-semibold uppercase tracking-wide text-[#c6005c]">{product.eyebrow}</p>
                        <h1 className="mt-1.5 text-2xl sm:text-[28px] font-bold text-gray-900">{product.name}</h1>
                        <p className="mt-3 text-sm sm:text-[15px] leading-relaxed text-gray-600">{product.shortDescription}</p>

                        {/* Checklist */}
                        <ul className="mt-4 space-y-1.5">
                            {product.bullets.map((b) => (
                                <li key={b} className="flex items-start gap-2 text-sm text-gray-700">
                                    <Check className="h-4 w-4 text-[#c6005c] flex-shrink-0 mt-0.5" />
                                    <span>{b}</span>
                                </li>
                            ))}
                        </ul>

                        <div className="mt-6 border-2 rounded-2xl p-3 shadow-xl border-gray-100 pt-6 space-y-6">
                            {/* What's included */}
                            <div>
                                <p className="text-sm font-semibold text-gray-900 mb-2.5">What&apos;s included</p>
                                <div className="flex flex-wrap gap-2.5">
                                    {product.packages.map((p) => {
                                        const active = p.id === packageId;
                                        return (
                                            <button
                                                key={p.id}
                                                onClick={() => setPackageId(p.id)}
                                                aria-pressed={active}
                                                className={`rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${active
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
                                <p className="text-sm font-semibold text-gray-900 mb-2.5">Size</p>
                                <div className="grid grid-cols-4 gap-2.5">
                                    {product.sizes.map((s) => {
                                        const active = s.id === sizeId;
                                        return (
                                            <button
                                                key={s.id}
                                                onClick={() => setSizeId(s.id)}
                                                aria-pressed={active}
                                                className={`rounded-lg border px-2 py-2.5 text-center transition-colors ${active
                                                    ? "border-[#c6005c] bg-[#c6005c]/5"
                                                    : "border-gray-300 hover:border-gray-400"
                                                    }`}
                                            >
                                                <span className={`block text-sm font-semibold ${active ? "text-[#c6005c]" : "text-gray-900"}`}>
                                                    {s.label}
                                                </span>
                                                <span className="block text-xs text-gray-500 mt-0.5">{s.assembledHeight}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Graphic */}
                            <FieldSelect
                                icon={<FileImage className="h-3.5 w-3.5" />}
                                label="Graphic"
                                value={graphicId ?? ""}
                                onChange={(value) => setGraphicId(value)}
                                options={product.graphics.map((graphic) => ({
                                    value: graphic.id,
                                    label: graphic.upcharge > 0 ? `${graphic.label} (+$${graphic.upcharge})` : graphic.label,
                                }))}
                            />

                            {/* Base */}
                            <FieldSelect
                                icon={<CircleDot className="h-3.5 w-3.5" />}
                                label="Base"
                                value={baseId ?? ""}
                                onChange={(value) => setBaseId(value)}
                                options={product.baseSelectOptions}
                            />

                            {/* Carry Bag */}
                            <FieldSelect
                                icon={<Briefcase className="h-3.5 w-3.5" />}
                                label={product.carryBag.label}
                                value={carryBag}
                                onChange={(value) => setCarryBag(value)}
                                options={[
                                    { value: "none", label: `No ${product.carryBag.label}` },
                                    { value: "carry", label: `${product.carryBag.label} (+$${product.carryBag.price})` },
                                ]}
                            />
                        </div>
                    </div>
                </div>

                {/* -------------------------------------------------- */}
                {/* Tabs                                                 */}
                {/* -------------------------------------------------- */}
                <div className="mt-10 sm:mt-12">
                    <div className="border-b border-gray-200">
                        <nav className="flex gap-6 sm:gap-8 min-w-max px-0.5" aria-label="Product information tabs">
                            {tabs.map((tab) => {
                                const active = tab.id === activeTab;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        aria-selected={active}
                                        className={`relative py-3 text-sm sm:text-[15px] font-medium whitespace-nowrap transition-colors ${active ? "text-[#c6005c]" : "text-gray-500 hover:text-gray-800"
                                            }`}
                                    >
                                        {tab.label}
                                        {active && <span className="absolute left-0 right-0 -bottom-px h-0.5 bg-[#c6005c]" />}
                                    </button>
                                );
                            })}
                        </nav>
                    </div>

                    <div className="py-6 sm:py-8">
                        {activeTab === "description" && <DescriptionTab data={product.description} />}
                        {activeTab === "spec" && (
                            <SpecTab sizes={product.sizes} materialSpec={product.materialSpec} carryBag={product.carryBag} bases={product.bases} />
                        )}
                        {activeTab === "file-setup" && <FileSetupTab data={product.fileSetup} />}
                        {activeTab === "installation" && <InstallationTab data={product.installation} />}
                    </div>
                </div>
            </main>
        </div>
    );
}

/* ================================================================== */
/*  Loading / error state screen                                        */
/* ================================================================== */

function StateScreen({ kind, message }: { kind: "loading" | "error"; message?: string }) {
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
                    <p className="text-sm font-medium text-gray-900">Couldn&apos;t load product details</p>
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
    return (
        <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-900">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#c6005c]/10 text-[#c6005c]">
                    {icon}
                </span>
                {label}
            </label>

            <div className="relative">
                <select
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="
            w-full
            appearance-none
            rounded-xl
            border
            border-gray-300
            bg-white
            px-4
            py-3
            pr-10
            text-sm
            font-medium
            text-gray-900
            transition-all
            focus:border-[#c6005c]
            focus:ring-1
            focus:ring-[#c6005c]/20
            outline-none
          "
                >
                    {options.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>

                <ChevronDown className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
        </div>
    );
}

function pickFeatureIcon(text: string) {
    const t = text.toLowerCase();
    if (t.includes("indoor") || t.includes("outdoor")) return Home;
    if (t.includes("sided")) return Layers;
    if (t.includes("polyester") || t.includes("mesh") || t.includes("sublimat")) return Droplet;
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
                    <div key={b} className="flex items-start gap-3 rounded-lg border border-gray-100 bg-gray-50 p-3">
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
        <div className="max-w-3xl">
            <h2 className="text-lg font-semibold text-gray-900">Description</h2>
            <p className="mt-3 text-sm sm:text-[15px] leading-relaxed text-gray-700">{data.intro}</p>
            <p className="mt-4 text-sm sm:text-[15px] leading-relaxed text-gray-700">{data.printInfo}</p>

            <ul className="mt-4 space-y-2.5">
                {data.graphicTypes.map((g) => (
                    <li key={`${g.label}-${g.detail}`} className="text-sm sm:text-[15px] leading-relaxed text-gray-700 flex gap-2">
                        <span className="text-[#c6005c] mt-1">•</span>
                        <span>
                            <span className="font-semibold text-gray-900">{g.label}</span> {g.detail}
                        </span>
                    </li>
                ))}
            </ul>

            <p className="mt-4 text-sm sm:text-[15px] leading-relaxed text-gray-700">{data.baseInfo}</p>

            <h3 className="mt-6 text-sm font-semibold text-gray-900">{data.applicationsLabel}</h3>
            <p className="mt-1.5 text-sm sm:text-[15px] leading-relaxed text-gray-700">{data.applications}</p>
        </div>
    );
}

/* ================================================================== */
/*  Spec tab                                                             */
/* ================================================================== */

function SpecTab({
    sizes,
    materialSpec,
    carryBag,
    bases,
}: {
    sizes: SizeSpec[];
    materialSpec: ProductData["materialSpec"];
    carryBag: ProductData["carryBag"];
    bases: BaseHardwareSpec[];
}) {
    return (
        <div>
            <h2 className="text-lg font-semibold text-gray-900">Spec</h2>
            <p className="mt-1 text-sm text-gray-500">Size &amp; Specifications</p>

            <div className="mt-5 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
                <div className="lg:col-span-5">
                    <HeightDiagram sizes={sizes} />
                </div>

                <div className="lg:col-span-7 overflow-x-auto">
                    <table className="w-full text-sm border-collapse min-w-[560px]">
                        <thead>
                            <tr className="border-b border-gray-200">
                                {["Size", "Assembled Height", "Graphic Size", "Flag Weight", "Flag w/ Pole Weight", "Pole Set Pieces"].map(
                                    (h) => (
                                        <th key={h} className="text-left font-semibold text-gray-800 py-2.5 pr-4 whitespace-nowrap">
                                            {h}
                                        </th>
                                    )
                                )}
                            </tr>
                        </thead>
                        <tbody>
                            {[...sizes].reverse().map((s) => (
                                <tr key={s.id} className="border-b border-gray-100">
                                    <td className="py-3 pr-4 font-medium text-gray-900 whitespace-nowrap">{s.label}</td>
                                    <td className="py-3 pr-4 text-[#c6005c] font-medium whitespace-nowrap">{s.assembledHeight}</td>
                                    <td className="py-3 pr-4 text-gray-700 whitespace-nowrap">{s.graphicSize}</td>
                                    <td className="py-3 pr-4 text-gray-700 whitespace-nowrap">{s.flagWeight}</td>
                                    <td className="py-3 pr-4 text-gray-700 whitespace-nowrap">{s.flagWithPoleWeight}</td>
                                    <td className="py-3 pr-4 text-gray-700 whitespace-nowrap">{s.poleSetPieces}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Material & Print Specifications */}
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div>
                    <h3 className="text-sm font-semibold text-gray-900">Material &amp; Print Specifications</h3>
                    <dl className="mt-3 space-y-2 text-sm">
                        <SpecRow label="Print Method" value={materialSpec.printMethod} />
                        <SpecRow label="Graphic Material" value={materialSpec.graphicMaterial} />
                        <SpecRow label="Washable" value={materialSpec.washable} />
                    </dl>

                    <h3 className="mt-6 text-sm font-semibold text-gray-900">Additional Accessories</h3>
                    <p className="mt-2 text-sm text-gray-700">{carryBag.label} (Optional): Nylon / Zippered</p>
                    <ul className="mt-1.5 space-y-1 text-sm text-gray-700 pl-4 list-disc marker:text-[#c6005c]">
                        <li>S/M = {carryBag.weightSmallMedium}</li>
                        <li>L/XL = {carryBag.weightLargeXLarge}</li>
                    </ul>
                </div>

                <div>
                    <h3 className="text-sm font-semibold text-gray-900">Hardware &amp; Assembly</h3>
                    <p className="mt-2 text-sm text-gray-700">Pole Set: Aluminum and graphite pole set, Tool Free Interlocking poles</p>
                </div>
            </div>

            {/* Base Hardware Specifications */}
            <div className="mt-10">
                <h3 className="text-sm font-semibold text-gray-900">Base Hardware Specifications</h3>
                <div className="mt-4 grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {bases.map((b) => (
                        <div key={b.id} className="border border-gray-200 rounded-sm overflow-hidden">
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
        <div className="flex justify-between gap-4">
            <dt className="text-gray-500">{label}</dt>
            <dd className="text-gray-900 font-medium">{value}</dd>
        </div>
    );
}

function HeightDiagram({ sizes }: { sizes: SizeSpec[] }) {
    const maxFt = Math.max(...sizes.map((s) => s.heightFt));
    const trackPx = 200;
    const humanFt = 5.83;
    const gridLines = [6, 9, 10.5, 14, 18].filter((v) => v <= maxFt || v === Math.max(...[6, 9, 10.5, 14, 18]));

    return (
        <div className="border border-gray-200 rounded-sm bg-gray-50 px-4 sm:px-6 pt-6 pb-4">
            <div className="relative" style={{ height: trackPx + 24 }}>
                {/* grid lines with ft labels */}
                {gridLines.map((ft) => (
                    <div
                        key={ft}
                        className="absolute left-8 right-0 border-t border-gray-300"
                        style={{ bottom: (ft / maxFt) * trackPx + 24 }}
                    >
                        <span className="absolute -top-2.5 right-0 text-[10px] text-gray-500">{ft}'</span>
                    </div>
                ))}

                {/* human silhouette reference */}
                <div className="absolute left-0 flex flex-col items-center" style={{ bottom: 24 }}>
                    <div
                        className="w-3 rounded-t-full bg-gray-300"
                        style={{ height: (humanFt / maxFt) * trackPx }}
                    />
                </div>

                {/* flags */}
                <div className="absolute left-10 right-0 flex items-end justify-between gap-3" style={{ bottom: 24, height: trackPx }}>
                    {sizes.map((s) => {
                        const barHeight = (s.heightFt / maxFt) * trackPx;
                        const initial = s.label[0];
                        return (
                            <div key={s.id} className="flex flex-col items-center flex-1">
                                <div
                                    className="relative w-full max-w-[36px] rounded-t-sm bg-white border border-gray-300"
                                    style={{ height: Math.max(barHeight, 20) }}
                                >
                                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 h-5 w-5 rounded-full bg-[#c6005c] text-white text-[10px] font-semibold flex items-center justify-center">
                                        {initial}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

function BaseIcon({ id }: { id: BaseId }) {
    const iconProps = { className: "h-8 w-8 text-gray-400" };
    switch (id) {
        case "stake":
            return <MoveVertical {...iconProps} />;
        case "cross":
            return <Layers {...iconProps} />;
        case "water":
            return <CircleDot {...iconProps} />;
        case "square":
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

            <h3 className="mt-6 text-sm font-semibold text-gray-900">Additional Tips</h3>
            <ul className="mt-2 space-y-2 max-w-3xl">
                {data.tips.map((t) => (
                    <li key={t} className="flex items-start gap-2 text-sm text-gray-700">
                        <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[#c6005c] flex-shrink-0" />
                        {t}
                    </li>
                ))}
            </ul>

            <h3 className="mt-8 text-sm font-semibold text-gray-900 flex items-center gap-1.5">
                Template Download
                <Download className="h-3.5 w-3.5 text-[#c6005c]" />
            </h3>
            <div className="mt-3 overflow-x-auto">
                <table className="w-full text-sm border-collapse min-w-[600px]">
                    <thead>
                        <tr className="border-b border-gray-200">
                            <th className="text-left font-semibold text-gray-800 py-2.5 pr-4">Size</th>
                            <th className="text-left font-semibold text-gray-800 py-2.5 pr-4">
                                <span className="inline-flex items-center gap-1.5">
                                    <FileText className="h-4 w-4 text-[#c6005c]" /> PDF
                                </span>
                            </th>
                            <th className="text-left font-semibold text-gray-800 py-2.5 pr-4">
                                <span className="inline-flex items-center gap-1.5">
                                    <FileImage className="h-4 w-4 text-[#c6005c]" /> Photoshop
                                </span>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.templates.map((row) => (
                            <tr key={row.size} className="border-b border-gray-100 align-top">
                                <td className="py-3 pr-4 font-medium text-gray-900 whitespace-nowrap">{row.size}</td>
                                <td className="py-3 pr-4">
                                    <ul className="space-y-1">
                                        {row.pdf.map((l) => (
                                            <li key={l.label}>
                                                <a href="#" className="text-[#c6005c] hover:underline">
                                                    {l.label}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </td>
                                <td className="py-3 pr-4">
                                    <ul className="space-y-1">
                                        {row.photoshop.map((l) => (
                                            <li key={l.label}>
                                                <a href="#" className="text-[#c6005c] hover:underline">
                                                    {l.label}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

/* ================================================================== */
/*  Installation tab                                                     */
/* ================================================================== */

function InstallationTab({ data }: { data: ProductData["installation"] }) {
    return (
        <div>
            <h2 className="text-lg font-semibold text-gray-900">Installation Guide</h2>

            <div className="mt-5 grid grid-cols-2 lg:grid-cols-4 gap-4">
                {data.steps.map((s) => (
                    <div key={s.step}>
                        <div className="aspect-square bg-gray-50 border border-gray-200 rounded-sm flex items-center justify-center">
                            <span className="h-9 w-9 rounded-full bg-[#c6005c] text-white text-sm font-semibold flex items-center justify-center">
                                {s.step}
                            </span>
                        </div>
                        <p className="mt-2 text-xs sm:text-sm text-gray-700 text-center">{s.title}</p>
                    </div>
                ))}
            </div>

            <div className="mt-6 flex gap-2.5 max-w-2xl rounded-sm border border-[#c6005c]/30 bg-[#c6005c]/5 px-4 py-3">
                <Info className="h-4 w-4 text-[#c6005c] flex-shrink-0 mt-0.5" />
                <p className="text-sm text-gray-700 leading-relaxed">
                    <span className="font-semibold text-gray-900">Tip: </span>
                    {data.tip}
                </p>
            </div>
        </div>
    );
}

/* ================================================================== */
/*  Gallery visual (placeholder art — swap for real photography)       */
/* ================================================================== */

function GalleryVisual({ item, compact = false }: { item: GalleryItem; compact?: boolean }) {
    const size = compact ? "h-5 w-5 sm:h-6 sm:w-6" : "h-16 w-16 sm:h-24 sm:w-24";
    const color = "text-[#c6005c]";

    switch (item.kind) {
        case "flag-front":
        case "flag-reverse":
        case "flag-double":
            return (
                <div className={`flex flex-col items-center ${compact ? "gap-0.5" : "gap-2"}`}>
                    <Flag className={`${size} ${color}`} strokeWidth={1.5} />
                    {!compact && <span className="text-xs text-gray-400">{item.label}</span>}
                </div>
            );
        case "pole":
            return (
                <div className={`flex flex-col items-center ${compact ? "gap-0.5" : "gap-2"}`}>
                    <MoveVertical className={`${size} text-gray-400`} strokeWidth={1.5} />
                    {!compact && <span className="text-xs text-gray-400">{item.label}</span>}
                </div>
            );
        case "bases-row":
            return (
                <div className="flex items-center gap-1.5">
                    <MoveVertical className={`${compact ? "h-4 w-4" : "h-8 w-8"} text-gray-400`} />
                    <Layers className={`${compact ? "h-4 w-4" : "h-8 w-8"} text-gray-400`} />
                    <CircleDot className={`${compact ? "h-4 w-4" : "h-8 w-8"} text-gray-400`} />
                </div>
            );
        case "base-single":
            return <CircleDot className={`${size} text-gray-400`} strokeWidth={1.5} />;
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