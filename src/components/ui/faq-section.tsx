"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown, ArrowUpRight } from "lucide-react";

function LinkedinIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
    </svg>
  );
}

interface FaqItem {
  number: string;
  question: string;
  answer: string;
}

export function FaqSection() {
  const [activeIndex, setActiveIndex] = useState<number | null>(0);

  const faqs: FaqItem[] = [
    {
      number: "01",
      question: "Who is Mitul Zalavadiya and what is your core expertise?",
      answer: "I am a Shopify Developer & Shopify App Architect based in Surat, Gujarat (BCA graduate from GLS University, Ahmedabad). I specialize in custom Online Store 2.0 themes, bespoke Liquid sections, high-performing storefronts, Shopify apps like AI Section Hub (700+ sections), and cross-platform mobile apps with React Native.",
    },
    {
      number: "02",
      question: "What specific Shopify development services do you provide?",
      answer: "I provide end-to-end Shopify engineering: pixel-perfect custom theme development from Figma, bespoke reusable Liquid sections, 90+ Google PageSpeed performance optimization, custom Shopify app development using Shopify APIs/React, and seamless theme migrations to Online Store 2.0.",
    },
    {
      number: "03",
      question: "Why choose custom Liquid code over page builders like PageFly or GemPages?",
      answer: "Third-party page builders inject heavy render-blocking JavaScript and external CSS that drastically degrade page speed and conversion rates. I build clean, native Shopify Liquid sections directly into your theme. They load instantly, compile on Shopify edge servers, and work seamlessly with the native theme customizer.",
    },
    {
      number: "04",
      question: "What is AI Section Hub and what was your role in it?",
      answer: "AI Section Hub is a flagship Shopify app featuring 700+ premium conversion-boosting sections (curved carousels, 3D lookbooks, sticky layered heroes, flash sale timers). At Solvifytech, I built and maintain the app using Shopify APIs, Liquid, React, and JavaScript, while also creating 30+ official video tutorials on YouTube.",
    },
    {
      number: "05",
      question: "Are you available for freelance projects or full-time opportunities?",
      answer: "Yes! I am actively open to freelance client projects, e-commerce development retainers, and full-time software engineering roles. You can reach out directly via email at mitulzalavadiya10@gmail.com, message me on LinkedIn, or call +91 9099105448.",
    },
  ];

  const toggleAccordion = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-24 px-6 md:px-8 border-t border-zinc-900 bg-black text-white">
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column - Heading Context */}
          <div className="lg:col-span-5 flex flex-col gap-6 lg:sticky lg:top-32">
            <div className="inline-flex w-fit px-3 py-1 text-xs uppercase tracking-widest bg-zinc-900 border border-zinc-800 text-zinc-300 rounded-full font-headings font-semibold">
              Frequently Asked Questions
            </div>
            <h2 className="text-4xl md:text-5xl font-headings font-extrabold tracking-tight leading-tight text-white">
              Questions about working together?
            </h2>
            <p className="text-zinc-400 text-base md:text-lg leading-relaxed max-w-md">
              Here are direct answers about my development background, Shopify services, custom Liquid sections, and project availability.
            </p>
            <div className="flex items-center gap-4 flex-wrap mt-2">
              <a
                href="/faq"
                className="inline-flex items-center gap-2 text-white font-bold text-sm border-b border-white pb-1 w-fit hover:text-zinc-300 hover:border-zinc-300 transition-colors group"
              >
                View all developer FAQs
                <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
              <a
                href="https://www.linkedin.com/in/mitul-zalavadiya-784873369?utm_source=share_via&utm_content=profile&utm_medium=member_android"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-blue-400 hover:text-blue-300 text-sm font-semibold transition-colors"
              >
                <LinkedinIcon className="w-4 h-4 fill-current" />
                LinkedIn Profile
              </a>
            </div>
          </div>

          {/* Right Column - Accordion Items */}
          <div className="lg:col-span-7 flex flex-col gap-4 w-full">
            {faqs.map((faq, index) => {
              const isOpen = activeIndex === index;
              return (
                <div
                  key={index}
                  className={`border rounded-2xl transition-all duration-300 ${
                    isOpen
                      ? "border-zinc-700 bg-zinc-950/90 shadow-lg"
                      : "border-zinc-850/80 bg-zinc-950/30 hover:border-zinc-800"
                  }`}
                >
                  <button
                    onClick={() => toggleAccordion(index)}
                    className="w-full text-left p-6 flex justify-between items-center gap-4 group focus:outline-none cursor-pointer"
                  >
                    <div className="flex gap-4 items-center">
                      <span className="font-mono text-zinc-500 text-sm font-semibold">{faq.number}.</span>
                      <span className="text-white font-bold text-base md:text-lg leading-tight transition-colors group-hover:text-zinc-200">
                        {faq.question}
                      </span>
                    </div>
                    <div
                      className={`flex items-center justify-center w-8 h-8 rounded-full border border-zinc-800 bg-black text-zinc-400 transition-all duration-300 ${
                        isOpen ? "rotate-180 border-white text-white" : "group-hover:text-white group-hover:border-zinc-700"
                      }`}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-6 pl-14 text-zinc-300 text-sm md:text-base leading-relaxed border-t border-zinc-900/80 pt-3">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
}
