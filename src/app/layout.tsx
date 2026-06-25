import type { Metadata } from "next";
import { Suspense } from "react";
import Script from "next/script";
import "./globals.css";
import { Providers } from "@/components/providers/Providers";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { LiveChatWidget } from "@/components/ai/LiveChatWidget";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://printworks.lk";
const MAINTENANCE = process.env.NEXT_PUBLIC_MAINTENANCE_MODE === "true";

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
      <head>
        {/* Google Analytics — required for Google Merchant Center site verification */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-P3QDWWWHGZ"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-P3QDWWWHGZ');
          `}
        </Script>
      </head>
      {/*
        suppressHydrationWarning on body + inner shell: some browser extensions inject
        attributes (e.g. bis_skin_checked) into arbitrary divs and trigger false hydration
        warnings in dev. Test in a private window with extensions disabled to confirm.
      */}
      <body suppressHydrationWarning>
        <Providers>
          {MAINTENANCE ? (
            /* Maintenance mode — no Header / Footer / LiveChat */
            <>{children}</>
          ) : (
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
          )}
        </Providers>
      </body>
    </html>
  );
}
