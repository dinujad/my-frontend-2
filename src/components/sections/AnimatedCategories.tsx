"use client";

import { Suspense, useRef } from "react";
import gsap from "gsap";
// @ts-ignore
import { Flip } from "gsap/Flip";
import { useGSAP } from "@gsap/react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Stars, MeshDistortMaterial, Sphere } from "@react-three/drei";
import * as THREE from "three";

if (typeof window !== "undefined") {
    gsap.registerPlugin(Flip);
}

// 3D Scene Background
function DynamicBackground() {
    const groupRef = useRef<THREE.Group>(null);

    useFrame((state, delta) => {
        if (groupRef.current) {
            groupRef.current.rotation.y -= delta * 0.1;
            groupRef.current.rotation.x -= delta * 0.05;
        }
    });

    return (
        <group ref={groupRef}>
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 5]} intensity={2} />

            <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade speed={1.5} />

            <Float speed={2} rotationIntensity={1} floatIntensity={1}>
                <Sphere args={[2.5, 64, 64]} position={[-4, 2, -5]}>
                    <MeshDistortMaterial
                        color="#FF1F40"
                        attach="material"
                        distort={0.4}
                        speed={1.5}
                        roughness={0.2}
                        metalness={0.8}
                        wireframe
                    />
                </Sphere>
            </Float>

            <Float speed={1.5} rotationIntensity={1.5} floatIntensity={2}>
                <Sphere args={[3, 64, 64]} position={[4, -2, -8]}>
                    <MeshDistortMaterial
                        color="#ffffff"
                        attach="material"
                        distort={0.3}
                        speed={1}
                        roughness={0.5}
                        metalness={0.9}
                        wireframe
                    />
                </Sphere>
            </Float>
        </group>
    );
}

const LAYOUTS = ["final", "plain", "columns", "grid"];

export function AnimatedCategories() {
    const containerRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        if (!containerRef.current) return;
        const container = containerRef.current.querySelector('.flip-container');
        if (!container) return;

        let curLayout = 0;
        let timer: ReturnType<typeof gsap.delayedCall>;

        const nextState = () => {
            // capture current state
            const state = Flip.getState(".cat-box, .cat-for, .cat-gsap", { props: "color,backgroundColor", simple: true });

            container.classList.remove(LAYOUTS[curLayout]);
            curLayout = (curLayout + 1) % LAYOUTS.length;
            container.classList.add(LAYOUTS[curLayout]);

            Flip.from(state, {
                absolute: true,
                stagger: 0.07,
                duration: 0.7,
                ease: "power2.inOut",
                spin: curLayout === 0,
                simple: true,
                onEnter: (elements: any[]) => gsap.fromTo(elements, { opacity: 0 }, { opacity: 1, delay: 0.6 }),
                onLeave: (elements: any[]) => gsap.to(elements, { opacity: 0 })
            });

            timer = gsap.delayedCall(curLayout === 0 ? 3.5 : 2.5, nextState);
        };

        timer = gsap.delayedCall(1, nextState);

        return () => {
            if (timer) timer.kill();
        };
    }, { scope: containerRef });

    return (
        <section ref={containerRef} className="relative w-full h-[80vh] min-h-[600px] bg-black overflow-hidden select-none font-sans">
            {/* 3D Background */}
            <div className="absolute inset-0 z-0 opacity-80 pointer-events-none">
                <Suspense fallback={null}>
                    <Canvas camera={{ position: [0, 0, 6], fov: 60 }}>
                        <DynamicBackground />
                    </Canvas>
                </Suspense>
            </div>

            <style jsx>{`
                .flip-container {
                  display: flex;
                  height: 100%;
                  width: 100%;
                  justify-content: center;
                  align-items: center;
                  overflow: hidden;
                  position: relative;
                  z-index: 10;
                  padding: 20px;
                }
                .flip-container.grid, .flip-container.columns {
                  align-content: stretch;
                  align-items: stretch;
                  flex-wrap: wrap;
                }

                .cat-box {
                  text-align: center;
                  color: black;
                  font-size: clamp(1rem, 3vmax, 3rem);
                  font-weight: 800;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  padding: 8px 16px;
                  margin: 4px;
                  border-radius: 8px;
                  text-transform: uppercase;
                  letter-spacing: 2px;
                  will-change: transform, color, background-color;
                }
                .flip-container.grid .cat-box {
                  flex-basis: calc(50% - 8px);
                }
                .flip-container.columns .cat-box {
                  flex-basis: calc(25% - 8px);
                }
                .cat-for, .cat-gsap {
                  font-size: clamp(2rem, 5vmax, 5rem);
                  color: white;
                }
                .cat-for {
                  padding: 2px 1.6vmax;
                  font-weight: 300;
                  display: none;
                }
                .cat-gsap {
                  padding: 2px 0;
                  font-weight: 600;
                  display: none;
                }
                .flip-container.final .cat-for, .flip-container.final .cat-gsap {
                  display: block;
                }
                .box-1 { background: #FF1F40; color: white; }
                .box-2 { background: #ffffff; color: black; }
                .box-3 { background: #1a1a1a; color: white; border: 1px solid #333; }
                .box-4 { background: #BE0029; color: white; }
                
                .flip-container.plain .cat-box {
                  background: transparent !important;
                  color: white !important;
                  padding: 0;
                  border: none;
                }
            `}</style>

            <div className="flip-container final mx-auto max-w-7xl">
                <div className="cat-box box-1">DIGITAL</div>
                <div className="cat-box box-2">UV PRINT</div>
                <div className="cat-box box-3">LASER</div>
                <div className="cat-box box-4">ACRYLIC</div>
                <div className="cat-for">TOP</div>
                <div className="cat-gsap">TIER</div>
            </div>

            {/* Absolute Title Overlay */}
            <div className="absolute bottom-10 right-10 z-20 text-white opacity-50 font-light tracking-widest text-sm uppercase">
                Explore Categories
            </div>
        </section>
    );
}
