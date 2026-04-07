// Server Component. SEO-friendly category page: /product-category/[slug]
// Includes canonical (base URL for page 1, self for pagination), breadcrumb, product grid, pagination.

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getCategoryBySlug,
  getProductsByCategorySlug,
  SITE_URL,
} from "@/lib/products-data";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { catalogImageSrc } from "@/lib/media-url";

const PRODUCTS_PER_PAGE = 12;

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

export default async function CategoryPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) notFound();

  const page = Math.max(1, parseInt((await searchParams).page ?? "1", 10) || 1);
  const allProducts = await getProductsByCategorySlug(slug);
  const totalPages = Math.max(1, Math.ceil(allProducts.length / PRODUCTS_PER_PAGE));
  const start = (page - 1) * PRODUCTS_PER_PAGE;
  const products = allProducts.slice(start, start + PRODUCTS_PER_PAGE);

  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Products", href: "/products" },
    { label: category.name, href: `/product-category/${slug}` },
  ];

  return (
    <main className="min-h-screen bg-gray-50 pb-12">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Breadcrumbs items={breadcrumbs} />

        <header className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            {category.name}
          </h1>
          {category.description && (
            <p className="mt-4 max-w-2xl text-gray-600 leading-relaxed">
              {category.description}
            </p>
          )}
        </header>

        {products.length === 0 ? (
          <p className="text-gray-500">No products in this category yet.</p>
        ) : (
          <>
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((p) => (
                <li key={p.id}>
                  <Link
                    href={`/product/${p.slug}`}
                    className="group block rounded-xl border border-gray-200 bg-white p-4 transition hover:shadow-lg"
                  >
                    <div className="relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-lg bg-gray-50">
                      {p.image?.trim() ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={catalogImageSrc(p.image)}
                          alt={p.title}
                          className="h-full w-full object-contain transition group-hover:scale-105"
                          loading="lazy"
                          decoding="async"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-xs text-gray-400">
                          No image
                        </div>
                      )}
                    </div>
                    <h2 className="mt-3 font-semibold text-gray-900 group-hover:text-brand-red line-clamp-2">
                      {p.title}
                    </h2>
                    <p className="mt-1 text-lg font-bold text-gray-800">{p.price}</p>
                  </Link>
                </li>
              ))}
            </ul>

            {/* Pagination */}
            {totalPages > 1 && (
              <nav className="mt-12 flex items-center justify-center gap-2" aria-label="Category pagination">
                {page > 1 && (
                  <Link
                    href={page === 2 ? `/product-category/${slug}` : `/product-category/${slug}?page=${page - 1}`}
                    className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Previous
                  </Link>
                )}
                <span className="px-4 py-2 text-sm text-gray-600">
                  Page {page} of {totalPages}
                </span>
                {page < totalPages && (
                  <Link
                    href={`/product-category/${slug}?page=${page + 1}`}
                    className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Next
                  </Link>
                )}
              </nav>
            )}
          </>
        )}
      </div>
    </main>
  );
}

