"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { fetchAuthData } from "@/lib/auth-api";
import { StatusBadge } from "@/components/dashboard/StatusBadge";

type QuoteDetail = {
  id: number;
  request_number: string;
  status: string;
  status_label: string;
  customer_notes: string | null;
  admin_notes: string | null;
  deadline: string | null;
  urgency: string;
  created_at: string;
  items: { id: number; product_name: string; quantity: number; product_sku: string | null }[];
  status_timeline: {
    to_status: string;
    to_label: string;
    note: string | null;
    created_at: string;
  }[];
  admin_response: {
    quote_number: string;
    status: string;
    status_label: string;
    total: number;
    valid_until: string | null;
    sent_at: string | null;
    notes: string | null;
    payment_terms: string | null;
    delivery_details: string | null;
    view_url: string | null;
    items: { description: string; quantity: number; unit_price: number; total: number }[];
  } | null;
};

function formatRs(amount: number) {
  return `Rs. ${Number(amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}`;
}

export default function QuoteDetailsPage() {
  const params = useParams();
  const id = params.id;
  const [quote, setQuote] = useState<QuoteDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    fetchAuthData(`/api/v1/dashboard/quotes/${id}`)
      .then(setQuote)
      .catch(() => setQuote(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <div className="h-64 animate-pulse rounded-2xl bg-gray-200" />;
  }

  if (!quote) {
    return (
      <div className="rounded-2xl border border-gray-100 bg-white p-6">
        <p className="text-gray-600">Quote request not found.</p>
        <Link href="/dashboard/quotes" className="mt-4 inline-block text-brand-red font-semibold hover:underline">
          ← Back to quotes
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link href="/dashboard/quotes" className="text-sm font-semibold text-gray-500 hover:text-brand-red">
            ← My quotes
          </Link>
          <h2 className="mt-2 text-2xl font-bold text-gray-900">{quote.request_number}</h2>
          <p className="text-sm text-gray-500">
            Submitted {new Date(quote.created_at).toLocaleString()}
            {quote.deadline ? ` · Deadline ${quote.deadline}` : ""}
          </p>
        </div>
        <StatusBadge status={quote.status} label={quote.status_label} kind="quote" />
      </div>

      {quote.admin_response && (
        <div className="rounded-2xl border-2 border-indigo-100 bg-indigo-50/50 p-6 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h3 className="text-lg font-bold text-indigo-900">Admin quotation</h3>
              <p className="text-sm text-indigo-700">
                {quote.admin_response.quote_number} · {quote.admin_response.status_label}
              </p>
              <p className="mt-2 text-2xl font-black text-indigo-900">{formatRs(quote.admin_response.total)}</p>
              {quote.admin_response.valid_until && (
                <p className="text-xs text-indigo-600">Valid until {quote.admin_response.valid_until}</p>
              )}
            </div>
            {quote.admin_response.view_url && (
              <Link
                href={quote.admin_response.view_url}
                className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-indigo-700"
              >
                Open full quotation
              </Link>
            )}
          </div>
          {quote.admin_response.notes && (
            <p className="mt-4 rounded-xl bg-white/80 p-4 text-sm text-gray-700">{quote.admin_response.notes}</p>
          )}
          {quote.admin_response.payment_terms && (
            <p className="mt-2 text-sm text-gray-600">
              <span className="font-semibold">Payment:</span> {quote.admin_response.payment_terms}
            </p>
          )}
          {quote.admin_response.delivery_details && (
            <p className="mt-1 text-sm text-gray-600">
              <span className="font-semibold">Delivery:</span> {quote.admin_response.delivery_details}
            </p>
          )}
          {quote.admin_response.items.length > 0 && (
            <ul className="mt-4 divide-y divide-indigo-100 rounded-xl border border-indigo-100 bg-white">
              {quote.admin_response.items.map((item, idx) => (
                <li key={idx} className="flex justify-between gap-4 px-4 py-3 text-sm">
                  <span className="text-gray-800">
                    {item.description} × {item.quantity}
                  </span>
                  <span className="font-semibold text-gray-900">{formatRs(item.total)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <h3 className="font-bold text-gray-900">Items requested</h3>
          <ul className="mt-4 divide-y divide-gray-100">
            {quote.items.map((item) => (
              <li key={item.id} className="flex justify-between py-3 text-sm">
                <div>
                  <p className="font-semibold text-gray-900">{item.product_name}</p>
                  {item.product_sku && <p className="text-xs text-gray-500">SKU: {item.product_sku}</p>}
                </div>
                <span className="text-gray-600">Qty {item.quantity}</span>
              </li>
            ))}
          </ul>
          {quote.customer_notes && (
            <div className="mt-4 rounded-xl bg-gray-50 p-4 text-sm text-gray-700">
              <p className="font-semibold text-gray-900">Your notes</p>
              <p className="mt-1">{quote.customer_notes}</p>
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <h3 className="font-bold text-gray-900">Status timeline</h3>
          <ul className="mt-4 space-y-4">
            {quote.status_timeline.map((log, idx) => (
              <li key={idx} className="relative border-l-2 border-brand-red/30 pl-4">
                <p className="text-sm font-semibold text-gray-900">{log.to_label}</p>
                <p className="text-xs text-gray-500">{new Date(log.created_at).toLocaleString()}</p>
                {log.note && <p className="mt-1 text-sm text-gray-600">{log.note}</p>}
              </li>
            ))}
          </ul>
          {quote.admin_notes && (
            <div className="mt-6 rounded-xl border border-amber-100 bg-amber-50 p-4 text-sm text-amber-900">
              <p className="font-semibold">Message from our team</p>
              <p className="mt-1">{quote.admin_notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
