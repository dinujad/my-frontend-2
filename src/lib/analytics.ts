// GA4 ecommerce event helpers.
// GA4 (G-P3QDWWWHGZ) is installed as a direct gtag in src/app/layout.tsx, so
// events go through window.gtag. Every helper no-ops safely when gtag is
// unavailable (SSR, blocked scripts), so tracking can never break the store.

import { cartLineTotal } from "@/lib/cart-services";
import type { CartItem } from "@/stores/cart-store";

export interface Ga4Item {
  item_id: string;
  item_name: string;
  price?: number;
  quantity?: number;
}

declare global {
  interface Window {
    gtag?: (
      command: string,
      eventName: string,
      params?: Record<string, unknown>
    ) => void;
  }
}

export function trackGa4Event(
  eventName: string,
  params: Record<string, unknown>
): void {
  if (typeof window === "undefined") return;
  if (typeof window.gtag !== "function") return;
  window.gtag("event", eventName, params);
}

/** Map cart items to GA4 items, using the same line-total maths as the cart. */
export function ga4ItemsFromCart(items: CartItem[]): Ga4Item[] {
  return items.map((i) => ({
    item_id: String(i.product_id),
    item_name: i.name,
    price: i.quantity > 0 ? cartLineTotal(i) / i.quantity : cartLineTotal(i),
    quantity: i.quantity,
  }));
}

export function cartValue(items: CartItem[]): number {
  return items.reduce((sum, i) => sum + cartLineTotal(i), 0);
}

export interface PendingPurchase {
  transaction_id: string;
  value: number;
  shipping: number;
  items: Ga4Item[];
}

export function trackPurchase(p: PendingPurchase): void {
  trackGa4Event("purchase", {
    transaction_id: p.transaction_id,
    currency: "LKR",
    value: p.value,
    shipping: p.shipping,
    items: p.items,
  });
}

// Gateway payments (PayHere) leave the site before the order is confirmed, so
// the purchase payload is stashed in sessionStorage at checkout and fired by
// the payment-return page once the payment status reads "paid". Taking the
// stash removes it, which makes double-firing impossible.
const PENDING_PURCHASE_KEY = "pw_pending_purchase";

export function stashPendingPurchase(p: PendingPurchase): void {
  try {
    sessionStorage.setItem(PENDING_PURCHASE_KEY, JSON.stringify(p));
  } catch {
    /* storage unavailable — tracking is best-effort */
  }
}

export function takePendingPurchase(
  transactionId: string
): PendingPurchase | null {
  try {
    const raw = sessionStorage.getItem(PENDING_PURCHASE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as PendingPurchase;
    if (parsed.transaction_id !== transactionId) return null;
    sessionStorage.removeItem(PENDING_PURCHASE_KEY);
    return parsed;
  } catch {
    return null;
  }
}
