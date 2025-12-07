import React, { useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Grid, Sky, PerspectiveCamera } from '@react-three/drei'
import * as THREE from 'three'
import type { Scene } from '../lib/storage'

type Props = {
  scene: Scene | null
  onItemClick?: (itemId: string, screenX: number, screenY: number) => void
  onPlaceItem?: (position: { x: number; z: number }) => void
  onMoveItem?: (x: number, z: number) => void
  selectedItemId?: string | null
  isMoving?: boolean
  isResizing?: boolean
  onResizeItem?: (newWidth: number, newDepth: number) => void
  onFinishMove?: () => void
  onFinishResize?: () => void
}

function SceneItem({ 
  item, 
  onClick,
  isSelected,
  isMoving,
  isAnyItemMoving,
  screenCoords
}: { 
  item: Scene['items'][0]
  onClick?: (screenX: number, screenY: number) => void
  isSelected?: boolean
  isMoving?: boolean
  isAnyItemMoving?: boolean
  screenCoords?: { x: number; y: number }
}) {
  const meshRef = useRef<THREE.Mesh>(null)
  
  // Color by kind
  const colorMap = {
    wall: '#4fd1c5',
    window: '#5ba8ff',
    door: '#b07dff',
    furniture: '#ffd27d',
    walls: '#4fd1c5',
    windows: '#5ba8ff',
    doors: '#b07dff',
    roof: '#4fd1c5',
  }

  const color = colorMap[item.kind] || '#ffffff'
  const opacity = 1.0
  
  return (
    <mesh
      ref={meshRef}
      position={[item.position.x, item.position.y, item.position.z]}
      rotation={[item.rotation.x, item.rotation.y, item.rotation.z]}
      frustumCulled={false}
      renderOrder={isMoving ? 2 : 0}
      onClick={(e) => {
        if (isAnyItemMoving) return
        e.stopPropagation()
        onClick?.(e.clientX, e.clientY)
      }}
    >
      <boxGeometry args={[item.dimensions.width, item.dimensions.height, item.dimensions.depth]} />
      <meshStandardMaterial 
        color={color}
        opacity={1.0}
        transparent={false}
        depthWrite={true}
        depthTest={true}
        emissive={isMoving || isSelected ? color : '#000000'}
        emissiveIntensity={isMoving || isSelected ? 0.5 : 0}
      />
    </mesh>
  )
}

function GroundPlane({ 
  scene, 
  onPlaceItem,
  isMoving,
  onMoveItem,
  onFinishMove,
  isResizing,
  onResizeItem,
  onFinishResize
}: { 
  scene: Scene
  onPlaceItem?: (pos: { x: number; z: number }) => void
  isMoving?: boolean
  onMoveItem?: (x: number, z: number) => void
  onFinishMove?: () => void
  isResizing?: boolean
  onResizeItem?: (newWidth: number, newDepth: number) => void
  onFinishResize?: () => void
}) {
  const raycaster = useRef(new THREE.Raycaster())
  const mouse = useRef(new THREE.Vector2())
  const groundRef = useRef<THREE.Mesh>(null)
  
  const handleClick = (event: any) => {
    if (event.point) {
      const x = event.point.x
      const z = event.point.z
      if (isMoving) {
        onMoveItem?.(x, z)
        onFinishMove?.()
      } else if (isResizing) {
        onFinishResize?.()
      } else {
        onPlaceItem?.({ x, z })
      }
    }
  }

  const handlePointerMove = (event: any) => {
    if (!event.point) {
      return
    }
    const x = event.point.x
    const z = event.point.z
    if (isNaN(x) || isNaN(z)) return
    
    if (isMoving) {
      onMoveItem?.(x, z)
    } else if (isResizing) {
      // For resizing: x controls width, z controls depth
      onResizeItem?.(x, z)
    }
  }
  
  return (
    <mesh 
      ref={groundRef}
      rotation={[-Math.PI / 2, 0, 0]} 
      position={[scene.bounds.width/2, -0.01, scene.bounds.depth/2]} 
      receiveShadow
      onClick={handleClick}
      onPointerMove={handlePointerMove}
    >
      <planeGeometry args={[scene.bounds.width, scene.bounds.depth]} />
      <meshStandardMaterial color="#0a1822" />
    </mesh>
  )
}

export default function Viewport3D({ 
  scene, 
  onItemClick, 
  onPlaceItem,
  selectedItemId,
  isMoving,
  isResizing,
  onMoveItem,
  onResizeItem,
  onFinishMove,
  onFinishResize
}: Props) {
  if (!scene) {
    return (
      <div style={{ 
        width: '100%', 
        height: '100%', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        color: '#c2d3de'
      }}>
        Create a project to begin
      </div>
    )
  }

  return (
    <Canvas shadows style={{ width: '100%', height: '100%' }}>
      <PerspectiveCamera makeDefault position={[20, 20, 20]} fov={60} />
      <OrbitControls enableDamping dampingFactor={0.05} target={[scene.bounds.width/2, 0, scene.bounds.depth/2]} />
      
      {/* Lighting */}
      <ambientLight intensity={0.7} />
      <directionalLight
        position={[10, 20, 10]}
        intensity={1.5}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <pointLight position={[-10, 10, -10]} intensity={0.8} />
      
      {/* Dark background */}
      <color attach="background" args={['#0a1822']} />
      
      {/* Ground grid */}
      <Grid
        args={[scene.bounds.width, scene.bounds.depth]}
        cellSize={1}
        cellThickness={0.5}
        cellColor="#4fd1c5"
        sectionSize={5}
        sectionThickness={1}
        sectionColor="#5ba8ff"
        fadeDistance={50}
        fadeStrength={1}
        position={[scene.bounds.width/2, -0.01, scene.bounds.depth/2]}
      />
      
      {/* Ground plane with click-to-place */}
      <GroundPlane 
        scene={scene} 
        onPlaceItem={onPlaceItem}
        isMoving={isMoving}
        onMoveItem={onMoveItem}
        onFinishMove={onFinishMove}
        isResizing={isResizing}
        onResizeItem={onResizeItem}
        onFinishResize={onFinishResize}
      />
      
      {/* Floor planes (transparent) */}
      {Array.from({ length: scene.floors + 1 }).map((_, i) => (
        <mesh 
          key={`floor-${i}`}
          rotation={[-Math.PI / 2, 0, 0]} 
          position={[scene.bounds.width/2, i * scene.floorHeight, scene.bounds.depth/2]}
        >
          <planeGeometry args={[scene.bounds.width, scene.bounds.depth]} />
          <meshStandardMaterial 
            color="#4fd1c5" 
            transparent 
            opacity={i === 0 ? 0.05 : 0.15}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
      
      {/* Scene items */}
      {scene.items.map(item => {
        const isSelected = selectedItemId === item.id
        const isItemMoving = isMoving && selectedItemId === item.id
        return (
          <SceneItem
            key={item.id}
            item={item}
            isSelected={isSelected}
            isMoving={isItemMoving}
            isAnyItemMoving={isMoving}
            onClick={(screenX, screenY) => onItemClick?.(item.id, screenX, screenY)}
          />
        )
      })}
    </Canvas>
  )
}
