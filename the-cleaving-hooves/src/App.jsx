import React, { useRef, useState, useEffect, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import * as THREE from 'three';

import { CinematicWorld } from './components/Scene/CinematicWorld';
import { CinematicHUD } from './components/HUD/CinematicHUD';

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const [hudProgress, setHudProgress] = useState(0);
  const scrollProgress = useRef(0);
  const mouseOffset = useRef({ x: 0, y: 0 });
  const scrollTrackRef = useRef();

  useEffect(() => {
    // Parallax Cursor Mapping
    const handleMouseMove = (e) => {
      mouseOffset.current = {
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1,
      };
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Scroll-Controlled Camera Track (600vh virtual timeline)
    const trigger = ScrollTrigger.create({
      trigger: scrollTrackRef.current,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.6,
      onUpdate: (self) => {
        scrollProgress.current = self.progress;
        setHudProgress(self.progress);
      },
    });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      trigger.kill();
    };
  }, []);

  return (
    <div className="relative bg-[#070605] w-full min-h-screen select-none overflow-x-hidden">
      {/* Cinematic Post-Processing Overlays */}
      <div className="film-grain" />
      <div className="cinematic-vignette" />

      {/* Fixed 3D WebGL Viewport */}
      <div className="fixed inset-0 w-full h-screen pointer-events-none z-0">
        <Canvas
          gl={{
            antialias: true,
            powerPreference: 'high-performance',
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1.3,
          }}
          dpr={[1, 2]}
        >
          <PerspectiveCamera makeDefault position={[0, 0, 8.5]} fov={50} />
          <Suspense fallback={null}>
            <CinematicWorld scrollProgress={scrollProgress} mouseOffset={mouseOffset} />
          </Suspense>
        </Canvas>
      </div>

      {/* Non-Intrusive Film HUD / Subtitle Layer */}
      <CinematicHUD progress={hudProgress} />

      {/* 600vh Virtual Scroll Drive */}
      <div ref={scrollTrackRef} className="h-[600vh] w-full pointer-events-none" />
    </div>
  );
}