"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import type { CategoryItem } from "@/lib/products-data";
import { catalogImageSrc, onCatalogImageError } from "@/lib/media-url";
import { PRODUCT_IMAGE_PLACEHOLDER } from "@/lib/products-data";

type PreviewProduct = {
  id: number;
  slug: string;
  title: string;
  name?: string;
  price: string;
  image: string;
};

type Props = {
  categories: CategoryItem[];
  /** Menu panel visible (mobile toggle / desktop hover) */
  open: boolean;
  isHomePage?: boolean;
  onNavigate?: () => void;
};

export function DepartmentsMegaMenu({ categories, open, isHomePage, onNavigate }: Props) {
  const [activeSlug, setActiveSlug] = useState<string | null>(null);
  const [products, setProducts] = useState<PreviewProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [mobilePreviewSlug, setMobilePreviewSlug] = useState<string | null>(null);
  const cacheRef = useRef<Record<string, PreviewProduct[]>>({});
  const loadIdRef = useRef(0);

  const activeCategory = categories.find((c) => c.slug === activeSlug);
  const showProductPanel = activeSlug !== null && (isHomePage ? hovered : open);

  const loadProducts = useCallback(async (slug: string) => {
    const loadId = ++loadIdRef.current;
    setActiveSlug(slug);
    if (cacheRef.current[slug]) {
      setProducts(cacheRef.current[slug]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setProducts([]);
    try {
      const res = await fetch(`/api/v1/products/by-category/${encodeURIComponent(slug)}`, {
        cache: "no-store",
      });
      if (loadId !== loadIdRef.current) return;
      if (!res.ok) {
        setProducts([]);
        return;
      }
      const data = (await res.json()) as PreviewProduct[];
      if (loadId !== loadIdRef.current) return;
      const list = Array.isArray(data) ? data.slice(0, 8) : [];
      cacheRef.current[slug] = list;
      setProducts(list);
    } catch {
      if (loadId !== loadIdRef.current) return;
      setProducts([]);
    } finally {
      if (loadId === loadIdRef.current) setLoading(false);
    }
  }, []);

  const handleMenuLeave = useCallback(() => {
    setHovered(false);
    loadIdRef.current += 1;
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!open && !isHomePage) {
      loadIdRef.current += 1;
      setLoading(false);
    }
  }, [open, isHomePage]);

  useEffect(() => {
    if ((!open && !isHomePage) || categories.length === 0) return;
    if (isHomePage && !hovered) return;
    const first = categories[0].slug;
    if (!activeSlug || !categories.some((c) => c.slug === activeSlug)) {
      loadProducts(first);
    }
  }, [open, isHomePage, hovered, categories, activeSlug, loadProducts]);

  const handleCategoryHover = (slug: string) => {
    if (typeof window !== "undefined" && window.matchMedia("(min-width: 768px)").matches) {
      loadProducts(slug);
    }
  };

  const handleArrowClick = (slug: string) => {
    const isDesktop =
      typeof window !== "undefined" && window.matchMedia("(min-width: 768px)").matches;
    if (isDesktop) {
      loadProducts(slug);
      return;
    }
    setMobilePreviewSlug((prev) => {
      const next = prev === slug ? null : slug;
      if (next) loadProducts(slug);
      return next;
    });
  };

  const panelVisible = open || isHomePage;

  return (
    <div
      id="departments-menu"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleMenuLeave}
      className={`absolute left-0 top-full z-50 border border-gray-100 bg-white text-sm shadow-[0_12px_40px_rgb(0,0,0,0.12)] ${
        panelVisible ? "block" : "hidden"
      } w-full ${isHomePage && !showProductPanel ? "md:w-[300px]" : "md:w-[min(920px,calc(100vw-2rem))]"} ${isHomePage ? "md:block" : ""}`}
    >
      <div className="flex flex-col md:flex-row md:max-h-[min(70vh,520px)]">
        {/* Categories */}
        <aside className="md:w-[300px] md:shrink-0 md:border-r md:border-gray-100 md:overflow-y-auto">
          <div className="divide-y divide-gray-50">
            {categories.map((cat) => {
              const isActive = activeSlug === cat.slug;
              const showMobileProducts = mobilePreviewSlug === cat.slug;
              return (
                <div key={cat.slug}>
                  <div
                    className={`flex items-stretch transition-colors ${
                      isActive ? "bg-brand-red/5" : "hover:bg-gray-50"
                    }`}
                    onMouseEnter={() => handleCategoryHover(cat.slug)}
                  >
                    <Link
                      href={`/product-category/${encodeURIComponent(cat.slug)}`}
                      onClick={onNavigate}
                      className={`min-w-0 flex-1 px-5 py-3.5 font-medium leading-snug transition-colors ${
                        isActive ? "text-brand-red" : "text-gray-700 hover:text-brand-red"
                      }`}
                    >
                      {cat.name}
                    </Link>
                    <button
                      type="button"
                      className={`flex shrink-0 items-center justify-center px-4 transition-colors ${
                        isActive ? "text-brand-red" : "text-gray-300 hover:bg-gray-100 hover:text-brand-red"
                      }`}
                      aria-label={`Show products in ${cat.name}`}
                      onClick={(e) => {
                        e.preventDefault();
                        handleArrowClick(cat.slug);
                      }}
                    >
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                  {/* Mobile inline preview */}
                  {showMobileProducts && (
                    <div className="border-t border-gray-100 bg-gray-50/80 p-3 md:hidden">
                      <MobileProductList
                        products={products}
                        loading={loading && activeSlug === cat.slug}
                        categorySlug={cat.slug}
                        categoryName={cat.name}
                        onNavigate={onNavigate}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </aside>

        {/* Desktop product preview — only while menu is hovered (home) or open */}
        {showProductPanel && (
          <section className="hidden min-w-0 flex-1 flex-col md:flex md:overflow-hidden">
            <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50/60 px-5 py-3">
              <p className="text-sm font-bold text-gray-900">
                {activeCategory?.name ?? "Products"}
              </p>
              {activeSlug && (
                <Link
                  href={`/product-category/${encodeURIComponent(activeSlug)}`}
                  onClick={onNavigate}
                  className="text-xs font-semibold text-brand-red hover:underline"
                >
                  View all →
                </Link>
              )}
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              {loading ? (
                <div className="grid grid-cols-2 gap-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="animate-pulse rounded-xl border border-gray-100 bg-white p-3">
                      <div className="aspect-square rounded-lg bg-gray-200" />
                      <div className="mt-2 h-3 rounded bg-gray-200" />
                      <div className="mt-1 h-3 w-2/3 rounded bg-gray-100" />
                    </div>
                  ))}
                </div>
              ) : products.length === 0 ? (
                <p className="py-12 text-center text-sm text-gray-500">No products in this category yet.</p>
              ) : (
                <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
                  {products.map((p) => (
                    <ProductPreviewCard key={p.id} product={p} onNavigate={onNavigate} />
                  ))}
                </div>
              )}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

function ProductPreviewCard({
  product,
  onNavigate,
}: {
  product: PreviewProduct;
  onNavigate?: () => void;
}) {
  const title = product.title || product.name || "Product";
  const img = catalogImageSrc(product.image) || PRODUCT_IMAGE_PLACEHOLDER;

  return (
    <Link
      href={`/product/${product.slug}`}
      onClick={onNavigate}
      className="group flex flex-col overflow-hidden rounded-xl border border-gray-100 bg-white p-2.5 shadow-sm transition hover:border-brand-red/30 hover:shadow-md"
    >
      <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-50">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={img}
          alt={title}
          className="h-full w-full object-contain p-1 transition duration-300 group-hover:scale-105"
          loading="lazy"
          onError={onCatalogImageError}
        />
      </div>
      <p className="mt-2 line-clamp-2 text-xs font-semibold leading-tight text-gray-900 group-hover:text-brand-red">
        {title}
      </p>
      <p className="mt-1 text-xs font-bold text-brand-red">{product.price}</p>
    </Link>
  );
}

function MobileProductList({
  products,
  loading,
  categorySlug,
  categoryName,
  onNavigate,
}: {
  products: PreviewProduct[];
  loading: boolean;
  categorySlug: string;
  categoryName: string;
  onNavigate?: () => void;
}) {
  if (loading) {
    return <p className="text-center text-xs text-gray-500 py-4">Loading…</p>;
  }
  if (products.length === 0) {
    return <p className="text-center text-xs text-gray-500 py-4">No products yet.</p>;
  }
  return (
    <div className="space-y-2">
      <div className="grid grid-cols-2 gap-2">
        {products.slice(0, 4).map((p) => (
          <ProductPreviewCard key={p.id} product={p} onNavigate={onNavigate} />
        ))}
      </div>
      <Link
        href={`/product-category/${encodeURIComponent(categorySlug)}`}
        onClick={onNavigate}
        className="block text-center text-xs font-semibold text-brand-red"
      >
        View all {categoryName} →
      </Link>
    </div>
  );
}
