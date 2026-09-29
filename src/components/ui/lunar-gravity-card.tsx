"use client";

import React, { useRef, useMemo, Suspense, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useTexture, Environment } from "@react-three/drei";
import * as THREE from "three";
import { ArrowUpRight, Sparkles, GraduationCap, Mail } from "lucide-react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

const RADIUS = 2.0;

const MOON_TEXTURE_URL = "/textures/moon.jpg";

const RealisticMoon = ({ onClick }: { onClick?: () => void }) => {
  const meshRef = useRef<THREE.Mesh>(null);

  const colorMap = useTexture(MOON_TEXTURE_URL);

  useFrame((_, delta) => {
    if (meshRef.current) meshRef.current.rotation.y += delta * 0.05;
  });

  return (
    <mesh 
      ref={meshRef} 
      castShadow 
      receiveShadow 
      onClick={onClick}
      onPointerOver={() => document.body.style.cursor = 'pointer'} 
      onPointerOut={() => document.body.style.cursor = 'auto'}
   >
      <sphereGeometry args={[RADIUS, 64, 64]} />
      <meshStandardMaterial 
        map={colorMap} 
        bumpMap={colorMap} 
        bumpScale={0.02} 
        roughness={0.8}
        metalness={0.1}
      />
    </mesh>
  );
};

const particlesCount = 60000; 
const [ringPositions, ringColors, ringRandoms] = (() => {
  const pos = new Float32Array(particlesCount * 3);
  const col = new Float32Array(particlesCount * 3);
  const rnd = new Float32Array(particlesCount);

  for(let i=0; i<particlesCount; i++) {
    const angle = Math.random() * Math.PI * 2;

    const rDist = Math.pow(Math.random(), 1.5);
    const radius = 2.2 + rDist * 2.2; 

    const thickness = 0.4 - (rDist * 0.2); 
    const ySpread = (Math.random() + Math.random() + Math.random() - 1.5);
    const y = ySpread * thickness; 

    pos[i*3] = Math.cos(angle) * radius;
    pos[i*3+1] = y;
    pos[i*3+2] = Math.sin(angle) * radius;

    const intensity = 1.0 - rDist; 

    const paletteType = Math.random();
    let baseR, baseG, baseB;

    if (paletteType < 0.80) {
      baseR = 0.25; baseG = 0.30; baseB = 0.35;
    } else if (paletteType < 0.92) {
      baseR = 0.0; baseG = 0.6; baseB = 0.8;
    } else {
      baseR = 0.6; baseG = 0.2; baseB = 0.8;
    }

    baseR = Math.min(1.0, Math.max(0.0, baseR + (Math.random() - 0.5) * 0.1));
    baseG = Math.min(1.0, Math.max(0.0, baseG + (Math.random() - 0.5) * 0.1));
    baseB = Math.min(1.0, Math.max(0.0, baseB + (Math.random() - 0.5) * 0.1));

    const sparkle = Math.random() > 0.95 ? 2.5 : 1.0;

    col[i*3] = baseR * intensity * sparkle;     
    col[i*3+1] = baseG * intensity * sparkle;   
    col[i*3+2] = baseB * intensity * sparkle;   
    rnd[i] = Math.random();
  }
  return [pos, col, rnd];
})();

