"use client";

import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Stars, Float, MeshDistortMaterial, Sphere } from "@react-three/drei";
import * as THREE from "three";

function FooterBackground() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.05;
      groupRef.current.rotation.x -= delta * 0.02;
    }
  });

  return (
    <group ref={groupRef}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={2} />

      <Stars radius={100} depth={50} count={2000} factor={3} saturation={0} fade speed={1} />

      <Float speed={1.5} rotationIntensity={1} floatIntensity={1}>
        <Sphere args={[2, 64, 64]} position={[5, -1, -3]}>
          <MeshDistortMaterial
            color="#FF1F40"
            attach="material"
            distort={0.4}
            speed={2}
            roughness={0.2}
            metalness={0.8}
            wireframe
          />
        </Sphere>
      </Float>

      <Float speed={2} rotationIntensity={1} floatIntensity={1.5}>
        <Sphere args={[1.5, 64, 64]} position={[-6, 1, -4]}>
          <MeshDistortMaterial
            color="#ffffff"
            attach="material"
            distort={0.3}
            speed={1.5}
            roughness={0.5}
            metalness={0.8}
            wireframe
          />
        </Sphere>
      </Float>
    </group>
  );
}

/** Client-only WebGL footer background — never import on server (avoids ReactCurrentBatchConfig SSR crash). */
export default function FooterCanvasBackground() {
  return (
    <div className="absolute inset-0 z-0 opacity-40 pointer-events-none" suppressHydrationWarning>
      <Suspense fallback={null}>
        <Canvas camera={{ position: [0, 0, 8], fov: 60 }}>
          <FooterBackground />
        </Canvas>
      </Suspense>
    </div>
  );
}
