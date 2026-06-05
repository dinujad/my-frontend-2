"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { AboutVectorDecor } from "@/components/about/AboutVectorDecor";

gsap.registerPlugin(ScrollTrigger);

const PARALLAX_IMAGES = {
  grid1: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=800",
  grid2: "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?q=80&w=800",
  grid3: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=800",
  slab: "https://images.unsplash.com/photo-1596495578065-6e0763fa1178?q=80&w=1600",
};

const SERVICES = [
  "Digital Printing (including specialty and large format)",
  "UV Printing on acrylic, wood, metal, glass, ceramic & more",
  "Laser Cutting & Engraving (acrylic, plywood, MDF, stainless steel, brass)",
  "PVC Card Printing (ID cards, badges, key tags, tokens)",
  "Paper-based Printing for bespoke, small batches",
  "Custom Acrylic Products & Creations",
  "Stainless Steel & Brass Engraving",
  "Sticker Printing & Cutting (brand decals, short-run product labels)",
  "Signage Boards (retail, corporate, safety, wayfinding)",
  "Tags & Badges, Graphic Designing, and Promotional & Gift Items",
];

const MISSION = [
  "Deliver end-to-end, one-stop printing solutions—from creative concept building to finished product—across every major category of print and signage.",
  "Lead with latest technologies to ensure consistent, quality-guaranteed output at competitive pricing.",
  "Offer unique products & services that help businesses and creators stand out, with rapid turnaround and reliable island-wide fulfillment.",
  "Build a best-in-class online experience that makes ordering simple, transparent, and fast, backed by responsive human support across our physical shop network.",
  "Earn lifelong customer satisfaction through accuracy, accountability, and continuous improvement—setting the benchmark as Sri Lanka's leading solution provider in print.",
  "Grow a recognizable, loved, and iconic brand while scaling the largest physical printing shop chain in the country.",
];

