import type { Metadata } from "next";
import { Suspense } from "react";
import "./globals.css";
import { Providers } from "@/components/providers/Providers";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { LiveChatWidget } from "@/components/ai/LiveChatWidget";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://printworks.lk";

/** Avoid static prerender of the whole tree; prevents build failures (ReactCurrentBatchConfig) with client layout + RSC pages. */
export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Print Works.LK – Premium Custom Printing in Sri Lanka",
    template: "%s | Print Works.LK",
  },
  description:
    "Sri Lanka's leading custom printing service. UV printing, laser cutting, acrylic products, signage, PVC cards & more. Island-wide delivery.",
  alternates: {
    canonical: SITE_URL,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      {/*
        suppressHydrationWarning on body + inner shell: some browser extensions inject
        attributes (e.g. bis_skin_checked) into arbitrary divs and trigger false hydration
        warnings in dev. Test in a private window with extensions disabled to confirm.
      */}
      <body suppressHydrationWarning>
        <Providers>
          <div suppressHydrationWarning className="flex min-h-screen flex-col">
            <Suspense fallback={<div className="h-16 w-full shrink-0 border-b border-gray-100 bg-white" aria-hidden />}>
              <Header />
            </Suspense>
            <div suppressHydrationWarning className="flex min-h-0 flex-1 flex-col">
              <main suppressHydrationWarning className="flex-1">{children}</main>
              <Suspense fallback={null}>
                <Footer />
              </Suspense>
            </div>
            <Suspense fallback={null}>
              <LiveChatWidget />
            </Suspense>
          </div>
        </Providers>
      </body>
    </html>
  );
}
