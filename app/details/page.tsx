"use client";

/**
 * Feather Angled Flag — Product Detail Page
 * -------------------------------------------------------------
 * Stack: React + TypeScript + Tailwind CSS
 *
 * LEFT column (gallery, thumbnails, feature grid) is UNCHANGED.
 * RIGHT column (buy box) has been rebuilt to match the reference
 * layout: eyebrow label, title, description, checklist, "What's
 * included" package buttons, Size cards, Graphic radio cards, a
 * Base dropdown, and a Carry Bag toggle switch. No Add to Cart /
 * quantity / price UI — selection state only.
 *
 * Everything renders from a single typed `PRODUCT` data object (see the
 * `ProductData` interface below) — swap `PRODUCT` for your live JSON/API
 * response and the UI updates automatically.
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

import { useState } from "react";
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
    Ruler,
    Home,
    Droplet,
    Wrench,
    Briefcase,
    Check,
} from "lucide-react";

/* ================================================================== */
/*  Data model                                                          */
/* ================================================================== */

type SizeId = "small" | "medium" | "large" | "xlarge";
type GraphicId = "single" | "single-reverse" | "double";
type BaseId = "stake" | "cross" | "water" | "square";
type PackageId = "flag-pole" | "flag-only";
type TabId = "description" | "spec" | "file-setup" | "installation";

