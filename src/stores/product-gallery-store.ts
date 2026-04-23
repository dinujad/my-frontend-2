import { create } from "zustand";

interface ProductGalleryState {
  /** When a variation with its own image is selected, this overrides the main product image. null = use product default */
  variationImage: string | null;
  setVariationImage: (image: string | null) => void;
  reset: () => void;
}

export const useProductGalleryStore = create<ProductGalleryState>((set) => ({
  variationImage: null,
  setVariationImage: (variationImage) => set({ variationImage }),
  reset: () => set({ variationImage: null }),
}));
