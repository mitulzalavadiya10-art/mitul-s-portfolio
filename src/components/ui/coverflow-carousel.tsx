"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";

const useIsoLayoutEffect =
  typeof window !== "undefined" ? React.useLayoutEffect : React.useEffect;

export interface CoverflowSlide {
  src: string;
  alt: string;
  title?: string;
  subtitle?: string;
  type?: "image" | "video";
  meta?: { label: string; value: string }[];
}

export interface CoverflowCarouselProps {
  slides: CoverflowSlide[];
  /** Degrees the first neighbour tilts. */
  rotate?: number;
  /** How far the first neighbour recedes, as a fraction of card width. */
  depth?: number;
  /** Viewer distance as a multiple of card width — smaller is a wider lens. */
  perspective?: number;
  /** Exponent on distance. Below 1 the rake eases off as cards travel out. */
  falloff?: number;
  /** Opacity lost per step from the centre. */
  fade?: number;
  /** Any CSS length. Everything else is derived from it, so the rake scales. */
  cardWidth?: string;
  /** Height of the card. Derived from aspect ratio if omitted. */
  cardHeight?: string;
  /** Aspect ratio of cards (e.g., "16/10", "16/9"). */
  aspectRatio?: string;
  /** Space between cards, as a fraction of card width. */
  gap?: number;
  loop?: boolean;
  showCaption?: boolean;
  showPagination?: boolean;
  showNavigation?: boolean;
  /** Callback fired when a slide/card is clicked for preview modal. */
  onSlideClick?: (slide: CoverflowSlide, index: number) => void;
  /** Names the carousel for assistive tech. */
  label?: string;
  className?: string;
  cardClassName?: string;
}

