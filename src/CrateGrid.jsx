import React, { useRef, useEffect, useState } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

const GRID_SIZE = 3;
const CELL_SIZE = 5;

export default function CrateGrid() {
  const { scene, camera } = useThree();
  const { nodes, materials } = useGLTF('/crate/scene.gltf');
  const [objects, setObjects] = useState([]);
  const [isShiftDown, setIsShiftDown] = useState(false);
  const rollOverMeshRef = useRef();
  const raycasterRef = useRef(new THREE.Raycaster());
  const pointerRef = useRef(new THREE.Vector2());

  useEffect(() => {
    // Create grid
    const gridHelper = new THREE.GridHelper(GRID_SIZE * CELL_SIZE, GRID_SIZE);
    scene.add(gridHelper);

    // Create ground plane
    const geometry = new THREE.PlaneGeometry(GRID_SIZE * CELL_SIZE, GRID_SIZE * CELL_SIZE);
    geometry.rotateX(-Math.PI / 2);
    const plane = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ visible: false }));
    scene.add(plane);
    setObjects([plane]);

    // Event listeners
    const onDocumentKeyDown = (event) => setIsShiftDown(event.shiftKey);
    const onDocumentKeyUp = (event) => setIsShiftDown(event.shiftKey);
    document.addEventListener('keydown', onDocumentKeyDown);
    document.addEventListener('keyup', onDocumentKeyUp);

    return () => {
      document.removeEventListener('keydown', onDocumentKeyDown);
      document.removeEventListener('keyup', onDocumentKeyUp);
      scene.remove(gridHelper);
      scene.remove(plane);
    };
  }, [scene]);

  useFrame((state) => {
    const intersects = raycasterRef.current.intersectObjects(objects);

    if (intersects.length > 0) {
      const intersect = intersects[0];
      rollOverMeshRef.current.position.copy(intersect.point).add(intersect.face.normal);
      rollOverMeshRef.current.position
        .divideScalar(CELL_SIZE)
        .floor()
        .multiplyScalar(CELL_SIZE)
        .addScalar(CELL_SIZE / 2);
    }
  });

  const onPointerMove = (event) => {
    pointerRef.current.set(
      (event.clientX / window.innerWidth) * 2 - 1,
      -(event.clientY / window.innerHeight) * 2 + 1
    );
    raycasterRef.current.setFromCamera(pointerRef.current, camera);
  };

  const onPointerDown = (event) => {
    pointerRef.current.set(
      (event.clientX / window.innerWidth) * 2 - 1,
      -(event.clientY / window.innerHeight) * 2 + 1
    );
    raycasterRef.current.setFromCamera(pointerRef.current, camera);

    const intersects = raycasterRef.current.intersectObjects(objects);

    if (intersects.length > 0) {
      const intersect = intersects[0];

      if (isShiftDown) {
        if (intersect.object !== objects[0]) {
          scene.remove(intersect.object);
          setObjects((prevObjects) => prevObjects.filter((obj) => obj !== intersect.object));
        }
      } else {
        const voxel = new THREE.Mesh(
          new THREE.BoxGeometry(CELL_SIZE * 0.9, CELL_SIZE * 0.9, CELL_SIZE * 0.9),
          new THREE.MeshLambertMaterial({ color: 0xfeb74c })
        );
        voxel.position.copy(intersect.point).add(intersect.face.normal);
        voxel.position
          .divideScalar(CELL_SIZE)
          .floor()
          .multiplyScalar(CELL_SIZE)
          .addScalar(CELL_SIZE / 2);
        scene.add(voxel);
        setObjects((prevObjects) => [...prevObjects, voxel]);
      }
    }
  };

  return (
    <group onPointerMove={onPointerMove} onPointerDown={onPointerDown}>
      <mesh ref={rollOverMeshRef}>
        <boxGeometry args={[CELL_SIZE * 0.95, CELL_SIZE * 0.95, CELL_SIZE * 0.95]} />
        <meshBasicMaterial color={0xff0000} opacity={0.5} transparent />
      </mesh>
    </group>
  );
}

useGLTF.preload('/crate/scene.gltf');