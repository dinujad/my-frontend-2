import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { FadeInSection } from "@/components/ui/FadeInSection";

export const metadata: Metadata = {
  title: "Our Full Story | About Us | Print Works.LK",
  description:
    "Our story, mission, team, and why brands choose us. Sri Lanka's trusted online printing platform.",
};

const services = [
  "Digital Printing (including specialty and large format)",
  "UV Printing on acrylic, wood, metal, glass, ceramic & more",
  "Laser Cutting & Engraving (acrylic, plywood, MDF, stainless steel, brass)",
  "PVC Card Printing (Company/Student ID's, Visitor passes, Transparent / Frosted business cards)",
  "Paper-based Printing for bespoke, small batches",
  "Custom Acrylic Products & Creations (acrylic boxes, table tops, display stands, display cubes, name tag holders, leaflet holders)",
  "Stainless Steel & Brass Engraving",
  "Sticker Printing & Cutting (brand decals, short-run product labels)",
  "Signage Boards (retail, corporate, safety, wayfinding)",
  "Tags & Badges, Graphic Designing, and Promotional & Gift Items",
];

const whoWeServe = [
  "Retail",
  "Corporate & SMEs",
  "Events & Exhibitions",
  "Hotels & Restaurants",
  "Education",
  "NGOs",
  "Government & Public Sector",
  "Creators & Agencies",
];

const missionPoints = [
  "Deliver end-to-end, one-stop printing solutions—from creative concept building to finished product—across every major category of print and signage.",
  "Lead with latest technologies to ensure consistent, quality-guaranteed output at competitive pricing.",
  "Offer unique products & services that help businesses and creators stand out, with rapid turnaround and reliable island-wide fulfillment.",
  "Build a best-in-class online experience that makes ordering simple, transparent, and fast, backed by responsive human support across our physical shop network.",
  "Earn lifelong customer satisfaction through accuracy, accountability, and continuous improvement—setting the benchmark as Sri Lanka's leading solution provider in print.",
  "Grow a recognizable, loved, and iconic brand while scaling the largest physical printing shop chain in the country.",
];

