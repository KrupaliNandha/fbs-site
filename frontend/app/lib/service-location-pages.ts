import type { Metadata } from "next";
import locationPagesData from "@/app/data/location-pages.json";
import {
  absoluteUrl,
  buildAreaServedSchema,
  buildBreadcrumbSchema,
  buildFaqSchema,
  organizationId,
  siteConfig,
  toAbsoluteImageUrl,
  type PublicPagePath,
  websiteId,
} from "@/app/lib/seo";

type LocationMarket = {
  slug: string;
  city: string;
  state: string;
  stateCode: string;
  heroBadge: string;
  marketSummary: string;
  nearbyAreas: string[];
  businessNeeds: string[];
  ctaNote: string;
  updatedAt: string;
};

type ServiceCard = {
  title: string;
  description: string;
  image: string;
};

type ServiceBenefit = {
  title: string;
  description: string;
};

type ServiceFaq = {
  question: string;
  answer: string;
};

type ServiceTemplate = {
  slug: string;
  name: string;
  routeLabel: string;
  basePath: PublicPagePath;
  badgeLabel: string;
  image: string;
  heroImages: [string, string, string];
  keywords: string[];
  highlights: ServiceCard[];
  benefits: ServiceBenefit[];
  metaDescription: (location: LocationMarket) => string;
  heroDescription: (location: LocationMarket) => string;
  supportTitle: (location: LocationMarket) => string;
  supportDescription: (location: LocationMarket) => string;
  highlightsTitle: (location: LocationMarket) => string;
  benefitsTitle: (location: LocationMarket) => string;
  ctaTitle: (location: LocationMarket) => string;
  ctaDescription: (location: LocationMarket) => string;
  faqs: (location: LocationMarket) => ServiceFaq[];
};

type SerializedService = {
  slug: string;
  name: string;
  routeLabel: string;
  basePath: PublicPagePath;
  badgeLabel: string;
  image: string;
  heroImages: [string, string, string];
  keywords: string[];
  highlights: ServiceCard[];
  benefits: ServiceBenefit[];
};

export type RelatedServiceLink = {
  title: string;
  description: string;
  image: string;
  href: string;
};

export type ServiceLocationPage = {
  slug: string;
  path: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  heroTitle: string;
  heroBadge: string;
  heroDescription: string;
  supportTitle: string;
  supportDescription: string;
  highlightsTitle: string;
  benefitsTitle: string;
  ctaTitle: string;
  ctaDescription: string;
  faqs: ServiceFaq[];
  location: LocationMarket;
  service: SerializedService;
};

const locationMarkets = locationPagesData as LocationMarket[];

