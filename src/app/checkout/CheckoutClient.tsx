"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCartStore, type CartItem } from "@/stores/cart-store";
import { submitOrder } from "@/lib/checkout-api";
import { catalogImageSrc } from "@/lib/media-url";
import { useToast } from "@/components/ui/ToastProvider";
import { useAuthStore } from "@/stores/auth-store";

// ─── Sri Lanka Districts ──────────────────────────────────────────────────────
const SL_DISTRICTS = [
  "Ampara","Anuradhapura","Badulla","Batticaloa","Colombo",
  "Galle","Gampaha","Hambantota","Jaffna","Kalutara",
  "Kandy","Kegalle","Kilinochchi","Kurunegala","Mannar",
  "Matale","Matara","Monaragala","Mullaitivu","Nuwara Eliya",
  "Polonnaruwa","Puttalam","Ratnapura","Trincomalee","Vavuniya",
] as const;

// ─── Types ────────────────────────────────────────────────────────────────────
interface ShippingMethod {
  id: number;
  name: string;
  description: string | null;
  price: number;
  is_free: boolean;
  estimated_days: string | null;
  zone_name: string;
}

interface PaymentMethodOption {
  id: number;
  code: string;
  name: string;
  description: string | null;
  type: "online" | "offline";
}

interface PayhereParams {
  checkout_url: string;
  params: Record<string, string>;
}

// ─── Schema ───────────────────────────────────────────────────────────────────
const schema = z.object({
  customer_name: z.string().min(2, "Enter your full name"),
  customer_email: z.string().email("Enter a valid email"),
  customer_phone: z.string().min(8, "Enter a valid phone number"),
  customer_address: z.string().min(5, "Enter your delivery address"),
  customer_district: z.string().min(1, "Please select your district"),
  notes: z.string().max(2000).optional(),
  register: z.boolean().default(false),
  password: z.string().optional(),
  password_confirmation: z.string().optional(),
}).refine((d) => {
  if (d.register) return !!d.password && d.password.length >= 8;
  return true;
}, { message: "Password must be at least 8 characters", path: ["password"] })
.refine((d) => {
  if (d.register) return d.password === d.password_confirmation;
  return true;
}, { message: "Passwords do not match", path: ["password_confirmation"] });

type FormValues = z.infer<typeof schema>;

function lineTotal(item: CartItem): number {
  return (item.price + item.customization_fee) * item.quantity;
}

function fmtRs(n: number): string {
  return "Rs. " + n.toLocaleString("en-LK", { minimumFractionDigits: 2 });
}

