"use client";

import { useState, useEffect } from "react";
import { CoverflowCarousel, type CoverflowSlide } from "@/components/ui/coverflow-carousel";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { trackAppInstallClick } from "@/components/ui/AnalyticsTracker";

// All 20 Assets from Section 3 Images directory
import sec3Asset1 from "@/ai section hub images/section 3 images/Minimal Product Grid-DfxK2Gvv.png";
import sec3Asset2 from "@/ai section hub images/section 3 images/Buccellati Categories-P4FFCcKT.gif";
import sec3Asset3 from "@/ai section hub images/section 3 images/Celebshine About Iconic Story-desktop-Dnkp5yHh.png";
import sec3Asset4 from "@/ai section hub images/section 3 images/Curated Trending Duo-UDtdsFm8.png";
import sec3Asset5 from "@/ai section hub images/section 3 images/DIFF Shape Bubbles Slider-CrtTdHL5.gif";
import sec3Asset6 from "@/ai section hub images/section 3 images/DeBeers Jewellery Grid-DiIdkQF9.png";
import sec3Asset7 from "@/ai section hub images/section 3 images/Fernando Jorge Split-BQWFFaxn.png";
import sec3Asset8 from "@/ai section hub images/section 3 images/Luxury Dynamic Header-DIm0i-m6.png";
import sec3Asset9 from "@/ai section hub images/section 3 images/Luxury Instagram Gallery-CSRe-ycT.png";
import sec3Asset10 from "@/ai section hub images/section 3 images/Sticky Scroll Images-cAmzMfzI.mp4";
import sec3Asset11 from "@/ai section hub images/section 3 images/Sticky Scroll Images-desktop-preview-3-CwM3bVae.mp4";
import sec3Asset12 from "@/ai section hub images/section 3 images/Sticky Story Showcase-video-D4PwugJT.mp4";
import sec3Asset13 from "@/ai section hub images/section 3 images/purevea-glass-split-Nt_mymfS.png";
import sec3Asset14 from "@/ai section hub images/section 3 images/shop-by-category-preview-Cd3BY_bB.png";
import sec3Asset15 from "@/ai section hub images/section 3 images/sticky-collection-slider-preview-B1FUg1gx.png";
import sec3Asset16 from "@/ai section hub images/section 3 images/stiletto-dynamic-hero-ezgif.com-video-to-gif-converter-B0j-6B2m.gif";
import sec3Asset17 from "@/ai section hub images/section 3 images/stretch-event-countdown-d7lAg3yT.png";
import sec3AssetBrandStory from "@/ai section hub images/section 3 images/Brand Story Grid-Cfu1tNW4.png";
import sec3AssetTimelessCollections from "@/ai section hub images/section 3 images/Timeless Collections Grid-D28zT-8L.png";
import sec3AssetLuxuryMosaic from "@/ai section hub images/section 3 images/luxury-mosaic-categories-Cl1SY6wB.png";

