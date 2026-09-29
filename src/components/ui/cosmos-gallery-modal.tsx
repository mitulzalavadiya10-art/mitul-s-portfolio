"use client"

import { Suspense, useEffect, useState } from "react"
import { Canvas } from "@react-three/fiber"
import { OrbitControls } from "@react-three/drei"
import { X, Move, Layers, Cpu, Compass } from "lucide-react"
import { motion, AnimatePresence } from "motion/react"
import { ParticleSphere } from "@/components/ui/cosmos-3d-orbit-gallery"

// Import AI Section Hub showcase images to use in the 3D orbit
import img1 from "@/images/images1.jpg"
import img2 from "@/images/images2.jpg"
import img3 from "@/images/images3.jpg"
import img4 from "@/images/images4.jpg"
import img5 from "@/images/images5.jpg"
import img6 from "@/images/images6.jpg"
import img7 from "@/images/images7.jpg"
import img8 from "@/images/images8.jpg"
import img9 from "@/images/images9.jpg"
import img10 from "@/images/images10.jpg"

const localImages = [img1, img2, img3, img4, img5, img6, img7, img8, img9, img10]

interface CosmosGalleryModalProps {
  isOpen: boolean
  onClose: () => void
}

export function CosmosGalleryModal({ isOpen, onClose }: CosmosGalleryModalProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null)
  const [isMobile, setIsMobile] = useState(false)

  // Detect mobile viewport to dynamically adjust camera distance and UI sizing
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  // Prevent scrolling on background when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
      document.body.style.cursor = "auto"
    }
  }, [isOpen])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md"
          style={{
            background: "radial-gradient(circle at center, rgba(17, 10, 42, 0.94) 0%, rgba(3, 3, 5, 0.99) 100%)",
          }}
        >
          {/* Futuristic Grid Line Background Overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none opacity-40" />

          {/* Close button - Top Right */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 z-50 p-3 text-white/70 hover:text-white bg-zinc-950/60 hover:bg-zinc-900 border border-white/10 rounded-full transition-all duration-300 cursor-pointer shadow-lg backdrop-blur hover:scale-105 hover:border-white/20 active:scale-95"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Mobile: tiny compact pill badge top-left */}
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.4, ease: "easeOut" }}
            className="absolute top-4 left-4 z-40 flex items-center gap-2 bg-zinc-950/70 border border-white/10 px-3 py-1.5 rounded-full backdrop-blur-md select-none md:hidden"
          >
            <span className="flex h-1.5 w-1.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
            </span>
            <span className="text-white text-xs font-bold tracking-tight">AI Section Hub Cosmos</span>
          </motion.div>

          {/* Desktop: full HUD panel */}
          <motion.div
            initial={{ x: -40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5, ease: "easeOut" }}
            className="absolute top-6 left-6 z-40 max-w-sm pointer-events-auto bg-zinc-950/50 border border-white/10 p-6 rounded-2xl backdrop-blur-xl shadow-[0_0_50px_rgba(0,0,0,0.5)] select-none flex-col gap-4 hidden md:flex"
          >
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-[9px] uppercase font-bold text-emerald-400 tracking-wider">
                  Orbital Simulation Sync
                </span>
              </div>
              <h2 className="text-white text-3xl font-extrabold font-instrument-serif tracking-wide">
                AI Section Hub Cosmos
              </h2>
              <p className="text-zinc-400 text-xs leading-relaxed mt-2 font-medium">
                Interact with premium native Shopify sections. Click any image to view it full-screen.
              </p>
            </div>
            <div className="h-[1px] bg-white/10 w-full" />
            <div className="flex flex-col gap-2.5">
              <div className="flex items-center gap-3 text-zinc-300 text-xs">
                <Layers className="w-4 h-4 text-violet-400" />
                <span className="font-semibold">700+ Shopify Sections</span>
              </div>
              <div className="flex items-center gap-3 text-zinc-300 text-xs">
                <Cpu className="w-4 h-4 text-pink-400" />
                <span className="font-semibold">AI Auto-Detect Engine</span>
              </div>
              <div className="flex items-center gap-3 text-zinc-300 text-xs">
                <Compass className="w-4 h-4 text-sky-400" />
                <span className="font-semibold">Interactive Orbit Controls</span>
              </div>
            </div>
          </motion.div>

          {/* 3D Canvas */}
          <div 
            className="w-full h-full cursor-grab active:cursor-grabbing"
            style={{ touchAction: "none" }}
          >
            <Suspense
              fallback={
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white gap-3 select-none">
                  <div className="w-12 h-12 border-4 border-white/5 border-t-violet-500 rounded-full animate-spin" />
                  <span className="text-xs font-semibold text-zinc-400 tracking-widest uppercase">
                    Initializing Engine...
                  </span>
                </div>
              }
            >
              {/* Dynamic camera position based on screen width to prevent clipping on mobile */}
              <Canvas camera={{ position: isMobile ? [-16, 2, 16] : [-12, 1.5, 12], fov: 45 }}>
                <ambientLight intensity={0.9} />
                <pointLight position={[15, 15, 15]} intensity={2.0} />
                <directionalLight position={[-10, 10, -5]} intensity={0.5} />
                <Suspense fallback={null}>
                  <ParticleSphere
                    images={localImages}
                    onSelectImage={(index) => setSelectedImageIndex(index)}
                  />
                </Suspense>
                {/* Dynamic zoom limits based on screen size so mobile stays at a good overview distance */}
                <OrbitControls
                  enablePan={false}
                  enableZoom={true}
                  enableRotate={true}
                  maxDistance={isMobile ? 28 : 22}
                  minDistance={isMobile ? 15 : 11}
                  enableDamping={true}
                  dampingFactor={0.05}
                />
              </Canvas>
            </Suspense>
          </div>

          {/* Controls HUD Panel - Bottom Center (Compact on mobile) */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5, ease: "easeOut" }}
            className="absolute bottom-6 left-1/2 -translate-x-1/2 z-40 bg-zinc-950/80 border border-white/10 px-5 py-2.5 rounded-full flex items-center gap-4 text-[10px] md:text-xs text-zinc-300 select-none backdrop-blur-xl shadow-2xl max-w-[90vw] whitespace-nowrap"
          >
            <span className="flex items-center gap-1.5">
              <Move className="w-3.5 h-3.5 text-violet-400" />
              <span>Drag to rotate</span>
            </span>
            <span className="h-3 w-[1px] bg-white/10" />
            <span className="flex items-center gap-1.5">
              <span className="text-sky-400 font-bold">🔍</span>
              {isMobile ? <span>Pinch to zoom</span> : <span>Scroll to zoom</span>}
            </span>
          </motion.div>

          {/* Large Image Preview Overlay (Lightbox) */}
          <AnimatePresence>
            {selectedImageIndex !== null && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedImageIndex(null)}
                className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md cursor-zoom-out"
              >
                <motion.div
                  initial={{ scale: 0.92, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.92, opacity: 0 }}
                  transition={{ type: "spring", damping: 25, stiffness: 260 }}
                  onClick={(e) => e.stopPropagation()} // Prevent closing when clicking card itself
                  className="relative w-full max-w-4xl max-h-[85vh] bg-zinc-900 border border-white/10 rounded-2xl overflow-hidden shadow-[0_0_80px_rgba(139,92,246,0.15)] flex flex-col cursor-auto"
                >
                  {/* Lightbox Close button */}
                  <button
                    onClick={() => setSelectedImageIndex(null)}
                    className="absolute top-4 right-4 z-50 p-2 text-white/70 hover:text-white bg-zinc-950/80 hover:bg-zinc-900 border border-white/15 rounded-full transition-all duration-200 cursor-pointer shadow-md hover:scale-105 active:scale-95"
                    aria-label="Close image preview"
                  >
                    <X className="w-4 h-4" />
                  </button>

                  {/* Lightbox Image */}
                  <div className="overflow-auto p-3 flex items-center justify-center min-h-[250px]">
                    <img
                      src={localImages[selectedImageIndex]}
                      alt={`Shopify Section Template ${selectedImageIndex + 1}`}
                      className="max-w-full max-h-[60vh] md:max-h-[75vh] object-contain rounded-lg shadow-inner select-none pointer-events-none"
                    />
                  </div>

                  {/* Lightbox Header / Footer description */}
                  <div className="bg-zinc-950/90 border-t border-white/10 px-5 py-3.5 flex items-center justify-between text-[10px] md:text-xs select-none">
                    <span className="text-zinc-300 font-semibold">
                      Section Template #{selectedImageIndex + 1}
                    </span>
                    <span className="text-zinc-500">
                      {isMobile ? "Tap outside or X to close" : "Click outside or press X to return"}
                    </span>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