export default function AboutFullPage() {
  return (
    <main className="min-h-screen bg-white">
      <section className="border-b border-gray-200 bg-gray-50 px-4 py-8">
        <div className="mx-auto max-w-3xl">
          <Link href="/about" className="text-brand-red hover:underline">
            ← Back to About
          </Link>
        </div>
      </section>

      {/* Hero */}
      <section className="border-b border-gray-200 bg-gray-50 px-4 py-16 sm:py-20 md:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
            About <span className="text-brand-red">Print Works.LK</span>
          </h1>
          <p className="mt-4 text-lg text-muted sm:text-xl">
            Our story, mission, and why brands choose us.
          </p>
        </div>
      </section>

      {/* Vision */}
      <section className="px-4 py-14 sm:py-18 md:py-20">
        <FadeInSection>
          <div className="mx-auto max-w-3xl">
            <h2 className="text-2xl font-bold text-brand-red sm:text-3xl">Vision</h2>
            <p className="mt-4 text-gray-700 leading-relaxed">
              To be Sri Lanka&apos;s most trusted and innovative online printing platform—an iconic, island-wide brand that unites the country&apos;s largest physical print shop network with seamless e-commerce to deliver total printing solutions, anywhere, anytime.
            </p>
          </div>
        </FadeInSection>
      </section>

      {/* Origin Story + Image */}
      <section className="border-t border-gray-100 bg-gray-50 px-4 py-14 sm:py-18 md:py-20">
        <FadeInSection>
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-10 md:grid-cols-2 md:items-center md:gap-14">
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-gray-200">
                <Image
                  src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&q=80"
                  alt="Printing workshop"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-brand-red sm:text-3xl">Our Origin Story</h2>
                <p className="mt-4 text-gray-700 leading-relaxed">
                  Every great brand begins with a sketch—sometimes on paper, sometimes in the mind. Ours began in 2014 as Attract Wear & Printing Solutions, a small screen-printing and clothing brand with big curiosity. We learned fast that ink can do more than mark fabric; it can carry identity.
                </p>
                <p className="mt-4 text-gray-700 leading-relaxed">
                  By 2018, that curiosity grew muscle. We launched SafetySign.lk, stepping into the rigorous world of industrial environment, occupational health & safety signage. SOP design and printing, and content for compliance, sustainability, quality assurance, and 5S. We weren&apos;t just printing; we were helping factories and brands show what they stand for.
                </p>
                <p className="mt-4 text-gray-700 leading-relaxed">
                  Then came 2020—a year of reinvention. We opened a new chapter with PrintWorks.lk, shifting from &quot;just printing&quot; to customised promotional and branding solutions. The idea was simple: make it effortless for anyone in Sri Lanka to turn a concept into something you can hold, mount, gift, wear, or illuminate—and do it online-to-offline, island-wide.
                </p>
              </div>
            </div>
          </div>
        </FadeInSection>
      </section>

      {/* What We Make */}
      <section className="px-4 py-14 sm:py-18 md:py-20">
        <FadeInSection>
          <div className="mx-auto max-w-3xl">
            <h2 className="text-2xl font-bold text-brand-red sm:text-3xl">What We Make (and Why It Matters)</h2>
            <p className="mt-4 text-gray-700 leading-relaxed">
              We specialise in projects that don&apos;t fit the template—the one-off prototype, the unusual material, the showpiece detail. Think:
            </p>
            <ul className="mt-6 space-y-2">
              {services.map((item, i) => (
                <li key={i} className="flex gap-2 text-gray-700">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-red" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </FadeInSection>
      </section>

      {/* Who We Serve + Image */}
      <section className="border-t border-gray-100 bg-gray-50 px-4 py-14 sm:py-18 md:py-20">
        <FadeInSection>
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-10 md:grid-cols-2 md:items-start md:gap-14">
              <div>
                <h2 className="text-2xl font-bold text-brand-red sm:text-3xl">Who We Serve</h2>
                <p className="mt-4 text-gray-700 leading-relaxed">
                  Retail • Corporate & SMEs • Events & Exhibitions • Hotels & Restaurants • Education • NGOs • Government & Public Sector • Creators & Agencies.
                </p>
                <p className="mt-4 text-gray-700 leading-relaxed">
                  Most of our work is bespoke—unique projects where material, finish, and craft matter.
                </p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {whoWeServe.map((s) => (
                    <span
                      key={s}
                      className="rounded-full bg-white px-3 py-1.5 text-sm font-medium text-nav-dark shadow-sm border border-gray-200"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-gray-200">
                <Image
                  src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&q=80"
                  alt="Design and print collaboration"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </div>
          </div>
        </FadeInSection>
      </section>

      {/* What We Don't Do */}
      <section className="px-4 py-14 sm:py-18 md:py-20">
        <FadeInSection>
          <div className="mx-auto max-w-3xl">
            <h2 className="text-2xl font-bold text-brand-red sm:text-3xl">What We Don&apos;t Do</h2>
            <p className="mt-4 text-gray-700 leading-relaxed">
              We don&apos;t take on FMCG product labelling, book & magazine printing, or bulk quantities of common paper-based printing. That&apos;s deliberate. We stay focused on customised, value-adding work where creativity and precision shine.
            </p>
          </div>
        </FadeInSection>
      </section>

      {/* Inside the Workshop + Image */}
      <section className="border-t border-gray-100 bg-gray-50 px-4 py-14 sm:py-18 md:py-20">
        <FadeInSection>
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-10 md:grid-cols-2 md:items-center md:gap-14">
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-gray-200 order-2 md:order-1">
                <Image
                  src="https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=800&q=80"
                  alt="Print workshop equipment"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <div className="order-1 md:order-2">
                <h2 className="text-2xl font-bold text-brand-red sm:text-3xl">Inside the Workshop (All In-House, End to End)</h2>
                <p className="mt-4 text-gray-700 leading-relaxed">
                  If you peek behind the website, you&apos;ll find a full production ecosystem under one roof:
                </p>
                <ul className="mt-4 space-y-2 text-gray-700">
                  <li className="flex gap-2">
                    <span className="text-brand-red">•</span>
                    UV, digital, laser, inkjet, thermal & screen printing
                  </li>
                  <li className="flex gap-2">
                    <span className="text-brand-red">•</span>
                    Sticker cutting & plotting
                  </li>
                  <li className="flex gap-2">
                    <span className="text-brand-red">•</span>
                    In-house workshop for painting, welding & iron works, and carpentry
                  </li>
                  <li className="flex gap-2">
                    <span className="text-brand-red">•</span>
                    In-house design studio for concept, artwork development, and pre-press
                  </li>
                </ul>
                <p className="mt-4 text-gray-700 leading-relaxed">
                  Owning the stack means speed, control, and consistency. Your brief doesn&apos;t bounce around; it flows—from concept to craft to quality check to delivery.
                </p>
              </div>
            </div>
          </div>
        </FadeInSection>
      </section>

      {/* The People */}
      <section className="px-4 py-14 sm:py-18 md:py-20">
        <FadeInSection>
          <div className="mx-auto max-w-3xl">
            <h2 className="text-2xl font-bold text-brand-red sm:text-3xl">The People Behind the Prints</h2>
            <div className="mt-8 rounded-2xl border border-gray-200 bg-gray-50 p-6 sm:p-8">
              <h3 className="text-xl font-semibold text-gray-900">Sandaruwan Dharmapriya — Founder & CEO</h3>
              <p className="mt-4 text-gray-700 leading-relaxed">
                He started at a very young age and never stopped building. A hands-on practitioner across design, printing, advertising, and digital marketing, Sandaruwan is deeply passionate about creative concept building, project management, and planning. Today he leads a young, inventive team that turns sketches into showpieces—sweating details, guarding timelines, and delivering work that feels as good as it looks.
              </p>
            </div>
          </div>
        </FadeInSection>
      </section>

      {/* Why Brands Choose Us */}
      <section className="border-t border-gray-100 bg-gray-50 px-4 py-14 sm:py-18 md:py-20">
        <FadeInSection>
          <div className="mx-auto max-w-3xl">
            <h2 className="text-2xl font-bold text-brand-red sm:text-3xl">Why Brands Choose Us</h2>
            <p className="mt-4 text-lg text-gray-700 leading-relaxed">
              Because we make ordering feel easy and results feel premium. We&apos;re building Sri Lanka&apos;s best online printing experience backed by a growing physical shop network. We deliver island-wide with quality guaranteed and competitive pricing. And we&apos;re relentless about the little things—materials, edges, finishes, and timelines—the things your audience notices, even if they don&apos;t know why.
            </p>
          </div>
        </FadeInSection>
      </section>

      {/* Mission */}
      <section className="px-4 py-14 sm:py-18 md:py-20">
        <FadeInSection>
          <div className="mx-auto max-w-3xl">
            <h2 className="text-2xl font-bold text-brand-red sm:text-3xl">Mission</h2>
            <ul className="mt-6 space-y-4">
              {missionPoints.map((point, i) => (
                <li key={i} className="flex gap-3 text-gray-700">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-red/10 text-sm font-semibold text-brand-red">
                    {i + 1}
                  </span>
                  <span className="leading-relaxed">{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </FadeInSection>
      </section>

      {/* CTA */}
      <section className="border-t border-gray-200 bg-brand-red px-4 py-14 sm:py-18">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">Ready to start your project?</h2>
          <p className="mt-2 text-white/90">
            Turn your concept into something you can hold, mount, gift, or illuminate.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/quote"
              className="inline-flex items-center rounded-xl bg-white px-6 py-3.5 font-semibold text-brand-red transition hover:bg-gray-100"
            >
              Request a Quote
            </Link>
            <Link
              href="/products"
              className="inline-flex items-center rounded-xl border-2 border-white px-6 py-3.5 font-semibold text-white transition hover:bg-white hover:text-brand-red"
            >
              Explore Products
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