export function CoverflowCarousel({
  slides,
  rotate = 44,
  depth = 0.6,
  perspective = 3,
  falloff = 0.56,
  fade = 0.1,
  cardWidth = "clamp(280px, 42vw, 560px)",
  cardHeight = "clamp(175px, 26vw, 350px)",
  aspectRatio = "16/10",
  gap = 0.05,
  loop = true,
  showCaption = false,
  showPagination = false,
  showNavigation = false,
  onSlideClick,
  label = "Cover carousel",
  className,
  cardClassName,
}: CoverflowCarouselProps) {
  const count = slides.length;

  const frameRef = React.useRef<HTMLDivElement>(null);
  const cardRefs = React.useRef<(HTMLDivElement | null)[]>([]);
  /** Fractional card index at the centre. The single source of truth. */
  const posRef = React.useRef(0);
  /** Where the current settle is headed. Stepping off `pos` instead would
      swallow a keypress that lands mid-flight, before the round-off moves. */
  const targetRef = React.useRef(0);
  const widthRef = React.useRef(0);
  const rafRef = React.useRef<number | null>(null);
  const dragRef = React.useRef<{
    id: number;
    x: number;
    pos: number;
    v: number;
    t: number;
  } | null>(null);

  const [selected, setSelected] = React.useState(0);

  /** Nearest whole card, folded back into 0..count-1. */
  const indexAt = React.useCallback(
    (pos: number) => ((Math.round(pos) % count) + count) % count,
    [count],
  );

  // Paint straight to the DOM. Sixty state updates a second would re-render
  // every card for numbers React never needs to see.
  const paint = React.useCallback(() => {
    const width = widthRef.current;
    if (!width) return;
    const pitch = width * (1 + gap);
    const pos = posRef.current;

    cardRefs.current.forEach((card, index) => {
      if (!card) return;

      // Fold the distance into the shorter way round the ring. This is the
      // whole looping mechanism — no cloned nodes, no shuffling the DOM.
      let offset = index - pos;
      if (loop) {
        offset = ((offset % count) + count) % count;
        if (offset > count / 2) offset -= count;
      }

      const distance = Math.abs(offset);
      // Both the tilt and the recession ease off as cards travel out —
      // doubling the distance adds only about half again as much of each.
      // A linear ramp folds the second card shut; this keeps it readable.
      const ramp = Math.pow(distance, falloff);
      // Capped short of edge-on so a far card never turns its back.
      const tilt = Math.min(rotate * ramp, 82) * Math.sign(offset);

      card.style.transform =
        `translateX(calc(-50% + ${offset * pitch}px)) ` +
        `translateZ(${-depth * width * ramp}px) rotateY(${-tilt}deg)`;

      // Bright white border & ambient white glow for active card
      card.style.filter = "none";

      if (distance < 0.3) {
        card.style.boxShadow = "0 0 50px rgba(255, 255, 255, 0.55), 0 30px 90px rgba(0,0,0,0.95)";
        card.style.borderColor = "#ffffff";
        card.style.borderWidth = "2px";
      } else {
        card.style.boxShadow = "0 15px 35px rgba(0,0,0,0.6)";
        card.style.borderColor = "rgba(255, 255, 255, 0.15)";
        card.style.borderWidth = "1px";
      }

      // A card is teleported across the ring at exactly half a turn out, so it
      // has to be gone by then or the jump is visible.
      const edge = loop ? Math.min(1, Math.max(0, count / 2 - distance)) : 1;
      card.style.opacity = String(Math.max(0, 1 - fade * distance) * edge);
      card.style.zIndex = String(100 - Math.round(distance));
    });
  }, [count, depth, fade, falloff, gap, loop, rotate]);

  const settle = React.useCallback(
    (target: number) => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      targetRef.current = target;
      setSelected(indexAt(target));

      const step = () => {
        const remaining = target - posRef.current;
        if (Math.abs(remaining) < 0.0004) {
          posRef.current = target;
          paint();
          rafRef.current = null;
          return;
        }
        // ponytail: exponential ease-out, not a spring. Swap in a spring only
        // if the settle needs overshoot.
        posRef.current += remaining * 0.16;
        paint();
        rafRef.current = requestAnimationFrame(step);
      };
      rafRef.current = requestAnimationFrame(step);
    },
    [indexAt, paint],
  );

  const clamp = React.useCallback(
    (pos: number) => (loop ? pos : Math.max(0, Math.min(count - 1, pos))),
    [count, loop],
  );

  const goTo = React.useCallback(
    (index: number) => {
      // Take the shorter way round rather than unwinding the whole ring.
      const target = loop
        ? index + Math.round((targetRef.current - index) / count) * count
        : index;
      settle(clamp(target));
    },
    [clamp, count, loop, settle],
  );

  const nudge = React.useCallback(
    (by: number) => settle(clamp(Math.round(targetRef.current) + by)),
    [clamp, settle],
  );

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    event.currentTarget.setPointerCapture(event.pointerId);
    targetRef.current = posRef.current;
    dragRef.current = {
      id: event.pointerId,
      x: event.clientX,
      pos: posRef.current,
      v: 0,
      t: performance.now(),
    };
  };

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.id !== event.pointerId) return;

    const pitch = widthRef.current * (1 + gap);
    if (!pitch) return;

    const now = performance.now();
    const previous = posRef.current;
    posRef.current = clamp(drag.pos - (event.clientX - drag.x) / pitch);
    // Cards per second, for the throw.
    drag.v = ((posRef.current - previous) / Math.max(now - drag.t, 1)) * 1000;
    drag.t = now;

    const index = indexAt(posRef.current);
    if (index !== selected) setSelected(index);
    paint();
  };

  const endDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.id !== event.pointerId) return;
    dragRef.current = null;
    // Let a flick carry, but never more than two cards.
    const carried = Math.max(-2, Math.min(2, drag.v * 0.18));
    settle(clamp(Math.round(posRef.current + carried)));
  };

  // Card width drives pitch, depth and perspective, so it is the only thing
  // worth measuring — and only when the box actually changes.
  useIsoLayoutEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;

    const measure = () => {
      const card = cardRefs.current[0];
      if (!card) return;
      widthRef.current = card.offsetWidth;
      paint();
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(frame);
    return () => observer.disconnect();
  }, [paint]);

  React.useEffect(
    () => () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    },
    [],
  );

  const active = slides[selected];

  return (
    <div
      className={cn("w-full", className)}
      style={{
        ["--cf-card" as string]: cardWidth,
        ["--cf-card-height" as string]: cardHeight,
      }}
      role="region"
      aria-roledescription="carousel"
      aria-label={label}
    >
      <div className="relative w-full">
        <div
          ref={frameRef}
          tabIndex={0}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onKeyDown={(event) => {
            if (event.key === "ArrowLeft") {
              event.preventDefault();
              nudge(-1);
            } else if (event.key === "ArrowRight") {
              event.preventDefault();
              nudge(1);
            }
          }}
          // Vertical padding keeps the drop shadows clear of the overflow clip.
          className="cursor-grab overflow-hidden py-10 outline-none ring-ring focus-visible:ring-2 active:cursor-grabbing"
          style={{
            perspective: `calc(var(--cf-card) * ${perspective})`,
            // Horizontal drag is ours; the page keeps vertical scrolling.
            touchAction: "pan-y",
          }}
        >
          <div
            className="relative select-none"
            style={{
              height: "var(--cf-card-height)",
              transformStyle: "preserve-3d",
            }}
          >
            {slides.map((slide, index) => (
              <div
                key={index}
                ref={(node) => {
                  cardRefs.current[index] = node;
                }}
                role="group"
                aria-roledescription="slide"
                aria-label={`${index + 1} of ${count}`}
                onClick={() => {
                  goTo(index);
                  onSlideClick?.(slide, index);
                }}
                className={cn(
                  "absolute left-1/2 top-0 overflow-hidden rounded-2xl bg-zinc-900 shadow-[0_25px_60px_rgba(0,0,0,0.85)] border border-zinc-700/80 will-change-transform cursor-pointer group transition-all duration-300 ease-out hover:scale-[1.04] hover:-translate-y-2.5 hover:border-white hover:shadow-[0_0_65px_rgba(255,255,255,0.6),0_35px_100px_rgba(0,0,0,0.95)]",
                  cardClassName,
                )}
                style={{
                  width: "var(--cf-card)",
                  height: "var(--cf-card-height)",
                  aspectRatio,
                }}
              >
                {slide.src.endsWith(".mp4") || slide.type === "video" ? (
                  <video
                    src={slide.src}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="h-full w-full select-none object-cover pointer-events-none transition-transform duration-500 ease-out group-hover:scale-108"
                  />
                ) : (
                  <img
                    src={slide.src}
                    alt={slide.alt}
                    draggable={false}
                    className="h-full w-full select-none object-cover transition-transform duration-500 ease-out group-hover:scale-108"
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {showNavigation && (
          <>
            <button
              type="button"
              aria-label="Previous slide"
              onClick={() => nudge(-1)}
              className="absolute left-4 md:left-10 top-1/2 z-[200] -translate-y-1/2 rounded-full bg-black/80 hover:bg-black p-3.5 text-white border border-zinc-700 backdrop-blur transition shadow-2xl hover:scale-110 active:scale-95"
            >
              <ChevronLeft className="size-6" />
            </button>
            <button
              type="button"
              aria-label="Next slide"
              onClick={() => nudge(1)}
              className="absolute right-4 md:right-10 top-1/2 z-[200] -translate-y-1/2 rounded-full bg-black/80 hover:bg-black p-3.5 text-white border border-zinc-700 backdrop-blur transition shadow-2xl hover:scale-110 active:scale-95"
            >
              <ChevronRight className="size-6" />
            </button>
          </>
        )}
      </div>

      {showCaption && active?.title && (
        <div
          key={selected}
          className="mt-8 flex flex-col items-center px-4 max-w-xl mx-auto duration-300 animate-in fade-in"
        >
          <h3 className="text-xl md:text-2xl font-bold tracking-tight text-white font-headings text-center bg-clip-text text-transparent bg-gradient-to-b from-white via-zinc-100 to-zinc-400">
            {active.title}
          </h3>
          
          {active.subtitle && (
            <p className="mt-1.5 text-xs md:text-sm text-zinc-400 font-normal max-w-md text-center leading-relaxed">
              {active.subtitle}
            </p>
          )}

          <button
            type="button"
            onClick={() => onSlideClick?.(active, selected)}
            className="mt-4 inline-flex items-center justify-center px-6 py-2.5 rounded-full bg-zinc-900/90 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800 text-zinc-300 hover:text-white text-xs font-medium backdrop-blur-md transition-all duration-300 hover:scale-105 active:scale-95 shadow-md cursor-pointer"
          >
            Click to View Full Preview
          </button>

          {active.meta && active.meta.length > 0 && (
            <div className="mt-6 w-full max-w-md grid grid-cols-3 gap-2.5 bg-zinc-950/70 border border-zinc-800/80 backdrop-blur-md p-2.5 rounded-2xl shadow-xl">
              {active.meta.map((row) => (
                <div key={row.label} className="flex flex-col items-center justify-center py-2.5 px-1.5 bg-zinc-900/60 rounded-xl border border-zinc-800/50 text-center">
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-zinc-500 mb-0.5">{row.label}</span>
                  <span className="text-xs font-bold text-zinc-200">{row.value}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {showPagination && (
        <div className="mt-8 flex items-center justify-center gap-2.5">
          {slides.map((_, index) => (
            <button
              key={index}
              type="button"
              aria-label={`Go to slide ${index + 1}`}
              aria-current={index === selected}
              onClick={() => goTo(index)}
              className={cn(
                "size-2.5 rounded-full bg-white transition-all duration-300",
                index === selected ? "w-8 bg-white opacity-100 shadow-[0_0_12px_rgba(255,255,255,0.8)]" : "opacity-30 hover:opacity-60",
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default CoverflowCarousel;
