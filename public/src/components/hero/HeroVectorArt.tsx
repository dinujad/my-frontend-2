"use client";

export function HeroVectorArt() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {/* Printer icon - top left */}
      <div className="absolute left-[8%] top-[15%] opacity-[0.1] transition-opacity hover:opacity-25 md:opacity-[0.14]">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#FF1F40" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 9V2h12v7" />
          <path d="M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2" />
          <path d="M6 14h12v8H6z" />
        </svg>
      </div>
      {/* Design/pen icon - top right */}
      <div className="absolute right-[12%] top-[20%] opacity-[0.1] transition-opacity hover:opacity-25 md:opacity-[0.14]">
        <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#BE0029" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 19l7-7 3 3-7 7-3-3z" />
          <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
          <path d="M2 2l7.586 7.586" />
        </svg>
      </div>
      {/* Document/layout - bottom left */}
      <div className="absolute bottom-[25%] left-[10%] opacity-[0.09] transition-opacity hover:opacity-18 md:opacity-[0.12]">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#626262" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <path d="M3 9h18" />
          <path d="M9 21V9" />
        </svg>
      </div>
      {/* Palette/creativity - bottom right */}
      <div className="absolute bottom-[20%] right-[15%] opacity-[0.1] transition-opacity hover:opacity-22 md:opacity-[0.14]">
        <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="#FF1F40" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="13.5" cy="6.5" r="0.5" fill="#FF1F40" />
          <circle cx="17.5" cy="10.5" r="0.5" fill="#BE0029" />
          <circle cx="8.5" cy="9.5" r="0.5" fill="#626262" />
          <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.9 0 1.75-.15 2.54-.4" />
          <path d="M20 8a4 4 0 00-4-4" />
        </svg>
      </div>
    </div>
  );
}