const COVERFLOW_SLIDES: CoverflowSlide[] = [
  // 1. Minimal Product Grid
  {
    src: sec3Asset1,
    alt: "Minimal Product Grid Section",
    title: "Minimal Product Grid",
    subtitle: "Clean, responsive ecommerce product catalog with hover interactions",
    meta: [
      { label: "Category", value: "Product Catalog" },
      { label: "Mobile Speed", value: "100/100" },
      { label: "Code Required", value: "0 Lines" },
    ],
  },
  // 2. Sticky Scroll Images Video
  {
    src: sec3Asset11,
    type: "video",
    alt: "Sticky Scroll Images Video Preview",
    title: "Sticky Scroll Image Corridor",
    subtitle: "Interactive video-enabled sticky scrolling section preview",
    meta: [
      { label: "Format", value: "HD MP4 Video" },
      { label: "Type", value: "Sticky Scroll" },
      { label: "Autoplay", value: "Muted Seamless" },
    ],
  },
  // 3. Stretch Event Urgency Timer
  {
    src: sec3Asset17,
    alt: "Stretch Event Urgency Timer Section",
    title: "Stretch Event Urgency Timer",
    subtitle: "Real-time flash sale countdown bar with automatic coupon application",
    meta: [
      { label: "Category", value: "Urgency Banner" },
      { label: "Timer Mode", value: "Evergreen / Fixed" },
      { label: "FOMO Boost", value: "+34%" },
    ],
  },
  // 4. Shop By Category Navigator
  {
    src: sec3Asset14,
    alt: "Shop By Category Section Preview",
    title: "Shop By Category Navigator",
    subtitle: "Visual collection category selector with animated thumbnail cards",
    meta: [
      { label: "Category", value: "Navigation" },
      { label: "Install Time", value: "< 1 Min" },
      { label: "Mobile Ready", value: "Yes" },
    ],
  },
  // 5. Sticky Collection Carousel
  {
    src: sec3Asset15,
    alt: "Sticky Collection Carousel Preview",
    title: "Sticky Collection Carousel",
    subtitle: "Smooth sticky-scrolling product carousel with live collection tags",
    meta: [
      { label: "Category", value: "Collection Slider" },
      { label: "Liquid Standard", value: "Liquid 2.0" },
      { label: "SEO Optimized", value: "Schema Ready" },
    ],
  },
  // 6. Brand Story Grid (POSITION 6)
  {
    src: sec3AssetBrandStory,
    alt: "Brand Story Grid Section",
    title: "Brand Story Grid",
    subtitle: "Editorial brand story grid section showcasing heritage and vision",
    meta: [
      { label: "Category", value: "Brand Story" },
      { label: "Layout", value: "Grid Showcase" },
      { label: "Code Required", value: "0 Lines" },
    ],
  },
  // 7. Purevea Glassmorphism Split
  {
    src: sec3Asset13,
    alt: "Purevea Glassmorphism Split Section",
    title: "Purevea Glassmorphism Split",
    subtitle: "Modern glass backdrop feature banner with bullet callouts",
    meta: [
      { label: "Category", value: "Glassmorphism" },
      { label: "SEO Optimized", value: "Schema Ready" },
      { label: "Style", value: "Modern Premium" },
    ],
  },
  // 8. Celebshine About Iconic Story
  {
    src: sec3Asset3,
    alt: "Celebshine About Iconic Story Section",
    title: "Celebshine About Iconic Story",
    subtitle: "High-converting editorial story layout with brand storytelling grid",
    meta: [
      { label: "Category", value: "Brand Story" },
      { label: "Layout", value: "Editorial Desktop" },
      { label: "Code Required", value: "0 Lines" },
    ],
  },
  // 9. Buccellati Category Grid
  {
    src: sec3Asset2,
    alt: "Buccellati Category Grid",
    title: "Buccellati Category Grid",
    subtitle: "Interactive animated category navigator with hover previews",
    meta: [
      { label: "Format", value: "Animated GIF" },
      { label: "Category", value: "Category Grid" },
      { label: "Interactive", value: "Hover Effects" },
    ],
  },
  // 10. Luxury Dynamic Header
  {
    src: sec3Asset8,
    alt: "Luxury Dynamic Header Section",
    title: "Luxury Dynamic Header",
    subtitle: "Premium full-width header navigation & hero spotlight",
    meta: [
      { label: "Category", value: "Header / Hero" },
      { label: "Speed Impact", value: "0ms" },
      { label: "Theme Integration", value: "1 Click" },
    ],
  },
  // 11. Timeless Collections Grid (POSITION 11)
  {
    src: sec3AssetTimelessCollections,
    alt: "Timeless Collections Grid Section",
    title: "Timeless Collections Grid",
    subtitle: "Curated timeless collections showcase with modern typography",
    meta: [
      { label: "Category", value: "Collection Grid" },
      { label: "Style", value: "Minimal Luxury" },
      { label: "Mobile Speed", value: "100/100" },
    ],
  },
  // 12. Sticky Scroll Video Showcase
  {
    src: sec3Asset10,
    type: "video",
    alt: "Sticky Scroll Images Video Preview",
    title: "Sticky Scroll Video Showcase",
    subtitle: "High-definition sticky scrolling video feature section",
    meta: [
      { label: "Format", value: "HD MP4 Video" },
      { label: "Category", value: "Sticky Scroll" },
      { label: "Video", value: "Autoplay Loop" },
    ],
  },
  // 13. Curated Trending Duo
  {
    src: sec3Asset4,
    alt: "Curated Trending Duo Section",
    title: "Curated Trending Duo",
    subtitle: "Side-by-side featured product duo showcase with instant buy action",
    meta: [
      { label: "Category", value: "Featured Duo" },
      { label: "Conversion Boost", value: "+28%" },
      { label: "Theme Support", value: "All Shopify Themes" },
    ],
  },
  // 14. DIFF Shape Bubbles Slider
  {
    src: sec3Asset5,
    alt: "DIFF Shape Bubbles Slider Preview",
    title: "DIFF Shape Bubbles Slider",
    subtitle: "Animated product shape filter & bubble carousel",
    meta: [
      { label: "Format", value: "Animated GIF" },
      { label: "Category", value: "Shape Filter" },
      { label: "Animation", value: "Smooth Loops" },
    ],
  },
  // 15. DeBeers Luxury Jewellery Grid
  {
    src: sec3Asset6,
    alt: "DeBeers Luxury Jewellery Grid",
    title: "DeBeers Luxury Jewellery Grid",
    subtitle: "High-end luxury collection grid with multi-angle image focus",
    meta: [
      { label: "Category", value: "Luxury Grid" },
      { label: "Aspect Ratio", value: "16/10 Widescreen" },
      { label: "Mobile Speed", value: "100/100" },
    ],
  },
  // 16. Fernando Jorge Split Showcase
  {
    src: sec3Asset7,
    alt: "Fernando Jorge Split Showcase",
    title: "Fernando Jorge Split Showcase",
    subtitle: "Minimalist side-by-side product highlight & editorial text split",
    meta: [
      { label: "Category", value: "Editorial Split" },
      { label: "Customizable", value: "100%" },
      { label: "Liquid 2.0", value: "Supported" },
    ],
  },
  // 17. Luxury Instagram Feed & Gallery
  {
    src: sec3Asset9,
    alt: "Luxury Instagram Gallery Section",
    title: "Luxury Instagram Feed & Gallery",
    subtitle: "Shoppable social feed grid with pop-up product cards",
    meta: [
      { label: "Category", value: "Instagram Feed" },
      { label: "Shoppable", value: "Tag Products" },
      { label: "Engagement", value: "+40%" },
    ],
  },
  // 18. Stiletto Dynamic Hero Slider
  {
    src: sec3Asset16,
    alt: "Stiletto Dynamic Hero Animated GIF",
    title: "Stiletto Dynamic Hero Slider",
    subtitle: "High-energy animated hero slider with text transitions",
    meta: [
      { label: "Format", value: "Animated GIF" },
      { label: "Category", value: "Dynamic Hero" },
      { label: "Touch Gestures", value: "Supported" },
    ],
  },
  // 19. Sticky Story Video Showcase
  {
    src: sec3Asset12,
    type: "video",
    alt: "Sticky Story Video Showcase Preview",
    title: "Sticky Story Video Showcase",
    subtitle: "High-definition shoppable video feed and story slider",
    meta: [
      { label: "Format", value: "HD MP4 Video" },
      { label: "Category", value: "Shoppable Feed" },
      { label: "Engagement", value: "+45%" },
    ],
  },
  // 20. Luxury Mosaic Categories (VERY LAST POSITION)
  {
    src: sec3AssetLuxuryMosaic,
    alt: "Luxury Mosaic Categories Section",
    title: "Luxury Mosaic Categories",
    subtitle: "Multi-item mosaic category grid layout for luxury store collections",
    meta: [
      { label: "Category", value: "Mosaic Grid" },
      { label: "Speed Impact", value: "0ms" },
      { label: "Code Required", value: "0 Lines" },
    ],
  },
];

