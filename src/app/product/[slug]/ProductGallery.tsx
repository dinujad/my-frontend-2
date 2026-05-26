"use client";

import { useMemo, useState, useEffect, useCallback } from "react";
import { catalogImageSrc, onCatalogImageError } from "@/lib/media-url";
import { motion, AnimatePresence } from "framer-motion";
import { useProductGalleryStore } from "@/stores/product-gallery-store";
import { clsx } from "clsx";

type Props = {
  title: string;
  image: string;
  imageAlt?: string | null;
  gallery?: string[];
  galleryItems?: { src: string; alt?: string | null }[];
  badge?: string | null;
};

/** Normalize + dedupe so `http://host/storage/x` and `/storage/x` count as one slide */
function buildSlides(
  image: string,
  imageAlt: string | null | undefined,
  gallery: string[] | undefined,
  galleryItems: { src: string; alt?: string | null }[] | undefined,
  title: string
): { src: string; alt: string }[] {
  const raw: { src: string; alt?: string | null }[] = [];
  const main = image?.trim() ?? "";
  if (main) raw.push({ src: main, alt: imageAlt });
  for (const g of galleryItems ?? []) {
    const t = g?.src?.trim();
    if (t) raw.push({ src: t, alt: g.alt });
  }
  if (!galleryItems?.length) {
    for (const g of gallery ?? []) {
      const t = g?.trim();
      if (t) raw.push({ src: t, alt: null });
    }
  }
  const seen = new Set<string>();
  const out: { src: string; alt: string }[] = [];
  for (const r of raw) {
    const norm = catalogImageSrc(r.src);
    if (!norm || seen.has(norm)) continue;
    seen.add(norm);
    out.push({
      src: norm,
      alt: (r.alt?.trim() || title || "Product image").trim(),
    });
  }
  return out;
}

export default function ProductGallery({ title, image, imageAlt, gallery, galleryItems, badge }: Props) {
  const variationImage = useProductGalleryStore((s) => s.variationImage);
  const galleryEpoch = useProductGalleryStore((s) => s.galleryEpoch);

  const effectiveImage = variationImage
    ? catalogImageSrc(variationImage)
    : catalogImageSrc(image?.trim() ? image : "");

  const slides = useMemo(
    () => buildSlides(effectiveImage, imageAlt, gallery, galleryItems, title),
    [effectiveImage, imageAlt, gallery, galleryItems, title]
  );

  const [active, setActive] = useState(0);

  useEffect(() => {
    setActive(0);
  }, [galleryEpoch]);

  const goPrev = useCallback(() => {
    setActive((i) => (i <= 0 ? slides.length - 1 : i - 1));
  }, [slides.length]);

  const goNext = useCallback(() => {
    setActive((i) => (i >= slides.length - 1 ? 0 : i + 1));
  }, [slides.length]);

  const current = slides[active] ?? null;

  if (slides.length === 0) {
    return (
      <div className="flex aspect-square w-full items-center justify-center rounded-3xl border border-dashed border-gray-200 bg-gradient-to-br from-gray-50 to-white text-sm text-gray-500 shadow-inner">
        <div className="text-center">
          <i className="bi bi-image mb-2 block text-3xl text-gray-300" aria-hidden />
          No image available
        </div>
      </div>
    );
  }

  const src = current ? catalogImageSrc(current.src) : "";
  const hasNav = slides.length > 1;

  return (
    <div className="space-y-4">
      <motion.div
        layout
        suppressHydrationWarning
        className="group relative w-full overflow-hidden rounded-2xl border border-gray-200/70 bg-gradient-to-br from-white via-gray-50/30 to-white shadow-[0_32px_64px_-28px_rgba(15,23,42,0.18)] ring-1 ring-black/[0.03] sm:rounded-3xl"
        style={{ aspectRatio: "1 / 1", maxHeight: "min(72vw, 540px)" }}
      >
        {badge?.trim() ? (
          <span className="absolute left-4 top-4 z-10 rounded-full bg-brand-red px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-white shadow-lg shadow-brand-red/30">
            {badge}
          </span>
        ) : null}

        {hasNav ? (
          <span className="absolute right-4 top-4 z-10 rounded-full bg-gray-900/70 px-2.5 py-1 text-[11px] font-semibold tabular-nums text-white backdrop-blur-sm">
            {active + 1} / {slides.length}
          </span>
        ) : null}

        <AnimatePresence mode="wait">
          <motion.img
            key={`${galleryEpoch}-${current?.src ?? "no-image"}`}
            initial={{ opacity: 0.6, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0.6, scale: 0.98 }}
            transition={{ duration: 0.25 }}
            src={src}
            alt={current?.alt || title}
            className="absolute inset-0 h-full w-full object-contain p-5 sm:p-8"
            loading="eager"
            decoding="async"
            fetchPriority="high"
            onError={onCatalogImageError}
          />
        </AnimatePresence>

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-gray-900/[0.04] via-transparent to-transparent opacity-0 transition duration-500 group-hover:opacity-100" />

        {hasNav ? (
          <>
            <button
              type="button"
              onClick={goPrev}
              className="absolute left-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-gray-200/80 bg-white/95 text-gray-700 shadow-lg opacity-0 backdrop-blur-sm transition hover:bg-white hover:text-brand-red group-hover:opacity-100 sm:left-4"
              aria-label="Previous image"
            >
              <i className="bi bi-chevron-left text-lg" aria-hidden />
            </button>
            <button
              type="button"
              onClick={goNext}
              className="absolute right-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-gray-200/80 bg-white/95 text-gray-700 shadow-lg opacity-0 backdrop-blur-sm transition hover:bg-white hover:text-brand-red group-hover:opacity-100 sm:right-4"
              aria-label="Next image"
            >
              <i className="bi bi-chevron-right text-lg" aria-hidden />
            </button>
          </>
        ) : null}
      </motion.div>

      {hasNav ? (
        <div
          className="flex gap-2.5 overflow-x-auto pb-1 sm:gap-3"
          style={{ scrollbarWidth: "none" }}
          role="tablist"
          aria-label="Product images"
        >
          {slides.map((thumb, i) => (
            <button
              key={`${thumb.src}-${i}`}
              type="button"
              role="tab"
              onClick={() => setActive(i)}
              className={clsx(
                "relative h-[4.25rem] w-[4.25rem] shrink-0 overflow-hidden rounded-xl border-2 bg-white shadow-sm transition-all duration-200 sm:h-[5rem] sm:w-[5rem] sm:rounded-2xl",
                i === active
                  ? "border-brand-red shadow-md shadow-brand-red/15 ring-2 ring-brand-red/15"
                  : "border-gray-200 hover:border-gray-300 hover:shadow-md"
              )}
              aria-label={`View image ${i + 1} of ${slides.length}`}
              aria-selected={i === active}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={thumb.src}
                alt={thumb.alt}
                className="h-full w-full object-contain p-1.5"
                loading="lazy"
                decoding="async"
                onError={onCatalogImageError}
              />
              {i === active ? (
                <span className="absolute inset-x-0 bottom-0 h-0.5 bg-brand-red" aria-hidden />
              ) : null}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
