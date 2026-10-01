"use client";

import React, { useRef, useMemo, Suspense, useState, useCallback } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useTexture, Environment } from "@react-three/drei";
import * as THREE from "three";
import { ArrowUpRight, Sparkles, Mail } from "lucide-react";
import {
  motion,
  useInView,
  useScroll,
  useTransform,
  useSpring,
  type Variants,
} from "motion/react";
import { cn } from "@/lib/utils";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28, filter: "blur(6px)" },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.75, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] },
  }),
};

const revealContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.07, delayChildren: 0.05 },
  },
};

const INFO_BLOCKS = [
  {
    label: "Currently Building",
    title: "AI Section Hub",
    detail: "Shopify App Ecosystem",
  },
  {
    label: "Specialized In",
    title: "Websites & Apps",
    detail: "OS 2.0 · Liquid · React",
  },
  {
    label: "Experience",
    title: "1+ Yr Shopify",
    detail: "Ex: Identiq Infotech",
  },
] as const;

const STATS = [
  { value: "30+", label: "Shopify Websites" },
  { value: "2+", label: "Shopify Apps" },
  { value: "200+", label: "Custom Sections" },
] as const;

function ParallaxOrbs({ mouseX, mouseY }: { mouseX: number; mouseY: number }) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      <motion.div
        style={{ x: mouseX * 28, y: mouseY * 22 }}
        className="absolute -top-[20%] left-[8%] w-[420px] h-[420px] rounded-full bg-white/[0.04] blur-[100px]"
      />
      <motion.div
        style={{ x: mouseX * -18, y: mouseY * 14 }}
        className="absolute bottom-[10%] right-[12%] w-[360px] h-[360px] rounded-full bg-zinc-500/[0.07] blur-[90px]"
      />
      <div
        className="absolute inset-0 opacity-[0.35] [mask-image:radial-gradient(ellipse_70%_60%_at_30%_40%,#000_40%,transparent_85%)]"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.06) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          transform: `translate(${mouseX * 12}px, ${mouseY * 8}px)`,
        }}
      />
    </div>
  );
}

function HighlightCard({
  label,
  title,
  detail,
  index,
}: {
  label: string;
  title: string;
  detail: string;
  index: number;
}) {
  return (
    <motion.div
      custom={index + 3}
      variants={fadeUp}
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 420, damping: 28 }}
      className="group relative p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.1] backdrop-blur-md overflow-hidden"
    >
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-white/[0.12] via-transparent to-transparent" />
      <div className="absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-white/25 via-white/5 to-transparent [mask:linear-gradient(#000,#000)_content-box,linear-gradient(#000,#000)] [mask-composite:exclude] p-px pointer-events-none" />
      <div className="relative">
        <div className="text-[10px] uppercase font-mono tracking-[0.2em] text-zinc-500 font-semibold mb-1.5">
          {label}
        </div>
        <div className="text-xs sm:text-sm font-bold text-white tracking-tight">{title}</div>
        <div className="text-[10px] text-zinc-500 mt-1">{detail}</div>
      </div>
    </motion.div>
  );
}

