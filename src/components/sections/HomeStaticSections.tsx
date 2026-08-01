// Server Component — light sections + client scroll reveals (Framer, no 3D/GSAP here).
import Link from "next/link";
import {
  CategoryMotionTile,
  RevealBlock,
  RevealHeader,
  RevealRow,
  ShowcaseStoryCard,
} from "@/components/sections/HomeSectionMotion";

const SHOWCASE_ITEMS = [
  {
    title: "OUR VISION",
    subtitle: "Sri Lanka’s most trusted online printing platform",
  },
  {
    title: "ORIGIN STORY",
    subtitle: "From a small apparel brand to total print solutions",
  },
  {
    title: "WHAT WE MAKE",
    subtitle: "Bespoke craft, digital, UV, & custom fabrications",
  },
  {
    title: "THE WORKSHOP",
    subtitle: "An end-to-end production ecosystem under one roof",
  },
  {
    title: "WHY CHOOSE US",
    subtitle: "Easy ordering, premium results, island-wide delivery",
  },
] as const;

const CATEGORY_CHIPS = [
  {
    label: "Digital",
    href: "/products",
    surface: "",
  },
  {
    label: "UV Print",
    href: "/products?category=UV+Flatbed",
    surface: "",
  },
  {
    label: "Laser",
    href: "/products",
    surface: "",
  },
  {
    label: "Acrylic",
    href: "/products?category=Acrylic",
    surface: "",
  },
] as const;

