"use client";
// Client Component — must stay "use client" because it uses:
//   • onMouseEnter event handler on product titles — dispatches an event to the AI widget.
// Event handler props (onClick, onMouseEnter, etc.) require a Client Component in Next.js
// App Router. The CSS-only marquee animation itself would be fine server-side, but the
// interactive hover handler on each card forces the whole component to be a client boundary.

import Image from "next/image";
import Link from "next/link";
import { dispatchProductHover } from "@/components/ai/aiChatCopy";

import { PRODUCT_IMAGE_PLACEHOLDER, type ProductItem } from "@/lib/products-data";

function ProductCard({ product }: { product: any }) {
    return (
        <Link href={`/product/${product.slug}`} className="group block flex w-[88vw] max-w-[340px] shrink-0 items-center rounded-xl border border-gray-100 bg-white p-2 transition-transform duration-300 hover:-translate-y-1 sm:w-[400px] sm:max-w-none sm:rounded-none sm:border-0 sm:p-0">
            {/* Left Image Area */}
            <div className="relative mr-3 flex h-[96px] w-[96px] shrink-0 items-center justify-center p-1.5 sm:mr-4 sm:h-[120px] sm:w-[120px] sm:p-2">
                <Image
                    src={product.image || PRODUCT_IMAGE_PLACEHOLDER}
                    alt={product.title}
                    fill
                    className="object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-105"
                />
            </div>

            {/* Right Text Area */}
            <div className="flex-grow flex flex-col justify-center min-w-0 pr-4">
                <span className="mb-1 block truncate text-[10px] font-medium text-gray-400 sm:text-[11px]">
                    {product.category}
                </span>

                <h3
                    className="mb-2 line-clamp-2 cursor-pointer text-[13px] font-bold leading-snug tracking-tight text-gray-900 hover:underline sm:mb-3 sm:text-[14px]"
                    onMouseEnter={() => dispatchProductHover(product.title)}
                >
                    {product.title}
                </h3>

                <div className="flex items-center justify-between mt-auto">
                    <div className="flex flex-col">
                        {product.oldPrice && (
                            <span className="text-[11px] text-gray-400 line-through leading-none">
                                {product.oldPrice}
                            </span>
                        )}
                        <span className={`text-[15px] font-medium sm:text-[16px] ${product.oldPrice ? 'text-brand-red' : 'text-gray-700'}`}>
                            {product.price}
                        </span>
                    </div>

                    <div onClick={(e) => e.preventDefault()} className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-400 transition-colors duration-300 hover:bg-brand-red hover:text-white">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                    </div>
                </div>
            </div>
        </Link>
    );
}

export function BestSellers({ products = [] }: { products: ProductItem[] }) {
    // Slicing products safely for continuous marquees. We double the arrays in the JSX for seamless CSS scrolling.
    const midPoint = Math.ceil(products.length / 2);
    
    // If not enough products to populate nicely, just clone them, otherwise split logic
    const row1Products = products.length > 4 ? products.slice(0, midPoint) : products;
    const row2Products = products.length > 4 ? products.slice(midPoint) : [...products].reverse();
    return (
        <section className="overflow-hidden border-b border-gray-100 bg-white py-8 sm:py-10">
            <div className="mx-auto max-w-[90rem] px-4 sm:px-6 lg:px-8">

                {/* Header Section */}
                <div className="relative mb-6 flex items-center justify-between border-b border-gray-200 pb-3 sm:mb-8">
                    <h2 className="text-lg font-medium text-gray-800 sm:text-xl">Best Sellers</h2>
                    <button className="rounded-full border border-brand-red px-4 py-1.5 text-xs text-brand-red transition-colors duration-300 hover:bg-brand-red hover:text-white sm:px-5 sm:text-sm">
                        Top 20
                    </button>
                    {/* Yellow line under title */}
                    <div className="absolute left-0 bottom-[-1px] w-[100px] h-[2px] bg-brand-red"></div>
                </div>

                {/* Auto Sliding Container */}
                <div className="relative flex flex-col gap-4 sm:gap-6">

                    {/* Row 1 - Scrolls Left */}
                    <div className="w-full relative overflow-hidden flex">
                        <div className="flex w-max gap-3 animate-scroll-x hover:[animation-play-state:paused] sm:gap-4">
                            {/* We use exactly 2 arrays so that when the first one scrolls -50%, it seamlessly loops to the exact same start of the second array */}
                            {[...row1Products, ...row1Products].map((product, idx) => (
                                <ProductCard key={`${product.id}-${idx}`} product={product} />
                            ))}
                        </div>
                    </div>

                    {/* Row 2 - Scrolls Left (slightly offset or slower) */}
                    <div className="w-full relative overflow-hidden flex">
                        {/* We offset animation delay so they don't look perfectly identical. We could also just reverse it or change duration */}
                        <div className="flex w-max gap-3 animate-scroll-x-reverse hover:[animation-play-state:paused] sm:gap-4">
                            {[...row2Products, ...row2Products].map((product, idx) => (
                                <ProductCard key={`${product.id}-${idx}`} product={product} />
                            ))}
                        </div>
                    </div>

                </div>

                {/* Pagination Dots */}
                <div className="flex justify-center mt-8 gap-2">
                    <div className="w-[30px] h-[4px] bg-brand-red rounded-full cursor-pointer"></div>
                    <div className="w-[10px] h-[4px] bg-gray-300 hover:bg-brand-red rounded-full cursor-pointer transition-colors"></div>
                    <div className="w-[10px] h-[4px] bg-gray-300 hover:bg-brand-red rounded-full cursor-pointer transition-colors"></div>
                </div>

            </div>
        </section>
    );
}
