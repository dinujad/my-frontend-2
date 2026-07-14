"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { CategoryItem } from "@/lib/products-data";
import { catalogImageSrc, onCatalogImageError } from "@/lib/media-url";
import { PRODUCT_IMAGE_PLACEHOLDER } from "@/lib/products-data";

type SearchSuggestion = {
  id: number;
  name: string;
  slug: string;
  sku: string;
  image: string;
  price: string;
  category: string;
};

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  );
}

function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M7 10l5 5 5-5H7z" />
    </svg>
  );
}

type Props = {
  categories: CategoryItem[];
  className?: string;
};

export function HeaderSearchBar({ categories, className = "" }: Props) {
  const router = useRouter();
  const rootRef = useRef<HTMLDivElement>(null);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [selectedCategorySlug, setSelectedCategorySlug] = useState("");
  const [selectedCategoryLabel, setSelectedCategoryLabel] = useState("All Categories");
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [suggestionsOpen, setSuggestionsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!categoryOpen) return;
    const close = () => setCategoryOpen(false);
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, [categoryOpen]);

  useEffect(() => {
    const handlePointerDown = (e: MouseEvent) => {
      const el = rootRef.current;
      if (el && !el.contains(e.target as Node)) {
        setSuggestionsOpen(false);
      }
    };
    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, []);

  useEffect(() => {
    const q = searchQuery.trim();
    if (q.length < 2) {
      setSuggestions([]);
      setSuggestionsOpen(false);
      return;
    }

    const t = setTimeout(async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({ q });
        if (selectedCategorySlug) {
          params.set("category", selectedCategorySlug);
        }
        const res = await fetch(`/api/v1/products/search?${params.toString()}`);
        if (!res.ok) {
          setSuggestions([]);
          setSuggestionsOpen(false);
          return;
        }
        const data = (await res.json()) as SearchSuggestion[];
        setSuggestions(Array.isArray(data) ? data : []);
        setSuggestionsOpen(true);
      } catch {
        setSuggestions([]);
        setSuggestionsOpen(false);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(t);
  }, [searchQuery, selectedCategorySlug]);

  const buildResultsUrl = (q: string) => {
    const params = new URLSearchParams();
    if (q.trim()) params.set("q", q.trim());
    params.set("category", selectedCategorySlug || "all");
    return `/products?${params.toString()}`;
  };

  const goToResults = (q: string) => {
    const trimmed = q.trim();
    if (!trimmed) return;
    setSuggestionsOpen(false);
    router.push(buildResultsUrl(trimmed));
  };

  const selectCategory = (slug: string, label: string) => {
    setSelectedCategorySlug(slug);
    setSelectedCategoryLabel(label);
    setCategoryOpen(false);
    if (searchQuery.trim().length >= 2) {
      setSuggestionsOpen(true);
    }
  };

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <form
        action="/products"
        method="get"
        className="group flex h-12 overflow-hidden rounded-full border-2 border-gray-200 bg-white shadow-[0_2px_10px_rgb(0,0,0,0.02)] transition-all focus-within:border-brand-red focus-within:shadow-[0_4px_20px_rgb(255,31,64,0.1)] hover:border-gray-300"
        onSubmit={(e) => {
          e.preventDefault();
          goToResults(searchQuery);
        }}
      >
        <div className="relative flex-shrink-0 border-r-2 border-gray-100 bg-gray-50/50 transition-colors group-hover:bg-gray-50">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setCategoryOpen((o) => !o);
            }}
            className="flex h-full items-center gap-1.5 px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
            aria-haspopup="listbox"
            aria-expanded={categoryOpen}
          >
            <span className="max-w-[7.5rem] truncate sm:max-w-[9rem]">{selectedCategoryLabel}</span>
            <ChevronDownIcon className="h-4 w-4 shrink-0 text-gray-400" />
          </button>
          {categoryOpen && (
            <div
              className="absolute left-0 top-full z-[60] mt-1 max-h-72 w-56 overflow-y-auto rounded-lg border border-gray-200 bg-white py-1 shadow-lg"
              role="listbox"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="border-l-4 border-brand-red pl-3">
                <button
                  type="button"
                  role="option"
                  className="block w-full border-b border-gray-100 py-2.5 pr-2 text-left text-sm text-gray-800 hover:bg-gray-50"
                  onClick={() => selectCategory("", "All Categories")}
                >
                  All Categories
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.slug}
                    type="button"
                    role="option"
                    className="block w-full border-b border-gray-100 py-2.5 pr-2 text-left text-sm text-gray-800 hover:bg-gray-50"
                    onClick={() => selectCategory(cat.slug, cat.name)}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>
          )}
          <input type="hidden" name="category" value={selectedCategorySlug || "all"} />
        </div>
        <input
          type="search"
          name="q"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => {
            if (searchQuery.trim().length >= 2 && suggestions.length > 0) {
              setSuggestionsOpen(true);
            }
          }}
          placeholder="Search for a product, category, or brand..."
          className="min-w-0 flex-1 bg-transparent px-5 text-sm font-medium text-gray-900 placeholder-gray-400 outline-none"
          aria-label="Search"
          aria-autocomplete="list"
          aria-expanded={suggestionsOpen}
          aria-controls="header-search-suggestions"
          autoComplete="off"
        />
        <div className="p-1">
          <button
            type="submit"
            className="flex h-full w-12 items-center justify-center rounded-full bg-brand-red text-white shadow-sm transition-all hover:bg-brand-red-dark hover:shadow-md active:scale-95"
            aria-label="Search"
          >
            <SearchIcon className="h-5 w-5" />
          </button>
        </div>
      </form>

      {suggestionsOpen && searchQuery.trim().length >= 2 && (
        <div
          id="header-search-suggestions"
          role="listbox"
          className="absolute left-0 right-0 top-full z-[60] mt-2 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl"
        >
          {loading && suggestions.length === 0 ? (
            <p className="px-4 py-3 text-sm text-gray-500">Searching…</p>
          ) : suggestions.length === 0 ? (
            <p className="px-4 py-3 text-sm text-gray-500">No products found. Try another keyword.</p>
          ) : (
            <ul className="max-h-80 overflow-y-auto py-1">
              {suggestions.map((p) => (
                <li key={p.id} role="option">
                  <Link
                    href={`/product/${p.slug}`}
                    className="flex items-center gap-3 px-4 py-2.5 transition hover:bg-red-50"
                    onClick={() => setSuggestionsOpen(false)}
                  >
                    {p.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={catalogImageSrc(p.image) || PRODUCT_IMAGE_PLACEHOLDER}
                        alt=""
                        className="h-11 w-11 shrink-0 rounded-lg border border-gray-100 bg-white object-contain p-0.5"
                        onError={onCatalogImageError}
                      />
                    ) : (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={PRODUCT_IMAGE_PLACEHOLDER}
                        alt=""
                        className="h-11 w-11 shrink-0 rounded-lg border border-gray-100 bg-white object-contain p-0.5"
                      />
                    )}
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold text-gray-900">{p.name}</span>
                      <span className="block truncate text-xs text-gray-500">
                        {p.category}
                        {p.sku ? ` · ${p.sku}` : ""}
                      </span>
                    </span>
                    <span className="shrink-0 text-sm font-bold text-brand-red">{p.price}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
          <div className="border-t border-gray-100 bg-gray-50/80 px-4 py-2.5">
            <button
              type="button"
              className="w-full text-center text-sm font-semibold text-brand-red hover:underline"
              onClick={() => goToResults(searchQuery)}
            >
              View all results for &ldquo;{searchQuery.trim()}&rdquo;
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
