import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, Instance, Instances, Text } from '@react-three/drei';
import * as THREE from 'three';

export const Sequence4Matchmaker = () => {
  const sodiumRef = useRef<THREE.Group>(null);
  const chlorineRef = useRef<THREE.Group>(null);
  const electronRef = useRef<THREE.Mesh>(null);
  const latticeGroupRef = useRef<THREE.Group>(null);

  // States for animation sequencing
  // We use elapsed time to drive a state machine:
  // 0-3s: Floating atoms
  // 3-4s: Electron transfer
  // 4-6s: Snapping together
  // 6-10s: Building the lattice
  
  // NaCl Lattice Generation (alternating Na and Cl)
  const gridSize = 3;
  const latticeSpacing = 1.0;
  
  const latticeData = useMemo(() => {
    const na = [];
    const cl = [];
    for (let x = 0; x < gridSize; x++) {
      for (let y = 0; y < gridSize; y++) {
        for (let z = 0; z < gridSize; z++) {
          const pos = new THREE.Vector3(
            (x - gridSize/2) * latticeSpacing, 
            (y - gridSize/2) * latticeSpacing, 
            (z - gridSize/2) * latticeSpacing
          );
          // Alternating pattern
          if ((x + y + z) % 2 === 0) na.push(pos);
          else cl.push(pos);
        }
      }
    }
    return { na, cl };
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const cycle = t % 12; // 12 second loop

    // --- Phase 1: Floating & Approaching (0 - 3s) ---
    if (cycle < 3) {
        if (sodiumRef.current) {
            sodiumRef.current.position.set(-3 + cycle, 0, 0);
            sodiumRef.current.visible = true;
        }
        if (chlorineRef.current) {
            chlorineRef.current.position.set(3 - cycle, 0, 0);
            chlorineRef.current.visible = true;
        }
        if (electronRef.current) {
            electronRef.current.visible = true;
            // Orbiting sodium
            electronRef.current.position.set(
                 Math.cos(t * 5) * 1.5,
                 Math.sin(t * 5) * 1.5,
                 0
            );
        }
        if (latticeGroupRef.current) latticeGroupRef.current.visible = false;
    }
    
    // --- Phase 2: Electron Transfer (3 - 4s) ---
    else if (cycle >= 3 && cycle < 4) {
        const progress = cycle - 3; // 0 to 1
        if (electronRef.current && sodiumRef.current && chlorineRef.current) {
             // Electron travels from Na to Cl
             const naPos = sodiumRef.current.position;
             const clPos = chlorineRef.current.position;
             electronRef.current.position.lerpVectors(naPos, clPos, progress);
        }
    }
    
    // --- Phase 3: Snapping Together (4 - 6s) ---
    else if (cycle >= 4 && cycle < 6) {
        if (electronRef.current) electronRef.current.visible = false;
        
        // Colors shift to indicate charge changes
        // Handled via materials below (could interpolate, but step change works for impact)
        
        if (sodiumRef.current && chlorineRef.current) {
            // They attract and snap together at origin
            sodiumRef.current.position.lerp(new THREE.Vector3(-0.5, 0, 0), 0.1);
            chlorineRef.current.position.lerp(new THREE.Vector3(0.5, 0, 0), 0.1);
        }
    }

    // --- Phase 4: Building the Lattice (6 - 12s) ---
    else if (cycle >= 6) {
        if (sodiumRef.current) sodiumRef.current.visible = false;
        if (chlorineRef.current) chlorineRef.current.visible = false;
        
        if (latticeGroupRef.current) {
            latticeGroupRef.current.visible = true;
            latticeGroupRef.current.rotation.y = t * 0.2;
            latticeGroupRef.current.rotation.x = t * 0.1;
            
            // Build animation: scale up from 0 to 1
            const progress = Math.min((cycle - 6) / 2, 1); // Full scale at 8s
            latticeGroupRef.current.scale.setScalar(progress);
        }
    }
  });

  return (
    <group position={[0, -1, -5]}>
      {/* Individual Sodium Atom */}
      <group ref={sodiumRef}>
        <Sphere args={[0.8, 32, 32]}>
             <meshStandardMaterial color="#86efac" /> {/* Glowing green initially */}
        </Sphere>
        {/* Core label */}
        <Text position={[0,0,1]} fontSize={0.5} color="black">Na</Text>
      </group>

      {/* Individual Chlorine Atom */}
      <group ref={chlorineRef}>
        <Sphere args={[1.2, 32, 32]}>
             <meshStandardMaterial color="#d9f99d" transparent opacity={0.8} /> {/* Pale green gas */}
        </Sphere>
        <Text position={[0,0,1.3]} fontSize={0.5} color="black">Cl</Text>
      </group>

      {/* The Transferring Electron */}
      <Sphere ref={electronRef} args={[0.1, 16, 16]}>
        <meshBasicMaterial color="#fde047" />
      </Sphere>

      {/* The Resulting NaCl Lattice */}
      <group ref={latticeGroupRef} visible={false}>
          {/* Sodium Ions (now positive/blue) */}
          <Instances limit={latticeData.na.length} range={latticeData.na.length}>
                <sphereGeometry args={[0.4, 32, 32]} />
                <meshStandardMaterial color="#3b82f6" emissive="#1d4ed8" emissiveIntensity={0.2} />
                {latticeData.na.map((pos, i) => <Instance key={`na-${i}`} position={pos} />)}
          </Instances>

          {/* Chlorine Ions (now negative/red) */}
          <Instances limit={latticeData.cl.length} range={latticeData.cl.length}>
                <sphereGeometry args={[0.6, 32, 32]} />
                <meshStandardMaterial color="#ef4444" emissive="#b91c1c" emissiveIntensity={0.2} />
                {latticeData.cl.map((pos, i) => <Instance key={`cl-${i}`} position={pos} />)}
          </Instances>
      </group>
    </group>
  );
};