export function CoverflowShowcase() {
  const [previewSlide, setPreviewSlide] = useState<CoverflowSlide | null>(null);

  // Lock background scroll when preview modal is open
  useEffect(() => {
    if (previewSlide) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [previewSlide]);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setPreviewSlide(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <section className="relative w-full bg-black text-white py-20 lg:py-28 overflow-hidden border-t border-zinc-900">
      {/* Background Subtle Gradient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-zinc-900/40 via-black to-black blur-3xl pointer-events-none" />

      <div className="relative w-full z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-4xl mx-auto px-4 mb-6 space-y-3">
          <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-zinc-900/90 border border-zinc-800 text-zinc-300 text-xs font-medium uppercase tracking-widest shadow-inner">
            <span>100+ SECTIONS & HOMEPAGE TEMPLATES</span>
          </div>

          <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight font-headings leading-tight max-w-4xl mx-auto">
            Explore 100+ Native Liquid Sections & <br />
            <span className="bg-gradient-to-r from-white via-zinc-300 to-zinc-500 bg-clip-text text-transparent">
              Ready-Made Homepage Templates
            </span>
          </h2>

          <p className="text-zinc-400 text-xs sm:text-sm md:text-base max-w-xl mx-auto leading-relaxed">
            Discover high-converting Liquid sections and pre-built homepage templates. Drag, swipe, or click to inspect.
          </p>
        </div>

        {/* Full-Width 3D Coverflow Carousel with Click-to-Preview Modal */}
        <div className="w-full">
          <CoverflowCarousel
            slides={COVERFLOW_SLIDES}
            cardWidth="clamp(320px, 46vw, 640px)"
            cardHeight="clamp(200px, 29vw, 400px)"
            aspectRatio="16/10"
            rotate={34}
            depth={0.42}
            perspective={2.8}
            gap={0.06}
            showCaption={true}
            showPagination={true}
            showNavigation={true}
            onSlideClick={(slide) => setPreviewSlide(slide)}
            className="py-4 w-full"
          />
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 text-center px-4">
          <a
            href="https://apps.shopify.com/ai-section-hub"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackAppInstallClick("ai-section-hub", "coverflow-carousel")}
            className="inline-flex items-center justify-center px-8 py-3.5 rounded-full bg-white text-zinc-950 text-sm md:text-base font-bold hover:bg-zinc-100 transition-all duration-300 shadow-[0_0_25px_rgba(255,255,255,0.12)] hover:shadow-[0_0_35px_rgba(255,255,255,0.22)] hover:scale-105 active:scale-95 cursor-pointer"
          >
            <span>Install AI Section Hub on Shopify</span>
          </a>
        </div>

      </div>

      {/* Full Resolution Interactive Preview Modal */}
      <AnimatePresence>
        {previewSlide && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={() => setPreviewSlide(null)}
            className="fixed inset-0 z-[9999] bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 md:p-8"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-5xl w-full max-h-[92vh] bg-zinc-950 border border-zinc-800 rounded-3xl p-5 sm:p-7 md:p-8 shadow-[0_30px_100px_rgba(0,0,0,0.9)] overflow-y-auto flex flex-col justify-between"
            >
              {/* Modal Top Bar */}
              <div className="flex items-center justify-between border-b border-zinc-800/80 pb-4 mb-4">
                <div>
                  <div className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs font-semibold uppercase tracking-wider mb-1.5">
                    <span>FULL RESOLUTION SECTION PREVIEW</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white font-headings">
                    {previewSlide.title}
                  </h3>
                </div>

                <button
                  type="button"
                  aria-label="Close Preview"
                  onClick={() => setPreviewSlide(null)}
                  className="p-2.5 rounded-full bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800 transition-all duration-200 shadow-md cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Center Stage Media Player / Viewport */}
              <div className="my-auto py-3 flex items-center justify-center overflow-hidden rounded-2xl bg-zinc-900/80 border border-zinc-800/80 shadow-2xl min-h-[300px] max-h-[62vh]">
                {previewSlide.src.endsWith(".mp4") || previewSlide.type === "video" ? (
                  <video
                    src={previewSlide.src}
                    controls
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="max-h-[60vh] w-auto max-w-full rounded-xl object-contain shadow-2xl"
                  />
                ) : (
                  <img
                    src={previewSlide.src}
                    alt={previewSlide.alt}
                    className="max-h-[60vh] w-auto max-w-full rounded-xl object-contain shadow-2xl"
                  />
                )}
              </div>

              {/* Modal Bottom Metadata & CTA */}
              <div className="mt-4 pt-4 border-t border-zinc-800/80 flex flex-wrap items-center justify-between gap-4">
                <div className="space-y-1 max-w-xl">
                  <p className="text-xs sm:text-sm text-zinc-300 font-medium">
                    {previewSlide.subtitle}
                  </p>
                  {previewSlide.meta && (
                    <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-zinc-400">
                      {previewSlide.meta.map((m) => (
                        <span key={m.label} className="bg-zinc-900 px-2.5 py-1 rounded-md border border-zinc-800">
                          <strong className="text-zinc-200">{m.label}:</strong> {m.value}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <a
                  href="https://apps.shopify.com/ai-section-hub"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackAppInstallClick("ai-section-hub", "modal-preview")}
                  className="inline-flex items-center justify-center px-6 py-2.5 rounded-full bg-white text-zinc-950 text-xs sm:text-sm font-bold hover:bg-zinc-100 transition-all duration-200 shadow-md hover:scale-105 active:scale-95 cursor-pointer"
                >
                  <span>Install Free on Shopify</span>
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

export default CoverflowShowcase;
