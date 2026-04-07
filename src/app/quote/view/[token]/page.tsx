"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

interface QuotationItem {
  id: number;
  description: string;
  sku?: string;
  quantity: number;
  unit_price: string;
  discount_percent: string;
  subtotal: string;
  item_notes?: string;
}

interface Quotation {
  id: number;
  quote_number: string;
  status: string;
  status_label: string;
  customer_name: string;
  company_name?: string;
  email: string;
  phone: string;
  address?: string;
  quotation_date: string;
  valid_until?: string;
  subtotal: string;
  discount_amount: string;
  tax_amount: string;
  total: string;
  payment_terms?: string;
  delivery_details?: string;
  terms_conditions?: string;
  notes?: string;
  items: QuotationItem[];
}

function fmtRs(v: string | number) {
  return `Rs. ${Number(v).toLocaleString("en-LK", { minimumFractionDigits: 2 })}`;
}

const statusColors: Record<string, string> = {
  draft: "bg-gray-100 text-gray-700",
  ready: "bg-red-100 text-red-700",
  sent: "bg-red-100 text-red-700",
  viewed: "bg-red-50 text-red-600",
  accepted: "bg-emerald-100 text-emerald-700",
  rejected: "bg-red-100 text-red-700",
  expired: "bg-orange-100 text-orange-700",
};