const ParticleRing = ({ ringState, massiveAsteroidsRef }: { ringState: 'hidden' | 'animating' | 'visible', massiveAsteroidsRef: React.MutableRefObject<Float32Array> }) => {
  const pointsRef = useRef<THREE.Points>(null);

  const uniforms = useRef({
    uProgress: { value: ringState === 'visible' ? 1.0 : 0.0 },
    uAsteroids: { value: new Float32Array(75 * 4) },
    time: { value: 0 }
  });

  useFrame((state, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y -= delta * 0.02;
      pointsRef.current.updateMatrix();

      const invMat = new THREE.Matrix4().copy(pointsRef.current.matrix).invert();
      const localAsteroids = new Float32Array(75 * 4);
      for(let i=0; i<75; i++) {
        const ast = new THREE.Vector3(
          massiveAsteroidsRef.current[i*4],
          massiveAsteroidsRef.current[i*4+1],
          massiveAsteroidsRef.current[i*4+2]
        );
        ast.applyMatrix4(invMat);
        localAsteroids[i*4] = ast.x;
        localAsteroids[i*4+1] = ast.y;
        localAsteroids[i*4+2] = ast.z;
        localAsteroids[i*4+3] = massiveAsteroidsRef.current[i*4+3];
      }
      uniforms.current.uAsteroids.value = localAsteroids;
    }
    uniforms.current.time.value = state.clock.elapsedTime;

    if (ringState === 'animating') {
      uniforms.current.uProgress.value += delta * 0.35; 
      if (uniforms.current.uProgress.value > 1.0) uniforms.current.uProgress.value = 1.0;
    } else if (ringState === 'visible') {
      uniforms.current.uProgress.value = 1.0;
    } else {
      uniforms.current.uProgress.value = 0.0;
    }
  });

  const onBeforeCompile = (shader: any) => {
    shader.uniforms.uProgress = uniforms.current.uProgress;
    shader.uniforms.uAsteroids = uniforms.current.uAsteroids;
    shader.uniforms.time = uniforms.current.time;

    shader.vertexShader = `
      uniform float uProgress;
      uniform vec4 uAsteroids[75];
      uniform float time;
      attribute float aRandom;
      varying float vProgress; 
      ${shader.vertexShader}
    `;

    shader.vertexShader = shader.vertexShader.replace(
      `#include <begin_vertex>`,
      `
      vec3 transformed = vec3(position);

      float angle = atan(transformed.x, transformed.z);
      float normalizedAngle = abs(angle) / 3.14159265359;
      float spawnThreshold = 1.0 - normalizedAngle; 

      float progressValue = (uProgress * 1.4) - spawnThreshold;
      float particleProgress = smoothstep(0.0, 0.4, progressValue);
      vProgress = particleProgress;

      transformed.y += sin(angle * 10.0 + time) * 0.05 * aRandom;

      if (uProgress > 0.5) {
        for(int i = 0; i < 75; i++) {
          vec4 astData = uAsteroids[i];
          vec3 delta = transformed - astData.xyz;
          float dist = length(delta);

          float rad = astData.w * 2.0 + 0.15;

          if (dist < rad) {
             float force = pow((rad - dist) / rad, 2.0); 
             transformed += normalize(delta) * force * 0.4;
             transformed.y += force * 0.20 * (aRandom - 0.5);
          }
        }
      }

      float swirl = (1.0 - particleProgress) * 4.0; 
      float s = sin(swirl);
      float c = cos(swirl);
      transformed.xz = mat2(c, -s, s, c) * transformed.xz;

      transformed.y += (1.0 - particleProgress) * (transformed.y >= 0.0 ? 1.0 : -1.0);

      vec3 moonSurface = normalize(transformed) * 2.1;
      transformed = mix(moonSurface, transformed, particleProgress);
      `
    );

    shader.fragmentShader = `
      varying float vProgress;
      ${shader.fragmentShader}
    `;

    shader.fragmentShader = shader.fragmentShader.replace(
      `#include <color_fragment>`,
      `
      #include <color_fragment>

      diffuseColor.a *= vProgress;
      `
    );
  };

  return (
    <points ref={pointsRef} rotation={[-Math.PI / 2, 0, 0]}>
      <bufferGeometry>
        <bufferAttribute 
          attach="attributes-position" 
          count={particlesCount}
          array={ringPositions}
          itemSize={3}
          args={[ringPositions, 3]}
        />
        <bufferAttribute 
          attach="attributes-color" 
          count={particlesCount}
          array={ringColors}
          itemSize={3}
          args={[ringColors, 3]}
        />
        <bufferAttribute 
          attach="attributes-aRandom" 
          count={particlesCount}
          array={ringRandoms}
          itemSize={1}
          args={[ringRandoms, 1]}
        />
      </bufferGeometry>
      <pointsMaterial 
        size={0.008} 
        vertexColors 
        transparent 
        opacity={0.8} 
        sizeAttenuation={true} 
        blending={THREE.AdditiveBlending} 
        depthWrite={false} 
        onBeforeCompile={onBeforeCompile} 
      />
    </points>
  );
};

