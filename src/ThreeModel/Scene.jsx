import React, { useEffect, useRef } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three'; // Ensure THREE is imported

export default function Model({ color = '#ffffff', opacity = 1, transparent = false, ...props }) {
  const { nodes, materials } = useGLTF('/crate/scene.gltf');
  const meshRef = useRef();

  useEffect(() => {
    // Debugging: Log materials and nodes to ensure they are correctly loaded
    console.log('Materials:', materials);
    console.log('Nodes:', nodes);

    // Check if the material exists and set its properties dynamically
    if (materials && materials.box_00_material) {
      // Set color dynamically
      materials.box_00_material.color = new THREE.Color(color);
      materials.box_00_material.needsUpdate = true;

      // Set transparency and opacity
      materials.box_00_material.transparent = transparent;
      materials.box_00_material.opacity = opacity;
    }
  }, [color, opacity, transparent, materials]); // Update when color, opacity, or transparency changes

  return (
    <group {...props} dispose={null}>
      <group position={[0, 0, 0]} rotation={[1.564, 0, 0]} scale={0.006}>
        <mesh
          ref={meshRef}
          geometry={nodes.box_00_box_00_material_0.geometry}
          material={materials.box_00_material}
          rotation={[-Math.PI, 0, 0]}
        />
      </group>
    </group>
  );
}

useGLTF.preload('/crate/scene.gltf');

