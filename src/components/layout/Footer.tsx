"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const SERVICES = [
    "Acrylic Laser Cutting",
    "UV Gift Printing",
    "T-Shirt Screen Printing",
    "Signage & Banners",
    "Packaging",
    "Brochures & Flyers",
    "Name Badges",
    "Gift Items"
];

export function Footer() {
    const pathname = usePathname();

    if (pathname?.startsWith("/admin")) return null;

    return (
        <footer
            className="relative w-full bg-[#0a0a0a] text-white overflow-hidden border-t border-white/10 pt-16 lg:pt-24"
            suppressHydrationWarning
        >
            {/* Temporarily disabled 3D/WebGL background for deploy stability */}
            <div
                className="absolute inset-0 z-0 opacity-40 pointer-events-none"
                suppressHydrationWarning
            />

            <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">

                {/* Info & Links Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 w-full">

                    {/* Column 1: About & Logo (Takes up 4 cols on lg) */}
                    <div className="lg:col-span-4 flex flex-col space-y-8">
                        {/* Logo Section */}
                        <div className="bg-white/5 backdrop-blur-md border border-white/10 p-5 rounded-3xl w-fit shadow-[0_0_30px_rgba(255,31,64,0.15)]">
                            <Image
                                src="/images/logo.png"
                                alt="Print Works.LK"
                                width={160}
                                height={60}
                                className="object-contain brightness-0 invert opacity-90 transition-opacity hover:opacity-100"
                                priority
                            />
                        </div>
                        <p className="text-gray-400 font-light leading-relaxed max-w-sm text-sm">
                            Sri Lanka’s most trusted and innovative online printing platform. Uniting the largest physical print shop network with seamless e-commerce.
                        </p>
                    </div>

                    {/* Column 2: Quick Links (Takes up 2 cols on lg) */}
                    <div className="lg:col-span-2 flex flex-col space-y-6">
                        <h4 className="text-sm font-bold tracking-widest uppercase text-brand-red">Quick Links</h4>
                        <nav className="flex flex-col space-y-3 text-sm font-light text-gray-400">
                            <Link href="/products" className="hover:text-white transition-colors w-fit">All Products</Link>
                            <Link href="/about" className="hover:text-white transition-colors w-fit">Our Story</Link>
                            <Link href="/contact" className="hover:text-white transition-colors w-fit">Contact</Link>
                            <Link href="/quote" className="hover:text-white transition-colors w-fit">Request a Quote</Link>
                        </nav>
                    </div>

                    {/* Column 3: Contact (Takes up 3 cols on lg) */}
                    <div className="lg:col-span-3 flex flex-col space-y-6">
                        <h4 className="text-sm font-bold tracking-widest uppercase text-brand-red">Get In Touch</h4>
                        <div className="text-sm font-light text-gray-400 space-y-3">
                            <p className="flex items-center gap-3">
                                <svg className="w-4 h-4 text-brand-red" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                                <a href="tel:0706668885" className="hover:text-white transition-colors">070 666 8885</a>
                            </p>
                            <p className="flex items-center gap-3">
                                <svg className="w-4 h-4 text-brand-red" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                <a href="mailto:info@printworks.lk" className="hover:text-white transition-colors">info@printworks.lk</a>
                            </p>
                            <div className="pt-5 flex space-x-4">
                                {/* Social placeholders */}
                                <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-brand-red hover:border-brand-red cursor-pointer transition-all duration-300">
                                    <span className="sr-only">Facebook</span>
                                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
                                </div>
                                <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-brand-red hover:border-brand-red cursor-pointer transition-all duration-300">
                                    <span className="sr-only">Instagram</span>
                                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.766 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" /></svg>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Column 4: Location Map (Takes up 3 cols on lg) */}
                    <div className="lg:col-span-3 flex flex-col space-y-6 md:h-full lg:h-56 min-h-[220px]">
                        <h4 className="text-sm font-bold tracking-widest uppercase text-brand-red">Location</h4>
                        <div className="w-full h-full rounded-2xl overflow-hidden border border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.5)]">
                            <iframe
                                src="https://maps.google.com/maps?q=PrintWorks.+lk&t=&z=14&ie=UTF8&iwloc=&output=embed"
                                width="100%"
                                height="100%"
                                style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) brightness(85%) contrast(90%) grayscale(20%)' }}
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                            ></iframe>
                        </div>
                    </div>

                </div>

                {/* Animated Services Marquee */}
                <div className="mt-20 border-t border-b border-white/10 border-dashed py-4 overflow-hidden relative group">
                    <div className="flex gap-16 whitespace-nowrap animate-scroll-x hover:[animation-play-state:paused] w-max">
                        {/* Duplicate lists to ensure seamless looping */}
                        {[...Array(3)].map((_, listIndex) => (
                            <div key={listIndex} className="flex gap-16 items-center">
                                {SERVICES.map((service, index) => (
                                    <div key={`${listIndex}-${index}`} className="flex items-center gap-16">
                                        <span className="text-sm font-medium text-gray-400 tracking-wider uppercase drop-shadow-md hover:text-brand-red transition-colors cursor-default">
                                            {service}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                    {/* Fade Edges for Marquee */}
                    <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#0a0a0a] to-transparent pointer-events-none" />
                    <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[#0a0a0a] to-transparent pointer-events-none" />
                </div>

                {/* Bottom Bar */}
                <div className="w-full pt-8 pb-8 text-xs text-gray-500 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="text-center md:text-left">
                        <p>© {new Date().getFullYear()} Print Works.LK. All Rights Reserved.</p>
                        <p className="mt-1 text-[11px] text-gray-400">Developed and designed by E Media solution pvt Ltd</p>
                    </div>
                    <div className="flex space-x-6">
                        <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
                        <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
                    </div>
                </div>

            </div>
        </footer>
    );
}