const serviceTemplates: ServiceTemplate[] = [
  {
    slug: "printing-products",
    name: "Printing Products",
    routeLabel: "Printing Products",
    basePath: "/services/printing-products",
    badgeLabel: "Printing Services",
    image: "/images/services/printing/hotel-menu-printing.webp",
    heroImages: [
      "/images/shared/printing-materials-showcase.webp",
      "/images/services/printing/hotel-menu-printing.webp",
      "/images/services/printing/custom-calendar-printing.webp",
    ],
    keywords: [
      "printing products",
      "business card printing",
      "brochure printing",
      "banner printing",
      "menu printing",
    ],
    highlights: [
      {
        title: "Business Cards and Handouts",
        description:
          "Sharp everyday print materials built for networking, events, sales meetings, and front-desk distribution.",
        image: "/images/services/printing/printing-products-service.webp",
      },
      {
        title: "Brochures and Flyers",
        description:
          "Marketing pieces designed for promotions, launches, and local awareness campaigns with repeat-order flexibility.",
        image: "/images/shared/printing-materials-showcase.webp",
      },
      {
        title: "Menus and Sales Sheets",
        description:
          "Practical branded print layouts for restaurants, service businesses, and in-person customer communication.",
        image: "/images/services/printing/hotel-menu-printing.webp",
      },
      {
        title: "Banners and Event Print",
        description:
          "Large-format print options that help promotions, pop-ups, trade events, and storefront campaigns stand out.",
        image: "/images/services/signage/signage-service.webp",
      },
    ],
    benefits: [
      {
        title: "Fast repeat ordering",
        description:
          "Useful when your team needs consistent print materials across multiple campaigns or locations.",
      },
      {
        title: "Brand consistency",
        description:
          "Color, layout, and format stay aligned across your cards, menus, brochures, and promotional pieces.",
      },
      {
        title: "Format guidance",
        description:
          "We help match the right print format to the promotion, audience, and distribution method.",
      },
      {
        title: "Campaign-ready production",
        description:
          "Print materials are planned around real business use, not just one-off design files.",
      },
    ],
    metaDescription: (location) =>
      `FBS Prints provides printing products in ${location.city}, ${location.stateCode} including business cards, brochures, flyers, menus, banners, and branded print materials built for local campaigns and repeat ordering.`,
    heroDescription: (location) =>
      `FBS Prints helps ${location.city} businesses produce polished print materials for promotions, sales collateral, menus, handouts, and brand visibility with dependable communication and practical turnaround.`,
    supportTitle: (location) => `Reliable printing for ${location.city} campaigns`,
    supportDescription: (location) =>
      `From storefront promotions to sales collateral and event handouts, we help businesses across ${location.city} order print materials that match brand standards and stay ready for repeat use.`,
    highlightsTitle: (location) =>
      `Popular print products for ${location.city} businesses`,
    benefitsTitle: (location) =>
      `Why ${location.city} businesses use our print workflow`,
    ctaTitle: (location) => `Need printing products in ${location.city}?`,
    ctaDescription: (location) =>
      `Share the format, quantity, and deadline you are working with. We will help you choose the right print solution for your ${location.city} campaign.`,
    faqs: (location) => [
      {
        question: `What printing products can businesses order in ${location.city}?`,
        answer:
          "We can support common business print needs such as business cards, brochures, flyers, menus, banners, and other branded materials used for sales, promotions, and daily operations.",
      },
      {
        question: `Can you help ${location.city} businesses keep print materials consistent across repeat orders?`,
        answer:
          "Yes. We can work from approved layouts and brand standards so future print runs stay aligned with the same visual direction and messaging.",
      },
      {
        question: `Do you handle printing for local promotions and events?`,
        answer:
          "Yes. We regularly support campaigns that need handouts, banners, menus, or other printed materials tied to a launch, event, or seasonal promotion.",
      },
      {
        question: `How do I request a printing quote in ${location.city}?`,
        answer:
          "Send the project type, quantity, timing, and any artwork or goals you already have. We can then recommend the next practical step.",
      },
    ],
  },
  {
    slug: "signage",
    name: "Signage",
    routeLabel: "Signage Services",
    basePath: "/services/signage",
    badgeLabel: "Signage Services",
    image: "/images/services/signage/signage-services-hero.webp",
    heroImages: [
      "/images/services/signage/yard-sign-marketing.webp",
      "/images/services/signage/custom-neon-signage.webp",
      "/images/services/signage/led-signage.webp",
    ],
    keywords: [
      "signage services",
      "business signs",
      "window graphics",
      "vehicle wraps",
      "monument signs",
      "tradeshow signs",
      "trade show signage",
      "booth signage",
      "sign cabinet",
      "illuminated cabinet signs",
      "dimensional lobby signs",
      "interior dimensional signs",
      "bulk signage printing",
    ],
    highlights: [
      {
        title: "Storefront Signage",
        description:
          "Visible signage built to improve first impressions and help local customers identify your business quickly.",
        image: "/images/services/signage/signage-service.webp",
      },
      {
        title: "Window Graphics and Lettering",
        description:
          "Branded graphics that turn glass frontage into useful promotional and directional space.",
        image: "/images/services/signage/window-graphics-example.webp",
      },
      {
        title: "Vehicle Graphics and Wraps",
        description:
          "Mobile branding for service vehicles, fleets, and business owners who need visibility beyond the storefront.",
        image: "/images/services/signage/car-wrap-signage.webp",
      },
      {
        title: "Event and Display Signage",
        description:
          "Banners, stands, and display pieces that support launches, promotions, and high-traffic local events.",
        image: "/images/services/direct-mail/direct-mail-service.webp",
      },
    ],
    benefits: [
      {
        title: "Higher local visibility",
        description:
          "Strong signage helps customers notice the business, understand the offer, and find the right entrance or service point.",
      },
      {
        title: "Consistent brand presentation",
        description:
          "Your exterior, interior, and promotional signage can all follow the same branded direction.",
      },
      {
        title: "Support for multiple sign types",
        description:
          "Useful when you need more than one format for the same location, promotion, or service line.",
      },
      {
        title: "Practical planning",
        description:
          "We help match the right sign type to visibility, placement, and campaign goals instead of treating every sign the same.",
      },
    ],
    metaDescription: (location) =>
      `FBS Prints provides signage services in ${location.city}, ${location.stateCode} including tradeshow signs, booth signage, illuminated cabinet signs, dimensional lobby signs, storefront signs, window graphics, vehicle graphics, and branded display materials built for stronger local visibility.`,
    heroDescription: (location) =>
      `FBS Prints helps ${location.city} businesses improve visibility with custom signage for storefronts, promotions, events, vehicles, and branded in-person customer experiences.`,
    supportTitle: (location) => `Signage support for ${location.city} visibility`,
    supportDescription: (location) =>
      `Whether you need storefront graphics, directional signage, event displays, or branded promotional visuals, we help ${location.city} businesses choose formats that improve visibility and presentation.`,
    highlightsTitle: (location) =>
      `Popular signage services for ${location.city} businesses`,
    benefitsTitle: (location) =>
      `Why ${location.city} businesses invest in better signage`,
    ctaTitle: (location) => `Need signage help in ${location.city}?`,
    ctaDescription: (location) =>
      `Tell us what customers need to see, where the sign will be used, and what outcome you want. We will help map the right signage approach for ${location.city}.`,
    faqs: (location) => [
      {
        question: `What types of signage can you provide in ${location.city}?`,
        answer:
          "We can support a range of business signage needs including storefront graphics, window lettering, banners, vehicle graphics, display signage, and other branded visual materials.",
      },
      {
        question: `Can you help with signs for promotions and events?`,
        answer:
          "Yes. We can help plan signage that supports seasonal offers, launches, trade events, pop-ups, and local promotional campaigns.",
      },
      {
        question: `Do you handle more than one sign format for the same business?`,
        answer:
          "Yes. Many clients use a mix of storefront, window, display, and vehicle signage so their branding stays consistent across customer touchpoints.",
      },
      {
        question: `How do I request signage pricing in ${location.city}?`,
        answer:
          "Send the type of sign, intended use, approximate size, and timeline. We can then recommend the next step and a suitable direction.",
      },
    ],
  },
  {
    slug: "direct-mail-services",
    name: "Direct Mail Services",
    routeLabel: "Direct Mail Services",
    basePath: "/services/direct-mailing",
    badgeLabel: "Direct Mail Services",
    image: "/images/services/direct-mail/direct-mail-marketing.webp",
    heroImages: [
      "/images/services/direct-mail/direct-mail-marketing.webp",
      "/images/services/direct-mail/mailing-documentation.webp",
      "/images/services/direct-mail/print-design-example.webp",
    ],
    keywords: [
      "direct mail services",
      "mail campaign printing",
      "postcard mailing",
      "route targeting",
      "EDDM marketing",
      "print mailing service",
      "print and mail service",
    ],
    highlights: [
      {
        title: "Design and Print Coordination",
        description:
          "Mail pieces are planned as part of one workflow so messaging, design, and print production stay aligned.",
        image: "/images/services/direct-mail/direct-mail-service.webp",
      },
      {
        title: "Route-Based Campaign Support",
        description:
          "Useful when you want to reach neighborhoods, service areas, or defined delivery zones with a focused offer.",
        image: "/images/services/direct-mail/direct-mail-marketing.webp",
      },
      {
        title: "Mail Preparation Workflow",
        description:
          "Bundling, paperwork, and preparation steps are organized so the campaign is ready for the mailing process.",
        image: "/images/services/direct-mail/mailing-documentation.webp",
      },
      {
        title: "Promotional Mailers and Inserts",
        description:
          "Cards, flyers, and campaign pieces built to support outreach, retention, and local offer visibility.",
        image: "/images/services/direct-mail/print-design-example.webp",
      },
    ],
    benefits: [
      {
        title: "One partner for design, print, and mailing prep",
        description:
          "This reduces the friction that often happens when several vendors are involved in one campaign.",
      },
      {
        title: "Better local targeting",
        description:
          "Campaigns can be planned around neighborhoods, service zones, and practical local delivery goals.",
      },
      {
        title: "Repeatable outreach",
        description:
          "Useful for recurring promotions, service reminders, seasonal offers, and route-based acquisition.",
      },
      {
        title: "Clear campaign execution",
        description:
          "We help organize the print and mailing process so the outreach is easier to manage from start to finish.",
      },
    ],
    metaDescription: (location) =>
      `FBS Prints provides direct mail and print mailing services in ${location.city}, ${location.stateCode} including design, print production, bundling, route support, and mailer preparation for local outreach campaigns.`,
    heroDescription: (location) =>
      `FBS Prints helps ${location.city} businesses run direct mail campaigns with design support, print production, route planning, and mail-ready preparation for consistent local outreach.`,
    supportTitle: (location) =>
      `Direct mail support for ${location.city} outreach`,
    supportDescription: (location) =>
      `From offer design and print production to bundling and route preparation, we help ${location.city} businesses turn local mail campaigns into a manageable workflow.`,
    highlightsTitle: (location) =>
      `Popular direct mail support for ${location.city} businesses`,
    benefitsTitle: (location) =>
      `Why ${location.city} businesses use direct mail`,
    ctaTitle: (location) =>
      `Planning a direct mail campaign in ${location.city}?`,
    ctaDescription: (location) =>
      `Send the offer, target area, and campaign timing you are working with. We will help map the right print and mail workflow for ${location.city}.`,
    faqs: (location) => [
      {
        question: `What direct mail help do you offer in ${location.city}?`,
        answer:
          "We can support design, print production, route planning, bundling, and the preparation steps needed to move a local mail campaign forward.",
      },
      {
        question: `Can you help target neighborhoods or service areas?`,
        answer:
          "Yes. We can support campaigns that need route-based or area-based planning depending on the offer and delivery strategy.",
      },
      {
        question: `Do you only print the mailers, or help with the full workflow?`,
        answer:
          "We can help with more than printing. Many clients use us for a broader direct mail workflow so the campaign is easier to coordinate.",
      },
      {
        question: `How do I request direct mail pricing in ${location.city}?`,
        answer:
          "Share the campaign type, approximate quantity, target area, and timeline. We can then recommend the next practical step.",
      },
    ],
  },
  {
    slug: "web-design",
    name: "Web Design",
    routeLabel: "Web Design Services",
    basePath: "/services/web-design",
    badgeLabel: "Web Design Services",
    image: "/images/services/web-design/business-website-design.webp",
    heroImages: [
      "/images/services/web-design/business-growth-illustration.webp",
      "/images/services/web-design/business-website-design.webp",
      "/images/services/web-design/creative-web-design.webp",
    ],
    keywords: [
      "web design services",
      "business website design",
      "responsive websites",
      "lead generation website",
      "local business website",
    ],
    highlights: [
      {
        title: "Responsive Business Websites",
        description:
          "Sites built to look polished and work clearly across mobile, tablet, and desktop devices.",
        image: "/images/services/web-design/business-website-design.webp",
      },
      {
        title: "Service and Lead Pages",
        description:
          "Conversion-focused page structures that make it easier for visitors to understand the offer and take the next step.",
        image: "/images/services/web-design/portfolio-website-example.webp",
      },
      {
        title: "Brand-Led Visual Direction",
        description:
          "Layouts and content blocks that align the website with the same look and message used in print and signage.",
        image: "/images/services/web-design/ecommerce-website-example.webp",
      },
      {
        title: "Growth-Oriented Structure",
        description:
          "Web builds planned around future content, service expansion, and stronger local search performance.",
        image: "/images/services/web-design/shopify-website-example.webp",
      },
    ],
    benefits: [
      {
        title: "Stronger first impression",
        description:
          "A better website gives local prospects a cleaner, more credible path from visit to inquiry.",
      },
      {
        title: "Mobile-ready experience",
        description:
          "Responsive layouts matter when customers discover the business on phones and compare options quickly.",
      },
      {
        title: "Better conversion flow",
        description:
          "Clear page structure helps visitors understand services, trust the offer, and reach out faster.",
      },
      {
        title: "Aligned offline and online branding",
        description:
          "Your website can reinforce the same identity customers already see in printed and physical materials.",
      },
    ],
    metaDescription: (location) =>
      `FBS Prints provides web design services in ${location.city}, ${location.stateCode} with responsive business websites, service pages, and conversion-focused layouts built for stronger local visibility.`,
    heroDescription: (location) =>
      `FBS Prints helps ${location.city} businesses improve their online presence with responsive web design, clearer service messaging, and page structures built to turn visitors into leads.`,
    supportTitle: (location) =>
      `Web design support for ${location.city} growth`,
    supportDescription: (location) =>
      `Whether your site needs a stronger first impression, better service pages, or clearer contact flow, we help ${location.city} businesses build websites that support real business goals.`,
    highlightsTitle: (location) =>
      `Popular web design work for ${location.city} businesses`,
    benefitsTitle: (location) =>
      `Why ${location.city} businesses upgrade their websites`,
    ctaTitle: (location) => `Need web design help in ${location.city}?`,
    ctaDescription: (location) =>
      `Share the current site, the services you want to highlight, and the type of leads you want to attract. We will help shape the right web direction for ${location.city}.`,
    faqs: (location) => [
      {
        question: `What type of websites do you build for ${location.city} businesses?`,
        answer:
          "We focus on business websites that need stronger service presentation, responsive layouts, and a clearer path from visitor to inquiry.",
      },
      {
        question: `Can you help improve an existing website instead of replacing it?`,
        answer:
          "Yes. Depending on the site and the goals, we can help improve structure, messaging, layout, and conversion flow without treating every project as a full rebuild.",
      },
      {
        question: `Will the website work with local SEO efforts?`,
        answer:
          "Yes. Stronger web structure, clearer service pages, and better content organization support local SEO and make future optimization easier.",
      },
      {
        question: `How do I request a web design quote in ${location.city}?`,
        answer:
          "Send the current website if you have one, the services you want to promote, and the business goals you want the site to support.",
      },
    ],
  },
  {
    slug: "seo-services",
    name: "SEO Services",
    routeLabel: "SEO Services",
    basePath: "/services/seo",
    badgeLabel: "SEO Services",
    image: "/images/services/seo/seo-services-hero.webp",
    heroImages: [
      "/images/services/direct-mail/direct-mail-marketing.webp",
      "/images/services/seo/seo-services-hero.webp",
      "/images/shared/printing-materials-showcase.webp",
    ],
    keywords: [
      "seo services",
      "local seo",
      "technical seo",
      "on-page seo",
      "seo audit",
      "local seo company",
      "online advertising",
      "digital marketing services",
    ],
    highlights: [
      {
        title: "Technical SEO",
        description:
          "Indexing, crawlability, metadata, and page-level clarity that help search engines understand the site correctly.",
        image: "/icons/technical-seo.png",
      },
      {
        title: "On-Page Optimization",
        description:
          "Clearer page targeting, stronger headings, better copy structure, and improved service relevance.",
        image: "/icons/on-page-optimization.png",
      },
      {
        title: "Local SEO Support",
        description:
          "Location-aware targeting, local intent content, and cleaner signals that support visibility in relevant service areas.",
        image: "/icons/local-seo.png",
      },
      {
        title: "Tracking and Reporting",
        description:
          "Monitoring rankings, crawl behavior, and site changes so SEO decisions stay tied to measurable progress.",
        image: "/icons/tracking-reporting.png",
      },
    ],
    benefits: [
      {
        title: "Better search clarity",
        description:
          "SEO improvements help search engines connect the right pages with the right service intent.",
      },
      {
        title: "Stronger local relevance",
        description:
          "Location-aware optimization helps your site compete more effectively for local searches and service queries.",
      },
      {
        title: "Technical cleanup",
        description:
          "Indexing issues, metadata gaps, and inconsistent signals can be fixed before they limit performance further.",
      },
      {
        title: "Longer-term content structure",
        description:
          "SEO planning gives the site a clearer framework for future service pages, content updates, and local targeting.",
      },
    ],
    metaDescription: (location) =>
      `FBS Prints provides SEO services and online advertising support in ${location.city}, ${location.stateCode} including local SEO, technical SEO, on-page optimization, and reporting built for stronger search visibility.`,
    heroDescription: (location) =>
      `FBS Prints helps ${location.city} businesses improve search visibility with technical SEO, on-page updates, local SEO support, and clearer site structure built for steady organic growth.`,
    supportTitle: (location) =>
      `SEO support for ${location.city} search visibility`,
    supportDescription: (location) =>
      `From technical cleanup and metadata improvement to local targeting and on-page strategy, we help ${location.city} businesses strengthen the search signals that matter most.`,
    highlightsTitle: (location) =>
      `Popular SEO work for ${location.city} businesses`,
    benefitsTitle: (location) =>
      `Why ${location.city} businesses invest in SEO`,
    ctaTitle: (location) => `Need SEO help in ${location.city}?`,
    ctaDescription: (location) =>
      `Share the current site, the services you want to rank for, and where visibility is weak. We will help outline the right SEO priorities for ${location.city}.`,
    faqs: (location) => [
      {
        question: `What SEO work do you provide for ${location.city} businesses?`,
        answer:
          "We can help with technical SEO, on-page updates, local SEO support, metadata cleanup, page targeting, and reporting depending on the current state of the site.",
      },
      {
        question: `Can SEO help if the site already has service pages?`,
        answer:
          "Yes. Existing pages often still need stronger metadata, clearer headings, better internal links, and cleaner local signals before they perform well.",
      },
      {
        question: `Do you support local SEO for service-area businesses?`,
        answer:
          "Yes. We can help structure local targeting more clearly so search engines understand which services and locations the business is trying to compete in.",
      },
      {
        question: `How do I request SEO support in ${location.city}?`,
        answer:
          "Send the website, the services you want to grow, and the locations you care about most. We can then review the strongest next priorities.",
      },
    ],
  },
];

