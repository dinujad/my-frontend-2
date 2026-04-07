"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { clsx } from "clsx";
import { catalogImageSrc } from "@/lib/media-url";

// ── Types ──────────────────────────────────────────────────────────────────
interface QuoteRequestItem {
  id: number;
  product_name: string;
  product_sku?: string;
  product_image?: string;
  variation_attributes?: Record<string, string>;
  quantity: number;
  item_notes?: string;
  product?: { id: number; name: string; slug: string };
}

interface StatusLog {
  id: number;
  from_status?: string;
  to_status: string;
  note?: string;
  created_at: string;
  changed_by?: { name: string };
}

interface QuotationItem {
  id?: number;
  product_id?: number | null;
  description: string;
  sku: string;
  quantity: number;
  unit_price: number;
  discount_percent: number;
  subtotal?: number;
  item_notes: string;
}

interface WhatsAppLog {
  id: number;
  phone: string;
  success: boolean;
  sent_at: string;
  sent_by?: { name: string };
}

interface Quotation {
  id: number;
  quote_number: string;
  status: string;
  status_label: string;
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
  pdf_path?: string;
  public_token: string;
  sent_at?: string;
  items: QuotationItem[];
  whatsapp_logs: WhatsAppLog[];
  status_logs: StatusLog[];
}

interface QuoteRequest {
  id: number;
  request_number: string;
  customer_name: string;
  company_name?: string;
  email: string;
  phone: string;
  address?: string;
  status: string;
  urgency?: string;
  preferred_contact: string;
  preferred_response: string;
  deadline?: string;
  customer_notes?: string;
  admin_notes?: string;
  created_at: string;
  customer?: { id: number; name: string } | null;
  assigned_to?: { id: number; name: string } | null;
  items: QuoteRequestItem[];
  status_logs: StatusLog[];
  quotations: Quotation[];
}

// ── Helpers ────────────────────────────────────────────────────────────────
const STATUS_COLORS: Record<string, string> = {
  new: "bg-blue-100 text-blue-800",
  reviewing: "bg-yellow-100 text-yellow-800",
  awaiting_pricing: "bg-orange-100 text-orange-800",
  quoted: "bg-indigo-100 text-indigo-800",
  sent: "bg-violet-100 text-violet-800",
  customer_responded: "bg-cyan-100 text-cyan-800",
  approved: "bg-emerald-100 text-emerald-800",
  rejected: "bg-red-100 text-red-800",
  closed: "bg-gray-100 text-gray-600",
};
const STATUS_LABELS: Record<string, string> = {
  new: "New", reviewing: "Under Review", awaiting_pricing: "Awaiting Pricing",
  quoted: "Quoted", sent: "Sent", customer_responded: "Customer Responded",
  approved: "Approved", rejected: "Rejected", closed: "Closed",
};
const QT_STATUS_COLORS: Record<string, string> = {
  draft: "bg-gray-100 text-gray-700", ready: "bg-blue-100 text-blue-700",
  sent: "bg-indigo-100 text-indigo-700", viewed: "bg-violet-100 text-violet-700",
  accepted: "bg-emerald-100 text-emerald-700", rejected: "bg-red-100 text-red-700",
  expired: "bg-orange-100 text-orange-700",
};
const QT_STATUS_LABELS: Record<string, string> = {
  draft: "Draft", ready: "Ready", sent: "Sent", viewed: "Viewed",
  accepted: "Accepted", rejected: "Rejected", expired: "Expired",
};

function fmtRs(v: string | number) {
  return `Rs. ${Number(v).toLocaleString("en-LK", { minimumFractionDigits: 2 })}`;
}
function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

function inputCls(err?: string) {
  return clsx("w-full rounded-lg border px-3 py-2 text-sm outline-none transition",
    err ? "border-red-400 bg-red-50 focus:ring-1 focus:ring-red-300" : "border-gray-200 bg-white focus:border-indigo-400 focus:ring-1 focus:ring-indigo-100");
}

