import React from 'react'
import { Text } from '@react-three/drei'

const Loader3D = () => {
  return (
    <Text
      position={[0, 0, 0]}
      fontSize={0.5}
      color="black"
      anchorX="center"
      anchorY="middle"
    >
      Loading 3D Scene...
    </Text>
  )
}

export default Loader3D