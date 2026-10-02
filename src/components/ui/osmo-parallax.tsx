import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function OsmoParallax() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const layersTriggerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const triggerElement = layersTriggerRef.current;
      if (!triggerElement) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=130%",
          pin: true,
          scrub: 1, // Buttery smooth momentum scrub
          anticipatePin: 1,
        },
      });

      // Layer 1: Sky & distant snowy peaks (zooms & moves subtly)
      tl.to(
        triggerElement.querySelectorAll('[data-parallax-layer="1"]'),
        {
          yPercent: 35,
          scale: 1.15,
          ease: "none",
        },
        0
      );

      // Layer 2: Mid mountain peaks
      tl.to(
        triggerElement.querySelectorAll('[data-parallax-layer="2"]'),
        {
          yPercent: 22,
          scale: 1.08,
          ease: "none",
        },
        0
      );

      // Layer 3: Title (MITUL ZALAVADIYA) rises majestically from behind the mountain
      tl.to(
        triggerElement.querySelectorAll('[data-parallax-layer="3"]'),
        {
          yPercent: -48,
          scale: 1.08,
          ease: "none",
        },
        0
      );

      // Layer 4: Foreground cliff with person (anchors the scene in front)
      tl.to(
        triggerElement.querySelectorAll('[data-parallax-layer="4"]'),
        {
          yPercent: 12,
          scale: 1.02,
          ease: "none",
        },
        0
      );
    }, sectionRef);

    // Refresh ScrollTrigger after elements/images initialize
    ScrollTrigger.refresh();

    return () => ctx.revert();
  }, []);

  return (
    <div ref={sectionRef} className="osmo-parallax-wrapper relative w-full overflow-hidden bg-black text-white">
      <style>{`
        @font-face {
          font-family: 'PP Neue Corp Wide';
          src: url('https://cdn.prod.website-files.com/671752cd4027f01b1b8f1c7f/6717e399d30a606fed425914_PPNeueCorp-WideUltrabold.woff2') format('woff2');
          font-weight: 800;
          font-style: normal;
          font-display: swap;
        }

        @font-face {
          font-family: 'PP Neue Montreal';
          src: url('https://cdn.prod.website-files.com/6819ed8312518f61b84824df/6819ed8312518f61b84825ba_PPNeueMontreal-Medium.woff2') format('woff2');
          font-weight: 500;
          font-style: normal;
          font-display: swap;
        }

        .osmo-parallax-wrapper {
          --color-black: #000000;
          --section-padding: 0px;
          --container-padding: 0px;
        }

        .parallax {
          width: 100%;
          position: relative;
          overflow: hidden;
        }

        .parallax__header {
          z-index: 2;
          padding: var(--section-padding) var(--container-padding);
          justify-content: center;
          align-items: center;
          min-height: 100svh;
          display: flex;
          position: relative;
        }

        .parallax__visuals {
          object-fit: cover;
          width: 100%;
          max-width: none;
          height: 120%;
          position: absolute;
          top: 0;
          left: 0;
        }

        .parallax__layers {
          object-fit: cover;
          width: 100%;
          max-width: none;
          height: 100%;
          position: absolute;
          top: 0;
          left: 0;
          overflow: hidden;
        }

        .parallax__layer-img {
          pointer-events: none;
          object-fit: cover;
          width: 100%;
          max-width: none;
          height: 117.5%;
          position: absolute;
          top: -17.5%;
          left: 0;
          will-change: transform;
        }

        .parallax__layer-title {
          justify-content: center;
          align-items: center;
          width: 100%;
          height: 100svh;
          display: flex;
          position: absolute;
          top: 0;
          left: 0;
          will-change: transform;
        }

        .parallax__title {
          pointer-events: auto;
          text-align: center;
          text-transform: uppercase;
          margin-top: 0;
          margin-bottom: .1em;
          margin-right: .075em;
          font-family: 'PP Neue Corp Wide', sans-serif;
          font-size: clamp(2.5rem, 5.8vw, 6.8rem);
          font-weight: 800;
          line-height: 1;
          letter-spacing: -0.02em;
          position: relative;
          color: #ffffff;
          white-space: nowrap;
          padding: 0 1rem;
          text-shadow: 0 4px 25px rgba(0, 0, 0, 0.95), 0 0 40px rgba(255, 255, 255, 0.35);
          filter: drop-shadow(0 15px 30px rgba(0, 0, 0, 0.9));
        }

        @media (max-width: 640px) {
          .parallax__title {
            font-size: clamp(1.8rem, 8vw, 2.6rem);
            white-space: normal;
          }
        }

        .parallax__fade {
          --color-dark-rgb: 0, 0, 0;
          z-index: 30;
          object-fit: cover;
          width: 100%;
          max-width: none;
          height: 20%;
          position: absolute;
          bottom: 0;
          left: 0;
          background: linear-gradient(
            to top,
            rgba(var(--color-dark-rgb), 1) 0%,
            rgba(var(--color-dark-rgb), 0.738) 19%,
            rgba(var(--color-dark-rgb), 0.541) 34%,
            rgba(var(--color-dark-rgb), 0.382) 47%,
            rgba(var(--color-dark-rgb), 0.278) 56.5%,
            rgba(var(--color-dark-rgb), 0.194) 65%,
            rgba(var(--color-dark-rgb), 0.126) 73%,
            rgba(var(--color-dark-rgb), 0.075) 80.2%,
            rgba(var(--color-dark-rgb), 0.042) 86.1%,
            rgba(var(--color-dark-rgb), 0.021) 91%,
            rgba(var(--color-dark-rgb), 0.008) 95.2%,
            rgba(var(--color-dark-rgb), 0.002) 98.2%,
            transparent 100%
          );
        }

        .parallax__black-line-overflow {
          z-index: 20;
          background-color: var(--color-black);
          width: 100%;
          height: 2px;
          position: absolute;
          bottom: -1px;
          left: 0;
        }

        .parallax__top-blend {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 320px;
          z-index: 28;
          pointer-events: none;
          overflow: hidden;
        }

        .parallax__top-gradient {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to bottom,
            rgba(14, 18, 26, 0.98) 0%,
            rgba(16, 24, 36, 0.82) 25%,
            rgba(22, 36, 52, 0.5) 50%,
            rgba(32, 54, 76, 0.2) 75%,
            transparent 100%
          );
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          mask-image: linear-gradient(to bottom, black 0%, black 35%, transparent 100%);
          -webkit-mask-image: linear-gradient(to bottom, black 0%, black 35%, transparent 100%);
        }

        .parallax__mist {
          position: absolute;
          top: -30px;
          left: -20%;
          width: 140%;
          height: 220px;
          pointer-events: none;
          background: radial-gradient(
            ellipse 60% 50% at 50% 30%,
            rgba(150, 190, 225, 0.28) 0%,
            rgba(90, 130, 165, 0.14) 45%,
            transparent 75%
          );
          filter: blur(35px);
        }

        .parallax__mist-1 {
          animation: mistDrift1 14s ease-in-out infinite alternate;
        }

        .parallax__mist-2 {
          top: 25px;
          opacity: 0.65;
          animation: mistDrift2 22s ease-in-out infinite alternate;
        }

        @keyframes mistDrift1 {
          0% { transform: translateX(-50px) scaleY(0.92); }
          100% { transform: translateX(50px) scaleY(1.08); }
        }

        @keyframes mistDrift2 {
          0% { transform: translateX(40px) scaleX(1.05); }
          100% { transform: translateX(-40px) scaleX(0.95); }
        }
      `}</style>

      {/* Osmo Parallax [https://osmo.supply/] */}
      <div className="parallax -mt-1">
        <section className="parallax__header">
          <div className="parallax__visuals">
            <div className="parallax__top-blend">
              <div className="parallax__mist parallax__mist-1" />
              <div className="parallax__mist parallax__mist-2" />
              <div className="parallax__top-gradient" />
            </div>
            <div className="parallax__black-line-overflow"></div>
            <div
              ref={layersTriggerRef}
              data-parallax-layers
              className="parallax__layers"
            >
              <img
                src="https://cdn.prod.website-files.com/671752cd4027f01b1b8f1c7f/6717795be09b462b2e8ebf71_osmo-parallax-layer-3.webp"
                loading="eager"
                width="800"
                data-parallax-layer="1"
                alt=""
                className="parallax__layer-img"
                onLoad={() => ScrollTrigger.refresh()}
              />
              <img
                src="https://cdn.prod.website-files.com/671752cd4027f01b1b8f1c7f/6717795b4d5ac529e7d3a562_osmo-parallax-layer-2.webp"
                loading="eager"
                width="800"
                data-parallax-layer="2"
                alt=""
                className="parallax__layer-img"
                onLoad={() => ScrollTrigger.refresh()}
              />
              <div data-parallax-layer="3" className="parallax__layer-title">
                <h2 className="parallax__title">Mitul Zalavadiya</h2>
              </div>
              <img
                src="https://cdn.prod.website-files.com/671752cd4027f01b1b8f1c7f/6717795bb5aceca85011ad83_osmo-parallax-layer-1.webp"
                loading="eager"
                width="800"
                data-parallax-layer="4"
                alt=""
                className="parallax__layer-img"
                onLoad={() => ScrollTrigger.refresh()}
              />
            </div>
            <div className="parallax__fade"></div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default OsmoParallax;
