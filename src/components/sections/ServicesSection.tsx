"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const services = [
    {
        id: "uv",
        title: "UV Flatbed Printing",
        description: "Industry-grade UV printing directly onto any rigid surface including acrylic, metal, and wood. Brilliant colors with unmatched durability.",
        image: "/images/services/services_uv_1771958447138.png",
        link: "/services/uv-printing",
        colSpan: "md:col-span-2 md:row-span-2",
        theme: "dark"
    },
    {
        id: "acrylic",
        title: "Acrylic Products",
        description: "Premium office nameplates and corporate signage.",
        image: "/images/services/services_acrylic_1771958315597.png",
        link: "/services/acrylic-products",
        colSpan: "md:col-span-1 md:row-span-1",
        theme: "light"
    },
    {
        id: "custom",
        title: "Custom Products",
        description: "Tailored promotional stickers and branded packaging.",
        image: "/images/services/services_custom_1771958344395.png",
        link: "/services/custom-products",
        colSpan: "md:col-span-1 md:row-span-1",
        theme: "light"
    },
    {
        id: "signage",
        title: "Signage & Displays",
        description: "Eye-catching illuminated displays and gift voucher stands for retail.",
        image: "/images/services/services_signage_1771958377225.png",
        link: "/services/signage-displays",
        colSpan: "md:col-span-2 md:row-span-1",
        theme: "brand"
    }
];

export function ServicesSection() {
    const [isVisible, setIsVisible] = useState(false);
    const sectionRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.1 }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => observer.disconnect();
    }, []);

    return (
        <section
            ref={sectionRef}
            className="pt-10 pb-20 sm:pt-16 sm:pb-20 bg-white relative overflow-hidden"
            aria-label="Our Services"
        >
            {/* Background Decor */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-brand-red/5 blur-[100px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[500px] h-[500px] rounded-full bg-orange-400/5 blur-[120px] pointer-events-none" />

            <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

                {/* Horizontal Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                    {services.map((service, index) => (
                        <Link
                            href={service.link}
                            key={service.id}
                            className={`group flex items-center gap-5 sm:gap-6 overflow-hidden rounded-[1.5rem] bg-white border border-gray-100 p-4 sm:p-5 transition-all duration-500 hover:shadow-[0_20px_40px_rgba(255,31,64,0.12)] hover:-translate-y-2 hover:border-brand-red/30 ${isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-16 scale-95'}`}
                            style={{ transitionDelay: `${index * 150}ms` }}
                        >
                            {/* Image Box */}
                            <div className="relative h-28 w-28 sm:h-36 sm:w-36 shrink-0 overflow-hidden rounded-2xl bg-[#fafafc] shadow-sm flex-none">
                                <Image
                                    src={service.image}
                                    alt={service.title}
                                    fill
                                    className="object-cover transition-all duration-[800ms] ease-out group-hover:scale-[1.12] group-hover:-rotate-2"
                                    sizes="(max-width: 640px) 112px, 144px"
                                />
                                <div className="absolute inset-0 border border-black/5 rounded-2xl pointer-events-none transition-colors duration-500 group-hover:border-black/10" />
                            </div>

                            {/* Content */}
                            <div className="flex flex-col py-1">
                                <h3 className="text-xl sm:text-2xl font-black text-gray-900 group-hover:text-brand-red transition-colors duration-300">
                                    {service.title}
                                </h3>
                                <p className="mt-2 text-sm text-gray-600 line-clamp-2 sm:line-clamp-3">
                                    {service.description}
                                </p>
                                <div className="mt-4 sm:mt-5 flex items-center text-sm font-bold text-gray-400 group-hover:text-brand-red transition-colors duration-300">
                                    Explore Service
                                    <svg className="ml-1.5 w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* View All Services Button at the bottom */}
                <div className={`mt-12 sm:mt-16 flex justify-center transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                    <Link href="/services" className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full bg-white px-8 py-3.5 text-sm font-bold text-brand-red shadow-sm ring-1 ring-gray-200 transition-all duration-300 hover:bg-brand-red hover:text-white hover:ring-brand-red hover:shadow-[0_8px_30px_rgb(255,31,64,0.2)] hover:-translate-y-1">
                        View All Services
                        <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </Link>
                </div>
            </div>
        </section>
    );
}