// ─── District Combobox ────────────────────────────────────────────────────────
function DistrictCombobox({
  value,
  onChange,
  error,
}: {
  value: string;
  onChange: (v: string) => void;
  error?: string;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState(value);
  const ref = useRef<HTMLDivElement>(null);

  const filtered = useMemo(() =>
    query.trim() === ""
      ? SL_DISTRICTS
      : SL_DISTRICTS.filter((d) =>
          d.toLowerCase().includes(query.toLowerCase())
        ),
    [query]
  );

  useEffect(() => {
    function onOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onOutside);
    return () => document.removeEventListener("mousedown", onOutside);
  }, []);

  useEffect(() => { setQuery(value); }, [value]);

  return (
    <div ref={ref} className="relative">
      <div className="relative">
        <i className="bi bi-geo-alt absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        <input
          type="text"
          value={query}
          placeholder="Search district…"
          autoComplete="off"
          onChange={(e) => { setQuery(e.target.value); setOpen(true); onChange(""); }}
          onFocus={() => setOpen(true)}
          className={`w-full rounded-xl border px-4 py-3 pl-9 text-gray-900 outline-none transition focus:ring-2 ${
            error
              ? "border-red-400 focus:border-red-400 focus:ring-red-200"
              : "border-gray-200 focus:border-brand-red focus:ring-brand-red/20"
          }`}
        />
        {value && (
          <button
            type="button"
            onClick={() => { onChange(""); setQuery(""); setOpen(false); }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <i className="bi bi-x-lg text-sm" />
          </button>
        )}
      </div>

      {open && filtered.length > 0 && (
        <ul className="absolute z-50 mt-1 max-h-56 w-full overflow-y-auto rounded-xl border border-gray-200 bg-white py-1 shadow-xl">
          {filtered.map((d) => (
            <li key={d}>
              <button
                type="button"
                className={`w-full px-4 py-2.5 text-left text-sm transition hover:bg-brand-red/5 hover:text-brand-red ${
                  d === value ? "bg-brand-red/10 font-semibold text-brand-red" : "text-gray-800"
                }`}
                onMouseDown={() => {
                  onChange(d);
                  setQuery(d);
                  setOpen(false);
                }}
              >
                {d}
              </button>
            </li>
          ))}
        </ul>
      )}

      {open && filtered.length === 0 && (
        <div className="absolute z-50 mt-1 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-400 shadow-xl">
          No district found for &ldquo;{query}&rdquo;
        </div>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function CheckoutClient() {
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const clearCart = useCartStore((s) => s.clearCart);
  const { showToast } = useToast();

  const [success, setSuccess] = useState<{ order_number: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Shipping state
  const [district, setDistrict] = useState("");
  const [shippingMethods, setShippingMethods] = useState<ShippingMethod[]>([]);
  const [selectedMethodId, setSelectedMethodId] = useState<number | null>(null);
  const [loadingShipping, setLoadingShipping] = useState(false);

  // Payment state
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethodOption[]>([]);
  const [selectedPaymentCode, setSelectedPaymentCode] = useState<string>("");
  const [loadingPaymentMethods, setLoadingPaymentMethods] = useState(false);
  const [payhereRedirecting, setPayhereRedirecting] = useState(false);
  const payhereFormRef = useRef<HTMLFormElement>(null);

  const subtotal = useMemo(
    () => items.reduce((sum, i) => sum + lineTotal(i), 0),
    [items]
  );

  const selectedMethod = useMemo(
    () => shippingMethods.find((m) => m.id === selectedMethodId) ?? null,
    [shippingMethods, selectedMethodId]
  );

  const shippingCost = selectedMethod?.price ?? 0;
  const grandTotal = subtotal + shippingCost;

  // Fetch shipping methods when district or subtotal changes
  const fetchShipping = useCallback(async (d: string) => {
    if (!d) { setShippingMethods([]); setSelectedMethodId(null); return; }
    setLoadingShipping(true);
    try {
      const res = await fetch(`/api/shipping/rates?district=${encodeURIComponent(d)}&total=${subtotal}`);
      if (res.ok) {
        const data = await res.json();
        const methods: ShippingMethod[] = data.methods ?? [];
        setShippingMethods(methods);
        if (methods.length > 0) {
          // Auto-select first (cheapest) method
          setSelectedMethodId((prev) => {
            const existing = methods.find((m) => m.id === prev);
            return existing ? prev : methods[0].id;
          });
        } else {
          setSelectedMethodId(null);
        }
      }
    } catch {
      setShippingMethods([]);
    } finally {
      setLoadingShipping(false);
    }
  }, [subtotal]);

  useEffect(() => {
    if (district) fetchShipping(district);
    else { setShippingMethods([]); setSelectedMethodId(null); }
  }, [district, fetchShipping]);

  // Fetch allowed payment methods for cart items
  useEffect(() => {
    if (items.length === 0) return;
    setLoadingPaymentMethods(true);
    const itemsPayload = items.map((i) => ({ product_id: i.product_id }));
    fetch("/api/payment-methods/for-cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: itemsPayload }),
    })
      .then((r) => r.json())
      .then((data) => {
        const methods: PaymentMethodOption[] = data.methods ?? [];
        setPaymentMethods(methods);
        if (methods.length > 0 && !selectedPaymentCode) {
          setSelectedPaymentCode(methods[0].code);
        }
      })
      .catch(() => setPaymentMethods([]))
      .finally(() => setLoadingPaymentMethods(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items]);

  useEffect(() => {
    if (!success && items.length === 0) router.replace("/cart");
  }, [items.length, success, router]);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      customer_name: "", customer_email: "", customer_phone: "",
      customer_address: "", customer_district: "",
      notes: "", register: false, password: "", password_confirmation: "",
    },
  });

  const isRegistering = watch("register");

  const onDistrictChange = (d: string) => {
    setDistrict(d);
    setValue("customer_district", d, { shouldValidate: true });
  };

  const onSubmit = async (values: FormValues) => {
    if (items.length === 0) return;
    if (!selectedPaymentCode) {
      showToast("Please select a payment method.", "error");
      return;
    }
    setSubmitting(true);
    try {
      const result = await submitOrder(
        {
          ...values,
          shipping_method_id: selectedMethodId ?? undefined,
          shipping_cost: shippingCost,
          payment_method: selectedPaymentCode,
        } as FormValues & { shipping_method_id?: number; shipping_cost?: number; payment_method?: string },
        items
      );

      if (result.token && result.user) {
        localStorage.setItem("token", result.token);
        useAuthStore.getState().login(result.user);
      }

      if (result.payment_method === "payhere") {
        // Redirect to PayHere gateway
        setPayhereRedirecting(true);
        clearCart();

        const phRes = await fetch("/api/payments/payhere/initiate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ order_number: result.order_number }),
        });

        if (!phRes.ok) throw new Error("Failed to initiate PayHere payment.");
        const phData: PayhereParams = await phRes.json();

        // Build and auto-submit PayHere form
        const form = document.createElement("form");
        form.method = "POST";
        form.action = phData.checkout_url;
        form.style.display = "none";
        Object.entries(phData.params).forEach(([k, v]) => {
          const input = document.createElement("input");
          input.type = "hidden";
          input.name = k;
          input.value = v;
          form.appendChild(input);
        });
        document.body.appendChild(form);
        form.submit();
        return; // don't setSuccess, user will come back to /checkout/payment/return
      }

      // COD / other offline methods
      clearCart();
      setSuccess({ order_number: result.order_number });
      showToast(`Order ${result.order_number} placed! We'll confirm delivery.`, "success");
    } catch (e) {
      showToast(e instanceof Error ? e.message : "Could not place order", "error");
      setPayhereRedirecting(false);
    } finally {
      setSubmitting(false);
    }
  };

  // ─── Success Screen ──────────────────────────────────────────────────────────
  if (success) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white pb-20 pt-12">
        <div className="mx-auto max-w-lg px-4 text-center sm:px-6">
          <div className="overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-xl shadow-emerald-900/5">
            <div className="bg-gradient-to-br from-emerald-500 to-teal-600 px-8 py-12 text-white">
              <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-white/20 backdrop-blur">
                <i className="bi bi-check-lg text-4xl" aria-hidden />
              </div>
              <h1 className="text-2xl font-bold tracking-tight">Thank you!</h1>
              <p className="mt-2 text-sm text-emerald-50">
                Your order has been received. We&apos;ll contact you to confirm payment &amp; delivery.
              </p>
            </div>
            <div className="px-8 py-8">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Order reference</p>
              <p className="mt-1 font-mono text-2xl font-bold text-gray-900">{success.order_number}</p>
              <p className="mt-4 text-sm text-gray-600">Save this number for your records.</p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
                <Link href="/products" className="inline-flex items-center justify-center rounded-xl bg-brand-red px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-brand-red/30 transition hover:bg-red-700">
                  Continue shopping
                </Link>
                <Link href="/dashboard" className="inline-flex items-center justify-center rounded-xl border-2 border-gray-200 bg-white px-6 py-3.5 text-sm font-semibold text-gray-800 transition hover:border-gray-300 hover:bg-gray-50">
                  Go to Dashboard
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center bg-gray-50">
        <p className="text-gray-500">Redirecting to cart…</p>
      </div>
    );
  }

  // ─── Main Checkout Layout ────────────────────────────────────────────────────
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50 pb-20 pt-8">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-8 text-sm text-gray-500">
          <Link href="/" className="hover:text-brand-red">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/cart" className="hover:text-brand-red">Cart</Link>
          <span className="mx-2">/</span>
          <span className="font-medium text-gray-800">Checkout</span>
        </nav>

        <div className="mb-10 text-center lg:text-left">
          <h1 className="text-3xl font-black tracking-tight text-gray-900 sm:text-4xl">Checkout</h1>
          <p className="mt-2 text-gray-600">Enter your details — we&apos;ll confirm your order by phone or email.</p>
        </div>

        <div className="grid gap-10 lg:grid-cols-5 lg:gap-12">
          {/* ─── Form ───────────────────────────────────────────────────── */}
          <div className="lg:col-span-3">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-8 rounded-3xl border border-gray-200/80 bg-white p-6 shadow-lg shadow-gray-900/[0.03] sm:p-8"
            >
              {/* Section 1 — Contact */}
              <div>
                <h2 className="flex items-center gap-2 text-lg font-bold text-gray-900">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-red/10 text-sm font-black text-brand-red">1</span>
                  Contact &amp; Delivery
                </h2>
                <p className="mt-1 text-sm text-gray-500">Island-wide delivery across Sri Lanka.</p>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                {/* Full Name */}
                <div className="sm:col-span-2">
                  <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                    Full name <span className="text-brand-red">*</span>
                  </label>
                  <input
                    {...register("customer_name")}
                    autoComplete="name"
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-900 outline-none transition focus:border-brand-red focus:ring-2 focus:ring-brand-red/20"
                    placeholder="e.g. Nimal Perera"
                  />
                  {errors.customer_name && <p className="mt-1 text-xs font-medium text-red-600">{errors.customer_name.message}</p>}
                </div>

                {/* Email */}
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                    Email <span className="text-brand-red">*</span>
                  </label>
                  <input
                    {...register("customer_email")}
                    type="email"
                    autoComplete="email"
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-900 outline-none transition focus:border-brand-red focus:ring-2 focus:ring-brand-red/20"
                    placeholder="you@example.com"
                  />
                  {errors.customer_email && <p className="mt-1 text-xs font-medium text-red-600">{errors.customer_email.message}</p>}
                </div>

                {/* Phone */}
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                    Phone <span className="text-brand-red">*</span>
                  </label>
                  <input
                    {...register("customer_phone")}
                    autoComplete="tel"
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-900 outline-none transition focus:border-brand-red focus:ring-2 focus:ring-brand-red/20"
                    placeholder="07X XXX XXXX"
                  />
                  {errors.customer_phone && <p className="mt-1 text-xs font-medium text-red-600">{errors.customer_phone.message}</p>}
                </div>

                {/* District Dropdown */}
                <div className="sm:col-span-2">
                  <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                    District <span className="text-brand-red">*</span>
                  </label>
                  <input type="hidden" {...register("customer_district")} />
                  <DistrictCombobox
                    value={district}
                    onChange={onDistrictChange}
                    error={errors.customer_district?.message}
                  />
                  {errors.customer_district && (
                    <p className="mt-1 text-xs font-medium text-red-600">{errors.customer_district.message}</p>
                  )}
                </div>

                {/* Delivery Address */}
                <div className="sm:col-span-2">
                  <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                    Delivery address <span className="text-brand-red">*</span>
                  </label>
                  <textarea
                    {...register("customer_address")}
                    rows={3}
                    autoComplete="street-address"
                    className="w-full resize-y rounded-xl border border-gray-200 px-4 py-3 text-gray-900 outline-none transition focus:border-brand-red focus:ring-2 focus:ring-brand-red/20"
                    placeholder="Street, city, postal code, landmarks…"
                  />
                  {errors.customer_address && <p className="mt-1 text-xs font-medium text-red-600">{errors.customer_address.message}</p>}
                </div>

                {/* Register Toggle */}
                <div className="sm:col-span-2 rounded-xl border border-gray-200 bg-gray-50 p-4">
                  <div className="flex items-center gap-3">
                    <input
                      id="register-checkbox"
                      type="checkbox"
                      {...register("register")}
                      className="h-5 w-5 rounded border-gray-300 text-brand-red focus:ring-brand-red"
                    />
                    <label htmlFor="register-checkbox" className="cursor-pointer text-sm font-semibold text-gray-800">
                      Register an account to track your order
                    </label>
                  </div>
                  {isRegistering && (
                    <div className="mt-4 grid gap-5 sm:grid-cols-2">
                      <div>
                        <label className="mb-1.5 block text-sm font-semibold text-gray-700">Password <span className="text-brand-red">*</span></label>
                        <input type="password" {...register("password")}
                          className="w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-900 outline-none transition focus:border-brand-red focus:ring-2 focus:ring-brand-red/20"
                          placeholder="Min. 8 characters" />
                        {errors.password && <p className="mt-1 text-xs font-medium text-red-600">{errors.password.message}</p>}
                      </div>
                      <div>
                        <label className="mb-1.5 block text-sm font-semibold text-gray-700">Confirm Password <span className="text-brand-red">*</span></label>
                        <input type="password" {...register("password_confirmation")}
                          className="w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-900 outline-none transition focus:border-brand-red focus:ring-2 focus:ring-brand-red/20"
                          placeholder="Re-enter password" />
                        {errors.password_confirmation && <p className="mt-1 text-xs font-medium text-red-600">{errors.password_confirmation.message}</p>}
                      </div>
                    </div>
                  )}
                </div>

                {/* Order Notes */}
                <div className="sm:col-span-2">
                  <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                    Order notes <span className="text-gray-400">(optional)</span>
                  </label>
                  <textarea
                    {...register("notes")}
                    rows={3}
                    className="w-full resize-y rounded-xl border border-gray-200 px-4 py-3 text-gray-900 outline-none transition focus:border-brand-red focus:ring-2 focus:ring-brand-red/20"
                    placeholder="Special instructions, preferred delivery time…"
                  />
                </div>
              </div>

              {/* Section 2 — Shipping Method */}
              <div className="border-t border-gray-100 pt-6">
                <h2 className="flex items-center gap-2 text-lg font-bold text-gray-900 mb-4">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-red/10 text-sm font-black text-brand-red">2</span>
                  Shipping Method
                </h2>

                {!district && (
                  <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 px-5 py-6 text-center text-sm text-gray-400">
                    <i className="bi bi-truck text-2xl block mb-2 text-gray-300" />
                    Select your district above to see available shipping options.
                  </div>
                )}

                {district && loadingShipping && (
                  <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 px-5 py-4 text-sm text-gray-500">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-brand-red border-t-transparent" />
                    Loading shipping options for {district}…
                  </div>
                )}

                {district && !loadingShipping && shippingMethods.length === 0 && (
                  <div className="rounded-xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-700">
                    <i className="bi bi-exclamation-triangle me-2" />
                    No shipping methods available for {district}. Contact us for a custom rate.
                  </div>
                )}

                {!loadingShipping && shippingMethods.length > 0 && (
                  <div className="space-y-3">
                    {shippingMethods.map((m) => (
                      <label
                        key={m.id}
                        className={`flex cursor-pointer items-start gap-4 rounded-xl border p-4 transition ${
                          selectedMethodId === m.id
                            ? "border-brand-red bg-red-50 ring-2 ring-brand-red/20"
                            : "border-gray-200 bg-white hover:border-gray-300"
                        }`}
                      >
                        <input
                          type="radio"
                          name="shipping_method_radio"
                          value={m.id}
                          checked={selectedMethodId === m.id}
                          onChange={() => setSelectedMethodId(m.id)}
                          className="mt-0.5 h-4 w-4 text-brand-red focus:ring-brand-red"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2 flex-wrap">
                            <p className="font-bold text-gray-900">{m.name}</p>
                            <p className={`font-extrabold text-base ${m.is_free ? "text-emerald-600" : "text-brand-red"}`}>
                              {m.is_free ? "FREE" : `Rs. ${m.price.toLocaleString("en-LK", { minimumFractionDigits: 2 })}`}
                            </p>
                          </div>
                          {m.estimated_days && (
                            <p className="mt-0.5 text-xs text-gray-500">
                              <i className="bi bi-clock me-1" />{m.estimated_days}
                            </p>
                          )}
                          {m.description && (
                            <p className="mt-0.5 text-xs text-gray-400">{m.description}</p>
                          )}
                        </div>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Section 3 — Payment Method */}
              <div className="border-t border-gray-100 pt-6">
                <h2 className="flex items-center gap-2 text-lg font-bold text-gray-900 mb-4">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-red/10 text-sm font-black text-brand-red">3</span>
                  Payment Method
                </h2>

                {loadingPaymentMethods && (
                  <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 px-5 py-4 text-sm text-gray-500">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-brand-red border-t-transparent" />
                    Loading payment options…
                  </div>
                )}

                {!loadingPaymentMethods && paymentMethods.length === 0 && (
                  <div className="rounded-xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-700">
                    <i className="bi bi-exclamation-triangle me-2" />
                    No payment methods available. Please contact us.
                  </div>
                )}

                {!loadingPaymentMethods && paymentMethods.length > 0 && (
                  <div className="space-y-3">
                    {paymentMethods.map((method) => (
                      <label
                        key={method.code}
                        className={`flex cursor-pointer items-start gap-4 rounded-xl border p-4 transition ${
                          selectedPaymentCode === method.code
                            ? "border-brand-red bg-red-50 ring-2 ring-brand-red/20"
                            : "border-gray-200 bg-white hover:border-gray-300"
                        }`}
                      >
                        <input
                          type="radio"
                          name="payment_method_radio"
                          value={method.code}
                          checked={selectedPaymentCode === method.code}
                          onChange={() => setSelectedPaymentCode(method.code)}
                          className="mt-0.5 h-4 w-4 text-brand-red focus:ring-brand-red"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-red/10 text-brand-red">
                              {method.code === "cod" ? (
                                <i className="bi bi-cash-coin" />
                              ) : method.code === "payhere" ? (
                                <i className="bi bi-credit-card-2-front" />
                              ) : (
                                <i className="bi bi-wallet2" />
                              )}
                            </div>
                            <p className="font-bold text-gray-900">{method.name}</p>
                            <span className={`ml-auto text-xs rounded-full px-2.5 py-0.5 font-semibold ${
                              method.type === "online" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-600"
                            }`}>
                              {method.type === "online" ? "Online" : "Offline"}
                            </span>
                          </div>
                          {method.description && (
                            <p className="mt-1 text-xs text-gray-500 ml-10">{method.description}</p>
                          )}
                          {method.code === "payhere" && selectedPaymentCode === "payhere" && (
                            <div className="mt-2 ml-10 flex flex-wrap gap-1.5">
                              {["VISA","MASTER","AMEX","FRIMI","eZ Cash","mCash"].map((c) => (
                                <span key={c} className="rounded border border-gray-200 bg-white px-2 py-0.5 text-[10px] font-semibold text-gray-600">{c}</span>
                              ))}
                            </div>
                          )}
                        </div>
                      </label>
                    ))}
                  </div>
                )}

                {payhereRedirecting && (
                  <div className="mt-4 flex items-center gap-3 rounded-xl border border-blue-200 bg-blue-50 px-5 py-4 text-sm text-blue-700">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
                    Redirecting to PayHere secure checkout…
                  </div>
                )}
              </div>

              {/* Submit */}
              <div className="flex flex-col gap-4 border-t border-gray-100 pt-6 sm:flex-row sm:items-center sm:justify-between">
                <Link href="/cart" className="text-center text-sm font-semibold text-gray-600 hover:text-brand-red sm:text-left">
                  ← Back to cart
                </Link>
                <button
                  type="submit"
                  disabled={submitting || (district !== "" && !loadingShipping && shippingMethods.length > 0 && selectedMethodId === null)}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-red to-red-600 px-8 py-4 text-base font-bold text-white shadow-lg shadow-brand-red/35 transition hover:from-red-600 hover:to-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting ? (
                    <>
                      <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      {payhereRedirecting ? "Redirecting…" : "Placing order…"}
                    </>
                  ) : selectedPaymentCode === "payhere" ? (
                    <>
                      <i className="bi bi-credit-card text-xl" aria-hidden />
                      Pay with PayHere
                    </>
                  ) : (
                    <>
                      <i className="bi bi-bag-check text-xl" aria-hidden />
                      Place order
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* ─── Order Summary ───────────────────────────────────────────── */}
          <div className="lg:col-span-2">
            <div className="sticky top-24 space-y-4">
              <div className="rounded-3xl border border-gray-200/80 bg-white p-6 shadow-lg shadow-gray-900/[0.03]">
                <h2 className="text-lg font-bold text-gray-900">Order summary</h2>

                <ul className="mt-4 max-h-72 space-y-4 overflow-y-auto pr-1">
                  {items.map((item) => (
                    <li key={item.id} className="flex gap-3 border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-gray-100">
                        {item.image?.trim() ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={catalogImageSrc(item.image)} alt="" className="h-full w-full object-contain p-1" loading="lazy" />
                        ) : (
                          <div className="flex h-full items-center justify-center text-gray-400">
                            <i className="bi bi-image" />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="line-clamp-2 text-sm font-semibold text-gray-900">{item.name}</p>
                        <p className="mt-0.5 text-xs text-gray-500">Qty {item.quantity}</p>
                        {item.customization_fee > 0 && (
                          <p className="mt-0.5 text-xs text-gray-500">
                            {fmtRs(item.price)} + <span className="text-brand-red">{fmtRs(item.customization_fee)} custom</span>
                          </p>
                        )}
                        {item.customizations && Object.keys(item.customizations).length > 0 && (
                          <ul className="mt-1 space-y-0.5 text-xs text-gray-400">
                            {Object.entries(item.customizations).map(([k, v]) =>
                              typeof v === "string" ? (
                                <li key={k}><span className="font-medium text-gray-500">{k}:</span> {v}</li>
                              ) : null
                            )}
                          </ul>
                        )}
                        <p className="mt-1 text-sm font-bold text-gray-800">{fmtRs(lineTotal(item))}</p>
                      </div>
                    </li>
                  ))}
                </ul>

                {/* Totals */}
                <div className="mt-5 space-y-2 border-t border-gray-200 pt-4">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Subtotal</span>
                    <span className="font-bold text-gray-900">{fmtRs(subtotal)}</span>
                  </div>

                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Shipping</span>
                    {!district ? (
                      <span className="text-gray-400 italic text-xs">Select district</span>
                    ) : loadingShipping ? (
                      <span className="text-gray-400 text-xs animate-pulse">Calculating…</span>
                    ) : selectedMethod ? (
                      <span className={`font-bold ${selectedMethod.is_free ? "text-emerald-600" : "text-gray-900"}`}>
                        {selectedMethod.is_free ? "FREE" : fmtRs(shippingCost)}
                      </span>
                    ) : (
                      <span className="text-amber-600 text-xs">Not available</span>
                    )}
                  </div>

                  {selectedMethod && (
                    <div className="flex justify-between text-base font-bold border-t border-gray-200 pt-2">
                      <span className="text-gray-900">Total</span>
                      <span className="text-brand-red">{fmtRs(grandTotal)}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Shipping info badge */}
              {selectedMethod && (
                <div className="rounded-2xl border border-blue-100 bg-blue-50/60 px-4 py-3 text-sm text-blue-900">
                  <p className="flex items-start gap-2">
                    <i className="bi bi-truck mt-0.5 shrink-0 text-blue-500" />
                    <span>
                      <span className="font-bold">{selectedMethod.name}</span> — {selectedMethod.estimated_days ?? "Estimated delivery"}
                      {district && <span className="text-blue-700"> to {district}</span>}
                    </span>
                  </p>
                </div>
              )}

              {/* Security badge */}
              <div className="rounded-2xl border border-emerald-100 bg-emerald-50/60 px-4 py-3 text-sm text-emerald-900">
                <p className="flex items-start gap-2">
                  <i className="bi bi-shield-check mt-0.5 shrink-0 text-emerald-600" />
                  <span>Your data is sent securely to Print Works.LK. We never share your details.</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
