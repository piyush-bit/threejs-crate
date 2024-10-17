// App.js
import React, { useState, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import Crate from '../public/crate/Crate';

function App() {
  const [crates, setCrates] = useState([]);
  const [isShiftDown, setIsShiftDown] = useState(false);
  const raycaster = useRef(new THREE.Raycaster());
  const planeRef = useRef();
  const [hovered, setHovered] = useState(false);

  const handlePointerMove = (e) => {
    const [intersect] = raycaster.current.intersectObject(planeRef.current);
    setHovered(!!intersect); // Toggle hover state based on whether the mouse is over the plane
  };

  const handlePointerDown = (e) => {
    const [intersect] = raycaster.current.intersectObject(planeRef.current);
    if (intersect) {
      const newCratePosition = intersect.point
        .clone()
        .add(intersect.face.normal)
        .divideScalar(50)
        .floor()
        .multiplyScalar(50)
        .addScalar(25);

      if (isShiftDown) {
        // Remove crate
        setCrates((prevCrates) =>
          prevCrates.filter(
            (crate) =>
              !crate.position.equals(newCratePosition)
          )
        );
      } else {
        // Add crate
        setCrates((prevCrates) => [
          ...prevCrates,
          { position: newCratePosition }
        ]);
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Shift') setIsShiftDown(true);
  };

  const handleKeyUp = (e) => {
    if (e.key === 'Shift') setIsShiftDown(false);
  };

  return (
    <>
      <Canvas
        onPointerMove={handlePointerMove}
        onPointerDown={handlePointerDown}
        onKeyDown={handleKeyDown}
        onKeyUp={handleKeyUp}
        tabIndex={0}
        camera={{ position: [500, 800, 1300], fov: 45 }}
        style={{ width: '100vw', height: '100vh' }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[1, 0.75, 0.5]} intensity={1} />
        <gridHelper args={[1000, 20]} />

        <mesh ref={planeRef} rotation={[-Math.PI / 2, 0, 0]} visible={false}>
          <planeGeometry args={[1000, 1000]} />
          <meshBasicMaterial />
        </mesh>

        {crates.map((crate, index) => (
          <Crate key={index} position={crate.position} />
        ))}

        {/* Apply useCursor state here */}
        {hovered ? <meshBasicMaterial color="hotpink" /> : null}
        <OrbitControls />
      </Canvas>
    </>
  );
}

export default App;
