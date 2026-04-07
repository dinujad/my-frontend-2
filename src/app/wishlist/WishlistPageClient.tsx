"use client";

import Link from "next/link";
import { useWishlistStore } from "@/stores/wishlist-store";
import { catalogImageSrc } from "@/lib/media-url";

export default function WishlistPageClient() {
  const items = useWishlistStore((s) => s.items);
  const remove = useWishlistStore((s) => s.remove);

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-gray-50 pb-16 pt-8">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-gray-200 bg-white p-10 shadow-sm">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-brand-red/10 text-brand-red">
              <i className="bi bi-heart text-4xl" aria-hidden />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Your wishlist is empty</h1>
            <p className="mt-2 text-gray-600">
              Save products you love — click the heart on any product page.
            </p>
            <Link
              href="/products"
              className="mt-8 inline-flex items-center justify-center gap-2 rounded-xl bg-brand-red px-8 py-3.5 font-semibold text-white shadow-lg shadow-brand-red/25 transition hover:bg-red-700"
            >
              <i className="bi bi-grid-3x3-gap" aria-hidden />
              Browse products
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 pb-16 pt-8">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900">Wishlist</h1>
        <p className="mt-1 text-sm text-gray-600">{items.length} saved</p>

        <ul className="mt-8 space-y-4">
          {items.map((item) => (
            <li
              key={item.id}
              className="flex gap-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm"
            >
              <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-gray-100">
                {item.image?.trim() ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={catalogImageSrc(item.image)}
                    alt=""
                    className="h-full w-full object-contain p-2"
                    loading="lazy"
                    decoding="async"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-gray-400">
                    <i className="bi bi-image text-2xl" aria-hidden />
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                {item.slug ? (
                  <Link
                    href={`/product/${item.slug}`}
                    className="font-semibold text-gray-900 hover:text-brand-red"
                  >
                    {item.name}
                  </Link>
                ) : (
                  <span className="font-semibold text-gray-900">{item.name}</span>
                )}
                <p className="mt-1 text-sm text-gray-600">
                  Rs. {item.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {item.slug && (
                    <Link
                      href={`/product/${item.slug}`}
                      className="text-sm font-medium text-brand-red hover:underline"
                    >
                      View product
                    </Link>
                  )}
                  <button
                    type="button"
                    onClick={() => remove(item.id)}
                    className="text-sm font-medium text-red-600 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
