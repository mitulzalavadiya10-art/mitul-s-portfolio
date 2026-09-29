"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { CosmosGalleryModal } from "@/components/ui/cosmos-gallery-modal";
import { trackAppInstallClick } from "@/components/ui/AnalyticsTracker";

import row1Img1 from "@/ai section hub images/1 line images/ScreenRecording2026-08-06155135-ezgif.com-optimize.gif";
import row1Img2 from "@/ai section hub images/1 line images/Theory Hero Banner.png";
import row1Img3 from "@/ai section hub images/1 line images/build you ring.gif";
import row1Img4 from "@/ai section hub images/1 line images/promo-split-banner.png";
import row1Img5 from "@/ai section hub images/1 line images/shop-by-category-preview.png";
import row1Img6 from "@/ai section hub images/1 line images/sticky-collection-slider-preview.png";
import row1Img7 from "@/ai section hub images/1 line images/trend-report-slider-preview.png";

import row2Img1 from "@/ai section hub images/2 line images/alo-hero-section.png";
import row2Img2 from "@/ai section hub images/2 line images/discover-shapes-slider.gif";
import row2Img3 from "@/ai section hub images/2 line images/gb footer.png";
import row2Img4 from "@/ai section hub images/2 line images/purevea-glass-split.png";
import row2Img5 from "@/ai section hub images/2 line images/stretch-event-countdown.png";
import row2Img6 from "@/ai section hub images/2 line images/trend-report-slider-preview.png";
import row2Img7 from "@/ai section hub images/2 line images/dynamic-hero-slider-C8XX3dwT.png";

// Row 1 scrolls right→left, Row 2 scrolls left→right
const row1 = [row1Img1, row1Img2, row1Img3, row1Img4, row1Img5, row1Img6, row1Img7];
const row2 = [row2Img1, row2Img2, row2Img3, row2Img4, row2Img5, row2Img6, row2Img7];

function MarqueeRow({ images, direction }: { images: string[]; direction: "left" | "right" }) {
  const doubled = [...images, ...images]; // duplicate for seamless loop

  return (
    <div className="overflow-hidden w-full">
      <motion.div
        className="flex gap-4 items-center"
        animate={{
          x: direction === "left"
            ? ["0%", "-50%"]
            : ["-50%", "0%"],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear",
        }}
        style={{ width: "max-content" }}
      >
        {doubled.map((src, i) => (
          <div
            key={i}
            className="shrink-0 h-44 w-72 rounded-xl overflow-hidden border border-zinc-800 bg-white flex items-center justify-center opacity-85 hover:opacity-100 transition-opacity duration-300"
          >
            <img
              src={src}
              alt={`AI Section Hub — Shopify theme section preview ${(i % images.length) + 1}`}
              width={288}
              height={176}
              loading="lazy"
              className="w-full h-full object-cover"
            />
          </div>
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

        {/* 2. MIDDLE — Full-Width Dual Marquee Rows */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="relative flex flex-col gap-4 overflow-hidden w-full mt-4"
        >
          {/* Left fade mask */}
          <div className="pointer-events-none absolute left-0 top-0 h-full w-12 md:w-28 z-10 bg-gradient-to-r from-black to-transparent" />
          {/* Right fade mask */}
          <div className="pointer-events-none absolute right-0 top-0 h-full w-12 md:w-28 z-10 bg-gradient-to-l from-black to-transparent" />

          {/* Row 1: scrolls right → left */}
          <MarqueeRow images={row1} direction="left" />
          {/* Row 2: scrolls left → right */}
          <MarqueeRow images={row2} direction="right" />
        </motion.div>

        {/* 3. BOTTOM — Minimal Trust & Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 mt-10 text-xs md:text-sm text-zinc-400 font-medium border-t border-zinc-900 pt-8 max-w-4xl mx-auto"
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
