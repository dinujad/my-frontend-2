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
    surface:
      "bg-gradient-to-br from-brand-red to-[#BE0029] text-white shadow-lg shadow-brand-red/20",
  },
  {
    label: "UV Print",
    href: "/products?category=UV+Flatbed",
    surface:
      "border border-gray-200/90 bg-white text-gray-900 shadow-md shadow-gray-300/25",
  },
  {
    label: "Laser",
    href: "/products",
    surface:
      "border border-gray-300 bg-gradient-to-b from-white to-gray-50 text-gray-900 shadow-sm",
  },
  {
    label: "Acrylic",
    href: "/products?category=Acrylic",
    surface:
      "bg-gradient-to-br from-[#BE0029] to-[#8a001f] text-white shadow-lg shadow-[#BE0029]/20",
  },
] as const;

export function HomeStaticSections() {
  return (
    <>
      <section
        id="static-showcase"
        className="relative w-full overflow-hidden border-t border-gray-200/70 bg-gradient-to-b from-[#ebeefa] via-[#f3f4fa] to-[#fafbff] py-14 text-gray-900 sm:py-16 lg:py-28"
        aria-label="About Print Works"
      >
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_100%_70%_at_50%_-10%,rgba(255,31,64,0.11),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_100%_40%,rgba(190,0,41,0.06),transparent_50%)]" />
          <div className="absolute -right-24 top-1/4 h-80 w-80 rounded-full bg-brand-red/15 blur-[110px]" />
          <div className="absolute -left-20 bottom-1/4 h-72 w-72 rounded-full bg-indigo-200/35 blur-[100px]" />
          <div className="absolute left-1/2 top-1/2 h-96 w-[120%] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.5),transparent_65%)]" />
          <div
            className="absolute inset-0 opacity-[0.4]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23475569' fill-opacity='0.06'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
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

          <ul className="grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-7">
            {SHOWCASE_ITEMS.map((item, idx) => (
              <ShowcaseStoryCard
                key={item.title}
                index={idx}
                title={item.title}
                subtitle={item.subtitle}
              />
            ))}
          </ul>

          <RevealRow
            className="mt-10 flex flex-col items-center justify-center gap-3.5 sm:mt-14 sm:flex-row sm:gap-5"
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
        className="relative flex min-h-[460px] w-full flex-col items-center justify-center overflow-hidden border-t border-gray-200/70 bg-gradient-to-b from-white via-[#f5f6fb] to-[#e8ebf4] px-4 py-14 text-gray-900 sm:py-16 lg:min-h-[600px] lg:py-24"
        aria-label="Product categories"
      >
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,31,64,0.08),transparent_45%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_75%,rgba(99,102,241,0.06),transparent_48%)]" />
          <div className="absolute bottom-0 left-1/2 h-48 w-[80%] -translate-x-1/2 bg-gradient-to-t from-white/80 to-transparent" />
        </div>

        <div className="relative z-10 w-full max-w-5xl px-2">
          <RevealBlock className="mx-auto max-w-3xl text-center">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.35em] text-brand-red">
              Capabilities
            </p>
            <h2 className="text-2xl font-light text-gray-900 sm:text-3xl lg:text-4xl">
              What we run <span className="font-semibold text-gray-950">in-house</span>
            </h2>
          </RevealBlock>

          <div className="mt-8 grid grid-cols-2 gap-2.5 sm:mt-10 sm:grid-cols-4 sm:gap-4 lg:mt-12">
            {CATEGORY_CHIPS.map((cat, i) => (
              <CategoryMotionTile
                key={cat.label}
                href={cat.href}
                label={cat.label}
                surface={cat.surface}
                delayIndex={i}
              />
            ))}
          </div>

          <RevealBlock className="mt-10 flex flex-col items-center gap-2 lg:mt-14" delay={0.2}>
            <div className="flex flex-wrap items-end justify-center gap-x-4 gap-y-1">
              <span className="text-4xl font-extralight uppercase leading-none tracking-tight text-gray-800 sm:text-6xl md:text-7xl lg:text-8xl">
                Top
              </span>
              <span className="bg-gradient-to-br from-brand-red via-[#ff4d6a] to-[#BE0029] bg-clip-text text-4xl font-bold uppercase leading-none tracking-tight text-transparent sm:text-6xl md:text-7xl lg:text-8xl">
                Tier
              </span>
            </div>
            <p className="mt-4 max-w-md text-center text-sm font-light leading-relaxed text-gray-600">
              Explore categories and request a quote — we&apos;ll match finish, material, and timeline
              to your brand.
            </p>
            <Link
              href="/products"
              className="mt-5 text-[11px] font-bold uppercase tracking-[0.2em] text-brand-red underline-offset-4 transition hover:text-gray-900 hover:underline sm:mt-6 sm:text-xs sm:tracking-[0.25em]"
            >
              Shop all products →
            </Link>
          </RevealBlock>
        </div>
      </section>
    </>
  );
}
