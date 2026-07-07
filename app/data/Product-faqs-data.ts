export interface ProductFaqItem {
  question: string;
  answer: string;
}

export interface ProductFaqEntry {
  slug: string;
  name: string;
  faqs: ProductFaqItem[];
}

export const productFaqs: ProductFaqEntry[] = [
  {
    slug: "Advertising Flags",
    name: "Feather Angled Flag",
    faqs: [
      {
        question: "What is the difference between Single Sided Print Thru and Double Sided flags?",
        answer:
          "Single Sided Print Thru flags are printed on one side and show a muted, mirrored image on the back due to the dye sublimation process. Double Sided flags are two separate graphics sewn back to back with a silver block-out layer so both sides display full color with no show-through."
      },
      {
        question: "Which base should I choose for outdoor use?",
        answer:
          "The ground stake is ideal for soft ground like grass or dirt. For hard surfaces such as concrete or asphalt, the cross base or square base provides stability, and adding a water bag to the cross base gives extra weight in windy conditions."
      },
      {
        question: "What sizes are available and how do I choose one?",
        answer:
          "Feather flags come in Small (9 ft.), Medium (10.5 ft.), Large (14 ft.), and X-Large (18 ft.). Larger sizes offer greater visibility from a distance, making them a good fit for busy roadways, while smaller sizes work well for entrances and closer foot traffic."
      },
      {
        question: "Can I order just the flag without the pole and base?",
        answer:
          "Yes, the Flag Only option lets you purchase a replacement graphic if you already own the pole hardware, which is useful when updating seasonal designs without buying new equipment each time."
      }
    ]
  },
  {
    slug: "banner-stands",
    name: "Banner Stand",
    faqs: [
      {
        question: "Do I need tools to set up the banner stand?",
        answer:
          "No. The interlocking tube hardware clicks together by hand, and the stretch fabric graphic slips over the frame and zips closed at the bottom, so the entire stand can be assembled in a couple of minutes."
      },
      {
        question: "Can I reuse the hardware with a new graphic later?",
        answer:
          "Yes, the fabric graphics are replaceable, so you can order just a new dye-sublimated graphic and reuse your existing frame for future events or updated messaging."
      },
      {
        question: "What is the difference between the 36 x 90 and 48 x 90 sizes?",
        answer:
          "The 48 x 90 stand offers a wider display surface for the same height, giving more room for design elements, while the 36 x 90 has a narrower footprint that fits tighter booth spaces."
      },
      {
        question: "Does the LED Light option work with any size or graphic style?",
        answer:
          "The 2 LED Lights add-on is available with the Graphic + Frame configuration and clips onto the top of the frame to illuminate the display, which is helpful in dim trade show halls or evening events."
      }
    ]
  },
  {
    slug: "banner",
    name: "Custom Vinyl Banner",
    faqs: [
      {
        question: "Should I choose 13oz vinyl or 8oz mesh for my banner?",
        answer:
          "13oz vinyl is a solid, opaque material best suited for storefronts and general outdoor use. 8oz mesh has small perforations that let wind pass through, which reduces strain on grommets and hardware in high-wind locations like fences or open fields."
      },
      {
        question: "What are wind slits and when do I need them?",
        answer:
          "Wind slits are small cuts added to a banner to let air pass through solid vinyl. They're recommended for banners taller than 4 feet that will be displayed outdoors, since they reduce the chance of tearing or hardware failure in gusty conditions."
      },
      {
        question: "Can I get my banner in a custom size?",
        answer:
          "Yes, both the 13oz vinyl and 8oz mesh banners are available in custom dimensions in addition to standard sizes like 3' x 6' and 4' x 8'."
      },
      {
        question: "What's the difference between pole pockets and grommets?",
        answer:
          "Grommets are metal rings placed every 2 feet along the edges for hanging with rope, zip ties, or bungees. Pole pockets are sewn sleeves at the top and/or bottom that let you slide a pole or dowel through, which works well for banner stands or horizontal street pole displays."
      }
    ]
  },
  {
    slug: "custom-neon-led",
    name: "Custom Neon LED Sign",
    faqs: [
      {
        question: "How is LED neon different from traditional glass neon?",
        answer:
          "LED neon uses flexible neon-flex tubing instead of fragile glass, so it's shatterproof, lighter weight, runs cooler, and uses roughly 80% less power while still giving that classic glowing neon look."
      },
      {
        question: "What backing options are available for the sign?",
        answer:
          "Signs can be mounted on clear acrylic for a nearly invisible background, black acrylic for more contrast, or cut to the exact shape of the design with no backing panel at all."
      },
      {
        question: "Can I dim the sign or control it remotely?",
        answer:
          "Yes, choosing the Plug-In + Dimmer Remote option lets you adjust brightness and turn the sign on or off without unplugging it, in addition to the standard plug-in adapter option."
      },
      {
        question: "Is this sign suitable for outdoor use?",
        answer:
          "LED neon signs are best suited for indoor or covered outdoor locations rather than fully exposed outdoor installs, since prolonged direct weather exposure can affect the acrylic backing and electrical components over time."
      }
    ]
  },
  {
    slug: "custom-event-tents",
    name: "Custom Event Tent",
    faqs: [
      {
        question: "How long does it take to set up the tent?",
        answer:
          "The 40mm aluminum hex frame pops up in minutes without any tools, making it practical for vendors and event staff to assemble and break down quickly on-site."
      },
      {
        question: "What's the difference between Canopy Only and Canopy + Frame?",
        answer:
          "Canopy Only includes just the printed fabric top, which is useful if you already own compatible tent hardware. Canopy + Frame includes both the printed canopy and the full aluminum frame structure."
      },
      {
        question: "Can I add walls to block wind or add more branding space?",
        answer:
          "Yes, the Canopy + Frame option can include a full backwall, or a backwall plus two half walls, which helps block wind and gives extra printed surface for your branding."
      },
      {
        question: "What sizes are available?",
        answer:
          "Tents are available in 10' x 10', 10' x 15', and 10' x 20' configurations to fit different booth footprints at markets, festivals, and trade shows."
      }
    ]
  },
  {
    slug: "canopy-awning",
    name: "Custom Canopy / Awning",
    faqs: [
      {
        question: "What awning styles are available?",
        answer:
          "We offer waterfall (slanted front), dome, and box/rectangular frame styles, each giving a different look for entryways, windows, or patio coverage."
      },
      {
        question: "What's the difference between vinyl laminated fabric and Sunbrella acrylic?",
        answer:
          "Vinyl laminated fabric is a durable, cost-effective skin material for printed graphics, while Sunbrella acrylic fabric is a premium woven material known for fade resistance and a more textured, fabric-like appearance."
      },
      {
        question: "Can the awning be lit up at night?",
        answer:
          "Yes, the Backlit LED option adds internal lighting so your branding stays visible after dark, which is popular for restaurants and retail storefronts."
      },
      {
        question: "Do I need professional installation?",
        answer:
          "Yes, awnings are custom fabricated to your building's exact entryway or window dimensions, so professional measurement and installation are required for a proper fit."
      }
    ]
  },
  {
    slug: "led-light-box",
    name: "LED Light Box",
    faqs: [
      {
        question: "What's the difference between a fabric (SEG) face and an acrylic face?",
        answer:
          "A fabric (SEG) face stretches tightly over the frame with a silicone edge for a seamless, frameless appearance. An acrylic face uses a more traditional rigid printed panel that snaps or slides into the frame."
      },
      {
        question: "Can I update the graphic later without buying a new light box?",
        answer:
          "Yes, graphics are interchangeable, so you can swap in new artwork for seasonal promotions or menu changes while reusing the same frame and LED hardware."
      },
      {
        question: "What's the difference between wall mounted and hanging/ceiling light boxes?",
        answer:
          "Wall mounted light boxes attach directly to a wall surface, while hanging/ceiling units are suspended from above, which works well for directional signage in malls, airports, or hallways."
      },
      {
        question: "Is the light box available double sided?",
        answer:
          "Yes, both wall mounted and hanging light boxes are available in single or double sided configurations, with double sided units useful when the sign will be viewed from two directions."
      }
    ]
  },
  {
    slug: "led-message-board",
    name: "LED Message Board / Digital Sign",
    faqs: [
      {
        question: "How do I update the message on the sign?",
        answer:
          "Content can be updated wirelessly from a phone, tablet, or computer, or through a wired control panel depending on the unit, so you can change pricing or promotions without reprinting anything."
      },
      {
        question: "Should I choose full color RGB or single color amber?",
        answer:
          "Full color RGB supports photos, video, and animated graphics for more dynamic messaging, while single color amber is a more budget-friendly option well suited to simple scrolling text."
      },
      {
        question: "Can the sign move between locations?",
        answer:
          "Yes, the Portable Trailer Mounted option is towable between job sites or events, while the Wall/Pole Mounted option is designed for a fixed, permanent location."
      },
      {
        question: "Is the sign rated for outdoor weather?",
        answer:
          "Yes, message boards use a weatherproof, outdoor-rated enclosure so they can operate in varying outdoor conditions at gas stations, schools, and retail centers."
      }
    ]
  },
  {
    slug: "led-channel-letters",
    name: "LED Channel Letters",
    faqs: [
      {
        question: "What's the difference between front-lit and halo-lit channel letters?",
        answer:
          "Front-lit letters glow through the acrylic face for a bright, direct look, while halo-lit (reverse) letters project a soft glow onto the wall behind them for a more subtle, modern effect."
      },
      {
        question: "What's the difference between raceway and direct wall mounting?",
        answer:
          "A raceway is a mounting rail that houses the wiring behind the letters and simplifies installation, especially on uneven surfaces. Direct wall mount (flush) installs the letters straight onto the wall for a cleaner, built-in look."
      },
      {
        question: "Are channel letters custom fitted to my logo?",
        answer:
          "Yes, each letter is fabricated to match your logo's exact font, spacing, and color rather than using a stock typeface."
      },
      {
        question: "Do these signs require permitting?",
        answer:
          "Most municipalities require permits for illuminated channel letters, and professional installation is required since the components are UL listed electrical fixtures."
      }
    ]
  },
  {
    slug: "monument-signs",
    name: "Monument Sign",
    faqs: [
      {
        question: "What base finish options are available?",
        answer:
          "Bases can be finished in brick, stone veneer, stucco, aluminum panel, or high-density foam to match your building's architecture and surrounding landscaping."
      },
      {
        question: "What's the difference between single tenant and multi-tenant monuments?",
        answer:
          "A single tenant monument displays one business's name and branding, while a multi-tenant monument organizes several business names into one shared structure, common at shopping centers and office parks."
      },
      {
        question: "Can the sign include a digital changeable copy section?",
        answer:
          "Yes, multi-tenant monuments can include a digital changeable copy section for real-time updates, in addition to standard illuminated or non-illuminated static panels."
      },
      {
        question: "What's involved in installing a monument sign?",
        answer:
          "Monument signs require a site survey, permitting, and a poured concrete footing engineered to local code, so professional installation is necessary."
      }
    ]
  },
  {
    slug: "pylon-signs",
    name: "Pylon Sign",
    faqs: [
      {
        question: "When is a pylon sign a better choice than a monument sign?",
        answer:
          "Pylon signs are tall and pole-mounted, making them a better fit for businesses set back from the road or needing visibility from a distance, while monument signs sit closer to ground level and suit shorter sightlines."
      },
      {
        question: "What's the difference between single pole and double pole construction?",
        answer:
          "Single pole pylons use one central support column, while double pole designs use two poles for added stability, which is typically needed for taller structures or larger multi-tenant panel sections."
      },
      {
        question: "Can I add a digital price display to the sign?",
        answer:
          "Yes, the Double Pole Pylon option includes a digital LED price/changeable copy display, which is popular with gas stations and quick-service businesses that update pricing frequently."
      },
      {
        question: "What kind of engineering or permitting is required?",
        answer:
          "Pylon signs require structural engineering for local wind load requirements, permitting, an engineered poured concrete footing, and typically a crane for installation."
      }
    ]
  },
  {
    slug: "signicade-a-frame",
    name: "Signicade A-Frame Sign",
    faqs: [
      {
        question: "What's the difference between the printed panel and dry-erase versions?",
        answer:
          "The printed panel version has a fixed full color graphic best suited for permanent branding, while the dry-erase version lets staff write and update messaging with a marker for daily specials or announcements."
      },
      {
        question: "Is the sign double sided?",
        answer:
          "Yes, both sides of the A-frame display your message, so it's visible to foot or vehicle traffic approaching from either direction."
      },
      {
        question: "Can I store the sign easily overnight?",
        answer:
          "Yes, the frame folds completely flat, making it easy to bring inside for storage when your business is closed."
      },
      {
        question: "What panel material should I choose?",
        answer:
          "Corrugated plastic (Coroplast) is a lightweight, economical choice for everyday use, while aluminum composite panels offer a more rigid, upscale appearance for long-term outdoor display."
      }
    ]
  },
  {
    slug: "trade-show-products",
    name: "Trade Show Display Package",
    faqs: [
      {
        question: "How portable is the pop-up backdrop kit?",
        answer:
          "The frame is lightweight aluminum and packs into an included travel case light enough to check as luggage, with tool-free setup in minutes."
      },
      {
        question: "Can I reuse the frame with new graphics for future shows?",
        answer:
          "Yes, hardware is reusable between shows, so you can order a new graphic when your messaging changes without replacing the frame itself."
      },
      {
        question: "What comes with the Table Throw + Counter Package?",
        answer:
          "This package includes a custom printed table throw and the option to add a branded podium or counter, which is useful for product demos, literature displays, or point-of-sale setups."
      },
      {
        question: "What size backdrop should I choose?",
        answer:
          "8' wide backdrops fit smaller booth spaces, while 10' wide backdrops give a larger branded presence and are common for standard trade show booth allotments."
      }
    ]
  },
  {
    slug: "vehicle-graphics",
    name: "Vehicle Graphics / Decals",
    faqs: [
      {
        question: "Should I choose cut vinyl lettering or printed decals?",
        answer:
          "Cut vinyl lettering works well for simple logos, phone numbers, and text. Printed decals with UV lamination are better suited for detailed graphics, photos, or color gradients."
      },
      {
        question: "Should I use removable or permanent adhesive?",
        answer:
          "Removable adhesive is a good fit for leased or rental vehicles since it can be taken off without damage, while permanent adhesive is better for long-term branding on vehicles you own."
      },
      {
        question: "How much of the vehicle can be covered?",
        answer:
          "Coverage ranges from simple door logos up to door logos with rear window lettering or custom hood and side accent graphics, depending on the level of branding you want."
      },
      {
        question: "Is professional installation required?",
        answer:
          "Professional installation is recommended to avoid bubbling or misalignment, especially for larger printed decal graphics."
      }
    ]
  },
  {
    slug: "vehicle-wraps",
    name: "Vehicle Wrap",
    faqs: [
      {
        question: "What's the difference between a full wrap and a partial wrap?",
        answer:
          "A full wrap covers the entire exterior of the vehicle for maximum branding impact, while a partial wrap covers select areas like the rear and sides or the hood and sides at a lower cost."
      },
      {
        question: "Which finish should I choose: gloss, matte, or satin?",
        answer:
          "Gloss gives a shiny, factory-like finish, matte offers a flat, non-reflective look, and satin sits in between with a subtle sheen — the right choice mostly comes down to the aesthetic you want."
      },
      {
        question: "Will a wrap damage my vehicle's paint?",
        answer:
          "No, wraps are designed to be fully removable by a trained installer without damaging the factory paint underneath, which is why they work well for both owned and leased vehicles."
      },
      {
        question: "How long does a vehicle wrap last?",
        answer:
          "With proper care, cast vinyl wrap film typically lasts 5-7 years, though direct sun exposure and washing habits can affect its lifespan."
      }
    ]
  },
  {
    slug: "window-lettering",
    name: "Window Lettering & Graphics",
    faqs: [
      {
        question: "What's the difference between frosted film and perforated window film?",
        answer:
          "Frosted/etched film adds privacy and a premium glass-etched look, commonly used on conference room windows. Perforated window film lets you print full color graphics on the outside of a window while people inside can still see out."
      },
      {
        question: "Can lettering be applied to both interior and exterior glass?",
        answer:
          "Yes, cut vinyl lettering and printed graphics can be applied to either the interior or exterior side of the glass depending on your preference and the surface conditions."
      },
      {
        question: "Do you offer metallic or gold vinyl for lettering?",
        answer:
          "Yes, in addition to standard color vinyl, gold or metallic vinyl is available for a more premium look on logos or business names."
      },
      {
        question: "Is professional installation necessary?",
        answer:
          "Professional installation is recommended, particularly for larger perforated film or frosted panels, to ensure a bubble-free, even application."
      }
    ]
  },
  {
    slug: "yard-signs",
    name: "Custom Yard Sign",
    faqs: [
      {
        question: "What comes with the sign for installation?",
        answer:
          "Standard yard signs can include a wire H-stake for tool-free ground installation, letting you set up the sign directly without additional hardware."
      },
      {
        question: "What's the difference between a standard yard sign and a real estate rider?",
        answer:
          "A standard yard sign is the main advertising panel, while a real estate rider is a smaller sign, such as 6\" x 24\", that attaches below the main sign to add details like 'Open House' or an agent's name."
      },
      {
        question: "How long will the sign hold up outdoors?",
        answer:
          "The corrugated plastic material is weatherproof and designed to hold up well outdoors for weeks or months, making it suitable for short-term campaigns as well as longer seasonal use."
      },
      {
        question: "Can I print on both sides?",
        answer:
          "Yes, single or double sided printing is available, with double sided giving visibility from both directions of foot or vehicle traffic."
      }
    ]
  }
];

export function getProductFaqs(slug: string): ProductFaqEntry | undefined {
  return productFaqs.find((entry) => entry.slug === slug);
}