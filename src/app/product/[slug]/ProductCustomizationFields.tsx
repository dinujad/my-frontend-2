"use client";

import type { Dispatch, SetStateAction } from "react";
import type { ProductCustomizationField } from "@/lib/products-data";

type Props = {
  fields: ProductCustomizationField[];
  customizationValues: Record<number, string>;
  setCustomizationValues: Dispatch<SetStateAction<Record<number, string>>>;
  customizationFiles: Record<number, File>;
  setCustomizationFiles: Dispatch<SetStateAction<Record<number, File>>>;
  filePreviews: Record<number, string>;
  setFilePreviews: Dispatch<SetStateAction<Record<number, string>>>;
};

export function ProductCustomizationFields({
  fields,
  customizationValues,
  setCustomizationValues,
  customizationFiles,
  setCustomizationFiles,
  filePreviews,
  setFilePreviews,
}: Props) {
  return (
    <div className="space-y-5">
      {fields.map((field) => (
        <div key={field.id} className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            {field.label} {field.is_required && <span className="text-brand-red">*</span>}
          </label>

          {field.type === "text" && (
            <input
              type="text"
              required={field.is_required}
              value={customizationValues[field.id] ?? ""}
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm shadow-sm transition focus:border-brand-red focus:outline-none focus:ring-2 focus:ring-brand-red/15"
              onChange={(e) =>
                setCustomizationValues((prev) => ({ ...prev, [field.id]: e.target.value }))
              }
            />
          )}

          {field.type === "textarea" && (
            <textarea
              required={field.is_required}
              rows={3}
              value={customizationValues[field.id] ?? ""}
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm shadow-sm transition focus:border-brand-red focus:outline-none focus:ring-2 focus:ring-brand-red/15"
              onChange={(e) =>
                setCustomizationValues((prev) => ({ ...prev, [field.id]: e.target.value }))
              }
            />
          )}

          {field.type === "select" && field.options && (
            <select
              required={field.is_required}
              value={customizationValues[field.id] ?? ""}
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm shadow-sm transition focus:border-brand-red focus:outline-none focus:ring-2 focus:ring-brand-red/15"
              onChange={(e) =>
                setCustomizationValues((prev) => ({ ...prev, [field.id]: e.target.value }))
              }
            >
              <option value="">Select an option…</option>
              {Array.isArray(field.options)
                ? field.options.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))
                : null}
            </select>
          )}

          {field.type === "number" && (
            <input
              type="number"
              required={field.is_required}
              value={customizationValues[field.id] ?? ""}
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm shadow-sm transition focus:border-brand-red focus:outline-none focus:ring-2 focus:ring-brand-red/15"
              onChange={(e) =>
                setCustomizationValues((prev) => ({ ...prev, [field.id]: e.target.value }))
              }
            />
          )}

          {field.type === "radio" && field.options && (
            <div className="mt-1 space-y-2">
              {Array.isArray(field.options)
                ? field.options.map((opt) => (
                    <label key={opt} className="flex cursor-pointer items-center gap-2 text-sm text-gray-700">
                      <input
                        type="radio"
                        required={field.is_required}
                        name={`field_${field.id}`}
                        value={opt}
                        checked={customizationValues[field.id] === opt}
                        className="border-gray-300 text-brand-red focus:ring-brand-red"
                        onChange={() =>
                          setCustomizationValues((prev) => ({ ...prev, [field.id]: opt }))
                        }
                      />
                      {opt}
                    </label>
                  ))
                : null}
            </div>
          )}

          {field.type === "file" && (
            <div>
              <input
                type="file"
                required={field.is_required}
                accept={field.accepted_extensions || "*"}
                className="block w-full cursor-pointer text-sm text-gray-500 file:mr-4 file:rounded-xl file:border-0 file:bg-brand-red/10 file:px-4 file:py-2.5 file:text-sm file:font-semibold file:text-brand-red transition file:hover:bg-brand-red/20"
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    const f = e.target.files[0];
                    setCustomizationFiles((prev) => ({ ...prev, [field.id]: f }));
                    setFilePreviews((prev) => ({ ...prev, [field.id]: URL.createObjectURL(f) }));
                  }
                }}
              />
              {field.accepted_extensions && (
                <p className="mt-1 text-xs text-gray-400">Accepted: {field.accepted_extensions}</p>
              )}
              {filePreviews[field.id] && (
                <div className="group relative mt-3 h-32 w-32 overflow-hidden rounded-xl border border-gray-200 shadow-sm">
                  <img src={filePreviews[field.id]} className="h-full w-full object-cover" alt="Preview" />
                  <button
                    type="button"
                    onClick={() => {
                      setCustomizationFiles((prev) => {
                        const n = { ...prev };
                        delete n[field.id];
                        return n;
                      });
                      setFilePreviews((prev) => {
                        const n = { ...prev };
                        delete n[field.id];
                        return n;
                      });
                    }}
                    className="absolute right-2 top-2 rounded-lg bg-white/90 p-1 text-red-500 opacity-0 transition group-hover:opacity-100"
                  >
                    <i className="bi bi-trash-fill text-xs" aria-hidden />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
