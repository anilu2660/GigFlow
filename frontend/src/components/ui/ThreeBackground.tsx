import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial } from '@react-three/drei';

const AnimatedSphere = () => {
  const meshRef = useRef<any>(null);

  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = clock.getElapsedTime() * 0.2;
      meshRef.current.rotation.y = clock.getElapsedTime() * 0.3;
    }
  });

  return (
    <Sphere args={[1, 100, 200]} scale={2.5} ref={meshRef}>
      <MeshDistortMaterial
        color="#4f46e5"
        attach="material"
        distort={0.4}
        speed={1.5}
        roughness={0.2}
      />
    </Sphere>
  );
};

export const ThreeBackground = () => {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden bg-gray-900">
      <Canvas>
        <ambientLight intensity={1} />
        <directionalLight position={[2, 2, 2]} intensity={2} />
        <AnimatedSphere />
      </Canvas>
    </div>
  );
};
