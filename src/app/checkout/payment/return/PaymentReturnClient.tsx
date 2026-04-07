"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function PaymentReturnClient() {
  const params = useSearchParams();
  const orderNumber = params.get("order") ?? "";
  const [status, setStatus] = useState<"loading" | "paid" | "pending" | "failed">("loading");

  useEffect(() => {
    if (!orderNumber) { setStatus("failed"); return; }

    // Poll for payment status — do NOT trust the return URL itself for paid status
    let attempts = 0;
    const maxAttempts = 8;

    const check = async () => {
      attempts++;
      try {
        const res = await fetch(`/api/orders/${orderNumber}/payment-status`);
        if (res.ok) {
          const data = await res.json();
          if (data.payment_status === "paid") {
            setStatus("paid");
            return;
          }
        }
      } catch { /* network error, keep polling */ }

      if (attempts < maxAttempts) {
        setTimeout(check, 2000);
      } else {
        setStatus("pending");
      }
    };

    // Give PayHere notify a head-start before first poll
    setTimeout(check, 2000);
  }, [orderNumber]);

  if (status === "loading") {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
        <div className="text-center max-w-md">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-blue-100">
            <span className="h-8 w-8 animate-spin rounded-full border-4 border-blue-400 border-t-transparent" />
          </div>
          <h1 className="text-xl font-bold text-gray-900">Confirming your payment…</h1>
          <p className="mt-2 text-sm text-gray-500">Please wait while we verify your payment with PayHere.</p>
        </div>
      </main>
    );
  }

  if (status === "paid") {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-md overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-xl text-center">
          <div className="bg-gradient-to-br from-emerald-500 to-teal-600 px-8 py-10 text-white">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/20">
              <i className="bi bi-check-lg text-3xl" />
            </div>
            <h1 className="text-2xl font-bold">Payment Successful!</h1>
            <p className="mt-2 text-sm text-emerald-100">Your order has been confirmed and payment received.</p>
          </div>
          <div className="px-8 py-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Order Number</p>
            <p className="mt-1 font-mono text-xl font-bold text-gray-900">{orderNumber}</p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link href="/products"
                    className="inline-flex items-center justify-center rounded-xl bg-brand-red px-5 py-3 text-sm font-bold text-white shadow hover:bg-red-700 transition">
                Continue Shopping
              </Link>
              <Link href="/dashboard"
                    className="inline-flex items-center justify-center rounded-xl border-2 border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition">
                My Orders
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // Pending or failed — payment not yet confirmed (notify_url may still be processing)
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md overflow-hidden rounded-3xl border border-amber-100 bg-white shadow-xl text-center">
        <div className="bg-gradient-to-br from-amber-400 to-orange-500 px-8 py-10 text-white">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/20">
            <i className="bi bi-clock-history text-3xl" />
          </div>
          <h1 className="text-2xl font-bold">Payment Pending</h1>
          <p className="mt-2 text-sm text-amber-50">Your order is placed. Payment confirmation is still processing.</p>
        </div>
        <div className="px-8 py-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Order Number</p>
          <p className="mt-1 font-mono text-xl font-bold text-gray-900">{orderNumber}</p>
          <p className="mt-4 text-sm text-gray-500">
            If payment was made, it will be confirmed shortly. We will contact you to verify.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link href="/products"
                  className="inline-flex items-center justify-center rounded-xl bg-brand-red px-5 py-3 text-sm font-bold text-white shadow hover:bg-red-700 transition">
              Continue Shopping
            </Link>
            <Link href="/dashboard"
                  className="inline-flex items-center justify-center rounded-xl border-2 border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition">
              My Orders
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
