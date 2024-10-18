import React, { useEffect, useRef } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

export default function Crate({ color = '#ffffff', opacity = 1, transparent = false, ...props }) {
  const { nodes, materials } = useGLTF('/crate/scene.gltf');
  const meshRef = useRef();
  const materialRef = useRef();

  useEffect(() => {
    if (nodes && materials) {
      // Create a new material instance for this crate
      materialRef.current = materials.box_00_material.clone();
      
      // Set properties on the new material instance
      materialRef.current.color = new THREE.Color(color);
      materialRef.current.transparent = transparent;
      materialRef.current.opacity = opacity;
      materialRef.current.needsUpdate = true;

      // Apply the new material to the mesh
      if (meshRef.current) {
        meshRef.current.material = materialRef.current;
      }
    }
  }, [color, opacity, transparent, nodes, materials]);

  return (
    <group {...props} dispose={null}>
      <group position={[0, 0, 0]} rotation={[1.564, 0, 0]} scale={0.006}>
        <mesh
          ref={meshRef}
          geometry={nodes.box_00_box_00_material_0.geometry}
          rotation={[-Math.PI, 0, 0]}
        />
      </group>
    </group>
  );
}

useGLTF.preload('/crate/scene.gltf');