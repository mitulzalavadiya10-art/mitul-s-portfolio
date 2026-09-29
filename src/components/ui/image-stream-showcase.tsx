"use client";

import { ImageStreamHero } from "@/components/ui/image-stream-hero";

import img1 from "@/ai section hub images/1 line images/Theory Hero Banner.png";
import img2 from "@/ai section hub images/1 line images/promo-split-banner.png";
import img3 from "@/ai section hub images/1 line images/shop-by-category-preview.png";
import img4 from "@/ai section hub images/1 line images/sticky-collection-slider-preview.png";
import img5 from "@/ai section hub images/1 line images/trend-report-slider-preview.png";
import img6 from "@/ai section hub images/2 line images/alo-hero-section.png";
import img7 from "@/ai section hub images/2 line images/purevea-glass-split.png";
import img8 from "@/ai section hub images/2 line images/stretch-event-countdown.png";
import img9 from "@/ai section hub images/2 line images/dynamic-hero-slider-C8XX3dwT.png";

const STREAM_IMAGES = [
  { src: img1, alt: "Theory Hero Banner Section" },
  { src: img2, alt: "Promo Split Banner Section" },
  { src: img3, alt: "Shop By Category Section" },
  { src: img4, alt: "Sticky Collection Slider" },
  { src: img5, alt: "Trend Report Slider" },
  { src: img6, alt: "Alo Hero Section" },
  { src: img7, alt: "Purevea Glass Split Section" },
  { src: img8, alt: "Stretch Event Countdown" },
  { src: img9, alt: "Dynamic Hero Slider" },
];

export function ImageStreamShowcase() {
  return (
    <section className="relative w-full bg-white text-zinc-900 py-12 lg:py-16 overflow-hidden border-t border-b border-zinc-200">
      {/* Subtle Background Accent Wash */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-50/50 via-purple-50/20 to-transparent blur-3xl pointer-events-none" />

      {/* Full-width 3D Corridor with Spaced & Larger Cards */}
      <div className="w-full">
        <ImageStreamHero
          images={STREAM_IMAGES}
          speed={24}
          cards={7}
          axis={52}
          path={{
            cardWidth: 26,
            cardHeight: 36,
            cardRadius: 0.8,
            railExit: 52,
            exitHeight: 56,
          }}
          className="h-[680px] md:h-[760px] lg:h-[840px] w-full bg-white"
        >
          {/* Top Heading Overlay */}
          <div className="relative z-10 flex h-full flex-col items-center justify-start pt-8 md:pt-12 text-center px-4 sm:px-6">
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-zinc-950 font-headings leading-[1.1]">
              Experience Store Design <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-zinc-950 via-zinc-700 to-zinc-950 bg-clip-text text-transparent">
                In Motion
              </span>
            </h2>
          </div>
        </ImageStreamHero>
      </div>
    </section>
  );
}

export default ImageStreamShowcase;
