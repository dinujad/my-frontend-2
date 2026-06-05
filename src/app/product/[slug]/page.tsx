// Server Component. SEO-friendly product detail page: /product/[slug]
// Premium layout: gallery + summary, tabs (Description / Reviews), related products.

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { clsx } from "clsx";
import {
  getProductBySlug,
  getRelatedProducts,
  getCategoryBySlug,
  SITE_URL,
} from "@/lib/products-data";
import type { ProductItem } from "@/lib/products-data";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { absolutePublicMediaUrl } from "@/lib/media-url";
import ProductInteractive from "./ProductInteractive";
import ProductGallery from "./ProductGallery";
import ProductDetailsTabs from "@/components/product/ProductDetailsTabs";
import { ProductDescriptionReadMore } from "@/components/product/ProductDescriptionReadMore";
import { RelatedProductsSection } from "@/components/product/RelatedProductsSection";
import StarRating from "@/components/product/StarRating";

// Always render fresh so product updates (incl. customization settings) show immediately.
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

type Props = { params: Promise<{ slug: string }> };

function isPageSettingOn(value: unknown): boolean {
  return value === true || value === 1 || value === "1";
}

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
              alt: product.image_alt?.trim() || product.title,
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

  const hideShortDesc = isPageSettingOn(product.page_settings?.hide_short_desc);
  const shortText = (product.short_description?.trim() || "").trim();
  const showShortDesc = !hideShortDesc && shortText.length > 0;
  const hideFullDesc = isPageSettingOn(product.page_settings?.hide_full_desc);
  const descriptionText = (product.description?.trim() || "").trim();
  const showFullDesc = !hideFullDesc && descriptionText.length > 0;
  const hideRelated = isPageSettingOn(product.page_settings?.hide_related);
  const showRelated = related.length > 0 && !hideRelated;
  const enableReviews = product.enable_reviews !== false;
  const reviewSummary = product.review_summary ?? { average: 0, count: 0 };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <main className="relative min-h-screen bg-[#f4f3f6] pb-40 md:pb-16">
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-[28rem] bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(220,38,38,0.07),transparent)]"
          aria-hidden
        />

        <div className="relative mx-auto max-w-7xl px-3 py-5 sm:px-6 sm:py-8 lg:px-8 lg:py-12">
          <Breadcrumbs items={breadcrumbs} />

          <div className="grid gap-6 sm:gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:gap-12 xl:gap-16 lg:items-start">
            <div className="lg:sticky lg:top-24">
              <ProductGallery
                title={product.title}
                image={product.image ?? ""}
                imageAlt={product.image_alt}
                gallery={product.gallery}
                galleryItems={product.gallery_items}
                badge={product.badge}
              />
            </div>

            <div className="flex flex-col">
              <div className="overflow-hidden rounded-2xl border border-gray-200/70 bg-white shadow-[0_25px_80px_-32px_rgba(15,23,42,0.14)] sm:rounded-3xl">
                <div className="border-b border-gray-100 bg-gradient-to-r from-slate-50/80 via-white to-white px-4 py-5 sm:px-7 sm:py-6 lg:px-8">
                  {product.page_settings?.hide_categories != 1 && category ? (
                    <Link
                      href={`/product-category/${product.categorySlug}`}
                      className="inline-flex items-center gap-1.5 rounded-full border border-brand-red/15 bg-brand-red/5 px-3 py-1 text-xs font-bold uppercase tracking-wide text-brand-red transition hover:border-brand-red/30 hover:bg-brand-red/10"
                    >
                      <i className="bi bi-tag-fill text-[10px]" aria-hidden />
                      {category.name}
                    </Link>
                  ) : null}

                  <h1 className="mt-3 text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl lg:text-[2.15rem] lg:leading-[1.15]">
                    {product.title}
                  </h1>

                  {showShortDesc ? (
                    <p className="mt-2 text-base leading-relaxed text-gray-600 sm:text-[15px]">{shortText}</p>
                  ) : null}

                  {enableReviews && reviewSummary.count > 0 ? (
                    <div className="mt-3 flex flex-wrap items-center gap-3">
                      <StarRating rating={reviewSummary.average} size="md" />
                      <span className="text-sm font-medium text-gray-600">
                        {reviewSummary.average.toFixed(1)} · {reviewSummary.count} review
                        {reviewSummary.count === 1 ? "" : "s"}
                      </span>
                    </div>
                  ) : null}

                  <div className="mt-4 flex flex-wrap gap-2">
                    {product.page_settings?.hide_sku != 1 && product.sku ? (
                      <span className="inline-flex items-center gap-1.5 rounded-lg bg-gray-100/80 px-2.5 py-1 text-xs font-medium text-gray-600">
                        <i className="bi bi-upc-scan text-gray-400" aria-hidden />
                        SKU: {product.sku}
                      </span>
                    ) : null}
                    {product.material ? (
                      <span className="inline-flex items-center gap-1.5 rounded-lg bg-gray-100/80 px-2.5 py-1 text-xs font-medium text-gray-600">
                        <i className="bi bi-layers text-gray-400" aria-hidden />
                        {product.material}
                      </span>
                    ) : null}
                  </div>

                  {product.variantsNote ? (
                    <p className="mt-3 text-sm text-gray-500">{product.variantsNote}</p>
                  ) : null}
                </div>

                <div className="px-4 sm:px-7 lg:px-8">
                  <ProductInteractive product={product} />
                </div>
              </div>

              <ul className="mt-5 grid grid-cols-3 gap-2 sm:gap-3" aria-label="Store benefits">
                {[
                  { icon: "bi-shield-check", label: "Quality prints" },
                  { icon: "bi-truck", label: "Island-wide delivery" },
                  { icon: "bi-headset", label: "Expert support" },
                ].map((item) => (
                  <li
                    key={item.label}
                    className="flex flex-col items-center rounded-xl border border-gray-200/70 bg-white px-2 py-3 text-center shadow-sm sm:rounded-2xl sm:px-3 sm:py-4"
                  >
                    <i className={clsx("bi mb-1.5 text-lg text-brand-red sm:text-xl", item.icon)} aria-hidden />
                    <span className="text-[10px] font-semibold leading-tight text-gray-600 sm:text-xs">{item.label}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {showFullDesc ? (
            <ProductDescriptionReadMore description={descriptionText} />
          ) : null}

          <ProductDetailsTabs
            slug={product.slug}
            enableReviews={enableReviews}
            initialSummary={reviewSummary}
          />
        </div>

        {showRelated ? (
          <div className="relative mt-16 border-t border-gray-200/80 bg-white pb-16 pt-12 sm:mt-20 sm:pb-20 sm:pt-16">
            <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
              <RelatedProductsSection products={related} variant="footer" />
            </div>
          </div>
        ) : null}
      </main>
    </>
  );
}
