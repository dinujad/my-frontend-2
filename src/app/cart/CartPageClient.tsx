"use client";

import Link from "next/link";
import { useCartStore, type CartItem } from "@/stores/cart-store";
import { catalogImageSrc } from "@/lib/media-url";

function lineTotal(item: CartItem): number {
  return (item.price + item.customization_fee) * item.quantity;
}

export default function CartPageClient() {
  const items = useCartStore((s) => s.items);
  const removeItem = useCartStore((s) => s.removeItem);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const clearCart = useCartStore((s) => s.clearCart);

  const subtotal = items.reduce((sum, i) => sum + lineTotal(i), 0);

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-gray-50 pb-16 pt-8">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-gray-200 bg-white p-10 shadow-sm">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-brand-red/10 text-brand-red">
              <i className="bi bi-cart-x text-4xl" aria-hidden />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Your cart is empty</h1>
            <p className="mt-2 text-gray-600">
              Add products from the shop — we&apos;ll hold them here for you.
            </p>
            <Link
              href="/products"
              className="mt-8 inline-flex items-center justify-center gap-2 rounded-xl bg-brand-red px-8 py-3.5 font-semibold text-white shadow-lg shadow-brand-red/25 transition hover:bg-red-700"
            >
              <i className="bi bi-grid-3x3-gap" aria-hidden />
              Browse all products
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 pb-16 pt-8">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Shopping cart</h1>
            <p className="mt-1 text-sm text-gray-600">
              {items.length} {items.length === 1 ? "item" : "items"}
            </p>
          </div>
          <button
            type="button"
            onClick={() => clearCart()}
            className="self-start text-sm font-medium text-red-600 hover:text-red-700 sm:self-auto"
          >
            Clear cart
          </button>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          <ul className="space-y-4 lg:col-span-2">
            {items.map((item) => (
              <li
                key={item.id}
                className="flex gap-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm"
              >
                <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-xl bg-gray-100">
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
                  <h2 className="font-semibold text-gray-900">{item.name}</h2>
                  <p className="mt-1 text-sm text-gray-600">
                    Rs. {item.price.toLocaleString(undefined, { minimumFractionDigits: 2 })} each
                    {item.customization_fee > 0 && (
                      <span className="text-brand-red">
                        {" "}
                        + Rs.{" "}
                        {item.customization_fee.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                        })}{" "}
                        customization / unit
                      </span>
                    )}
                  </p>

                  {item.customizations && Object.keys(item.customizations).length > 0 && (
                    <ul className="mt-2 space-y-0.5 text-xs text-gray-500">
                      {Object.entries(item.customizations).map(([k, v]) => (
                        <li key={k}>
                          <span className="font-medium text-gray-600">{k}:</span> {v}
                        </li>
                      ))}
                    </ul>
                  )}
                  {item.customization_files && item.customization_files.length > 0 && (
                    <p className="mt-2 text-xs text-gray-500">
                      <i className="bi bi-paperclip me-1" aria-hidden />
                      {item.customization_files.length} file(s) attached for printing
                    </p>
                  )}

                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    <div className="flex items-center rounded-lg border border-gray-200">
                      <button
                        type="button"
                        aria-label="Decrease quantity"
                        className="px-3 py-1.5 text-gray-600 hover:bg-gray-50"
                        onClick={() =>
                          updateQuantity(item.id, Math.max(1, item.quantity - 1))
                        }
                      >
                        −
                      </button>
                      <span className="min-w-[2rem] text-center text-sm font-semibold">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        aria-label="Increase quantity"
                        className="px-3 py-1.5 text-gray-600 hover:bg-gray-50"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        +
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="text-sm font-medium text-red-600 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                </div>

                <div className="shrink-0 text-right">
                  <p className="text-sm font-semibold text-gray-900">
                    Rs.{" "}
                    {lineTotal(item).toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                    })}
                  </p>
                </div>
              </li>
            ))}
          </ul>

          <aside className="lg:col-span-1">
            <div className="sticky top-24 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900">Order summary</h2>
              <div className="mt-4 flex justify-between border-b border-gray-100 pb-4 text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-semibold text-gray-900">
                  Rs. {subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
              </div>
              <p className="mt-3 text-xs text-gray-500">
                Shipping and taxes calculated at checkout.
              </p>
              <Link
                href="/checkout"
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-brand-red py-3.5 font-semibold text-white shadow-lg shadow-brand-red/25 transition hover:bg-red-700"
              >
                Proceed to checkout
                <i className="bi bi-arrow-right" aria-hidden />
              </Link>
              <Link
                href="/products"
                className="mt-3 block w-full text-center text-sm font-medium text-brand-red hover:underline"
              >
                Continue shopping
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
