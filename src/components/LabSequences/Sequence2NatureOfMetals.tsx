import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Instance, Instances } from '@react-three/drei';
import * as THREE from 'three';

export const Sequence2NatureOfMetals = () => {
  const electronGroupRef = useRef<THREE.Group>(null);
  const latticeGroupRef = useRef<THREE.Group>(null);

  // --- Copper Lattice ---
  // Create a 3x3x3 grid for the lattice
  const gridSize = 4;
  const latticeSpacing = 1.5;
  const copperPositions = useMemo(() => {
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

  // --- Electron Sea ---
  const electronCount = 200;
  const electronPositions = useMemo(() => {
    const pos = [];
    for (let i = 0; i < electronCount; i++) {
        // Randomly distribute electrons within the lattice bounds
        const bound = (gridSize * latticeSpacing) / 2;
        pos.push({
            start: new THREE.Vector3(
                (Math.random() - 0.5) * bound * 2,
                (Math.random() - 0.5) * bound * 2,
                (Math.random() - 0.5) * bound * 2
            ),
            speed: 2 + Math.random() * 3,
            offset: Math.random() * Math.PI * 2
        });
    }
    return pos;
  }, []);

  // Animation Loop
  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    // Rotate the entire lattice slowly so user can see 3D structure
    if (latticeGroupRef.current) {
        latticeGroupRef.current.rotation.y = t * 0.2;
        latticeGroupRef.current.rotation.x = t * 0.1;
    }

    // Animate Electron Sea flowing through the lattice
    if (electronGroupRef.current) {
        electronGroupRef.current.rotation.y = t * 0.2;
        electronGroupRef.current.rotation.x = t * 0.1;

        electronGroupRef.current.children.forEach((child, i) => {
            const electron = electronPositions[i];
            // Electrons flow rapidly in a wave pattern
            const flowZ = electron.start.z + (t * electron.speed) % ((gridSize * latticeSpacing));
            
            // Loop back to start to create continuous stream
            const halfBound = (gridSize * latticeSpacing) / 2;
            let currentZ = flowZ;
            if (currentZ > halfBound) currentZ -= (halfBound * 2);

            child.position.set(
               electron.start.x + Math.sin(t * 2 + electron.offset) * 0.2, // slight wiggle
               electron.start.y + Math.cos(t * 2 + electron.offset) * 0.2,
               currentZ
            );
        });
    }
  });

  return (
    <group position={[0, -1, -5]}>
      {/* Copper Lattice (Positive Ions) */}
      <group ref={latticeGroupRef}>
        <Instances limit={copperPositions.length} range={copperPositions.length}>
            <sphereGeometry args={[0.4, 32, 32]} />
            <meshStandardMaterial 
                color="#ea580c" // Copper orange
                emissive="#9a3412" 
                emissiveIntensity={0.2}
                metalness={0.8}
                roughness={0.2}
            />
            {copperPositions.map((pos, i) => (
                <Instance key={i} position={pos} />
            ))}
        </Instances>
      </group>

      {/* Electron Sea (Negative Flow) */}
      <group ref={electronGroupRef}>
         {electronPositions.map((_, i) => (
             <mesh key={`electron-${i}`}>
                 <sphereGeometry args={[0.08, 8, 8]} />
                 <meshBasicMaterial color="#fde047" /> {/* Bright yellow sparks */}
             </mesh>
         ))}
      </group>

      {/* 
        Implementation Note: Malleability Hammer 
        For true malleability visualization, we could animate rows of the array sliding.
        To keep performance high for this first pass, the rotation and flowing sea clearly 
        demonstrate the "mesh" nature of metals. 
      */}
    </group>
  );
};
