"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchAuthData } from "@/lib/auth-api";
import type { DashboardSummary } from "@/lib/dashboard-types";
import { StatusBadge } from "@/components/dashboard/StatusBadge";

function formatRs(amount: number) {
  return `Rs. ${Number(amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}`;
}

function formatDate(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-LK", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function DashboardOverviewPage() {
  const [data, setData] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAuthData("/api/v1/dashboard/summary")
      .then(setData)
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-40 rounded-2xl bg-gray-200" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 rounded-2xl bg-gray-200" />
          ))}
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="rounded-2xl border border-red-100 bg-red-50 p-6 text-red-700">
        Could not load your account. Please{" "}
        <Link href="/login" className="font-semibold underline">
          sign in again
        </Link>
        .
      </div>
    );
  }

  const statCards = [
    { title: "Total Orders", value: data.total_orders, icon: "bi-bag-check", color: "bg-blue-50 text-blue-600" },
    { title: "Processing", value: data.processing_orders, icon: "bi-gear", color: "bg-amber-50 text-amber-600" },
    { title: "Shipped", value: data.shipped_orders, icon: "bi-truck", color: "bg-indigo-50 text-indigo-600" },
    { title: "Completed", value: data.completed_orders, icon: "bi-check-circle", color: "bg-emerald-50 text-emerald-600" },
  ];

  return (
    <div className="space-y-6">
      {/* Profile */}
      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-red/10 text-xl font-black text-brand-red">
              {(data.customer.name || "?").charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{data.customer.name}</h2>
              <p className="text-sm text-gray-500">{data.customer.email}</p>
              {data.customer.phone && (
                <p className="text-sm text-gray-600">
                  <i className="bi bi-telephone me-1" />
                  {data.customer.phone}
                </p>
              )}
              <p className="mt-1 text-xs text-gray-400">
                Member since {formatDate(data.customer.member_since)}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3 text-center sm:min-w-[280px]">
            <div className="rounded-xl bg-gray-50 px-3 py-2">
              <p className="text-xs text-gray-500">Quotes</p>
              <p className="text-lg font-bold text-gray-900">{data.quote_counts.total}</p>
            </div>
            <div className="rounded-xl bg-amber-50 px-3 py-2">
              <p className="text-xs text-amber-700">Open</p>
              <p className="text-lg font-bold text-amber-800">{data.quote_counts.open}</p>
            </div>
            <div className="rounded-xl bg-indigo-50 px-3 py-2">
              <p className="text-xs text-indigo-700">Quoted</p>
              <p className="text-lg font-bold text-indigo-800">{data.quote_counts.quoted}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <div key={stat.title} className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${stat.color}`}>
                <i className={`bi ${stat.icon} text-lg`} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Spending */}
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900">Spending</h2>
          <div className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between border-b border-gray-100 pb-2">
              <span className="text-gray-600">Total spent (paid)</span>
              <span className="font-bold text-gray-900">{formatRs(data.total_spent)}</span>
            </div>
            <div className="flex justify-between border-b border-gray-100 pb-2">
              <span className="text-gray-600">Paid</span>
              <span className="font-bold text-emerald-600">{formatRs(data.paid_amount)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Pending payments</span>
              <span className="font-bold text-red-600">{formatRs(data.pending_payments)}</span>
            </div>
          </div>
        </div>

        {/* Recent orders */}
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">Recent Orders</h2>
            <Link href="/dashboard/orders" className="text-sm font-semibold text-brand-red hover:underline">
              View all
            </Link>
          </div>
          {data.recent_orders.length === 0 ? (
            <p className="text-sm text-gray-500">No orders yet.</p>
          ) : (
            <ul className="space-y-3">
              {data.recent_orders.map((order) => (
                <li key={order.id} className="rounded-xl border border-gray-100 p-3 hover:bg-gray-50/80">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <p className="font-mono text-sm font-bold text-gray-900">#{order.order_number}</p>
                      <p className="text-xs text-gray-500">{formatDate(order.created_at)} · {order.items_count ?? 0} items</p>
                    </div>
                    <StatusBadge status={order.status} kind="order" />
                  </div>
                  <p className="mt-2 text-sm font-semibold text-gray-800">{formatRs(order.total)}</p>
                  {order.delivery.tracking_number && (
                    <p className="mt-1 text-xs text-indigo-600">
                      Tracking: {order.delivery.tracking_number}
                    </p>
                  )}
                  {order.delivery.delivered_at && (
                    <p className="text-xs text-emerald-600">Delivered {formatDate(order.delivery.delivered_at)}</p>
                  )}
                  {!order.delivery.delivered_at && order.delivery.shipped_at && (
                    <p className="text-xs text-indigo-600">Shipped {formatDate(order.delivery.shipped_at)}</p>
                  )}
                  <Link
                    href={`/dashboard/orders/${order.id}`}
                    className="mt-2 inline-block text-xs font-semibold text-brand-red hover:underline"
                  >
                    View details →
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Recent quotes */}
      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">Recent Quote Requests</h2>
          <Link href="/dashboard/quotes" className="text-sm font-semibold text-brand-red hover:underline">
            View all
          </Link>
        </div>
        {data.recent_quotes.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-sm text-gray-500">No quote requests yet.</p>
            <Link href="/quote" className="mt-3 inline-block text-sm font-semibold text-brand-red hover:underline">
              Request a quote
            </Link>
          </div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {data.recent_quotes.map((q) => (
              <li key={q.id} className="flex flex-col gap-2 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-mono text-sm font-bold text-gray-900">{q.request_number}</p>
                  <p className="text-xs text-gray-500">
                    {formatDate(q.created_at)} · {q.items_count ?? 0} items
                    {q.deadline ? ` · Deadline ${q.deadline}` : ""}
                  </p>
                  {q.has_admin_response && q.quotation_total != null && (
                    <p className="mt-1 text-sm font-semibold text-indigo-700">
                      Admin quote: {formatRs(q.quotation_total)}
                    </p>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <StatusBadge status={q.status} label={q.status_label} kind="quote" />
                  {q.view_quote_url && (
                    <Link
                      href={q.view_quote_url}
                      className="rounded-lg bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700 hover:bg-indigo-100"
                    >
                      View response
                    </Link>
                  )}
                  <Link
                    href={`/dashboard/quotes/${q.id}`}
                    className="rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-200"
                  >
                    Details
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
