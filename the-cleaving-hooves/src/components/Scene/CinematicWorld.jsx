import React, { useRef } from 'react';
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
};