function buildServiceLocationSlug(serviceSlug: string, locationSlug: string) {
  return `${serviceSlug}-in-${locationSlug}`;
}

function buildServiceLocationPath(serviceSlug: string, locationSlug: string) {
  return `/services/${buildServiceLocationSlug(serviceSlug, locationSlug)}`;
}

function createServiceLocationPage(
  service: ServiceTemplate,
  location: LocationMarket,
): ServiceLocationPage {
  const slug = buildServiceLocationSlug(service.slug, location.slug);
  const path = buildServiceLocationPath(service.slug, location.slug);
  const heroTitle = `${service.routeLabel} in ${location.city}, ${location.stateCode}`;

  return {
    slug,
    path,
    metaTitle: `${service.routeLabel} in ${location.city}, ${location.stateCode} | FBS Prints`,
    metaDescription: service.metaDescription(location),
    keywords: [
      ...siteConfig.defaultKeywords,
      ...service.keywords,
      `${location.city} ${service.routeLabel.toLowerCase()}`,
      `${location.city} ${service.name.toLowerCase()}`,
    ],
    heroTitle,
    heroBadge: `${location.heroBadge} - ${service.badgeLabel}`,
    heroDescription: service.heroDescription(location),
    supportTitle: service.supportTitle(location),
    supportDescription: service.supportDescription(location),
    highlightsTitle: service.highlightsTitle(location),
    benefitsTitle: service.benefitsTitle(location),
    ctaTitle: service.ctaTitle(location),
    ctaDescription: service.ctaDescription(location),
    faqs: service.faqs(location),
    location,
    service: {
      slug: service.slug,
      name: service.name,
      routeLabel: service.routeLabel,
      basePath: service.basePath,
      badgeLabel: service.badgeLabel,
      image: service.image,
      heroImages: service.heroImages,
      keywords: service.keywords,
      highlights: service.highlights,
      benefits: service.benefits,
    },
  };
}

