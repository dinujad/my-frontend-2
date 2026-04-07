"use client";

import { useEffect, useState } from "react";
import { fetchAuthData } from "@/lib/auth-api";
import Link from "next/link";

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadInvoices() {
      try {
        const res = await fetchAuthData("/api/dashboard/invoices");
        setInvoices(res.data || []);
      } catch (e) {
        console.error("Failed to load invoices");
      } finally {
        setLoading(false);
      }
    }
    loadInvoices();
  }, []);

  if (loading) {
    return <div className="animate-pulse h-64 bg-gray-200 rounded-2xl w-full"></div>;
  }

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Invoices</h2>

      {invoices.length === 0 ? (
        <div className="text-center py-12">
          <i className="bi bi-receipt text-4xl text-gray-300"></i>
          <p className="mt-4 text-gray-500">You don&apos;t have any invoices yet.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500 rounded-t-xl">
              <tr>
                <th className="px-4 py-3 font-semibold rounded-tl-xl">Invoice #</th>
                <th className="px-4 py-3 font-semibold">Order</th>
                <th className="px-4 py-3 font-semibold">Date</th>
                <th className="px-4 py-3 font-semibold">Amount</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold rounded-tr-xl text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((invoice) => (
                <tr key={invoice.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50/50">
                  <td className="px-4 py-4 font-mono font-medium text-gray-900">
                    {invoice.invoice_number}
                  </td>
                  <td className="px-4 py-4">
                    <Link href={`/dashboard/orders/${invoice.order_id}`} className="text-brand-red hover:underline">
                      View Order
                    </Link>
                  </td>
                  <td className="px-4 py-4">
                    {new Date(invoice.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-4 font-medium text-gray-900">
                    <div className="flex flex-col">
                      <span>Rs. {Number(invoice.total_amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                      {invoice.balance_due > 0 && <span className="text-xs text-red-500">Balance: Rs. {Number(invoice.balance_due).toLocaleString()}</span>}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${
                      invoice.status === 'paid' ? 'bg-emerald-100 text-emerald-800' :
                      invoice.status === 'partial' ? 'bg-amber-100 text-amber-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {invoice.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <button
                      className="inline-flex items-center gap-1.5 rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-700 transition hover:bg-gray-200"
                    >
                      <i className="bi bi-download" /> Download
                    </button>
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
