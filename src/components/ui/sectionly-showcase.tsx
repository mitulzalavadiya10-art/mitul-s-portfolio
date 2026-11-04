"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { CosmosGalleryModal } from "@/components/ui/cosmos-gallery-modal";
import { trackAppInstallClick } from "@/components/ui/AnalyticsTracker";

// ── ROW 1 MEDIA ────────────────────────────────────────────────────────
import r1_v1 from "@/ai section hub images/row 1/1790071863636-Telescope_Brand_Zoom.mp4";
import r1_p1 from "@/ai section hub images/row 1/posters/1790071863636-Telescope_Brand_Zoom.png";

import r1_v2 from "@/ai section hub images/row 1/1791365297843-Sticky_Lookbook-three.mp4";
import r1_p2 from "@/ai section hub images/row 1/posters/1791365297843-Sticky_Lookbook-three.png";

import r1_v3 from "@/ai section hub images/row 1/1791368489751-Editorial_Story_Stepper-3__1_ (1).mp4";
import r1_p3 from "@/ai section hub images/row 1/posters/1791368489751-Editorial_Story_Stepper-3__1_ (1).png";

import r1_v4 from "@/ai section hub images/row 1/1791521819628-Multi-Layout_Slideshow-two.mp4";
import r1_p4 from "@/ai section hub images/row 1/posters/1791521819628-Multi-Layout_Slideshow-two.png";

import r1_v5 from "@/ai section hub images/row 1/1791521819634-Multi-Layout_Slideshow-one.mp4";
import r1_p5 from "@/ai section hub images/row 1/posters/1791521819634-Multi-Layout_Slideshow-one.png";

import r1_i1 from "@/ai section hub images/row 1/1791536108194-Atelier_Hero_Slider-one.png";

import r1_v6 from "@/ai section hub images/row 1/1791539942400-video2__1_.mp4";
import r1_p6 from "@/ai section hub images/row 1/posters/1791539942400-video2__1_.png";

import r1_v7 from "@/ai section hub images/row 1/1792562020479-Spread_Zoom_Story-1.mp4";
import r1_p7 from "@/ai section hub images/row 1/posters/1792562020479-Spread_Zoom_Story-1.png";

import r1_v8 from "@/ai section hub images/row 1/1792578223340-Ambient_Category_Tabs-3.mp4";
import r1_p8 from "@/ai section hub images/row 1/posters/1792578223340-Ambient_Category_Tabs-3.png";

import r1_i2 from "@/ai section hub images/row 1/minimal-product-grid.png";
import r1_i3 from "@/ai section hub images/row 1/scratch-card-modal-popup-4.png";

import r1_v9 from "@/ai section hub images/row 1/shoppable-video-reels-feed.mp4";
import r1_p9 from "@/ai section hub images/row 1/posters/shoppable-video-reels-feed.png";

import r1_i4 from "@/ai section hub images/row 1/stretch-event-countdown.png";

// ── ROW 2 MEDIA ────────────────────────────────────────────────────────
import r2_v1 from "@/ai section hub images/row 2/1790763770209-Cursor_Trail_Hero-white__1_.mp4";
import r2_p1 from "@/ai section hub images/row 2/posters/1790763770209-Cursor_Trail_Hero-white__1_.png";

import r2_v2 from "@/ai section hub images/row 2/1790835594954-Bouncing_Image_Hero-white.mp4";
import r2_p2 from "@/ai section hub images/row 2/posters/1790835594954-Bouncing_Image_Hero-white.png";

import r2_v3 from "@/ai section hub images/row 2/1791365281940-Sticky_Lookbook-two.mp4";
import r2_p3 from "@/ai section hub images/row 2/posters/1791365281940-Sticky_Lookbook-two.png";

import r2_v4 from "@/ai section hub images/row 2/1791366420789-Editorial_Story_Stepper-2__1_.mp4";
import r2_p4 from "@/ai section hub images/row 2/posters/1791366420789-Editorial_Story_Stepper-2__1_.png";

import r2_i1 from "@/ai section hub images/row 2/1791536108169-Atelier_Hero_Slider-two.png";

import r2_v5 from "@/ai section hub images/row 2/1791539855848-video1.mp4";
import r2_p5 from "@/ai section hub images/row 2/posters/1791539855848-video1.png";

import r2_v6 from "@/ai section hub images/row 2/helix-stacking-cards-main-video.mp4";
import r2_p6 from "@/ai section hub images/row 2/posters/helix-stacking-cards-main-video.png";

import r2_i2 from "@/ai section hub images/row 2/shop-by-category-preview.png";
import r2_i3 from "@/ai section hub images/row 2/sticky-collection-slider-preview.png";

import r2_v7 from "@/ai section hub images/row 2/sticky-scroll-images.mp4";
import r2_p7 from "@/ai section hub images/row 2/posters/sticky-scroll-images.png";

