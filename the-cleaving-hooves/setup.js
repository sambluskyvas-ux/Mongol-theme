const fs = require('fs');
const path = require('path');

const files = {
  'package.json': `{
  "name": "the-cleaving-hooves",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "@react-three/drei": "^9.105.6",
    "@react-three/fiber": "^8.16.6",
    "clsx": "^2.1.1",
    "gsap": "^3.12.5",
    "lucide-react": "^0.378.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "tailwind-merge": "^2.3.0",
    "three": "^0.164.1"
  },
  "devDependencies": {
    "@types/react": "^18.3.2",
    "@types/react-dom": "^18.3.0",
    "@types/three": "^0.164.0",
    "@vitejs/plugin-react": "^4.2.1",
    "autoprefixer": "^10.4.19",
    "postcss": "^8.4.38",
    "tailwindcss": "^3.4.3",
    "vite": "^5.2.11"
  }
}`,

  'vite.config.js': `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
});`,

  'postcss.config.js': `export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};`,

  'tailwind.config.js': `/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        mongol: {
          dark: '#070605',
          earth: '#18120c',
          bronze: '#8c6239',
          gold: '#c69c6d',
          dirtyIvory: '#ded1b8',
          steel: '#3a4042',
          deepRed: '#4a0e0e',
          blood: '#781212',
          darkTeal: '#0e1f1f'
        }
      },
      fontFamily: {
        serif: ['Cinzel', 'Trajan Pro', 'Georgia', 'serif'],
        sans: ['Cinzel Decorative', 'Cinzel', 'sans-serif'],
      },
      letterSpacing: {
        cinematic: '0.35em',
        widest: '0.25em'
      }
    },
  },
  plugins: [],
};`,

  'index.html': `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@700;900&family=Cinzel:wght@400;600;700;900&display=swap" rel="stylesheet">
    <title>THE CLEAVING HOOVES</title>
  </head>
  <body class="bg-[#070605] text-[#ded1b8] overflow-x-hidden">
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>`,

  'src/index.css': `@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  color-scheme: dark;
  background-color: #070605;
  color: #ded1b8;
  overflow-x: hidden;
}

body {
  margin: 0;
  padding: 0;
  font-family: 'Cinzel', serif;
  background-color: #070605;
  user-select: none;
  -webkit-font-smoothing: antialiased;
}

.film-grain {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  pointer-events: none;
  z-index: 40;
  opacity: 0.045;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
}

.cinematic-vignette {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 35;
  background: radial-gradient(circle at center, transparent 30%, rgba(5, 3, 2, 0.92) 100%);
}

.metal-text {
  background: linear-gradient(180deg, #f2e6ce 0%, #c69c6d 45%, #6e4e2a 80%, #9e7b4f 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.95));
}`,

  'src/data/team.js': `export const TEAM_MEMBERS = [
  { id: 'sam', name: 'SAM', role: 'Vanguard Commander' },
  { id: 'mark', name: 'MARK', role: 'Heavy Horseman' },
  { id: 'kevin', name: 'KEVIN', role: 'Iron Tactician' },
  { id: 'usman', name: 'USMAN', role: 'Supreme Warlord' },
  { id: 'cassie', name: 'CASSIE', role: 'Shield Warden' },
  { id: 'eric', name: 'ERIC', role: 'Blade Champion' },
  { id: 'chris', name: 'CHRIS', role: 'Horde Marshal' }
];

export const TEAM_POSTER_SRC = '/images/team-poster.jpg';
export const EMBLEM_SRC = '/images/the-cleaving-hooves-emblem.png';`,

  'src/data/content.js': `export const CAMPAIGN_CONTENT = {
  hero: {
    chapter: "CHAPTER 01",
    subtitle: "THE WARRIOR AWAKENS",
    title: "THE CLEAVING HOOVES",
    tagline: "BLOOD. IRON. HORDE.",
  },
  trials: [
    {
      code: "01 // INDOOR",
      title: "INDOOR TRIAL",
      desc: "Close-quarters arena combat. Reflexes pushed to absolute exhaustion under iron discipline."
    },
    {
      code: "02 // OUTDOOR",
      title: "OUTDOOR SIEGE",
      desc: "Raw steppe terrain, relentless elements, physical attrition, and unyielding stamina."
    },
    {
      code: "03 // GAMING",
      title: "DIGITAL BATTLEFIELD",
      desc: "Tactical reflexes, cybernetic precision, and synchronized horde warfare."
    }
  ],
  banners: {
    banner1: ["STRENGTH", "ENDURANCE", "UNITY", "VICTORY"],
    banner2: ["FINISH", "TOGETHER", "WIN", "TOGETHER"]
  },
  final: {
    line1: "ONE TEAM.",
    line2: "ONE BATTLE.",
    line3: "ONE VICTORY.",
    tag: "THE HORDE REMAINS UNBROKEN"
  }
};`,

  'src/components/Particles/BattleAtmosphere.jsx': `import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const BattleAtmosphere = ({ count = 900, speed = 0.35 }) => {
  const points = useRef();

  const [positions] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 35;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 25;
      pos[i * 3 + 2] = 10 - Math.random() * 80;
    }
    return [pos];
  }, [count]);

  useFrame((state, delta) => {
    if (!points.current) return;
    const positionsAttr = points.current.geometry.attributes.position;
    const array = positionsAttr.array;

    for (let i = 0; i < count; i++) {
      array[i * 3 + 1] += delta * speed * (0.8 + (i % 4) * 0.2);
      array[i * 3] += Math.sin(state.clock.elapsedTime * 0.5 + i) * 0.005;

      if (array[i * 3 + 1] > 12) {
        array[i * 3 + 1] = -12;
      }
    }
    positionsAttr.needsUpdate = true;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.14}
        color="#d4a373"
        transparent
        opacity={0.65}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
};`,

  'src/components/Battlefield/ArrowSalvo.jsx': `import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';

export const ArrowSalvo = ({ count = 40 }) => {
  const arrowsGroup = useRef();

  const arrowData = useMemo(() => {
    return Array.from({ length: count }, () => ({
      x: (Math.random() - 0.5) * 22,
      y: (Math.random() - 0.5) * 12 + 1,
      z: -70 - Math.random() * 40,
      speed: 25 + Math.random() * 20,
      rotZ: (Math.random() - 0.5) * 0.2 - 0.1,
      rotY: (Math.random() - 0.5) * 0.2,
      scale: 0.8 + Math.random() * 0.5,
    }));
  }, [count]);

  useFrame((state, delta) => {
    if (!arrowsGroup.current) return;

    arrowsGroup.current.children.forEach((child, i) => {
      const data = arrowData[i];
      child.position.z += data.speed * delta;
      child.position.y -= delta * 1.5;

      if (child.position.z > 12) {
        child.position.z = -70 - Math.random() * 30;
        child.position.x = (Math.random() - 0.5) * 22;
        child.position.y = (Math.random() - 0.5) * 10 + 2;
      }
    });
  });

  return (
    <group ref={arrowsGroup}>
      {arrowData.map((data, idx) => (
        <group
          key={idx}
          position={[data.x, data.y, data.z]}
          rotation={[0, data.rotY, data.rotZ]}
          scale={[data.scale, data.scale, data.scale]}
        >
          <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.02, 0.02, 2.4, 6]} />
            <meshStandardMaterial color="#2d2217" roughness={0.8} />
          </mesh>
          <mesh position={[0, 0, 1.25]} rotation={[-Math.PI / 2, 0, 0]}>
            <coneGeometry args={[0.06, 0.35, 4]} />
            <meshStandardMaterial color="#949da0" metalness={0.95} roughness={0.2} />
          </mesh>
          <mesh position={[0, 0.06, -1.0]}>
            <boxGeometry args={[0.01, 0.12, 0.35]} />
            <meshStandardMaterial color="#1a1410" roughness={0.9} />
          </mesh>
        </group>
      ))}
    </group>
  );
};`,

  'src/components/Scene/CinematicWorld.jsx': `import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { EMBLEM_SRC, TEAM_POSTER_SRC } from '../../data/team';
import { ArrowSalvo } from '../Battlefield/ArrowSalvo';
import { BattleAtmosphere } from '../Particles/BattleAtmosphere';

export const CinematicWorld = ({ scrollProgress, mouseOffset }) => {
  const emblemTex = useTexture(EMBLEM_SRC);
  const teamPosterTex = useTexture(TEAM_POSTER_SRC);

  const cameraTarget = useRef(new THREE.Vector3(0, 0, 0));
  const emblemPortalRef = useRef();
  const warbandGroupRef = useRef();
  const foregroundBladesRef = useRef();
  const bannersGroupRef = useRef();
  const finalEmblemRef = useRef();

  useFrame((state, delta) => {
    const p = scrollProgress.current;
    const mx = mouseOffset.current.x;
    const my = mouseOffset.current.y;

    let targetZ, targetY, targetX, lookAheadZ;

    if (p < 0.25) {
      const sub = p / 0.25;
      targetZ = THREE.MathUtils.lerp(8.5, 0.5, sub);
      targetY = THREE.MathUtils.lerp(0.0, 0.2, sub);
      targetX = Math.sin(sub * Math.PI) * 0.4;
      lookAheadZ = targetZ - 10;
    } else if (p < 0.55) {
      const sub = (p - 0.25) / 0.3;
      targetZ = THREE.MathUtils.lerp(0.5, -14.0, sub);
      targetY = THREE.MathUtils.lerp(0.2, -0.2, sub);
      targetX = Math.sin(sub * Math.PI) * -0.8;
      lookAheadZ = -20;
    } else if (p < 0.8) {
      const sub = (p - 0.55) / 0.25;
      targetZ = THREE.MathUtils.lerp(-14.0, -36.0, sub);
      targetY = THREE.MathUtils.lerp(-0.2, 0.4, sub);
      targetX = Math.cos(sub * Math.PI) * 1.2;
      lookAheadZ = -46;
    } else {
      const sub = (p - 0.8) / 0.2;
      targetZ = THREE.MathUtils.lerp(-36.0, -56.0, sub);
      targetY = THREE.MathUtils.lerp(0.4, 0.0, sub);
      targetX = 0;
      lookAheadZ = -65;
    }

    state.camera.position.z = THREE.MathUtils.damp(state.camera.position.z, targetZ, 4.5, delta);
    state.camera.position.y = THREE.MathUtils.damp(state.camera.position.y, targetY + my * 0.35, 4.5, delta);
    state.camera.position.x = THREE.MathUtils.damp(state.camera.position.x, targetX + mx * 0.55, 4.5, delta);

    cameraTarget.current.set(mx * 0.3, targetY * 0.5 - my * 0.2, lookAheadZ);
    state.camera.lookAt(cameraTarget.current);

    if (foregroundBladesRef.current) {
      const bladeOpen = Math.min(1, p * 4.0);
      foregroundBladesRef.current.position.x = mx * 0.8;
      foregroundBladesRef.current.children[0].position.x = -1.2 - bladeOpen * 2.8;
      foregroundBladesRef.current.children[1].position.x = 1.2 + bladeOpen * 2.8;
      foregroundBladesRef.current.children[0].rotation.z = 0.6 + bladeOpen * 0.8;
      foregroundBladesRef.current.children[1].rotation.z = -0.6 - bladeOpen * 0.8;
    }

    if (emblemPortalRef.current) {
      const dissolve = Math.max(0, Math.min(1, (p - 0.12) / 0.15));
      emblemPortalRef.current.scale.setScalar(1 + dissolve * 1.8);
      emblemPortalRef.current.rotation.z = (p * Math.PI * 0.4) + Math.sin(state.clock.elapsedTime * 0.4) * 0.04;
      emblemPortalRef.current.position.y = 0.2 + my * 0.2;
    }

    if (warbandGroupRef.current) {
      warbandGroupRef.current.rotation.y = mx * 0.08;
      warbandGroupRef.current.rotation.x = -my * 0.05;
    }

    if (bannersGroupRef.current) {
      bannersGroupRef.current.children[0].rotation.y = -0.25 + Math.sin(state.clock.elapsedTime * 1.5) * 0.08;
      bannersGroupRef.current.children[1].rotation.y = 0.25 + Math.cos(state.clock.elapsedTime * 1.4) * 0.08;
    }

    if (finalEmblemRef.current) {
      finalEmblemRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.12;
    }
  });

  return (
    <>
      <ambientLight intensity={0.45} color="#150f0a" />
      <directionalLight position={[8, 14, 10]} intensity={3.8} color="#d4a373" castShadow />
      <pointLight position={[-4, 3, -15]} intensity={4.5} color="#781212" distance={30} />
      <pointLight position={[4, -2, -35]} intensity={3.5} color="#c69c6d" distance={35} />
      <pointLight position={[0, 0, -58]} intensity={5.0} color="#ffeedb" distance={25} />
      <fog attach="fog" args={['#070605', 4, 32]} />

      <ArrowSalvo count={50} />
      <BattleAtmosphere count={1100} speed={0.4} />

      <group ref={foregroundBladesRef} position={[0, -0.4, 3.0]}>
        <mesh position={[-1.2, 0, 0]} rotation={[0, 0, 0.6]}>
          <boxGeometry args={[0.06, 3.2, 0.28]} />
          <meshStandardMaterial color="#c2d1d6" metalness={0.98} roughness={0.15} />
        </mesh>
        <mesh position={[1.2, 0, 0]} rotation={[0, 0, -0.6]}>
          <boxGeometry args={[0.06, 3.2, 0.28]} />
          <meshStandardMaterial color="#c2d1d6" metalness={0.98} roughness={0.15} />
        </mesh>
      </group>

      <group ref={emblemPortalRef} position={[0, 0.2, 0.0]}>
        <mesh position={[0, 0, 0]}>
          <planeGeometry args={[5.6, 5.6]} />
          <meshStandardMaterial
            map={emblemTex}
            transparent
            alphaTest={0.02}
            roughness={0.25}
            metalness={0.85}
          />
        </mesh>
        <mesh position={[0, 0, -0.12]}>
          <torusGeometry args={[2.7, 0.12, 16, 90]} />
          <meshStandardMaterial color="#8c6239" metalness={0.92} roughness={0.3} />
        </mesh>
        <mesh position={[0, 0, -0.2]}>
          <circleGeometry args={[2.6, 32]} />
          <meshBasicMaterial color="#3a1104" transparent opacity={0.65} />
        </mesh>
      </group>

      <group ref={warbandGroupRef} position={[0, 0, -20.0]}>
        <mesh position={[0, 0, 0]}>
          <planeGeometry args={[12.5, 8.33]} />
          <meshStandardMaterial
            map={teamPosterTex}
            roughness={0.45}
            metalness={0.35}
          />
        </mesh>
        <mesh position={[0, -4.3, 0.1]}>
          <boxGeometry args={[13.2, 0.25, 0.3]} />
          <meshStandardMaterial color="#5c442e" metalness={0.88} roughness={0.35} />
        </mesh>
        <mesh position={[0, 4.3, 0.1]}>
          <boxGeometry args={[13.2, 0.25, 0.3]} />
          <meshStandardMaterial color="#5c442e" metalness={0.88} roughness={0.35} />
        </mesh>
      </group>

      <group ref={bannersGroupRef} position={[0, 0, -38.0]}>
        <mesh position={[-6.2, 0, 0]}>
          <boxGeometry args={[0.1, 7.5, 2.2]} />
          <meshStandardMaterial color="#1a120c" roughness={0.85} metalness={0.2} />
        </mesh>
        <mesh position={[6.2, 0, 0]}>
          <boxGeometry args={[0.1, 7.5, 2.2]} />
          <meshStandardMaterial color="#1a120c" roughness={0.85} metalness={0.2} />
        </mesh>
      </group>

      <group ref={finalEmblemRef} position={[0, 0, -62.0]}>
        <mesh position={[0, 0.5, 0]}>
          <planeGeometry args={[7.0, 7.0]} />
          <meshStandardMaterial
            map={emblemTex}
            transparent
            alphaTest={0.02}
            roughness={0.2}
            metalness={0.95}
            emissive="#52130b"
            emissiveIntensity={0.6}
          />
        </mesh>
        <mesh position={[0, -4, -8]}>
          <coneGeometry args={[26, 12, 6]} />
          <meshStandardMaterial color="#080604" roughness={0.95} />
        </mesh>
      </group>
    </>
  );
};`,

  'src/components/HUD/CinematicHUD.jsx': `import React from 'react';
import { TEAM_MEMBERS } from '../../data/team';
import { CAMPAIGN_CONTENT } from '../../data/content';

export const CinematicHUD = ({ progress }) => {
  const isHero = progress < 0.22;
  const isWarriors = progress >= 0.22 && progress < 0.52;
  const isTrials = progress >= 0.52 && progress < 0.78;
  const isFinal = progress >= 0.78;

  return (
    <div className="fixed inset-0 pointer-events-none z-20 flex flex-col justify-between p-6 md:p-12 text-mongol-dirtyIvory">
      <header className="flex justify-between items-start w-full border-b border-mongol-bronze/30 pb-4">
        <div>
          <span className="text-[10px] md:text-xs font-mono tracking-widest text-mongol-gold block">
            MONGOL WAR CAMPAIGN // 2026
          </span>
          <h2 className="text-sm md:text-base font-black tracking-cinematic text-mongol-dirtyIvory mt-0.5">
            THE CLEAVING HOOVES
          </h2>
        </div>

        <div className="flex items-center space-x-3 font-mono text-xs text-mongol-gold">
          <span>MARCH</span>
          <span className="text-mongol-dirtyIvory font-bold">{Math.round(progress * 100)}%</span>
          <div className="w-16 h-1 bg-black/60 border border-mongol-bronze/50 overflow-hidden">
            <div
              className="h-full bg-mongol-gold transition-all duration-75"
              style={{ width: \`\${progress * 100}%\` }}
            />
          </div>
        </div>
      </header>

      <div className="flex flex-col items-center text-center justify-center space-y-4 my-auto">
        {isHero && (
          <div className="space-y-3 transition-opacity duration-700">
            <span className="text-xs uppercase tracking-cinematic text-mongol-gold border-b border-mongol-bronze/40 pb-1">
              {CAMPAIGN_CONTENT.hero.chapter} &mdash; {CAMPAIGN_CONTENT.hero.subtitle}
            </span>
            <h1 className="text-4xl md:text-8xl font-black tracking-widest metal-text">
              {CAMPAIGN_CONTENT.hero.title}
            </h1>
            <p className="text-sm md:text-lg tracking-[0.4em] text-mongol-dirtyIvory/80 font-medium">
              {CAMPAIGN_CONTENT.hero.tagline}
            </p>
          </div>
        )}

        {isWarriors && (
          <div className="space-y-4 transition-opacity duration-700 w-full max-w-5xl">
            <span className="text-xs uppercase tracking-cinematic text-mongol-gold border-b border-mongol-bronze/40 pb-1">
              CHAPTER 02 &mdash; SEVEN BLADES
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 pt-2">
              {TEAM_MEMBERS.map((member) => (
                <div
                  key={member.id}
                  className="bg-black/80 border border-mongol-bronze/60 p-2.5 backdrop-blur-md"
                >
                  <div className="text-[9px] text-mongol-gold font-mono tracking-widest">WARRIOR</div>
                  <div className="text-sm md:text-base font-black tracking-wider text-mongol-dirtyIvory">
                    {member.name}
                  </div>
                  <div className="text-[10px] text-zinc-400 font-sans tracking-tight truncate">
                    {member.role}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {isTrials && (
          <div className="space-y-6 transition-opacity duration-700 max-w-5xl w-full">
            <span className="text-xs uppercase tracking-cinematic text-mongol-gold border-b border-mongol-bronze/40 pb-1">
              CHAPTER 03 &mdash; THE TRIALS OF WAR
            </span>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
              {CAMPAIGN_CONTENT.trials.map((trial) => (
                <div
                  key={trial.code}
                  className="bg-black/85 border border-mongol-bronze/50 p-5 backdrop-blur-md space-y-2"
                >
                  <div className="text-xs tracking-cinematic text-mongol-gold font-bold">
                    {trial.code}
                  </div>
                  <h3 className="text-lg font-black tracking-wider text-mongol-dirtyIvory">
                    {trial.title}
                  </h3>
                  <p className="text-xs text-zinc-300 leading-relaxed font-sans">{trial.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {isFinal && (
          <div className="space-y-4 transition-opacity duration-700">
            <h2 className="text-3xl md:text-7xl font-black tracking-widest metal-text">
              {CAMPAIGN_CONTENT.final.line1} {CAMPAIGN_CONTENT.final.line2} {CAMPAIGN_CONTENT.final.line3}
            </h2>
            <p className="text-sm md:text-base tracking-[0.35em] text-mongol-gold font-semibold pt-2">
              {CAMPAIGN_CONTENT.final.tag}
            </p>
          </div>
        )}
      </div>

      <footer className="flex justify-between items-end w-full border-t border-mongol-bronze/30 pt-4">
        <div className="text-[10px] md:text-xs tracking-widest text-mongol-dirtyIvory/60">
          SPATIAL COORDINATE: [Z: {(-progress * 65).toFixed(1)}m]
        </div>

        <div className="flex items-center space-x-2 text-[10px] md:text-xs tracking-[0.3em] text-mongol-gold uppercase">
          <span>DRAG / SCROLL TO MARCH</span>
          <div className="w-1.5 h-1.5 bg-mongol-gold rounded-full animate-ping" />
        </div>
      </footer>
    </div>
  );
};`,

  'src/App.jsx': `import React, { useRef, useState, useEffect } from 'react';
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
    const handleMouseMove = (e) => {
      mouseOffset.current = {
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1,
      };
    };
    window.addEventListener('mousemove', handleMouseMove);

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
    <div className="relative bg-[#070605] w-full select-none overflow-x-hidden">
      <div className="film-grain" />
      <div className="cinematic-vignette" />

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
          <CinematicWorld scrollProgress={scrollProgress} mouseOffset={mouseOffset} />
        </Canvas>
      </div>

      <CinematicHUD progress={hudProgress} />
      <div ref={scrollTrackRef} className="h-[600vh] w-full pointer-events-none" />
    </div>
  );
}`,

  'src/main.jsx': `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);`
};

// Write all files
Object.entries(files).forEach(([relPath, content]) => {
  const fullPath = path.join(__dirname, relPath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content);
});

// Create images folder
fs.mkdirSync(path.join(__dirname, 'public', 'images'), { recursive: true });

console.log('✅ All project files written successfully.');