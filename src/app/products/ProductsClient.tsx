"use client";
// Client Component: requires useState (filter/sort state), useSearchParams (URL query reading),
// and event handlers (onClick, onChange). These APIs are browser-only and cannot run on the server.

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { dispatchProductHover } from "@/components/ai/aiChatCopy";
import { catalogImageSrc } from "@/lib/media-url";
import type { Product } from "./page";
import type { CategoryItem } from "@/lib/products-data";
// Hardcoded categories removed. We use dynamic initialCategories from props.

// Materials are now dynamic, computed from initialProducts

const colors = [
  { name: "Black", bg: "bg-black" },
  { name: "White", bg: "bg-white border border-gray-200" },
  { name: "Red", bg: "bg-red-500" },
  { name: "Blue", bg: "bg-blue-500" },
  { name: "Green", bg: "bg-green-500" },
  { name: "Yellow", bg: "bg-yellow-400" },
  { name: "Silver", bg: "bg-gray-300" },
  { name: "Gold", bg: "bg-yellow-600" },
];

interface ProductsClientProps {
  initialProducts: Product[];
  initialCategories: CategoryItem[];
}

interface ProductsClientInnerProps extends ProductsClientProps {
  categoryQueryParam: string | null;
}

function ProductsClientInner({
  initialProducts,
  initialCategories,
  categoryQueryParam,
}: ProductsClientInnerProps) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    categoryQueryParam && categoryQueryParam !== "all" ? [categoryQueryParam] : []
  );
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);
  const [sortBy, setSortBy] = useState("default");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Derive available materials dynamically
  const initialDynamicMaterials = Array.from(new Set(initialProducts.map(p => p.material).filter(Boolean))) as string[];
  const materials = initialDynamicMaterials.length > 0 ? initialDynamicMaterials : ["Acrylic", "Vinyl", "PVC", "Stainless Steel", "Brass", "Paper", "Fabric"];

  const toggleCategory = (catName: string) => {
    setSelectedCategories((prev) =>
      prev.includes(catName) ? prev.filter((c) => c !== catName) : [...prev, catName]
    );
  };

  const toggleMaterial = (mat: string) => {
    setSelectedMaterials((prev) =>
      prev.includes(mat) ? prev.filter((m) => m !== mat) : [...prev, mat]
    );
  };

  const toggleColor = (color: string) => {
    setSelectedColors((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]
    );
  };

  const clearAllFilters = () => {
    setSelectedCategories([]);
    setSelectedMaterials([]);
    setSelectedColors([]);
    setPriceRange([0, 5000]);
  };

  let filteredProducts = initialProducts.filter((product) => {
    const passesCategory =
      selectedCategories.length === 0 ||
      selectedCategories.some((sc) => product.category.includes(sc));
    const passesMaterial = 
      selectedMaterials.length === 0 ||
      (product.material && selectedMaterials.includes(product.material));
    const passesPrice =
      product.numericPrice >= priceRange[0] && product.numericPrice <= priceRange[1];
    return passesCategory && passesMaterial && passesPrice;
  });

  if (sortBy === "price-low") filteredProducts.sort((a, b) => a.numericPrice - b.numericPrice);
  else if (sortBy === "price-high") filteredProducts.sort((a, b) => b.numericPrice - a.numericPrice);
  else if (sortBy === "name-a") filteredProducts.sort((a, b) => a.title.localeCompare(b.title));
  else if (sortBy === "name-z") filteredProducts.sort((a, b) => b.title.localeCompare(a.title));

  return (
    <main className="min-h-screen bg-gray-50 pb-20">
      {/* Shop Hero Banner */}
      <div className="relative bg-nav-dark py-16 lg:py-24 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <Image
            src="/images/hero_img.webp"
            alt="Shop Banner"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-nav-dark via-nav-dark/95 to-transparent" />
        </div>
        <div className="relative mx-auto max-w-[90rem] px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight mb-4">
            All <span className="text-brand-red">Products</span>
          </h1>
          <p className="text-gray-300 max-w-2xl text-lg mb-8">
            Explore our wide range of premium printing services, corporate gifts, and custom
            creations tailored perfectly for your brand.
          </p>
          <div className="flex items-center gap-2 text-sm font-medium text-gray-400">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-brand-red">Shop</span>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[90rem] px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Mobile Filter Toggle */}
          <div className="lg:hidden flex items-center justify-between mb-4 bg-white p-4 rounded-xl border border-gray-200">
            <button
              onClick={() => setMobileFiltersOpen(true)}
              className="flex items-center gap-2 text-gray-800 font-bold hover:text-brand-red transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                />
              </svg>
              Filter Products
            </button>
            <div className="text-sm text-gray-500 font-medium">{filteredProducts.length} Results</div>
          </div>

          {/* Filter Sidebar */}
          <aside
            className={`fixed inset-0 z-50 lg:static lg:z-auto lg:block w-full lg:w-1/4 xl:w-1/5 shrink-0 bg-white lg:bg-transparent transition-transform duration-300 ease-in-out ${
              mobileFiltersOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
            }`}
          >
            <div className="flex flex-col h-full bg-white lg:border lg:border-gray-200 lg:rounded-2xl overflow-hidden">
              {/* Mobile Header */}
              <div className="lg:hidden flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
                <h2 className="text-lg font-bold text-gray-900">Filters</h2>
                <button
                  onClick={() => setMobileFiltersOpen(false)}
                  className="p-2 text-gray-500 hover:text-gray-900 bg-white rounded-full border border-gray-200"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-5 lg:p-6 space-y-8">
                {/* Clear Filters */}
                {(selectedCategories.length > 0 ||
                  selectedMaterials.length > 0 ||
                  selectedColors.length > 0) && (
                  <div className="pb-4 border-b border-gray-100 text-right">
                    <button
                      onClick={clearAllFilters}
                      className="text-sm font-bold text-brand-red hover:underline"
                    >
                      Clear All Filters
                    </button>
                  </div>
                )}

                {/* Categories */}
                <div>
                  <h3 className="text-base font-bold text-gray-900 mb-4 uppercase tracking-wide">
                    Categories
                  </h3>
                  <div className="space-y-3">
                    {initialCategories.map((cat) => (
                      <label key={cat.slug} className="flex items-center gap-3 cursor-pointer group">
                        <div className="relative flex items-center justify-center w-5 h-5 rounded border border-gray-300 group-hover:border-brand-red transition-colors bg-white">
                          <input
                            type="checkbox"
                            className="peer sr-only"
                            checked={selectedCategories.includes(cat.name)}
                            onChange={() => toggleCategory(cat.name)}
                          />
                          <div className="absolute inset-0 bg-brand-red rounded scale-0 peer-checked:scale-100 transition-transform flex items-center justify-center">
                            <svg
                              className="w-3 h-3 text-white"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={3}
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        </div>
                        <span
                          className={`text-sm transition-colors ${
                            selectedCategories.includes(cat.name)
                              ? "text-brand-red font-medium"
                              : "text-gray-600 group-hover:text-gray-900"
                          }`}
                        >
                          {cat.name}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Price Filter */}
                <div className="pt-6 border-t border-gray-100">
                  <h3 className="text-base font-bold text-gray-900 mb-4 uppercase tracking-wide">
                    Price
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm text-gray-600 font-medium">
                      <span>Rs. {priceRange[0]}</span>
                      <span>Rs. {priceRange[1]}</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="5000"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-red"
                    />
                  </div>
                </div>

                {/* Materials */}
                <div className="pt-6 border-t border-gray-100">
                  <h3 className="text-base font-bold text-gray-900 mb-4 uppercase tracking-wide">
                    Material
                  </h3>
                  <div className="space-y-3">
                    {materials.map((material) => (
                      <label key={material} className="flex items-center gap-3 cursor-pointer group">
                        <div className="relative flex items-center justify-center w-5 h-5 rounded border border-gray-300 group-hover:border-brand-red transition-colors bg-white">
                          <input
                            type="checkbox"
                            className="peer sr-only"
                            checked={selectedMaterials.includes(material)}
                            onChange={() => toggleMaterial(material)}
                          />
                          <div className="absolute inset-0 bg-brand-red rounded scale-0 peer-checked:scale-100 transition-transform flex items-center justify-center">
                            <svg
                              className="w-3 h-3 text-white"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={3}
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        </div>
                        <span
                          className={`text-sm transition-colors ${
                            selectedMaterials.includes(material)
                              ? "text-brand-red font-medium"
                              : "text-gray-600 group-hover:text-gray-900"
                          }`}
                        >
                          {material}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Colors */}
                <div className="pt-6 border-t border-gray-100">
                  <h3 className="text-base font-bold text-gray-900 mb-4 uppercase tracking-wide">
                    Color
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {colors.map((color) => (
                      <button
                        key={color.name}
                        onClick={() => toggleColor(color.name)}
                        className={`w-8 h-8 rounded-full ${color.bg} flex items-center justify-center shadow-sm transition-transform hover:scale-110 ${
                          selectedColors.includes(color.name)
                            ? "ring-2 ring-brand-red ring-offset-2"
                            : ""
                        }`}
                        aria-label={`Color ${color.name}`}
                      >
                        {selectedColors.includes(color.name) && (
                          <svg
                            className={`w-4 h-4 ${
                              color.name === "White" || color.name === "Yellow"
                                ? "text-gray-900"
                                : "text-white"
                            }`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2.5}
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Mobile Apply Button */}
              <div className="lg:hidden p-4 border-t border-gray-200 bg-white">
                <button
                  onClick={() => setMobileFiltersOpen(false)}
                  className="w-full bg-brand-red hover:bg-brand-red-dark text-white font-bold py-3 rounded-xl transition-colors shadow-md shadow-brand-red/20"
                >
                  Show {filteredProducts.length} Results
                </button>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="w-full lg:w-3/4 xl:w-4/5 flex flex-col">
            {/* Top Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between mb-8 pb-4 border-b border-gray-200 gap-4">
              <h2 className="text-xl font-bold text-gray-900">
                {filteredProducts.length}{" "}
                <span className="text-gray-500 font-medium text-base">Results found</span>
              </h2>
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-500">Sort by:</span>
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none bg-white border border-gray-200 text-gray-700 py-2 pl-4 pr-10 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent cursor-pointer hover:border-gray-300 transition-colors"
                  >
                    <option value="default">Default Sorting</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="name-a">Name: A to Z</option>
                    <option value="name-z">Name: Z to A</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Product Grid */}
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 border-t border-l border-gray-200 bg-white">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="group relative flex flex-col bg-white border-r border-b border-gray-200 p-5 hover:shadow-[0_0_20px_rgba(0,0,0,0.08)] hover:z-10 transition-shadow duration-300"
                  >
                    {/* Full-card link: content uses pointer-events-none so clicks reach this layer; cart stays clickable */}
                    {product.slug ? (
                      <Link
                        href={`/product/${product.slug}`}
                        className="absolute inset-0 z-[1]"
                        aria-label={`View ${product.title}`}
                        onMouseEnter={() => dispatchProductHover(product.title)}
                      />
                    ) : null}

                    <div className="pointer-events-none relative z-[2] mb-2 flex flex-wrap items-center gap-2">
                      <span className="block truncate text-[11px] font-medium text-gray-400">
                        {product.category}
                      </span>
                      {product.badge && (
                        <span className="rounded bg-brand-red px-1.5 py-0.5 text-[10px] font-bold text-white">
                          {product.badge}
                        </span>
                      )}
                    </div>

                    <h3 className="pointer-events-none relative z-[2] mb-4 min-h-[40px] cursor-pointer text-[14px] font-bold leading-snug tracking-tight text-gray-900 line-clamp-2 group-hover:underline">
                      {product.title}
                    </h3>

                    <div className="pointer-events-none relative z-[2] mb-6 flex aspect-square w-full items-center justify-center">
                      {product.image?.trim() ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={catalogImageSrc(product.image)}
                          alt={product.title}
                          className="max-h-full max-w-full cursor-pointer object-contain p-4 mix-blend-multiply transition-transform duration-500 group-hover:scale-105"
                          loading="lazy"
                          decoding="async"
                        />
                      ) : (
                        <span className="text-xs text-gray-400">No image</span>
                      )}
                    </div>

                    <div className="relative z-[2] mt-auto flex items-end justify-between">
                      <div className="pointer-events-none flex min-w-0 flex-col">
                        {product.oldPrice && (
                          <span className="mb-0.5 text-[13px] text-gray-400 line-through">
                            {product.oldPrice}
                          </span>
                        )}
                        <span
                          className={`text-lg font-bold ${
                            product.oldPrice ? "text-brand-red" : "text-gray-800"
                          }`}
                        >
                          {product.price}
                        </span>
                        {product.variantsNote && (
                          <span className="mt-1 line-clamp-2 text-[11px] text-gray-500">
                            {product.variantsNote}
                          </span>
                        )}
                      </div>
                      <button
                        type="button"
                        title="Quick add (coming soon)"
                        className="relative z-[3] flex h-10 w-10 pointer-events-auto items-center justify-center rounded-full bg-gray-100 text-gray-500 shadow-sm transition-colors duration-300 hover:bg-brand-red hover:text-white"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                        }}
                      >
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          className="h-5 w-5"
                          aria-hidden
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-white border border-gray-200 rounded-2xl">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                  <svg
                    className="w-10 h-10 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-500 max-w-md mx-auto mb-6">
                  We couldn&apos;t find any products matching your current filters. Try removing some
                  filters to see more results.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="px-6 py-3 bg-brand-red text-white font-bold rounded-xl hover:bg-brand-red-dark transition-colors shadow-md shadow-brand-red/20"
                >
                  Clear all filters
                </button>
              </div>
            )}

            {/* Pagination */}
            {filteredProducts.length > 0 && (
              <div className="flex items-center justify-center mt-12 gap-2">
                <button
                  className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 hover:text-brand-red transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>
                <button className="w-10 h-10 rounded-lg bg-brand-red text-white font-bold flex items-center justify-center shadow-sm">
                  1
                </button>
                <button className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center text-gray-700 font-medium hover:bg-gray-50 transition-colors">
                  2
                </button>
                <button className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center text-gray-700 font-medium hover:bg-gray-50 transition-colors">
                  3
                </button>
                <span className="text-gray-500 px-2">...</span>
                <button className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 hover:text-brand-red transition-colors">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
function ProductsSearchParamsReader(props: ProductsClientProps) {
  const searchParams = useSearchParams();
  return (
    <ProductsClientInner {...props} categoryQueryParam={searchParams.get("category")} />
  );
}

export function ProductsClient(props: ProductsClientProps) {
  return <ProductsSearchParamsReader {...props} />;
}