function StatCard({ value, label, index }: { value: string; label: string; index: number }) {
  return (
    <motion.div
      custom={index + 6}
      variants={fadeUp}
      whileHover={{ y: -6, scale: 1.03 }}
      transition={{ type: "spring", stiffness: 400, damping: 24 }}
      className="group relative p-3 rounded-2xl bg-gradient-to-b from-white/[0.07] to-white/[0.02] border border-white/[0.1] text-center overflow-hidden"
    >
      <motion.div
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-center"
      />
      <div className="text-xl sm:text-2xl font-black text-white tracking-tight group-hover:text-zinc-100 transition-colors">
        {value}
      </div>
      <div className="text-[10px] sm:text-xs text-zinc-500 font-medium mt-1 group-hover:text-zinc-400 transition-colors">
        {label}
      </div>
    </motion.div>
  );
}

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

    if (paletteType < 0.85) {
      baseR = 0.72; baseG = 0.72; baseB = 0.74;
    } else if (paletteType < 0.95) {
      baseR = 0.55; baseG = 0.58; baseB = 0.62;
    } else {
      baseR = 0.92; baseG = 0.92; baseB = 0.95;
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
  const sectionRef = useRef<HTMLElement>(null);
  const contentInView = useInView(sectionRef, { once: true, margin: "-8% 0px -8% 0px" });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const moonParallax = useTransform(scrollYProgress, [0, 1], [48, -48]);
  const copyParallax = useTransform(scrollYProgress, [0, 1], [24, -24]);
  const moonParallaxSmooth = useSpring(moonParallax, { stiffness: 90, damping: 22 });
  const copyParallaxSmooth = useSpring(copyParallax, { stiffness: 90, damping: 22 });

  const [pointer, setPointer] = useState({ x: 0, y: 0 });
  const onPointerMove = useCallback((e: React.PointerEvent<HTMLElement>) => {
    const rect = sectionRef.current?.getBoundingClientRect();
    if (!rect) return;
    setPointer({
      x: (e.clientX - rect.left) / rect.width - 0.5,
      y: (e.clientY - rect.top) / rect.height - 0.5,
    });
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about-mitul"
      onPointerMove={onPointerMove}
      className={cn(
        "relative w-full min-h-[780px] lg:min-h-[720px] bg-black flex flex-col md:flex-row overflow-hidden border-y border-white/[0.06]",
        className
      )}
    >
      <ParallaxOrbs mouseX={pointer.x} mouseY={pointer.y} />

      <div className="absolute top-0 left-0 md:inset-y-0 md:left-0 w-full h-[62%] md:h-full md:w-[58%] bg-gradient-to-b md:bg-gradient-to-r from-black via-black/90 to-transparent z-10 pointer-events-none" />

      <motion.div
        style={{ y: copyParallaxSmooth }}
        className="w-full md:w-[54%] lg:w-[50%] flex flex-col justify-center px-4 sm:px-8 md:px-0 md:pl-10 lg:pl-16 xl:pl-20 py-10 md:py-14 relative z-20"
      >
        <motion.div
          variants={revealContainer}
          initial="hidden"
          animate={contentInView ? "visible" : "hidden"}
        >
          <motion.div custom={0} variants={fadeUp} className="mb-3">
            <div className="text-[11px] font-mono uppercase tracking-[0.28em] text-zinc-500 mb-2 flex items-center gap-2.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white/40 opacity-60" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
              </span>
              <span>About Me</span>
            </div>

            <h2 className="text-[2.75rem] sm:text-[3.75rem] lg:text-[4.5rem] xl:text-[5rem] font-black tracking-tighter leading-[0.92] mb-3">
              <span className="text-white drop-shadow-[0_2px_32px_rgba(255,255,255,0.12)]">Mitul</span>{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-b from-white via-zinc-300 to-zinc-600">
                Zalavadiya.
              </span>
            </h2>
            <motion.div
              custom={1}
              variants={fadeUp}
              className="h-px w-24 bg-gradient-to-r from-white/80 via-white/30 to-transparent mb-3"
            />
            <motion.p custom={2} variants={fadeUp} className="text-sm sm:text-base text-zinc-300 font-medium">
              Shopify Developer <span className="text-zinc-600">•</span> Building Modern, High-Converting E-Commerce
            </motion.p>
          </motion.div>

          <motion.p
            custom={3}
            variants={fadeUp}
            className="text-xs sm:text-sm text-zinc-500 font-normal leading-relaxed max-w-[520px] mb-5"
          >
            I specialize in Shopify website development, custom themes, Liquid, Online Store 2.0, reusable sections, and Shopify app development. I also leverage React, JavaScript, HTML, and CSS to create responsive, scalable storefront experiences.
          </motion.p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-[540px] mb-4">
            {INFO_BLOCKS.map((block, i) => (
              <HighlightCard key={block.label} {...block} index={i} />
            ))}
          </div>

          <div className="grid grid-cols-3 gap-3 max-w-[480px] mb-6">
            {STATS.map((stat, i) => (
              <StatCard key={stat.label} {...stat} index={i} />
            ))}
          </div>

          <motion.div custom={9} variants={fadeUp} className="mb-5">
            <p className="text-xs text-zinc-400 font-medium mb-3 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              <span>Have a Shopify project? Let&apos;s build it.</span>
            </p>

            <div className="flex flex-wrap items-center gap-2.5">
              <motion.a
                href="/shopify-website"
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="px-5 py-2.5 rounded-full bg-white text-black font-semibold text-xs sm:text-sm hover:bg-zinc-100 transition-colors shadow-[0_0_28px_rgba(255,255,255,0.18)] inline-flex items-center gap-1.5 group cursor-pointer"
              >
                <span>Explore Shopify Stores</span>
                <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </motion.a>

              <motion.a
                href="/contact"
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="px-4 py-2.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.14] text-white font-medium text-xs sm:text-sm backdrop-blur-xl transition-all inline-flex items-center gap-1.5 cursor-pointer"
              >
                <span>Let&apos;s Build It</span>
                <Mail className="w-3.5 h-3.5 text-zinc-400" />
              </motion.a>

              <motion.a
                href="https://www.linkedin.com/in/mitul-zalavadiya-784873369"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="px-4 py-2.5 rounded-full bg-transparent hover:bg-white/[0.06] border border-white/[0.12] hover:border-white/30 text-zinc-400 hover:text-white font-medium text-xs sm:text-sm transition-all cursor-pointer"
              >
                LinkedIn
              </motion.a>
            </div>
          </motion.div>

          <motion.div
            custom={10}
            variants={fadeUp}
            className="flex items-center gap-2 text-[11px] sm:text-xs text-zinc-500 font-mono"
          >
            <Sparkles className="w-3.5 h-3.5 text-zinc-400" />
            <span>Click or drag the 3D Moon to trigger gravitational flux</span>
          </motion.div>
        </motion.div>
      </motion.div>

      <motion.div
        style={{ y: moonParallaxSmooth }}
        className="relative md:absolute md:right-0 md:top-0 w-full h-[460px] md:h-full md:w-[55%] lg:w-[58%] pointer-events-auto z-[5] flex items-center justify-center"
      >
        <div className="absolute inset-0 w-full h-full md:translate-x-[4%]">
          <CanvasErrorBoundary>
            <Canvas shadows camera={{ position: [0, 4, 10], fov: 45 }} dpr={[1, 2]}>
              <ambientLight intensity={0.03} />
              <directionalLight position={[8, 5, 5]} intensity={1.55} color="#ffffff" castShadow shadow-mapSize={[2048, 2048]} />
              <directionalLight position={[-5, -3, -5]} intensity={0.12} color="#a3a3a3" />

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
      </motion.div>
    </section>
  );
}

export { LunarGravityCard as Component };
