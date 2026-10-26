// Dynamic sitemap for SEO. Only indexable URLs: home, products, categories, product detail pages.
// Blog entries can be added when blog exists.

import type { MetadataRoute } from "next";
import { SITE_URL, getSitemapCatalog } from "@/lib/products-data";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = SITE_URL;

  const staticPages: MetadataRoute.Sitemap = [
    { url: base, changeFrequency: "daily", priority: 1 },
    { url: `${base}/products`, changeFrequency: "daily", priority: 0.9 },
    { url: `${base}/about`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/career`, changeFrequency: "weekly", priority: 0.65 },
    { url: `${base}/contact`, changeFrequency: "monthly", priority: 0.6 },
    // NOTE: /faq intentionally omitted — the route does not exist (404).
    // Re-add here only if an FAQ page (with FAQPage schema) is restored.
  ];

  // Omit lastmod until reliable content modification dates are available.
  const { categories, products } = await getSitemapCatalog();
  const catSlugs = [...new Set(categories.map((c) => c.slug))];
  const categoryPages: MetadataRoute.Sitemap = catSlugs.map((slug) => ({
    url: `${base}/product-category/${slug}`,
    changeFrequency: "weekly" as const,
    priority: 0.85,
  }));

  const prodSlugs = [...new Set(products.map((p) => p.slug))];
  const productPages: MetadataRoute.Sitemap = prodSlugs.map((slug) => ({
    url: `${base}/product/${slug}`,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [...staticPages, ...categoryPages, ...productPages];
}