export default function QuotationViewPage() {
  const { token } = useParams<{ token: string }>();
  const [quotation, setQuotation] = useState<Quotation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    fetch(`/api/quote/view/${token}`, { headers: { Accept: "application/json" } })
      .then((r) => {
        if (!r.ok) throw new Error("Quotation not found");
        return r.json();
      })
      .then(setQuotation)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3 text-gray-500">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-red border-t-transparent" />
          <p className="text-sm">Loading quotation…</p>
        </div>
      </main>
    );
  }

  if (error || !quotation) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <svg className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
          </div>
          <h1 className="text-xl font-bold text-gray-900">Quotation Not Found</h1>
          <p className="mt-2 text-sm text-gray-500">This link may be invalid or expired.</p>
          <a href="/" className="mt-6 inline-block rounded-xl bg-brand-red px-6 py-2.5 text-sm font-bold text-white hover:bg-brand-red-dark">
            Go to Homepage
          </a>
        </div>
      </main>
    );
  }

  const statusCls = statusColors[quotation.status] ?? "bg-gray-100 text-gray-700";

  return (
    <main className="min-h-screen bg-gray-50 pb-16">
      {/* Header */}
      <div className="bg-gradient-to-br from-brand-red to-red-900 py-8 text-white">
        <div className="mx-auto max-w-4xl px-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-red-100 text-sm font-medium">Print Works LK</p>
              <h1 className="mt-1 text-3xl font-extrabold">Quotation</h1>
              <p className="mt-1 text-xl font-bold text-red-100">#{quotation.quote_number}</p>
            </div>
            <span className={`mt-1 rounded-full px-4 py-1.5 text-sm font-bold ${statusCls}`}>
              {quotation.status_label}
            </span>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-8 space-y-6">
        {/* Meta */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl bg-white p-5 shadow-sm border border-gray-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">Prepared For</h3>
            <p className="font-bold text-gray-900">{quotation.customer_name}</p>
            {quotation.company_name && <p className="text-sm text-gray-600">{quotation.company_name}</p>}
            <p className="text-sm text-gray-600 mt-1">{quotation.email}</p>
            <p className="text-sm text-gray-600">{quotation.phone}</p>
            {quotation.address && <p className="text-sm text-gray-500 mt-1">{quotation.address}</p>}
          </div>
          <div className="rounded-2xl bg-white p-5 shadow-sm border border-gray-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">Quotation Details</h3>
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between"><span className="text-gray-500">Date</span><span className="font-semibold text-gray-800">{quotation.quotation_date}</span></div>
              {quotation.valid_until && <div className="flex justify-between"><span className="text-gray-500">Valid Until</span><span className="font-semibold text-gray-800">{quotation.valid_until}</span></div>}
              <div className="flex justify-between"><span className="text-gray-500">Quote #</span><span className="font-semibold text-gray-800">{quotation.quote_number}</span></div>
            </div>
          </div>
        </div>

        {/* Line items */}
        <div className="rounded-2xl bg-white shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h3 className="font-bold text-gray-900">Items</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[540px]">
              <thead>
                <tr className="bg-gray-50 text-xs font-bold uppercase tracking-wider text-gray-500">
                  <th className="px-6 py-3 text-left">Description</th>
                  <th className="px-4 py-3 text-center w-16">Qty</th>
                  <th className="px-4 py-3 text-right w-32">Unit Price</th>
                  <th className="px-4 py-3 text-center w-20">Disc.</th>
                  <th className="px-4 py-3 text-right w-32">Subtotal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {quotation.items.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/50">
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900 text-sm">{item.description}</p>
                      {item.sku && <p className="text-xs text-gray-400 mt-0.5">SKU: {item.sku}</p>}
                      {item.item_notes && <p className="text-xs text-gray-500 mt-1 italic">{item.item_notes}</p>}
                    </td>
                    <td className="px-4 py-4 text-center text-sm font-semibold text-gray-700">{item.quantity}</td>
                    <td className="px-4 py-4 text-right text-sm text-gray-700">{fmtRs(item.unit_price)}</td>
                    <td className="px-4 py-4 text-center text-sm">
                      {Number(item.discount_percent) > 0 ? (
                        <span className="text-red-500 font-semibold">{item.discount_percent}%</span>
                      ) : <span className="text-gray-300">—</span>}
                    </td>
                    <td className="px-4 py-4 text-right text-sm font-bold text-gray-900">{fmtRs(item.subtotal)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="border-t border-gray-100 px-6 py-4">
            <div className="ml-auto max-w-xs space-y-2 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span className="font-semibold">{fmtRs(quotation.subtotal)}</span>
              </div>
              {Number(quotation.discount_amount) > 0 && (
                <div className="flex justify-between text-red-500">
                  <span>Discount</span>
                  <span className="font-semibold">− {fmtRs(quotation.discount_amount)}</span>
                </div>
              )}
              {Number(quotation.tax_amount) > 0 && (
                <div className="flex justify-between text-gray-600">
                  <span>Tax</span>
                  <span className="font-semibold">{fmtRs(quotation.tax_amount)}</span>
                </div>
              )}
              <div className="flex justify-between border-t border-gray-200 pt-2 text-base font-bold text-gray-900">
                <span>Total</span>
                <span className="text-brand-red text-lg">{fmtRs(quotation.total)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Terms, notes, etc. */}
        {[
          { title: "Payment Terms", content: quotation.payment_terms },
          { title: "Delivery Details", content: quotation.delivery_details },
          { title: "Terms & Conditions", content: quotation.terms_conditions },
          { title: "Notes", content: quotation.notes },
        ].filter(Boolean).map(({ title, content }) =>
          content ? (
            <div key={title} className="rounded-2xl bg-white p-5 shadow-sm border border-gray-100">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">{title}</h4>
              <p className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">{content}</p>
            </div>
          ) : null
        )}

        {/* Footer CTA */}
        <div className="rounded-2xl bg-red-50 border border-red-100 p-6 text-center">
          <p className="text-sm text-red-700 font-medium mb-4">Questions about this quotation?</p>
          <div className="flex justify-center gap-3 flex-wrap">
            <a href="https://wa.me/94706668885" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-5 py-2.5 text-sm font-bold text-white shadow hover:bg-emerald-600">
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
              WhatsApp Us
            </a>
            <a href="/contact" className="inline-flex items-center gap-2 rounded-xl border-2 border-red-300 bg-white px-5 py-2.5 text-sm font-bold text-brand-red hover:bg-red-50">
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
