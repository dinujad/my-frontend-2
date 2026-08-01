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
  const icons = [
    <path key="vision" d="M2.5 12s3.5-5 9.5-5 9.5 5 9.5 5-3.5 5-9.5 5-9.5-5-9.5-5Zm9.5 2.6a2.6 2.6 0 1 0 0-5.2 2.6 2.6 0 0 0 0 5.2Z" />,
    <path key="origin" d="M5 20V10m0 0 7-6 7 6M5 10h14v10H5Zm4 10v-6h6v6" />,
    <path key="make" d="m4 15 8-11 8 11-8 5-8-5Zm0 0 8-4 8 4M12 4v7" />,
    <path key="workshop" d="M4 20V9l5 3V9l5 3V6h6v14H4Zm3-3h2m3 0h2m3 0h1" />,
    <path key="choose" d="m12 3 2.7 5.5 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1-4.4-4.3 6.1-.9L12 3Z" />,
  ];
  const accents = [
    "from-cyan-400 to-sky-600 shadow-cyan-400/30",
    "from-fuchsia-500 to-brand-red shadow-fuchsia-500/30",
    "from-amber-300 to-orange-500 shadow-amber-400/30",
    "from-gray-700 to-gray-950 shadow-gray-700/30",
    "from-brand-red to-rose-700 shadow-brand-red/30",
  ];

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
      className={`group relative flex min-h-[150px] gap-5 pl-1 md:min-h-[175px] md:flex-col md:items-center md:gap-0 md:px-2 md:pl-0 md:text-center ${
        index % 2 === 1 ? "lg:translate-y-12" : ""
      }`}
    >
      <motion.div
        className="relative z-10 flex h-[68px] w-[68px] shrink-0 items-center justify-center sm:h-[82px] sm:w-[82px]"
        whileHover={reduce === true ? undefined : { scale: 1.12, rotate: 7 }}
        transition={{ type: "spring", stiffness: 260, damping: 16 }}
      >
        <span
          className={`absolute inset-0 rounded-full bg-gradient-to-br ${accents[index]} opacity-15 blur-xl transition duration-500 group-hover:opacity-35`}
          aria-hidden
        />
        <span
          className={`absolute inset-[5px] rounded-full bg-gradient-to-br ${accents[index]} shadow-lg`}
          aria-hidden
        />
        <span className="absolute inset-[8px] rounded-full border border-white/50" aria-hidden />
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.65"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="relative h-7 w-7 text-white sm:h-8 sm:w-8"
          aria-hidden
        >
          {icons[index]}
        </svg>
        <span className="absolute -right-1 -top-1 flex h-6 min-w-6 items-center justify-center rounded-full border-2 border-white bg-gray-950 px-1 font-mono text-[8px] font-bold tracking-wide text-white shadow-md">
          {n}
        </span>
      </motion.div>

      <div className="relative z-10 pt-1 md:mt-5 md:pt-0">
        <h3 className="text-[14px] font-black uppercase tracking-[0.12em] text-gray-950 sm:text-[15px] lg:text-base">
          {title}
        </h3>
        <span
          className={`mt-2 block h-[2px] w-10 rounded-full bg-gradient-to-r ${accents[index]} transition-all duration-500 group-hover:w-16 md:mx-auto`}
          aria-hidden
        />
        <p className="mt-3 max-w-[230px] text-[13px] font-light leading-relaxed text-gray-600 sm:text-sm md:mx-auto">
          {subtitle}
        </p>
      </div>
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
