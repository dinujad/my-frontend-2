"use client";
// Client Component — must stay "use client" because it uses:
//   • useState        — tracks the active tab ("Featured" / "On Sale" / "Top Rated")
//   • setTimeout + requestAnimationFrame — cross-fade animation between tab panels
// Only the tab-switching logic requires the client; static product cards could be server-
// rendered in a future split, but the tab animation tightly couples them for now.

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { dispatchProductHover } from "@/components/ai/aiChatCopy";

import { PRODUCT_IMAGE_PLACEHOLDER, type ProductItem } from "@/lib/products-data";

const tabs = ["Featured", "On Sale", "Top Rated"];

export function FeaturedProducts({ products = [] }: { products: ProductItem[] }) {
    const [activeTab, setActiveTab] = useState(tabs[0]);
    const [isAnimating, setIsAnimating] = useState(false);

    // Compute product lists dynamically
    const featured = [...products].reverse().slice(0, 8); // Latest added products
    
    // On Sale (products with badge or oldPrice)
    const saleItems = products.filter(
        (p) =>
            p.oldPrice ||
            p.badge ||
            (p.price != null && String(p.price).includes("–"))
    );
    const onSale = saleItems.length > 0 ? saleItems.slice(0, 8) : featured;
    
    // Top Rated (fallback to featured if ratings miss)
    const rated = [...products].filter(p => (p.review_summary?.average || 0) > 0).sort((a, b) => (b.review_summary?.average || 0) - (a.review_summary?.average || 0));
    const topRated = rated.length > 0 ? rated.slice(0, 8) : featured;
    
    // Tab content map
    const tabData: Record<string, ProductItem[]> = {
        "Featured": featured,
        "On Sale": onSale,
        "Top Rated": topRated
    };
    
    const currentTabProducts = tabData[activeTab] || featured;

    // Special Offers: Sidebar fallback logic using the top 2 sale items or just first 2
    let specialOffers = saleItems.slice(0, 2);
    if (specialOffers.length < 2) {
       const needed = 2 - specialOffers.length;
       const fallbacks = products.filter(p => !specialOffers.includes(p)).slice(0, needed);
       specialOffers = [...specialOffers, ...fallbacks];
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

                    {/* Left Sidebar - Special Offer */}
                    <div className="relative z-10 mt-3 flex w-full shrink-0 flex-col gap-4 sm:mt-5 lg:ml-6 lg:mt-[48px] lg:w-1/4 lg:gap-6 lg:self-start xl:w-1/5">
                        {specialOffers.map((offer) => (
                            <Link href={`/product/${offer.slug}`} key={offer.id} className="block rounded-xl border border-brand-red bg-white px-4 pb-4 pt-4 transition-shadow duration-300 hover:shadow-lg sm:px-5 sm:pb-5 sm:pt-5 lg:px-6 lg:pb-6 lg:pt-6">

                                <div className="w-full text-left mb-4">
                                    <h3 className="text-xl font-normal tracking-wide text-gray-900 sm:text-2xl">Special Offer</h3>
                                </div>

                                <div className="relative w-full flex-grow flex items-center justify-center">
                                    {/* Constrain aspect ratio nicely tightly to layout */}
                                    <div className="relative w-full pt-[90%]">
                                        <Image
                                            src={offer.image || PRODUCT_IMAGE_PLACEHOLDER}
                                            alt={offer.title}
                                            fill
                                            className="object-contain hover:scale-105 transition-transform duration-500 cursor-pointer"
                                        />
                                    </div>
                                </div>

                                <div className="text-center w-full px-2 mt-2">
                                    <h4 className="mb-4 line-clamp-2 cursor-pointer text-[13px] font-bold leading-tight text-gray-900 transition-colors hover:text-brand-red sm:mb-6">
                                        {offer.title}
                                    </h4>
                                    <div className="text-[30px] font-normal leading-none tracking-tight text-gray-900 sm:text-[34px]">
                                        {offer.price}
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {/* Right Side - Tabs & Grid */}
                    <div className="w-full lg:w-3/4 xl:w-4/5 flex flex-col">

                        {/* Tabs Header */}
                        <div className="relative mb-5 flex justify-start overflow-x-auto border-b border-gray-200 sm:mb-6 sm:justify-center">
                            {tabs.map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => handleTabChange(tab)}
                                    className={`relative shrink-0 px-4 py-3 text-sm font-bold transition-colors duration-300 sm:px-6 lg:text-base ${activeTab === tab ? "text-gray-900" : "text-gray-500 hover:text-gray-900"
                                        }`}
                                >
                                    {tab}
                                    {/* Active Tab Indicator (Yellow line matching screenshot style) */}
                                    <div
                                        className={`absolute bottom-[-1px] left-0 w-full h-[3px] bg-brand-red transition-transform duration-300 origin-center ${activeTab === tab ? "scale-x-100 opacity-100" : "scale-x-0 opacity-0"
                                            }`}
                                    />
                                    {/* Small circle indicator on the line */}
                                    {activeTab === tab && (
                                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-brand-red" />
                                    )}
                                </button>
                            ))}
                        </div>

                        {/* Products Grid */}
                        <div
                            className={`flex-1 transition-opacity duration-300 ${isAnimating ? 'opacity-0' : 'opacity-100'}`}
                        >
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
                                            <Image
                                                src={product.image || PRODUCT_IMAGE_PLACEHOLDER}
                                                alt={product.title}
                                                fill
                                                className="object-contain transition-transform duration-500 group-hover:scale-105 cursor-pointer p-4 mix-blend-multiply"
                                            />
                                        </div>

                                        <div className="mt-auto flex items-end justify-between">
                                            <div className="flex flex-col">
                                                {product.oldPrice && (
                                                    <span className="text-[13px] text-gray-400 line-through mb-0.5">
                                                        {product.oldPrice}
                                                    </span>
                                                )}
                                                <span className={`text-lg font-bold ${product.oldPrice ? 'text-brand-red' : 'text-gray-800'}`}>
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
                        </div>

                    </div>
                </div>
            </div>
        </section>
    );
}
