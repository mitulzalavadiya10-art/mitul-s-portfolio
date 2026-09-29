"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";
import { trackAppInstallClick } from "@/components/ui/AnalyticsTracker";

// Import 4 Template Screenshots
import template1Img from "@/ai section hub images/section 3 images/template-1-image.jpg";
import template2Img from "@/ai section hub images/section 3 images/template-2-image.png";
import template3Img from "@/ai section hub images/section 3 images/template-3-image.png";
import template4Img from "@/ai section hub images/section 3 images/template-4-image.png";

export interface HomepageTemplate {
  id: string;
  title: string;
  subtitle: string;
  src: string;
  badge?: "NEW" | "HOT" | "TRENDING";
  category: string;
}

const TEMPLATES: HomepageTemplate[] = [
  {
    id: "template-1",
    title: "Template 1",
    subtitle: "Jasmine Fragrance & Beauty Luxury Store",
    src: template1Img,
    badge: "HOT",
    category: "Fragrance & Beauty",
  },
  {
    id: "template-2",
    title: "Template 2",
    subtitle: "Limited Edition Perfume & Cosmetics Layout",
    src: template2Img,
    badge: "HOT",
    category: "Cosmetics & Skincare",
  },
  {
    id: "template-3",
    title: "Template 3",
    subtitle: "Modern Women Perfume Editorial Boutique",
    src: template3Img,
    badge: "TRENDING",
    category: "Luxury Boutique",
  },
  {
    id: "template-4",
    title: "Template 4",
    subtitle: "High-Converting Ecommerce Homepage Template",
    src: template4Img,
    badge: "NEW",
    category: "Multi-Category Store",
  },
];

