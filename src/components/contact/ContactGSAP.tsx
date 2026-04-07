"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ContactForm } from "@/components/contact/ContactForm";
import { ContactMap } from "@/components/contact/ContactMap";

gsap.registerPlugin(ScrollTrigger);

export function ContactGSAP() {
    const containerRef = useRef<HTMLDivElement>(null);
    const heroSubtitleRef = useRef<HTMLSpanElement>(null);
    const heroTitleRef = useRef<HTMLHeadingElement>(null);
    const heroDescRef = useRef<HTMLParagraphElement>(null);

    const formCardRef = useRef<HTMLDivElement>(null);
    const infoCardRef = useRef<HTMLDivElement>(null);
    const mapSectionRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // 1. Hero Animations - Staggered entrance
            const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

            tl.fromTo(
                heroSubtitleRef.current,
                { y: 30, opacity: 0 },
                { y: 0, opacity: 1, duration: 1 }
            )
                .fromTo(
                    heroTitleRef.current,
                    { y: 40, opacity: 0 },
                    { y: 0, opacity: 1, duration: 1.2 },
                    "-=0.7"
                )
                .fromTo(
                    heroDescRef.current,
                    { y: 20, opacity: 0 },
                    { y: 0, opacity: 1, duration: 1 },
                    "-=0.8"
                );

            // 2. Form & Info Cards - Staggered slide up on scroll
            gsap.fromTo(
                [formCardRef.current, infoCardRef.current],
                { y: 80, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 1.2,
                    stagger: 0.2,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: formCardRef.current,
                        start: "top 85%",
                    }
                }
            );

            // 3. Map Section - Smooth reveal
            gsap.fromTo(
                mapSectionRef.current,
                { y: 50, opacity: 0, scale: 0.98 },
                {
                    y: 0,
                    opacity: 1,
                    scale: 1,
                    duration: 1.2,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: mapSectionRef.current,
                        start: "top 80%",
                    }
                }
            );

        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <div ref={containerRef} className="min-h-screen bg-gradient-to-b from-[#fdf2f4] via-white to-[#f4f5f9]">
            {/* Hero - gradient with brand colours */}
            <section className="relative overflow-hidden px-4 py-16 sm:py-20 md:py-32">
                <div className="absolute inset-0 bg-gradient-to-br from-brand-red/90 via-brand-red to-brand-red-dark" />
                <div className="absolute right-0 top-0 h-[500px] w-[500px] rounded-full bg-white/10 blur-[100px]" />
                <div className="absolute bottom-0 left-0 h-[300px] w-[300px] rounded-full bg-brand-red-dark/30 blur-[80px]" />

                {/* Animated Background Particles */}
                <div className="absolute left-[15%] top-[30%] h-2 w-2 rounded-full bg-white/60 animate-pulse" />
                <div className="absolute right-[25%] top-[50%] h-3 w-3 rounded-full bg-white/40 animate-bounce" style={{ animationDuration: '3s' }} />
                <div className="absolute bottom-[20%] right-[15%] h-2 w-2 rounded-full bg-white/50 animate-pulse" style={{ animationDelay: '1s' }} />

                <div className="relative z-10 mx-auto max-w-3xl text-center">
                    <span
                        ref={heroSubtitleRef}
                        className="inline-block text-sm font-bold uppercase tracking-widest text-white/90"
                    >
                        Get in touch
                    </span>
                    <h1
                        ref={heroTitleRef}
                        className="mt-4 text-5xl font-black tracking-tighter text-white md:text-7xl drop-shadow-sm"
                    >
                        Contact <span className="text-white/90">Us</span>
                    </h1>
                    <p
                        ref={heroDescRef}
                        className="mt-6 text-xl text-white/90 max-w-xl mx-auto font-medium"
                    >
                        Have a project in mind? We&apos;d love to hear from you. Let&apos;s build something amazing together.
                    </p>
                </div>
            </section>

            {/* Form + Info - colourful cards */}
            <section className="px-4 py-16 sm:py-24">
                <div className="mx-auto max-w-6xl">
                    <div className="grid gap-12 lg:grid-cols-5 lg:gap-16">

                        {/* Form Card */}
                        <div
                            ref={formCardRef}
                            className="lg:col-span-3 relative overflow-hidden rounded-3xl border border-gray-100 bg-white p-6 shadow-2xl shadow-brand-red/5 sm:p-10"
                        >
                            <div className="absolute right-0 top-0 h-40 w-40 translate-x-12 -translate-y-12 rounded-full bg-brand-red/5" />
                            <div className="absolute bottom-0 left-0 h-32 w-32 -translate-x-10 translate-y-10 rounded-full bg-brand-red/5" />
                            <div className="relative">
                                <h2 className="text-3xl font-black text-gray-900 tracking-tight">
                                    Send a <span className="text-brand-red">message</span>
                                </h2>
                                <p className="mt-3 text-gray-600 text-lg">
                                    Fill in the form below and our team will get back to you shortly.
                                </p>
                                <div className="mt-10">
                                    <ContactForm />
                                </div>
                            </div>
                        </div>

                        {/* Info Card */}
                        <div
                            ref={infoCardRef}
                            className="lg:col-span-2 relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-red to-brand-red-dark p-8 text-white shadow-2xl shadow-brand-red/20 sm:p-10 flex flex-col justify-between"
                        >
                            <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-white/10 blur-3xl pointer-events-none" />

                            <div className="relative">
                                <h2 className="text-3xl font-black tracking-tight mb-8">Reach us</h2>
                                <div className="space-y-8">
                                    <div className="group">
                                        <p className="text-sm font-bold uppercase tracking-widest text-white/70 mb-2">
                                            Phone
                                        </p>
                                        <a
                                            href="tel:0706668885"
                                            className="block text-2xl font-semibold text-white group-hover:text-white/80 transition-colors"
                                        >
                                            070 666 8885
                                        </a>
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold uppercase tracking-widest text-white/70 mb-2">
                                            Hours
                                        </p>
                                        <p className="text-lg text-white/95 font-medium">
                                            Mon - Sat: 9:00 AM - 6:00 PM<br />
                                            <span className="text-white/70 text-sm">Closed on Sundays & Public Holidays</span>
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="relative mt-12 pt-12 border-t border-white/20">
                                <p className="text-sm font-bold uppercase tracking-widest text-white/70 mb-4">
                                    Quick links
                                </p>
                                <ul className="space-y-3 text-white font-medium text-lg">
                                    <li>
                                        <Link href="/quote" className="flex items-center gap-2 hover:translate-x-2 transition-transform">
                                            <span>Request a quote</span>
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/products" className="flex items-center gap-2 hover:translate-x-2 transition-transform">
                                            <span>Browse products</span>
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* Map Section */}
            <section ref={mapSectionRef} className="px-4 pb-24 mx-auto max-w-6xl">
                <div className="mb-10 flex items-center justify-center gap-4">
                    <span className="h-px w-12 bg-brand-red/30" />
                    <h2 className="text-center text-3xl font-black text-gray-900 tracking-tight">
                        Find <span className="text-brand-red">us</span>
                    </h2>
                    <span className="h-px w-12 bg-brand-red/30" />
                </div>
                <div className="rounded-3xl overflow-hidden shadow-2xl border border-gray-100 bg-white p-2">
                    <div className="rounded-2xl overflow-hidden h-[500px] w-full relative bg-gray-100">
                        <ContactMap />
                    </div>
                </div>
            </section>

        </div>
    );
}
