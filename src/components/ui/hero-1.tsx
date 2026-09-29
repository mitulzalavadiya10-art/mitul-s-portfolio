import { Button } from "@/components/ui/button"

interface HeroProps {
  eyebrow?: string
  title: string
  subtitle: string
  ctaLabel?: string
  ctaHref?: string
}

export function Hero({
  eyebrow = "Innovate Without Limits",
  title,
  subtitle,
  ctaLabel = "Explore Now",
  ctaHref = "#",
}: HeroProps) {
  return (
    <section
      id="hero"
      className="relative mx-auto w-full pt-12 md:pt-20 lg:pt-28 pb-16 md:pb-24 px-6 text-center md:px-8 
      overflow-hidden 
      bg-[linear-gradient(to_bottom,#fff,#ffffff_50%,#f4f4f5_88%)]  
      rounded-b-xl"
    >
      {/* Grid BG */}
      <div
        className="absolute -z-10 inset-0 opacity-80 h-[600px] w-full 
        bg-[linear-gradient(to_right,#e4e4e7_1px,transparent_1px),linear-gradient(to_bottom,#e4e4e7_1px,transparent_1px)] 
        bg-[size:6rem_5rem] 
        [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]"
      />

      {/* Radial Accent */}
      <div
        className="absolute left-1/2 top-[calc(100%-90px)] lg:top-[calc(100%-150px)] 
        h-[500px] w-[700px] md:h-[500px] md:w-[1100px] lg:h-[750px] lg:w-[140%] 
        -translate-x-1/2 rounded-[100%] border border-border bg-white 
        bg-[radial-gradient(closest-side,#fff_82%,#000000)] 
        animate-fade-up"
      />

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
        bg-gradient-to-br from-black from-30% to-black/40 
        bg-clip-text py-6 text-5xl font-headings font-black leading-[1.05] tracking-tighter 
        text-transparent opacity-0 sm:text-6xl md:text-7xl lg:text-8xl"
      >
        {title}
      </h1>

      {/* Subtitle */}
      <p
        className="animate-fade-in mb-12 -translate-y-4 text-balance 
        text-lg tracking-tight text-gray-600 
        opacity-0 md:text-xl max-w-2xl mx-auto"
      >
        {subtitle}
      </p>

      {/* CTA */}
      {ctaLabel && (
        <div className="flex justify-center">
          <Button
            asChild
            variant="outline"
            className="mt-[-20px] w-fit md:w-52 z-20 tracking-tighter text-center text-lg border-black text-black hover:bg-zinc-100"
          >
            <a href={ctaHref} target="_blank" rel="noopener noreferrer">{ctaLabel}</a>
          </Button>
        </div>
      )}

      {/* Bottom Fade */}
      <div
        className="animate-fade-up relative mt-32 opacity-0 [perspective:2000px] 
        after:absolute after:inset-0 after:z-50 
        after:[background:linear-gradient(to_top,hsl(var(--background))_10%,transparent)]"
      />
    </section>
  )
}
