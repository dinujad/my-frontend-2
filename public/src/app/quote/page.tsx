"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { useQuoteCartStore, type QuoteCartItem } from "@/stores/quote-cart-store";
import { useToast } from "@/components/ui/ToastProvider";
import { clsx } from "clsx";
import { catalogImageSrc } from "@/lib/media-url";

// ── Types ──────────────────────────────────────────────────────────────────
interface ProductSuggestion {
  id: number;
  name: string;
  slug: string;
  sku: string;
  image: string;
  price: string;
  variations: { id: number; sku: string; attributes: Record<string, string> }[];
}

// ── Product Search ──────────────────────────────────────────────────────────
function ProductSearchBox({ onAdd }: { onAdd: (item: Omit<QuoteCartItem, "id">) => void }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ProductSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    if (query.length < 2) { setResults([]); setOpen(false); return; }
    const t = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/quote-requests/products/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        setResults(data);
        setOpen(true);
      } catch { /* ignore */ }
      finally { setLoading(false); }
    }, 300);
    return () => clearTimeout(t);
  }, [query]);

  const select = (product: ProductSuggestion, variation?: ProductSuggestion["variations"][0]) => {
    const label = variation
      ? Object.values(variation.attributes || {}).join(" / ")
      : undefined;
    onAdd({
      product_id: product.id,
      product_variation_id: variation?.id ?? null,
      product_name: label ? `${product.name} — ${label}` : product.name,
      product_sku: variation?.sku ?? product.sku,
      product_image: product.image,
      product_slug: product.slug,
      variation_attributes: variation?.attributes ?? null,
      quantity: 1,
    });
    setQuery("");
    setResults([]);
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative">
      <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm focus-within:border-brand-red focus-within:ring-2 focus-within:ring-red-100">
        <svg className="h-4 w-4 shrink-0 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="search"
          placeholder="Search products to add…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 bg-transparent text-sm text-gray-800 placeholder-gray-400 outline-none"
        />
        {loading && <span className="h-4 w-4 animate-spin rounded-full border-2 border-brand-red border-t-transparent" />}
      </div>

      {open && results.length > 0 && (
        <div className="absolute left-0 right-0 top-full z-50 mt-1 max-h-80 overflow-y-auto rounded-xl border border-gray-200 bg-white shadow-xl">
          {results.map((p) => (
            <div key={p.id}>
              {p.variations.length === 0 ? (
                <button
                  type="button"
                  onClick={() => select(p)}
                  className="flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-red-50"
                >
                  {p.image && (
                    <img src={catalogImageSrc(p.image)} alt={p.name} className="h-10 w-10 rounded-lg object-contain" />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-gray-900">{p.name}</p>
                    {p.sku && <p className="text-xs text-gray-400">SKU: {p.sku}</p>}
                  </div>
                  <span className="shrink-0 text-sm font-bold text-gray-700">{p.price}</span>
                </button>
              ) : (
                <>
                  <div className="flex items-center gap-3 px-4 py-2 bg-gray-50">
                    {p.image && (
                      <img src={catalogImageSrc(p.image)} alt={p.name} className="h-8 w-8 rounded-lg object-contain" />
                    )}
                    <p className="text-sm font-semibold text-gray-800">{p.name}</p>
                  </div>
                  {p.variations.map((v) => (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => select(p, v)}
                      className="flex w-full items-center gap-3 py-2 pl-12 pr-4 text-left transition hover:bg-red-50"
                    >
                      <span className="text-sm text-gray-700">
                        {Object.values(v.attributes || {}).join(" / ")}
                      </span>
                      {v.sku && <span className="ml-auto text-xs text-gray-400">SKU: {v.sku}</span>}
                    </button>
                  ))}
                </>
              )}
            </div>
          ))}
        </div>
      )}
      {open && results.length === 0 && !loading && query.length >= 2 && (
        <div className="absolute left-0 right-0 top-full z-50 mt-1 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-400 shadow-xl">
          No products found for "{query}"
        </div>
      )}
    </div>
  );
}

