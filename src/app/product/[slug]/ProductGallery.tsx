"use client";

import { useMemo, useState, useEffect } from "react";
import { catalogImageSrc } from "@/lib/media-url";
import { motion } from "framer-motion";
import { useProductGalleryStore } from "@/stores/product-gallery-store";

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

  // When a variation image is set, that image is the hero first; gallery follows (deduped).
  const effectiveImage = variationImage ? catalogImageSrc(variationImage) : (image?.trim() ? image : "");

  const slides = useMemo(
    () => buildSlides(effectiveImage, imageAlt, gallery, galleryItems, title),
    [effectiveImage, imageAlt, gallery, galleryItems, title]
  );

  const [active, setActive] = useState(0);

  // When variation changes, always show slide 0 (the variation's photo when set).
  useEffect(() => {
    setActive(0);
  }, [galleryEpoch]);

  const current = slides[active] ?? null;

  if (slides.length === 0) {
    return (
      <div className="flex aspect-square w-full items-center justify-center rounded-3xl border border-dashed border-gray-200 bg-gradient-to-br from-gray-50 to-white text-sm text-gray-500 shadow-inner">
        No image available
      </div>
    );
  }

  const src = current ? catalogImageSrc(current.src) : "";

  return (
    <div className="space-y-3 sm:space-y-5">
      <motion.div
        layout
        suppressHydrationWarning
        className="group relative w-full overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-[0_32px_64px_-28px_rgba(15,23,42,0.22)] ring-1 ring-black/[0.04] sm:rounded-3xl"
        style={{ aspectRatio: "1 / 1", maxHeight: "min(70vw, 520px)" }}
      >
        {badge?.trim() ? (
          <span className="absolute left-3 top-3 z-10 rounded-full bg-brand-red px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-white shadow-lg shadow-brand-red/30 sm:left-4 sm:top-4 sm:px-3 sm:text-xs">
            {badge}
          </span>
        ) : null}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-gray-900/[0.03] to-transparent opacity-0 transition duration-500 group-hover:opacity-100" />
        {/* eslint-disable-next-line @next/next/no-img-element -- API paths; next/image optimizer breaks with Laravel storage */}
        <img
          key={`${galleryEpoch}-${current?.src ?? "no-image"}`}
          src={src}
          alt={current?.alt || title}
          className="absolute inset-0 h-full w-full object-contain p-4 transition duration-500 ease-out group-hover:scale-[1.02] sm:p-6"
          loading="eager"
          decoding="async"
          fetchPriority="high"
          onError={(e) => {
            const el = e.currentTarget;
            if (el.dataset.fallbackTried === "1") return;
            el.dataset.fallbackTried = "1";
            const api = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");
            if (api && src.startsWith("/")) {
              el.src = `${api}${src}`;
            }
          }}
        />
      </motion.div>
      {slides.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1 sm:gap-3" style={{ scrollbarWidth: "none" }}>
          {slides.map((thumb, i) => {
            const tsrc = thumb.src;
            return (
              <button
                key={`${thumb.src}-${i}`}
                type="button"
                onClick={() => setActive(i)}
                className={`relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border-2 bg-white shadow-sm transition-all duration-200 sm:h-[4.5rem] sm:w-[4.5rem] sm:rounded-2xl ${
                  i === active
                    ? "border-brand-red shadow-md shadow-brand-red/15 ring-2 ring-brand-red/20"
                    : "border-gray-200 hover:border-gray-300 hover:shadow-md"
                }`}
                aria-label={`View image ${i + 1} of ${slides.length}`}
                aria-current={i === active ? "true" : undefined}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={tsrc}
                  alt={thumb.alt}
                  className="h-full w-full object-contain p-1"
                  loading="lazy"
                  decoding="async"
                  onError={(e) => {
                    const el = e.currentTarget;
                    if (el.dataset.fallbackTried === "1") return;
                    el.dataset.fallbackTried = "1";
                    const api = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");
                    if (api && tsrc.startsWith("/")) {
                      el.src = `${api}${tsrc}`;
                    }
                  }}
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
