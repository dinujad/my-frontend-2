"use client";
// Client Component — must stay "use client" because it uses:
//   • useCartStore / useWishlistStore  — Zustand stores (browser runtime state)
//   • useState                         — mobile menu, category dropdown, search query
//   • useEffect + window / document    — resize listener, body scroll lock, click-outside
//   • usePathname                      — active-link highlighting (Next.js client hook)
// None of these can run on the server.

import Link from "next/link";
import Image from "next/image";
import { useCartStore } from "@/stores/cart-store";
import { useWishlistStore } from "@/stores/wishlist-store";
import { useQuoteCartStore } from "@/stores/quote-cart-store";
import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { getAllCategories, type CategoryItem } from "@/lib/products-data";
import { useAuthStore } from "@/stores/auth-store";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/products", label: "All Products" },
  { href: "/contact", label: "Contact" },
  { href: "/about", label: "About us" },
  { href: "/quote", label: "Request a Quote" },
  { href: "/career", label: "Career" },
];

function BuildingIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M12 2L2 10v12h6v-6h4v6h6V10L12 2zm0 2.5l5.5 4.5V20h-2v-6H8.5v6h-2V9L12 4.5z" />
    </svg>
  );
}

function PhoneIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
    </svg>
  );
}

function LocationIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
    </svg>
  );
}

function CartIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 01-8 0" />
    </svg>
  );
}

function HeartIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

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

function BurgerIcon({ open }: { open: boolean }) {
  return (
    <span className="relative block h-5 w-6" aria-hidden>
      <span
        className={`absolute left-0 block h-0.5 w-full bg-current transition-all duration-200 ${open ? "top-2.5 w-full rotate-45" : "top-0"
          }`}
      />
      <span
        className={`absolute left-0 top-2.5 block h-0.5 bg-current transition-all duration-200 ${open ? "w-0 opacity-0" : "w-full opacity-100"
          }`}
      />
      <span
        className={`absolute left-0 block h-0.5 w-full bg-current transition-all duration-200 ${open ? "top-2.5 w-full -rotate-45" : "top-5"
          }`}
      />
    </span>
  );
}

