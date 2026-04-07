import Link from "next/link";

export default function PaymentCancelPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md overflow-hidden rounded-3xl border border-red-100 bg-white shadow-xl text-center">
        <div className="bg-gradient-to-br from-red-500 to-rose-600 px-8 py-10 text-white">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/20">
            <i className="bi bi-x-circle text-3xl" />
          </div>
          <h1 className="text-2xl font-bold">Payment Cancelled</h1>
          <p className="mt-2 text-sm text-red-100">You cancelled the payment. Your order is still saved.</p>
        </div>
        <div className="px-8 py-6">
          <p className="text-sm text-gray-600">
            Your order has been placed but payment was not completed. You can retry payment or choose a different method.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link href="/cart"
                  className="inline-flex items-center justify-center rounded-xl bg-brand-red px-5 py-3 text-sm font-bold text-white shadow hover:bg-red-700 transition">
              Back to Cart
            </Link>
            <Link href="/products"
                  className="inline-flex items-center justify-center rounded-xl border-2 border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
