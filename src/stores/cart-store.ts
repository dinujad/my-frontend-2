import { create } from "zustand";

export type CartAdditionalService = {
  id: number;
  name: string;
  price: number;
};

export interface CartItem {
  id: string;
  product_id: number;
  variation_id?: number | null;
  name: string;
  price: number;
  customization_fee: number;
  additional_services_fee?: number;
  additional_services?: CartAdditionalService[];
  quantity: number;
  image?: string;
  customizations?: Record<string, string>;
  customization_files?: { fieldId: number; file: File; previewUrl: string; label: string }[];
}

interface CartState {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>((set) => ({
  items: [],
  addItem: (item) =>
    set((state) => {
      const existing = state.items.find((i) => i.id === item.id);
      if (
        existing &&
        (!item.customization_files || item.customization_files.length === 0) &&
        (!item.additional_services || item.additional_services.length === 0)
      ) {
        return {
          items: state.items.map((i) =>
            i.id === item.id
              ? { ...i, quantity: i.quantity + (item.quantity ?? 1) }
              : i
          ),
        };
      }
      return {
        items: [
          ...state.items,
          {
            ...item,
            quantity: item.quantity ?? 1,
            additional_services_fee: item.additional_services_fee ?? 0,
            additional_services: item.additional_services ?? [],
          },
        ],
      };
    }),
  removeItem: (id) =>
    set((state) => ({ items: state.items.filter((i) => i.id !== id) })),
  updateQuantity: (id, quantity) =>
    set((state) => ({
      items: state.items.map((i) =>
        i.id === id ? { ...i, quantity } : i
      ),
    })),
  clearCart: () => set({ items: [] }),
}));
