'use client'

import { useRef, useEffect, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Points, PointMaterial, Text } from '@react-three/drei'
import * as random from 'maath/random'
import * as THREE from 'three'

interface MousePosition {
    x: number
    y: number
}

const matrixChars = '01[]{};<>/*-+~#@'.split('')

function CodeEffect() {
    const textRefs = useRef<THREE.Group[]>([])
    const mouse = useRef<MousePosition>({ x: 0, y: 0 })
    const { viewport } = useThree()
    const textCount = 16

    const textObjects = useMemo(() =>
        Array.from({ length: textCount }, (_, i) => ({
            position: new THREE.Vector3(),
            char: matrixChars[Math.floor(Math.random() * matrixChars.length)],
            speed: 0.02 + Math.random() * 0.03,
            offset: Math.random() * Math.PI * 2,
            scale: 0.03 + Math.random() * 0.04,
            opacity: 0.6 + Math.random() * 0.4,
            radius: 0.15 + Math.random() * 0.2
        })), []
    )

    useEffect(() => {
        const handleMouseMove = (event: MouseEvent) => {
            mouse.current = {
                x: (event.clientX / window.innerWidth) * 2 - 1,
                y: -(event.clientY / window.innerHeight) * 2 + 1
            }
        }

        window.addEventListener('mousemove', handleMouseMove)
        return () => window.removeEventListener('mousemove', handleMouseMove)
    }, [])

    useFrame(({ clock }) => {
        const time = clock.getElapsedTime()
        const mouseX = mouse.current.x * viewport.width / 2
        const mouseY = mouse.current.y * viewport.height / 2

        textObjects.forEach((obj, i) => {
            if (textRefs.current[i]) {
                const angle = obj.offset + time * obj.speed
                const radius = obj.radius * (1 + Math.sin(time) * 0.1)
                const x = mouseX + Math.cos(angle) * radius
                const y = mouseY + Math.sin(angle) * radius
                const z = Math.sin(time * obj.speed + obj.offset) * 0.1

                textRefs.current[i].position.set(x, y, z)
                textRefs.current[i].rotation.z = time * obj.speed

                if (Math.random() < 0.02) {
                    obj.char = matrixChars[Math.floor(Math.random() * matrixChars.length)]
                }
            }
        })
    })

    return (
        <group>
            {/* Inner glow */}
            <mesh position={[mouse.current.x * viewport.width / 2, mouse.current.y * viewport.height / 2, -0.1]}>
                <circleGeometry args={[0.3, 32]} />
                <meshBasicMaterial
                    color="#00ff88"
                    transparent
                    opacity={0.15}
                    blending={THREE.AdditiveBlending}
                />
            </mesh>

            {/* Outer glow */}
            <mesh position={[mouse.current.x * viewport.width / 2, mouse.current.y * viewport.height / 2, -0.15]}>
                <circleGeometry args={[0.4, 32]} />
                <meshBasicMaterial
                    color="#00ff88"
                    transparent
                    opacity={0.05}
                    blending={THREE.AdditiveBlending}
                />
            </mesh>

            {textObjects.map((obj, i) => (
                <Text
                    key={i}
                    ref={el => textRefs.current[i] = el}
                    fontSize={obj.scale}
                    color="#00ff88"
                    anchorX="center"
                    anchorY="middle"
                    material-transparent={true}
                    material-opacity={obj.opacity}
                >
                    {obj.char}
                </Text>
            ))}
        </group>
    )
}

function StarField() {
    const ref = useRef<THREE.Points>(null)
    const mouse = useRef<MousePosition>({ x: 0, y: 0 })
    const { camera } = useThree()

    const particles = useMemo(() => {
        const temp = []
        for (let i = 0; i < 8000; i++) {
            const x = (Math.random() - 0.5) * 5
            const y = (Math.random() - 0.5) * 5
            const z = (Math.random() - 0.5) * 5
            temp.push(x, y, z)
        }
        return new Float32Array(temp)
    }, [])

    useEffect(() => {
        const handleMouseMove = (event: MouseEvent) => {
            mouse.current = {
                x: (event.clientX / window.innerWidth) * 2 - 1,
                y: -(event.clientY / window.innerHeight) * 2 + 1
            }
        }

        window.addEventListener('mousemove', handleMouseMove)
        return () => window.removeEventListener('mousemove', handleMouseMove)
    }, [])

    useFrame((state, delta) => {
        if (ref.current) {
            ref.current.rotation.x -= delta / 15
            ref.current.rotation.y -= delta / 20

            const targetX = mouse.current.x * 0.3
            const targetY = mouse.current.y * 0.3

            camera.position.x += (targetX - camera.position.x) * 0.05
            camera.position.y += (targetY - camera.position.y) * 0.05
            camera.lookAt(new THREE.Vector3(0, 0, 0))
        }
    })

    return (
        <group rotation={[0, 0, Math.PI / 4]}>
            <Points ref={ref} positions={particles} stride={3} frustumCulled={false}>
                <PointMaterial
                    transparent
                    color="#8a9eff"
                    size={0.005}
                    sizeAttenuation={true}
                    depthWrite={false}
                />
            </Points>
        </group>
    )
}

export default function ThreeBackground() {
    return (
        <div className="absolute inset-0">
            <Canvas
                camera={{
                    position: [0, 0, 1],
                    fov: 75,
                    near: 0.1,
                    far: 1000
                }}
            >
                <StarField />
                <CodeEffect />
                <ambientLight intensity={0.5} />
            </Canvas>
        </div>
    )
}