export function getLocationMarkets() {
  return locationMarkets;
}

export function getServiceLocationPages() {
  return serviceTemplates.flatMap((service) =>
    locationMarkets.map((location) => createServiceLocationPage(service, location)),
  );
}

export function getServiceLocationPage(slug: string) {
  return getServiceLocationPages().find((page) => page.slug === slug);
}

export function getRelatedServiceLocationLinks(page: ServiceLocationPage): RelatedServiceLink[] {
  return serviceTemplates
    .filter((service) => service.slug !== page.service.slug)
    .map((service) => ({
      title: `${service.routeLabel} in ${page.location.city}`,
      description: service.metaDescription(page.location),
      image: service.image,
      href: buildServiceLocationPath(service.slug, page.location.slug),
    }));
}

export function buildServiceLocationMetadata(
  page: ServiceLocationPage,
  baseUrl = siteConfig.url,
): Metadata {
  const canonical = absoluteUrl(page.path, baseUrl);
  const image = toAbsoluteImageUrl(page.service.image, baseUrl);

  return {
    title: page.metaTitle,
    description: page.metaDescription,
    keywords: page.keywords,
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
    openGraph: {
      type: "website",
      locale: siteConfig.locale,
      url: canonical,
      siteName: siteConfig.name,
      title: page.metaTitle,
      description: page.metaDescription,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: page.heroTitle,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: page.metaTitle,
      description: page.metaDescription,
      images: [image],
    },
  };
}

