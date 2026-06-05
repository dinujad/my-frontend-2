"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { SocialIconLinks } from "@/components/layout/SocialIconLinks";

const FOOTER_ADDRESS = "1st Floor No.215, 10 New Kandy Rd, 11650";
const MAP_EMBED_QUERY = encodeURIComponent(FOOTER_ADDRESS);

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
            <div
                className="pointer-events-none absolute inset-0 z-0 opacity-40"
                aria-hidden
                suppressHydrationWarning
            >
                <div className="absolute -right-16 top-1/4 h-72 w-72 rounded-full bg-brand-red/25 blur-[100px]" />
                <div className="absolute -left-20 bottom-1/3 h-64 w-64 rounded-full bg-white/10 blur-[90px]" />
            </div>

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
                            <Link href="/career" className="hover:text-white transition-colors w-fit">Careers</Link>
                            <Link href="/contact" className="hover:text-white transition-colors w-fit">Contact</Link>
                            <Link href="/quote" className="hover:text-white transition-colors w-fit">Request a Quote</Link>
                        </nav>
                    </div>

                    {/* Column 3: Contact (Takes up 3 cols on lg) */}
                    <div className="lg:col-span-3 flex flex-col space-y-6">
                        <h4 className="text-sm font-bold tracking-widest uppercase text-brand-red">Get In Touch</h4>
                        <div className="text-sm font-light text-gray-400 space-y-3">
                            <p className="flex items-start gap-3">
                                <svg className="mt-0.5 h-4 w-4 shrink-0 text-brand-red" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <span>{FOOTER_ADDRESS}</span>
                            </p>
                            <p className="flex items-center gap-3">
                                <svg className="h-4 w-4 shrink-0 text-brand-red" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                                <a href="tel:0112465555" className="hover:text-white transition-colors">011 246 5555</a>
                                <span className="text-[11px] text-gray-500">(Landline)</span>
                            </p>
                            <p className="flex items-center gap-3">
                                <svg className="h-4 w-4 shrink-0 text-brand-red" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                                </svg>
                                <a href="https://wa.me/94706668885" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">070 666 8885</a>
                                <span className="text-[11px] text-gray-500">(WhatsApp)</span>
                            </p>
                            <p className="flex items-center gap-3">
                                <svg className="h-4 w-4 shrink-0 text-brand-red" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                <a href="mailto:sales@printworks.lk" className="hover:text-white transition-colors">sales@printworks.lk</a>
                            </p>
                            <div className="pt-3">
                                <p className="mb-3 text-[11px] font-medium uppercase tracking-wide text-gray-500">Follow us</p>
                                <SocialIconLinks variant="footer" />
                            </div>
                        </div>
                    </div>

                    {/* Column 4: Location Map (Takes up 3 cols on lg) */}
                    <div className="lg:col-span-3 flex flex-col space-y-4 md:h-full lg:h-56 min-h-[220px]">
                        <h4 className="text-sm font-bold tracking-widest uppercase text-brand-red">Location</h4>
                        <p className="text-sm font-light leading-relaxed text-gray-400">{FOOTER_ADDRESS}</p>
                        <div className="w-full flex-1 min-h-[180px] rounded-2xl overflow-hidden border border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.5)]">
                            <iframe
                                src={`https://maps.google.com/maps?q=${MAP_EMBED_QUERY}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                                title="Print Works.LK location"
                                width="100%"
                                height="100%"
                                style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) brightness(85%) contrast(90%) grayscale(20%)' }}
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                            />
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
