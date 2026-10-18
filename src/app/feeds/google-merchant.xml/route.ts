// Google Merchant Center product feed (RSS 2.0 + g: namespace).
// Served at https://printworks.lk/feeds/google-merchant.xml and registered in
// Merchant Center as a scheduled fetch, so listings stay in sync with the store.
//
// Only products with a real price are included: most Print Works products are
// quote-based (price 0 in the API and on their pages), and Merchant Center
// rejects zero-price items. As more products get priced in the backend, they
// join the feed automatically.

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
const SITE_URL = "https://printworks.lk";
const BRAND = "Print Works.LK";

interface ApiProduct {
  slug?: string;
  name?: string;
  sku?: string;
  description?: string;
  short_description?: string;
  numericPrice?: number | null;
  stock_status?: string;
  image?: string;
  gallery?: string[];
  category?: string;
}

function esc(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function cleanText(value: string): string {
  return value
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function availability(status: string | undefined): string {
  switch (status) {
    case "instock":
      return "in stock";
    case "outofstock":
      return "out of stock";
    case "onbackorder":
      return "backorder";
    default:
      return "in stock";
  }
}

function itemXml(p: ApiProduct): string | null {
  const price = typeof p.numericPrice === "number" ? p.numericPrice : 0;
  if (!p.slug || !p.name || !p.sku || !p.image || price <= 0) return null;

  const description = cleanText(
    [p.short_description, p.description].filter(Boolean).join(" ")
  ).slice(0, 4800);
  const extraImages = (p.gallery ?? [])
    .filter((src) => typeof src === "string" && src !== p.image)
    .slice(0, 3);

  const lines = [
    "  <item>",
    `    <g:id>${esc(p.sku)}</g:id>`,
    `    <g:title>${esc(p.name.slice(0, 150))}</g:title>`,
    `    <g:description>${esc(description)}</g:description>`,
    `    <g:link>${SITE_URL}/product/${esc(p.slug)}</g:link>`,
    `    <g:image_link>${esc(p.image)}</g:image_link>`,
    ...extraImages.map(
      (src) => `    <g:additional_image_link>${esc(src)}</g:additional_image_link>`
    ),
    `    <g:price>${price.toFixed(2)} LKR</g:price>`,
    `    <g:availability>${availability(p.stock_status)}</g:availability>`,
    "    <g:condition>new</g:condition>",
    `    <g:brand>${esc(BRAND)}</g:brand>`,
    `    <g:mpn>${esc(p.sku)}</g:mpn>`,
    ...(p.category
      ? [`    <g:product_type>${esc(p.category)}</g:product_type>`]
      : []),
    "  </item>",
  ];
  return lines.join("\n");
}

export async function GET(): Promise<Response> {
  let products: ApiProduct[] = [];
  try {
    const res = await fetch(`${API_BASE}/api/v1/products`, {
      headers: { Accept: "application/json" },
      next: { revalidate: 3600 },
    });
    if (res.ok) {
      const data = (await res.json()) as ApiProduct[] | { data?: ApiProduct[] };
      products = Array.isArray(data) ? data : (data.data ?? []);
    }
  } catch {
    products = [];
  }

  const items = products
    .map(itemXml)
    .filter((x): x is string => x !== null)
    .join("\n");

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">',
    "<channel>",
    `  <title>${BRAND} — Google Merchant Feed</title>`,
    `  <link>${SITE_URL}</link>`,
    "  <description>Product feed for Google Merchant Center free listings</description>",
    items,
    "</channel>",
    "</rss>",
    "",
  ].join("\n");

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
