"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export function HeroThreeBackground() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // Animated lines (wireframe style) - brand red #FF1F40, visible on desktop
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0xff1f40,
      transparent: true,
      opacity: 0.28,
    });
    const lines: THREE.Line[] = [];
    const lineCount = 40;
    for (let i = 0; i < lineCount; i++) {
      const points: THREE.Vector3[] = [];
      const y = (Math.random() - 0.5) * 4;
      const xStart = (Math.random() - 0.5) * 6;
      for (let j = 0; j <= 8; j++) {
        const t = j / 8;
        points.push(
          new THREE.Vector3(
            xStart + (Math.random() - 0.5) * 2,
            y + Math.sin(t * Math.PI * 2) * 0.3,
            (Math.random() - 0.5) * 2
          )
        );
      }
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const line = new THREE.Line(geometry, lineMaterial);
      line.userData = { speed: 0.2 + Math.random() * 0.3, offset: Math.random() * Math.PI * 2 };
      scene.add(line);
      lines.push(line);
    }

    // Floating particles
    const particleCount = 80;
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 8;
      positions[i + 1] = (Math.random() - 0.5) * 6;
      positions[i + 2] = (Math.random() - 0.5) * 4;
    }
    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const particleMaterial = new THREE.PointsMaterial({
      color: 0xff1f40,
      size: 0.055,
      transparent: true,
      opacity: 0.55,
      sizeAttenuation: true,
    });
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    camera.position.z = 5;

    const handleResize = () => {
      if (!container) return;
      const width = container.offsetWidth;
      const height = container.offsetHeight;
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };
    handleResize();
    window.addEventListener("resize", handleResize);

    const clock = new THREE.Clock();
    function animate() {
      const t = clock.getElapsedTime();
      requestAnimationFrame(animate);
      lines.forEach((line, i) => {
        const { speed, offset } = line.userData as { speed: number; offset: number };
        line.rotation.y = offset + t * speed * 0.2;
        line.position.y = Math.sin(t * 0.5 + i * 0.3) * 0.1;
      });
      particles.rotation.y = t * 0.05;
      particles.position.y = Math.sin(t * 0.3) * 0.2;
      renderer.render(scene, camera);
    }
    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
      lines.forEach((l) => l.geometry.dispose());
      (lineMaterial as THREE.Material).dispose();
      particleGeometry.dispose();
      (particleMaterial as THREE.Material).dispose();
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={containerRef} className="absolute inset-0 overflow-hidden" aria-hidden />;
}
