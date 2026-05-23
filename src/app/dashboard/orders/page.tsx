"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchAuthData } from "@/lib/auth-api";
import type { DashboardOrderSummary } from "@/lib/dashboard-types";
import { StatusBadge } from "@/components/dashboard/StatusBadge";

export default function MyOrdersPage() {
  const [orders, setOrders] = useState<DashboardOrderSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAuthData("/api/v1/dashboard/orders")
      .then((res) => setOrders(res.data || []))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="animate-pulse space-y-4">
      <div className="h-16 bg-gray-200 rounded-xl w-full"></div>
      <div className="h-16 bg-gray-200 rounded-xl w-full"></div>
    </div>;
  }

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-bold text-gray-900 mb-6">My Orders</h2>

      {orders.length === 0 ? (
        <div className="text-center py-12">
          <i className="bi bi-box-seam text-4xl text-gray-300"></i>
          <p className="mt-4 text-gray-500">You haven&apos;t placed any orders yet.</p>
          <Link href="/products" className="mt-4 inline-block text-brand-red font-semibold hover:underline">
            Start shopping
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500 rounded-t-xl">
              <tr>
                <th className="px-4 py-3 font-semibold rounded-tl-xl">Order #</th>
                <th className="px-4 py-3 font-semibold">Date</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Delivery</th>
                <th className="px-4 py-3 font-semibold">Total</th>
                <th className="px-4 py-3 font-semibold rounded-tr-xl text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50/50">
                  <td className="px-4 py-4 font-mono font-medium text-gray-900">
                    {order.order_number}
                  </td>
                  <td className="px-4 py-4">
                    {new Date(order.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-4">
                    <StatusBadge status={order.status} kind="order" />
                  </td>
                  <td className="px-4 py-4 text-xs text-gray-600">
                    {order.delivery?.delivered_at ? (
                      <span className="text-emerald-700">Delivered {new Date(order.delivery.delivered_at).toLocaleDateString()}</span>
                    ) : order.delivery?.shipped_at ? (
                      <span>Shipped {new Date(order.delivery.shipped_at).toLocaleDateString()}</span>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                    {order.delivery?.tracking_number && (
                      <p className="mt-0.5 font-mono text-[11px] text-indigo-600">{order.delivery.tracking_number}</p>
                    )}
                  </td>
                  <td className="px-4 py-4 font-medium text-gray-900">
                    Rs. {Number(order.total).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-4 py-4 text-right">
                    <Link
                      href={`/dashboard/orders/${order.id}`}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-700 transition hover:bg-gray-200"
                    >
                      View Details
                      <i className="bi bi-chevron-right text-[10px]" />
                    </Link>
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
