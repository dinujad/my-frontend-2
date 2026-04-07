"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchAuthData } from "@/lib/auth-api";

export default function DashboardOverviewPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetchAuthData("/api/dashboard/summary");
        setData(res);
      } catch (e) {
        console.error("Failed to load dashboard summary");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return <div className="animate-pulse space-y-4">
      <div className="h-32 bg-gray-200 rounded-2xl w-full"></div>
      <div className="h-32 bg-gray-200 rounded-2xl w-full"></div>
    </div>;
  }

  if (!data) {
    return <div>Could not load data.</div>;
  }

  const statCards = [
    { title: "Total Orders", value: data.total_orders || 0, icon: "bi-bag-check", color: "bg-blue-50 text-blue-600" },
    { title: "Processing", value: data.processing_orders || 0, icon: "bi-gear", color: "bg-amber-50 text-amber-600" },
    { title: "Shipped", value: data.shipped_orders || 0, icon: "bi-truck", color: "bg-indigo-50 text-indigo-600" },
    { title: "Completed", value: data.completed_orders || 0, icon: "bi-check-circle", color: "bg-emerald-50 text-emerald-600" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, idx) => (
          <div key={idx} className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.color}`}>
                <i className={`bi ${stat.icon} text-xl`} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900">Spending Insights</h2>
          <div className="mt-4 space-y-4">
            <div className="flex justify-between border-b pb-2">
              <span className="text-gray-600">Total Spent</span>
              <span className="font-bold text-gray-900">Rs. {Number(data.total_spent || 0).toLocaleString()}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-gray-600">Paid Amount</span>
              <span className="font-bold text-emerald-600">Rs. {Number(data.paid_amount || 0).toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Pending Payments</span>
              <span className="font-bold text-red-600">Rs. {Number(data.pending_payments || 0).toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900">Quick Links</h2>
          <div className="mt-4 flex flex-col gap-3">
            <Link href="/dashboard/orders" className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3 hover:bg-gray-100 transition">
              <span className="font-medium text-gray-700">View recent orders</span>
              <i className="bi bi-arrow-right text-gray-400" />
            </Link>
            <Link href="/products" className="flex items-center justify-between rounded-xl bg-brand-red/10 px-4 py-3 hover:bg-brand-red/20 transition text-brand-red">
              <span className="font-medium">Continue Shopping</span>
              <i className="bi bi-arrow-right" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
