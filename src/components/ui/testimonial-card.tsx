import { motion } from "motion/react";
import { Star } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

// --- Type Definitions for props ---
export interface Stat {
  value: string;
  label: string;
}

export interface Testimonial {
  name: string;
  title: string;
  quote?: string;
  avatarSrc: string;
  rating: number;
}

export interface ClientsSectionProps {
  tagLabel: string;
  title: string;
  description: string;
  stats: Stat[];
  testimonials: Testimonial[];
  primaryActionLabel: string;
  secondaryActionLabel: string;
  className?: string;
}

// --- Sub-Components ---

const StatCard = ({ value, label }: Stat) => (
  <Card className="bg-zinc-900/40 border-zinc-800/80 text-center rounded-xl backdrop-blur">
    <CardContent className="p-3 sm:p-4">
      <p className="text-xl sm:text-2xl md:text-3xl font-black text-white leading-tight break-words">{value}</p>
      <p className="text-[10px] sm:text-xs text-zinc-400 mt-1 font-semibold leading-snug">{label}</p>
    </CardContent>
  </Card>
);

const StickyTestimonialCard = ({ testimonial, index }: { testimonial: Testimonial; index: number }) => {
  return (
    <motion.div
      className="sticky w-full"
      style={{ top: `${120 + index * 24}px` }} // Staggered top position for stacking (adjusted for header offset)
    >
      <div className={cn(
        "p-5 sm:p-6 rounded-2xl shadow-xl flex flex-col h-auto w-full",
        "bg-zinc-950/70 border border-zinc-800/80 backdrop-blur-md"
      )}>
        {/* Top section: Image and Author */}
        <div className="flex items-center gap-3 sm:gap-4">
          <div
            className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-cover bg-center flex-shrink-0 border border-zinc-800"
            style={{ backgroundImage: `url(${testimonial.avatarSrc})` }}
            aria-label={`Photo of ${testimonial.name}`}
          />
          <div className="flex-grow min-w-0">
            <p className="font-bold text-base sm:text-lg text-white truncate">{testimonial.name}</p>
            <p className="text-xs text-zinc-400 font-semibold mt-0.5 truncate">{testimonial.title}</p>
          </div>
        </div>

        {/* Middle section: Rating */}
        <div className="flex items-center gap-2 my-4">
          <span className="font-extrabold text-base text-white">{testimonial.rating.toFixed(1)}</span>
          <div className="flex">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={cn(
                  "h-4 w-4",
                  i < Math.floor(testimonial.rating)
                    ? "text-white fill-white"
                    : "text-zinc-700/50"
                )}
              />
            ))}
          </div>
        </div>

        {/* Bottom section: Quote */}
        {testimonial.quote && (
          <p className="text-sm text-zinc-300 leading-relaxed font-medium">&ldquo;{testimonial.quote}&rdquo;</p>
        )}
      </div>
    </motion.div>
  );
};

// --- Main Exported Component ---

export const ClientsSection = ({
  tagLabel,
  title,
  description,
  stats,
  testimonials,
  primaryActionLabel,
  secondaryActionLabel,
  className,
}: ClientsSectionProps) => {
  // Calculate height to stack all items cleanly
  const scrollContainerHeight = `calc(100vh + ${testimonials.length * 120}px)`;

  return (
    <section className={cn("w-full bg-transparent text-white py-16 md:py-28", className)}>
      <div className="container mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-start">
        
        {/* Left Column: Sticky Info */}
        <div className="flex flex-col gap-6 lg:sticky lg:top-28">
          <div className="inline-flex items-center gap-2 self-start rounded-full border border-zinc-800 bg-zinc-900/60 backdrop-blur px-4 py-1.5 text-xs uppercase tracking-widest font-bold text-zinc-300">
            <div className="h-1.5 w-1.5 rounded-full bg-zinc-400 animate-pulse" />
            <span>{tagLabel}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight">{title}</h2>
          <p className="text-sm sm:text-base text-zinc-400 leading-relaxed font-medium">{description}</p>
          
          <div className="grid grid-cols-3 gap-2 sm:gap-4 mt-4">
            {stats.map((stat) => (
              <StatCard key={stat.label} {...stat} />
            ))}
          </div>
          
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mt-6">
            <Button variant="outline" size="lg" className="rounded-xl border-zinc-800 text-zinc-300 hover:bg-zinc-900 cursor-pointer w-full sm:w-auto">{secondaryActionLabel}</Button>
            <Button size="lg" className="rounded-xl bg-white text-black hover:bg-zinc-100 cursor-pointer w-full sm:w-auto">{primaryActionLabel}</Button>
          </div>
        </div>

        {/* Right Column: Cards Stack */}
        <div className="relative flex flex-col gap-6" style={{ height: scrollContainerHeight }}>
          {testimonials.map((testimonial, index) => (
            <StickyTestimonialCard
              key={testimonial.name}
              index={index}
              testimonial={testimonial}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
