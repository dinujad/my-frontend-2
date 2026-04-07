import { Suspense } from "react";
import { PaymentReturnClient } from "./PaymentReturnClient";

/** This route reads URL params on the client; never statically prerender it. */
export const dynamic = "force-dynamic";

export default function PaymentReturnPage() {
  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <Suspense
        fallback={
          <div className="flex min-h-[400px] items-center justify-center">
            <p className="text-gray-500">Loading payment details...</p>
          </div>
        }
      >
        <PaymentReturnClient />
      </Suspense>
    </div>
  );
}
