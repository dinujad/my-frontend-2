// Deprecated server component. Kept only for backward compatibility:
// /category/[slug] -> redirects to /product-category/[slug]

import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCategoryBySlug, SITE_URL } from "@/lib/products-data";

// Always render fresh so newly-added/updated category descriptions show immediately.
export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
};

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) return { title: "Category Not Found" };

  const page = Math.max(1, parseInt((await searchParams).page ?? "1", 10) || 1);
  const baseUrl = `${SITE_URL}/product-category/${slug}`;
  const canonical = page === 1 ? baseUrl : `${baseUrl}?page=${page}`;

  const title =
    page === 1 ? `${category.name} | Print Works.LK` : `${category.name} (Page ${page}) | Print Works.LK`;
  const descriptionText = category.description || "";
  const description =
    descriptionText.slice(0, 155) + (descriptionText.length > 155 ? "…" : "");

  return {
    title,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      title: `${category.name} | Print Works.LK`,
      description,
      url: baseUrl,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${category.name} | Print Works.LK`,
      description,
    },
  };
}

// No generateStaticParams: avoids API fetch during `next build` (ECONNREFUSED when backend is offline).

export default async function CategoryPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const page = Math.max(1, parseInt((await searchParams).page ?? "1", 10) || 1);
  const query = page > 1 ? `?page=${page}` : "";
  redirect(`/product-category/${slug}${query}`);
}
