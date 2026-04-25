import { create } from "zustand";

interface ProductGalleryState {
  /** When a variation with its own image is selected, this overrides the main product image. null = use product default */
  variationImage: string | null;
  /** Bumps when variation image changes so gallery resets slide 0 even if URL string is unchanged */
  galleryEpoch: number;
  setVariationImage: (image: string | null) => void;
  reset: () => void;
}

export const useProductGalleryStore = create<ProductGalleryState>((set) => ({
  variationImage: null,
  galleryEpoch: 0,
  setVariationImage: (variationImage) =>
    set((s) => {
      const next = variationImage?.trim() || null;
      const changed = next !== s.variationImage;
      return {
        variationImage: next,
        galleryEpoch: changed ? s.galleryEpoch + 1 : s.galleryEpoch,
      };
    }),
  reset: () =>
    set((s) => {
      if (s.variationImage === null) return s;
      return { variationImage: null, galleryEpoch: s.galleryEpoch + 1 };
    }),
}));
