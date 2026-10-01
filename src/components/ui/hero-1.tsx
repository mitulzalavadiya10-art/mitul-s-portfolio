import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"

interface HeroProps {
  eyebrow?: string
  title: string
  subtitle: string
  ctaLabel?: string
  ctaHref?: string
  secondaryCtaLabel?: string
  secondaryCtaHref?: string
}

export function Hero({
  eyebrow = "Innovate Without Limits",
  title,
  subtitle,
  ctaLabel = "Explore Now",
  ctaHref = "#",
  secondaryCtaLabel,
  secondaryCtaHref,
}: HeroProps) {
  return (
    <section
      id="hero"
      className="relative mx-auto w-full min-h-[100dvh] flex flex-col justify-center items-center pt-24 md:pt-28 pb-20 px-6 text-center md:px-8 
      overflow-hidden 
      bg-[linear-gradient(to_bottom,#ffffff,#ffffff_60%,#f4f4f6_85%,#000000_100%)]"
    >
      {/* Grid BG */}
      <div
        className="absolute -z-10 inset-0 opacity-80 h-full w-full 
        bg-[linear-gradient(to_right,#e4e4e7_1px,transparent_1px),linear-gradient(to_bottom,#e4e4e7_1px,transparent_1px)] 
        bg-[size:6rem_5rem] 
        [mask-image:radial-gradient(ellipse_80%_60%_at_50%_45%,#000_70%,transparent_110%)]"
      />

      <div className="max-w-5xl mx-auto flex flex-col items-center justify-center my-auto">
        {/* Eyebrow */}
        {eyebrow && (
          <div className="mb-4">
            <span className="text-xs md:text-sm font-headings font-bold uppercase tracking-widest text-zinc-500">
              {eyebrow}
            </span>
          </div>
        )}

        {/* Title */}
        <h1
          className="animate-fade-in -translate-y-4 text-balance 
          bg-gradient-to-br from-black from-30% to-zinc-700 
          bg-clip-text py-4 md:py-6 text-5xl font-headings font-black leading-[1.05] tracking-tighter 
          text-transparent opacity-0 sm:text-6xl md:text-7xl lg:text-8xl"
        >
          {title}
        </h1>

        {/* Subtitle */}
        <p
          className="animate-fade-in mb-10 md:mb-12 -translate-y-4 text-balance 
          text-lg tracking-tight text-zinc-600 
          opacity-0 md:text-xl max-w-3xl mx-auto"
        >
          {subtitle}
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-wrap justify-center items-center gap-4 z-20 relative">
          {ctaLabel && (
            ctaHref.startsWith("http") ? (
              <Button
                asChild
                className="w-fit md:w-56 tracking-tight text-center text-base !bg-black !text-white hover:!bg-zinc-800 shadow-lg cursor-pointer rounded-xl h-12 px-6 font-semibold transition-all duration-200"
              >
                <a href={ctaHref} target="_blank" rel="noopener noreferrer">{ctaLabel}</a>
              </Button>
            ) : (
              <Button
                asChild
                className="w-fit md:w-56 tracking-tight text-center text-base !bg-black !text-white hover:!bg-zinc-800 shadow-lg cursor-pointer rounded-xl h-12 px-6 font-semibold transition-all duration-200"
              >
                <Link to={ctaHref}>{ctaLabel}</Link>
              </Button>
            )
          )}

          {secondaryCtaLabel && (
            secondaryCtaHref && secondaryCtaHref.startsWith("http") ? (
              <Button
                asChild
                className="w-fit md:w-52 tracking-tight text-center text-base !bg-white !text-zinc-900 border-2 border-zinc-300 hover:!bg-zinc-100 hover:border-zinc-400 shadow-md cursor-pointer rounded-xl h-12 px-6 font-semibold transition-all duration-200"
              >
                <a href={secondaryCtaHref} target="_blank" rel="noopener noreferrer">{secondaryCtaLabel}</a>
              </Button>
            ) : (
              <Button
                asChild
                className="w-fit md:w-52 tracking-tight text-center text-base !bg-white !text-zinc-900 border-2 border-zinc-300 hover:!bg-zinc-100 hover:border-zinc-400 shadow-md cursor-pointer rounded-xl h-12 px-6 font-semibold transition-all duration-200"
              >
                <Link to={secondaryCtaHref || "/shopify-website"}>{secondaryCtaLabel}</Link>
              </Button>
            )
          )}
        </div>
      </div>

      {/* Scroll Down Indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1.5 opacity-60 hover:opacity-100 transition-opacity pointer-events-none">
        <span className="text-[10px] font-headings font-bold uppercase tracking-widest text-zinc-400">Scroll</span>
        <div className="w-5 h-8 rounded-full border border-zinc-400/80 flex items-start justify-center p-1">
          <div className="w-1 h-2 rounded-full bg-zinc-400 animate-bounce" />
        </div>
      </div>

      {/* Bottom Seamless Fade into Dark Section Below */}
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent via-zinc-900/40 to-black pointer-events-none z-10" />
    </section>
  )
}
