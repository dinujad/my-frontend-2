"use client";

import { useMemo, useState } from "react";
import { catalogImageSrc } from "@/lib/media-url";
import { motion } from "framer-motion";

type Props = {
  title: string;
  image: string;
  gallery?: string[];
  badge?: string | null;
};

/** Normalize + dedupe so `http://host/storage/x` and `/storage/x` count as one slide */
function buildSlides(image: string, gallery: string[] | undefined): string[] {
  const raw: string[] = [];
  const main = image?.trim() ?? "";
  if (main) raw.push(main);
  for (const g of gallery ?? []) {
    const t = g?.trim();
    if (t) raw.push(t);
  }
  const seen = new Set<string>();
  const out: string[] = [];
  for (const r of raw) {
    const norm = catalogImageSrc(r);
    if (!norm || seen.has(norm)) continue;
    seen.add(norm);
    out.push(norm);
  }
  return out;
}

export default function ProductGallery({ title, image, gallery, badge }: Props) {
  const slides = useMemo(() => buildSlides(image, gallery), [image, gallery]);
  const [active, setActive] = useState(0);
  const current = slides[active] ?? "";

  if (slides.length === 0) {
    return (
      <div className="flex aspect-square w-full items-center justify-center rounded-3xl border border-dashed border-gray-200 bg-gradient-to-br from-gray-50 to-white text-sm text-gray-500 shadow-inner">
        No image available
      </div>
    );
  }

  const src = catalogImageSrc(current);

  return (
    <div className="space-y-5">
      <motion.div
        layout
        suppressHydrationWarning
        className="group relative aspect-square w-full overflow-hidden rounded-3xl border border-gray-200/80 bg-white shadow-[0_32px_64px_-28px_rgba(15,23,42,0.22)] ring-1 ring-black/[0.04]"
      >
        {badge?.trim() ? (
          <span className="absolute left-4 top-4 z-10 rounded-full bg-brand-red px-3 py-1 text-xs font-bold uppercase tracking-wide text-white shadow-lg shadow-brand-red/30">
            {badge}
          </span>
        ) : null}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-gray-900/[0.03] to-transparent opacity-0 transition duration-500 group-hover:opacity-100" />
        {/* eslint-disable-next-line @next/next/no-img-element -- API paths; next/image optimizer breaks with Laravel storage */}
        <img
          key={current}
          src={src}
          alt={title}
          className="absolute inset-0 h-full w-full object-contain p-6 transition duration-500 ease-out group-hover:scale-[1.02]"
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
        <div className="flex gap-3 overflow-x-auto pb-1">
          {slides.map((thumb, i) => {
            const tsrc = thumb;
            return (
              <button
                key={`${thumb}-${i}`}
                type="button"
                onClick={() => setActive(i)}
                className={`relative h-[4.5rem] w-[4.5rem] shrink-0 overflow-hidden rounded-2xl border-2 bg-white shadow-sm transition-all duration-200 ${
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
                  alt=""
                  className="h-full w-full object-contain p-1.5"
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
