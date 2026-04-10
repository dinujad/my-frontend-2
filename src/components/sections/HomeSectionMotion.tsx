"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import type { ReactNode } from "react";

const ease = [0.22, 1, 0.36, 1] as const;

const viewport = {
  once: true,
  amount: 0.22,
  margin: "0px 0px -10% 0px",
} as const;

function hiddenState(reduce: boolean | null) {
  if (reduce === true) return false;
  return { opacity: 0, y: 42, scale: 0.97, filter: "blur(6px)" };
}

function shownState(reduce: boolean | null) {
  if (reduce === true) return undefined;
  return { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" };
}

export function RevealHeader({ children, className }: { children: ReactNode; className?: string }) {
  const reduce = useReducedMotion();
  return (
    <motion.header
      className={className}
      initial={reduce === true ? false : { opacity: 0, y: 38 }}
      whileInView={reduce === true ? undefined : { opacity: 1, y: 0 }}
      viewport={viewport}
      transition={{ duration: 0.72, ease }}
    >
      {children}
    </motion.header>
  );
}

export function RevealRow({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce === true ? false : { opacity: 0, y: 32 }}
      whileInView={reduce === true ? undefined : { opacity: 1, y: 0 }}
      viewport={viewport}
      transition={{ duration: 0.68, delay, ease }}
    >
      {children}
    </motion.div>
  );
}

export function RevealBlock({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce === true ? false : { opacity: 0, y: 36 }}
      whileInView={reduce === true ? undefined : { opacity: 1, y: 0 }}
      viewport={viewport}
      transition={{ duration: 0.7, delay, ease }}
    >
      {children}
    </motion.div>
  );
}

export function ShowcaseStoryCard({
  index,
  title,
  subtitle,
}: {
  index: number;
  title: string;
  subtitle: string;
}) {
  const reduce = useReducedMotion();
  const n = String(index + 1).padStart(2, "0");

  return (
    <motion.li
      initial={hiddenState(reduce)}
      whileInView={shownState(reduce)}
      viewport={viewport}
      transition={{
        duration: 0.78,
        delay: reduce === true ? 0 : index * 0.11,
        ease,
      }}
      className="group relative overflow-hidden rounded-2xl border border-white/90 bg-gradient-to-b from-white via-white to-gray-50/95 p-5 shadow-[0_24px_60px_-18px_rgba(15,23,42,0.1),0_0_0_1px_rgba(255,31,64,0.05)] ring-1 ring-gray-900/[0.04] backdrop-blur-sm transition-[box-shadow,ring-color] duration-500 hover:shadow-[0_32px_72px_-20px_rgba(255,31,64,0.18)] hover:ring-brand-red/15 sm:rounded-3xl sm:p-7 lg:p-8"
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-brand-red via-[#ff5c73] to-amber-400/70 opacity-95"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-8 -top-10 h-36 w-36 rounded-full bg-gradient-to-br from-brand-red/[0.12] to-transparent blur-2xl transition duration-700 group-hover:from-brand-red/25"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-6 -left-6 h-28 w-28 rounded-full bg-gray-400/[0.07] blur-2xl"
        aria-hidden
      />

      <span
        className="relative font-mono text-[11px] font-semibold tabular-nums tracking-widest text-brand-red/45"
        aria-hidden
      >
        {n}
      </span>
      <h3 className="relative mt-2 text-[15px] font-bold uppercase tracking-[0.11em] text-gray-900 sm:mt-2.5 sm:text-base sm:tracking-[0.14em] lg:text-lg">
        {title}
      </h3>
      <div
        className="relative mt-4 h-px w-14 bg-gradient-to-r from-brand-red via-[#ff7a8c] to-transparent"
        aria-hidden
      />
      <p className="relative mt-3.5 text-[14px] font-light leading-relaxed text-gray-600 sm:mt-4 sm:text-[15px] lg:text-base">
        {subtitle}
      </p>
    </motion.li>
  );
}

export function CategoryMotionTile({
  href,
  label,
  surface,
  delayIndex,
}: {
  href: string;
  label: string;
  surface: string;
  delayIndex: number;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className="h-full min-h-[5.5rem] sm:min-h-[6rem]"
      initial={reduce === true ? false : { opacity: 0, y: 36, scale: 0.96 }}
      whileInView={reduce === true ? undefined : { opacity: 1, y: 0, scale: 1 }}
      viewport={viewport}
      transition={{
        duration: 0.65,
        delay: reduce === true ? 0 : 0.05 + delayIndex * 0.1,
        ease,
      }}
    >
      <Link
        href={href}
        className={`flex h-full min-h-[5rem] w-full items-center justify-center rounded-xl px-3 py-3.5 text-center text-[11px] font-extrabold uppercase tracking-[0.14em] transition duration-300 hover:scale-[1.03] active:scale-[0.98] sm:min-h-[6rem] sm:rounded-2xl sm:px-4 sm:py-4 sm:text-sm sm:tracking-widest ${surface}`}
      >
        {label}
      </Link>
    </motion.div>
  );
}