export function HomepageTemplatesSection() {
  const [selectedTemplate, setSelectedTemplate] = useState<HomepageTemplate | null>(null);

  // Lock background body scroll when preview modal is open
  useEffect(() => {
    if (selectedTemplate) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [selectedTemplate]);

  // Close modal on ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedTemplate(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <section className="relative w-full bg-black text-white py-20 lg:py-28 overflow-hidden border-t border-zinc-900">
      {/* Background Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-zinc-900/40 via-black to-black blur-3xl pointer-events-none" />

      <div className="relative max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-4xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-zinc-900/90 border border-zinc-800 text-zinc-300 text-xs font-medium uppercase tracking-widest shadow-inner">
            <span>READY-MADE HOMEPAGE TEMPLATES</span>
          </div>

          <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight font-headings leading-tight max-w-4xl mx-auto">
            Ready-Made Homepage Templates & <br />
            <span className="bg-gradient-to-r from-white via-zinc-300 to-zinc-500 bg-clip-text text-transparent">
              High-Converting Store Layouts
            </span>
          </h2>

          <p className="text-zinc-400 text-xs sm:text-sm md:text-base max-w-xl mx-auto leading-relaxed">
            Hover over any template card below to smoothly preview the complete full-length homepage layout.
          </p>
        </div>

        {/* 4 Templates Grid Layout (1 Screen = 4 Cards) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
          {TEMPLATES.map((template) => (
            <div
              key={template.id}
              className="flex flex-col items-center group cursor-pointer"
              onClick={() => setSelectedTemplate(template)}
            >
              {/* Image Viewport Container with Accelerating 3s Hover Auto-Scroll */}
              <div className="relative w-full h-[500px] sm:h-[560px] lg:h-[640px] rounded-3xl overflow-hidden bg-zinc-950 border border-zinc-800/80 hover:border-zinc-700 shadow-2xl transition-all duration-300 group-hover:-translate-y-1.5">
                {/* Circular Badge Overlay (HOT / TRENDING / NEW) */}
                {template.badge && (
                  <div className="absolute top-3.5 right-3.5 z-20 pointer-events-none">
                    {template.badge === "NEW" ? (
                      <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-gradient-to-tr from-rose-600 via-pink-600 to-red-500 text-white font-black text-[11px] sm:text-xs tracking-wider uppercase flex items-center justify-center shadow-[0_4px_16px_rgba(225,29,72,0.6)] border border-white/20">
                        NEW
                      </div>
                    ) : template.badge === "HOT" ? (
                      <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-gradient-to-tr from-orange-600 via-amber-600 to-red-500 text-white font-black text-[11px] sm:text-xs tracking-wider uppercase flex items-center justify-center shadow-[0_4px_16px_rgba(234,88,12,0.6)] border border-white/20">
                        HOT
                      </div>
                    ) : (
                      <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-gradient-to-tr from-violet-600 via-purple-600 to-indigo-500 text-white font-black text-[7px] sm:text-[7.5px] tracking-tighter uppercase leading-[1.05] text-center flex flex-col items-center justify-center shadow-[0_4px_16px_rgba(124,58,237,0.6)] border border-white/20 p-0.5 overflow-hidden">
                        <span>TOP</span>
                        <span>TRENDING</span>
                      </div>
                    )}
                  </div>
                )}

                <img
                  src={template.src}
                  alt={template.title}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-auto object-cover object-top transition-transform duration-[1000ms] group-hover:duration-[3000ms] ease-in group-hover:-translate-y-[calc(100%-500px)] sm:group-hover:-translate-y-[calc(100%-560px)] lg:group-hover:-translate-y-[calc(100%-640px)]"
                />

                {/* Hover Pill Hint without dark overlay */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none flex items-end justify-center p-4 z-10">
                  <span className="px-4 py-1.5 rounded-full bg-zinc-950/80 border border-zinc-700 text-white text-xs font-medium backdrop-blur-md shadow-xl">
                    Click for Full Preview
                  </span>
                </div>
              </div>

              {/* Title Below Card */}
              <div className="mt-4 text-center">
                <h4 className="text-base sm:text-lg font-bold text-white font-headings group-hover:text-zinc-200 transition-colors">
                  {template.title}
                </h4>
              </div>
            </div>
          ))}
        </div>

        {/* Section Bottom CTA */}
        <div className="mt-14 text-center px-4">
          <a
            href="https://apps.shopify.com/ai-section-hub"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackAppInstallClick("ai-section-hub", "homepage-templates")}
            className="inline-flex items-center justify-center px-8 py-3.5 rounded-full bg-white text-zinc-950 text-sm md:text-base font-bold hover:bg-zinc-100 transition-all duration-300 shadow-[0_0_25px_rgba(255,255,255,0.12)] hover:shadow-[0_0_35px_rgba(255,255,255,0.22)] hover:scale-105 active:scale-95 cursor-pointer"
          >
            <span>Install AI Section Hub on Shopify</span>
          </a>
        </div>

      </div>

      {/* Full-Screen Interactive Template Modal */}
      <AnimatePresence>
        {selectedTemplate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={() => setSelectedTemplate(null)}
            className="fixed inset-0 z-[9999] bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-5xl w-full max-h-[92vh] bg-zinc-950 border border-zinc-800 rounded-3xl p-4 sm:p-6 shadow-[0_30px_100px_rgba(0,0,0,0.9)] flex flex-col justify-between"
            >
              {/* Modal Top Bar */}
              <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3 mb-3">
                <div>
                  <div className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs font-semibold uppercase tracking-wider mb-1">
                    <span>HOMEPAGE TEMPLATE PREVIEW</span>
                  </div>
                  <h3 className="text-lg sm:text-2xl font-extrabold text-white font-headings">
                    {selectedTemplate.title} — {selectedTemplate.subtitle}
                  </h3>
                </div>

                <button
                  type="button"
                  aria-label="Close Preview"
                  onClick={() => setSelectedTemplate(null)}
                  className="p-2 rounded-full bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800 transition-all duration-200 shadow-md cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Scrollable Image Viewport */}
              <div className="my-auto overflow-y-auto max-h-[68vh] rounded-xl bg-zinc-900 border border-zinc-800 shadow-2xl p-1">
                <img
                  src={selectedTemplate.src}
                  alt={selectedTemplate.title}
                  className="w-full h-auto rounded-lg object-contain"
                />
              </div>

              {/* Modal Footer CTA */}
              <div className="mt-3 pt-3 border-t border-zinc-800/80 flex items-center justify-between">
                <p className="text-xs text-zinc-400 font-medium">
                  Category: <strong className="text-zinc-200">{selectedTemplate.category}</strong>
                </p>

                <a
                  href="https://apps.shopify.com/ai-section-hub"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackAppInstallClick("ai-section-hub", "template-modal")}
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

export default HomepageTemplatesSection;
