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
};
