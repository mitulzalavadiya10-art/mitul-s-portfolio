import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import { MoveRight, PhoneCall, ArrowUpRight, MapPin, Briefcase } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { WebShotButton } from "@/components/ui/web-shot-button";

function Hero() {
  const navigate = useNavigate();
  const [titleNumber, setTitleNumber] = useState(0);
  const titles = useMemo(
    () => [
      "Shopify Websites",
      "AI Section Hub App",
      "Custom OS 2.0 Themes",
      "Reusable Liquid Sections",
      "High-Converting Stores",
    ],
    []
  );

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (titleNumber === titles.length - 1) {
        setTitleNumber(0);
      } else {
        setTitleNumber(titleNumber + 1);
      }
    }, 2400);
    return () => clearTimeout(timeoutId);
  }, [titleNumber, titles]);

  return (
    <div className="w-full min-h-screen bg-white flex items-center justify-center pt-28 pb-16 md:pt-36 md:pb-24 px-4">
      <div className="container mx-auto max-w-5xl">
        <div className="flex gap-8 items-center justify-center flex-col">
          
          {/* Eyebrow Badge — Verified Profile & Current Role */}
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <a
              href="https://www.linkedin.com/in/mitul-zalavadiya-784873369?utm_source=share_via&utm_content=profile&utm_medium=member_android"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-zinc-200 bg-zinc-50 hover:bg-zinc-100 text-zinc-800 text-xs md:text-sm font-medium transition-all shadow-xs group cursor-pointer"
            >
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-semibold text-zinc-950">Mitul Zalavadiya</span>
              <span className="text-zinc-300">•</span>
              <span className="text-zinc-600 group-hover:text-zinc-900 transition-colors">
                Shopify Developer at Solvifytech
              </span>
              <MoveRight className="w-3.5 h-3.5 text-zinc-400 group-hover:translate-x-0.5 group-hover:text-zinc-700 transition-all" />
            </a>
          </motion.div>

          {/* Main Headline with Animated Ticker */}
          <div className="flex gap-4 flex-col items-center">
            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl max-w-4xl tracking-tight text-center font-bold text-zinc-950 leading-[1.12]">
              <span className="block text-zinc-950">Building Next-Gen</span>
              <span className="relative flex w-full justify-center overflow-hidden text-center h-[1.3em] md:h-[1.25em] mt-1 md:mt-2">
                &nbsp;
                {titles.map((title, index) => (
                  <motion.span
                    key={index}
                    className="absolute font-extrabold bg-gradient-to-r from-zinc-950 via-zinc-800 to-zinc-600 bg-clip-text text-transparent px-2"
                    initial={{ opacity: 0, y: "-100%" }}
                    transition={{ type: "spring", stiffness: 60, damping: 15 }}
                    animate={
                      titleNumber === index
                        ? {
                            y: 0,
                            opacity: 1,
                          }
                        : {
                            y: titleNumber > index ? "-120%" : "120%",
                            opacity: 0,
                          }
                    }
                  >
                    {title}
                  </motion.span>
                ))}
              </span>
            </h1>

            {/* Description: Authentic 1 Portfolio + 1 Company Persona */}
            <p className="text-base sm:text-lg md:text-xl leading-relaxed text-zinc-600 max-w-2xl text-center font-normal mt-2">
              I&apos;m <span className="font-semibold text-zinc-950">Mitul Zalavadiya</span> — Shopify Developer based in Surat. 
              At <span className="font-semibold text-zinc-950">Solvifytech</span>, I engineer custom Online Store 2.0 themes, reusable Liquid sections, and production apps like <span className="font-semibold text-zinc-900">AI Section Hub</span> (700+ sections). 
              Crafting fast, responsive, and dynamic e-commerce experiences.
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto mt-2">
            <WebShotButton
              size="md"
              color="#09090b"
              threadColor="#000000"
              reach={160}
              threads={6}
              onClick={() => navigate("/shopify-website")}
              className="w-full sm:w-auto h-13 sm:h-14 px-8 text-sm sm:text-base font-semibold shadow-md hover:shadow-xl transition-all cursor-pointer text-white"
            >
              View Websites &amp; Work
              <ArrowUpRight className="w-4 h-4 ml-0.5 text-white" />
            </WebShotButton>

            <a
              href="tel:+919099105448"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white text-zinc-900 hover:text-black border-2 border-zinc-200 hover:border-zinc-950 hover:bg-zinc-50 font-semibold px-8 h-13 sm:h-14 text-sm sm:text-base rounded-full transition-all shadow-xs hover:shadow-sm cursor-pointer text-center"
            >
              Call / WhatsApp: +91 9099105448 <PhoneCall className="w-4 h-4 text-zinc-700" />
            </a>
          </div>

          {/* Proof & Experience Badges Strip */}
          <div className="pt-6 mt-2 flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs sm:text-sm text-zinc-600 font-medium border-t border-zinc-100 max-w-3xl w-full">
            <div className="flex items-center gap-1.5 bg-zinc-50 hover:bg-zinc-100 transition-colors px-3.5 py-1.5 rounded-full border border-zinc-200 text-zinc-800">
              <Briefcase className="w-3.5 h-3.5 text-zinc-800" />
              <span className="font-semibold text-zinc-900">Solvifytech</span>
              <span className="text-zinc-500">(Shopify Dev)</span>
            </div>
            <div className="flex items-center gap-1.5 bg-zinc-50 hover:bg-zinc-100 transition-colors px-3.5 py-1.5 rounded-full border border-zinc-200 text-zinc-800">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" />
              <span className="font-semibold text-zinc-900">AI Section Hub</span>
              <span className="text-zinc-500">(Shopify App)</span>
            </div>
            <div className="flex items-center gap-1.5 bg-zinc-50 hover:bg-zinc-100 transition-colors px-3.5 py-1.5 rounded-full border border-zinc-200 text-zinc-800">
              <span className="inline-block w-2 h-2 rounded-full bg-blue-500" />
              <span className="font-semibold text-zinc-900">Liquid &amp; OS 2.0</span>
            </div>
            <div className="flex items-center gap-1.5 bg-zinc-50 hover:bg-zinc-100 transition-colors px-3.5 py-1.5 rounded-full border border-zinc-200 text-zinc-800">
              <MapPin className="w-3.5 h-3.5 text-zinc-700" />
              <span className="font-semibold text-zinc-900">Surat, India</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export { Hero };
