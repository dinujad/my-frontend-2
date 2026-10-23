"use client";

import { useEffect, useState } from "react";
import { catalogImageSrc } from "@/lib/media-url";

const SEEN_KEY = "pw-home-popup-seen";
const DEFAULT_IMAGE = "/images/popup.png";

type PopupSettings = {
  enabled?: boolean;
  image?: string | null;
  close_seconds?: number;
};

export function HomePopup() {
  const [open, setOpen] = useState(false);
  const [image, setImage] = useState("");
  const [seconds, setSeconds] = useState(3);

  useEffect(() => {
    if (window.sessionStorage.getItem(SEEN_KEY) === "1") return;

    let cancelled = false;

    fetch("/api/v1/home-popup", { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data: PopupSettings | null) => {
        if (cancelled || !data?.enabled) return;
        if (window.sessionStorage.getItem(SEEN_KEY) === "1") return;

        const src = catalogImageSrc(data.image) || DEFAULT_IMAGE;
        const closeSeconds = Number(data.close_seconds);
        window.sessionStorage.setItem(SEEN_KEY, "1");
        setImage(src);
        setSeconds(Number.isFinite(closeSeconds) ? closeSeconds : 3);
        setOpen(true);
      })
      .catch(() => {
        /* Leave the popup hidden when settings cannot be read. */
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!open || seconds <= 0) return;
    const id = window.setTimeout(() => setOpen(false), seconds * 1000);
    return () => window.clearTimeout(id);
  }, [open, seconds]);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (!open || !image) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/60 p-4" role="presentation">
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Promotion"
        className="relative max-h-[85vh] w-full max-w-[420px]"
      >
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="absolute -right-2 -top-2 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white text-gray-800 shadow-lg transition hover:bg-gray-100"
          aria-label="Close"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <img src={image} alt="" className="max-h-[85vh] w-full rounded-2xl object-contain shadow-2xl" />
      </div>
    </div>
  );
}
