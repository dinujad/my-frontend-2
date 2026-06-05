"use client";

import { clsx } from "clsx";

type Props = {
  variant: "hero" | "side-left" | "side-right" | "services" | "workshop" | "founder";
  className?: string;
};

/** Lightweight inline SVG decor — animated via GSAP classes in AboutGSAPScroll */
export function AboutVectorDecor({ variant, className }: Props) {
  if (variant === "hero") {
    return (
      <div className={clsx("pointer-events-none absolute inset-0 overflow-hidden", className)} aria-hidden>
        <svg className="about-vector-float absolute left-[4%] top-[18%] h-20 w-20 opacity-[0.14] md:h-28 md:w-28" viewBox="0 0 120 120" fill="none">
          <rect x="20" y="35" width="80" height="50" rx="6" stroke="#FF1F40" strokeWidth="2" />
          <path d="M30 35V25h60v10" stroke="#FF1F40" strokeWidth="2" />
          <rect x="35" y="55" width="50" height="22" rx="2" fill="#FF1F40" fillOpacity="0.12" stroke="#FF1F40" strokeWidth="1.5" />
          <circle className="about-vector-spin origin-center" cx="95" cy="45" r="8" stroke="#BE0029" strokeWidth="2" />
        </svg>
        <svg className="about-vector-float-delay absolute right-[6%] top-[22%] h-16 w-16 opacity-[0.12] md:h-24 md:w-24" viewBox="0 0 100 100" fill="none">
          <path d="M15 75 L45 15 L75 75 Z" stroke="#BE0029" strokeWidth="2" fill="#FF1F40" fillOpacity="0.06" />
          <path className="about-vector-draw" d="M30 60 L50 30 L70 60" stroke="#FF1F40" strokeWidth="2" strokeLinecap="round" strokeDasharray="80" strokeDashoffset="80" />
        </svg>
        <svg className="about-vector-float absolute bottom-[20%] left-[8%] h-14 w-14 opacity-10 md:h-20 md:w-20" viewBox="0 0 80 80" fill="none">
          <circle cx="40" cy="40" r="28" stroke="#626262" strokeWidth="1.5" strokeDasharray="6 4" />
          <path d="M40 20v40M20 40h40" stroke="#FF1F40" strokeWidth="1.5" />
        </svg>
        <svg className="about-vector-float-delay absolute bottom-[24%] right-[10%] h-24 w-24 opacity-[0.11]" viewBox="0 0 100 100" fill="none">
          <ellipse cx="50" cy="55" rx="30" ry="18" stroke="#FF1F40" strokeWidth="2" />
          <path d="M35 55 Q50 30 65 55" stroke="#BE0029" strokeWidth="1.5" fill="none" />
          <circle cx="50" cy="38" r="4" fill="#FF1F40" fillOpacity="0.4" />
        </svg>
      </div>
    );
  }

  if (variant === "side-left") {
    return (
      <div className={clsx("pointer-events-none", className)} aria-hidden>
        <svg className="about-vector-float h-full w-full max-h-[420px]" viewBox="0 0 280 420" fill="none">
          <rect x="40" y="60" width="200" height="140" rx="12" stroke="#FF1F40" strokeWidth="2" fill="#fff" fillOpacity="0.5" />
          <path d="M60 100h160M60 130h120M60 160h140" stroke="#e5e7eb" strokeWidth="2" strokeLinecap="round" />
          <rect className="about-vector-pulse" x="60" y="180" width="160" height="8" rx="4" fill="#FF1F40" fillOpacity="0.25" />
          <path className="about-vector-draw" d="M70 220 Q140 200 210 220 T210 280" stroke="#BE0029" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="200" strokeDashoffset="200" />
          <circle className="about-vector-spin origin-center" cx="140" cy="320" r="36" stroke="#FF1F40" strokeWidth="1.5" strokeDasharray="8 6" />
          <path d="M124 320h32M140 304v32" stroke="#BE0029" strokeWidth="1.5" />
          {[0, 1, 2].map((i) => (
            <circle key={i} className="about-vector-float" cx={80 + i * 50} cy={380} r="6" fill="#FF1F40" fillOpacity={0.2 + i * 0.1} />
          ))}
        </svg>
      </div>
    );
  }

  if (variant === "side-right") {
    return (
      <div className={clsx("pointer-events-none", className)} aria-hidden>
        <svg className="about-vector-float-delay h-full w-full max-h-[400px]" viewBox="0 0 260 400" fill="none">
          <path d="M30 50 L130 20 L230 50 L230 350 L30 350 Z" stroke="#626262" strokeWidth="1.5" fill="#f9fafb" />
          <rect x="55" y="80" width="150" height="90" rx="6" stroke="#FF1F40" strokeWidth="2" fill="#FF1F40" fillOpacity="0.05" />
          <path className="about-vector-draw" d="M70 200 L130 170 L190 200 L190 300 L70 300 Z" stroke="#BE0029" strokeWidth="2" strokeDasharray="400" strokeDashoffset="400" />
          <circle cx="130" cy="245" r="20" stroke="#FF1F40" strokeWidth="2" fill="#fff" />
          <path d="M120 245h20M130 235v20" stroke="#FF1F40" strokeWidth="1.5" />
          <rect className="about-vector-pulse" x="55" y="330" width="150" height="10" rx="5" fill="#FF1F40" fillOpacity="0.2" />
        </svg>
      </div>
    );
  }

  if (variant === "services") {
    return (
      <div className={clsx("pointer-events-none flex items-center justify-center", className)} aria-hidden>
        <svg className="h-full w-full max-h-[360px] max-w-[360px]" viewBox="0 0 360 360" fill="none">
          <circle cx="180" cy="180" r="150" stroke="#f3f4f6" strokeWidth="2" />
          <circle className="about-vector-spin origin-center" cx="180" cy="180" r="110" stroke="#FF1F40" strokeWidth="1" strokeDasharray="4 8" opacity="0.5" />
          {[
            { x: 180, y: 50, label: "UV" },
            { x: 293, y: 115, label: "Laser" },
            { x: 293, y: 245, label: "Sign" },
            { x: 180, y: 310, label: "Card" },
            { x: 67, y: 245, label: "Sticker" },
            { x: 67, y: 115, label: "Design" },
          ].map((node, i) => (
            <g key={node.label} className="about-vector-float" style={{ animationDelay: `${i * 0.3}s` }}>
              <circle cx={node.x} cy={node.y} r="22" fill="#fff" stroke="#FF1F40" strokeWidth="2" />
              <text x={node.x} y={node.y + 4} textAnchor="middle" fill="#BE0029" fontSize="9" fontWeight="700">
                {node.label}
              </text>
            </g>
          ))}
          <circle cx="180" cy="180" r="32" fill="#FF1F40" fillOpacity="0.12" stroke="#FF1F40" strokeWidth="2" />
          <text x="180" y="186" textAnchor="middle" fill="#BE0029" fontSize="11" fontWeight="800">
            PRINT
          </text>
          {[
            [180, 50, 293, 115],
            [293, 115, 293, 245],
            [293, 245, 180, 310],
            [180, 310, 67, 245],
            [67, 245, 67, 115],
            [67, 115, 180, 50],
          ].map(([x1, y1, x2, y2], i) => (
            <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#FF1F40" strokeWidth="1" strokeOpacity="0.25" />
          ))}
        </svg>
      </div>
    );
  }

  if (variant === "workshop") {
    return (
      <div className={clsx("pointer-events-none absolute inset-0 overflow-hidden opacity-30", className)} aria-hidden>
        <svg className="about-vector-float absolute right-[5%] top-[10%] h-32 w-32" viewBox="0 0 100 100" fill="none">
          <path d="M10 70 L30 30 L50 70 L70 30 L90 70" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <svg className="about-vector-float-delay absolute left-[8%] bottom-[15%] h-24 w-24" viewBox="0 0 80 80" fill="none">
          <rect x="10" y="25" width="60" height="40" rx="4" stroke="#fff" strokeWidth="1.5" />
          <path d="M20 45h40" stroke="#FF1F40" strokeWidth="2" />
        </svg>
      </div>
    );
  }

  // founder
  return (
    <div className={clsx("pointer-events-none mx-auto", className)} aria-hidden>
      <svg className="about-vector-float h-48 w-48 md:h-56 md:w-56" viewBox="0 0 200 200" fill="none">
        <circle cx="100" cy="100" r="88" stroke="#FF1F40" strokeWidth="1.5" strokeDasharray="6 4" />
        <circle cx="100" cy="100" r="72" fill="#fdf2f4" stroke="#BE0029" strokeWidth="2" />
        <circle cx="100" cy="78" r="22" stroke="#626262" strokeWidth="2" fill="#fff" />
        <path d="M55 145 Q100 115 145 145" stroke="#626262" strokeWidth="2" fill="none" />
        <path className="about-vector-draw" d="M40 100 Q100 40 160 100" stroke="#FF1F40" strokeWidth="1.5" strokeDasharray="180" strokeDashoffset="180" fill="none" />
        <text x="100" y="175" textAnchor="middle" fill="#BE0029" fontSize="10" fontWeight="700">
          FOUNDER
        </text>
      </svg>
    </div>
  );
}