export function HomeStaticSections() {
  return (
    <>
      <section
        id="static-showcase"
        className="relative w-full overflow-hidden border-t border-gray-200/70 bg-[#faf9f6] py-14 text-gray-900 sm:py-16 lg:py-28"
        aria-label="About Print Works"
      >
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_90%_60%_at_50%_0%,rgba(255,255,255,0.96),transparent_70%)]" />
          <div className="absolute -left-24 top-24 h-80 w-80 animate-pulse rounded-full bg-cyan-300/20 blur-[100px] [animation-duration:7s]" />
          <div className="absolute -right-20 top-1/3 h-96 w-96 animate-pulse rounded-full bg-fuchsia-300/20 blur-[120px] [animation-delay:1.5s] [animation-duration:8s]" />
          <div className="absolute bottom-[-9rem] left-1/3 h-80 w-80 animate-pulse rounded-full bg-amber-200/25 blur-[110px] [animation-delay:3s] [animation-duration:9s]" />
          <div
            className="absolute inset-0 opacity-35"
            style={{
              backgroundImage: `radial-gradient(circle, rgba(15,23,42,0.13) 0.7px, transparent 0.8px)`,
              backgroundSize: "22px 22px",
            }}
          />
          <div className="absolute left-[8%] top-[44%] h-px w-24 -rotate-12 bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent" />
          <div className="absolute right-[9%] top-[28%] h-px w-32 rotate-12 bg-gradient-to-r from-transparent via-fuchsia-500/40 to-transparent" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <RevealHeader className="mx-auto mb-10 max-w-3xl text-center sm:mb-12 lg:mb-16">
            <div className="mb-4 inline-flex items-center gap-2 sm:mb-5 sm:gap-3">
              <span className="h-px w-6 bg-gradient-to-r from-transparent to-brand-red sm:w-10" />
              <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-brand-red sm:text-xs sm:tracking-[0.28em]">
                The Print Works story
              </span>
              <span className="h-px w-6 bg-gradient-to-l from-transparent to-brand-red sm:w-10" />
            </div>
            <h2 className="text-balance text-[1.85rem] font-light leading-tight tracking-tight text-gray-900 sm:text-4xl lg:text-[2.75rem]">
              Precision printing,{" "}
              <span className="font-semibold text-gray-950">island-wide reach</span>
              <span className="text-brand-red">.</span>
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-[14px] leading-relaxed text-gray-600 sm:mt-5 sm:text-sm lg:text-base">
              From first idea to delivered product — same craft, same brand voice. Scroll down to
              explore what we run in-house.
            </p>
          </RevealHeader>

          <div className="relative mx-auto max-w-6xl">
            {/* Mobile connector */}
            <div
              className="absolute bottom-14 left-[34px] top-9 w-px bg-gradient-to-b from-cyan-400 via-fuchsia-500 via-55% to-brand-red md:hidden"
              aria-hidden
            />

            {/* Desktop flowing print path */}
            <svg
              viewBox="0 0 1000 190"
              preserveAspectRatio="none"
              className="pointer-events-none absolute left-[8%] top-9 hidden h-40 w-[84%] overflow-visible md:block"
              aria-hidden
            >
              <defs>
                <linearGradient id="story-flow-gradient" x1="0" x2="1">
                  <stop offset="0" stopColor="#22d3ee" />
                  <stop offset=".28" stopColor="#e6007e" />
                  <stop offset=".55" stopColor="#fbbf24" />
                  <stop offset=".75" stopColor="#111827" />
                  <stop offset="1" stopColor="#ff1f40" />
                </linearGradient>
              </defs>
              <path
                d="M0 48 C110 48 115 142 250 142 S390 48 500 48 640 142 750 142 885 48 1000 48"
                fill="none"
                stroke="rgba(255,255,255,.9)"
                strokeWidth="10"
                strokeLinecap="round"
              />
              <path
                d="M0 48 C110 48 115 142 250 142 S390 48 500 48 640 142 750 142 885 48 1000 48"
                fill="none"
                stroke="url(#story-flow-gradient)"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeDasharray="9 12"
                className="story-flow-path"
              />
            </svg>

            <ul className="relative grid gap-3 md:grid-cols-5 md:gap-2 lg:gap-5">
            {SHOWCASE_ITEMS.map((item, idx) => (
              <ShowcaseStoryCard
                key={item.title}
                index={idx}
                title={item.title}
                subtitle={item.subtitle}
              />
            ))}
            </ul>
          </div>

          <RevealRow
            className="mt-8 flex flex-col items-center justify-center gap-3.5 sm:mt-24 sm:flex-row sm:gap-5 lg:mt-28"
            delay={0.35}
          >
            <Link
              href="/quote"
              className="inline-flex min-h-[50px] w-full items-center justify-center rounded-full bg-gradient-to-r from-brand-red to-[#BE0029] px-8 py-3.5 text-xs font-bold uppercase tracking-[0.15em] text-white shadow-lg shadow-brand-red/30 transition duration-300 hover:scale-[1.02] active:scale-[0.98] sm:min-h-[52px] sm:w-auto sm:px-10 sm:text-sm sm:tracking-[0.2em]"
            >
              Start a project
            </Link>
            <Link
              href="/products"
              className="inline-flex min-h-[50px] w-full items-center justify-center rounded-full border border-gray-300 bg-white px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.14em] text-gray-800 shadow-sm transition duration-300 hover:border-gray-400 hover:bg-gray-50 sm:min-h-[52px] sm:w-auto sm:px-10 sm:text-sm sm:tracking-[0.18em]"
            >
              Browse catalog
            </Link>
          </RevealRow>
        </div>
      </section>

      <section
        className="relative flex min-h-[760px] w-full items-center overflow-hidden border-t border-white/10 bg-[#080b10] px-4 py-20 text-white sm:px-6 lg:min-h-[820px] lg:px-8 lg:py-28"
        aria-label="Product categories"
      >
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_76%_48%,rgba(255,31,64,0.16),transparent_26%),radial-gradient(circle_at_66%_44%,rgba(34,211,238,0.10),transparent_38%),radial-gradient(circle_at_18%_75%,rgba(217,70,239,0.08),transparent_32%)]" />
          <div
            className="absolute inset-0 opacity-[0.14]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,.12) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.12) 1px, transparent 1px)",
              backgroundSize: "54px 54px",
              maskImage: "linear-gradient(to bottom, transparent, black 18%, black 82%, transparent)",
            }}
          />
          <div className="print-lab-beam absolute -left-[35%] top-1/2 h-px w-[170%] -rotate-12 bg-gradient-to-r from-transparent via-brand-red/70 to-transparent blur-[1px]" />
          <div className="absolute left-[8%] top-[12%] font-mono text-[10px] uppercase tracking-[0.35em] text-white/20">
            Concept → Craft → Delivery
          </div>
          <div className="absolute bottom-[10%] right-[7%] font-mono text-[10px] uppercase tracking-[0.35em] text-white/20">
            Biyagama / Sri Lanka
          </div>
        </div>

        <div className="relative z-10 mx-auto grid w-full max-w-7xl items-center gap-16 lg:grid-cols-[0.88fr_1.12fr] lg:gap-10 xl:gap-20">
          <RevealBlock className="relative mx-auto max-w-xl text-center lg:mx-0 lg:text-left">
            <div className="mb-6 inline-flex items-center gap-3">
              <span className="h-2 w-2 animate-pulse rounded-full bg-brand-red shadow-[0_0_18px_rgba(255,31,64,.9)]" />
              <span className="font-mono text-[10px] font-bold uppercase tracking-[0.35em] text-white/55 sm:text-xs">
                The Print Lab / 04 disciplines
              </span>
            </div>

            <h2 className="text-balance text-5xl font-black uppercase leading-[0.86] tracking-[-0.065em] sm:text-7xl lg:text-[5.5rem] xl:text-[6.6rem]">
              One roof.
              <span className="block text-white/25">Endless</span>
              <span className="block bg-gradient-to-r from-cyan-300 via-fuchsia-400 to-brand-red bg-clip-text text-transparent">
                possibilities.
              </span>
            </h2>

            <p className="mx-auto mt-8 max-w-md text-sm font-light leading-7 text-white/55 sm:text-base lg:mx-0">
              Digital, UV, laser and acrylic production move through one connected workshop —
              giving every project tighter control, faster turns and a finish worth remembering.
            </p>

            <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row lg:justify-start">
              <Link
                href="/products"
                className="group inline-flex min-h-[54px] w-full items-center justify-center gap-3 rounded-full bg-white px-8 text-xs font-black uppercase tracking-[0.18em] text-gray-950 transition duration-300 hover:bg-brand-red hover:text-white sm:w-auto"
              >
                Explore the lab
                <span className="transition-transform duration-300 group-hover:translate-x-1">↗</span>
              </Link>
              <Link
                href="/quote"
                className="inline-flex min-h-[54px] w-full items-center justify-center rounded-full border border-white/15 px-8 text-xs font-bold uppercase tracking-[0.18em] text-white/70 transition hover:border-white/40 hover:bg-white/5 hover:text-white sm:w-auto"
              >
                Start a project
              </Link>
            </div>
          </RevealBlock>

          <RevealBlock className="relative mx-auto aspect-square w-full max-w-[390px] sm:max-w-[540px] lg:max-w-[610px]" delay={0.15}>
            <div className="absolute inset-[11%] rounded-full bg-brand-red/[0.04] blur-3xl" />
            <div className="print-orbit print-orbit-slow absolute inset-[7%] rounded-full border border-dashed border-white/15" />
            <div className="print-orbit print-orbit-reverse absolute inset-[19%] rounded-full border border-dashed border-cyan-300/20" />
            <div className="absolute inset-[31%] rounded-full border border-white/10 bg-white/[0.025] shadow-[inset_0_0_50px_rgba(255,255,255,.03),0_0_80px_rgba(255,31,64,.08)] backdrop-blur-sm" />

            <svg viewBox="0 0 500 500" className="absolute inset-[12%] h-[76%] w-[76%]" aria-hidden>
              <defs>
                <linearGradient id="labOrbitGradient" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stopColor="#67e8f9" />
                  <stop offset=".35" stopColor="#d946ef" />
                  <stop offset=".68" stopColor="#fbbf24" />
                  <stop offset="1" stopColor="#ff1f40" />
                </linearGradient>
              </defs>
              <circle
                cx="250"
                cy="250"
                r="238"
                fill="none"
                stroke="url(#labOrbitGradient)"
                strokeWidth="2"
                strokeDasharray="2 17"
                strokeLinecap="round"
                className="print-orbit"
              />
            </svg>

            <div className="absolute inset-[35%] z-10 flex flex-col items-center justify-center rounded-full bg-[#0d1118] text-center shadow-[0_0_0_1px_rgba(255,255,255,.12),0_25px_70px_rgba(0,0,0,.55)]">
              <span className="font-mono text-[8px] uppercase tracking-[0.3em] text-white/35 sm:text-[10px]">
                Built in-house
              </span>
              <strong className="mt-2 text-xl font-black uppercase leading-none tracking-[-0.04em] sm:text-3xl">
                Print
                <span className="block text-brand-red">Works</span>
              </strong>
              <span className="mt-2 h-px w-8 bg-white/20" />
            </div>

            {CATEGORY_CHIPS.map((cat, i) => (
              <CategoryMotionTile
                key={cat.label}
                href={cat.href}
                label={cat.label}
                surface={cat.surface}
                delayIndex={i}
              />
            ))}
          </RevealBlock>
        </div>
      </section>
    </>
  );
}
