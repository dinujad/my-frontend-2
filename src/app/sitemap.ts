// Dynamic sitemap for SEO. Only indexable URLs: home, products, categories, product detail pages, blog.
// Blog entries come from the posts data in src/lib/blog-posts.ts.

import type { MetadataRoute } from "next";
import { SITE_URL, getSitemapCatalog } from "@/lib/products-data";
import { blogPosts } from "@/lib/blog-posts";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = SITE_URL;

  const staticPages: MetadataRoute.Sitemap = [
    { url: base, changeFrequency: "daily", priority: 1 },
    { url: `${base}/products`, changeFrequency: "daily", priority: 0.9 },
    { url: `${base}/about`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/career`, changeFrequency: "weekly", priority: 0.65 },
    { url: `${base}/contact`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/blog`, changeFrequency: "weekly", priority: 0.7 },
    // NOTE: /faq intentionally omitted — the route does not exist (404).
    // Re-add here only if an FAQ page (with FAQPage schema) is restored.
  ];

  // lastmod from the API's updated_at where available. Static pages carry
  // no reliable modification date, so they omit lastmod rather than
  // inventing one.
  const { categories, products } = await getSitemapCatalog();
  const catSlugs = [...new Set(categories.map((c) => c.slug))];
  const categoryPages: MetadataRoute.Sitemap = catSlugs.map((slug) => {
    const cat = categories.find((c) => c.slug === slug);
    return {
      url: `${base}/product-category/${slug}`,
      ...(cat?.updated_at ? { lastModified: new Date(cat.updated_at) } : {}),
      changeFrequency: "weekly" as const,
      priority: 0.85,
    };
  });

  const prodSlugs = [...new Set(products.map((p) => p.slug))];
  const productPages: MetadataRoute.Sitemap = prodSlugs.map((slug) => {
    const prod = products.find((p) => p.slug === slug);
    return {
      url: `${base}/product/${slug}`,
      ...(prod?.updated_at ? { lastModified: new Date(prod.updated_at) } : {}),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    };
  });

  const blogPages: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${base}/blog/${post.slug}`,
    lastModified: new Date(`${post.datePublished}T00:00:00+05:30`),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...categoryPages, ...productPages, ...blogPages];
}
