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
  // Site-wide social defaults; pages with their own openGraph override these.
  openGraph: {
    type: "website",
    locale: "en_LK",
    siteName: "Print Works.LK",
    url: SITE_URL,
    title: "Print Works.LK – Premium Custom Printing in Sri Lanka",
    description:
      "Sri Lanka's leading custom printing service. UV printing, laser cutting, acrylic products, signage, PVC cards & more. Island-wide delivery.",
    images: [{ url: `${SITE_URL}/images/logo.png` }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Print Works.LK – Premium Custom Printing in Sri Lanka",
    description:
      "Sri Lanka's leading custom printing service. UV printing, laser cutting, acrylic products, signage, PVC cards & more. Island-wide delivery.",
  },
  verification: {
    google: "QSpW8qYreBWt87Y_LEL6hYu_RwhKpadAjR6EfBzilcs",
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
        {/* Google Tag Manager — placed as high in the <head> as possible.
            beforeInteractive so the bootstrap is rendered into the served HTML head. */}
        <Script id="google-tag-manager" strategy="beforeInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-NJS8VJ72');`}
        </Script>
        {/* Google Analytics — required for Google Merchant Center site verification.
            strategy must be "beforeInteractive" so the real <script> tags are rendered
            into the served <head> HTML. With "afterInteractive" Next.js only emits a
            preload link and injects the script client-side, which makes Search Console /
            Merchant Center GA verification fail ("tracking code in the wrong location"). */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-P3QDWWWHGZ"
          strategy="beforeInteractive"
        />
        <Script id="google-analytics" strategy="beforeInteractive">
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
        {/* Google Tag Manager (noscript) — immediately after the opening <body> tag */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-NJS8VJ72"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
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
