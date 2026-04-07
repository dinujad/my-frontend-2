"use client";
// Client Component — must stay "use client" because it uses:
//   • gsap + ScrollTrigger — GSAP scroll animations require window.scrollY / IntersectionObserver,
//                            both browser-only APIs that do not exist on the server
//   • useRef               — holds DOM element references for GSAP to animate
//   • useEffect            — registers scroll-driven animations after mount
// The entire visual experience of the About page is scroll-animated, so the whole component
// must run in the browser. The page wrapper (app/about/page.tsx) remains a Server Component
// for metadata and initial HTML shell.

import Image from "next/image";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const PARALLAX_IMAGES = {
  grid1: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=1000",
  grid2: "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?q=80&w=1000",
  grid3: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=1000",
  slab: "https://images.unsplash.com/photo-1596495578065-6e0763fa1178?q=80&w=2000",
  dual1: "https://images.unsplash.com/photo-1510074377623-8cf13fb86c08?q=80&w=1000",
  dual2: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?q=80&w=1000",
};

export function AboutGSAPScroll() {
  const mainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Text container parallax (vision)
      const visionTexts = gsap.utils.toArray<HTMLElement>(".vision-text");
      visionTexts.forEach((el, i) => {
        const speed = parseFloat(el.dataset.speed || "1");
        gsap.to(el, {
          yPercent: (1 - speed) * -200,
          ease: "none",
          scrollTrigger: {
            trigger: ".vision-container",
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
        });
      });

      // 2. Image Grid Parallax
      const gridImgs = gsap.utils.toArray<HTMLElement>(".grid-parallax");
      gridImgs.forEach((el) => {
        const speed = parseFloat(el.dataset.speed || "1");
        // Images should start a bit lower/higher so they don't tear margins
        gsap.to(el, {
          yPercent: (speed - 1) * -30,
          ease: "none",
          scrollTrigger: {
            trigger: ".image-grid",
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
      });

      // 3. Bars Parallax
      const bars = gsap.utils.toArray<HTMLElement>(".service-bar");
      bars.forEach((el) => {
        const speed = parseFloat(el.dataset.speed || "1");
        gsap.fromTo(el,
          { height: "10%" },
          {
            height: `${speed * 80}%`, // Vary ending height based on speed
            ease: "none",
            scrollTrigger: {
              trigger: ".bars-container",
              start: "top 80%",
              end: "bottom 50%",
              scrub: 1,
            },
          }
        );
      });

      // 4. Parallax Slab
      gsap.to(".slab-img", {
        yPercent: -20,
        ease: "none",
        scrollTrigger: {
          trigger: ".parallax-slab",
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });

      // 5. Dual Parallax Images
      const dualImgs = gsap.utils.toArray<HTMLElement>(".dual-parallax-img");
      dualImgs.forEach((el) => {
        gsap.to(el, {
          yPercent: -20,
          ease: "none",
          scrollTrigger: {
            trigger: el.parentElement,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
      });

      // Stagger Text Simple
      const staggerChars = gsap.utils.toArray<HTMLElement>(".stagger-char");
      if (staggerChars.length > 0) {
        gsap.fromTo(staggerChars,
          { opacity: 0.2, y: 20 },
          {
            opacity: 1,
            y: 0,
            stagger: 0.1,
            scrollTrigger: {
              trigger: ".stagger-container",
              start: "top 70%",
              end: "bottom 40%",
              scrub: 1
            }
          }
        );
      }

    }, mainRef);

    return () => ctx.revert();
  }, []);

  const staggerWord = "Crafting";

  return (
    <div ref={mainRef} className="bg-gray-50 text-gray-900 font-sans min-h-screen overflow-hidden selection:bg-brand-red selection:text-white">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 w-full pb-32">

        {/* Intro Section */}
        <div className="pt-32 pb-20 text-center max-w-4xl mx-auto">
          <p className="text-brand-red font-bold uppercase tracking-widest text-sm mb-4">About Us</p>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-tight mb-6">
            PrintWorks<span className="text-brand-red">.lk</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 font-medium">
            Our story, mission, and why brands choose us.
          </p>
        </div>

        {/* Vision Scrolling Text */}
        <div className="vision-container relative h-[60vh] flex items-center justify-center -mt-20 overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-7xl mx-auto flex items-center justify-center pointer-events-none">
            <div className="relative text-center w-full">
              {/* Layered texts for parallax effect */}
              {/* Back to Front */}
              {[0.7, 0.75, 0.8, 0.85, 0.9, 0.95, 1].map((speed, i, arr) => {
                const isLast = i === arr.length - 1;
                return (
                  <p
                    key={speed}
                    data-speed={speed}
                    className={`vision-text absolute top-0 left-0 right-0 text-center uppercase font-black text-[clamp(3rem,12vw,10rem)] leading-none ${isLast ? 'text-gray-900' : 'text-transparent'}`}
                    style={!isLast ? { WebkitTextStroke: "1px rgba(0,0,0,0.1)" } : {}}
                  >
                    Vision
                  </p>
                );
              })}
            </div>
          </div>
          <div className="relative z-10 max-w-3xl mx-auto text-center px-4 mt-32 bg-white/60 backdrop-blur-sm p-8 rounded-2xl border border-white/50 shadow-xl">
            <p className="text-lg md:text-2xl text-gray-800 font-semibold leading-relaxed">
              To be Sri Lanka&apos;s most trusted and innovative online printing platform—an iconic, island-wide brand that unites the country&apos;s largest physical print shop network with seamless e-commerce to deliver total printing solutions, anywhere, anytime.
            </p>
          </div>
        </div>

        {/* Image Grid Parallax & Origin Story */}
        <section className="mt-32 pt-20 border-t border-gray-200">
          <div className="mb-16 text-center max-w-3xl mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Our <span className="text-brand-red">Origin Story</span></h2>
            <p className="text-gray-600 text-lg mb-4">
              Every great brand begins with a sketch—sometimes on paper, sometimes in the mind. Ours began in 2014 as Attract Wear & Printing Solutions, a small screen-printing and clothing brand with big curiosity. We learned fast that ink can do more than mark fabric; it can carry identity.
            </p>
            <p className="text-gray-600 text-lg mb-4">
              By 2018, that curiosity grew muscle. We launched SafetySign.lk, stepping into the rigorous world of industrial environment, occupational health & safety signage, SOP design, and 5S. We weren&apos;t just printing; we were helping factories and brands show what they stand for.
            </p>
            <p className="text-gray-600 text-lg">
              Then came 2020—a year of reinvention. We opened a new chapter with PrintWorks.lk, shifting from &quot;just printing&quot; to customised promotional and branding solutions. The idea was simple: make it effortless for anyone in Sri Lanka to turn a concept into something you can hold, mount, gift, wear, or illuminate.
            </p>
          </div>

          <div className="image-grid w-full max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 h-[80vh] min-h-[600px] mb-32 px-4">
            <div className="relative overflow-hidden rounded-2xl h-[60%] md:mt-24 shadow-lg">
              <Image
                src={PARALLAX_IMAGES.grid1}
                alt="Printing"
                fill
                className="grid-parallax object-cover scale-[1.2] origin-top"
                data-speed="1.2"
              />
            </div>
            <div className="relative overflow-hidden rounded-2xl h-[70%] shadow-lg">
              <Image
                src={PARALLAX_IMAGES.grid2}
                alt="Signage"
                fill
                className="grid-parallax object-cover scale-[1.2] origin-center"
                data-speed="1.5"
              />
            </div>
            <div className="relative overflow-hidden rounded-2xl h-[50%] md:mt-48 shadow-lg">
              <Image
                src={PARALLAX_IMAGES.grid3}
                alt="Custom Promo"
                fill
                className="grid-parallax object-cover scale-[1.2] origin-bottom"
                data-speed="0.8"
              />
            </div>
          </div>
        </section>

        {/* Title Container (What we make) */}
        <section className="min-h-[40vh] flex flex-col items-center justify-center text-center px-4 mb-20">
          <h2 className="text-4xl md:text-6xl font-black tracking-tight mb-8">
            <span className="font-normal text-gray-400 block text-2xl mb-2">Bespoke By Nature</span>
            What We Make<br />
            <span className="text-brand-red">(and Why It Matters)</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We specialise in projects that don&apos;t fit the template—the one-off prototype, the unusual material, the showpiece detail.
          </p>
        </section>

        {/* Bars Container (Services) */}
        <section className="bars-container grid grid-cols-1 lg:grid-cols-2 gap-16 min-h-[60vh] px-4 items-end mb-32">
          <div className="flex flex-col justify-center h-full max-w-xl self-center border-l-4 border-brand-red pl-8 py-4">
            <h3 className="text-3xl font-bold mb-4">Our Services</h3>
            <ul className="space-y-3 text-lg text-gray-700">
              <li>• <strong>Digital & UV Printing</strong> on acrylic, wood, metal</li>
              <li>• <strong>Laser Cutting & Engraving</strong> (brass, stainless steel)</li>
              <li>• <strong>PVC Card Printing</strong> & Paper-based Printing</li>
              <li>• Custom Acrylic Products & Signage Boards</li>
              <li>• Promotional, Tags, Badges & Decals</li>
            </ul>
            <div className="mt-8 p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
              <h4 className="font-bold text-gray-900 mb-2">What we don&apos;t do</h4>
              <p className="text-gray-600 text-sm">We don&apos;t take on FMCG product labelling, book & magazine printing, or bulk quantities of common paper-based printing. That&apos;s deliberate. We stay focused on customised, value-adding work where creativity and precision shine.</p>
            </div>
          </div>

          {/* Animated Bars */}
          <div className="flex items-end justify-center gap-4 h-[500px] w-full bg-white rounded-3xl border border-gray-100 p-8 shadow-inner overflow-hidden">
            {[0.8, 0.9, 1.0, 1.1, 1.2].map((speed, i) => (
              <div
                key={speed}
                data-speed={speed}
                className="service-bar w-16 md:w-20 bg-gradient-to-t from-brand-red to-brand-red-dark rounded-t-xl flex flex-col items-center justify-start pt-4 text-white font-bold opacity-90 shadow-lg"
              >
                <span>{speed}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Parallax Slab */}
        <section className="parallax-slab relative h-[500px] md:h-[700px] w-full overflow-hidden rounded-3xl shadow-2xl mb-32 mx-4 max-w-[calc(100%-2rem)]">
          <div className="absolute inset-0 w-full h-[150%] -top-[25%] pointer-events-none">
            <Image
              src={PARALLAX_IMAGES.slab}
              alt="Workshop space"
              fill
              className="slab-img object-cover object-bottom"
            />
          </div>
          <div className="absolute inset-0 bg-gray-900/60 mix-blend-multiply" />
          <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-16 max-w-4xl">
            <h2 className="text-4xl md:text-6xl font-black text-white mb-6">Inside the Workshop<br />(All In-House, End to End)</h2>
            <p className="text-xl text-gray-200 mb-4 max-w-2xl">
              If you peek behind the website, you&apos;ll find a full production ecosystem under one roof: UV, digital, laser, inkjet, thermal & screen printing. Sticker cutting & plotting. In-house workshop for painting, welding, and carpentry.
            </p>
            <p className="text-xl text-brand-red font-bold">
              Owning the stack means speed, control, and consistency. Your brief doesn&apos;t bounce around; it flows.
            </p>
          </div>
        </section>

        {/* Staggered text (Founder Quote) */}
        <section className="stagger-container min-h-[40vh] flex flex-col items-center justify-center text-center px-4 mb-32">
          <div className="max-w-4xl mx-auto">
            <p className="text-brand-red font-bold uppercase tracking-widest text-sm mb-8">The People Behind the Prints</p>
            <h3 className="text-3xl md:text-5xl font-black text-gray-900 leading-tight">
              {staggerWord.split("").map((char, i) => (
                <span key={i} className="stagger-char inline-block" style={{ minWidth: char === ' ' ? '0.5em' : 'auto' }}>{char}</span>
              ))}
              {" details,"}<br />
              guarding timelines,<br />
              and delivering work that feels as good as it looks.
            </h3>
            <div className="mt-12">
              <p className="text-xl font-bold">Sandaruwan Dharmapriya</p>
              <p className="text-gray-500">Founder & CEO</p>
            </div>
          </div>
        </section>

        {/* Parallax Images Dual & Mission */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-16 px-4 mb-20 items-center">
          <div className="flex flex-col gap-12 order-2 lg:order-1">
            <div>
              <h2 className="text-3xl font-bold mb-4">Why Brands Choose Us</h2>
              <p className="text-gray-600 text-lg">
                Because we make ordering feel easy and results feel premium. We&apos;re building Sri Lanka&apos;s best online printing experience backed by a growing physical shop network. We deliver island-wide with quality guaranteed and competitive pricing. And we&apos;re relentless about the little things—materials, edges, finishes, and timelines.
              </p>
            </div>

            <div>
              <h2 className="text-3xl font-bold mb-4 text-brand-red">Our Mission</h2>
              <ul className="space-y-4 text-gray-700">
                <li className="flex gap-3"><span className="text-brand-red font-bold">01.</span> Deliver end-to-end, one-stop printing solutions across every major category.</li>
                <li className="flex gap-3"><span className="text-brand-red font-bold">02.</span> Lead with latest technologies to ensure consistent, quality-guaranteed output.</li>
                <li className="flex gap-3"><span className="text-brand-red font-bold">03.</span> Offer unique products & services that help businesses stand out, with rapid turnaround.</li>
                <li className="flex gap-3"><span className="text-brand-red font-bold">04.</span> Build a best-in-class online experience backed by responsive human support.</li>
                <li className="flex gap-3"><span className="text-brand-red font-bold">05.</span> Earn lifelong customer satisfaction through accuracy and accountability.</li>
              </ul>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 order-1 lg:order-2">
            <div className="relative h-[600px] rounded-3xl overflow-hidden mt-20 shadow-xl">
              <Image
                src={PARALLAX_IMAGES.dual1}
                alt="Corporate"
                fill
                className="dual-parallax-img object-cover scale-[1.3]"
              />
            </div>
            <div className="relative h-[600px] rounded-3xl overflow-hidden shadow-xl">
              <Image
                src={PARALLAX_IMAGES.dual2}
                alt="Delivery"
                fill
                className="dual-parallax-img object-cover scale-[1.3]"
              />
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
