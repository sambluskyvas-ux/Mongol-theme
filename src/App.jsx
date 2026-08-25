import React, { useRef, useState, useEffect, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import * as THREE from 'three';

import { CinematicWorld } from './components/Scene/CinematicWorld';
import { CinematicHUD } from './components/HUD/CinematicHUD';

gsap.registerPlugin(ScrollTrigger);

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Canvas Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="fixed inset-0 flex items-center justify-center bg-[#070605] text-[#ded1b8] p-6 text-center z-50">
          <div className="border border-mongol-bronze/60 bg-black/90 p-8 max-w-md">
            <h2 className="text-xl font-bold tracking-widest text-mongol-gold mb-2">
              BATTLEFIELD RETRY
            </h2>
            <p className="text-xs text-zinc-400 mb-4">
              WebGL context encountered an issue. Reloading battlefield...
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-mongol-bronze text-white text-xs font-mono tracking-widest"
            >
              RELOAD THE HORDE
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

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

    // Pointer Drag to Scroll (Mouse & Touch)
    let isDragging = false;
    let startY = 0;

    const onPointerDown = (e) => {
      if (e.target.closest('button, a, input, [role="button"]')) return;
      isDragging = true;
      startY = e.clientY || (e.touches && e.touches[0]?.clientY) || 0;
    };

    const onPointerMove = (e) => {
      if (!isDragging) return;
      const clientY = e.clientY || (e.touches && e.touches[0]?.clientY) || 0;
      const deltaY = (startY - clientY) * 2.5;
      window.scrollBy({ top: deltaY, behavior: 'auto' });
      startY = clientY;
    };

    const onPointerUp = () => {
      isDragging = false;
    };

    // Keyboard Navigation
    const onKeyDown = (e) => {
      const scrollStep = window.innerHeight * 0.4;
      if (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ') {
        e.preventDefault();
        window.scrollBy({ top: scrollStep, behavior: 'smooth' });
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault();
        window.scrollBy({ top: -scrollStep, behavior: 'smooth' });
      } else if (e.key === 'Home') {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (e.key === 'End') {
        e.preventDefault();
        window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });
      }
    };

    window.addEventListener('mousedown', onPointerDown);
    window.addEventListener('mousemove', onPointerMove);
    window.addEventListener('mouseup', onPointerUp);
    window.addEventListener('touchstart', onPointerDown, { passive: true });
    window.addEventListener('touchmove', onPointerMove, { passive: true });
    window.addEventListener('touchend', onPointerUp);
    window.addEventListener('keydown', onKeyDown);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', onPointerDown);
      window.removeEventListener('mousemove', onPointerMove);
      window.removeEventListener('mouseup', onPointerUp);
      window.removeEventListener('touchstart', onPointerDown);
      window.removeEventListener('touchmove', onPointerMove);
      window.removeEventListener('touchend', onPointerUp);
      window.removeEventListener('keydown', onKeyDown);
      trigger.kill();
    };
  }, []);

  return (
    <ErrorBoundary>
      <div className="relative bg-[#070605] w-full min-h-screen select-none overflow-x-hidden cursor-grab active:cursor-grabbing">
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
    </ErrorBoundary>
  );
}