interface SizeSpec {
    id: SizeId;
    label: string;
    assembledHeight: string;
    graphicSize: string;
    flagWeight: string;
    flagWithPoleWeight: string;
    poleSetPieces: string;
    heightFt: number; // numeric, for the scale diagram
    price: number; // baseline price: Flag+Pole / Single Sided / Ground Stake / No bag
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

/* ================================================================== */
/*  Sample data — replace with your live JSON / API response            */
/* ================================================================== */

const PRODUCT: ProductData = {
    eyebrow: "Advertising Flags",
    name: "Feather Angled Flag",
    shortDescription:
        "A tall, curved-top flag that leans into the wind instead of fighting it. Built from 4 oz dye-sublimated polyester mesh on an aluminum-and-fiberglass pole set, it's equally at home outside a storefront or anchoring a trade show booth.",
    gallery: [
        { id: "img-1", label: "Front", kind: "flag-front" },
        { id: "img-2", label: "Reverse", kind: "flag-reverse" },
        { id: "img-3", label: "Double Sided", kind: "flag-double" },
        { id: "img-4", label: "In Place", kind: "flag-front" },
        { id: "img-5", label: "In Place", kind: "flag-front" },
    ],
    bullets: [
        "Indoor and outdoor use",
        "Single-sided or double-sided printing",
        "4 oz dye-sublimated polyester mesh, washable",
        "Tool-free interlocking aluminum & fiberglass pole set",
        "Ground, cross, and square base options",
        "one more bullet to test wrapping and see how it looks in the grid layout",
    ],
    packages: [
        { id: "flag-pole", label: "Flag + Pole Set", priceAdjustment: 0 },
        { id: "flag-only", label: "Flag Only", priceAdjustment: -15 },
    ],
    sizes: [
        {
            id: "small",
            label: "Small",
            assembledHeight: "9'",
            graphicSize: '23.5" x 78.5"',
            flagWeight: "0.8 lbs",
            flagWithPoleWeight: "1.14 lbs",
            poleSetPieces: "4 pc",
            heightFt: 9,
            price: 79.99,
        },
        {
            id: "medium",
            label: "Medium",
            assembledHeight: "10.5'",
            graphicSize: '24" x 104"',
            flagWeight: "1.1 lbs",
            flagWithPoleWeight: "1.4 lbs",
            poleSetPieces: "4 pc",
            heightFt: 10.5,
            price: 89.99,
        },
        {
            id: "large",
            label: "Large",
            assembledHeight: "14'",
            graphicSize: '28" x 138"',
            flagWeight: "1.3 lbs",
            flagWithPoleWeight: "1.79 lbs",
            poleSetPieces: "4 pc",
            heightFt: 14,
            price: 104.93,
        },
        {
            id: "xlarge",
            label: "X-Large",
            assembledHeight: "18'",
            graphicSize: '24" x 183.5"',
            flagWeight: "1.5 lbs",
            flagWithPoleWeight: "2.43 lbs",
            poleSetPieces: "5 pc",
            heightFt: 18,
            price: 129.99,
        },
    ],
    graphics: [
        {
            id: "single",
            label: "Single-Sided",
            description: "Sleeve sits left of the graphic. Front reads bright, back shows a softer mirrored version.",
            upcharge: 0,
        },
        {
            id: "single-reverse",
            label: "Single-Sided Reverse",
            description: "Same print-through fabric, sleeve sits on the right instead of the left.",
            upcharge: 0,
        },
        {
            id: "double",
            label: "Double-Sided",
            description: "Two graphics sewn back to back around a blockout liner, so both sides read crisp.",
            upcharge: 25,
        },
    ],
    bases: [
        {
            id: "stake",
            label: "Ground Stake",
            material: "Aluminum",
            weight: "3.6 lbs",
            use: ["Outdoor soft ground", "Ball bearing allows flag to swivel in wind"],
            upcharge: 0,
        },
        {
            id: "cross",
            label: "Cross Base",
            material: "Aluminum",
            weight: "6.73 lbs",
            use: ["Indoor/Outdoor hard surface"],
            upcharge: 15,
        },
        {
            id: "water",
            label: "Water bag",
            material: "Plastic",
            weight: "3 lbs empty",
            use: ["Use with cross base for extra weight"],
            upcharge: 20,
        },
        {
            id: "square",
            label: "Square Base",
            material: "Steel",
            weight: "21.83 lbs",
            use: ["Indoor/Outdoor hard surface"],
            upcharge: 45,
        },
    ],
    carryBag: {
        label: "Carry Bag",
        weightSmallMedium: "1.41 lbs",
        weightLargeXLarge: "1.63 lbs",
        price: 12,
    },
    description: {
        intro:
            "Feather Angled Flags tower over the competition—take advertising to new heights with these full color skyscrapers. With several base options they can be displayed indoors and outdoors.",
        printInfo:
            'Our mesh flag polyester is direct printed and then sublimated. This creates "Print thru" for single sided flags; full color and vibrant on the front - muted and mirrored but legible when viewed from the back.',
        graphicTypes: [
            {
                label: "Single sided Print Thru",
                detail: "flag graphic with black nylon pole sleeve to the left of the print when viewed from the front",
            },
            {
                label: "Single sided Print Thru Reverse",
                detail: "flag graphic with black nylon pole sleeve to the right of the print when viewed from the front",
            },
            {
                label: "Double Sided",
                detail: "separate flag graphics are sewn back to back with a silver block out layer in between",
            },
        ],
        baseInfo:
            "The standard ground stake can be used to install in soft ground, while the cross base or square base are heavy duty for hard surface staging. The optional carry bag is great for when you plan to travel with or store your flag.",
        applicationsLabel: "Applications",
        applications: "Suitable for both indoor and outdoor settings, ideal for storefronts, tradeshows, outdoor events, and festivals.",
    },
    materialSpec: {
        printMethod: "Dye Sublimated",
        graphicMaterial: "4 oz Polyester mesh flag",
        washable: "Yes",
    },
    fileSetup: {
        requirements: [
            "Accepted File Formats: JPEG or PDF (single page only)",
            "Color Space: CMYK",
            "Resolution: 150dpi (More than enough for large format)",
            "Max File Upload Size: 300MB",
            "Submit artwork built to ordered size - Scaled artwork will automatically be detected and fit to order",
            "Do not include crop marks or bleeds",
            "Double sided products will be uploaded as two separate files unless otherwise specified in the artwork template",
        ],
        tips: [
            "Do not submit with Pantones/Spot Colors - Convert to CMYK",
            "Convert live fonts to outlines",
            "Use provided design templates when available",
        ],
        templates: [
            {
                size: "X-Large",
                pdf: [{ label: "Single Sided Print Thru" }, { label: "Single Sided Print Thru Reverse" }, { label: "Double Sided" }],
                photoshop: [{ label: "Single Sided Print Thru" }, { label: "Single Sided Print Thru Reverse" }, { label: "Double Sided" }],
            },
            {
                size: "Large",
                pdf: [{ label: "Single Sided Print Thru" }, { label: "Single Sided Print Thru Reverse" }, { label: "Double Sided" }],
                photoshop: [{ label: "Single Sided Print Thru" }, { label: "Single Sided Print Thru Reverse" }, { label: "Double Sided" }],
            },
            {
                size: "Medium",
                pdf: [{ label: "Single Sided Print Thru" }, { label: "Single Sided Print Thru Reverse" }, { label: "Double Sided" }],
                photoshop: [{ label: "Single Sided Print Thru" }, { label: "Single Sided Print Thru Reverse" }, { label: "Double Sided" }],
            },
            {
                size: "Small",
                pdf: [{ label: "Single Sided Print Thru" }, { label: "Single Sided Print Thru Reverse" }, { label: "Double Sided" }],
                photoshop: [{ label: "Single Sided Print Thru" }, { label: "Single Sided Print Thru Reverse" }, { label: "Double Sided" }],
            },
        ],
    },
    installation: {
        steps: [
            { step: 1, title: "Position the pole set." },
            { step: 2, title: "Connect the poles." },
            { step: 3, title: "Slide flag onto the pole." },
            { step: 4, title: "Secure flag down the pole." },
        ],
        tip: "If the flag appears wrinkled or loose after setup, please ensure the elastic cord at the bottom is pulled tight. A firm tension will help the flag stay smooth and properly displayed.",
    },
};

const carryBagOptions = [
    {
        value: "none",
        label: "No Carry Bag",
    },
    {
        value: "carry",
        label: "Carry Bag (+$12)",
    },
];

/* ================================================================== */
/*  Component                                                            */
/* ================================================================== */

export default function ProductDetailPage({ product = PRODUCT }: { product?: ProductData }) {
    const [activeImageId, setActiveImageId] = useState(product.gallery[0].id);
    const [packageId, setPackageId] = useState<PackageId>("flag-pole");
    const [sizeId, setSizeId] = useState<SizeId>("large");
    const [graphicId, setGraphicId] = useState<GraphicId>("single");
    const [baseId, setBaseId] = useState<BaseId>("stake");
    const [carryBag, setCarryBag] = useState("none");
    const [activeTab, setActiveTab] = useState<TabId>("description");

    const activeImage = product.gallery.find((g) => g.id === activeImageId) ?? product.gallery[0];
    const selectedSize = product.sizes.find((s) => s.id === sizeId)!;

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
                    {/* LEFT — Gallery (unchanged)                           */}
                    {/* -------------------------------------------------- */}
                    <div className="lg:col-span-7">
                        <div className="relative aspect-[4/5] sm:aspect-[16/11] lg:aspect-[16/12] w-full bg-gray-50 border border-gray-200 rounded-sm flex items-center justify-center overflow-hidden">
                            <GalleryVisual item={activeImage} />
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
                    {/* RIGHT — Buy box (redesigned)                         */}
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
                            <div>
                                <div className="space-y-2">
                                    {/* Graphic Dropdown */}
                                    <FieldSelect
                                        icon={<FileImage className="h-3.5 w-3.5" />}
                                        label="Graphic"
                                        value={graphicId}
                                        onChange={(value) => setGraphicId(value as GraphicId)}
                                        options={product.graphics.map((graphic) => ({
                                            value: graphic.id,
                                            label: graphic.upcharge > 0 ? `${graphic.label} (+$${graphic.upcharge})` : graphic.label,
                                        }))}
                                    />                                   
                                </div>
                            </div>

                            {/* ========================= */}
                            {/* Base Dropdown */}
                            {/* ========================= */}

                            <FieldSelect
                                icon={<CircleDot className="h-3.5 w-3.5" />}
                                label="Base"
                                value={baseId}
                                onChange={(value) => setBaseId(value as BaseId)}
                                options={[
                                    {
                                        value: "stake",
                                        label: "Ground Stake",
                                    },
                                    {
                                        value: "cross",
                                        label: "Cross Base",
                                    },
                                    {
                                        value: "cross-ground",
                                        label: "Cross Base + Ground Stake",
                                    },
                                    {
                                        value: "cross-water",
                                        label: "Cross Base + Water Bag",
                                    },
                                    {
                                        value: "square",
                                        label: "Square Base",
                                    },
                                ]}
                            />

                            {/* ========================= */}
                            {/* Carry Bag Dropdown */}
                            {/* ========================= */}

                            <FieldSelect
                                icon={<Briefcase className="h-3.5 w-3.5" />}
                                label="Carry Bag"
                                value={carryBag}
                                onChange={(value) => setCarryBag(value)}
                                options={[
                                    {
                                        value: "none",
                                        label: "No Carry Bag",
                                    },
                                    {
                                        value: "carry",
                                        label: "Carry Bag (+$12)",
                                    },
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
/*  Buy box helpers: field select, toggle switch, feature grid          */
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
    options: { value: string; label: string }[];
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
                        <option
                            key={option.value}
                            value={option.value}
                        >
                            {option.label}
                        </option>
                    ))}
                </select>

                <ChevronDown className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
        </div>
    );
}



function ToggleSwitch({
    checked,
    onChange,
    label,
}: {
    checked: boolean;
    onChange: (value: boolean) => void;
    label: string;
}) {
    return (
        <button
            type="button"
            role="switch"
            aria-checked={checked}
            aria-label={label}
            onClick={() => onChange(!checked)}
            className={`relative inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full transition-colors ${checked ? "bg-[#c6005c]" : "bg-gray-300"
                }`}
        >
            <span
                className={`inline-block h-4.5 w-4.5 transform rounded-full bg-white shadow transition-transform ${checked ? "translate-x-6" : "translate-x-1"
                    }`}
                style={{ height: 18, width: 18 }}
            />
        </button>
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
                    <li key={g.label} className="text-sm sm:text-[15px] leading-relaxed text-gray-700 flex gap-2">
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