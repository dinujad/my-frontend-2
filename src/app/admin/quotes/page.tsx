"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

// ── Types ──────────────────────────────────────────────────────────────────
interface QuoteRequest {
  id: number;
  request_number: string;
  customer_name: string;
  company_name?: string;
  email: string;
  phone: string;
  status: string;
  urgency?: string;
  preferred_contact: string;
  items_count?: number;
  items: { id: number }[];
  created_at: string;
  assigned_to?: { name: string } | null;
  quotation?: { quote_number: string; status: string } | null;
}

interface PaginatedResponse {
  data: QuoteRequest[];
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
}

// ── Status badge colours ──────────────────────────────────────────────────
const STATUS_COLORS: Record<string, string> = {
  new:                  "bg-blue-100 text-blue-800",
  reviewing:            "bg-yellow-100 text-yellow-800",
  awaiting_pricing:     "bg-orange-100 text-orange-800",
  quoted:               "bg-indigo-100 text-indigo-800",
  sent:                 "bg-violet-100 text-violet-800",
  customer_responded:   "bg-cyan-100 text-cyan-800",
  approved:             "bg-emerald-100 text-emerald-800",
  rejected:             "bg-red-100 text-red-800",
  closed:               "bg-gray-100 text-gray-700",
};

const STATUS_LABELS: Record<string, string> = {
  new:                "New",
  reviewing:          "Under Review",
  awaiting_pricing:   "Awaiting Pricing",
  quoted:             "Quoted",
  sent:               "Sent",
  customer_responded: "Customer Responded",
  approved:           "Approved",
  rejected:           "Rejected",
  closed:             "Closed",
};

