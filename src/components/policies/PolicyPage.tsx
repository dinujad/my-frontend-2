import Link from "next/link";
import { POLICY_LINKS, type PolicyDoc } from "@/lib/policies";

export function PolicyPage({ policy }: { policy: PolicyDoc }) {
  return (
    <main className="min-h-screen bg-gradient-to-b from-[#fdf2f4] via-white to-gray-50">
      <section className="border-b border-brand-red/10 bg-gradient-to-r from-gray-900 via-nav-dark to-gray-900 text-white">
        <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-red">
            Our Policies
          </p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            {policy.title}
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-gray-300 sm:text-base">
            {policy.description}
          </p>
          <p className="mt-4 text-xs text-gray-400">
            Last updated: {policy.lastUpdated}
          </p>
        </div>
      </section>

      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[240px_1fr] lg:py-14">
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <nav
            aria-label="Policy pages"
            className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm"
          >
            <p className="mb-3 px-2 text-[11px] font-bold uppercase tracking-wider text-brand-red">
              Our Policies
            </p>
            <ul className="space-y-1">
              {POLICY_LINKS.map((item) => {
                const active = item.slug === policy.slug;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`block rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
                        active
                          ? "bg-brand-red text-white shadow-sm shadow-brand-red/25"
                          : "text-gray-700 hover:bg-gray-50 hover:text-brand-red"
                      }`}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </aside>

        <article className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8 lg:p-10">
          <div className="space-y-8">
            {policy.sections.map((section) => (
              <section key={section.heading} className="scroll-mt-28">
                <h2 className="text-lg font-bold text-gray-900 sm:text-xl">
                  {section.heading}
                </h2>
                {section.paragraphs?.map((p) => (
                  <p
                    key={p.slice(0, 40)}
                    className="mt-3 text-sm leading-relaxed text-gray-600 sm:text-[15px]"
                  >
                    {p}
                  </p>
                ))}
                {section.bullets && section.bullets.length > 0 ? (
                  <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-gray-600 sm:text-[15px]">
                    {section.bullets.map((b) => (
                      <li key={b}>{b}</li>
                    ))}
                  </ul>
                ) : null}
              </section>
            ))}
          </div>

          <div className="mt-10 border-t border-gray-100 pt-6 text-sm text-gray-500">
            Need help?{" "}
            <a
              href="https://wa.me/94706668885"
              className="font-semibold text-brand-red hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              WhatsApp 070 666 8885
            </a>{" "}
            or{" "}
            <a
              href="mailto:info@printworks.lk"
              className="font-semibold text-brand-red hover:underline"
            >
              info@printworks.lk
            </a>
          </div>
        </article>
      </div>
    </main>
  );
}
