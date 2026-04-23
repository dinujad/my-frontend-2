"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import * as Dialog from "@radix-ui/react-dialog";
import type { ProductItem, ProductVariationItem } from "@/lib/products-data";
import { useCartStore } from "@/stores/cart-store";
import { useWishlistStore } from "@/stores/wishlist-store";
import { useQuoteCartStore } from "@/stores/quote-cart-store";
import { useToast } from "@/components/ui/ToastProvider";
import { clsx } from "clsx";
import { ProductCustomizationFields } from "./ProductCustomizationFields";
import { useProductGalleryStore } from "@/stores/product-gallery-store";

function fmtRs(n: number) {
  return `Rs. ${n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function stockBadge(product: ProductItem, variation: ProductVariationItem | null, hasVariations: boolean) {
  if (hasVariations && variation) {
    const q = variation.stock_quantity;
    if (q === null || q === undefined) {
      return { label: "In stock", tone: "success" as const };
    }
    if (q <= 0) {
      return { label: "Out of stock", tone: "danger" as const };
    }
    if (q <= 5) {
      return { label: `Only ${q} left`, tone: "warn" as const };
    }
    return { label: `${q} in stock`, tone: "success" as const };
  }
  if (product.manage_stock && product.stock_quantity != null) {
    if (product.stock_quantity <= 0) {
      if (product.allow_backorders) {
        return { label: "On backorder", tone: "warn" as const };
      }
      return { label: "Out of stock", tone: "danger" as const };
    }
    if (product.stock_quantity <= 5) {
      return { label: `Only ${product.stock_quantity} left`, tone: "warn" as const };
    }
    return { label: `${product.stock_quantity} in stock`, tone: "success" as const };
  }
  if (product.stock_status === "outofstock") {
    if (product.allow_backorders) {
      return { label: "On backorder", tone: "warn" as const };
    }
    return { label: "Out of stock", tone: "danger" as const };
  }
  if (product.stock_status === "onbackorder" || product.stock_status === "preorder") {
    return { label: "On backorder", tone: "warn" as const };
  }
  return { label: "In stock", tone: "success" as const };
}

function pillClass(tone: "success" | "warn" | "danger") {
  switch (tone) {
    case "success":
      return "bg-emerald-50 text-emerald-900 ring-1 ring-emerald-200/90 shadow-sm";
    case "warn":
      return "bg-amber-50 text-amber-950 ring-1 ring-amber-200/90 shadow-sm";
    case "danger":
      return "bg-red-50 text-red-900 ring-1 ring-red-200/90 shadow-sm";
  }
}

export default function ProductInteractive({ product }: { product: ProductItem }) {
  const router = useRouter();
  const { addItem } = useCartStore();
  const { showToast } = useToast();
  const { addItem: addToQuote, hasItem: inQuoteCart } = useQuoteCartStore();
  const wishlistId = String(product.id);
  const inWishlist = useWishlistStore((s) => s.has(wishlistId));
  const addWishlist = useWishlistStore((s) => s.add);
  const removeWishlist = useWishlistStore((s) => s.remove);
  const setVariationImage = useProductGalleryStore((s) => s.setVariationImage);
  const resetGallery = useProductGalleryStore((s) => s.reset);
  const hasVariations = Boolean(product.variations && product.variations.length > 0);
  const [selectedVariationId, setSelectedVariationId] = useState<number | null>(
    hasVariations ? product.variations![0].id : null
  );

  // Sync gallery with first variation image on mount, then on change
  useEffect(() => {
    if (!hasVariations) {
      resetGallery();
      return;
    }
    const firstVar = product.variations?.find((v) => v.id === selectedVariationId);
    if (firstVar?.image) {
      setVariationImage(firstVar.image);
    } else {
      resetGallery();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedVariationId]);

  // Reset store on unmount (navigating away)
  useEffect(() => {
    return () => resetGallery();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const [qty, setQty] = useState(1);
  const [customizationValues, setCustomizationValues] = useState<Record<number, string>>({});
  const [customizationFiles, setCustomizationFiles] = useState<Record<number, File>>({});
  const [filePreviews, setFilePreviews] = useState<Record<number, string>>({});
  const [custModalOpen, setCustModalOpen] = useState(false);
  const custSettings = product.customization_settings;
  const isCustomizationEnabled =
    custSettings?.enabled == 1 || custSettings?.enabled === "1" || custSettings?.enabled === true;
  const customizationFee = isCustomizationEnabled ? parseFloat(String(custSettings?.flat_fee ?? "0")) : 0;
  const useCustomizationPopup =
    isCustomizationEnabled &&
    (custSettings?.use_popup === true ||
      custSettings?.use_popup === 1 ||
      custSettings?.use_popup === "1");
  const sectionTitle =
    (typeof custSettings?.title === "string" && custSettings.title.trim()) || "Customize your product";
  const popupButtonLabel =
    (typeof custSettings?.popup_button_label === "string" && custSettings.popup_button_label.trim()) ||
    sectionTitle;

  const customizationSatisfied = useMemo(() => {
    if (!isCustomizationEnabled || !product.customization_fields?.length) return true;
    return product.customization_fields.every((f) => {
      if (!f.is_required) return true;
      if (f.type === "file") return Boolean(customizationFiles[f.id]);
      return Boolean(String(customizationValues[f.id] ?? "").trim());
    });
  }, [isCustomizationEnabled, product.customization_fields, customizationValues, customizationFiles]);

  // Customization fee applies only when the user has actually filled at least one field or attached a file.
  const customizationFilled = useMemo(() => {
    if (!isCustomizationEnabled) return false;
    const hasText = Object.values(customizationValues).some((v) => String(v ?? "").trim() !== "");
    const hasFile = Object.keys(customizationFiles).length > 0;
    return hasText || hasFile;
  }, [isCustomizationEnabled, customizationValues, customizationFiles]);

  // If admin marks "Customization is required", block add-to-cart/buy-now until something is filled.
  const isCustomizationGlobalRequired =
    String(custSettings?.is_required) === "1" || custSettings?.is_required === true || custSettings?.is_required === 1;

  const selectedVariation = useMemo(() => {
    if (!hasVariations) return null;
    return product.variations?.find((v) => v.id === selectedVariationId) || null;
  }, [hasVariations, product.variations, selectedVariationId]);

  const activeTiers =
    selectedVariation?.priceTiers && selectedVariation.priceTiers.length > 0
      ? selectedVariation.priceTiers
      : product.priceTiers || [];

  const basePrice = selectedVariation?.sale_price || selectedVariation?.price || product.numericPrice;

  const currentPricePerUnit = useMemo(() => {
    if (!activeTiers || activeTiers.length === 0) return basePrice;
    const sortedTiers = [...activeTiers].sort((a, b) => b.min_qty - a.min_qty);
    const applicableTier = sortedTiers.find((t) => qty >= t.min_qty);
    return applicableTier ? applicableTier.unit_price : basePrice;
  }, [activeTiers, qty, basePrice]);

  const total = currentPricePerUnit * qty + (customizationFilled ? customizationFee * qty : 0);

  const sortedTiers = useMemo(
    () => [...activeTiers].sort((a, b) => a.min_qty - b.min_qty),
    [activeTiers]
  );

  const variationOOS =
    hasVariations &&
    selectedVariation != null &&
    selectedVariation.stock_quantity != null &&
    selectedVariation.stock_quantity <= 0;
  const baseOOS =
    !hasVariations &&
    product.manage_stock === true &&
    product.stock_quantity != null &&
    product.stock_quantity <= 0 &&
    !product.allow_backorders;
  const statusOOS = product.stock_status === "outofstock" && !product.allow_backorders;
  const cannotBuy = Boolean(variationOOS || baseOOS || statusOOS);

  const stock = stockBadge(product, selectedVariation, hasVariations);

  const handleAddToCart = (): boolean => {
    if (cannotBuy) {
      showToast("This product is currently unavailable.", "error");
      return false;
    }
    if (isCustomizationEnabled && isCustomizationGlobalRequired && !customizationFilled) {
      if (useCustomizationPopup) setCustModalOpen(true);
      showToast(
        "Please fill in the required fields in the customization popup.",
        "error"
      );
      return false;
    }

    if (isCustomizationEnabled && product.customization_fields) {
      for (const field of product.customization_fields) {
        if (field.is_required) {
          if (field.type === "file" && !customizationFiles[field.id]) {
            if (useCustomizationPopup) setCustModalOpen(true);
            showToast(
              useCustomizationPopup
                ? "Please complete the required details in the customization popup."
                : `Please upload a file for: ${field.label}`,
              "error"
            );
            return false;
          }
          if (field.type !== "file" && !String(customizationValues[field.id] ?? "").trim()) {
            if (useCustomizationPopup) setCustModalOpen(true);
            showToast(
              useCustomizationPopup
                ? "Please fill in the required fields in the customization popup."
                : `Please provide a value for: ${field.label}`,
              "error"
            );
            return false;
          }
        }
      }
    }

    const formattedCustomizations: Record<string, string> = {};
    const formattedFiles = [];

    if (isCustomizationEnabled && product.customization_fields) {
      for (const field of product.customization_fields) {
        if (field.type !== "file" && customizationValues[field.id]) {
          formattedCustomizations[field.label] = customizationValues[field.id];
        }
        if (field.type === "file" && customizationFiles[field.id]) {
          formattedFiles.push({
            fieldId: field.id,
            label: field.label,
            file: customizationFiles[field.id],
            previewUrl: filePreviews[field.id],
          });
        }
      }
    }

    const isCustomized = Object.keys(formattedCustomizations).length > 0 || formattedFiles.length > 0;

    const cartId = isCustomized
      ? `${product.id}_${selectedVariationId || "base"}_${Date.now()}`
      : `${product.id}_${selectedVariationId || "base"}`;

    addItem({
      id: cartId,
      product_id: product.id,
      variation_id: selectedVariationId,
      name: selectedVariation
        ? `${product.title} - ${Object.values(selectedVariation.attributes || {}).join(" ")}`
        : product.title,
      price: currentPricePerUnit,
      customization_fee: customizationFilled ? customizationFee : 0,
      quantity: qty,
      image: selectedVariation?.image || product.image,
      customizations: formattedCustomizations,
      customization_files: formattedFiles,
    });

    showToast("Added to cart successfully!", "success");
    return true;
  };

  const handleWishlistToggle = () => {
    if (inWishlist) {
      removeWishlist(wishlistId);
      showToast("Removed from wishlist", "success");
      return;
    }
    const optLabel = selectedVariation
      ? Object.values(selectedVariation.attributes || {}).filter(Boolean).join(" · ")
      : "";
    addWishlist({
      id: wishlistId,
      name: optLabel ? `${product.title} (${optLabel})` : product.title,
      price: currentPricePerUnit,
      slug: product.slug,
      image: selectedVariation?.image || product.image,
    });
    showToast("Saved to wishlist", "success");
  };

  const ctaClass =
    "inline-flex h-12 min-h-[48px] w-full items-center justify-center gap-2 rounded-xl px-5 text-sm font-bold transition-all duration-200 sm:h-[52px] sm:min-h-[52px]";

  return (
    <>
      <div className="mt-5 space-y-5 border-t border-gray-100 pt-5 sm:mt-8 sm:space-y-6 sm:pt-8">
        {/* 1. Price */}
        <section aria-label="Price">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Price</p>
          <div className="mt-1.5 flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <span className="text-3xl font-extrabold tracking-tight text-gray-900 tabular-nums sm:text-4xl sm:leading-none">
              {fmtRs(currentPricePerUnit)}
            </span>
            {product.oldPrice ? (
              <span className="text-base font-medium text-gray-400 line-through sm:text-lg">{product.oldPrice}</span>
            ) : null}
          </div>
          {activeTiers.length > 0 ? (
            <p className="mt-2 text-sm text-gray-500">Unit price updates with quantity tiers below.</p>
          ) : null}
        </section>

        {/* 2. Availability */}
        <section aria-label="Availability">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Availability</p>
          <div className="mt-2">
            <span
              className={clsx(
                "inline-flex items-center rounded-full px-4 py-2 text-sm font-semibold",
                pillClass(stock.tone)
              )}
            >
              {stock.label}
            </span>
          </div>
        </section>

        {/* Variations */}
        {hasVariations && (
          <section className="space-y-3" aria-label="Product options">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Option</p>
            <div className="flex flex-wrap gap-2">
              {product.variations!.map((v) => (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => setSelectedVariationId(v.id)}
                  className={clsx(
                    "rounded-xl border px-4 py-2.5 text-sm font-semibold transition-all duration-200",
                    selectedVariationId === v.id
                      ? "border-brand-red bg-brand-red/5 text-brand-red shadow-sm ring-1 ring-brand-red/20"
                      : "border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50"
                  )}
                >
                  {Object.values(v.attributes || {}).join(" - ") || v.sku || `Option ${v.id}`}
                </button>
              ))}
            </div>
          </section>
        )}

        {/* 3. Wholesale card */}
        {activeTiers.length > 0 && product.page_settings?.hide_tier_pricing != 1 && (
          <section aria-label="Wholesale pricing">
            <div className="overflow-hidden rounded-2xl border border-gray-200/90 bg-white shadow-[0_8px_30px_-12px_rgba(15,23,42,0.15)]">
              <div className="flex items-center gap-2 border-b border-gray-100 bg-gradient-to-r from-slate-50 via-white to-slate-50/80 px-5 py-3.5">
                <i className="bi bi-tags-fill text-brand-red" aria-hidden />
                <h3 className="text-sm font-bold text-gray-900">Volume pricing</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[280px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50/60 text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                      <th className="px-5 py-3">Quantity</th>
                      <th className="px-5 py-3 text-right">Price / item</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {sortedTiers[0].min_qty > 1 && (
                      <tr>
                        <td className="px-5 py-3 text-gray-600">1 – {sortedTiers[0].min_qty - 1}</td>
                        <td className="px-5 py-3 text-right font-semibold tabular-nums text-gray-900">
                          {fmtRs(basePrice)}
                        </td>
                      </tr>
                    )}
                    {sortedTiers.map((tier, idx) => {
                      const isLast = idx === sortedTiers.length - 1;
                      const nextTier = !isLast ? sortedTiers[idx + 1] : null;
                      const maxDisplay = tier.max_qty
                        ? tier.max_qty
                        : nextTier
                          ? nextTier.min_qty - 1
                          : "+";
                      const isCurrentTier =
                        qty >= tier.min_qty &&
                        (!tier.max_qty || qty <= tier.max_qty) &&
                        (!nextTier || qty < nextTier.min_qty);

                      return (
                        <tr
                          key={idx}
                          className={clsx(
                            "transition-colors",
                            isCurrentTier && "bg-brand-red/[0.06]"
                          )}
                        >
                          <td
                            className={clsx(
                              "px-5 py-3 font-medium tabular-nums",
                              isCurrentTier
                                ? "border-l-[3px] border-l-brand-red pl-[17px] text-brand-red"
                                : "border-l-[3px] border-l-transparent pl-[17px] text-gray-800"
                            )}
                          >
                            {tier.min_qty}
                            {String(maxDisplay) !== String(tier.min_qty)
                              ? ` – ${maxDisplay}`
                              : maxDisplay === "+"
                                ? "+"
                                : ""}
                          </td>
                          <td
                            className={clsx(
                              "px-5 py-3 text-right text-base font-bold tabular-nums",
                              isCurrentTier ? "text-brand-red" : "text-gray-900"
                            )}
                          >
                            {fmtRs(tier.unit_price)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}

        {/* Customization — inline or popup (admin: customization_settings.use_popup) */}
        {isCustomizationEnabled && product.customization_fields && product.customization_fields.length > 0 && (
          <>
            {useCustomizationPopup ? (
              <section className="rounded-2xl border border-gray-200/90 bg-white p-5 shadow-[0_4px_20px_-8px_rgba(15,23,42,0.1)]">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex min-w-0 flex-1 items-start gap-3">
                    <span
                      className={clsx(
                        "mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 text-sm font-bold transition-colors",
                        customizationSatisfied
                          ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                          : "border-gray-200 bg-gray-50 text-gray-400"
                      )}
                      aria-hidden
                    >
                      {customizationSatisfied ? "✓" : ""}
                    </span>
                    <div className="min-w-0">
                      <h3 className="text-sm font-bold text-gray-900">{sectionTitle}</h3>
                      {customizationFee > 0 ? (
                        <p className="mt-1 text-sm font-semibold text-brand-red">
                          + {fmtRs(customizationFee)} per item · total is added at checkout
                        </p>
                      ) : (
                        <p className="mt-1 text-xs text-gray-500">Click the button to open the customization form.</p>
                      )}
                      {(String(custSettings?.is_required) === "1" || custSettings?.is_required === true) && (
                        <p className="mt-1 text-xs font-semibold text-brand-red">Required before checkout</p>
                      )}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setCustModalOpen(true)}
                    className="inline-flex h-12 w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-gray-900 px-5 text-sm font-bold text-white shadow-md transition hover:bg-black sm:w-auto sm:min-w-[200px]"
                  >
                    <i className="bi bi-sliders" aria-hidden />
                    {popupButtonLabel}
                  </button>
                </div>

                <Dialog.Root open={custModalOpen} onOpenChange={setCustModalOpen}>
                  <Dialog.Portal>
                    <Dialog.Overlay className="fixed inset-0 z-[300] bg-black/50 backdrop-blur-[2px]" />
                    <Dialog.Content
                      className="fixed left-1/2 top-1/2 z-[301] max-h-[min(90vh,720px)] w-[calc(100vw-1.5rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl outline-none"
                    >
                      <Dialog.Title className="text-lg font-bold text-gray-900">{sectionTitle}</Dialog.Title>
                      <Dialog.Description className="mt-1 text-sm text-gray-600">
                        {customizationFee > 0
                          ? `Flat fee ${fmtRs(customizationFee)} per quantity item — total price will be added at checkout.`
                          : "Add your details to continue."}
                      </Dialog.Description>
                      <div className="mt-6">
                        <ProductCustomizationFields
                          fields={product.customization_fields}
                          customizationValues={customizationValues}
                          setCustomizationValues={setCustomizationValues}
                          customizationFiles={customizationFiles}
                          setCustomizationFiles={setCustomizationFiles}
                          filePreviews={filePreviews}
                          setFilePreviews={setFilePreviews}
                        />
                      </div>
                      <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                        <Dialog.Close asChild>
                          <button
                            type="button"
                            className="h-11 rounded-xl border border-gray-200 px-5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                          >
                            Cancel
                          </button>
                        </Dialog.Close>
                        <Dialog.Close asChild>
                          <button
                            type="button"
                            className="h-11 rounded-xl bg-brand-red px-5 text-sm font-bold text-white shadow-md shadow-brand-red/25 transition hover:bg-brand-red-dark"
                          >
                            Save &amp; close
                          </button>
                        </Dialog.Close>
                      </div>
                    </Dialog.Content>
                  </Dialog.Portal>
                </Dialog.Root>
              </section>
            ) : (
              <section className="overflow-hidden rounded-2xl border border-gray-200/90 bg-white shadow-[0_4px_20px_-8px_rgba(15,23,42,0.1)]">
                <div className="border-b border-gray-100 bg-gray-50/80 px-5 py-3.5">
                  <h3 className="text-sm font-bold text-gray-900">
                    {sectionTitle}
                    {(String(custSettings?.is_required) === "1" || custSettings?.is_required === true) && (
                      <span className="ml-2 text-xs font-semibold text-brand-red">(Required)</span>
                    )}
                  </h3>
                  {customizationFee > 0 && (
                    <p className="mt-1 text-xs font-semibold text-brand-red">
                      + {fmtRs(customizationFee)} handling fee per item
                    </p>
                  )}
                </div>
                <div className="p-5">
                  <ProductCustomizationFields
                    fields={product.customization_fields}
                    customizationValues={customizationValues}
                    setCustomizationValues={setCustomizationValues}
                    customizationFiles={customizationFiles}
                    setCustomizationFiles={setCustomizationFiles}
                    filePreviews={filePreviews}
                    setFilePreviews={setFilePreviews}
                  />
                </div>
              </section>
            )}
          </>
        )}

        {/* 4. Quantity + Total (same row desktop) */}
        <section
          className="flex flex-row items-end justify-between gap-4 rounded-2xl border border-gray-100 bg-gray-50/50 p-4 sm:p-5"
          aria-label="Quantity and total"
        >
          <div className="shrink-0">
            <label
              htmlFor="pdp-qty"
              className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-500"
            >
              Quantity
            </label>
            <div
              id="pdp-qty"
              className="flex h-12 w-full max-w-[160px] items-stretch overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition focus-within:border-brand-red focus-within:ring-2 focus-within:ring-brand-red/15 sm:h-[52px] sm:max-w-[176px]"
            >
              <button
                type="button"
                onClick={() => setQty(Math.max(1, qty - 1))}
                className="flex w-11 shrink-0 items-center justify-center text-gray-500 transition hover:bg-gray-50 hover:text-gray-900 active:bg-gray-100"
                aria-label="Decrease quantity"
              >
                <span className="text-xl font-medium leading-none">−</span>
              </button>
              <input
                type="number"
                value={qty}
                onChange={(e) => setQty(Math.max(1, parseInt(e.target.value, 10) || 1))}
                className="min-w-0 flex-1 border-x border-gray-100 bg-transparent text-center text-lg font-bold tabular-nums text-gray-900 outline-none [-moz-appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
                min={1}
                aria-label="Quantity"
              />
              <button
                type="button"
                onClick={() => setQty(qty + 1)}
                className="flex w-11 shrink-0 items-center justify-center text-gray-500 transition hover:bg-gray-50 hover:text-gray-900 active:bg-gray-100"
                aria-label="Increase quantity"
              >
                <span className="text-xl font-medium leading-none">+</span>
              </button>
            </div>
          </div>

          <div className="flex flex-1 flex-col items-end text-right">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Total</span>
            <p className="mt-1 text-2xl font-extrabold tracking-tight text-gray-900 tabular-nums sm:text-3xl">
              {fmtRs(total)}
            </p>
            {customizationFilled && customizationFee > 0 ? (
              <p className="mt-1 text-xs text-gray-500">Includes +{fmtRs(customizationFee)} customization fee × {qty}</p>
            ) : isCustomizationEnabled && customizationFee > 0 ? (
              <p className="mt-1 text-xs text-gray-400">Fill customization form to add +{fmtRs(customizationFee)} fee</p>
            ) : null}
          </div>
        </section>

        {/* 5. Actions */}
        <section className="space-y-2.5 sm:space-y-3" aria-label="Purchase actions">
          <div className="flex flex-col gap-2.5 sm:flex-row sm:items-stretch sm:gap-3">
            <button
              type="button"
              onClick={handleWishlistToggle}
              aria-pressed={inWishlist}
              className={clsx(
                ctaClass,
                "border-2 border-gray-200 bg-white text-gray-800 shadow-sm hover:border-gray-300 hover:bg-gray-50 sm:w-auto sm:min-w-[132px] sm:flex-none"
              )}
            >
              <i className={`text-lg ${inWishlist ? "bi bi-heart-fill text-brand-red" : "bi bi-heart"}`} aria-hidden />
              <span>{inWishlist ? "Saved" : "Wishlist"}</span>
            </button>
            <button
              type="button"
              disabled={cannotBuy}
              onClick={() => handleAddToCart()}
              className={clsx(
                ctaClass,
                "flex-1 bg-brand-red text-white shadow-lg shadow-brand-red/25 hover:bg-brand-red-dark hover:shadow-brand-red/35 disabled:pointer-events-none disabled:opacity-45"
              )}
            >
              <i className="bi bi-cart-plus text-lg" aria-hidden />
              Add to cart
            </button>
            <button
              type="button"
              disabled={cannotBuy}
              onClick={() => {
                if (handleAddToCart()) router.push("/checkout");
              }}
              className={clsx(
                ctaClass,
                "flex-1 bg-gray-950 text-white shadow-lg shadow-gray-900/25 hover:bg-black hover:shadow-gray-900/35 disabled:pointer-events-none disabled:opacity-45"
              )}
            >
              Buy now
            </button>
          </div>

          {/* Request Quote CTA */}
          {(() => {
            const alreadyInQuote = inQuoteCart(product.id, selectedVariationId);
            return (
              <button
                type="button"
                onClick={() => {
                  if (alreadyInQuote) {
                    router.push("/quote");
                    return;
                  }
                  const variationLabel = selectedVariation
                    ? Object.values(selectedVariation.attributes || {}).join(" - ")
                    : undefined;
                  addToQuote({
                    product_id: product.id,
                    product_variation_id: selectedVariationId,
                    product_name: variationLabel
                      ? `${product.title} — ${variationLabel}`
                      : product.title,
                    product_sku: selectedVariation?.sku ?? (product as any).sku,
                    product_image: selectedVariation?.image ?? product.image ?? undefined,
                    product_slug: (product as any).slug,
                    variation_attributes: selectedVariation?.attributes ?? null,
                    quantity: qty,
                  });
                  showToast("Added to quote request!", "success");
                }}
                className={clsx(
                  ctaClass,
                  "w-full border-2 border-brand-red bg-red-50 text-brand-red font-bold hover:bg-brand-red hover:text-white transition-colors"
                )}
              >
                <i className="bi bi-file-earmark-text text-lg" aria-hidden />
                {alreadyInQuote ? "View Quote Request →" : "Request Quote"}
              </button>
            );
          })()}
        </section>
      </div>

      {/* Mobile sticky */}
      <div
        className="fixed inset-x-0 bottom-0 z-40 border-t border-gray-200/90 bg-white/95 p-4 shadow-[0_-12px_40px_rgba(15,23,42,0.12)] backdrop-blur-md md:hidden pb-[max(1rem,env(safe-area-inset-bottom))]"
        role="region"
        aria-label="Quick add to cart"
      >
        <div className="mx-auto flex max-w-lg items-stretch gap-3">
          <div className="min-w-0 flex-1 py-0.5">
            <p className="text-[10px] font-bold uppercase tracking-wide text-gray-500">Total</p>
            <p className="truncate text-xl font-extrabold tabular-nums text-gray-900">{fmtRs(total)}</p>
          </div>
          <button
            type="button"
            onClick={() => {
              const alreadyInQuote = inQuoteCart(product.id, selectedVariationId);
              if (alreadyInQuote) {
                router.push("/quote");
                return;
              }
              const variationLabel = selectedVariation
                ? Object.values(selectedVariation.attributes || {}).join(" - ")
                : undefined;
              addToQuote({
                product_id: product.id,
                product_variation_id: selectedVariationId,
                product_name: variationLabel
                  ? `${product.title} — ${variationLabel}`
                  : product.title,
                product_sku: selectedVariation?.sku ?? (product as any).sku,
                product_image: selectedVariation?.image ?? product.image ?? undefined,
                product_slug: (product as any).slug,
                variation_attributes: selectedVariation?.attributes ?? null,
                quantity: qty,
              });
              if (!alreadyInQuote) showToast("Added to quote request!", "success");
            }}
            className="flex h-12 min-h-[48px] items-center justify-center gap-2 rounded-xl border-2 border-brand-red bg-red-50 px-3 text-sm font-bold text-brand-red transition active:scale-[0.98]"
          >
            <i className="bi bi-file-earmark-text text-base" aria-hidden />
            {inQuoteCart(product.id, selectedVariationId) ? "View Quote" : "Quote"}
          </button>
          <button
            type="button"
            disabled={cannotBuy}
            onClick={() => handleAddToCart()}
            className="flex h-12 min-h-[48px] flex-[1.15] items-center justify-center gap-2 rounded-xl bg-brand-red px-4 text-sm font-bold text-white shadow-lg shadow-brand-red/30 transition active:scale-[0.98] disabled:opacity-50"
          >
            <i className="bi bi-cart-plus text-lg" aria-hidden />
            Add to cart
          </button>
        </div>
      </div>
    </>
  );
}
