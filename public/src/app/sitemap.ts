// Dynamic sitemap for SEO. Only indexable URLs: home, products, categories, product detail pages.
// Blog entries can be added when blog exists.

import type { MetadataRoute } from "next";
import { SITE_URL, getAllCategorySlugs, getAllProductSlugs } from "@/lib/products-data";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = SITE_URL;

  const staticPages: MetadataRoute.Sitemap = [
    { url: base, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${base}/products`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${base}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/faq`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
  ];

  const catSlugs = await getAllCategorySlugs();
  const categoryPages: MetadataRoute.Sitemap = catSlugs.map((slug) => ({
    url: `${base}/product-category/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.85,
  }));

  const prodSlugs = await getAllProductSlugs();
  const productPages: MetadataRoute.Sitemap = prodSlugs.map((slug) => ({
    url: `${base}/product/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [...staticPages, ...categoryPages, ...productPages];
}