export interface MediaItem {
  type: "video" | "image";
  src: string;
  poster?: string;
  title: string;
}

// Row 1 items
const row1Items: MediaItem[] = [
  { type: "video", src: r1_v1, poster: r1_p1, title: "Telescope Brand Zoom" },
  { type: "image", src: r1_i2, title: "Minimal Product Grid" },
  { type: "video", src: r1_v2, poster: r1_p2, title: "Sticky Lookbook" },
  { type: "image", src: r1_i1, title: "Atelier Hero Slider" },
  { type: "video", src: r1_v3, poster: r1_p3, title: "Editorial Story Stepper" },
  { type: "image", src: r1_i3, title: "Scratch Card Modal Popup" },
  { type: "video", src: r1_v4, poster: r1_p4, title: "Multi-Layout Slideshow" },
  { type: "video", src: r1_v5, poster: r1_p5, title: "Dynamic Slideshow Hero" },
  { type: "image", src: r1_i4, title: "Stretch Event Countdown" },
  { type: "video", src: r1_v6, poster: r1_p6, title: "Interactive Video Section" },
  { type: "video", src: r1_v7, poster: r1_p7, title: "Spread Zoom Story" },
  { type: "video", src: r1_v8, poster: r1_p8, title: "Ambient Category Tabs" },
  { type: "video", src: r1_v9, poster: r1_p9, title: "Shoppable Video Reels Feed" },
];

// Row 2 items
const row2Items: MediaItem[] = [
  { type: "video", src: r2_v1, poster: r2_p1, title: "Cursor Trail Hero" },
  { type: "image", src: r2_i2, title: "Shop by Category" },
  { type: "video", src: r2_v2, poster: r2_p2, title: "Bouncing Image Hero" },
  { type: "video", src: r2_v3, poster: r2_p3, title: "Sticky Lookbook Two" },
  { type: "image", src: r2_i1, title: "Atelier Hero Slider Two" },
  { type: "video", src: r2_v4, poster: r2_p4, title: "Editorial Story Stepper" },
  { type: "image", src: r2_i3, title: "Sticky Collection Slider" },
  { type: "video", src: r2_v5, poster: r2_p5, title: "Product Feature Video" },
  { type: "video", src: r2_v6, poster: r2_p6, title: "Helix Stacking Cards" },
  { type: "video", src: r2_v7, poster: r2_p7, title: "Sticky Scroll Images" },
];

/**
 * High-performance smart card:
 * Only mounts and plays the <video> when the card is in the visible viewport (or hovered).
 * When offscreen, displays the lightweight PNG poster image, completely preventing
 * browser memory saturation, GPU decoder crashes, and tab reload loops.
 */
