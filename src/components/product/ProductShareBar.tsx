"use client";

import { useMemo, useState } from "react";
import { clsx } from "clsx";
import { SITE_URL } from "@/lib/products-data";
import { useToast } from "@/components/ui/ToastProvider";

type Props = {
  title: string;
  slug: string;
  className?: string;
};

type ShareLink = {
  id: string;
  label: string;
  icon: string;
  href: string;
  brandClass: string;
};

export function ProductShareBar({ title, slug, className }: Props) {
  const { showToast } = useToast();
  const [copied, setCopied] = useState(false);

  const shareUrl = useMemo(() => `${SITE_URL.replace(/\/$/, "")}/product/${slug}`, [slug]);
  const shareText = useMemo(() => `${title} — Print Works.LK`, [title]);

  const links: ShareLink[] = useMemo(
    () => [
      {
        id: "facebook",
        label: "Share on Facebook",
        icon: "bi-facebook",
        href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
        brandClass: "hover:border-[#1877F2]/30 hover:bg-[#1877F2]/10 hover:text-[#1877F2]",
      },
      {
        id: "whatsapp",
        label: "Share on WhatsApp",
        icon: "bi-whatsapp",
        href: `https://wa.me/?text=${encodeURIComponent(`${shareText}\n${shareUrl}`)}`,
        brandClass: "hover:border-[#25D366]/30 hover:bg-[#25D366]/10 hover:text-[#25D366]",
      },
      {
        id: "twitter",
        label: "Share on X",
        icon: "bi-twitter-x",
        href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`,
        brandClass: "hover:border-gray-900/20 hover:bg-gray-900/5 hover:text-gray-900",
      },
      {
        id: "linkedin",
        label: "Share on LinkedIn",
        icon: "bi-linkedin",
        href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
        brandClass: "hover:border-[#0A66C2]/30 hover:bg-[#0A66C2]/10 hover:text-[#0A66C2]",
      },
    ],
    [shareText, shareUrl]
  );

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      showToast("Product link copied!", "success");
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      showToast("Could not copy link. Please copy manually.", "error");
    }
  };

  return (
    <div className={clsx("border-t border-gray-100 pt-4", className)}>
      <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Share this product</p>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        {links.map((link) => (
          <a
            key={link.id}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={link.label}
            title={link.label}
            className={clsx(
              "inline-flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600 shadow-sm transition",
              link.brandClass
            )}
          >
            <i className={clsx("bi text-lg", link.icon)} aria-hidden />
          </a>
        ))}
        <button
          type="button"
          onClick={() => void handleCopy()}
          className={clsx(
            "inline-flex h-10 items-center gap-2 rounded-xl border px-3 text-sm font-semibold shadow-sm transition",
            copied
              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border-gray-200 bg-white text-gray-700 hover:border-brand-red/30 hover:bg-brand-red/5 hover:text-brand-red"
          )}
        >
          <i className={clsx("bi text-base", copied ? "bi-check-lg" : "bi-link-45deg")} aria-hidden />
          {copied ? "Copied!" : "Copy link"}
        </button>
      </div>
    </div>
  );
}