export function Header() {
  const cartCount = useCartStore((s) => s.items.length);
  const wishlistCount = useWishlistStore((s) => s.items.length);
  const quoteCount = useQuoteCartStore((s) => s.items.reduce((sum, i) => sum + i.quantity, 0));
  const { isAuthenticated, logout } = useAuthStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [searchQuery, setSearchQuery] = useState("");
  const [shopCategoriesOpen, setShopCategoriesOpen] = useState(false);
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const [departments, setDepartments] = useState<CategoryItem[]>([]);
  const departmentsNavRef = useRef<HTMLDivElement>(null);

  // Department list (names + slugs) from backend API so adding a new category
  // in admin automatically shows up in the header menu on next page load.
  useEffect(() => {
    let cancelled = false;
    getAllCategories()
      .then((cats) => {
        if (cancelled) return;
        setDepartments(cats ?? []);
      })
      .catch(() => {
        if (cancelled) return;
        setDepartments([]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Close menu on resize to desktop
  useEffect(() => {
    const handler = () => {
      if (window.innerWidth >= 768) setMenuOpen(false);
    };
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  // Prevent body scroll when menu open
  useEffect(() => {
    if (menuOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  // Close category dropdown on click outside
  useEffect(() => {
    if (!categoryOpen) return;
    const close = () => setCategoryOpen(false);
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, [categoryOpen]);

  useEffect(() => {
    setShopCategoriesOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!shopCategoriesOpen) return;
    const handlePointerDown = (e: MouseEvent | TouchEvent) => {
      const el = departmentsNavRef.current;
      if (el && !el.contains(e.target as Node)) {
        setShopCategoriesOpen(false);
      }
    };
    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("touchstart", handlePointerDown, { passive: true });
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("touchstart", handlePointerDown);
    };
  }, [shopCategoriesOpen]);

  if (pathname?.startsWith("/admin")) return null;

  return (
    <header className="w-full" suppressHydrationWarning>
      {/* Top info bar - hidden on mobile */}
      {/* suppressHydrationWarning: some browser extensions inject attrs (e.g. bis_skin_checked) and cause false hydration mismatches */}
      <div
        className="hidden bg-gradient-to-r from-gray-900 via-nav-dark to-gray-900 text-white md:block border-b border-white/10"
        suppressHydrationWarning
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2.5 text-xs font-medium tracking-wide">
          <div className="flex items-center gap-3">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-red/20 text-brand-red">
              <BuildingIcon className="h-3.5 w-3.5" />
            </span>
            <span className="text-gray-200">Hello, Welcome to Print Works.LK website</span>
          </div>
          <div className="flex items-center gap-5">
            <div className="flex gap-1.5">
              <a href="#" className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 transition hover:bg-white/30" aria-label="Facebook">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
              </a>
              <a href="#" className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 transition hover:bg-white/30" aria-label="Twitter">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
              </a>
              <a href="#" className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 transition hover:bg-white/30" aria-label="Instagram">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.766 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" /></svg>
              </a>
              <a href="#" className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 transition hover:bg-white/30" aria-label="Skype">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden><path d="M11.857 16.462c1.543 0 2.857-.509 3.857-1.375v.825c0 2.18-2.17 3.946-4.857 3.946-1.6 0-3.028-.6-4.086-1.543l.857-.857c.857.771 2.057 1.286 3.229 1.286 1.714 0 3.143-1.2 3.143-2.714v-.086c-.6.514-1.371.857-2.314.857-2.057 0-3.686-1.714-3.686-3.857 0-.857.286-1.629.771-2.229v-.086c.943.6 2.057.943 3.171.943zm.857-5.314h.857c1.2 0 2.314.343 3.257.943.086-.6.086-1.2.086-1.8 0-2.914-2.4-5.314-5.314-5.314H9.857C6.943 6.891 4.543 9.291 4.543 12.205c0 2.914 2.4 5.314 5.314 5.314h2.857c2.914 0 5.314-2.4 5.314-5.314 0-.6 0-1.2-.086-1.8-.943-.6-2.057-.943-3.257-.943h-.857z" /></svg>
              </a>
            </div>
            <div className="h-4 w-px bg-white/20" />
            <Link
              href="/consultation"
              className="group flex items-center gap-2 rounded-full bg-brand-red/10 px-4 py-1.5 text-brand-red transition hover:bg-brand-red hover:text-white"
            >
              <span className="font-bold">Free Consultation</span>
              <svg className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      {/* Logo | Search | Wishlist & Cart */}
      <div className="border-b border-gray-200 bg-gray-50">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 sm:py-4">
          {/* Logo (left) */}
          <div className="flex min-w-0 shrink-0 items-center gap-3 md:gap-4">
            <button
              type="button"
              onClick={() => setMenuOpen((o) => !o)}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-nav-dark transition hover:bg-gray-200 md:hidden"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
            >
              <BurgerIcon open={menuOpen} />
            </button>
            <Link
              href="/"
              className="flex shrink-0 transition-opacity hover:opacity-90"
            >
              <Image
                src="/images/logo.png"
                alt="Print Works.LK"
                width={180}
                height={72}
                className="h-11 w-auto object-contain object-left sm:h-12 md:h-14"
                priority
              />
            </Link>
          </div>

          {/* Search bar (center) - hidden on mobile */}
          <div className="hidden min-w-0 flex-1 md:block md:max-w-xl lg:max-w-2xl px-4 lg:px-8">
            <form
              action="/products"
              method="get"
              className="group flex h-12 overflow-hidden rounded-full border-2 border-gray-200 bg-white shadow-[0_2px_10px_rgb(0,0,0,0.02)] transition-all focus-within:border-brand-red focus-within:shadow-[0_4px_20px_rgb(255,31,64,0.1)] hover:border-gray-300"
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
                  <span className="truncate">{selectedCategory}</span>
                  <ChevronDownIcon className="h-4 w-4 shrink-0 text-gray-400" />
                </button>
                {categoryOpen && (
                  <div
                    className="absolute left-0 top-full z-50 mt-1 max-h-72 w-56 overflow-y-auto rounded-lg border border-gray-200 bg-white py-1 shadow-lg"
                    role="listbox"
                    onClick={(e) => e.stopPropagation()}
                    suppressHydrationWarning
                  >
                    <div className="border-l-4 border-brand-red pl-3">
                      <button
                        type="button"
                        role="option"
                        className="block w-full border-b border-gray-100 py-2.5 pr-2 text-left text-sm text-gray-800 hover:bg-gray-50"
                        onClick={() => {
                          setSelectedCategory("All Categories");
                          setCategoryOpen(false);
                        }}
                      >
                        All Categories
                      </button>
                      {departments.map((cat) => (
                        <button
                          key={cat.slug}
                          type="button"
                          role="option"
                          className="block w-full border-b border-gray-100 py-2.5 pr-2 text-left text-sm text-gray-800 hover:bg-gray-50"
                          onClick={() => {
                            setSelectedCategory(cat.name);
                            setCategoryOpen(false);
                          }}
                        >
                          {cat.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                <input type="hidden" name="category" value={selectedCategory === "All Categories" ? "all" : selectedCategory} />
              </div>
              <input
                type="search"
                name="q"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for a product, category, or brand..."
                className="min-w-0 flex-1 bg-transparent px-5 text-sm font-medium text-gray-900 placeholder-gray-400 outline-none"
                aria-label="Search"
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
          </div>

          {/* Right: Auth + Wishlist + Cart - hidden on mobile */}
          <div className="hidden flex-shrink-0 items-center gap-3 md:flex lg:gap-4">
            {/* Auth Buttons */}
            <div className="flex items-center gap-3 border-r border-gray-200 pr-4">
              {isAuthenticated ? (
                <div className="group relative">
                  <Link
                    href="/dashboard"
                    className="flex items-center gap-2 rounded-full bg-gray-100 px-4 py-2 text-sm font-bold text-gray-800 transition-all hover:bg-gray-200"
                  >
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-red text-white text-xs">
                      <i className="bi bi-person-fill"></i>
                    </div>
                    My Account
                  </Link>
                  {/* Dropdown on hover */}
                  <div className="absolute right-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                    <div className="w-48 rounded-xl bg-white border border-gray-100 shadow-xl overflow-hidden text-sm">
                      <Link href="/dashboard" className="block px-4 py-3 text-gray-700 hover:bg-gray-50 font-medium">Dashboard</Link>
                      <Link href="/dashboard/orders" className="block px-4 py-3 text-gray-700 hover:bg-gray-50 font-medium">My Orders</Link>
                      <button onClick={() => logout()} className="block w-full text-left px-4 py-3 text-brand-red hover:bg-red-50 font-medium border-t border-gray-100">Sign Out</button>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="text-sm font-bold text-gray-600 hover:text-brand-red transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="rounded-full bg-brand-red px-5 py-2 text-sm font-bold text-white shadow-sm shadow-brand-red/30 transition-all hover:bg-red-700 hover:shadow-md active:scale-95"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>

            {quoteCount > 0 && (
              <Link
                href="/quote"
                className="group flex flex-col items-center justify-center gap-1 rounded-xl p-2.5 text-indigo-600 transition-all hover:bg-indigo-50 hover:shadow-sm"
                aria-label="Quote request"
              >
                <span className="relative flex items-center justify-center transition-transform group-hover:-translate-y-0.5">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414A1 1 0 0119 9.414V19a2 2 0 01-2 2z" />
                  </svg>
                  <span className="absolute -right-2.5 -top-1.5 flex h-4.5 min-w-[18px] items-center justify-center rounded-full border-2 border-white bg-indigo-600 px-1 text-[9px] font-bold text-white shadow-sm">
                    {quoteCount > 9 ? "9+" : quoteCount}
                  </span>
                </span>
                <span className="text-[11px] font-bold uppercase tracking-wider">Quote</span>
              </Link>
            )}
            <Link
              href="/wishlist"
              className="group flex flex-col items-center justify-center gap-1 rounded-xl p-2.5 text-gray-500 transition-all hover:bg-white hover:text-brand-red hover:shadow-sm"
              aria-label="Wishlist"
            >
              <span className="relative flex items-center justify-center transition-transform group-hover:-translate-y-0.5">
                <HeartIcon className="h-6 w-6" />
                {wishlistCount > 0 && (
                  <span className="absolute -right-2.5 -top-1.5 flex h-4.5 min-w-[18px] items-center justify-center rounded-full border-2 border-white bg-brand-red px-1 text-[9px] font-bold text-white shadow-sm">
                    {wishlistCount}
                  </span>
                )}
              </span>
              <span className="text-[11px] font-bold uppercase tracking-wider">Wishlist</span>
            </Link>
            <div className="h-10 w-px bg-gray-200" />
            <Link
              href="/cart"
              className="group flex flex-col items-center justify-center gap-1 rounded-xl p-2.5 text-gray-500 transition-all hover:bg-white hover:text-brand-red hover:shadow-sm"
              aria-label="Cart"
            >
              <span className="relative flex items-center justify-center transition-transform group-hover:-translate-y-0.5">
                <CartIcon className="h-6 w-6" />
                {cartCount > 0 && (
                  <span className="absolute -right-2.5 -top-1.5 flex h-4.5 min-w-[18px] items-center justify-center rounded-full border-2 border-white bg-brand-red px-1 text-[9px] font-bold text-white shadow-sm">
                    {cartCount}
                  </span>
                )}
              </span>
              <span className="text-[11px] font-bold uppercase tracking-wider">Cart</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main nav bar */}
      <div className="border-b border-gray-200 bg-white">
        <nav
          className="mx-auto flex max-w-7xl items-center relative"
          aria-label="Main navigation"
        >
          {/* Shop By Categories / All Departments */}
          <div
            ref={departmentsNavRef}
            className="group relative w-full shrink-0 md:w-[280px]"
            onMouseEnter={() => !isHomePage && setShopCategoriesOpen(true)}
            onMouseLeave={() => !isHomePage && setShopCategoriesOpen(false)}
          >
            <button
              type="button"
              className="flex h-full w-full items-center gap-3 border-r border-gray-100 bg-brand-red px-6 py-3.5 text-sm font-bold text-white transition-colors hover:bg-brand-red-dark md:text-base"
              aria-expanded={shopCategoriesOpen}
              aria-controls="departments-menu"
              onClick={() => setShopCategoriesOpen((o) => !o)}
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg>
              All Departments
            </button>

            {/* Dropdown: mobile = toggle only; md+ home = always open; md+ other = hover via shopCategoriesOpen */}
            <div
              id="departments-menu"
              className={`absolute left-0 top-full z-50 w-full border-b border-l border-r border-gray-100 bg-white text-sm shadow-[0_8px_30px_rgb(0,0,0,0.08)] ${
                shopCategoriesOpen ? "block" : "hidden"
              } ${isHomePage ? "md:block" : ""}`}
              suppressHydrationWarning
            >
              <div className="flex flex-col w-full relative divide-y divide-gray-50/50">
                {departments.map((cat) => (
                  <Link
                    key={cat.slug}
                    href={`/product-category/${encodeURIComponent(cat.slug)}`}
                    className="flex justify-between items-center px-6 py-[14px] text-gray-700 font-medium hover:text-brand-red transition-colors hover:bg-gray-50 bg-white"
                  >
                    <span>{cat.name}</span>
                    <svg className="h-4 w-4 text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M9 18l6-6-6-6" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Desktop nav links */}
          <div className="hidden flex-1 items-center justify-between pl-8 md:flex pr-4">
            <ul className="flex items-center gap-6">
              {navLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`block py-3 text-sm font-bold transition ${item.href === "/"
                      ? "text-brand-red"
                      : "text-gray-700 hover:text-brand-red"
                      }`}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="flex flex-col items-end text-sm font-bold text-gray-800">
              <span className="text-brand-red text-xs uppercase tracking-wider mb-0.5">Support</span>
              <a href="https://wa.me/94706668885" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-brand-red transition-colors">
                <svg className="w-4 h-4 text-[#25D366]" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg>
                070 666 8885
              </a>
            </div>
          </div>
        </nav>
      </div>

      {/* Mobile menu overlay */}
      <div
        className={`fixed inset-0 z-40 bg-black/50 transition-opacity duration-200 md:hidden ${menuOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
          }`}
        aria-hidden
        onClick={() => setMenuOpen(false)}
      />

      {/* Mobile menu panel */}
      <div
        className={`fixed left-0 top-0 z-50 h-full w-full max-w-sm overflow-y-auto bg-white shadow-xl transition-transform duration-200 ease-out md:hidden ${menuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile menu"
      >
        <div className="flex flex-col gap-1 p-4 pt-6">
          <div className="mb-4 flex items-center justify-between border-b border-gray-200 pb-4">
            <span className="text-sm font-medium text-muted">Menu</span>
            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              className="flex h-10 w-10 items-center justify-center rounded-lg text-nav-dark hover:bg-gray-100"
              aria-label="Close menu"
            >
              <BurgerIcon open={true} />
            </button>
          </div>
          
          <div className="mb-4 flex flex-col gap-2 border-b border-gray-100 pb-4">
            {isAuthenticated ? (
               <>
                 <Link
                   href="/dashboard"
                   onClick={() => setMenuOpen(false)}
                   className="block w-full rounded-xl bg-gray-100 px-4 py-2.5 text-center text-sm font-bold text-gray-800 transition hover:bg-gray-200"
                 >
                   My Account
                 </Link>
                 <button
                   onClick={() => { logout(); setMenuOpen(false); }}
                   className="block w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-center text-sm font-bold text-brand-red transition hover:bg-gray-50"
                 >
                   Sign Out
                 </button>
               </>
            ) : (
               <>
                 <Link
                   href="/login"
                   onClick={() => setMenuOpen(false)}
                   className="block w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-2.5 text-center text-sm font-bold text-gray-700 transition hover:border-gray-300 hover:bg-gray-50"
                 >
                   Login
                 </Link>
                 <Link
                   href="/register"
                   onClick={() => setMenuOpen(false)}
                   className="block w-full rounded-xl bg-brand-red px-4 py-2.5 text-center text-sm font-bold text-white shadow-lg shadow-brand-red/30 transition hover:bg-red-700 active:scale-95"
                 >
                   Register
                 </Link>
               </>
            )}
          </div>

          {navLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              className={`block rounded-lg px-4 py-3 text-base font-medium transition ${item.href === "/"
                ? "bg-brand-red text-white"
                : "text-gray-800 hover:bg-gray-100"
                }`}
            >
              {item.label}
            </Link>
          ))}
          <div className="mt-4 border-t border-gray-200 pt-4">
            <p className="mb-2 px-4 text-xs font-medium uppercase tracking-wide text-muted">
              Contact
            </p>
            <a
              href="tel:0706668885"
              className="block rounded-lg px-4 py-2 text-sm font-medium text-brand-red underline hover:bg-gray-100"
            >
              <span className="font-semibold text-gray-800">Phone:</span> 070 666 8885
            </a>
            <p className="rounded-lg px-4 py-2 text-sm text-gray-700">
              <span className="font-semibold">Hours:</span>{" "}
              <span className="text-brand-red">Closed</span>
              <span className="mx-1">·</span>
              <span>Opens 9 AM Wed</span>
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
