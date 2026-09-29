"use client"

import { useRef, useMemo } from "react"
import { useFrame } from "@react-three/fiber"
import { useTexture, Line } from "@react-three/drei"
import * as THREE from "three"

interface ParticleSphereProps {
  images: string[]
  onSelectImage: (index: number) => void
}

export function ParticleSphere({ images, onSelectImage }: ParticleSphereProps) {
  const PARTICLE_COUNT = 1200 // Star particles count
  const PARTICLE_SIZE_MIN = 0.006
  const PARTICLE_SIZE_MAX = 0.015
  const SPHERE_RADIUS = 9.5
  const POSITION_RANDOMNESS = 3.5
  const ROTATION_SPEED_Y = 0.08 // Orbit speed
  const PARTICLE_OPACITY = 0.8

  const IMAGE_COUNT = images.length
  const IMAGE_SIZE = 2.0 // Image card size

  const groupRef = useRef<THREE.Group>(null)
  const coreRef1 = useRef<THREE.Mesh>(null)
  const coreRef2 = useRef<THREE.Mesh>(null)
  
  // Track pointer down coordinates to distinguish between click and drag
  const pointerDownPos = useRef({ x: 0, y: 0 })

  const textures = useTexture(images)

  // Points for a clean rectangular border line outline around the image card
  const borderPoints = useMemo(() => {
    const borderSize = IMAGE_SIZE + 0.08
    const halfB = borderSize / 2
    return [
      [-halfB, -halfB, 0] as [number, number, number],
      [halfB, -halfB, 0] as [number, number, number],
      [halfB, halfB, 0] as [number, number, number],
      [-halfB, halfB, 0] as [number, number, number],
      [-halfB, -halfB, 0] as [number, number, number],
    ]
  }, [IMAGE_SIZE])

  const particles = useMemo(() => {
    const particles = []
    const palette = ["#a78bfa", "#c084fc", "#f472b6", "#60a5fa", "#fbbf24"]

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const phi = Math.acos(-1 + (2 * i) / PARTICLE_COUNT)
      const theta = Math.sqrt(PARTICLE_COUNT * Math.PI) * phi
      const radiusVariation = SPHERE_RADIUS + (Math.random() - 0.5) * POSITION_RANDOMNESS

      const x = radiusVariation * Math.cos(theta) * Math.sin(phi)
      const y = radiusVariation * Math.cos(phi)
      const z = radiusVariation * Math.sin(theta) * Math.sin(phi)

      particles.push({
        position: [x, y, z] as [number, number, number],
        scale: Math.random() * (PARTICLE_SIZE_MAX - PARTICLE_SIZE_MIN) + PARTICLE_SIZE_MIN,
        color: new THREE.Color(palette[i % palette.length]),
      })
    }

    return particles
  }, [PARTICLE_COUNT, SPHERE_RADIUS, POSITION_RANDOMNESS, PARTICLE_SIZE_MIN, PARTICLE_SIZE_MAX])

  const orbitingImages = useMemo(() => {
    const images = []
    const borderColors = ["#818cf8", "#f472b6", "#34d399", "#fb7185", "#38bdf8"]

    for (let i = 0; i < IMAGE_COUNT; i++) {
      const angle = (i / IMAGE_COUNT) * Math.PI * 2
      const x = SPHERE_RADIUS * Math.cos(angle)
      const y = 0
      const z = SPHERE_RADIUS * Math.sin(angle)

      const position = new THREE.Vector3(x, y, z)
      const center = new THREE.Vector3(0, 0, 0)
      const outwardDirection = position.clone().sub(center).normalize()

      const euler = new THREE.Euler()
      const matrix = new THREE.Matrix4()
      matrix.lookAt(position, position.clone().add(outwardDirection), new THREE.Vector3(0, 1, 0))
      euler.setFromRotationMatrix(matrix)

      images.push({
        position: [x, y, z] as [number, number, number],
        rotation: [euler.x, euler.y, euler.z] as [number, number, number],
        textureIndex: i % textures.length,
        borderColor: new THREE.Color(borderColors[i % borderColors.length]),
      })
    }

    return images
  }, [IMAGE_COUNT, SPHERE_RADIUS, textures.length])

  useFrame((state) => {
    const elapsed = state.clock.getElapsedTime()

    // Rotate main group
    if (groupRef.current) {
      groupRef.current.rotation.y = elapsed * ROTATION_SPEED_Y
      groupRef.current.position.y = Math.sin(elapsed * 0.4) * 0.4
    }

    // Spin inner cores
    if (coreRef1.current) {
      coreRef1.current.rotation.y = -elapsed * 0.15
      coreRef1.current.rotation.x = elapsed * 0.1
    }
    if (coreRef2.current) {
      coreRef2.current.rotation.y = elapsed * 0.25
      coreRef2.current.rotation.z = -elapsed * 0.15
    }
  })

  return (
    <group>
      {/* Central Nebula Glowing Core */}
      <group>
        <pointLight position={[0, 0, 0]} color="#c084fc" intensity={8} distance={20} decay={1.5} />
        <pointLight position={[0, 0, 0]} color="#f472b6" intensity={4} distance={15} decay={2} />

        <mesh ref={coreRef1} position={[0, 0, 0]}>
          <sphereGeometry args={[2.5, 16, 16]} />
          <meshBasicMaterial color="#a78bfa" wireframe transparent opacity={0.15} />
        </mesh>

        <mesh ref={coreRef2} position={[0, 0, 0]}>
          <octahedronGeometry args={[1.5, 2]} />
          <meshBasicMaterial color="#f472b6" wireframe transparent opacity={0.25} />
        </mesh>

        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[0.3, 16, 16]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.8} />
        </mesh>
      </group>

      <group ref={groupRef}>
        {/* Galaxy stars/particles */}
        {particles.map((particle, index) => (
          <mesh key={`p-${index}`} position={particle.position} scale={particle.scale}>
            <sphereGeometry args={[1, 6, 6]} />
            <meshBasicMaterial color={particle.color} transparent opacity={PARTICLE_OPACITY} />
          </mesh>
        ))}

        {/* Orbiting hologram glass panels */}
        {orbitingImages.map((image, index) => (
          <group
            key={`img-grp-${index}`}
            position={image.position}
            rotation={image.rotation}
            onPointerDown={(e) => {
              e.stopPropagation()
              // Store mouse position on down
              pointerDownPos.current = { x: e.nativeEvent.clientX, y: e.nativeEvent.clientY }
            }}
            onPointerUp={(e) => {
              e.stopPropagation()
              // Calculate distance moved to prevent opening lightbox on drag/rotate
              const dx = e.nativeEvent.clientX - pointerDownPos.current.x
              const dy = e.nativeEvent.clientY - pointerDownPos.current.y
              const dist = Math.sqrt(dx * dx + dy * dy)
              
              // Only open lightbox if the drag distance is negligible (less than 6 pixels)
              if (dist < 6) {
                onSelectImage(image.textureIndex)
              }
            }}
            onPointerOver={(e) => {
              e.stopPropagation()
              document.body.style.cursor = "pointer"
            }}
            onPointerOut={(e) => {
              e.stopPropagation()
              document.body.style.cursor = "auto"
            }}
          >
            {/* Clean Vector Line Border Outline (Sleek HUD border with transparent center, avoids blocking image backs) */}
            <group position={[0, 0, -0.005]}>
              <Line
                points={borderPoints}
                color={image.borderColor}
                lineWidth={2}
              />
            </group>

            {/* Glass Pane Backing */}
            <mesh position={[0, 0, -0.01]}>
              <planeGeometry args={[IMAGE_SIZE + 0.08, IMAGE_SIZE + 0.08]} />
              <meshPhysicalMaterial
                color="#0f0f15"
                transmission={0.85}
                opacity={0.6}
                transparent
                roughness={0.05}
                metalness={0.1}
                clearcoat={1}
                clearcoatRoughness={0.05}
                side={THREE.DoubleSide}
              />
            </mesh>

            {/* Image Plane */}
            <mesh>
              <planeGeometry args={[IMAGE_SIZE, IMAGE_SIZE]} />
              <meshBasicMaterial
                map={textures[image.textureIndex]}
                side={THREE.DoubleSide}
              />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  )
}
