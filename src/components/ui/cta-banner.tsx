"use client";

import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";

export function CtaBanner() {
  return (
    <section className="w-full border-t border-b border-zinc-800 bg-zinc-950">
      <div className="mx-auto max-w-4xl px-6 py-12 md:py-16 flex flex-col md:flex-row items-center justify-between gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col gap-2 text-center md:text-left"
        >
          <span className="text-[10px] md:text-xs uppercase tracking-widest text-zinc-500 font-bold font-mono">
            Elevate Store Design & Conversions
          </span>
          {/* ✅ SEO fix: added keyword-rich H2 copy */}
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight leading-none text-white">
            Ready to boost your Shopify store?
          </h2>
        </motion.div>

        {/* ✅ SEO fix: was linking to generic apps.shopify.com — now points to Klenzo's own app */}
        <motion.a
          href="https://apps.shopify.com/ai-section-hub"
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
          className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-black font-bold rounded-xl hover:bg-zinc-100 transition-colors shadow-lg w-full md:w-auto text-center shrink-0"
        >
          Install Free on Shopify
          <ArrowRight className="w-4 h-4" />
        </motion.a>
      </div>
    </section>
  );
}
