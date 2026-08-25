import React, { useMemo, useRef } from 'react';
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
};