import { Suspense } from "react";
import PaymentReturnClient from "./PaymentReturnClient";

export default function PaymentReturnPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><p className="text-gray-500">Checking payment status…</p></div>}>
      <PaymentReturnClient />
    </Suspense>
  );
}
