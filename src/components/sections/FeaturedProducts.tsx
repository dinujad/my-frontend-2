"use client";

import { useState } from "react";
import Link from "next/link";
import { dispatchProductHover } from "@/components/ai/aiChatCopy";
import { catalogImageSrc, onCatalogImageError } from "@/lib/media-url";

import { PRODUCT_IMAGE_PLACEHOLDER, type ProductItem } from "@/lib/products-data";

const tabs = ["Featured", "On Sale", "Top Rated"];

function formatLkr(amount: number): string {
  return `Rs. ${amount.toLocaleString("en-LK", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function byHomepageOrder(a: ProductItem, b: ProductItem): number {
  return (a.sort_order ?? 0) - (b.sort_order ?? 0) || a.id - b.id;
}

function specialOfferPrices(offer: ProductItem): { main: string; old?: string | null } {
  if (offer.offer_price && offer.offer_price > 0) {
    const main = formatLkr(offer.offer_price);
    if (offer.numericPrice > offer.offer_price) {
      return { main, old: offer.price };
    }
    if (offer.oldPrice) {
      return { main, old: offer.oldPrice };
    }
    return { main };
  }
  return { main: offer.price, old: offer.oldPrice };
}

export function FeaturedProducts({ products = [] }: { products: ProductItem[] }) {
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const [isAnimating, setIsAnimating] = useState(false);

  const featured = products.filter((p) => p.is_featured).sort(byHomepageOrder).slice(0, 8);
  const onSale = products.filter((p) => p.is_on_sale).sort(byHomepageOrder).slice(0, 8);
  const topRated = products.filter((p) => p.is_top_rated).sort(byHomepageOrder).slice(0, 8);
  const specialOffers = products.filter((p) => p.is_special_offer).sort(byHomepageOrder).slice(0, 2);

  const tabData: Record<string, ProductItem[]> = {
    Featured: featured,
    "On Sale": onSale,
    "Top Rated": topRated,
  };

  const currentTabProducts = tabData[activeTab] || [];
  const hasSpecialOffers = specialOffers.length > 0;
  const hasAnyTabProducts = featured.length > 0 || onSale.length > 0 || topRated.length > 0;

  if (!hasSpecialOffers && !hasAnyTabProducts) {
    return null;
  }

  const handleTabChange = (tab: string) => {
    if (tab === activeTab || isAnimating) return;
    setIsAnimating(true);
    setTimeout(() => {
      setActiveTab(tab);
      requestAnimationFrame(() => setIsAnimating(false));
    }, 300);
  };

  return (
    <section className="border-t border-gray-100 bg-white py-10 sm:py-12">
      <div className="mx-auto max-w-[90rem] px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 lg:flex-row">

          {hasSpecialOffers && (
          <div className="relative z-10 mt-3 flex w-full shrink-0 flex-col gap-4 sm:mt-5 lg:ml-6 lg:mt-[48px] lg:w-1/4 lg:gap-6 lg:self-start xl:w-1/5">
              {specialOffers.map((offer) => {
                const prices = specialOfferPrices(offer);
                return (
                  <Link href={`/product/${offer.slug}`} key={offer.id} className="block rounded-xl border border-brand-red bg-white px-4 pb-4 pt-4 transition-shadow duration-300 hover:shadow-lg sm:px-5 sm:pb-5 sm:pt-5 lg:px-6 lg:pb-6 lg:pt-6">
                    <div className="w-full text-left mb-4">
                      <h3 className="text-xl font-normal tracking-wide text-gray-900 sm:text-2xl">Special Offer</h3>
                    </div>
                    <div className="relative w-full flex-grow flex items-center justify-center">
                      <div className="relative w-full pt-[90%]">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={catalogImageSrc(offer.image) || PRODUCT_IMAGE_PLACEHOLDER}
                          alt={offer.title}
                          className="absolute inset-0 h-full w-full object-contain transition-transform duration-500 hover:scale-105 cursor-pointer"
                          loading="lazy"
                          decoding="async"
                          onError={onCatalogImageError}
                        />
                      </div>
                    </div>
                    <div className="text-center w-full px-2 mt-2">
                      <h4 className="mb-4 line-clamp-2 cursor-pointer text-[13px] font-bold leading-tight text-gray-900 transition-colors hover:text-brand-red sm:mb-6">
                        {offer.title}
                      </h4>
                      <div className="flex flex-col items-center gap-1">
                        {prices.old && (
                          <span className="text-sm text-gray-400 line-through">{prices.old}</span>
                        )}
                        <div className="text-[30px] font-normal leading-none tracking-tight text-brand-red sm:text-[34px]">
                          {prices.main}
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
          </div>
          )}

          <div className={`w-full flex flex-col ${hasSpecialOffers ? "lg:w-3/4 xl:w-4/5" : ""}`}>
            <div className="relative mb-5 flex justify-start overflow-x-auto border-b border-gray-200 sm:mb-6 sm:justify-center">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => handleTabChange(tab)}
                  className={`relative shrink-0 px-4 py-3 text-sm font-bold transition-colors duration-300 sm:px-6 lg:text-base ${activeTab === tab ? "text-gray-900" : "text-gray-500 hover:text-gray-900"
                    }`}
                >
                  {tab}
                  <div
                    className={`absolute bottom-[-1px] left-0 w-full h-[3px] bg-brand-red transition-transform duration-300 origin-center ${activeTab === tab ? "scale-x-100 opacity-100" : "scale-x-0 opacity-0"
                      }`}
                  />
                  {activeTab === tab && (
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-brand-red" />
                  )}
                </button>
              ))}
            </div>

            <div className={`flex-1 transition-opacity duration-300 ${isAnimating ? "opacity-0" : "opacity-100"}`}>
              {currentTabProducts.length === 0 ? (
                <div className="rounded-lg border border-gray-100 bg-gray-50 py-16 text-center">
                  <p className="text-sm text-gray-600">No products in {activeTab} right now.</p>
                  <Link
                    href="/products"
                    className="mt-3 inline-block text-sm font-semibold text-brand-red hover:underline"
                  >
                    View all products
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 border-t border-l border-gray-200 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {currentTabProducts.map((product) => (
                    <Link href={`/product/${product.slug}`}
                      key={product.id}
                      className="group relative block flex flex-col border-r border-b border-gray-200 bg-white p-4 transition-shadow duration-300 hover:z-10 hover:shadow-[0_0_20px_rgba(0,0,0,0.08)] sm:p-5"
                    >
                      <div className="mb-2 flex items-center gap-2 flex-wrap">
                        <span className="text-[11px] text-gray-400 font-medium truncate block">
                          {product.category}
                        </span>
                        {product.badge && (
                          <span className="text-[10px] font-bold bg-brand-red text-white px-1.5 py-0.5 rounded">
                            {product.badge}
                          </span>
                        )}
                      </div>

                      <h3
                        className="text-[14px] font-bold text-gray-900 group-hover:underline cursor-pointer tracking-tight leading-snug line-clamp-2 min-h-[40px] mb-4"
                        onMouseEnter={() => dispatchProductHover(product.title)}
                      >
                        {product.title}
                      </h3>

                      <div className="relative aspect-square w-full mb-6 flex items-center justify-center">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={catalogImageSrc(product.image) || PRODUCT_IMAGE_PLACEHOLDER}
                          alt={product.title}
                          className="max-h-full max-w-full object-contain p-4 mix-blend-multiply transition-transform duration-500 group-hover:scale-105 cursor-pointer"
                          loading="lazy"
                          decoding="async"
                          onError={onCatalogImageError}
                        />
                      </div>

                      <div className="mt-auto flex items-end justify-between">
                        <div className="flex flex-col">
                          {product.oldPrice && (
                            <span className="text-[13px] text-gray-400 line-through mb-0.5">
                              {product.oldPrice}
                            </span>
                          )}
                          <span className={`text-lg font-bold ${product.oldPrice ? "text-brand-red" : "text-gray-800"}`}>
                            {product.price}
                          </span>
                        </div>

                        <div onClick={(e) => e.preventDefault()} className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-brand-red hover:text-white transition-colors duration-300">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
