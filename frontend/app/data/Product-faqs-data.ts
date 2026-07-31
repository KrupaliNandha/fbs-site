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
    slug: "advertising-flags",
    name: "Feather Angled Flag",
    faqs: [
      {
        question: "What is the difference between Single Sided Print Thru and Double Sided feather flags?",
        answer:
          "Single Sided Print Thru feather flags are printed on one side and show a lighter mirrored image on the reverse, which makes them a budget-friendly option for outdoor promotions, sidewalk advertising, and event visibility. Double Sided feather flags use two printed panels with a block-out layer in between, so both sides show bold, readable graphics, which is better for high-traffic business locations where your message needs to stay clear from either direction."
      },
      {
        question: "Which flag base is best for outdoor business use?",
        answer:
          "The right base depends on the installation surface. A ground stake works best for grass, dirt, and other soft ground, while a cross base or square base is better for concrete, sidewalks, and parking lot setups. For windy outdoor conditions, adding a water bag improves stability and helps keep the advertising flag secure during retail events, grand openings, and roadside promotions."
      },
      {
        question: "What feather flag sizes are available and how do I choose the right one?",
        answer:
          "Feather flags are available in Small (9 ft.), Medium (10.5 ft.), Large (14 ft.), and X-Large (18 ft.) sizes. Larger custom flags are ideal for roadside advertising, car dealerships, event marketing, and businesses that need long-distance visibility, while smaller sizes are a better fit for storefront entrances, sidewalks, and trade show environments where customers are viewing the display from a closer range."
      },
      {
        question: "Can I order a replacement feather flag without the pole and base?",
        answer:
          "Yes. If you already have the hardware, you can order a flag-only replacement graphic, which is a practical option for seasonal promotions, updated branding, limited-time sales, or new campaign messaging without repurchasing the full display system."
      }
    ]
  },
  {
    slug: "banner-stands",
    name: "Banner Stand",
    faqs: [
      {
        question: "Do banner stands require tools for setup?",
        answer:
          "No. Banner stands are designed for fast, tool-free setup, which makes them ideal for trade shows, job fairs, retail events, conferences, and in-store promotions. The interlocking frame assembles by hand and the printed fabric graphic slips over the structure for a clean, professional presentation in just a few minutes."
      },
      {
        question: "Can I reuse the banner stand hardware with a new graphic later?",
        answer:
          "Yes. The hardware is reusable, so you can order a replacement fabric graphic when your branding, offer, or event messaging changes. This makes banner stands a cost-effective display solution for businesses that attend multiple trade shows, expos, community events, or seasonal campaigns throughout the year."
      },
      {
        question: "What is the difference between the 36 x 90 and 48 x 90 banner stand sizes?",
        answer:
          "The 48 x 90 size gives you more horizontal design space, which is useful for larger logos, product images, or more detailed messaging. The 36 x 90 version has a smaller footprint, which works well for tighter booth layouts, office lobbies, reception areas, and event spaces where floor space is limited."
      },
      {
        question: "Are LED lights available for banner stands?",
        answer:
          "Yes. LED lights can be added to illuminate the display, which improves visibility in convention halls, indoor expos, evening events, and other low-light environments. Lighting can make branded graphics easier to read and help your booth or presentation area stand out from surrounding displays."
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
          "13oz vinyl banners are best for storefronts, indoor promotions, grand openings, construction sites, and general outdoor advertising where you want a solid, opaque surface. 8oz mesh banners are better for windy environments such as fences, athletic fields, job sites, and open outdoor areas because the perforated material allows air to pass through and reduces strain on the banner hardware."
      },
      {
        question: "What are wind slits and when should they be added to a banner?",
        answer:
          "Wind slits are small curved cuts placed in a vinyl banner to help air move through the material. They are often recommended for taller outdoor banners, especially those installed in exposed areas, because they can reduce pressure on grommets and mounting points during strong wind conditions."
      },
      {
        question: "Can I order a custom size banner for my business or event?",
        answer:
          "Yes. Custom vinyl banners are available in custom dimensions as well as standard sizes. This gives businesses flexibility for storefront displays, fence banners, event signage, trade show backdrops, school promotions, and temporary outdoor advertising where exact sizing matters."
      },
      {
        question: "What is the difference between grommets and pole pockets on a banner?",
        answer:
          "Grommets are reinforced metal rings placed around the edges so the banner can be hung with rope, zip ties, or bungees. Pole pockets are sewn sleeves that allow a pole or rod to slide through the top or bottom of the banner, which is useful for street pole displays, hanging presentations, and banner stand applications."
      }
    ]
  },
  {
    slug: "custom-neon-led",
    name: "Custom Neon LED Sign",
    faqs: [
      {
        question: "How is an LED neon sign different from traditional glass neon?",
        answer:
          "LED neon signs use flexible neon-style tubing instead of glass, which makes them lighter, more durable, safer to handle, and more energy efficient. They deliver the glowing neon look many businesses want for retail interiors, restaurants, salons, bars, photo backdrops, and branded wall signage without the fragility and maintenance concerns of traditional neon."
      },
      {
        question: "What backing options are available for a custom LED neon sign?",
        answer:
          "Common backing options include clear acrylic for a minimal floating look, black acrylic for stronger contrast, or contour-cut backing shaped to the design itself. The right backing depends on the visual style, wall color, and installation environment of the business or event space."
      },
      {
        question: "Can LED neon signs be dimmed or controlled remotely?",
        answer:
          "Yes. Many custom LED neon signs can be ordered with a dimmer remote, allowing you to adjust brightness and switch the sign on or off more conveniently. This is useful for hospitality spaces, salons, event venues, and branded interiors where lighting mood matters."
      },
      {
        question: "Are custom LED neon signs suitable for outdoor use?",
        answer:
          "LED neon signs are generally best for indoor or covered outdoor applications. While they can perform well in protected environments, fully exposed outdoor conditions can affect the backing and electrical components over time, so permanent exterior signage usually calls for a more weather-rated commercial sign solution."
      }
    ]
  },
  {
    slug: "custom-event-tents",
    name: "Custom Event Tent",
    faqs: [
      {
        question: "How long does it take to set up a custom event tent?",
        answer:
          "A custom event tent is designed for quick setup, making it a strong option for trade shows, farmers markets, festivals, sports events, school functions, and promotional pop-ups. The aluminum frame opens without tools, helping vendors and event teams build a branded setup in just a few minutes."
      },
      {
        question: "What is the difference between Canopy Only and Canopy plus Frame?",
        answer:
          "Canopy Only includes the printed tent top by itself, which works if you already own compatible hardware. Canopy plus Frame includes both the custom printed canopy and the full frame system, making it the better choice for new event setups, outdoor promotions, and branded vendor booths."
      },
      {
        question: "Can I add walls to a custom canopy tent for more branding or weather protection?",
        answer:
          "Yes. Backwalls and half walls can be added to increase printed branding space, block wind, improve privacy, and create a more finished event presentation. This is especially useful for outdoor business marketing, food vendors, mobile activations, and community events."
      },
      {
        question: "What tent sizes are available for event branding?",
        answer:
          "Custom event tents are commonly available in 10' x 10', 10' x 15', and 10' x 20' sizes. Smaller tents work well for compact vendor spaces, while larger sizes are a better fit for high-traffic events, product showcases, team stations, and branded outdoor activations."
      }
    ]
  },
  {
    slug: "canopy-awning",
    name: "Custom Canopy / Awning",
    faqs: [
      {
        question: "What canopy and awning styles are available for storefronts?",
        answer:
          "Popular canopy and awning styles include waterfall, dome, and box or rectangular frame designs. Each style creates a different visual impression and can be used to improve storefront branding, entryway coverage, restaurant patios, retail windows, and overall curb appeal."
      },
      {
        question: "What is the difference between vinyl laminated fabric and Sunbrella acrylic awning material?",
        answer:
          "Vinyl laminated fabric is a durable and cost-effective choice for custom printed graphics, while Sunbrella acrylic is a premium woven fabric known for its fade resistance, textured appearance, and upscale look. The best material depends on the brand style, exposure conditions, and long-term maintenance goals of the project."
      },
      {
        question: "Can a custom awning be illuminated for nighttime visibility?",
        answer:
          "Yes. Backlit LED awnings are available for businesses that want stronger nighttime branding and improved storefront visibility. This is especially popular with restaurants, retail stores, hospitality businesses, and locations that rely on evening traffic."
      },
      {
        question: "Do custom awnings require professional measurement and installation?",
        answer:
          "Yes. Because awnings are fabricated to fit specific building dimensions, professional measurement and installation are important for safety, appearance, and long-term performance. This ensures the canopy fits the structure properly and complies with local installation requirements."
      }
    ]
  },
  {
    slug: "led-light-box",
    name: "LED Light Box",
    faqs: [
      {
        question: "What is the difference between a fabric SEG face and an acrylic face on an LED light box?",
        answer:
          "A fabric SEG face uses a silicone edge graphic that stretches tightly into the frame for a seamless, modern look with even illumination. An acrylic face uses a rigid printed panel for a more traditional sign appearance. Both options work well for illuminated retail signage, menu displays, indoor branding, and commercial wayfinding."
      },
      {
        question: "Can I change the light box graphic without replacing the whole sign?",
        answer:
          "Yes. LED light box graphics are replaceable, which makes them ideal for seasonal promotions, menu updates, retail campaigns, trade show messaging, and branded environments that need fresh visuals without replacing the full frame and lighting system."
      },
      {
        question: "What is the difference between wall-mounted and hanging light boxes?",
        answer:
          "Wall-mounted light boxes attach directly to a wall and are commonly used for menu boards, branded interior displays, and storefront graphics. Hanging or ceiling-mounted light boxes suspend from above, making them effective for malls, airports, hallways, retail aisles, and directional signage where visibility from a distance matters."
      },
      {
        question: "Are LED light boxes available in double-sided formats?",
        answer:
          "Yes. Single-sided and double-sided light boxes are both available. Double-sided configurations are especially useful in corridors, shopping centers, trade environments, and other spaces where the display needs to be seen from multiple directions."
      }
    ]
  },
  {
    slug: "led-message-board",
    name: "LED Message Board / Digital Sign",
    faqs: [
      {
        question: "How do I update content on an LED message board or digital sign?",
        answer:
          "Most LED message boards can be updated wirelessly from a phone, tablet, or computer, while some models also support wired control options. This allows businesses to change promotions, pricing, events, and announcements quickly without printing a new sign each time."
      },
      {
        question: "Should I choose a full color RGB message board or a single color amber display?",
        answer:
          "Full color RGB displays are better for dynamic content such as photos, animation, and rich promotional messaging, while amber displays are a more economical option for simple scrolling text and basic announcements. The best choice depends on your content strategy, budget, and how much visual impact you want from the sign."
      },
      {
        question: "Can a digital sign be moved between locations?",
        answer:
          "Yes. Portable trailer-mounted LED signs can be transported between job sites, events, schools, and temporary promotions, while wall-mounted or pole-mounted digital signs are designed for fixed, long-term business visibility."
      },
      {
        question: "Are LED message boards weather-rated for outdoor commercial use?",
        answer:
          "Yes. Outdoor LED message boards are typically built with weather-rated enclosures so they can perform in changing outdoor conditions. They are commonly used by schools, gas stations, churches, municipalities, and retail locations that need changeable messaging throughout the year."
      }
    ]
  },
  {
    slug: "led-channel-letters",
    name: "LED Channel Letters",
    faqs: [
      {
        question: "What is the difference between front-lit and halo-lit LED channel letters?",
        answer:
          "Front-lit channel letters illuminate through the face of the letter for a bright, direct storefront look, while halo-lit letters cast light onto the wall behind them for a softer, more upscale effect. Both styles are popular for retail storefront signs, office branding, restaurants, and commercial building signage."
      },
      {
        question: "What is the difference between raceway mounting and direct wall mounting for channel letters?",
        answer:
          "Raceway mounting uses a horizontal support structure that houses wiring and simplifies installation, especially on uneven or leased storefront surfaces. Direct wall mounting places the letters individually on the wall for a cleaner built-in look, but it often requires more surface penetration and electrical planning."
      },
      {
        question: "Are LED channel letters custom made to match my business logo?",
        answer:
          "Yes. Channel letters are custom fabricated to match the logo's font, size, spacing, and brand colors, which helps create a more professional storefront identity and stronger brand recognition."
      },
      {
        question: "Do illuminated channel letters require a permit?",
        answer:
          "In most cities, yes. Illuminated channel letter signs usually require permitting, code review, and professional installation because they are electrical commercial signs attached to the building exterior."
      }
    ]
  },
  {
    slug: "monument-signs",
    name: "Monument Sign",
    faqs: [
      {
        question: "What monument sign base finishes are available?",
        answer:
          "Monument sign bases can be finished in materials such as brick, stone veneer, stucco, aluminum panel, or high-density foam, depending on the look of the property and the level of architectural integration you want. These finish options help the sign feel consistent with the building, landscape, and surrounding environment."
      },
      {
        question: "What is the difference between a single-tenant and multi-tenant monument sign?",
        answer:
          "A single-tenant monument sign displays one business or organization, while a multi-tenant monument sign includes several panels for shopping centers, office parks, medical campuses, and commercial plazas. The right option depends on whether the sign is meant to represent one brand or multiple occupants on the property."
      },
      {
        question: "Can a monument sign include a digital changeable message section?",
        answer:
          "Yes. A monument sign can be designed with a digital message center or changeable copy area, which is useful for promotions, events, announcements, and organizations that need to update messaging regularly without replacing the main sign structure."
      },
      {
        question: "What is involved in monument sign installation?",
        answer:
          "Monument sign installation usually includes a site survey, permit review, foundation work, engineering, and a poured concrete footing designed to local code. Because these are permanent ground signs, professional fabrication and installation are essential for safety and compliance."
      }
    ]
  },
  {
    slug: "pylon-signs",
    name: "Pylon Sign",
    faqs: [
      {
        question: "When is a pylon sign better than a monument sign?",
        answer:
          "A pylon sign is better when a business sits farther back from the road or needs long-range visibility from passing traffic. Monument signs work closer to the ground, while pylon signs rise higher and are more effective for highways, major corridors, gas stations, shopping centers, and multi-business sites."
      },
      {
        question: "What is the difference between single-pole and double-pole pylon construction?",
        answer:
          "Single-pole pylon signs use one central support, while double-pole pylons use two supports for added stability and larger sign faces. Double-pole construction is often preferred for taller structures, wider cabinets, and multi-tenant signage where engineering demands are greater."
      },
      {
        question: "Can a pylon sign include a digital price display or changeable copy?",
        answer:
          "Yes. Many pylon signs can incorporate digital LED price displays or message components, which makes them especially useful for gas stations, convenience stores, quick-service restaurants, and roadside businesses that update pricing or promotions frequently."
      },
      {
        question: "What engineering and permits are required for a pylon sign?",
        answer:
          "Pylon signs typically require structural engineering, local permit approval, an engineered footing, and crane-assisted installation. Because they are large permanent exterior signs, code compliance and professional installation are critical from both a safety and legal standpoint."
      }
    ]
  },
  {
    slug: "signicade-a-frame",
    name: "Signicade A-Frame Sign",
    faqs: [
      {
        question: "What is the difference between printed panel and dry-erase A-frame signs?",
        answer:
          "A printed panel A-frame sign is best for permanent branding, recurring promotions, and consistent business messaging, while a dry-erase version is more flexible for daily specials, temporary notices, event directions, and changing promotions. The best choice depends on how often the message needs to be updated."
      },
      {
        question: "Are Signicade A-frame signs double sided?",
        answer:
          "Yes. A-frame signs display your message on both sides, which improves visibility for foot traffic and vehicle traffic approaching from either direction. This makes them a popular option for sidewalks, storefronts, restaurants, schools, and event entrances."
      },
      {
        question: "Can an A-frame sign be stored easily when the business is closed?",
        answer:
          "Yes. The frame folds flat, so it is easy to carry inside and store overnight. This helps protect the sign and keeps daily setup simple for businesses that use sidewalk signage during open hours only."
      },
      {
        question: "What panel material should I choose for an A-frame sign?",
        answer:
          "Corrugated plastic is a lightweight and economical option for short- to medium-term use, while aluminum composite panels offer a more rigid and durable solution for long-term outdoor presentation and a more premium visual finish."
      }
    ]
  },
  {
    slug: "trade-show-products",
    name: "Trade Show Display Package",
    faqs: [
      {
        question: "How portable is a trade show display package?",
        answer:
          "Trade show display packages are built for portability, with lightweight frames and compact carrying cases that make transport easier for expos, conferences, conventions, recruiting events, and mobile brand activations. Many setups are designed to be assembled quickly without specialized tools."
      },
      {
        question: "Can I reuse the trade show display frame with new graphics?",
        answer:
          "Yes. Reusable hardware allows you to update graphics for different campaigns, events, or seasonal promotions without purchasing an entirely new display system, which helps lower long-term marketing costs."
      },
      {
        question: "What is included in a table throw and counter trade show package?",
        answer:
          "A table throw and counter package usually includes a custom printed table cover and the option to add a branded counter or podium for demos, literature, customer conversations, and product displays. This helps create a more polished and functional event booth."
      },
      {
        question: "What trade show backdrop size should I choose?",
        answer:
          "An 8-foot backdrop is a practical choice for smaller booth spaces, while a 10-foot backdrop creates a larger branded presence and fits standard trade show booth dimensions more comfortably. The best size depends on your booth footprint and the amount of visual impact you want."
      }
    ]
  },
  {
    slug: "vehicle-graphics",
    name: "Vehicle Graphics / Decals",
    faqs: [
      {
        question: "Should I choose cut vinyl lettering or printed vehicle decals?",
        answer:
          "Cut vinyl lettering is ideal for simple business names, phone numbers, URLs, and clean logo applications. Printed decals are better for detailed graphics, photos, gradients, and full-color branding. The right choice depends on how much visual detail your company vehicle graphics need."
      },
      {
        question: "What is the difference between removable and permanent adhesive for vehicle graphics?",
        answer:
          "Removable adhesive is often preferred for leased or short-term vehicles because it can be taken off more easily, while permanent adhesive is a stronger long-term option for company-owned vehicles that need durable branding over time."
      },
      {
        question: "How much of the vehicle can be covered with graphics or decals?",
        answer:
          "Coverage can range from simple door logos and lettering to larger branded graphics that extend across side panels, rear windows, hoods, and tailgates. This flexibility makes vehicle graphics a strong option for contractors, service companies, delivery fleets, and local business advertising."
      },
      {
        question: "Is professional installation recommended for vehicle graphics?",
        answer:
          "Yes. Professional installation helps prevent bubbling, wrinkles, misalignment, and premature lifting, especially on larger decals or more detailed graphics. A clean installation also improves the long-term appearance of the vehicle branding."
      }
    ]
  },
  {
    slug: "vehicle-wraps",
    name: "Vehicle Wrap",
    faqs: [
      {
        question: "What is the difference between a full wrap and a partial vehicle wrap?",
        answer:
          "A full wrap covers nearly the entire vehicle for maximum brand exposure and a dramatic visual impact, while a partial wrap covers selected sections such as the sides, rear, or hood at a lower cost. Both options can be effective for mobile advertising, depending on your budget and branding goals."
      },
      {
        question: "Which vehicle wrap finish should I choose: gloss, matte, or satin?",
        answer:
          "Gloss wraps create a polished, high-shine finish similar to factory paint, matte wraps have a flatter non-reflective appearance, and satin finishes offer a softer middle ground. The best wrap finish depends on your brand style, vehicle type, and the overall impression you want the wrapped vehicle to make."
      },
      {
        question: "Will a vehicle wrap damage factory paint?",
        answer:
          "When installed and removed correctly, a vehicle wrap should not damage factory paint in good condition. In fact, wrap film can help protect the painted surface underneath from everyday wear and sun exposure during the life of the wrap."
      },
      {
        question: "How long does a commercial vehicle wrap typically last?",
        answer:
          "A professionally installed cast vinyl vehicle wrap typically lasts about 5 to 7 years, depending on sun exposure, maintenance, washing habits, and whether the vehicle is stored indoors or outdoors."
      }
    ]
  },
  {
    slug: "window-lettering",
    name: "Window Lettering & Graphics",
    faqs: [
      {
        question: "What is the difference between frosted film and perforated window film?",
        answer:
          "Frosted window film is used to create privacy and give glass a clean etched appearance, making it popular for offices, conference rooms, and interior branding. Perforated window film allows full-color graphics on the outside while still letting people inside see out, which makes it ideal for storefront advertising and promotional window graphics."
      },
      {
        question: "Can window lettering be applied to interior or exterior glass?",
        answer:
          "Yes. Window lettering and graphics can be installed on either the interior or exterior side of the glass, depending on the design, weather exposure, visibility goals, and the condition of the surface."
      },
      {
        question: "Do you offer metallic or premium vinyl options for window graphics?",
        answer:
          "Yes. In addition to standard colored vinyl, metallic and gold vinyl options are available for businesses that want a more premium storefront look for logos, names, hours, and branded glass signage."
      },
      {
        question: "Is professional installation important for window graphics?",
        answer:
          "Yes. Professional installation is strongly recommended for window lettering, frosted film, and perforated window graphics to ensure a clean, bubble-free finish and accurate alignment across the glass surface."
      }
    ]
  },
  {
    slug: "yard-signs",
    name: "Custom Yard Sign",
    faqs: [
      {
        question: "What hardware is included with a custom yard sign?",
        answer:
          "Many custom yard signs can be ordered with a wire H-stake for fast ground installation, which makes them easy to set up for real estate, events, political campaigns, school promotions, contractor advertising, and local directional signage."
      },
      {
        question: "What is the difference between a yard sign and a real estate rider?",
        answer:
          "A yard sign is the main display panel, while a rider is a smaller add-on panel attached above or below it to show extra information such as open house details, a phone number, an agent name, or a limited-time message."
      },
      {
        question: "How durable are custom yard signs outdoors?",
        answer:
          "Custom yard signs printed on corrugated plastic are weather-resistant and suitable for outdoor use over weeks or months, depending on the conditions. They are commonly used for temporary promotions, directional events, site marketing, and seasonal campaigns."
      },
      {
        question: "Can yard signs be printed on both sides?",
        answer:
          "Yes. Single-sided and double-sided printing are both available. Double-sided yard signs improve visibility from multiple directions, which is especially useful near roads, intersections, sidewalks, and event entrances."
      }
    ]
  }
];

export function getProductFaqs(slug: string): ProductFaqEntry | undefined {
  return productFaqs.find((entry) => entry.slug === slug);
}
