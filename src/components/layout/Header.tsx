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
import { HeaderSearchBar } from "@/components/layout/HeaderSearchBar";
import { SocialIconLinks } from "@/components/layout/SocialIconLinks";

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
            <SocialIconLinks variant="header" />
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
                className="h-[3.25rem] w-auto max-w-[11rem] object-contain object-left sm:h-12 sm:max-w-none md:h-14"
                priority
              />
            </Link>
          </div>

          {/* Search bar (center) - hidden on mobile */}
          <div className="hidden min-w-0 flex-1 md:block md:max-w-xl lg:max-w-2xl px-4 lg:px-8">
            <HeaderSearchBar categories={departments} />
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

            <div className="flex flex-col items-end gap-1.5 border-l border-gray-200 pl-5">
              <span className="text-xs font-medium text-gray-500">Support</span>
              <div className="flex flex-col items-end gap-1 sm:flex-row sm:items-center sm:gap-4">
                <a
                  href="https://wa.me/94706668885"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-800 transition-colors hover:text-[#25D366]"
                >
                  <svg className="h-4 w-4 shrink-0 text-[#25D366]" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                  </svg>
                  070 666 8885
                </a>
                <a
                  href="mailto:sales@printworks.lk"
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-800 transition-colors hover:text-brand-red"
                >
                  <svg className="h-4 w-4 shrink-0 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  sales@printworks.lk
                </a>
              </div>
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
          <div className="mt-4 border-t border-gray-200 px-4 pt-4">
            <p className="mb-3 text-xs font-medium uppercase tracking-wide text-muted">Follow us</p>
            <SocialIconLinks
              variant="header"
              className="[&_a]:bg-gray-100 [&_a]:text-nav-dark [&_a]:hover:bg-brand-red [&_a]:hover:text-white"
            />
          </div>
          <div className="mt-4 border-t border-gray-200 pt-4">
            <p className="mb-2 px-4 text-xs font-medium uppercase tracking-wide text-muted">
              Contact
            </p>
            <a
              href="https://wa.me/94706668885"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-100"
            >
              <svg className="h-4 w-4 text-[#25D366]" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
              </svg>
              070 666 8885
            </a>
            <a
              href="mailto:sales@printworks.lk"
              className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-100"
            >
              <svg className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              sales@printworks.lk
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
