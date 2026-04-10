"use client";

import React, { type ReactNode } from "react";
import dynamic from "next/dynamic";

/** Prevents a single R3F/GSAP failure from blanking the whole app with Next's generic error page. */
class HomeSectionErrorBoundary extends React.Component<
  { children: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full border-t border-white/10 bg-[#111] px-6 py-14 text-center">
          <p className="text-sm text-white/55">
            An animated section failed to load. The rest of the site should still work — try a refresh.
          </p>
        </div>
      );
    }
    return this.props.children;
  }
}

/** Shown while R3F/GSAP chunks download — avoids an empty black slab on slow or LAN connections. */
function SectionChunkLoader({
  minHeightClass,
  bgClass,
  label,
}: {
  minHeightClass: string;
  bgClass: string;
  label: string;
}) {
  return (
    <div
      className={`relative flex flex-col items-center justify-center gap-6 overflow-hidden ${minHeightClass} ${bgClass}`}
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/4 top-1/3 h-32 w-64 -translate-x-1/2 rounded-full bg-brand-red/25 blur-3xl animate-pulse" />
        <div
          className="absolute right-1/4 bottom-1/3 h-40 w-72 translate-x-1/2 animate-pulse rounded-full bg-white/10 blur-3xl"
          style={{ animationDelay: "0.7s" }}
        />
      </div>
      <div className="relative z-10 flex flex-col items-center gap-5">
        <div className="relative h-14 w-14">
          <span className="absolute inset-0 rounded-full border-2 border-white/15" />
          <span className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-brand-red border-r-brand-red/50 motion-reduce:animate-none" />
        </div>
        <p className="text-center text-[11px] font-semibold uppercase tracking-[0.22em] text-white/45">
          {label}
        </p>
        <div className="flex gap-1.5" aria-hidden>
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className={`h-1.5 w-1.5 rounded-full bg-brand-red/80 motion-safe:animate-bounce ${i === 1 ? "motion-safe:delay-150" : i === 2 ? "motion-safe:delay-300" : ""}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

const AnimatedShowcase = dynamic(
  () => import("@/components/sections/AnimatedShowcase").then((m) => m.AnimatedShowcase),
  {
    ssr: false,
    loading: () => (
      <SectionChunkLoader
        minHeightClass="h-[600px] w-full lg:h-[800px]"
        bgClass="bg-[#0a0a0a]"
        label="Loading 3D showcase"
      />
    ),
  }
);

const AnimatedCategories = dynamic(
  () => import("@/components/sections/AnimatedCategories").then((m) => m.AnimatedCategories),
  {
    ssr: false,
    loading: () => (
      <SectionChunkLoader
        minHeightClass="h-[80vh] min-h-[600px] w-full"
        bgClass="bg-black"
        label="Loading categories"
      />
    ),
  }
);

/** Client-only: R3F must not run during SSR (fixes ReactCurrentBatchConfig with `next start`). */
export function HomeAnimatedSections() {
  return (
    <>
      <HomeSectionErrorBoundary>
        <AnimatedShowcase />
      </HomeSectionErrorBoundary>
      <HomeSectionErrorBoundary>
        <AnimatedCategories />
      </HomeSectionErrorBoundary>
    </>
  );
}
