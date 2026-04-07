"use client";

import Link from "next/link";
import { useQuoteCartStore } from "@/stores/quote-cart-store";

export default function QuoteCartBadge() {
  const totalItems = useQuoteCartStore((s) => s.items.reduce((sum, i) => sum + i.quantity, 0));

  if (totalItems === 0) return null;

  return (
    <Link
      href="/quote"
      title="View quote request"
      className="relative inline-flex items-center gap-1.5 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-100"
    >
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414A1 1 0 0119 9.414V19a2 2 0 01-2 2z" />
      </svg>
      <span>Quote</span>
      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white">
        {totalItems > 9 ? "9+" : totalItems}
      </span>
    </Link>
  );
}
