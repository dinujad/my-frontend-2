// Server Component — no "use client" directive.
// Runs on the server at request time (or build time for static generation).
// Benefits:
//   • Full HTML is sent to the browser → search engines index product names, prices, categories.
//   • Data fetching happens server-side, keeping API keys / secrets out of the client bundle.
//   • When the real Laravel API is ready, replace the static array below with a server fetch.

import type { Metadata } from "next";
import { Suspense } from "react";
import { ProductsClient } from "./ProductsClient";
import { getAllProducts, getAllCategories, type CategoryItem } from "@/lib/products-data";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://printworks.lk";

export const metadata: Metadata = {
  title: "All Products",
  description:
    "Browse our full range of premium printing services, custom acrylic products, signage, stickers, PVC cards, and more. Island-wide delivery across Sri Lanka.",
  alternates: {
    canonical: `${SITE_URL}/products`,
  },
  openGraph: {
    title: "All Products | Print Works.LK",
    description:
      "Browse our full range of premium printing services, custom acrylic products, signage, stickers, PVC cards, and more. Island-wide delivery across Sri Lanka.",
    url: `${SITE_URL}/products`,
    siteName: "Print Works.LK",
    type: "website",
    images: [{ url: `${SITE_URL}/images/logo.png` }],
  },
};

// Shared Product type — exported so ProductsClient can import it.
export type Product = {
  id: number;
  slug: string;
  title: string;
  category: string;
  categorySlug?: string;
  price: string;
  priceRange?: boolean;
  numericPrice: number;
  oldPrice: string | null;
  image: string;
  badge: string | null;
  material?: string | null;
  variantsNote?: string;
};

export default async function ShopPage() {
  const allProducts = await getAllProducts();
  const allCategories = await getAllCategories();
  const products: Product[] = allProducts.map((p) => ({
    id: p.id,
    slug: p.slug,
    title: p.title,
    category: p.category,
    categorySlug: p.categorySlug,
    price: p.price,
    priceRange: p.priceRange,
    numericPrice: p.numericPrice,
    oldPrice: p.oldPrice,
    image: p.image,
    badge: p.badge,
    material: p.material,
    variantsNote: p.variantsNote,
  }));

  // ItemList structured data for the product catalogue (SEO).
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "All Products",
    itemListElement: products.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: p.title,
      url: `${SITE_URL}/product/${p.slug}`,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <Suspense
        fallback={
          <div className="flex min-h-screen items-center justify-center bg-gray-50">
            <p className="text-gray-500">Loading products…</p>
          </div>
        }
      >
        <ProductsClient initialProducts={products} initialCategories={allCategories} />
      </Suspense>
    </>
  );
}
