// Per-category SEO overrides, keyed by category slug.
//
// Category titles/descriptions otherwise come straight from the backend
// category data (name + description). These overrides exist for the two
// category pages Search Console shows earning the most impressions on
// generic queries with click-through far below their positions:
// digital-printing (1,191 impressions, 0.3% CTR) and
// sticker-printing-cutting (760 impressions, 1.4% CTR) in Oct 12-22, 2026.
// The override is search-snippet only: the visible page header still uses
// the backend category name + description.
//
// Copy rules (same as the product pack): British English, real facts only —
// no invented prices, turnaround times, minimums or guarantees.

export interface CategorySeoOverride {
  /** Bare title — the root layout template appends " | Print Works.LK". */
  title: string;
  /** Meta description, ~155 characters, query-led. */
  description: string;
}

export const categorySeoOverrides: Record<string, CategorySeoOverride> = {
  "digital-printing": {
    title: "Digital Printing in Sri Lanka",
    description:
      "Digital printing in Sri Lanka — brochures, flyers, posters and large-format printing for businesses, events and bespoke jobs. Island-wide delivery.",
  },
  "sticker-printing-cutting": {
    title: "Sticker Printing & Cutting in Sri Lanka",
    description:
      "Sticker printing and cutting in Sri Lanka — custom logo stickers, laptop stickers, vinyl decals, floor stickers and labels, die-cut and kiss-cut.",
  },
};
