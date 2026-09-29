"use client";

import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import klenzoVideo from "@/videos/klenzo ai vriant main video.mp4";
import klenzoLogo from "@/images/klenzo logo.jpg";
import { trackAppInstallClick } from "@/components/ui/AnalyticsTracker";

const features = [
  "Replace native Shopify variant dropdowns with stunning swatches",
  "Supports color, image, button & custom swatch styles",
  "AI-powered — auto-detects variants for smart display",
  "Works with most Shopify themes — zero coding needed",
  "Fully responsive: desktop, tablet & mobile ready",
];

export function AppShowcase() {
  return (
    <section id="app-showcase" className="w-full bg-black py-20 md:py-28 border-t border-zinc-900">
      <div className="container mx-auto max-w-6xl px-6 md:px-8">

        {/* Section Header */}
        <div className="flex flex-col items-center text-center gap-4 mb-16">
          <span className="inline-flex px-4 py-1 rounded-full border border-zinc-800 bg-zinc-900 text-zinc-400 text-xs uppercase tracking-widest font-headings font-semibold">
            App Feature
          </span>
          <h2 className="text-4xl md:text-5xl font-headings font-extrabold tracking-tight text-white max-w-2xl leading-tight">
            Meet <span className="text-zinc-400">Klenzo: Variant Swatch</span>
          </h2>
          <p className="text-zinc-400 max-w-xl text-base md:text-lg leading-relaxed">
            Replace boring Shopify dropdowns with AI-powered color & image swatches.
            Improve product pages, boost conversions, and support most themes.
          </p>
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-28 items-center">

          {/* LEFT — Autoplay Muted Video */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-xl mx-auto rounded-2xl overflow-hidden border border-zinc-800 shadow-[0_0_60px_8px_rgba(255,255,255,0.05)] bg-zinc-950/40"
          >
            <video
              src={klenzoVideo}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-auto object-cover rounded-2xl"
            />
          </motion.div>

          {/* RIGHT — Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col gap-6"
          >
            <div className="flex flex-col gap-1">
              <a
                href="https://apps.shopify.com/klenzo-product-variant-swatch"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackAppInstallClick('Klenzo: Variant Swatch', 'Showcase Header')}
                className="group hover:opacity-80 transition-opacity w-fit"
              >
                <h3 className="text-2xl md:text-3xl font-headings font-extrabold text-white leading-tight flex items-center gap-3">
                  <img
                    src={klenzoLogo}
                    alt="Klenzo: Variant Swatch — AI-Powered Shopify Swatch App"
                    width={40}
                    height={40}
                    loading="eager"
                    className="w-8 h-8 md:w-10 md:h-10 rounded-lg object-contain"
                  />
                  <span>Klenzo: Variant Swatch</span>
                  <ArrowUpRight className="w-5 h-5 text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200" />
                </h3>
              </a>
              <p className="text-zinc-400 text-sm md:text-base leading-relaxed max-w-sm">
                Visual swatch selectors powered by AI that auto-detect your product variants and display them beautifully — no code needed.
              </p>
            </div>



              {/* Feature bullets */}
              <ul className="flex flex-col gap-3">
                {features.map((feat, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.08 }}
                    className="flex items-start gap-3 text-sm text-zinc-400"
                  >
                    <span className="mt-0.5 flex items-center justify-center w-5 h-5 rounded-full bg-white text-black text-[10px] font-bold shrink-0">
                      ✓
                    </span>
                    {feat}
                  </motion.li>
                ))}
              </ul>

              {/* Identical Glassmorphism CTA Buttons */}
              <div className="flex flex-wrap items-center gap-3 mt-3">
                <motion.a
                  href="https://apps.shopify.com/klenzo-product-variant-swatch"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackAppInstallClick('Klenzo: Variant Swatch', 'Showcase Bottom Link')}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-bold text-sm rounded-full border border-white/20 hover:border-white/40 backdrop-blur-xl transition-all shadow-md cursor-pointer"
                >
                  Install Free on Shopify
                </motion.a>

                <motion.a
                  href="/variantify-docs.html"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-bold text-sm rounded-full border border-white/20 hover:border-white/40 backdrop-blur-xl transition-all shadow-md cursor-pointer"
                >
                  View Documentation
                  <ArrowUpRight className="w-4 h-4 text-zinc-300" />
                </motion.a>
              </div>





            </motion.div>

          </div>
        </div>
      </section>
    );
  }
