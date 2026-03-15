import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, Float, Instance, Instances, Line } from '@react-three/drei';
import * as THREE from 'three';

export const Sequence1CosmicZoom = () => {
  const groupRef = useRef<THREE.Group>(null);
  const appleRef = useRef<THREE.Mesh>(null);
  
  // Animation state
  // We want to simulate aggressively zooming INTO the apple
  // We can do this by scaling the entire group up rapidly and moving it over the camera
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    
    if (groupRef.current) {
        // Slowly rotate the entire scene
        groupRef.current.rotation.y = t * 0.1;
        
        // Zoom-in effect: expand the group over the first few seconds
        const scaleProgress = Math.min(t * 0.8, 1); // 0 to 1 over first ~1.25s
        // Map 0->1 to 1->50 (Apple gets huge, effectively zooming camera in)
        const targetScale = 1 + (scaleProgress * 40);
        groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.05);

        // Move the group forward towards camera to pass through "skin"
        const zPos = scaleProgress * 8; // Move towards camera at z=10
        groupRef.current.position.lerp(new THREE.Vector3(0, 0, zPos), 0.05);
    }

    if (appleRef.current) {
        // Fade out apple apple after we zoom past a certain point
        const material = appleRef.current.material as THREE.MeshPhysicalMaterial;
        if (groupRef.current && groupRef.current.scale.x > 15) {
            material.opacity = THREE.MathUtils.lerp(material.opacity, 0.1, 0.05);
        } else {
             material.opacity = THREE.MathUtils.lerp(material.opacity, 1, 0.1);
        }
    }
  });

  // Generate a random molecular lattice (organic molecules inside the apple)
  const atomsCount = 150;
  const positions = useMemo(() => {
    const pos = [];
    for (let i = 0; i < atomsCount; i++) {
        // Distribute them inside the apple volume (radius ~2)
        const radius = 1.5 * Math.cbrt(Math.random());
        const theta = Math.random() * 2 * Math.PI;
        const phi = Math.acos(2 * Math.random() - 1);
        const x = radius * Math.sin(phi) * Math.cos(theta);
        const y = radius * Math.sin(phi) * Math.sin(theta);
        const z = radius * Math.cos(phi);
        pos.push(new THREE.Vector3(x, y, z));
    }
    return pos;
  }, []);

  return (
    <group ref={groupRef}>
      {/* The Apple (Scaling up massively to simulate zoom) */}
      <Sphere ref={appleRef} args={[2, 64, 64]} position={[0, 0, 0]}>
        <meshPhysicalMaterial 
            color="#ef4444" 
            roughness={0.2} 
            metalness={0.1}
            clearcoat={1.0}
            clearcoatRoughness={0.1}
            transparent={true}
            opacity={1}
            side={THREE.DoubleSide}
        />
      </Sphere>

      {/* The Molecular Environment (revealed when apple becomes transparent/scaled up) */}
      <group scale={0.2}> {/* Scale down initially so it fits inside apple */}
        
        {/* Atoms (Instances for performance) */}
        <Instances limit={atomsCount} range={atomsCount}>
            <sphereGeometry args={[0.2, 16, 16]} />
            <meshStandardMaterial color="#3b82f6" emissive="#1e3a8a" emissiveIntensity={0.5} />
            {positions.map((pos, i) => (
                <Instance key={i} position={pos} />
            ))}
        </Instances>

        {/* Energy stick bonds between nearby atoms */}
        {positions.map((pos, i) => {
            // Find a close neighbor
            if (i < positions.length - 1 && pos.distanceTo(positions[i+1]) < 0.8) {
                return (
                    <Line 
                        key={`line-${i}`}
                        points={[pos, positions[i+1]]} 
                        color="#60a5fa" 
                        lineWidth={2}
                        transparent 
                        opacity={0.6}
                    />
                );
            }
            return null;
        })}

        {/* Floating H2O Molecule */}
        <Float speed={2} rotationIntensity={2} floatIntensity={2} position={[0, 0, 2]}>
            <group scale={2}>
                {/* Oxygen */}
                <Sphere args={[0.3, 32, 32]} position={[0, 0, 0]}>
                    <meshStandardMaterial color="#ef4444" roughness={0.1} metalness={0.5} />
                </Sphere>
                {/* Hydrogen 1 */}
                <Sphere args={[0.15, 32, 32]} position={[-0.3, -0.25, 0]}>
                    <meshStandardMaterial color="#ffffff" roughness={0.1} />
                </Sphere>
                {/* Hydrogen 2 */}
                <Sphere args={[0.15, 32, 32]} position={[0.3, -0.25, 0]}>
                    <meshStandardMaterial color="#ffffff" roughness={0.1} />
                </Sphere>
                {/* Bonds */}
                <Line points={[[-0.3, -0.25, 0], [0,0,0]]} color="#ffffff" lineWidth={3} />
                <Line points={[[0.3, -0.25, 0], [0,0,0]]} color="#ffffff" lineWidth={3} />
            </group>
        </Float>
      </group>
    </group>
  );
};