export function AboutGSAPScroll() {
  const mainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".about-vector-float").forEach((el, i) => {
        gsap.to(el, {
          y: "+=14",
          duration: 2.8 + (i % 3) * 0.4,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      });

      gsap.utils.toArray<HTMLElement>(".about-vector-float-delay").forEach((el, i) => {
        gsap.to(el, {
          y: "-=12",
          x: "+=6",
          duration: 3.2 + i * 0.2,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      });

      gsap.utils.toArray<HTMLElement>(".about-vector-spin").forEach((el) => {
        gsap.to(el, { rotation: 360, duration: 24, repeat: -1, ease: "none", transformOrigin: "50% 50%" });
      });

      gsap.utils.toArray<HTMLElement>(".about-vector-pulse").forEach((el) => {
        gsap.to(el, {
          scaleX: 1.08,
          opacity: 0.45,
          duration: 1.6,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          transformOrigin: "left center",
        });
      });

      gsap.utils.toArray<HTMLElement>(".about-vector-draw").forEach((el) => {
        gsap.to(el, {
          strokeDashoffset: 0,
          duration: 2.5,
          ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
        });
      });

      gsap.utils.toArray<HTMLElement>(".about-reveal").forEach((el) => {
        gsap.fromTo(
          el,
          { y: 36, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 88%", once: true },
          }
        );
      });

      gsap.utils.toArray<HTMLElement>(".grid-parallax").forEach((el) => {
        const speed = parseFloat(el.dataset.speed || "1");
        gsap.to(el, {
          yPercent: (speed - 1) * -20,
          ease: "none",
          scrollTrigger: {
            trigger: el.closest(".origin-gallery") ?? el,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
      });

      gsap.to(".slab-img", {
        yPercent: -12,
        ease: "none",
        scrollTrigger: {
          trigger: ".parallax-slab",
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });

      const staggerChars = gsap.utils.toArray<HTMLElement>(".stagger-char");
      if (staggerChars.length > 0) {
        gsap.fromTo(
          staggerChars,
          { opacity: 0.25, y: 16 },
          {
            opacity: 1,
            y: 0,
            stagger: 0.08,
            scrollTrigger: {
              trigger: ".stagger-container",
              start: "top 75%",
              end: "bottom 50%",
              scrub: 1,
            },
          }
        );
      }
    }, mainRef);

    return () => ctx.revert();
  }, []);

  const staggerWord = "Crafting";

  return (
    <div
      ref={mainRef}
      className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[#fdf2f4] via-gray-50 to-white font-sans text-gray-900 selection:bg-brand-red selection:text-white"
    >
      <div className="mx-auto w-full max-w-6xl px-4 pb-20 sm:px-6 lg:px-8 lg:pb-24">
        {/* Hero — balanced with side vectors */}
        <section className="about-reveal relative pt-24 pb-12 md:pt-28 md:pb-16">
          <AboutVectorDecor variant="hero" />
          <div className="relative z-10 mx-auto max-w-3xl text-center">
            <p className="mb-3 text-sm font-bold uppercase tracking-widest text-brand-red">About Us</p>
            <h1 className="mb-4 text-4xl font-black leading-tight tracking-tighter md:text-6xl lg:text-7xl">
              PrintWorks<span className="text-brand-red">.lk</span>
            </h1>
            <p className="text-lg font-medium text-gray-600 md:text-xl">
              Our story, mission, and why brands choose us.
            </p>
          </div>
        </section>

        {/* Vision — compact, no giant empty parallax text */}
        <section className="about-reveal relative mb-14 md:mb-16">
          <div className="grid items-center gap-8 lg:grid-cols-[1fr_1.1fr] lg:gap-10">
            <div className="relative hidden min-h-[280px] lg:block">
              <AboutVectorDecor variant="side-left" className="absolute inset-0" />
            </div>
            <div className="rounded-2xl border border-white/80 bg-white/90 p-6 shadow-lg shadow-gray-200/50 backdrop-blur-sm md:p-8">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-red">Vision</p>
              <p className="mt-3 text-base leading-relaxed text-gray-800 md:text-lg">
                To be Sri Lanka&apos;s most trusted and innovative online printing platform—an iconic, island-wide brand
                that unites the country&apos;s largest physical print shop network with seamless e-commerce to deliver
                total printing solutions, anywhere, anytime.
              </p>
            </div>
          </div>
        </section>

        {/* Origin — 2-col balanced: text + images */}
        <section className="about-reveal mb-14 border-t border-gray-200/80 pt-12 md:mb-16 md:pt-14">
          <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-12">
            <div>
              <h2 className="text-2xl font-bold md:text-3xl">
                Our <span className="text-brand-red">Origin Story</span>
              </h2>
              <div className="mt-5 space-y-4 text-base leading-relaxed text-gray-600 md:text-[17px]">
                <p>
                  Every great brand begins with a sketch—sometimes on paper, sometimes in the mind. Ours began in 2014
                  as Attract Wear & Printing Solutions, a small screen-printing and clothing outfit with big curiosity.
                  We learned fast that ink can do more than mark fabric; it can carry identity.
                </p>
                <p>
                  By 2018, that curiosity grew muscle. We launched SafetySign.lk, stepping into the rigorous world of
                  industrial and OHS signage—SOP design and printing, and content for compliance, sustainability, quality
                  assurance, and 5S. We weren&apos;t just printing; we were helping factories and brands show what they
                  stand for.
                </p>
                <p>
                  Then came 2020—a year of reinvention. We opened a new chapter with PrintWorks.lk, shifting from
                  &quot;just printing&quot; to customised promotional and branding solutions—online-to-offline,
                  island-wide.
                </p>
              </div>
            </div>

            <div className="origin-gallery grid grid-cols-2 gap-3 md:gap-4">
              <div className="relative col-span-2 aspect-[16/9] overflow-hidden rounded-2xl shadow-md">
                <Image src={PARALLAX_IMAGES.grid1} alt="Printing workshop" fill className="grid-parallax object-cover" data-speed="1.1" sizes="(max-width: 1024px) 100vw, 50vw" />
              </div>
              <div className="relative aspect-[4/5] overflow-hidden rounded-2xl shadow-md">
                <Image src={PARALLAX_IMAGES.grid2} alt="Signage production" fill className="grid-parallax object-cover" data-speed="1.2" sizes="25vw" />
              </div>
              <div className="relative aspect-[4/5] overflow-hidden rounded-2xl shadow-md">
                <Image src={PARALLAX_IMAGES.grid3} alt="Custom promotional items" fill className="grid-parallax object-cover" data-speed="0.9" sizes="25vw" />
              </div>
            </div>
          </div>
        </section>

        {/* What we make + services wheel vector */}
        <section className="about-reveal mb-14 md:mb-16">
          <div className="mb-8 text-center lg:mb-10">
            <p className="text-sm font-normal text-gray-400">Bespoke By Nature</p>
            <h2 className="mt-1 text-3xl font-black tracking-tight md:text-4xl">
              What We Make <span className="text-brand-red">(and Why It Matters)</span>
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-gray-600">
              We specialise in projects that don&apos;t fit the template—the one-off prototype, the unusual material,
              the showpiece detail.
            </p>
          </div>

          <div className="grid items-center gap-8 lg:grid-cols-[1fr_340px] xl:grid-cols-[1.2fr_360px]">
            <ul className="grid gap-2 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-2.5">
              {SERVICES.map((item) => (
                <li key={item} className="flex gap-2 text-sm leading-snug text-gray-700 md:text-[15px]">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-red" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <AboutVectorDecor variant="services" className="mx-auto w-full max-w-[320px] lg:max-w-none" />
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <h4 className="font-bold text-gray-900">Who we serve</h4>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">
                Retail • Corporate & SMEs • Events & Exhibitions • Hospitality & Restaurants • Education • NGOs •
                Government & Public Sector • Creators & Agencies. Most of our work is bespoke—unique projects where
                material, finish, and craft matter.
              </p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <h4 className="font-bold text-gray-900">What we don&apos;t do</h4>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">
                We don&apos;t take on FMCG product labelling, book & magazine printing, or bulk quantities of common
                paper-based printing. We stay focused on customised, value-adding work where creativity and precision
                shine.
              </p>
            </div>
          </div>
        </section>

        {/* Workshop slab — full width, vectors overlay */}
        <section className="about-reveal parallax-slab relative mb-14 h-[380px] overflow-hidden rounded-2xl shadow-xl md:mb-16 md:h-[460px] md:rounded-3xl">
          <div className="pointer-events-none absolute inset-0 h-[130%] -top-[15%]">
            <Image src={PARALLAX_IMAGES.slab} alt="Workshop space" fill className="slab-img object-cover object-center" sizes="100vw" />
          </div>
          <AboutVectorDecor variant="workshop" />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-950/85 via-gray-900/70 to-gray-900/50" />
          <div className="relative flex h-full flex-col justify-center px-6 md:px-10 lg:max-w-2xl lg:px-12">
            <h2 className="text-2xl font-black text-white md:text-4xl">
              Inside the Workshop
              <span className="mt-1 block text-lg font-bold text-brand-red md:text-xl">(All In-House, End to End)</span>
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-gray-200 md:text-base">
              UV, digital, laser, inkjet, thermal & screen printing; sticker cutting & plotting; painting, welding &
              iron works, carpentry; and an in-house design studio for concept, artwork, and pre-press—all under one roof.
            </p>
            <p className="mt-3 text-sm font-bold text-brand-red md:text-base">
              Owning the stack means speed, control, and consistency. Your brief flows—from concept to craft to delivery.
            </p>
          </div>
        </section>

        {/* Founder — balanced 2-col with vector portrait */}
        <section className="about-reveal stagger-container mb-14 md:mb-16">
          <div className="grid items-center gap-10 lg:grid-cols-[280px_1fr] xl:grid-cols-[320px_1fr]">
            <AboutVectorDecor variant="founder" className="hidden lg:block" />
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-brand-red">The People Behind the Prints</p>
              <h3 className="mt-3 text-2xl font-black leading-tight text-gray-900 md:text-4xl">
                {staggerWord.split("").map((char, i) => (
                  <span key={i} className="stagger-char inline-block" style={{ minWidth: char === " " ? "0.5em" : "auto" }}>
                    {char}
                  </span>
                ))}
                {" details, guarding timelines, and delivering work that feels as good as it looks."}
              </h3>
              <p className="mt-5 text-base leading-relaxed text-gray-600">
                He started at a very young age and never stopped building. A hands-on practitioner across design,
                printing, advertising, and digital marketing, Sandaruwan is deeply passionate about creative concept
                building, project management, and planning. Today he leads a young, inventive team that turns sketches
                into showpieces.
              </p>
              <p className="mt-4 text-lg font-bold text-gray-900">Sandaruwan Dharmapriya</p>
              <p className="text-gray-500">Founder & CEO</p>
            </div>
          </div>
        </section>

        {/* Mission + why choose — 2-col balanced with right vector */}
        <section className="about-reveal mb-10">
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-12">
            <div>
              <h2 className="text-2xl font-bold md:text-3xl">Why Brands Choose Us</h2>
              <p className="mt-4 text-base leading-relaxed text-gray-600">
                Because we make ordering feel easy and results feel premium. We&apos;re building Sri Lanka&apos;s best
                online printing experience backed by a growing physical shop network. We deliver island-wide with quality
                guaranteed and competitive pricing—and we&apos;re relentless about materials, edges, finishes, and
                timelines.
              </p>

              <h2 className="mt-8 text-2xl font-bold text-brand-red md:text-3xl">Our Mission</h2>
              <ul className="mt-4 space-y-3">
                {MISSION.map((point, i) => (
                  <li key={i} className="flex gap-3 text-sm leading-relaxed text-gray-700 md:text-[15px]">
                    <span className="shrink-0 font-bold text-brand-red">{String(i + 1).padStart(2, "0")}.</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="relative hidden items-center justify-center lg:flex">
              <AboutVectorDecor variant="side-right" className="w-full max-w-sm" />
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="about-reveal rounded-2xl bg-brand-red px-6 py-10 text-center md:rounded-3xl md:px-10">
          <h2 className="text-2xl font-bold text-white md:text-3xl">Ready to start your project?</h2>
          <p className="mt-2 text-white/90">Turn your concept into something you can hold, mount, gift, or illuminate.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href="/quote"
              className="inline-flex items-center rounded-xl bg-white px-6 py-3 font-semibold text-brand-red transition hover:bg-gray-100"
            >
              Request a Quote
            </Link>
            <Link
              href="/products"
              className="inline-flex items-center rounded-xl border-2 border-white px-6 py-3 font-semibold text-white transition hover:bg-white hover:text-brand-red"
            >
              Explore Products
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