const URGENCY_COLORS: Record<string, string> = {
  normal:      "bg-gray-100 text-gray-600",
  urgent:      "bg-amber-100 text-amber-700",
  very_urgent: "bg-red-100 text-red-700",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function AdminQuotesPage() {
  const router = useRouter();
  const [data, setData] = useState<PaginatedResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      if (!token) { router.push("/admin/login"); return; }

      const params = new URLSearchParams({ page: String(page), per_page: "20" });
      if (search) params.set("search", search);
      if (statusFilter !== "all") params.set("status", statusFilter);

      const res = await fetch(`/api/admin/quotes?${params}`, {
        headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
      });

      if (res.status === 401) { router.push("/admin/login"); return; }
      if (!res.ok) throw new Error("Failed to load quote requests");

      setData(await res.json());
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [page, search, statusFilter, router]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const tabs = [
    { key: "all", label: "All" },
    { key: "new", label: "New" },
    { key: "reviewing", label: "Reviewing" },
    { key: "awaiting_pricing", label: "Awaiting Pricing" },
    { key: "quoted", label: "Quoted" },
    { key: "sent", label: "Sent" },
    { key: "approved", label: "Approved" },
    { key: "closed", label: "Closed" },
  ];

  return (
    <div className="min-h-screen bg-[#0f172a] text-white">
      {/* Sidebar */}
      <div className="flex">
        <aside className="w-64 shrink-0 bg-[#1e293b] min-h-screen p-4 space-y-1 hidden lg:block">
          <div className="px-3 py-4 mb-4">
            <span className="text-xl font-extrabold text-white">PrintWorks</span>
            <span className="ml-1 text-xs text-slate-400">Admin</span>
          </div>
          {[
            { href: "/admin/live-chat", icon: "💬", label: "Live Chat" },
            { href: "/admin/quotes", icon: "📋", label: "Quote Requests", active: true },
          ].map((item) => (
            <a key={item.href} href={item.href} className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${item.active ? "bg-indigo-600 text-white" : "text-slate-400 hover:bg-slate-700 hover:text-white"}`}>
              <span>{item.icon}</span>{item.label}
            </a>
          ))}
        </aside>

        {/* Main content */}
        <div className="flex-1 p-6 lg:p-8">
          {/* Header */}
          <div className="mb-6 flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-extrabold text-white">Quote Requests</h1>
              <p className="mt-1 text-sm text-slate-400">Manage customer quotation requests</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="rounded-full bg-indigo-900/60 px-3 py-1 text-xs font-semibold text-indigo-300">
                {data?.total ?? 0} total
              </span>
              <button onClick={fetchData} className="rounded-xl border border-slate-600 bg-slate-700 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:bg-slate-600">
                Refresh
              </button>
            </div>
          </div>

          {/* Search + Filters */}
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center">
            <input
              type="search"
              placeholder="Search by name, email, phone, request number…"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="flex-1 rounded-xl border border-slate-600 bg-slate-800 px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-indigo-500"
            />
          </div>

          {/* Status tabs */}
          <div className="mb-6 flex gap-2 overflow-x-auto pb-1">
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => { setStatusFilter(t.key); setPage(1); }}
                className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-bold transition ${statusFilter === t.key ? "bg-indigo-600 text-white" : "bg-slate-700 text-slate-300 hover:bg-slate-600"}`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Table */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
            </div>
          ) : error ? (
            <div className="rounded-xl bg-red-900/30 border border-red-800 p-6 text-center text-red-300">{error}</div>
          ) : !data?.data.length ? (
            <div className="rounded-xl bg-slate-800 border border-slate-700 p-12 text-center text-slate-400">
              <svg className="mx-auto mb-4 h-12 w-12 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414A1 1 0 0119 9.414V19a2 2 0 01-2 2z" /></svg>
              <p className="text-sm">No quote requests found.</p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-2xl border border-slate-700 bg-slate-800">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[800px] text-sm">
                  <thead>
                    <tr className="border-b border-slate-700 bg-slate-900/50 text-xs font-bold uppercase tracking-wider text-slate-500">
                      <th className="px-5 py-3.5 text-left">Request #</th>
                      <th className="px-5 py-3.5 text-left">Customer</th>
                      <th className="px-5 py-3.5 text-left">Contact</th>
                      <th className="px-5 py-3.5 text-center">Items</th>
                      <th className="px-5 py-3.5 text-left">Status</th>
                      <th className="px-5 py-3.5 text-left">Urgency</th>
                      <th className="px-5 py-3.5 text-left">Date</th>
                      <th className="px-5 py-3.5 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/50">
                    {data.data.map((qr) => (
                      <tr key={qr.id} className="group transition hover:bg-slate-700/40">
                        <td className="px-5 py-4">
                          <span className="font-bold text-indigo-400">{qr.request_number}</span>
                          {qr.quotation && (
                            <div className="mt-0.5 text-xs text-slate-500">
                              QT: <span className="text-violet-400">{qr.quotation.quote_number}</span>
                            </div>
                          )}
                        </td>
                        <td className="px-5 py-4">
                          <p className="font-semibold text-white">{qr.customer_name}</p>
                          {qr.company_name && <p className="text-xs text-slate-400">{qr.company_name}</p>}
                          <p className="text-xs text-slate-500">{qr.email}</p>
                        </td>
                        <td className="px-5 py-4">
                          <p className="text-slate-300">{qr.phone}</p>
                          <p className="mt-0.5 text-xs text-slate-500 capitalize">{qr.preferred_contact}</p>
                        </td>
                        <td className="px-5 py-4 text-center">
                          <span className="rounded-full bg-slate-700 px-2.5 py-1 text-xs font-bold text-slate-200">
                            {qr.items?.length ?? 0}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <span className={`rounded-full px-3 py-1 text-xs font-bold ${STATUS_COLORS[qr.status] ?? "bg-gray-100 text-gray-700"}`}>
                            {STATUS_LABELS[qr.status] ?? qr.status}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          {qr.urgency && (
                            <span className={`rounded-full px-3 py-1 text-xs font-bold capitalize ${URGENCY_COLORS[qr.urgency] ?? "bg-gray-100 text-gray-600"}`}>
                              {qr.urgency.replace("_", " ")}
                            </span>
                          )}
                        </td>
                        <td className="px-5 py-4 text-slate-400 text-xs">{formatDate(qr.created_at)}</td>
                        <td className="px-5 py-4 text-center">
                          <Link
                            href={`/admin/quotes/${qr.id}`}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-bold text-white transition hover:bg-indigo-500"
                          >
                            Review →
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {data.last_page > 1 && (
                <div className="flex items-center justify-between border-t border-slate-700 px-5 py-3">
                  <span className="text-xs text-slate-500">
                    Page {data.current_page} of {data.last_page} &bull; {data.total} total
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={data.current_page <= 1}
                      className="rounded-lg border border-slate-600 px-3 py-1.5 text-xs font-semibold text-slate-300 transition hover:bg-slate-700 disabled:opacity-40"
                    >← Prev</button>
                    <button
                      onClick={() => setPage((p) => Math.min(data.last_page, p + 1))}
                      disabled={data.current_page >= data.last_page}
                      className="rounded-lg border border-slate-600 px-3 py-1.5 text-xs font-semibold text-slate-300 transition hover:bg-slate-700 disabled:opacity-40"
                    >Next →</button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
