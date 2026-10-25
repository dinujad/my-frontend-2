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
};