// ── Cart Item Row ────────────────────────────────────────────────────────────
function CartItemRow({
  item,
  onUpdate,
  onRemove,
}: {
  item: QuoteCartItem;
  onUpdate: (id: string, changes: Partial<QuoteCartItem>) => void;
  onRemove: (id: string) => void;
}) {
  return (
    <div className="flex items-start gap-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
      {item.product_image ? (
        <img
          src={catalogImageSrc(item.product_image)}
          alt={item.product_name}
          className="h-16 w-16 shrink-0 rounded-xl object-contain bg-gray-50 p-1"
        />
      ) : (
        <div className="h-16 w-16 shrink-0 rounded-xl bg-gray-100 flex items-center justify-center text-gray-300">
          <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-gray-900 text-sm leading-snug">{item.product_name}</p>
        {item.product_sku && <p className="mt-0.5 text-xs text-gray-400">SKU: {item.product_sku}</p>}

        <div className="mt-3 flex flex-wrap items-center gap-3">
          {/* Quantity */}
          <div className="flex h-9 items-stretch overflow-hidden rounded-lg border border-gray-200">
            <button type="button" onClick={() => onUpdate(item.id, { quantity: Math.max(1, item.quantity - 1) })} className="flex w-8 items-center justify-center text-gray-500 hover:bg-gray-50 transition">−</button>
            <input
              type="number"
              value={item.quantity}
              onChange={(e) => onUpdate(item.id, { quantity: Math.max(1, parseInt(e.target.value, 10) || 1) })}
              className="w-12 border-x border-gray-200 text-center text-sm font-bold outline-none [-moz-appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
              min={1}
            />
            <button type="button" onClick={() => onUpdate(item.id, { quantity: item.quantity + 1 })} className="flex w-8 items-center justify-center text-gray-500 hover:bg-gray-50 transition">+</button>
          </div>

          {/* Notes */}
          <input
            type="text"
            placeholder="Item notes (optional)…"
            value={item.item_notes ?? ""}
            onChange={(e) => onUpdate(item.id, { item_notes: e.target.value })}
            className="flex-1 min-w-[160px] rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-700 placeholder-gray-400 outline-none focus:border-brand-red focus:ring-1 focus:ring-red-100"
          />
        </div>
      </div>
      <button
        type="button"
        onClick={() => onRemove(item.id)}
        className="shrink-0 mt-1 rounded-lg p-1.5 text-gray-400 transition hover:bg-red-50 hover:text-red-500"
        aria-label="Remove item"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
      </button>
    </div>
  );
}

// ── Success Screen ────────────────────────────────────────────────────────────
function SuccessScreen({ requestNumber, onReset }: { requestNumber: string; onReset: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center px-4">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-100 mb-6">
        <svg className="h-10 w-10 text-brand-red" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Quote Request Submitted!</h2>
      <p className="text-gray-500 mb-2">Your reference number is:</p>
      <p className="text-3xl font-extrabold text-brand-red mb-6">{requestNumber}</p>
      <p className="text-sm text-gray-500 max-w-sm mb-8">
        Our team will review your request and get back to you shortly via your preferred contact method.
      </p>
      <button
        type="button"
        onClick={onReset}
        className="rounded-xl bg-brand-red px-8 py-3 text-sm font-bold text-white shadow-lg shadow-red-600/25 transition hover:bg-brand-red-dark"
      >
        Submit Another Request
      </button>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function QuotePage() {
  const router = useRouter();
  const { showToast } = useToast();
  const { items, addItem, updateItem, removeItem, clearCart } = useQuoteCartStore();

  const [form, setForm] = useState({
    customer_name: "",
    company_name: "",
    email: "",
    phone: "",
    address: "",
    preferred_contact: "whatsapp",
    preferred_response: "whatsapp",
    urgency: "normal",
    deadline: "",
    notes: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);

  const set = (field: string, value: string) => {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => { const n = { ...e }; delete n[field]; return n; });
  };

  const validate = () => {
    const err: Record<string, string> = {};
    if (!form.customer_name.trim()) err.customer_name = "Name is required";
    if (!form.email.trim()) err.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) err.email = "Invalid email address";
    if (!form.phone.trim()) err.phone = "Phone/WhatsApp is required";
    if (items.length === 0) err.items = "Please add at least one product";
    return err;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setSubmitting(true);
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      const headers: Record<string, string> = { "Content-Type": "application/json", Accept: "application/json" };
      if (token) headers.Authorization = `Bearer ${token}`;

      const res = await fetch("/api/quote-requests", {
        method: "POST",
        headers,
        body: JSON.stringify({
          ...form,
          items: items.map((i) => ({
            product_id: i.product_id,
            product_variation_id: i.product_variation_id ?? null,
            product_name: i.product_name,
            product_sku: i.product_sku ?? null,
            product_image: i.product_image ?? null,
            variation_attributes: i.variation_attributes ?? null,
            quantity: i.quantity,
            item_notes: i.item_notes ?? null,
          })),
        }),
      });

      if (!res.ok) {
        const body = await res.json();
        if (body.errors) {
          const mapped: Record<string, string> = {};
          Object.entries(body.errors as Record<string, string[]>).forEach(([k, v]) => {
            mapped[k] = Array.isArray(v) ? v[0] : String(v);
          });
          setErrors(mapped);
        } else {
          showToast(body.message ?? "Submission failed. Please try again.", "error");
        }
        return;
      }

      const data = await res.json();
      clearCart();
      setSuccess(data.request_number);
    } catch {
      showToast("Network error. Please try again.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <main className="min-h-screen bg-[#f6f5f8]">
        <div className="mx-auto max-w-3xl px-4 py-12">
          <SuccessScreen requestNumber={success} onReset={() => { setSuccess(null); setForm({ customer_name: "", company_name: "", email: "", phone: "", address: "", preferred_contact: "whatsapp", preferred_response: "whatsapp", urgency: "normal", deadline: "", notes: "" }); }} />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f6f5f8] pb-16">
      <div className="bg-gradient-to-br from-brand-red to-red-900 py-10 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-extrabold sm:text-4xl">Request a Quotation</h1>
          <p className="mt-2 text-red-100 text-sm">
            Add products, fill your details, and our team will send you a custom quote.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <form onSubmit={handleSubmit} noValidate>
          <div className="grid gap-8 lg:grid-cols-[1fr_400px]">

            {/* ── Left column ── */}
            <div className="space-y-8">

              {/* Products section */}
              <section className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
                <h2 className="text-lg font-bold text-gray-900 mb-1 flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-red-100 text-brand-red text-sm font-bold">1</span>
                  Products
                </h2>
                <p className="text-sm text-gray-500 mb-5">Search and add products you'd like a quote for.</p>

                <ProductSearchBox onAdd={(item) => { addItem(item); }} />

                {errors.items && (
                  <p className="mt-2 text-sm text-red-500">{errors.items}</p>
                )}

                {items.length > 0 ? (
                  <div className="mt-4 space-y-3">
                    {items.map((item) => (
                      <CartItemRow
                        key={item.id}
                        item={item}
                        onUpdate={updateItem}
                        onRemove={removeItem}
                      />
                    ))}
                    <button
                      type="button"
                      onClick={clearCart}
                      className="w-full rounded-xl border border-dashed border-red-200 py-2.5 text-sm font-semibold text-red-400 transition hover:border-red-300 hover:bg-red-50 hover:text-red-600"
                    >
                      Clear all items
                    </button>
                  </div>
                ) : (
                  <div className="mt-4 rounded-xl border border-dashed border-gray-200 bg-gray-50 py-10 text-center">
                    <svg className="mx-auto mb-3 h-10 w-10 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414A1 1 0 0119 9.414V19a2 2 0 01-2 2z" /></svg>
                    <p className="text-sm text-gray-400">No products added yet. Search above or browse products.</p>
                    <a href="/products" className="mt-3 inline-block text-sm font-semibold text-brand-red hover:underline">Browse Products →</a>
                  </div>
                )}
              </section>

              {/* Your details */}
              <section className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
                <h2 className="text-lg font-bold text-gray-900 mb-1 flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-red-100 text-brand-red text-sm font-bold">2</span>
                  Your Details
                </h2>
                <p className="text-sm text-gray-500 mb-5">We'll use this information to send your quotation.</p>

                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Full Name *" error={errors.customer_name}>
                    <input className={inputCls(errors.customer_name)} placeholder="John Perera" value={form.customer_name} onChange={(e) => set("customer_name", e.target.value)} />
                  </Field>
                  <Field label="Company Name">
                    <input className={inputCls()} placeholder="ABC Company (optional)" value={form.company_name} onChange={(e) => set("company_name", e.target.value)} />
                  </Field>
                  <Field label="Email Address *" error={errors.email}>
                    <input type="email" className={inputCls(errors.email)} placeholder="john@example.com" value={form.email} onChange={(e) => set("email", e.target.value)} />
                  </Field>
                  <Field label="Phone / WhatsApp *" error={errors.phone}>
                    <input type="tel" className={inputCls(errors.phone)} placeholder="+94 71 234 5678" value={form.phone} onChange={(e) => set("phone", e.target.value)} />
                  </Field>
                  <Field label="Address" className="sm:col-span-2">
                    <input className={inputCls()} placeholder="Street, City (optional)" value={form.address} onChange={(e) => set("address", e.target.value)} />
                  </Field>
                </div>
              </section>

              {/* Request preferences */}
              <section className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
                <h2 className="text-lg font-bold text-gray-900 mb-1 flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-red-100 text-brand-red text-sm font-bold">3</span>
                  Preferences & Notes
                </h2>

                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <Field label="Preferred Contact Method">
                    <SelectField value={form.preferred_contact} onChange={(v) => set("preferred_contact", v)} options={[{ value: "whatsapp", label: "WhatsApp" }, { value: "email", label: "Email" }, { value: "phone", label: "Phone Call" }]} />
                  </Field>
                  <Field label="Preferred Response Method">
                    <SelectField value={form.preferred_response} onChange={(v) => set("preferred_response", v)} options={[{ value: "whatsapp", label: "WhatsApp" }, { value: "email", label: "Email" }]} />
                  </Field>
                  <Field label="Urgency">
                    <SelectField value={form.urgency} onChange={(v) => set("urgency", v)} options={[{ value: "normal", label: "Normal" }, { value: "urgent", label: "Urgent" }, { value: "very_urgent", label: "Very Urgent" }]} />
                  </Field>
                  <Field label="Required By (deadline)">
                    <input type="date" className={inputCls()} value={form.deadline} onChange={(e) => set("deadline", e.target.value)} min={new Date().toISOString().split("T")[0]} />
                  </Field>
                  <Field label="Additional Notes / Requirements" className="sm:col-span-2">
                    <textarea rows={4} className={inputCls() + " resize-none"} placeholder="Describe your requirements, specifications, printing details…" value={form.notes} onChange={(e) => set("notes", e.target.value)} />
                  </Field>
                </div>
              </section>
            </div>

            {/* ── Right column — Summary ── */}
            <div className="space-y-6">
              <div className="sticky top-24 space-y-6">
                <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
                  <h3 className="text-base font-bold text-gray-900 mb-4">Quote Summary</h3>

                  {items.length === 0 ? (
                    <p className="text-sm text-gray-400 text-center py-6">No items yet.</p>
                  ) : (
                    <div className="space-y-3 mb-5">
                      {items.map((item) => (
                        <div key={item.id} className="flex items-center gap-3">
                          {item.product_image ? (
                            <img src={catalogImageSrc(item.product_image)} alt="" className="h-10 w-10 rounded-lg object-contain bg-gray-50 shrink-0" />
                          ) : (
                            <div className="h-10 w-10 rounded-lg bg-gray-100 shrink-0" />
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-gray-800 truncate">{item.product_name}</p>
                            <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="border-t border-gray-100 pt-4 space-y-2 text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span>Total Items</span>
                      <span className="font-bold text-gray-900">{items.reduce((s, i) => s + i.quantity, 0)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Products</span>
                      <span className="font-bold text-gray-900">{items.length}</span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting || items.length === 0}
                    className={clsx(
                      "mt-6 w-full rounded-xl py-3.5 text-sm font-bold text-white shadow-lg transition",
                      submitting || items.length === 0
                        ? "bg-gray-300 cursor-not-allowed"
                        : "bg-brand-red shadow-red-600/25 hover:bg-brand-red-dark"
                    )}
                  >
                    {submitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        Submitting…
                      </span>
                    ) : (
                      "Submit Quote Request"
                    )}
                  </button>

                  <p className="mt-3 text-center text-xs text-gray-400">
                    We'll respond within 24 hours via your preferred method.
                  </p>
                </div>

                <div className="rounded-2xl bg-red-50 border border-red-100 p-5">
                  <h4 className="text-sm font-bold text-red-800 mb-3">How it works</h4>
                  <ol className="space-y-2 text-xs text-red-700">
                    <li className="flex gap-2"><span className="font-bold">1.</span> Add products and fill your details</li>
                    <li className="flex gap-2"><span className="font-bold">2.</span> Submit your quote request</li>
                    <li className="flex gap-2"><span className="font-bold">3.</span> Our team reviews and prepares pricing</li>
                    <li className="flex gap-2"><span className="font-bold">4.</span> You receive a formal quotation via WhatsApp</li>
                    <li className="flex gap-2"><span className="font-bold">5.</span> Approve and convert to order</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}

// ── Helpers ────────────────────────────────────────────────────────────────────
function inputCls(error?: string) {
  return clsx(
    "w-full rounded-xl border px-4 py-2.5 text-sm text-gray-800 outline-none transition",
    error
      ? "border-red-300 bg-red-50 focus:border-red-400 focus:ring-1 focus:ring-red-100"
      : "border-gray-200 bg-white focus:border-brand-red focus:ring-1 focus:ring-red-100"
  );
}

function Field({ label, error, children, className }: { label: string; error?: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={className}>
      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500">{label}</label>
      {children}
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}

function SelectField({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: { value: string; label: string }[] }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-800 outline-none transition focus:border-brand-red focus:ring-1 focus:ring-red-100"
    >
      {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  );
}
