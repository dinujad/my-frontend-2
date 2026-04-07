import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface QuoteCartItem {
  /** Unique key in the cart: product_id + variation_id */
  id: string;
  product_id: number;
  product_variation_id?: number | null;
  product_name: string;
  product_sku?: string;
  product_image?: string;
  product_slug?: string;
  variation_attributes?: Record<string, string> | null;
  quantity: number;
  item_notes?: string;
}

interface QuoteCartStore {
  items: QuoteCartItem[];
  addItem: (item: Omit<QuoteCartItem, "id"> & { id?: string }) => void;
  updateItem: (id: string, changes: Partial<QuoteCartItem>) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  totalItems: () => number;
  hasItem: (productId: number, variationId?: number | null) => boolean;
}

function makeId(productId: number, variationId?: number | null): string {
  return `${productId}_${variationId ?? "base"}`;
}

export const useQuoteCartStore = create<QuoteCartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        const id = item.id ?? makeId(item.product_id, item.product_variation_id);
        const existing = get().items.find((i) => i.id === id);
        if (existing) {
          set((s) => ({
            items: s.items.map((i) =>
              i.id === id ? { ...i, quantity: i.quantity + item.quantity } : i
            ),
          }));
        } else {
          set((s) => ({ items: [...s.items, { ...item, id }] }));
        }
      },

      updateItem: (id, changes) =>
        set((s) => ({
          items: s.items.map((i) => (i.id === id ? { ...i, ...changes } : i)),
        })),

      removeItem: (id) =>
        set((s) => ({ items: s.items.filter((i) => i.id !== id) })),

      clearCart: () => set({ items: [] }),

      totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),

      hasItem: (productId, variationId) => {
        const id = makeId(productId, variationId);
        return get().items.some((i) => i.id === id);
      },
    }),
    { name: "quote-cart" }
  )
);