// ── Quotation Builder ──────────────────────────────────────────────────────
function QuotationBuilder({
  quoteRequest,
  existingQuotation,
  token,
  onSaved,
}: {
  quoteRequest: QuoteRequest;
  existingQuotation?: Quotation;
  token: string;
  onSaved: () => void;
}) {
  const [items, setItems] = useState<QuotationItem[]>(
    existingQuotation?.items.map((i) => ({
      id: i.id,
      product_id: i.product_id ?? null,
      description: i.description,
      sku: i.sku ?? "",
      quantity: i.quantity,
      unit_price: Number(i.unit_price),
      discount_percent: Number(i.discount_percent),
      item_notes: i.item_notes ?? "",
    })) ??
    quoteRequest.items.map((ri) => ({
      product_id: ri.product?.id ?? null,
      description: ri.product_name,
      sku: ri.product_sku ?? "",
      quantity: ri.quantity,
      unit_price: 0,
      discount_percent: 0,
      item_notes: ri.item_notes ?? "",
    }))
  );
  const [meta, setMeta] = useState({
    valid_until: existingQuotation?.valid_until ?? "",
    discount_amount: String(existingQuotation?.discount_amount ?? "0"),
    tax_amount: String(existingQuotation?.tax_amount ?? "0"),
    payment_terms: existingQuotation?.payment_terms ?? "",
    delivery_details: existingQuotation?.delivery_details ?? "",
    terms_conditions: existingQuotation?.terms_conditions ?? "",
    notes: existingQuotation?.notes ?? "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const setMet = (k: string, v: string) => setMeta((m) => ({ ...m, [k]: v }));

  const addItem = () => setItems((prev) => [...prev, { description: "", sku: "", quantity: 1, unit_price: 0, discount_percent: 0, item_notes: "" }]);
  const removeItem = (idx: number) => setItems((prev) => prev.filter((_, i) => i !== idx));
  const updateItem = (idx: number, changes: Partial<QuotationItem>) =>
    setItems((prev) => prev.map((item, i) => i === idx ? { ...item, ...changes } : item));

  const lineSubtotal = (item: QuotationItem) => {
    const base = item.quantity * item.unit_price;
    return base * (1 - item.discount_percent / 100);
  };
  const subtotal = items.reduce((s, i) => s + lineSubtotal(i), 0);
  const grandTotal = subtotal - Number(meta.discount_amount) + Number(meta.tax_amount);

  const save = async () => {
    setSaving(true); setError(null);
    try {
      const body = {
        ...meta,
        discount_amount: Number(meta.discount_amount),
        tax_amount: Number(meta.tax_amount),
        items: items.map((item, idx) => ({ ...item, sort_order: idx })),
      };

      let url: string, method: string;
      if (existingQuotation) {
        url = `/api/admin/quotes/quotation/${existingQuotation.id}`;
        method = "PUT";
      } else {
        url = `/api/admin/quotes/${quoteRequest.id}/quotation`;
        method = "POST";
      }

      const res = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const d = await res.json();
        setError(d.message ?? "Failed to save quotation");
        return;
      }
      onSaved();
    } catch { setError("Network error"); }
    finally { setSaving(false); }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-gray-900">
            {existingQuotation ? `Edit Quotation ${existingQuotation.quote_number}` : "Create Quotation"}
          </h3>
          {existingQuotation && (
            <span className={clsx("rounded-full px-3 py-1 text-xs font-bold", QT_STATUS_COLORS[existingQuotation.status])}>
              {QT_STATUS_LABELS[existingQuotation.status]}
            </span>
          )}
        </div>

        {error && <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>}

        {/* Line items */}
        <div className="mb-5 overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-xs font-bold uppercase tracking-wider text-gray-400">
                <th className="pb-2 text-left pl-1">Description</th>
                <th className="pb-2 text-center w-16">Qty</th>
                <th className="pb-2 text-right w-28">Unit Price</th>
                <th className="pb-2 text-center w-20">Disc %</th>
                <th className="pb-2 text-right w-28">Subtotal</th>
                <th className="pb-2 w-8"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {items.map((item, idx) => (
                <tr key={idx}>
                  <td className="py-2 pr-2">
                    <input
                      className={inputCls()}
                      placeholder="Item description"
                      value={item.description}
                      onChange={(e) => updateItem(idx, { description: e.target.value })}
                    />
                    <input
                      className="mt-1 w-full rounded border border-gray-100 bg-gray-50 px-2 py-1 text-xs text-gray-500 outline-none"
                      placeholder="SKU (optional)"
                      value={item.sku}
                      onChange={(e) => updateItem(idx, { sku: e.target.value })}
                    />
                    <input
                      className="mt-1 w-full rounded border border-gray-100 bg-gray-50 px-2 py-1 text-xs text-gray-500 outline-none"
                      placeholder="Item notes (optional)"
                      value={item.item_notes}
                      onChange={(e) => updateItem(idx, { item_notes: e.target.value })}
                    />
                  </td>
                  <td className="py-2 px-1 text-center">
                    <input
                      type="number" min={1}
                      className="w-16 rounded border border-gray-200 py-1.5 text-center text-sm outline-none focus:border-indigo-400"
                      value={item.quantity}
                      onChange={(e) => updateItem(idx, { quantity: Math.max(1, parseInt(e.target.value) || 1) })}
                    />
                  </td>
                  <td className="py-2 px-1">
                    <input
                      type="number" min={0} step={0.01}
                      className="w-full rounded border border-gray-200 py-1.5 text-right text-sm outline-none focus:border-indigo-400"
                      value={item.unit_price}
                      onChange={(e) => updateItem(idx, { unit_price: parseFloat(e.target.value) || 0 })}
                    />
                  </td>
                  <td className="py-2 px-1 text-center">
                    <input
                      type="number" min={0} max={100} step={0.5}
                      className="w-16 rounded border border-gray-200 py-1.5 text-center text-sm outline-none focus:border-indigo-400"
                      value={item.discount_percent}
                      onChange={(e) => updateItem(idx, { discount_percent: parseFloat(e.target.value) || 0 })}
                    />
                  </td>
                  <td className="py-2 px-1 text-right font-semibold text-gray-800">
                    {fmtRs(lineSubtotal(item))}
                  </td>
                  <td className="py-2 pl-1">
                    <button type="button" onClick={() => removeItem(idx)} className="rounded p-1 text-gray-400 transition hover:bg-red-50 hover:text-red-500">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button type="button" onClick={addItem} className="mt-3 w-full rounded-xl border-2 border-dashed border-gray-200 py-2.5 text-sm font-semibold text-gray-400 transition hover:border-indigo-300 hover:text-indigo-600">
            + Add line item
          </button>
        </div>

        {/* Totals */}
        <div className="mb-6 flex justify-end">
          <div className="w-72 space-y-2 text-sm">
            <div className="flex justify-between text-gray-600"><span>Subtotal</span><span className="font-semibold">{fmtRs(subtotal)}</span></div>
            <div className="flex items-center justify-between gap-2 text-gray-600">
              <span>Discount (Rs.)</span>
              <input type="number" min={0} className="w-28 rounded border border-gray-200 py-1 text-right text-sm outline-none focus:border-indigo-400 px-2"
                value={meta.discount_amount} onChange={(e) => setMet("discount_amount", e.target.value)} />
            </div>
            <div className="flex items-center justify-between gap-2 text-gray-600">
              <span>Tax (Rs.)</span>
              <input type="number" min={0} className="w-28 rounded border border-gray-200 py-1 text-right text-sm outline-none focus:border-indigo-400 px-2"
                value={meta.tax_amount} onChange={(e) => setMet("tax_amount", e.target.value)} />
            </div>
            <div className="flex justify-between border-t border-gray-200 pt-2 text-base font-bold text-gray-900">
              <span>Grand Total</span>
              <span className="text-indigo-600">{fmtRs(grandTotal)}</span>
            </div>
          </div>
        </div>

        {/* Meta fields */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-gray-400">Valid Until</label>
            <input type="date" className={inputCls()} value={meta.valid_until} onChange={(e) => setMet("valid_until", e.target.value)} />
          </div>
          <div />
          <div>
            <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-gray-400">Payment Terms</label>
            <textarea rows={2} className={inputCls() + " resize-none"} value={meta.payment_terms} onChange={(e) => setMet("payment_terms", e.target.value)} placeholder="e.g. 50% advance, 50% on delivery" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-gray-400">Delivery Details</label>
            <textarea rows={2} className={inputCls() + " resize-none"} value={meta.delivery_details} onChange={(e) => setMet("delivery_details", e.target.value)} placeholder="Delivery method, timeline…" />
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-gray-400">Terms & Conditions</label>
            <textarea rows={3} className={inputCls() + " resize-none"} value={meta.terms_conditions} onChange={(e) => setMet("terms_conditions", e.target.value)} placeholder="Standard T&C…" />
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-gray-400">Internal Notes</label>
            <textarea rows={2} className={inputCls() + " resize-none"} value={meta.notes} onChange={(e) => setMet("notes", e.target.value)} />
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={save}
            disabled={saving}
            className="flex-1 rounded-xl bg-indigo-600 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-700 disabled:opacity-60"
          >
            {saving ? "Saving…" : existingQuotation ? "Update Quotation" : "Create Quotation"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function AdminQuoteDetailPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const [qr, setQr] = useState<QuoteRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"details" | "quotation" | "logs">("details");
  const [statusChanging, setStatusChanging] = useState(false);
  const [sendingWa, setSendingWa] = useState(false);
  const [generatingPdf, setGeneratingPdf] = useState(false);
  const [adminNotes, setAdminNotes] = useState("");
  const [savingNotes, setSavingNotes] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  const getToken = () => localStorage.getItem("token") ?? "";

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const token = getToken();
      if (!token) { router.push("/admin/login"); return; }
      const res = await fetch(`/api/admin/quotes/${id}`, {
        headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
      });
      if (res.status === 401) { router.push("/admin/login"); return; }
      if (!res.ok) throw new Error("Not found");
      const data: QuoteRequest = await res.json();
      setQr(data);
      setAdminNotes(data.admin_notes ?? "");
    } catch (e: any) { setError(e.message); }
    finally { setLoading(false); }
  }, [id, router]);

  useEffect(() => { load(); }, [load]);

  const changeStatus = async (status: string) => {
    if (!qr) return;
    setStatusChanging(true);
    try {
      const res = await fetch(`/api/admin/quotes/${qr.id}/status`, {
        method: "POST",
        headers: { Authorization: `Bearer ${getToken()}`, "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) { showToast("Status updated"); load(); }
      else showToast("Failed to update status", "error");
    } finally { setStatusChanging(false); }
  };

  const saveAdminNotes = async () => {
    if (!qr) return;
    setSavingNotes(true);
    try {
      const res = await fetch(`/api/admin/quotes/${qr.id}/admin-notes`, {
        method: "POST",
        headers: { Authorization: `Bearer ${getToken()}`, "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ admin_notes: adminNotes }),
      });
      if (res.ok) showToast("Notes saved");
      else showToast("Failed to save notes", "error");
    } finally { setSavingNotes(false); }
  };

  const sendWhatsApp = async (quotationId: number, force = false) => {
    setSendingWa(true);
    try {
      const body: Record<string, unknown> = {};
      if (force) body.force = true;
      const res = await fetch(`/api/admin/quotes/quotation/${quotationId}/send-whatsapp`, {
        method: "POST",
        headers: { Authorization: `Bearer ${getToken()}`, "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (res.ok && data.success) { showToast("Quotation sent via WhatsApp!"); load(); }
      else if (res.status === 409) {
        if (confirm("Already sent recently. Force resend?")) sendWhatsApp(quotationId, true);
      } else showToast(data.message ?? "WhatsApp send failed", "error");
    } finally { setSendingWa(false); }
  };

  const generatePdf = async (quotationId: number) => {
    setGeneratingPdf(true);
    try {
      const res = await fetch(`/api/admin/quotes/quotation/${quotationId}/generate-pdf`, {
        method: "POST",
        headers: { Authorization: `Bearer ${getToken()}`, Accept: "application/json" },
      });
      const data = await res.json();
      if (res.ok) {
        showToast("Document generated!");
        if (data.pdf_url) window.open(data.pdf_url, "_blank");
        load();
      } else showToast("Failed to generate document", "error");
    } finally { setGeneratingPdf(false); }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0f172a]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
      </div>
    );
  }
  if (error || !qr) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0f172a] text-white">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error ?? "Not found"}</p>
          <Link href="/admin/quotes" className="text-indigo-400 hover:underline">← Back to Quote Requests</Link>
        </div>
      </div>
    );
  }

  const latestQuotation = qr.quotations[0] ?? null;

  return (
    <div className="min-h-screen bg-[#0f172a] text-white">
      {/* Toast */}
      {toast && (
        <div className={clsx("fixed top-5 right-5 z-50 rounded-xl px-5 py-3 text-sm font-bold shadow-xl", toast.type === "success" ? "bg-emerald-600 text-white" : "bg-red-600 text-white")}>
          {toast.msg}
        </div>
      )}

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Back + header */}
        <Link href="/admin/quotes" className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-white mb-6">
          ← Back to Quote Requests
        </Link>

        <div className="mb-6 flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl font-extrabold text-white">{qr.request_number}</h1>
              <span className={clsx("rounded-full px-3 py-1 text-xs font-bold", STATUS_COLORS[qr.status])}>
                {STATUS_LABELS[qr.status] ?? qr.status}
              </span>
            </div>
            <p className="mt-1 text-sm text-slate-400">Submitted {fmtDate(qr.created_at)}</p>
          </div>

          {/* Quick status change */}
          <div className="flex items-center gap-2 flex-wrap">
            <select
              value={qr.status}
              disabled={statusChanging}
              onChange={(e) => changeStatus(e.target.value)}
              className="rounded-xl border border-slate-600 bg-slate-700 px-3 py-2 text-sm text-white outline-none focus:border-indigo-500"
            >
              {Object.entries(STATUS_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          {/* ── Main column ── */}
          <div className="space-y-5">
            {/* Tabs */}
            <div className="flex gap-1 rounded-2xl bg-slate-800 p-1 w-fit">
              {(["details", "quotation", "logs"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setActiveTab(t)}
                  className={clsx("rounded-xl px-5 py-2 text-sm font-bold capitalize transition",
                    activeTab === t ? "bg-indigo-600 text-white shadow" : "text-slate-400 hover:text-white")}
                >
                  {t}
                </button>
              ))}
            </div>

            {activeTab === "details" && (
              <div className="space-y-5">
                {/* Customer info */}
                <div className="rounded-2xl border border-slate-700 bg-slate-800 p-6">
                  <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-slate-400">Customer Information</h3>
                  <div className="grid gap-3 sm:grid-cols-2 text-sm">
                    {[
                      ["Name", qr.customer_name],
                      ["Company", qr.company_name],
                      ["Email", qr.email],
                      ["Phone", qr.phone],
                      ["Address", qr.address],
                      ["Contact Preference", qr.preferred_contact],
                      ["Response Preference", qr.preferred_response],
                      ["Urgency", qr.urgency],
                      ["Deadline", qr.deadline],
                    ].filter(([, v]) => v).map(([k, v]) => (
                      <div key={String(k)}>
                        <span className="text-slate-500 text-xs font-semibold">{k}</span>
                        <p className="text-white font-medium mt-0.5 capitalize">{String(v)}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Requested items */}
                <div className="rounded-2xl border border-slate-700 bg-slate-800 p-6">
                  <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-slate-400">
                    Requested Items ({qr.items.length})
                  </h3>
                  <div className="space-y-3">
                    {qr.items.map((item) => (
                      <div key={item.id} className="flex items-start gap-4 rounded-xl border border-slate-700 bg-slate-900 p-4">
                        {item.product_image ? (
                          <img src={catalogImageSrc(item.product_image)} alt="" className="h-14 w-14 shrink-0 rounded-lg object-contain bg-white/5" />
                        ) : (
                          <div className="h-14 w-14 shrink-0 rounded-lg bg-slate-700 flex items-center justify-center text-slate-500">
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10" /></svg>
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-white">{item.product_name}</p>
                          {item.product_sku && <p className="text-xs text-slate-400 mt-0.5">SKU: {item.product_sku}</p>}
                          {item.variation_attributes && Object.keys(item.variation_attributes).length > 0 && (
                            <p className="text-xs text-slate-400 mt-0.5">
                              {Object.entries(item.variation_attributes).map(([k, v]) => `${k}: ${v}`).join(" | ")}
                            </p>
                          )}
                          {item.item_notes && <p className="text-xs text-slate-500 mt-1 italic">{item.item_notes}</p>}
                        </div>
                        <div className="shrink-0 text-right">
                          <span className="rounded-full bg-indigo-900/60 px-3 py-1 text-sm font-bold text-indigo-300">
                            × {item.quantity}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Customer notes */}
                {qr.customer_notes && (
                  <div className="rounded-2xl border border-slate-700 bg-slate-800 p-5">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Customer Notes</h4>
                    <p className="text-sm text-slate-300 whitespace-pre-line">{qr.customer_notes}</p>
                  </div>
                )}

                {/* Admin notes */}
                <div className="rounded-2xl border border-slate-700 bg-slate-800 p-5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Admin Notes</h4>
                  <textarea
                    rows={4}
                    className="w-full rounded-xl border border-slate-600 bg-slate-900 px-4 py-3 text-sm text-white outline-none focus:border-indigo-500 resize-none"
                    placeholder="Internal notes for this request…"
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                  />
                  <button
                    onClick={saveAdminNotes}
                    disabled={savingNotes}
                    className="mt-3 rounded-xl bg-slate-600 px-5 py-2 text-sm font-bold text-white transition hover:bg-slate-500 disabled:opacity-60"
                  >
                    {savingNotes ? "Saving…" : "Save Notes"}
                  </button>
                </div>
              </div>
            )}

            {activeTab === "quotation" && (
              <QuotationBuilder
                quoteRequest={qr}
                existingQuotation={latestQuotation ?? undefined}
                token={getToken()}
                onSaved={() => { showToast("Quotation saved!"); load(); }}
              />
            )}

            {activeTab === "logs" && (
              <div className="rounded-2xl border border-slate-700 bg-slate-800 p-6">
                <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-slate-400">Status History</h3>
                {qr.status_logs.length === 0 ? (
                  <p className="text-sm text-slate-500">No status history yet.</p>
                ) : (
                  <div className="space-y-3">
                    {qr.status_logs.map((log) => (
                      <div key={log.id} className="flex gap-4 text-sm">
                        <div className="flex flex-col items-center gap-1">
                          <div className="h-2.5 w-2.5 rounded-full bg-indigo-500 mt-1 shrink-0" />
                          <div className="flex-1 w-px bg-slate-700" />
                        </div>
                        <div className="pb-4 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            {log.from_status && <span className={clsx("rounded-full px-2 py-0.5 text-xs font-bold", STATUS_COLORS[log.from_status])}>{STATUS_LABELS[log.from_status] ?? log.from_status}</span>}
                            {log.from_status && <span className="text-slate-500">→</span>}
                            <span className={clsx("rounded-full px-2 py-0.5 text-xs font-bold", STATUS_COLORS[log.to_status])}>{STATUS_LABELS[log.to_status] ?? log.to_status}</span>
                          </div>
                          {log.note && <p className="mt-1 text-slate-400 text-xs">{log.note}</p>}
                          <p className="mt-1 text-[11px] text-slate-500">
                            {fmtDate(log.created_at)}{log.changed_by ? ` · ${log.changed_by.name}` : ""}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ── Right column ── */}
          <div className="space-y-5">
            {/* Quotation actions */}
            {latestQuotation && (
              <div className="rounded-2xl border border-slate-700 bg-slate-800 p-5 space-y-4">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-3">Quotation Actions</h3>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="font-bold text-white">{latestQuotation.quote_number}</span>
                    <span className={clsx("rounded-full px-2 py-0.5 text-xs font-bold", QT_STATUS_COLORS[latestQuotation.status])}>
                      {QT_STATUS_LABELS[latestQuotation.status]}
                    </span>
                  </div>
                  <p className="text-xl font-extrabold text-indigo-400 mb-4">{fmtRs(latestQuotation.total)}</p>
                </div>

                <button
                  onClick={() => sendWhatsApp(latestQuotation.id)}
                  disabled={sendingWa}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-700 disabled:opacity-60"
                >
                  {sendingWa ? (
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  ) : (
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                  )}
                  Send via WhatsApp
                </button>

                <button
                  onClick={() => generatePdf(latestQuotation.id)}
                  disabled={generatingPdf}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-600 bg-slate-700 py-2.5 text-sm font-bold text-white transition hover:bg-slate-600 disabled:opacity-60"
                >
                  {generatingPdf ? "Generating…" : "Generate & Preview Document"}
                </button>

                {latestQuotation.public_token && (
                  <a
                    href={`/quote/view/${latestQuotation.public_token}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-indigo-700 bg-indigo-900/40 py-2.5 text-sm font-semibold text-indigo-300 transition hover:bg-indigo-900/60"
                  >
                    Preview Customer View ↗
                  </a>
                )}

                {/* WhatsApp logs */}
                {latestQuotation.whatsapp_logs?.length > 0 && (
                  <div className="border-t border-slate-700 pt-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Send Log</h4>
                    {latestQuotation.whatsapp_logs.slice(0, 3).map((log) => (
                      <div key={log.id} className="flex items-center gap-2 text-xs mb-1.5">
                        <span className={clsx("h-2 w-2 rounded-full shrink-0", log.success ? "bg-emerald-500" : "bg-red-500")} />
                        <span className="text-slate-400">{fmtDate(log.sent_at)}</span>
                        <span className={log.success ? "text-emerald-400" : "text-red-400"}>{log.success ? "Sent" : "Failed"}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {!latestQuotation && (
              <div className="rounded-2xl border border-dashed border-slate-600 bg-slate-800/50 p-5 text-center">
                <p className="text-sm text-slate-400 mb-3">No quotation created yet.</p>
                <button
                  onClick={() => setActiveTab("quotation")}
                  className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-indigo-700"
                >
                  Create Quotation
                </button>
              </div>
            )}

            {/* Request summary */}
            <div className="rounded-2xl border border-slate-700 bg-slate-800 p-5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Request Summary</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">Items</span>
                  <span className="font-semibold text-white">{qr.items.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Total Qty</span>
                  <span className="font-semibold text-white">{qr.items.reduce((s, i) => s + i.quantity, 0)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Contact Via</span>
                  <span className="font-semibold text-white capitalize">{qr.preferred_contact}</span>
                </div>
                {qr.urgency && (
                  <div className="flex justify-between">
                    <span className="text-slate-400">Urgency</span>
                    <span className="font-semibold text-white capitalize">{qr.urgency.replace("_", " ")}</span>
                  </div>
                )}
                {qr.deadline && (
                  <div className="flex justify-between">
                    <span className="text-slate-400">Deadline</span>
                    <span className="font-semibold text-white">{qr.deadline}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
