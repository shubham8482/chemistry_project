import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, Instance, Instances, Float } from '@react-three/drei';
import * as THREE from 'three';

export const Sequence3GreatDivider = () => {
  const goldGroupRef = useRef<THREE.Group>(null);
  const sodiumGroupRef = useRef<THREE.Group>(null);
  const explosionRef = useRef<THREE.Mesh>(null);
  const waterRef = useRef<THREE.Group>(null);

  // --- Lattices ---
  const gridSize = 4;
  const latticeSpacing = 1.2;
  const positions = useMemo(() => {
    const pos = [];
    for (let x = 0; x < gridSize; x++) {
      for (let y = 0; y < gridSize; y++) {
        for (let z = 0; z < gridSize; z++) {
          pos.push(new THREE.Vector3(
            (x - gridSize/2) * latticeSpacing, 
            (y - gridSize/2) * latticeSpacing, 
            (z - gridSize/2) * latticeSpacing
          ));
        }
      }
    }
    return pos;
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    
    if (goldGroupRef.current) goldGroupRef.current.rotation.y = t * 0.1;
    if (sodiumGroupRef.current) sodiumGroupRef.current.rotation.y = -t * 0.1;

    // Animate water droplet approaching sodium
    if (waterRef.current && explosionRef.current) {
        // Water starts at y=5, drops down to y=0 (where sodium is)
        // Reset every 4 seconds
        const cycle = t % 4;
        
        if (cycle < 2) {
            // Falling
            waterRef.current.position.y = 5 - (cycle * 2.5); // 5 to 0
            waterRef.current.visible = true;
            
            // Sodium glowing increases as water approaches
            const material = explosionRef.current.material as THREE.MeshStandardMaterial;
            material.opacity = 0;
        } else {
            // Explosion!
            waterRef.current.visible = false;
            const material = explosionRef.current.material as THREE.MeshStandardMaterial;
            
            // Rapid fade out for explosion
            const explosionProgress = cycle - 2; // 0 to 2
            if (explosionProgress < 0.2) {
                material.opacity = 1; // Flash!
                explosionRef.current.scale.setScalar(explosionProgress * 40);
            } else {
                material.opacity = THREE.MathUtils.lerp(material.opacity, 0, 0.1);
            }
        }
    }
  });

  return (
    <group position={[0, -1, -5]}>
      {/* LEFT SIDE: Sodium (Alkali - Explosive) */}
      <group position={[-5, 0, 0]}>
        <group ref={sodiumGroupRef}>
            <Instances limit={positions.length} range={positions.length}>
                <sphereGeometry args={[0.5, 32, 32]} />
                <meshStandardMaterial 
                    color="#e5e7eb" // Silvery white
                    roughness={0.4}
                />
                {positions.map((pos, i) => <Instance key={i} position={pos} />)}
            </Instances>
        </group>
        
        {/* The Water Droplet for Sodium */}
        <group ref={waterRef} position={[0, 5, 0]} scale={0.5}>
            <Sphere args={[0.3, 16, 16]} position={[0,0,0]}>
                <meshStandardMaterial color="#ef4444" />
            </Sphere>
            <Sphere args={[0.15, 16, 16]} position={[-0.3,-0.2,0]}>
                <meshStandardMaterial color="#ffffff" />
            </Sphere>
            <Sphere args={[0.15, 16, 16]} position={[0.3,-0.2,0]}>
                <meshStandardMaterial color="#ffffff" />
            </Sphere>
        </group>

        {/* The Explosion Sphere */}
        <Sphere ref={explosionRef} args={[1, 32, 32]} position={[0, 0, 0]}>
            <meshStandardMaterial 
                color="#fef08a" 
                emissive="#facc15" 
                emissiveIntensity={5} 
                transparent 
                opacity={0} 
            />
        </Sphere>
      </group>

      {/* RIGHT SIDE: Gold (Precious - Stable) */}
      <group position={[5, 0, 0]}>
         <group ref={goldGroupRef}>
            <Instances limit={positions.length} range={positions.length}>
                <sphereGeometry args={[0.55, 32, 32]} />
                <meshStandardMaterial 
                    color="#fbbf24" // Gold
                    emissive="#b45309"
                    emissiveIntensity={0.2}
                    metalness={1}
                    roughness={0.1}
                />
                {positions.map((pos, i) => <Instance key={i} position={pos} />)}
            </Instances>
        </group>
        
        {/* Static water droplets bouncing off/doing nothing */}
        <Float speed={4} rotationIntensity={0} floatIntensity={0.5} position={[0, 3, 0]}>
            <Sphere args={[0.4, 16, 16]}>
                 <meshPhysicalMaterial 
                    color="#60a5fa" 
                    transparent 
                    opacity={0.6} 
                    roughness={0} 
                    transmission={1} 
                />
            </Sphere>
        </Float>
      </group>
    </group>
  );
};
