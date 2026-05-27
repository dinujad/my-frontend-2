"use client";

import { useEffect, useRef, useState } from "react";

const WHATSAPP = "94XXXXXXXXX"; // replace with real number if needed

export function MaintenanceClient() {
  const [dots, setDots] = useState(0);
  const [progress, setProgress] = useState(0);
  const [particlePositions, setParticlePositions] = useState<
    { left: string; top: string; delay: string; duration: string }[]
  >([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Generate particles only on client to avoid hydration mismatch
    setParticlePositions(
      Array.from({ length: 12 }, () => ({
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        delay: `${Math.random() * 4}s`,
        duration: `${3 + Math.random() * 4}s`,
      }))
    );

    intervalRef.current = setInterval(() => {
      setDots((d) => (d + 1) % 4);
      setProgress((p) => (p >= 100 ? 0 : p + Math.random() * 2));
    }, 600);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const dotsStr = ".".repeat(dots);

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 px-4">

      {/* Ambient glow blobs */}
      <div className="pointer-events-none absolute left-1/4 top-1/4 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-600/10 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-1/4 right-1/4 h-[400px] w-[400px] translate-x-1/2 translate-y-1/2 rounded-full bg-red-800/8 blur-[100px]" />

      {/* Floating ink-drop particles */}
      {particlePositions.map((p, i) => (
        <span
          key={i}
          className="pointer-events-none absolute h-1.5 w-1.5 rounded-full bg-red-500/30 animate-pulse"
          style={{
            left: p.left,
            top: p.top,
            animationDelay: p.delay,
            animationDuration: p.duration,
          }}
        />
      ))}

      {/* Card */}
      <div className="relative z-10 w-full max-w-lg rounded-2xl border border-white/[0.06] bg-white/[0.03] p-8 text-center shadow-2xl backdrop-blur-sm sm:p-12">

        {/* Logo / brand */}
        <div className="mb-8 flex items-center justify-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-600 shadow-lg shadow-red-600/30">
            <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 text-white" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 17H7a4 4 0 01-4-4V7a4 4 0 014-4h10a4 4 0 014 4v6a4 4 0 01-4 4z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 17v3h10v-3" />
              <circle cx="17" cy="10" r="1" fill="currentColor" />
            </svg>
          </div>
          <span className="text-lg font-bold tracking-tight text-white">
            Print<span className="text-red-500">Works</span>.LK
          </span>
        </div>

        {/* Animated print roller */}
        <div className="relative mx-auto mb-8 flex h-24 w-24 items-center justify-center">
          {/* Outer rotating ring */}
          <div className="absolute inset-0 rounded-full border-2 border-red-600/20" />
          <div
            className="absolute inset-0 rounded-full border-2 border-transparent border-t-red-500 border-r-red-500/50"
            style={{ animation: "spin 1.8s linear infinite" }}
          />
          {/* Middle ring */}
          <div
            className="absolute inset-3 rounded-full border-2 border-transparent border-b-red-400/40 border-l-red-400/70"
            style={{ animation: "spin 2.4s linear infinite reverse" }}
          />
          {/* Center icon */}
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-600/20 ring-1 ring-red-500/30">
            <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 text-red-400" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </div>
        </div>

        {/* Heading */}
        <h1 className="mb-3 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
          We&apos;re Updating
        </h1>
        <p className="text-base text-gray-400 sm:text-lg">
          Our site is getting a fresh coat of ink{dotsStr}
        </p>

        {/* Progress bar */}
        <div className="relative my-8 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
          <div
            className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-red-600 to-red-400 transition-all duration-700"
            style={{ width: `${Math.min(progress, 95)}%` }}
          />
          {/* shimmer */}
          <div
            className="absolute inset-y-0 w-16 rounded-full bg-white/30 blur-sm"
            style={{
              left: `${Math.min(progress, 92)}%`,
              transition: "left 0.7s ease",
            }}
          />
        </div>

        {/* Info card */}
        <div className="rounded-xl border border-white/[0.07] bg-white/[0.04] px-5 py-4">
          <p className="text-sm font-medium text-gray-300">
            🚀 We&apos;re upgrading our systems to serve you better.
            <br />
            Please check back shortly.
          </p>
        </div>

        {/* WhatsApp CTA */}
        <a
          href={`https://wa.me/${WHATSAPP}?text=Hi%20Print%20Works%2C%20your%20website%20shows%20maintenance.%20When%20will%20it%20be%20back%3F`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex items-center gap-2.5 rounded-xl bg-[#25D366] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-green-600/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#1ebe5a] hover:shadow-green-500/30"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          Chat on WhatsApp
        </a>

        {/* Footer note */}
        <p className="mt-6 text-xs text-gray-600">
          © {new Date().getFullYear()} Print Works.LK — Sri Lanka&apos;s Custom Print Specialists
        </p>
      </div>

      <style jsx global>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
