"use client";

export function HeroLineAnimation() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-40 md:opacity-60" aria-hidden>
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 800 500" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF1F40" />
            <stop offset="100%" stopColor="#BE0029" />
          </linearGradient>
        </defs>
        {/* Animated drawing lines */}
        <path
          d="M 50 80 Q 200 40 350 120 T 550 80 T 750 150"
          stroke="url(#lineGrad)"
          strokeWidth="1.2"
          strokeDasharray="2000"
          className="animate-line-draw"
          style={{ animationDelay: "0.2s", animationFillMode: "forwards" }}
        />
        <path
          d="M 100 400 Q 300 350 500 380 T 700 320"
          stroke="url(#lineGrad)"
          strokeWidth="1"
          strokeDasharray="2000"
          className="animate-line-draw"
          style={{ animationDelay: "0.6s", animationFillMode: "forwards" }}
        />
        <path
          d="M 750 100 L 650 250 L 700 400"
          stroke="#626262"
          strokeWidth="0.9"
          strokeDasharray="2000"
          className="animate-line-draw"
          style={{ animationDelay: "1s", animationFillMode: "forwards", opacity: 0.6 }}
        />
        <path
          d="M 50 350 L 150 200 L 80 100"
          stroke="#626262"
          strokeWidth="0.9"
          strokeDasharray="2000"
          className="animate-line-draw"
          style={{ animationDelay: "1.2s", animationFillMode: "forwards", opacity: 0.6 }}
        />
      </svg>
    </div>
  );
}