const generateAsteroids = (count: number) => {
  const data = [];
  for (let i = 0; i < count; i++) {
    const baseRadius = 2.8 + Math.random() * 2.0; 
    const radialAmplitude = 0.5 + Math.random() * 1.5; 
    const radialSpeed = 0.15 + Math.random() * 0.25; 
    const phase = Math.random() * Math.PI * 2;

    const angle = Math.random() * Math.PI * 2;
    const zOffset = (Math.random() - 0.5) * 0.8; 

    const speed = (0.04 + Math.random() * 0.08) * (Math.random() > 0.5 ? 1 : -1);

    const rotationSpeedX = (Math.random() - 0.5) * 0.05;
    const rotationSpeedY = (Math.random() - 0.5) * 0.05;
    const rotationSpeedZ = (Math.random() - 0.5) * 0.05;

    const scale = 0.02 + Math.pow(Math.random(), 4) * 0.18;

    data.push({
      angle, baseRadius, radialAmplitude, radialSpeed, phase, zOffset, speed,
      rx: Math.random() * Math.PI, ry: Math.random() * Math.PI, rz: Math.random() * Math.PI,
      rsx: rotationSpeedX, rsy: rotationSpeedY, rsz: rotationSpeedZ,
      scale
    });
  }
  data.sort((a, b) => b.scale - a.scale);
  return data;
};

const AsteroidBelt = ({ ringState, massiveAsteroidsRef }: { ringState: 'hidden' | 'animating' | 'visible', massiveAsteroidsRef: React.MutableRefObject<Float32Array> }) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);

  const [colorMap, bumpMap] = useTexture([
    MOON_TEXTURE_URL,
    MOON_TEXTURE_URL
  ]);

  const count = 75; 
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const [asteroids] = useState(() => generateAsteroids(count));

  const scaleRef = useRef(0);

  useFrame((_, delta) => {
    if (!meshRef.current) return;

    const targetScale = ringState === 'hidden' ? 0 : 1;
    const lerpSpeed = ringState === 'hidden' ? 5 : 2;
    scaleRef.current = THREE.MathUtils.lerp(scaleRef.current, targetScale, delta * lerpSpeed);

    if (scaleRef.current < 0.01) {
      meshRef.current.visible = false;
      return;
    }
    meshRef.current.visible = true;

    asteroids.forEach((ast, i) => {

      ast.angle += ast.speed * delta; 

      ast.phase += ast.radialSpeed * delta;
      let currentRadius = ast.baseRadius + Math.sin(ast.phase) * ast.radialAmplitude;

      if (currentRadius < 2.15) {
        const penetration = 2.15 - currentRadius;
        currentRadius = 2.15 + penetration * 0.85;
      }

      const x = Math.cos(ast.angle) * currentRadius;
      const y = Math.sin(ast.angle) * currentRadius;

      massiveAsteroidsRef.current[i * 4] = x;
      massiveAsteroidsRef.current[i * 4 + 1] = y;
      massiveAsteroidsRef.current[i * 4 + 2] = ast.zOffset;
      massiveAsteroidsRef.current[i * 4 + 3] = ast.scale;

      ast.rx += ast.rsx;
      ast.ry += ast.rsy;
      ast.rz += ast.rsz;

      dummy.position.set(x, y, ast.zOffset);
      dummy.rotation.set(ast.rx, ast.ry, ast.rz);
      dummy.scale.setScalar(ast.scale * scaleRef.current);
      dummy.updateMatrix();

      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]} castShadow receiveShadow>

      <dodecahedronGeometry args={[1, 0]} />
      <meshStandardMaterial 
        map={colorMap} 
        bumpMap={bumpMap} 
        bumpScale={0.08}
        color="#ffffff"
        roughness={0.7}
        metalness={0.1}
      />
    </instancedMesh>
  );
};

export interface LunarGravityCardProps {
  className?: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
}

class CanvasErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error: unknown) {
    console.warn("Canvas 3D render caught error:", error);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full h-full flex items-center justify-center text-zinc-500 text-sm">
          Interactive 3D view loading...
        </div>
      );
    }
    return this.props.children;
  }
}

