"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { ToastProvider } from "@/components/ui/ToastProvider";

// Suppress browser-extension hydration noise (e.g. bis_skin_checked injected by
// password managers / spell-checkers). These are harmless false positives that
// cannot be fixed in application code — only the extension causes them.
if (typeof window !== "undefined") {
  const _origError = console.error.bind(console);
  console.error = (...args: unknown[]) => {
    const msg = typeof args[0] === "string" ? args[0] : "";
    if (
      msg.includes("bis_skin_checked") ||
      msg.includes("bis_size") ||
      (msg.includes("hydrat") && String(args[1] ?? "").includes("bis_"))
    ) {
      return;
    }
    _origError(...args);
  };
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>{children}</ToastProvider>
    </QueryClientProvider>
  );
}
