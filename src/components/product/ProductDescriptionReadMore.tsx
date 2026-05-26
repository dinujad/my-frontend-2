"use client";

import { useId, useState } from "react";
import { clsx } from "clsx";

type Props = {
  description: string;
  className?: string;
};

const COLLAPSED_LINES = 4;

export function ProductDescriptionReadMore({ description, className }: Props) {
  const [expanded, setExpanded] = useState(false);
  const contentId = useId();
  const text = description?.trim() ?? "";

  if (!text) return null;

  const needsToggle = text.length > 220 || text.split("\n").length > COLLAPSED_LINES;

  return (
    <section
      className={clsx(
        "mt-14 overflow-hidden rounded-3xl border border-gray-200/80 bg-white shadow-[0_20px_60px_-24px_rgba(15,23,42,0.12)] sm:mt-16",
        className
      )}
      aria-labelledby="pdp-desc-heading"
    >
      <div className="border-b border-gray-100 bg-gradient-to-r from-slate-50/90 via-white to-slate-50/50 px-5 py-5 sm:px-8 sm:py-6">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-red">Details</p>
        <h2 id="pdp-desc-heading" className="mt-1 text-xl font-bold tracking-tight text-gray-900 sm:text-2xl">
          Product description
        </h2>
      </div>
      <div className="px-5 py-6 sm:px-8 sm:py-8">
        <div
          id={contentId}
          className={clsx(
            "max-w-3xl text-[15px] leading-[1.75] text-gray-600 whitespace-pre-wrap",
            !expanded && needsToggle && "line-clamp-4"
          )}
        >
          {text}
        </div>
        {needsToggle ? (
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            aria-expanded={expanded}
            aria-controls={contentId}
            className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-brand-red/20 bg-brand-red/5 px-4 py-2 text-sm font-bold text-brand-red transition hover:border-brand-red/40 hover:bg-brand-red/10"
          >
            {expanded ? "Show less" : "Read more"}
            <i className={clsx("bi text-xs", expanded ? "bi-chevron-up" : "bi-chevron-down")} aria-hidden />
          </button>
        ) : null}
      </div>
    </section>
  );
}