export default function LunarGravityCard({ 
  className,
}: LunarGravityCardProps) {
  const [ringState, setRingState] = useState<'hidden' | 'animating' | 'visible'>('hidden');
  const massiveAsteroidsRef = useRef<Float32Array>(new Float32Array(75 * 4));

  return (
    <div className={cn("w-full min-h-[740px] lg:min-h-[700px] bg-black flex flex-col md:flex-row relative overflow-hidden border-none shadow-none py-6 md:py-10", className)}>
      
      <div className="absolute top-0 left-0 md:inset-y-0 md:left-0 w-full h-[60%] md:h-full md:w-[55%] bg-gradient-to-b md:bg-gradient-to-r from-black via-black/85 to-transparent z-10 pointer-events-none"></div>

      <div className="w-full md:w-[54%] lg:w-[50%] flex flex-col justify-center px-4 sm:px-8 md:px-0 md:pl-10 lg:pl-16 xl:pl-20 py-8 md:py-0 relative z-20">
        
        {/* Name & Title */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="mb-3"
        >
          <div className="text-[11px] font-mono uppercase tracking-widest text-zinc-400 mb-2 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>About Me</span>
          </div>

          <h2 className="text-[2.75rem] sm:text-[3.75rem] lg:text-[4.5rem] xl:text-[5rem] font-black tracking-tighter leading-[0.92] mb-2">
            <span className="text-white drop-shadow-[0_2px_24px_rgba(255,255,255,0.18)]">Mitul</span>{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-white via-zinc-300 to-zinc-600">
              Zalavadiya.
            </span>
          </h2>

          <p className="text-sm sm:text-base text-zinc-200 font-medium">
            Shopify Developer <span className="text-zinc-500">•</span> Building Modern, High-Converting E-Commerce
          </p>
        </motion.div>

        {/* Short Bio Paragraph */}
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-xs sm:text-sm text-zinc-400 font-normal leading-relaxed max-w-[520px] mb-4"
        >
          I specialize in Shopify website development, custom themes, Liquid, Online Store 2.0, reusable sections, and Shopify app development. I also leverage React, JavaScript, HTML, and CSS to create responsive, scalable storefront experiences.
        </motion.p>

        {/* 3 Value Blocks: Currently Building · Specialized In · Experience */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 max-w-[540px] mb-4"
        >
          <div className="p-3 rounded-xl bg-white/[0.04] border border-white/[0.08] backdrop-blur-md">
            <div className="text-[10px] uppercase font-mono tracking-wider text-zinc-400 font-semibold mb-1">Currently Building</div>
            <div className="text-xs sm:text-sm font-bold text-white tracking-tight">AI Section Hub</div>
            <div className="text-[10px] text-zinc-400 mt-0.5">Shopify App Ecosystem</div>
          </div>

          <div className="p-3 rounded-xl bg-white/[0.04] border border-white/[0.08] backdrop-blur-md">
            <div className="text-[10px] uppercase font-mono tracking-wider text-zinc-400 font-semibold mb-1">Specialized In</div>
            <div className="text-xs sm:text-sm font-bold text-white tracking-tight">Websites &amp; Apps</div>
            <div className="text-[10px] text-zinc-400 mt-0.5">OS 2.0 · Liquid · React</div>
          </div>

          <div className="p-3 rounded-xl bg-white/[0.04] border border-white/[0.08] backdrop-blur-md">
            <div className="text-[10px] uppercase font-mono tracking-wider text-zinc-400 font-semibold mb-1">Experience</div>
            <div className="text-xs sm:text-sm font-bold text-white tracking-tight">1+ Yr Shopify</div>
            <div className="text-[10px] text-zinc-400 mt-0.5">Ex: Identiq Infotech</div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="grid grid-cols-3 gap-2.5 max-w-[480px] mb-5"
        >
          <motion.div
            whileHover={{ y: -2 }}
            className="p-2.5 rounded-xl bg-gradient-to-b from-white/[0.05] to-white/[0.02] border border-white/[0.08] text-center"
          >
            <div className="text-xl sm:text-2xl font-black text-white tracking-tight">30+</div>
            <div className="text-[10px] sm:text-xs text-zinc-400 font-medium mt-0.5">Shopify Websites</div>
          </motion.div>

          <motion.div
            whileHover={{ y: -2 }}
            className="p-2.5 rounded-xl bg-gradient-to-b from-white/[0.05] to-white/[0.02] border border-white/[0.08] text-center"
          >
            <div className="text-xl sm:text-2xl font-black text-white tracking-tight">2+</div>
            <div className="text-[10px] sm:text-xs text-zinc-400 font-medium mt-0.5">Shopify Apps</div>
          </motion.div>

          <motion.div
            whileHover={{ y: -2 }}
            className="p-2.5 rounded-xl bg-gradient-to-b from-white/[0.05] to-white/[0.02] border border-white/[0.08] text-center"
          >
            <div className="text-xl sm:text-2xl font-black text-white tracking-tight">200+</div>
            <div className="text-[10px] sm:text-xs text-zinc-400 font-medium mt-0.5">Custom Sections</div>
          </motion.div>
        </motion.div>

        {/* Action Buttons & CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mb-4"
        >
          <p className="text-xs text-zinc-300 font-medium mb-3 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Have a Shopify project? Let’s build it.</span>
          </p>

          <div className="flex flex-wrap items-center gap-2.5">
            <motion.a
              href="/shopify-website"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="px-5 py-2.5 rounded-full bg-white text-black font-semibold text-xs sm:text-sm hover:bg-zinc-100 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)] inline-flex items-center gap-1.5 group cursor-pointer"
            >
              <span>Explore Shopify Stores</span>
              <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </motion.a>

            <motion.a
              href="/contact"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="px-4 py-2.5 rounded-full bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.12] hover:border-white/25 text-white font-medium text-xs sm:text-sm backdrop-blur-xl transition-all inline-flex items-center gap-1.5 cursor-pointer"
            >
              <span>Let’s Build It</span>
              <Mail className="w-3.5 h-3.5 text-zinc-300" />
            </motion.a>

            <motion.a
              href="https://www.linkedin.com/in/mitul-zalavadiya-784873369"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="px-4 py-2.5 rounded-full bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.12] hover:border-white/25 text-zinc-300 hover:text-white font-medium text-xs sm:text-sm backdrop-blur-xl transition-all cursor-pointer"
            >
              LinkedIn
            </motion.a>
          </div>
        </motion.div>

        {/* Interactive 3D Orbit Callout */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="flex items-center gap-2 text-xs text-zinc-400 font-mono"
        >
          <Sparkles className="w-3 h-3 text-zinc-300 animate-pulse" />
          <span>Click or drag the 3D Moon to trigger gravitational flux</span>
        </motion.div>
      </div>
     
      <div className="relative md:absolute md:right-0 md:top-0 w-full h-[450px] md:h-full md:w-[55%] lg:w-[58%] pointer-events-auto z-0 flex items-center justify-center">
        <div className="absolute inset-0 w-full h-full">
          <CanvasErrorBoundary>
            <Canvas shadows camera={{ position: [0, 4, 10], fov: 45 }} dpr={[1, 2]}>
              <ambientLight intensity={0.02} />
              <directionalLight position={[8, 5, 5]} intensity={1.5} color="#ffffff" castShadow shadow-mapSize={[2048, 2048]} />
              <directionalLight position={[-5, -3, -5]} intensity={0.15} color="#4a90e2" />

              <OrbitControls enableZoom={false} enablePan={false} autoRotate={false} />

              <group rotation={[Math.PI / 8, 0, 0]}>
                <Suspense fallback={null}>
                  <RealisticMoon onClick={() => { if(ringState === 'hidden') setRingState('animating') }} />
                  <ParticleRing ringState={ringState} massiveAsteroidsRef={massiveAsteroidsRef} />
                  <AsteroidBelt ringState={ringState} massiveAsteroidsRef={massiveAsteroidsRef} />
                  <Environment preset="city" />
                </Suspense>
              </group>
            </Canvas>
          </CanvasErrorBoundary>
        </div>
      </div>

    </div>
  );
}

export { LunarGravityCard as Component };
