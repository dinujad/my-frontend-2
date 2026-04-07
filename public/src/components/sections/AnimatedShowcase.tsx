"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { Observer } from "gsap/all";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Stars } from "@react-three/drei";
import * as THREE from "three";

gsap.registerPlugin(Observer, ScrollTrigger);

const showcaseData = [
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
    }
];

// 3D Scene Background
function AbstractShapes() {
    const groupRef = useRef<THREE.Group>(null);

    useFrame((state, delta) => {
        if (groupRef.current) {
            groupRef.current.rotation.y -= delta * 0.15;
            groupRef.current.rotation.x += delta * 0.05;
        }
    });

    return (
        <group ref={groupRef}>
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 5]} intensity={2} />

            {/* Background Stars representing innovation/space */}
            <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade speed={1} />

            {/* Brand Red Element */}
            <Float speed={2} rotationIntensity={2} floatIntensity={2}>
                <mesh position={[4, 2, -5]}>
                    <icosahedronGeometry args={[2.5, 0]} />
                    <meshStandardMaterial color="#FF1F40" wireframe wireframeLinewidth={3} />
                </mesh>
            </Float>

            {/* White/Silver Element */}
            <Float speed={1.5} rotationIntensity={1.5} floatIntensity={2}>
                <mesh position={[-5, -2, -3]}>
                    <octahedronGeometry args={[3, 0]} />
                    <meshStandardMaterial color="#ffffff" wireframe wireframeLinewidth={2} />
                </mesh>
            </Float>

            {/* Dark Red Element */}
            <Float speed={2.5} rotationIntensity={3} floatIntensity={1}>
                <mesh position={[0, -1, -8]}>
                    <torusGeometry args={[4, 1, 16, 100]} />
                    <meshStandardMaterial color="#BE0029" wireframe wireframeLinewidth={2} />
                </mesh>
            </Float>
        </group>
    );
}

const SplitTextChars = ({ text, className = "" }: { text: string; className?: string }) => {
    return (
        <span aria-label={text} className={`flex flex-wrap justify-center ${className}`}>
            {text.split(' ').map((word, wIdx) => (
                <span key={wIdx} className="inline-flex overflow-hidden mx-2 lg:mx-4">
                    {word.split('').map((char, cIdx) => (
                        <span key={cIdx} className="split-char inline-block will-change-transform">
                            {char}
                        </span>
                    ))}
                </span>
            ))}
        </span>
    );
};

export function AnimatedShowcase() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isHovered, setIsHovered] = useState(false);

    useGSAP(() => {
        const sections = gsap.utils.toArray<HTMLElement>(".showcase-slide");
        const outerWrappers = gsap.utils.toArray<HTMLElement>(".showcase-outer");
        const innerWrappers = gsap.utils.toArray<HTMLElement>(".showcase-inner");
        const sectionChars = sections.map(sec => gsap.utils.toArray<HTMLElement>(".split-char", sec));

        // Initial setup
        gsap.set(outerWrappers, { yPercent: 100 });
        gsap.set(innerWrappers, { yPercent: -100 });
        gsap.set(sections[0], { autoAlpha: 1, zIndex: 1 });
        gsap.set(outerWrappers[0], { yPercent: 0 });
        gsap.set(innerWrappers[0], { yPercent: 0 });
        gsap.set(sectionChars[0], { autoAlpha: 1, yPercent: 0 });

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top top",
                end: `+=${sections.length * 100}%`,
                scrub: 1, // Smooth scrub
                pin: true,
            }
        });

        sections.forEach((sec, idx) => {
            if (idx === 0) return;

            // Wiping transition block
            tl.set(sections[idx - 1], { autoAlpha: 0 }, `slide${idx}+=1`);

            tl.set(sections[idx], { autoAlpha: 1, zIndex: 1 }, `slide${idx}`)
                .fromTo([outerWrappers[idx], innerWrappers[idx]],
                    { yPercent: i => i ? -100 : 100 },
                    { yPercent: 0, ease: "none", duration: 1 }, `slide${idx}`);

            // Text stagger effect inside the slide
            tl.fromTo(sectionChars[idx], {
                autoAlpha: 0,
                yPercent: 150
            }, {
                autoAlpha: 1,
                yPercent: 0,
                stagger: 0.1,
                ease: "power2.out",
                duration: 0.5
            }, `slide${idx}+=0.3`);

            // Add a buffer so the user has time to read the text before it immediately scrolls away
            tl.to({}, { duration: 0.5 });
        });

    }, { scope: containerRef });

    return (
        <section
            id="gsap-showcase"
            ref={containerRef}
            className="w-full h-[600px] lg:h-[800px] relative overflow-hidden bg-[#0a0a0a] text-white cursor-pointer"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* 3D Canvas Background */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <Canvas camera={{ position: [0, 0, 10], fov: 50 }}>
                    <AbstractShapes />
                </Canvas>
            </div>

            {/* Overlay hint purely for UX */}
            <div className={`absolute top-0 left-0 w-full h-full z-50 pointer-events-none transition-opacity duration-300 flex items-center justify-center bg-black/20 ${isHovered ? 'opacity-0' : 'opacity-100'}`}>
                <div className="bg-black/60 px-6 py-3 rounded-full backdrop-blur-md shadow-xl flex items-center gap-3 border border-white/10">
                    <svg className="w-5 h-5 animate-bounce text-brand-red" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                    <span className="text-sm font-medium tracking-wider uppercase text-white">Keep Scrolling</span>
                </div>
            </div>

            {/* Foreground Content Wrapper */}
            <div className="absolute inset-0 z-10 pointer-events-none">
                {showcaseData.map((data, idx) => (
                    <div key={idx} className="showcase-slide absolute top-0 left-0 w-full h-full invisible">
                        <div className="showcase-outer w-full h-full overflow-hidden">
                            <div className="showcase-inner w-full h-full overflow-hidden bg-black/30 backdrop-blur-md">
                                <div className={`relative flex flex-col items-center justify-center w-full h-full p-8 pointer-events-auto`}>
                                    <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col items-center justify-center text-center">
                                        <div className="mt-8">
                                            <SplitTextChars
                                                text={data.title}
                                                className={`font-semibold tracking-tight text-4xl sm:text-5xl lg:text-7xl xl:text-[6rem] leading-[1.1] mb-6 text-white uppercase drop-shadow-[0_2px_20px_rgba(0,0,0,0.8)]`}
                                            />
                                            <div className="overflow-hidden">
                                                <p className={`text-lg sm:text-2xl lg:text-3xl font-light tracking-wide text-brand-red split-char drop-shadow-[0_2px_10px_rgba(0,0,0,1)] font-medium`}>
                                                    {data.subtitle}
                                                </p>
                                            </div>
                                        </div>
                                        {idx === 4 && (
                                            <button className={`mt-12 px-8 py-4 rounded-full text-sm lg:text-base font-bold tracking-widest uppercase transition-all duration-300 hover:scale-105 border-2 border-brand-red text-white bg-brand-red hover:bg-[#BE0029] shadow-[0_0_20px_rgba(255,31,64,0.4)] hover:shadow-[0_0_30px_rgba(255,31,64,0.6)]`}>
                                                Start A Project
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
