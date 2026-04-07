"use client";

import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
} from "react";
import { AnimatePresence, motion } from "framer-motion";

type ToastVariant = "success" | "error";

type ToastItem = {
  id: number;
  message: string;
  variant: ToastVariant;
};

type ToastContextValue = {
  showToast: (message: string, variant?: ToastVariant) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return ctx;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const idRef = useRef(0);

  const showToast = useCallback((message: string, variant: ToastVariant = "success") => {
    const id = ++idRef.current;
    setItems((prev) => [...prev, { id, message, variant }]);
    window.setTimeout(() => {
      setItems((prev) => prev.filter((t) => t.id !== id));
    }, 4200);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div
        className="pointer-events-none fixed bottom-0 right-0 z-[200] flex w-full max-w-sm flex-col gap-3 p-4 sm:max-w-md sm:p-6"
        aria-live="polite"
        suppressHydrationWarning
      >
        <AnimatePresence mode="popLayout">
          {items.map((t) => (
            <motion.div
              key={t.id}
              layout
              initial={{ opacity: 0, y: 20, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: 40, scale: 0.96 }}
              transition={{ type: "spring", damping: 26, stiffness: 320 }}
              className="pointer-events-auto"
            >
              <div
                role="status"
                className={`flex items-start gap-3 rounded-2xl border px-4 py-3.5 shadow-xl backdrop-blur-md ${
                  t.variant === "success"
                    ? "border-emerald-200/90 bg-white/95 text-gray-800 shadow-emerald-900/[0.07]"
                    : "border-red-200/90 bg-white/95 text-gray-800 shadow-red-900/[0.07]"
                }`}
              >
                <span
                  className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white shadow-sm ${
                    t.variant === "success"
                      ? "bg-gradient-to-br from-emerald-400 to-emerald-600"
                      : "bg-gradient-to-br from-red-400 to-red-600"
                  }`}
                  aria-hidden
                >
                  {t.variant === "success" ? (
                    <i className="bi bi-check-lg text-lg leading-none" />
                  ) : (
                    <i className="bi bi-exclamation-lg text-lg leading-none" />
                  )}
                </span>
                <div className="min-w-0 flex-1 pt-0.5">
                  <p className="text-sm font-semibold leading-snug text-gray-900">
                    {t.variant === "success" ? "Success" : "Please check"}
                  </p>
                  <p className="mt-0.5 text-sm leading-relaxed text-gray-600">
                    {t.message}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setItems((prev) => prev.filter((x) => x.id !== t.id))
                  }
                  className="-m-1 shrink-0 rounded-lg p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
                  aria-label="Dismiss"
                >
                  <i className="bi bi-x-lg text-sm" />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}
