import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function Hero() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const heroSectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    // Ensure GSAP context scopes all selectors and handles clean teardown
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrapperRef.current,
          start: "top top",
          end: "+=140%",
          pin: true,
          scrub: 1, // Smooth buttery inertia
          anticipatePin: 1,
          markers: false,
        },
      });

      tl.to(imageRef.current, {
        scale: 2.2,
        z: 380,
        transformOrigin: "center center",
        ease: "power2.inOut",
      }).to(
        heroSectionRef.current,
        {
          scale: 1.15,
          transformOrigin: "center center",
          ease: "power2.inOut",
        },
        "<"
      );
    }, wrapperRef);

    return () => ctx.revert();
  }, []);

  return (
    <>
      <style>{`
        .hero-zoom-wrapper {
          position: relative;
          width: 100%;
          max-width: 100%;
          overflow: hidden;
          z-index: 1;
        }

        .hero-zoom-content {
          position: relative;
          width: 100%;
          max-width: 100%;
          overflow: hidden;
          z-index: 1;
        }

        .hero-zoom-content .section {
          width: 100%;
          height: 100vh;
        }

        .hero-zoom-content .section.hero {
          background-image: url(https://images.unsplash.com/photo-1589848315097-ba7b903cc1cc?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D);
          background-position: center center;
          background-repeat: no-repeat;
          background-size: cover;
        }

        .hero-image-container {
          width: 100%;
          height: 100vh;
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          z-index: 2;
          perspective: 500px;
          overflow: hidden;
          pointer-events: none;
        }

        .hero-image-container img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center center;
        }

        .hero-bottom-blend {
          position: absolute;
          bottom: -1px;
          left: 0;
          right: 0;
          height: 240px;
          z-index: 5;
          pointer-events: none;
          background: linear-gradient(
            to bottom,
            transparent 0%,
            rgba(14, 18, 26, 0.25) 35%,
            rgba(14, 18, 26, 0.7) 70%,
            rgba(14, 18, 26, 0.98) 100%
          );
        }
      `}</style>

      <div ref={wrapperRef} className="wrapper hero-zoom-wrapper">
        <div className="content hero-zoom-content">
          <section ref={heroSectionRef} className="section hero" />
        </div>
        <div className="image-container hero-image-container">
          <img
            ref={imageRef}
            src="https://assets-global.website-files.com/63ec206c5542613e2e5aa784/643312a6bc4ac122fc4e3afa_main%20home.webp"
            alt="image"
            onLoad={() => ScrollTrigger.refresh()}
          />
        </div>
        <div className="hero-bottom-blend" />
      </div>
    </>
  );
}

export default Hero;