function MarqueeCard({ item }: { item: MediaItem }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const el = cardRef.current;
    if (!el || item.type !== "video") return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        setInView(entry.isIntersecting);
      },
      {
        root: null,
        rootMargin: "250px", // Pre-buffer just before scrolling into view
        threshold: 0.05,
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [item.type]);

  const shouldPlayVideo = item.type === "video" && (inView || isHovered);

  return (
    <div
      ref={cardRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="shrink-0 w-[300px] h-[185px] sm:w-[360px] sm:h-[220px] md:w-[420px] md:h-[255px] rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-950 flex items-center justify-center opacity-90 hover:opacity-100 hover:border-zinc-700 transition-all duration-300 shadow-lg group relative transform-gpu"
    >
      {shouldPlayVideo ? (
        <video
          src={item.src}
          poster={item.poster}
          autoPlay
          loop
          muted
          playsInline
          preload="none"
          className="w-full h-full object-cover will-change-transform"
        />
      ) : (
        <img
          src={item.poster || item.src}
          alt={item.title}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover will-change-transform"
        />
      )}

      {/* Hover section title badge */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3.5 pointer-events-none">
        <span className="text-xs font-semibold text-zinc-200 tracking-wide">{item.title}</span>
      </div>
    </div>
  );
}

function MarqueeRow({ 
  items, 
  direction, 
  duration = 65 
}: { 
  items: MediaItem[]; 
  direction: "left" | "right"; 
  duration?: number;
}) {
  // 2x repetition is mathematically sufficient for a seamless 0% -> -50% infinite marquee
  // without creating redundant video decoders or freezing the browser.
  const repeated = [...items, ...items];

  return (
    <div className="overflow-hidden w-full py-1">
      <motion.div
        className="flex gap-4 sm:gap-6 items-center"
        animate={{
          x: direction === "left"
            ? ["0%", "-50%"]
            : ["-50%", "0%"],
        }}
        transition={{
          duration,
          repeat: Infinity,
          ease: "linear",
        }}
        style={{ width: "max-content" }}
      >
        {repeated.map((item, i) => (
          <MarqueeCard key={`${item.title}-${i}`} item={item} />
        ))}
      </motion.div>
    </div>
  );
}

export function SectionlyShowcase() {
  const [isCosmosOpen, setIsCosmosOpen] = useState(false);

  return (
    <section id="sectionly-showcase" className="w-full bg-black py-20 md:py-28 border-t border-zinc-900 overflow-hidden">
      <div className="w-full max-w-[1500px] mx-auto px-3 md:px-6">

        {/* 1. TOP — Section Header & High-Converting Value Points */}
        <div className="flex flex-col items-center text-center gap-5 mb-12 max-w-4xl mx-auto">
          <span className="inline-flex items-center px-4 py-1 rounded-full border border-zinc-800 bg-zinc-900 text-zinc-300 text-xs uppercase tracking-widest font-headings font-semibold">
            Shopify No-Code Section Builder
          </span>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-headings font-extrabold tracking-tight text-white leading-tight">
            Meet <span className="text-zinc-400">AI Section Hub</span>
          </h2>

          <p className="text-zinc-400 text-base md:text-lg leading-relaxed max-w-2xl">
            Transform your store with ready-to-use Liquid sections, shoppable reels & AI widgets — no developer, no code required.
          </p>

          {/* Simple dot-separated feature text */}
          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-xs md:text-sm text-zinc-300 font-medium mt-1">
            <span>Ready-Made Theme Sections</span>
            <span className="text-zinc-600 font-bold">•</span>
            <span>100% Zero Code</span>
            <span className="text-zinc-600 font-bold">•</span>
            <span>Smart AI Auto-Styling</span>
            <span className="text-zinc-600 font-bold">•</span>
            <span>Shoppable Reels & Video Sections</span>
            <span className="text-zinc-600 font-bold">•</span>
            <span>Mobile Optimized</span>
          </div>

          {/* Glassmorphism CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 mt-3">
            <motion.a
              href="https://apps.shopify.com/ai-section-hub"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackAppInstallClick('AI Section Hub', 'Showcase Install Button')}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-bold text-sm rounded-full border border-white/20 hover:border-white/40 backdrop-blur-xl transition-all shadow-md cursor-pointer"
            >
              Install Free on Shopify
            </motion.a>

            <motion.a
              href="/docs.html"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-bold text-sm rounded-full border border-white/20 hover:border-white/40 backdrop-blur-xl transition-all shadow-md cursor-pointer"
            >
              View Documentation
              <ArrowUpRight className="w-4 h-4 text-zinc-300" />
            </motion.a>

            <motion.button
              onClick={() => setIsCosmosOpen(true)}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-bold text-sm rounded-full border border-white/20 hover:border-white/40 backdrop-blur-xl transition-all shadow-md cursor-pointer"
            >
              Look Once (3D Space)
            </motion.button>
          </div>
        </div>
      </div>

      {/* 2. MIDDLE — Full-Bleed 100% Edge-to-Edge Dual Marquee Rows */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative flex flex-col gap-5 overflow-hidden w-full my-6"
      >
        {/* Subtle Edge Fade Masks */}
        <div className="pointer-events-none absolute left-0 top-0 h-full w-8 md:w-20 z-10 bg-gradient-to-r from-black to-transparent" />
        <div className="pointer-events-none absolute right-0 top-0 h-full w-8 md:w-20 z-10 bg-gradient-to-l from-black to-transparent" />

        {/* Row 1: scrolls right → left (Calm & smooth speed) */}
        <MarqueeRow items={row1Items} direction="left" duration={65} />
        {/* Row 2: scrolls left → right (Calm & smooth speed) */}
        <MarqueeRow items={row2Items} direction="right" duration={72} />
      </motion.div>

      {/* 3. BOTTOM — Minimal Trust & Stats Bar */}
      <div className="w-full max-w-[1500px] mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs md:text-sm text-zinc-400 font-medium border-t border-zinc-900 pt-8 max-w-4xl mx-auto"
        >
          <div>
            <span><strong className="text-white font-bold">300+</strong> Active Shopify Stores</span>
          </div>

          <span className="text-zinc-800 hidden sm:inline">•</span>

          <div>
            <span><strong className="text-white font-bold">Ready-to-Use</strong> Liquid Sections</span>
          </div>

          <span className="text-zinc-800 hidden sm:inline">•</span>

          <div>
            <span><strong className="text-white font-bold">0ms</strong> Speed Impact</span>
          </div>

          <span className="text-zinc-800 hidden sm:inline">•</span>

          <div>
            <span><strong className="text-white font-bold">4.9★</strong> Merchant Rating</span>
          </div>
        </motion.div>
      </div>
      <CosmosGalleryModal isOpen={isCosmosOpen} onClose={() => setIsCosmosOpen(false)} />
    </section>
  );
}