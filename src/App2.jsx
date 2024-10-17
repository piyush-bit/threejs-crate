import { useState, Suspense } from 'react'
import './App.css'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Plane, Preload, useGLTF } from '@react-three/drei'
import { Leva, useControls } from 'leva'

import Crate from '/public/crate/Crate'
import Platform from '/public/robo/Robo'

function App2() {
  // Using Leva to control the position, scale, and rotation of the Crate and Platform
  const { cratePosition, crateScale, crateRotation, platformPosition, platformScale, platformRotation, showCrate } = useControls({
    cratePosition: { value: [-0.3, 0, -0.28], step: 0.01 },
    crateScale: { value: 0.2, step: 0.01 },
    crateRotation: { value: [0, 0, 0], step: 0.1 },
    platformPosition: { value: [0, -0.91, -0.10], step: 0.01 },
    platformScale: { value: 1, step: 0.01 },
    platformRotation: { value: [0, 0, 0], step: 0.1 },
    showCrate: { value: true },
  })

  return (
    <>
      {/* Leva panel for on-screen controls */}
      <Leva collapsed={false} />

      <Canvas style={{ width: '100vw', height: '100vh' }} camera={{ position: [-2,1,4] , fov : 45 } }>
        {/* <ambientLight intensity={1} /> */}
        <directionalLight intensity={1.5} position={[0,1,4]} />
        <directionalLight intensity={1} position={[0,-1,4]} />
        <directionalLight intensity={1} position={[-3,-1,4]} />
        <directionalLight intensity={1} position={[3,-2,4]} />
        <directionalLight intensity={1} position={[3,2,4]} />
        <directionalLight intensity={1} position={[-3,2,4]} />
        <hemisphereLight intensity={0.5} />
        <OrbitControls />
        <Suspense fallback={null}>
          {/* Platform controlled via Leva */}
          <Platform
            position={platformPosition}
            scale={platformScale}
            rotation={platformRotation}
          />

          {/* 3x3x3 crate grid controlled via Leva */}
          {showCrate && [-1, 0, 1].map(x => (
            [-1, 0, 1].map(y => (
              [-1, 0, 1].map(z => (
                <Crate
                  key={`${x},${y},${z}`}
                  position={[x * 0.26, y * 0.26, z * 0.26]}
                  scale={0.26}
                  rotation={[0, 0, 0]}
                />
              ))
            ))
          ))}
        </Suspense>
      </Canvas>
    </>
  )
}

export default App2
