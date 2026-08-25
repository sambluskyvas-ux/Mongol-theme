import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';

export const ArrowSalvo = ({ count = 50 }) => {
  const arrowsGroup = useRef();

  const arrowData = useMemo(() => {
    return Array.from({ length: count }, () => ({
      x: (Math.random() - 0.5) * 24,
      y: (Math.random() - 0.5) * 12 + 1,
      z: -70 - Math.random() * 40,
      speed: 28 + Math.random() * 22,
      rotZ: (Math.random() - 0.5) * 0.2 - 0.1,
      rotY: (Math.random() - 0.5) * 0.2,
      scale: 0.8 + Math.random() * 0.5,
    }));
  }, [count]);

  useFrame((state, delta) => {
    if (!arrowsGroup.current) return;

    arrowsGroup.current.children.forEach((child, i) => {
      const data = arrowData[i];
      if (!data || !child) return;

      child.position.z += data.speed * delta;
      child.position.y -= delta * 1.5;

      if (child.position.z > 14) {
        child.position.z = -70 - Math.random() * 30;
        child.position.x = (Math.random() - 0.5) * 24;
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
};