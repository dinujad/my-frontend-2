"use client";

import { clsx } from "clsx";

type Props = {
  value: number;
  onChange: (n: number) => void;
  id?: string;
  disabled?: boolean;
};

export default function StarRatingInput({ value, onChange, id, disabled }: Props) {
  return (
    <div
      id={id}
      className="flex items-center gap-1"
      role="group"
      aria-label="Select star rating"
    >
      {[1, 2, 3, 4, 5].map((n) => {
        const active = n <= value;
        return (
          <button
            key={n}
            type="button"
            disabled={disabled}
            onClick={() => onChange(n)}
            onMouseEnter={() => {
              /* optional: could track hover for preview */
            }}
            className={clsx(
              "rounded-md p-0.5 transition-transform hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-red focus-visible:ring-offset-2",
              disabled && "opacity-50 cursor-not-allowed"
            )}
            aria-label={`${n} star${n > 1 ? "s" : ""}`}
            aria-pressed={active}
          >
            <svg
              viewBox="0 0 20 20"
              className={clsx(
                "h-8 w-8 transition-colors",
                active ? "fill-amber-400 text-amber-400" : "fill-gray-200 text-gray-200 hover:fill-amber-200"
              )}
              aria-hidden
            >
              <path d="M10 1.5l2.47 5.01 5.53.8-4 3.9.94 5.5L10 13.9l-4.94 2.6.94-5.5-4-3.9 5.53-.8L10 1.5z" />
            </svg>
          </button>
        );
      })}
    </div>
  );
}
