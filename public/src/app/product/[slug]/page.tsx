// Server Component. SEO-friendly product detail page: /product/[slug]
// Premium layout: gallery + summary, tabs (Description / Reviews), related products.

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getProductBySlug,
  getRelatedProducts,
  getCategoryBySlug,
  SITE_URL,
} from "@/lib/products-data";
import type { ProductItem } from "@/lib/products-data";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { absolutePublicMediaUrl, catalogImageSrc } from "@/lib/media-url";
import ProductInteractive from "./ProductInteractive";
import ProductGallery from "./ProductGallery";
import ProductDetailsTabs from "@/components/product/ProductDetailsTabs";
import StarRating from "@/components/product/StarRating";

// Always render fresh so product updates (incl. customization settings) show immediately.
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

type Props = { params: Promise<{ slug: string }> };

function metaDescription(product: ProductItem): string {
  const short = product.short_description?.trim();
  const long = product.description?.trim() ?? "";
  const base = short || long || product.title;
  return base.slice(0, 155) + (base.length > 155 ? "…" : "");
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Product Not Found" };

  const canonical = `${SITE_URL}/product/${product.slug}`;
  const title = `${product.title} | Print Works.LK`;
  const description = metaDescription(product);

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      type: "website",
      images: product.image?.trim()
        ? [
            {
              url: absolutePublicMediaUrl(product.image, SITE_URL),
              width: 800,
              height: 800,
              alt: product.title,
            },
          ]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

// Intentionally no `generateStaticParams()` here.
// Keeping this page dynamic ensures admin updates (like customization settings)
// show on the product page immediately without requiring a rebuild.

function schemaAvailability(p: ProductItem): string {
  if (p.stock_status === "outofstock") return "https://schema.org/OutOfStock";
  if (p.stock_status === "onbackorder" || p.stock_status === "preorder") {
    return "https://schema.org/BackOrder";
  }
  if (
    p.manage_stock &&
    p.stock_quantity != null &&
    p.stock_quantity <= 0 &&
    !p.allow_backorders
  ) {
    return "https://schema.org/OutOfStock";
  }
  return "https://schema.org/InStock";
}

function buildProductSchema(product: ProductItem): object {
  const imageUrl = product.image?.trim()
    ? absolutePublicMediaUrl(product.image, SITE_URL)
    : "";
  const productUrl = `${SITE_URL}/product/${product.slug}`;
  const priceValue = product.numericPrice;
  const rs = product.review_summary;

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${productUrl}#product`,
    name: product.title,
    description: product.description || product.short_description || product.title,
    ...(imageUrl ? { image: imageUrl } : {}),
    sku: product.sku,
    brand: {
      "@type": "Brand",
      name: "Print Works.LK",
    },
    ...(rs && rs.count > 0
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: rs.average,
            reviewCount: rs.count,
            bestRating: 5,
            worstRating: 1,
          },
        }
      : {}),
    offers: {
      "@type": "Offer",
      url: productUrl,
      priceCurrency: "LKR",
      price: priceValue,
      availability: schemaAvailability(product),
      seller: {
        "@type": "Organization",
        name: "Print Works.LK",
      },
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const category = await getCategoryBySlug(product.categorySlug || "");
  const related = await getRelatedProducts(product, 4);
  const schema = buildProductSchema(product);

  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Products", href: "/products" },
    { label: category?.name ?? product.category, href: `/product-category/${product.categorySlug}` },
    { label: product.title, href: `/product/${product.slug}` },
  ];

  const hideShort = product.page_settings?.hide_short_desc == 1;
  const shortText = (product.short_description?.trim() || "").trim();
  const showShort = !hideShort && shortText.length > 0;
  const enableReviews = product.enable_reviews !== false;
  const reviewSummary = product.review_summary ?? { average: 0, count: 0 };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <main className="relative min-h-screen bg-[#f6f5f8] pb-28 md:pb-16">
        {/* subtle top gradient */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-96 bg-gradient-to-b from-violet-100/40 via-transparent to-transparent" aria-hidden />

        <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
          <Breadcrumbs items={breadcrumbs} />

          <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-14 lg:items-start">
            {/* Gallery */}
            <div className="lg:sticky lg:top-24">
              <ProductGallery
                title={product.title}
                image={product.image ?? ""}
                gallery={product.gallery}
                badge={product.badge}
              />
            </div>

            {/* Product summary */}
            <div className="flex flex-col">
              <div className="rounded-3xl border border-white/60 bg-white/90 p-6 shadow-[0_25px_80px_-32px_rgba(15,23,42,0.18)] backdrop-blur-md sm:p-8">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl lg:text-[2.35rem] lg:leading-tight">
                  {product.title}
                </h1>

                {enableReviews && reviewSummary.count > 0 ? (
                  <div className="mt-3 flex flex-wrap items-center gap-3">
                    <StarRating rating={reviewSummary.average} size="md" />
                    <span className="text-sm font-medium text-gray-600">
                      {reviewSummary.average.toFixed(1)} · {reviewSummary.count} review
                      {reviewSummary.count === 1 ? "" : "s"}
                    </span>
                  </div>
                ) : null}

                {!(product.page_settings?.hide_sku == 1 && product.page_settings?.hide_categories == 1) && (
                  <p className="mt-3 text-sm text-gray-500">
                    {product.page_settings?.hide_sku != 1 && <>SKU: {product.sku}</>}
                    {product.page_settings?.hide_categories != 1 && category && (
                      <>
                        {product.page_settings?.hide_sku != 1 ? " · " : ""}
                        <Link
                          href={`/product-category/${product.categorySlug}`}
                          className="font-medium text-brand-red transition hover:text-brand-red-dark hover:underline"
                        >
                          {category.name}
                        </Link>
                      </>
                    )}
                  </p>
                )}

                {product.material && (
                  <p className="mt-2 text-sm font-medium text-gray-700">
                    Material: <span className="text-gray-900">{product.material}</span>
                  </p>
                )}

                {showShort ? (
                  <p className="mt-5 rounded-2xl border border-gray-100 bg-gradient-to-br from-slate-50/90 to-white px-5 py-4 text-[15px] leading-relaxed text-gray-700">
                    {shortText}
                  </p>
                ) : null}

                {product.variantsNote ? (
                  <p className="mt-4 text-sm text-gray-500">{product.variantsNote}</p>
                ) : null}

                <ProductInteractive product={product} />
              </div>
            </div>
          </div>

          {/* Description + Reviews tabs */}
          <ProductDetailsTabs
            slug={product.slug}
            longDescription={product.description ?? ""}
            enableReviews={enableReviews}
            initialSummary={reviewSummary}
          />

          {/* Related */}
          {related.length > 0 && product.page_settings?.hide_related != 1 && (
            <section className="mt-16 border-t border-gray-200/80 pt-12">
              <h2 className="text-xl font-bold tracking-tight text-gray-900 sm:text-2xl">
                You may also like
              </h2>
              <ul className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {related.map((p) => (
                  <li key={p.id}>
                    <Link
                      href={`/product/${p.slug}`}
                      className="group block rounded-2xl border border-gray-200/80 bg-white p-4 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                    >
                      <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-gray-50 ring-1 ring-gray-100">
                        {p.image?.trim() ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={catalogImageSrc(p.image)}
                            alt={p.title}
                            className="h-full w-full object-contain p-2 transition duration-500 group-hover:scale-[1.03]"
                            loading="lazy"
                            decoding="async"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-xs text-gray-400">
                            No image
                          </div>
                        )}
                      </div>
                      <h3 className="mt-3 font-semibold text-gray-900 transition group-hover:text-brand-red">
                        {p.title}
                      </h3>
                      <p className="mt-1 text-lg font-bold text-gray-800">{p.price}</p>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </main>
    </>
  );
}
