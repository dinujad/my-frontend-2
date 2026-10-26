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
import { getCategoryContent } from "@/data/category-content";
import { categorySeoOverrides } from "@/data/category-seo";
import { PayzyInstallment } from "@/components/payzy/PayzyInstallment";
import { htmlTitle, nonblank, socialTitle } from "@/lib/seo-metadata";

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

  // Admin SEO fields win, then curated overrides, then the category name.
  // The root layout template appends " | Print Works.LK".
  const categorySeo = categorySeoOverrides[slug];
  const baseTitle = nonblank(category.seo_title) ?? categorySeo?.title ?? `${category.name} in Sri Lanka`;
  const title = page === 1 ? baseTitle : `${baseTitle} (Page ${page})`;
  const sharedTitle = page === 1 ? socialTitle(baseTitle) : `${socialTitle(baseTitle)} (Page ${page})`;
  const descriptionText = nonblank(category.seo_description) ?? categorySeo?.description ?? category.description ?? "";
  const description =
    descriptionText.slice(0, 155) + (descriptionText.length > 155 ? "…" : "");

  return {
    title: page === 1 ? htmlTitle(title) : { absolute: sharedTitle },
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      title: sharedTitle,
      description,
      url: canonical,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: sharedTitle,
      description,
    },
  };
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) notFound();

  const page = Math.max(1, parseInt((await searchParams).page ?? "1", 10) || 1);
  // SEO buying-guide + FAQ content (page 1 only), from src/data/category-content.ts.
  const content = page === 1 ? getCategoryContent(slug) : undefined;
  const allProducts = await getProductsByCategorySlug(slug);
  const totalPages = Math.max(1, Math.ceil(allProducts.length / PRODUCTS_PER_PAGE));
  if (page > totalPages) notFound();
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
                    {p.numericPrice > 0 ? (
                      <p className="mt-1 text-lg font-bold text-gray-800">{p.price}</p>
                    ) : (
                      <p className="mt-1 text-lg font-bold text-gray-800">Price on request</p>
                    )}
                    {p.numericPrice > 0 ? <PayzyInstallment goods={p.numericPrice} /> : null}
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

        {content && (
          <section
            className="mt-16 border-t border-gray-200 pt-10"
            aria-label={`About ${category.name}`}
          >
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                  "@context": "https://schema.org",
                  "@type": "FAQPage",
                  mainEntity: content.faqs.map((f) => ({
                    "@type": "Question",
                    name: f.q,
                    acceptedAnswer: { "@type": "Answer", text: f.a },
                  })),
                }),
              }}
            />
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">
              {category.name} in Sri Lanka
            </h2>
            <p className="mt-4 max-w-3xl leading-relaxed text-gray-600">{content.intro}</p>

            {content.sections.map((s) => (
              <div key={s.heading} className="mt-8">
                <h3 className="text-lg font-semibold text-gray-900">{s.heading}</h3>
                {s.paragraphs.map((p, i) => (
                  <p key={i} className="mt-3 max-w-3xl leading-relaxed text-gray-600">
                    {p}
                  </p>
                ))}
              </div>
            ))}

            <div className="mt-10">
              <h2 className="text-2xl font-bold tracking-tight text-gray-900">
                {category.name} — Frequently Asked Questions
              </h2>
              {content.faqs.map((f) => (
                <div key={f.q} className="mt-6">
                  <h3 className="font-semibold text-gray-900">{f.q}</h3>
                  <p className="mt-2 max-w-3xl leading-relaxed text-gray-600">{f.a}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

