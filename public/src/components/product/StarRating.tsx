"use client";

import { clsx } from "clsx";

type Props = {
  rating: number;
  max?: number;
  size?: "sm" | "md" | "lg";
  className?: string;
  /** e.g. "4 out of 5 stars" */
  label?: string;
};

const sizeMap = { sm: "h-3.5 w-3.5", md: "h-4 w-4", lg: "h-5 w-5" };

/** Display-only stars; supports half stars for averages. */
export default function StarRating({ rating, max = 5, size = "md", className, label }: Props) {
  const s = sizeMap[size];
  const rounded = Math.round(rating * 2) / 2;
  const fullStars = Math.floor(rounded);
  const hasHalf = rounded % 1 >= 0.5;
  const empty = max - fullStars - (hasHalf ? 1 : 0);

  return (
    <div
      className={clsx("inline-flex items-center gap-0.5", className)}
      role="img"
      aria-label={label ?? `${rating} out of ${max} stars`}
    >
      {Array.from({ length: fullStars }, (_, i) => (
        <svg key={`f-${i}`} viewBox="0 0 20 20" className={clsx(s, "fill-amber-400 text-amber-400")} aria-hidden>
          <path d="M10 1.5l2.47 5.01 5.53.8-4 3.9.94 5.5L10 13.9l-4.94 2.6.94-5.5-4-3.9 5.53-.8L10 1.5z" />
        </svg>
      ))}
      {hasHalf ? (
        <span className="relative inline-block" style={{ width: size === "lg" ? 20 : size === "md" ? 16 : 14 }}>
          <svg viewBox="0 0 20 20" className={clsx(s, "absolute fill-gray-200 text-gray-200")} aria-hidden>
            <path d="M10 1.5l2.47 5.01 5.53.8-4 3.9.94 5.5L10 13.9l-4.94 2.6.94-5.5-4-3.9 5.53-.8L10 1.5z" />
          </svg>
          <svg
            viewBox="0 0 20 20"
            className={clsx(s, "absolute overflow-hidden fill-amber-400 text-amber-400")}
            style={{ width: "50%", clipPath: "inset(0 50% 0 0)" }}
            aria-hidden
          >
            <path d="M10 1.5l2.47 5.01 5.53.8-4 3.9.94 5.5L10 13.9l-4.94 2.6.94-5.5-4-3.9 5.53-.8L10 1.5z" />
          </svg>
        </span>
      ) : null}
      {Array.from({ length: empty }, (_, i) => (
        <svg key={`e-${i}`} viewBox="0 0 20 20" className={clsx(s, "fill-gray-200 text-gray-200")} aria-hidden>
          <path d="M10 1.5l2.47 5.01 5.53.8-4 3.9.94 5.5L10 13.9l-4.94 2.6.94-5.5-4-3.9 5.53-.8L10 1.5z" />
        </svg>
      ))}
    </div>
  );
}
