import { useState, Suspense } from 'react'
import './App.css'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Plane, Preload, useGLTF } from '@react-three/drei'
import { Leva, useControls } from 'leva'

// import Crate from '/public/crate/Crate'
import Crate from './ThreeModel/Scene'
import Platform from './ThreeModel/Robo'

function App2() {
  // Using Leva to control the position, scale, rotation, and color of the Crate and Platform
  const { cratePosition, crateScale, crateRotation, platformPosition, platformScale, platformRotation, showCrate, crateColor } = useControls({
    cratePosition: { value: [0.12, 0.12, 0.16], step: 0.001 },
    crateScale: { value: 0.3, step: 0.01 },
    crateRotation: { value: [0, 0, 0], step: 0.1 },
    platformPosition: { value: [0, -0.72, -0.10], step: 0.01 },
    platformScale: { value: 1, step: 0.01 },
    platformRotation: { value: [0, 0, 0], step: 0.1 },
    showCrate: { value: true },
    crateColor: { value: '#ff00ff' }, // New color control for the Crate
  })

  const position = [
    {
      start: {
        x: 0,
        y: 0,
        z: 0
      },
      end: {
        x: 1,
        y: 1,
        z: 1
      },
      placed: true
    },
    {
      start: {
        x: -1,
        y: -1,
        z: -1
      },
      end: {
        x: 2,
        y: 0,
        z: 0
      },
      placed: true
    },
   
  ]
  
  
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
          {/* {showCrate && [-1, 0, 1].map(x => (
            [-1, 0, 1].map(y => (
              [-1, 0, 1].map(z => (
                <Crate
                  color={crateColor} // Passing the color from Leva
                  key={`${x},${y},${z}`}
                  position={[x * 0.24, y * 0.24, z * 0.32]}
                  scale={0.4}
                  rotation={[0, 0, 0]}
                />
              ))
            ))
          ))} */}

         

          {
            position.map((position,index)=>{
                return <Crate key={index} position={[position.start.x*0.24, position.start.y*0.24, position.start.z*0.32]} scale={[(position.end.x - position.start.x) * 0.4,(position.end.y - position.start.y)*0.4,(position.end.z - position.start.z)*0.4]} rotation={crateRotation} opacity={position.placed?0.5:1} color={position.color} />
            })
          }
        </Suspense>
      </Canvas>
    </>
  )
}

export default App2
