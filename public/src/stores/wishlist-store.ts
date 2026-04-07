import { create } from "zustand";

export interface WishlistItem {
  id: string;
  name: string;
  price: number;
  slug?: string;
  image?: string;
}

interface WishlistState {
  items: WishlistItem[];
  add: (item: WishlistItem) => void;
  remove: (id: string) => void;
  has: (id: string) => boolean;
}

export const useWishlistStore = create<WishlistState>((set, get) => ({
  items: [],
  add: (item) =>
    set((state) => ({
      items: state.items.some((i) => i.id === item.id)
        ? state.items
        : [...state.items, item],
    })),
  remove: (id) =>
    set((state) => ({ items: state.items.filter((i) => i.id !== id) })),
  has: (id) => get().items.some((i) => i.id === id),
}));