export function getServiceLocationSchemas(
  page: ServiceLocationPage,
  baseUrl = siteConfig.url,
) {
  const url = absoluteUrl(page.path, baseUrl);
  const image = toAbsoluteImageUrl(page.service.image, baseUrl);
  const breadcrumbId = `${url}#breadcrumb`;
  const faqId = `${url}#faq`;

  const breadcrumbSchema = buildBreadcrumbSchema(
    [
      { name: "Home", path: "/" },
      { name: page.service.routeLabel, path: page.service.basePath },
      { name: page.heroTitle, path: page.path },
    ],
    url,
    baseUrl,
  );

  const pageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${url}#webpage`,
    name: page.metaTitle,
    description: page.metaDescription,
    url,
    inLanguage: "en-US",
    dateModified: page.location.updatedAt,
    isPartOf: {
      "@id": websiteId(baseUrl),
    },
    about: {
      "@id": organizationId(baseUrl),
    },
    breadcrumb: {
      "@id": breadcrumbId,
    },
    primaryImageOfPage: {
      "@type": "ImageObject",
      url: image,
      caption: page.heroTitle,
    },
    mainEntity: {
      "@id": faqId,
    },
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${url}#service`,
    name: page.heroTitle,
    serviceType: page.service.routeLabel,
    description: page.metaDescription,
    url,
    image,
    provider: {
      "@id": organizationId(baseUrl),
    },
    areaServed: [
      {
        "@type": "City",
        name: `${page.location.city}, ${page.location.stateCode}`,
      },
      ...buildAreaServedSchema(),
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: page.highlightsTitle,
      itemListElement: page.service.highlights.map((highlight) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: highlight.title,
          description: highlight.description,
          url,
        },
      })),
    },
  };

  const faqSchema = buildFaqSchema(faqId, page.faqs);

  return [breadcrumbSchema, pageSchema, serviceSchema, faqSchema];
}
