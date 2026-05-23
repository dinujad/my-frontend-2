"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchAuthData } from "@/lib/auth-api";
import type { DashboardQuoteSummary } from "@/lib/dashboard-types";
import { StatusBadge } from "@/components/dashboard/StatusBadge";

function formatRs(amount: number) {
  return `Rs. ${Number(amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}`;
}

export default function MyQuotesPage() {
  const [quotes, setQuotes] = useState<DashboardQuoteSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAuthData("/api/v1/dashboard/quotes")
      .then((res) => setQuotes(res.data || []))
      .catch(() => setQuotes([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="animate-pulse space-y-3">
        <div className="h-16 rounded-xl bg-gray-200" />
        <div className="h-16 rounded-xl bg-gray-200" />
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">My Quote Requests</h2>
          <p className="text-sm text-gray-500">Track requests and admin responses.</p>
        </div>
        <Link
          href="/quote"
          className="inline-flex items-center justify-center rounded-xl bg-brand-red px-4 py-2 text-sm font-bold text-white hover:bg-brand-red-dark"
        >
          New quote request
        </Link>
      </div>

      {quotes.length === 0 ? (
        <div className="py-12 text-center">
          <i className="bi bi-file-earmark-text text-4xl text-gray-300" />
          <p className="mt-4 text-gray-500">You haven&apos;t requested any quotes yet.</p>
          <Link href="/quote" className="mt-4 inline-block font-semibold text-brand-red hover:underline">
            Request a quote
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm text-gray-600">
            <thead className="rounded-t-xl bg-gray-50 text-xs uppercase text-gray-500">
              <tr>
                <th className="px-4 py-3 font-semibold">Request #</th>
                <th className="px-4 py-3 font-semibold">Date</th>
                <th className="px-4 py-3 font-semibold">Items</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Admin response</th>
                <th className="px-4 py-3 text-right font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              {quotes.map((q) => (
                <tr key={q.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50/50">
                  <td className="px-4 py-4 font-mono font-medium text-gray-900">{q.request_number}</td>
                  <td className="px-4 py-4">{new Date(q.created_at).toLocaleDateString()}</td>
                  <td className="px-4 py-4">{q.items_count ?? "—"}</td>
                  <td className="px-4 py-4">
                    <StatusBadge status={q.status} label={q.status_label} kind="quote" />
                  </td>
                  <td className="px-4 py-4">
                    {q.has_admin_response ? (
                      <span className="font-semibold text-indigo-700">
                        {q.quotation_total != null ? formatRs(q.quotation_total) : "Quote ready"}
                      </span>
                    ) : (
                      <span className="text-gray-400">Pending</span>
                    )}
                  </td>
                  <td className="px-4 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      {q.view_quote_url && (
                        <Link
                          href={q.view_quote_url}
                          className="rounded-lg bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700 hover:bg-indigo-100"
                        >
                          View quote
                        </Link>
                      )}
                      <Link
                        href={`/dashboard/quotes/${q.id}`}
                        className="rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-200"
                      >
                        Details
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
