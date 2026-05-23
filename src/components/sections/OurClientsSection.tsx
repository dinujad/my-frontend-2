import type { ClientLogo } from "@/lib/client-logos";

type Props = {
  logos: ClientLogo[];
};

function LogoCard({ logo }: { logo: ClientLogo }) {
  return (
    <div
      className="group flex h-[4.5rem] w-[9.5rem] shrink-0 items-center justify-center rounded-xl border border-gray-100 bg-white px-5 py-3 shadow-sm transition duration-300 hover:border-brand-red/20 hover:shadow-md sm:h-20 sm:w-44 sm:px-6"
      title={logo.name}
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- mixed client logo sizes */}
      <img
        src={logo.src}
        alt={logo.alt}
        className="max-h-10 max-w-full object-contain opacity-75 grayscale transition duration-300 group-hover:opacity-100 group-hover:grayscale-0 sm:max-h-12"
        loading="lazy"
        decoding="async"
      />
    </div>
  );
}

export function OurClientsSection({ logos }: Props) {
  if (logos.length === 0) return null;

  const marqueeTrack = [...logos, ...logos];

  return (
    <section
      className="relative overflow-hidden border-b border-gray-100 bg-gradient-to-b from-white via-gray-50/80 to-white py-10 sm:py-14"
      aria-label="Our clients"
    >
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute left-1/2 top-0 h-px w-[min(90%,48rem)] -translate-x-1/2 bg-gradient-to-r from-transparent via-brand-red/30 to-transparent" />
      </div>

      <div className="relative mx-auto max-w-[90rem] px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-red sm:text-sm">
            Trusted by leading brands
          </p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            Our Clients
          </h2>
          <p className="mt-2 text-sm text-gray-600 sm:text-base">
            Businesses across Sri Lanka choose Print Works for quality print and signage.
          </p>
        </div>

        {/* Desktop: balanced grid */}
        <ul className="mt-8 hidden flex-wrap items-center justify-center gap-4 sm:mt-10 md:flex lg:gap-5">
          {logos.map((logo) => (
            <li key={logo.src}>
              <LogoCard logo={logo} />
            </li>
          ))}
        </ul>

        {/* Mobile / tablet: smooth marquee */}
        <div className="relative mt-8 overflow-hidden md:hidden">
          <div className="flex w-max gap-4 animate-scroll-x py-1 hover:[animation-play-state:paused]">
            {marqueeTrack.map((logo, i) => (
              <LogoCard key={`${logo.src}-${i}`} logo={logo} />
            ))}
          </div>
          <div
            className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-gray-50 to-transparent sm:w-24"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-gray-50 to-transparent sm:w-24"
            aria-hidden
          />
        </div>

      </div>
    </section>
  );
}
