import { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { useSpring, animated } from '@react-spring/three';

function ShootingStar() {
    const starRef = useRef<THREE.Mesh>(null!);
    const speed = Math.random() * 2 + 1;
    const distance = Math.random() * 30 + 20;
    const trailLength = Math.random() * 10 + 5;

    const initialPosition = useMemo(() => ({
        x: Math.random() * 60 - 30,
        y: Math.random() * 40 + 20,
        z: Math.random() * 10 - 5
    }), []);

    useFrame((state) => {
        if (starRef.current) {
            const time = state.clock.getElapsedTime();
            const angle = Math.PI / 4;

            starRef.current.position.x = initialPosition.x - (time * speed * Math.cos(angle)) % distance;
            starRef.current.position.y = initialPosition.y - (time * speed * Math.sin(angle)) % distance;
            starRef.current.position.z = initialPosition.z + Math.sin(time * 2) * 0.5;

            if (starRef.current.position.x < -30 || starRef.current.position.y < -20) {
                starRef.current.position.x = Math.random() * 30 + 30;
                starRef.current.position.y = Math.random() * 40 + 20;
                starRef.current.position.z = Math.random() * 10 - 5;
            }
        }
    });

    return (
        <group>
            <mesh ref={starRef} position={[initialPosition.x, initialPosition.y, initialPosition.z]}>
                <sphereGeometry args={[0.2, 16, 16]} />
                <meshBasicMaterial color="#ffffff" />
                <Trail length={trailLength} />
            </mesh>
            <pointLight
                position={[initialPosition.x, initialPosition.y, initialPosition.z]}
                intensity={0.5}
                distance={5}
                color="#ffffff"
            />
        </group>
    );
}

function Trail({ length }: { length: number }) {
    const trailRef = useRef<THREE.Points>(null!);
    const trailCount = 30;
    const positions = new Float32Array(trailCount * 3);
    const colors = new Float32Array(trailCount * 3);

    useFrame(() => {
        if (trailRef.current && trailRef.current.parent) {
            const parentPos = trailRef.current.parent.position;

            for (let i = trailCount - 1; i > 0; i--) {
                positions[i * 3] = positions[(i - 1) * 3];
                positions[i * 3 + 1] = positions[(i - 1) * 3 + 1];
                positions[i * 3 + 2] = positions[(i - 1) * 3 + 2];

                const alpha = 1 - (i / trailCount);
                colors[i * 3] = alpha;
                colors[i * 3 + 1] = alpha;
                colors[i * 3 + 2] = alpha;
            }

            positions[0] = parentPos.x;
            positions[1] = parentPos.y;
            positions[2] = parentPos.z;
            colors[0] = 1;
            colors[1] = 1;
            colors[2] = 1;

            trailRef.current.geometry.setAttribute(
                'position',
                new THREE.Float32BufferAttribute(positions, 3)
            );
            trailRef.current.geometry.setAttribute(
                'color',
                new THREE.Float32BufferAttribute(colors, 3)
            );
        }
    });

    return (
        <points ref={trailRef}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={trailCount}
                    array={positions}
                    itemSize={3}
                />
                <bufferAttribute
                    attach="attributes-color"
                    count={trailCount}
                    array={colors}
                    itemSize={3}
                />
            </bufferGeometry>
            <pointsMaterial
                size={0.1}
                vertexColors
                transparent
                opacity={0.6}
                blending={THREE.AdditiveBlending}
            />
        </points>
    );
}

function UFO() {
    const ufoRef = useRef<THREE.Group>(null!);
    const [hover, setHover] = useState(false);
    const baseSpeed = Math.random() * 0.3 + 0.2;
    const [position] = useState(() => ({
        x: Math.random() * 40 - 20,
        y: Math.random() * 30 - 15,
        z: Math.random() * 10
    }));

    const { scale, rotationIntensity } = useSpring({
        scale: hover ? 1.2 : 1,
        rotationIntensity: hover ? 2 : 1,
        config: { mass: 1, tension: 280, friction: 60 }
    });

    useFrame((state) => {
        if (ufoRef.current) {
            const time = state.clock.getElapsedTime();

            const x = position.x + Math.sin(time * baseSpeed) * 10 + Math.cos(time * baseSpeed * 0.5) * 5;
            const y = position.y + Math.cos(time * baseSpeed) * 8 + Math.sin(time * baseSpeed * 0.7) * 4;
            const z = position.z + Math.sin(time * baseSpeed * 0.3) * 3;

            ufoRef.current.position.set(x, y, z);

            const rotationSpeed = hover ? 0.05 : 0.02;
            ufoRef.current.rotation.y += rotationSpeed;
            ufoRef.current.rotation.z = Math.sin(time * baseSpeed) * 0.2;

            const lights = ufoRef.current.children.filter(
                (child): child is THREE.PointLight => child.type === 'PointLight'
            );
        }
    });

    return (
        <animated.group
            ref={ufoRef}
            scale={scale}
            onPointerOver={() => setHover(true)}
            onPointerOut={() => setHover(false)}
            position={[position.x, position.y, position.z]}
        >
            <mesh>
                <cylinderGeometry args={[1.5, 1.5, 0.3, 32]} />
                <meshStandardMaterial
                    color="#8a8a8a"
                    metalness={0.9}
                    roughness={0.1}
                    emissive="#4a6ea5"
                    emissiveIntensity={hover ? 0.5 : 0.2}
                />
            </mesh>

            <mesh position={[0, 0.3, 0]}>
                <sphereGeometry args={[0.8, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
                <meshPhysicalMaterial
                    color="#87CEEB"
                    transparent
                    opacity={0.9}
                    metalness={0.5}
                    roughness={0.1}
                    transmission={0.5}
                    thickness={0.5}
                />
            </mesh>

            {[0, 72, 144, 216, 288].map((angle, i) => (
                <pointLight
                    key={i}
                    position={[
                        Math.cos((angle * Math.PI) / 180) * 1.2,
                        -0.1,
                        Math.sin((angle * Math.PI) / 180) * 1.2
                    ]}
                    intensity={hover ? 0.8 : 0.3}
                    color={hover ? "#00ff00" : "#ffff00"}
                    distance={3}
                />
            ))}

            <pointLight
                position={[0, -0.2, 0]}
                intensity={hover ? 1 : 0.5}
                color="#4a6ea5"
                distance={2}
            />
        </animated.group>
    );
}

function Stars() {
    const points = useRef<THREE.Points>(null!);
    const starsCount = 3000;

    const [starColors] = useState(() => {
        const colors = new Float32Array(starsCount * 3);
        for (let i = 0; i < starsCount; i++) {
            const r = 0.9 + Math.random() * 0.1;
            const g = 0.9 + Math.random() * 0.1;
            const b = 1;
            colors[i * 3] = r;
            colors[i * 3 + 1] = g;
            colors[i * 3 + 2] = b;
        }
        return colors;
    });

    const positions = useMemo(() => {
        const pos = new Float32Array(starsCount * 3);
        for (let i = 0; i < starsCount; i++) {
            const radius = Math.random() * 50 + 20;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.random() * Math.PI;

            pos[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
            pos[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
            pos[i * 3 + 2] = radius * Math.cos(phi);
        }
        return pos;
    }, []);

    useFrame((state) => {
        points.current.rotation.y = state.clock.getElapsedTime() * 0.01;
        points.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.005) * 0.1;
    });

    return (
        <Points ref={points} positions={positions}>
            <PointMaterial
                transparent
                vertexColors
                size={0.5}
                sizeAttenuation={true}
                depthWrite={false}
                blending={THREE.AdditiveBlending}
            />
            <bufferAttribute
                attach="geometry-attributes-color"
                count={starsCount}
                array={starColors}
                itemSize={3}
            />
        </Points>
    );
}

function Moon({ scrollProgress }: { scrollProgress: number }) {
    const moonRef = useRef<THREE.Group>(null!);
    const [textureError, setTextureError] = useState(false);

    const moonTexture = useTexture('assets/foto/moon-texture.jpg', (texture) => {
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.anisotropy = 16;
        texture.mapping = THREE.EquirectangularReflectionMapping;
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(1, 1);
    });

    useFrame((state) => {
        if (moonRef.current) {
            const time = state.clock.getElapsedTime();
            moonRef.current.rotation.y = time * 0.05;
            moonRef.current.position.y = Math.sin(time * 0.2) * 0.3;
        }
    });

    const { scale } = useSpring({
        scale: 0.8 + scrollProgress * 0.1,
        config: { mass: 1, tension: 120, friction: 14 }
    });

    const material = textureError || !moonTexture ? (
        <meshStandardMaterial
            color="#8a8a8a"
            metalness={0.3}
            roughness={0.7}
            emissive="#4a6ea5"
            emissiveIntensity={0.15}
        />
    ) : (
        <meshStandardMaterial
            map={moonTexture}
            metalness={0.3}
            roughness={0.7}
            emissive="#4a6ea5"
            emissiveIntensity={0.15}
            side={THREE.FrontSide}
        />
    );

    return (
        <animated.group ref={moonRef} scale={scale} position={[2, 2, -3]}>
            <mesh scale={8}>
                <sphereGeometry args={[1.2, 64, 64]} />
                <meshBasicMaterial
                    color="#4a6ea5"
                    transparent
                    opacity={0.15}
                    side={THREE.BackSide}
                />
            </mesh>

            <mesh castShadow receiveShadow scale={7}>
                <sphereGeometry args={[1, 128, 128]} />
                {material}
            </mesh>
        </animated.group>
    );
}

function CodeParticles({ scrollProgress }: { scrollProgress: number }) {
    const points = useRef<THREE.Points>(null!);
    const particlesCount = 1500;

    const positions = useMemo(() => {
        const pos = new Float32Array(particlesCount * 3);
        for (let i = 0; i < particlesCount; i++) {
            let x = (Math.random() - 0.5) * 15;
            let y = (Math.random() - 0.5) * 15;
            let z = (Math.random() - 0.5) * 10;

            pos[i * 3] = x;
            pos[i * 3 + 1] = y;
            pos[i * 3 + 2] = z;
        }
        return pos;
    }, []);

    useFrame((state) => {
        const time = state.clock.getElapsedTime();

        for (let i = 0; i < particlesCount; i++) {
            const x = positions[i * 3];
            const y = positions[i * 3 + 1];
            const z = positions[i * 3 + 2];

            positions[i * 3] = x * Math.cos(time * 0.1) - z * Math.sin(time * 0.1);
            positions[i * 3 + 2] = z * Math.cos(time * 0.1) + x * Math.sin(time * 0.1);
            positions[i * 3 + 1] = y + Math.sin(time + x) * (0.5 + scrollProgress * 0.5);
        }

        points.current.geometry.attributes.position.needsUpdate = true;
    });

    const { scale } = useSpring({
        scale: 1 + scrollProgress * 0.5,
        config: { mass: 1, tension: 120, friction: 14 }
    });

    return (
        <animated.group scale={scale}>
            <Points ref={points} positions={positions}>
                <PointMaterial
                    transparent
                    vertexColors
                    size={4}
                    sizeAttenuation={true}
                    depthWrite={false}
                    blending={THREE.AdditiveBlending}
                    color="#4FC3F7"
                />
            </Points>
        </animated.group>
    );
}

function useScrollVisibility(processId: string, portfolioId: string) {
    const [scrollProgress, setScrollProgress] = useState(0);
    const [opacity, setOpacity] = useState(1);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const handleScroll = () => {
            try {
                const processSection = document.getElementById(processId);
                const portfolioSection = document.getElementById(portfolioId);

                if (!processSection || !portfolioSection) {
                    throw new Error('Required sections not found');
                }

                const processSectionTop = processSection.offsetTop;
                const processSectionBottom = processSection.offsetTop + processSection.offsetHeight;
                const portfolioSectionTop = portfolioSection.offsetTop;
                const portfolioSectionBottom = portfolioSection.offsetTop + portfolioSection.offsetHeight;

                const scrollY = window.scrollY;
                const viewportHeight = window.innerHeight;

                const fadeInStart = processSectionTop - viewportHeight;
                const fadeInEnd = processSectionTop;
                const fadeOutStart = portfolioSectionTop;
                const fadeOutEnd = portfolioSectionTop + viewportHeight;

                if (scrollY < fadeInStart) {
                    setOpacity(0);
                } else if (scrollY < fadeInEnd) {
                    const progress = (scrollY - fadeInStart) / (fadeInEnd - fadeInStart);
                    setOpacity(progress);
                } else if (scrollY > fadeOutEnd) {
                    setOpacity(0);
                } else if (scrollY > fadeOutStart) {
                    const progress = 1 - (scrollY - fadeOutStart) / (fadeOutEnd - fadeOutStart);
                    setOpacity(Math.max(0, progress));
                } else {
                    setOpacity(1);
                }

                if (scrollY >= fadeInStart && scrollY <= fadeOutEnd) {
                    const startPoint = processSectionTop - viewportHeight;
                    const endPoint = portfolioSectionTop;
                    const currentPosition = scrollY;

                    const progress = (currentPosition - startPoint) / (endPoint - startPoint);
                    setScrollProgress(Math.min(Math.max(progress, 0), 1));
                }

            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred');
                setOpacity(0);
            }
        };

        window.addEventListener('scroll', handleScroll);
        handleScroll();

        return () => window.removeEventListener('scroll', handleScroll);
    }, [processId, portfolioId]);

    return { scrollProgress, opacity, error };
}

export default function CodeAnimation() {
    const { scrollProgress } = useScrollVisibility('process-section', 'portfolio-section');

    return (
        <div className="fixed inset-0 w-full h-full" style={{ zIndex: -1 }}>
            <Canvas camera={{ position: [0, 0, 20], fov: 75 }}>
                <color attach="background" args={['#000000']} />
                <fog attach="fog" args={['#000000', 1, 80]} />
                <ambientLight intensity={0.4} />
                <pointLight position={[10, 10, 10]} intensity={0.8} />
                <pointLight position={[-10, -10, -5]} intensity={0.4} color="#4a6ea5" />
                <Stars />
                <Moon scrollProgress={scrollProgress} />
                <CodeParticles scrollProgress={scrollProgress} />
                {Array.from({ length: 5 }).map((_, i) => (
                    <ShootingStar key={i} />
                ))}
                {Array.from({ length: 3 }).map((_, i) => (
                    <UFO key={i} />
                ))}
            </Canvas>
        </div>
    );
}