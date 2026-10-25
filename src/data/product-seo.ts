// Per-product SEO overrides, keyed by product slug.
//
// Product titles, meta descriptions and H1s otherwise come straight from the
// backend product data (plain product names). These overrides exist for the
// product pages that Search Console shows earning impressions on generic
// queries (e.g. "sticker printing", "warranty card") with click-through rates
// far below their positions — the fix is a query-led title/description/H1
// that names the service and "Sri Lanka", following the same pattern as the
// category content in category-content.ts.
//
// Copy rules (same as the category pack): British English, real product facts
// only — no invented prices, turnaround times, minimums or guarantees.

export interface ProductSeoOverride {
  /** Bare title — the root layout template appends " | Print Works.LK". */
  title: string;
  /** Meta description, ~155 characters, query-led. */
  description: string;
  /** Visible H1: product name first, then the service descriptor. */
  h1: string;
}

export const productSeoOverrides: Record<string, ProductSeoOverride> = {
  // "sticker printing" — 222 impressions, position 5.9, CTR 0.4% (28d, SC)
  "custom-logo-stickers": {
    title: "Custom Logo Stickers — Sticker Printing in Sri Lanka",
    description:
      "Logo sticker printing in Sri Lanka — transparent, white PVC and UV DTF stickers for products, packaging, laptops and vehicles, with island-wide delivery.",
    h1: "Custom Logo Stickers — Sticker Printing in Sri Lanka",
  },
  // "sticker printing" (second page splitting the query) — 141 impr, pos 6.3
  "large-format-sticker-printing": {
    title: "Large Format Sticker Printing in Sri Lanka",
    description:
      "Large format sticker printing in Sri Lanka for walls, glass and vehicles — durable white or transparent PVC vinyl with a weather-resistant finish.",
    h1: "Large Format Sticker Printing in Sri Lanka",
  },
  // "laptop stickers" — 61 impressions, position 7.3 (28d, SC)
  "custom-laptop-stickers": {
    title: "Custom Laptop Stickers in Sri Lanka",
    description:
      "Custom laptop stickers in Sri Lanka — white PVC, transparent and UV DTF decals or direct UV printing, durable and cut to your design. Island-wide delivery.",
    h1: "Custom Laptop Stickers in Sri Lanka",
  },
  // "warranty card" — 52 impressions, position 3.9, CTR 1.9% (28d, SC)
  "pvc-warranty-cards": {
    title: "PVC Warranty Cards in Sri Lanka — CR80 Printing",
    description:
      "PVC warranty card printing in Sri Lanka — standard CR80 size (86 × 54 mm), 0.76 mm thick, with vivid UV print that lasts. Island-wide delivery.",
    h1: "PVC Warranty Cards in Sri Lanka",
  },
  // "banner printing" — position 6.9; "banner printing colombo" — pos 2.6
  "flex-banner-printing": {
    title: "Flex Banner Printing in Sri Lanka",
    description:
      "Flex banner printing in Sri Lanka for events, promotions and shopfronts — durable PVC, crisp colours, hemming, eyelets and pole pockets. Island-wide delivery.",
    h1: "Flex Banner Printing in Sri Lanka",
  },
  // "business card printing colombo" — 13 impressions, position 8.5;
  // page 229 impressions, CTR 6.1%, position 8.1 (28d, SC 2026-10-21)
  "pvc-translucent-business-cards": {
    title: "PVC Translucent Business Cards — Business Card Printing in Colombo, Sri Lanka",
    description:
      "Business card printing in Colombo, Sri Lanka — frosted translucent PVC cards with durable UV print. Quality prints, island-wide delivery.",
    h1: "PVC Translucent Business Cards — Business Card Printing in Colombo, Sri Lanka",
  },
  // CNC category (Oct 2026 handover) — pages go live once the backend
  // category + products exist; admin seo_title beats these overrides.
  "mdf-cnc-cutting": {
    title: "MDF CNC Cutting Sri Lanka",
    description:
      "Custom MDF shapes, lettering, panels and display components cut to your design. Send dimensions and finish for a quotation from PrintWorks.lk.",
    h1: "MDF CNC Cutting Sri Lanka",
  },
  "foam-board-cnc-cutting": {
    title: "Eco / PVC Foam Board CNC Cutting Sri Lanka",
    description:
      "Eco / PVC foam board lettering, signage components and decorative shapes cut to order. Send your specification for a quotation.",
    h1: "Eco / PVC Foam Board CNC Cutting Sri Lanka",
  },
  "plywood-cnc-cutting": {
    title: "Plywood CNC Cutting Sri Lanka",
    description:
      "Custom plywood panels, display parts, templates and interlocking components cut from your design. Send grade and thickness for a quotation.",
    h1: "Plywood CNC Cutting Sri Lanka",
  },
  "cladding-cnc-cutting": {
    title: "Cladding CNC Cutting Sri Lanka",
    description:
      "ACP/cladding cut into custom shapes for sign faces and decorative features. Confirm cutting or V-grooving needs for a quotation.",
    h1: "Cladding CNC Cutting Sri Lanka",
  },
  "wood-cnc-engraving-carving": {
    title: "Wood CNC Engraving & Carving Sri Lanka",
    description:
      "Recessed lettering, logos, patterns and relief carving in suitable wood. Send a reference image and dimensions for a feasibility review.",
    h1: "Wood CNC Engraving & Carving Sri Lanka",
  },
  "cnc-cut-letters-logos": {
    title: "CNC Cut Letters & Logos Sri Lanka",
    description:
      "Individual CNC-cut letters, numbers and brand logos for reception walls, shop displays and events. Send material and size for a quotation.",
    h1: "CNC Cut Letters & Logos Sri Lanka",
  },
  "wooden-signs-nameplates": {
    title: "Custom Wooden Signs & Nameplates Sri Lanka",
    description:
      "Personalised wooden signs and nameplates with names, logos or engraved details for businesses, homes, rooms and desks.",
    h1: "Custom Wooden Signs & Nameplates Sri Lanka",
  },
  "mdf-plywood-display-racks": {
    title: "MDF & Plywood Display Racks Sri Lanka",
    description:
      "Countertop or floor-standing display racks built around your products in MDF or plywood. Send product dimensions for a quotation.",
    h1: "MDF & Plywood Display Racks Sri Lanka",
  },
  "cnc-decorative-panels-partitions": {
    title: "CNC Decorative Panels & Partitions Sri Lanka",
    description:
      "Patterned CNC screens, wall features and decorative partitions for interior projects. Discuss pattern scale and framing for a quotation.",
    h1: "CNC Decorative Panels & Partitions Sri Lanka",
  },
  "custom-cnc-cutting": {
    title: "Custom CNC Cutting from Your Design Sri Lanka",
    description:
      "Submit your own drawing for custom CNC-cut parts, templates and shapes. Include dimensions, material and quantities for a quotation.",
    h1: "Custom CNC Cutting from Your Design Sri Lanka",
  },
  // Round 2 (Oct 2026, SC query mapping Oct 12-22): pages earning
  // impressions on generic queries with low CTR and no override yet.
  // Admin seo_title beats these overrides (see resolveProductSeo).
  // "laser cutting near me" 58/0 pos 6.7; page 462/34 overall.
  "acrylic-laser-cutting-and-engraving": {
    title: "Acrylic Laser Cutting & Engraving in Sri Lanka",
    description:
      "Acrylic laser cutting and engraving in Sri Lanka — custom acrylic shapes, signs and displays cut and engraved to your design. Island-wide delivery.",
    h1: "Acrylic Cutting & Engraving — Laser Cutting in Sri Lanka",
  },
  // "number plate maker near me" 107/0 pos 8.3 — house-plate intent only;
  // vehicle-plate intent is NOT claimed here (no such product).
  "stainless-steel-house-number-plates": {
    title: "Stainless Steel House Number Plates in Sri Lanka",
    description:
      "Stainless steel house number plates in Sri Lanka — engraved, weather-resistant plates for homes, gates and walls. Custom sizes and text.",
    h1: "Stainless Steel House Number Plates in Sri Lanka",
  },
  // "floor sticker price in sri lanka" 26/2 pos 2.6.
  "custom-floor-stickers-and-decals": {
    title: "Custom Floor Stickers & Decals in Sri Lanka",
    description:
      "Custom floor stickers and decals in Sri Lanka — durable floor graphics for shops, offices and events, made to your design and size.",
    h1: "Custom Floor Stickers & Decals in Sri Lanka",
  },
  // "dtf sticker price in sri lanka" 40/3 pos 5.2; page 603/34 overall.
  "uv-dtf-printing": {
    title: "UV DTF Printing in Sri Lanka — A3 Sheets & Stickers",
    description:
      "UV DTF printing in Sri Lanka — detailed A3 transfer sheets and stickers for applying your design to many surfaces. Island-wide delivery.",
    h1: "UV DTF Printing – A3 Sheet",
  },
  // "id card printing" 26/2 pos 8.0.
  "corporate-and-student-id-cards": {
    title: "ID Card Printing in Sri Lanka — Corporate & Student Cards",
    description:
      "ID card printing in Sri Lanka for companies, schools and events — corporate and student ID cards printed to your design.",
    h1: "Corporate and Student ID Cards",
  },
  // "suggestion box" 26/1 pos 3.0.
  "acrylic-suggestions-box-slim-series": {
    title: "Acrylic Suggestion Box in Sri Lanka — Slim Series",
    description:
      "Acrylic suggestion boxes in Sri Lanka — slim-series complaint and suggestion boxes for offices, hotels and clinics.",
    h1: "Acrylic Suggestions Box – Slim Series",
  },
  // "badge making shop near me" 19/2 pos 6.9.
  "acrylic-name-badge": {
    title: "Acrylic Name Badges in Sri Lanka",
    description:
      "Acrylic name badges in Sri Lanka — custom staff, event and company name badges printed with your logo and names.",
    h1: "Acrylic Name Badges",
  },
  // "name board" 62/0 pos 5.1.
  "acrylic-name-plate-holder-removable-type": {
    title: "Acrylic Name Plate Holders in Sri Lanka",
    description:
      "Acrylic name plate holders in Sri Lanka — removable-type desk name plates for offices, reception desks and events.",
    h1: "Acrylic Name Plate Holder – Removable Type",
  },
  // "coasters" 32/0 pos 6.8.
  "wooden-coasters": {
    title: "Wooden Coasters in Sri Lanka",
    description:
      "Wooden coasters in Sri Lanka — custom engraved and printed coasters for homes, cafes, hotels and corporate gifts.",
    h1: "Wooden Coasters",
  },
  // "qr code stand" 13/0 pos 4.8.
  "qr-code-stands": {
    title: "QR Code Stands in Sri Lanka",
    description:
      "QR code stands in Sri Lanka — acrylic stands for menus, payments and promotions in restaurants, shops and events.",
    h1: "QR Code Stands",
  },
  // "keytag printing" 25/0 pos 9.4 (ranking gap, not just snippet).
  "acrylic-key-tags": {
    title: "Acrylic Key Tags Printing in Sri Lanka",
    description:
      "Acrylic key tags in Sri Lanka — custom printed key tags for hotels, gyms, clubs and businesses, with your logo.",
    h1: "Acrylic Key Tags",
  },
  // Inferred from product uniqueness (not in the 20-query SC mapping):
  // "transparent sticker printing" 19/3 — only transparent-sticker product.
  "printed-transparent-stickers": {
    title: "Transparent Sticker Printing in Sri Lanka",
    description:
      "Transparent sticker printing in Sri Lanka — clear stickers for products, packaging and branding that show the surface beneath.",
    h1: "Printed Transparent Stickers",
  },
  // "vinyl sticker" 21/1 — only vinyl product.
  "custom-vinyl-decals": {
    title: "Custom Vinyl Decals & Vinyl Stickers in Sri Lanka",
    description:
      "Custom vinyl decals in Sri Lanka — durable vinyl stickers for vehicles, shopfronts, walls and products, cut to your design.",
    h1: "Custom Vinyl Decals",
  },
  // "glass printing" 10/1 — only glass product.
  "uv-printing-on-glass-ceramic": {
    title: "UV Printing on Glass & Ceramic in Sri Lanka",
    description:
      "UV printing on glass and ceramic in Sri Lanka — decorative panels, glass signage and personalised ceramic pieces.",
    h1: "UV Printing on Glass & Ceramic",
  },
};
