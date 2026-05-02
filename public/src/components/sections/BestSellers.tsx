"use client";
// Client Component — must stay "use client" because it uses:
//   • onMouseEnter event handler on product titles — dispatches an event to the AI widget.
// Event handler props (onClick, onMouseEnter, etc.) require a Client Component in Next.js
// App Router. The CSS-only marquee animation itself would be fine server-side, but the
// interactive hover handler on each card forces the whole component to be a client boundary.

import Image from "next/image";
import Link from "next/link";
import { dispatchProductHover } from "@/components/ai/aiChatCopy";

import type { ProductItem } from "@/lib/products-data";

function ProductCard({ product }: { product: any }) {
    return (
        <Link href={`/product/${product.slug}`} className="block flex items-center w-[400px] shrink-0 bg-white group hover:-translate-y-1 transition-transform duration-300">
            {/* Left Image Area */}
            <div className="w-[120px] h-[120px] shrink-0 relative flex items-center justify-center p-2 mr-4">
                <Image
                    src={product.image || '/images/placeholder.jpg'}
                    alt={product.title}
                    fill
                    className="object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-105"
                />
            </div>

            {/* Right Text Area */}
            <div className="flex-grow flex flex-col justify-center min-w-0 pr-4">
                <span className="text-[11px] text-gray-400 font-medium mb-1 truncate block">
                    {product.category}
                </span>

                <h3
                    className="text-[14px] font-bold text-gray-900 cursor-pointer hover:underline tracking-tight leading-snug line-clamp-2 mb-3"
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
                        <span className={`text-[16px] font-medium ${product.oldPrice ? 'text-brand-red' : 'text-gray-700'}`}>
                            {product.price}
                        </span>
                    </div>

                    <div onClick={(e) => e.preventDefault()} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 hover:bg-brand-red hover:text-white transition-colors duration-300 shrink-0">
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
        <section className="bg-white py-10 overflow-hidden border-b border-gray-100">
            <div className="mx-auto max-w-[90rem] px-4 sm:px-6 lg:px-8">

                {/* Header Section */}
                <div className="flex items-center justify-between border-b pb-3 mb-8 border-gray-200 relative">
                    <h2 className="text-xl text-gray-800 font-medium">Best Sellers</h2>
                    <button className="px-5 py-1.5 border border-brand-red rounded-full text-sm text-brand-red hover:bg-brand-red hover:text-white transition-colors duration-300">
                        Top 20
                    </button>
                    {/* Yellow line under title */}
                    <div className="absolute left-0 bottom-[-1px] w-[100px] h-[2px] bg-brand-red"></div>
                </div>

                {/* Auto Sliding Container */}
                <div className="flex flex-col gap-6 relative">

                    {/* Row 1 - Scrolls Left */}
                    <div className="w-full relative overflow-hidden flex">
                        <div className="flex gap-4 animate-scroll-x hover:[animation-play-state:paused] w-max">
                            {/* We use exactly 2 arrays so that when the first one scrolls -50%, it seamlessly loops to the exact same start of the second array */}
                            {[...row1Products, ...row1Products].map((product, idx) => (
                                <ProductCard key={`${product.id}-${idx}`} product={product} />
                            ))}
                        </div>
                    </div>

                    {/* Row 2 - Scrolls Left (slightly offset or slower) */}
                    <div className="w-full relative overflow-hidden flex">
                        {/* We offset animation delay so they don't look perfectly identical. We could also just reverse it or change duration */}
                        <div className="flex gap-4 animate-scroll-x-reverse hover:[animation-play-state:paused] w-max">
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
