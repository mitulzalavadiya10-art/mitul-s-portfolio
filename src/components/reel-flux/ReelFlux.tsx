import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import styles from "./ReelFlux.module.css";
import { images, type ImageData } from "./data";
import { useLenisScroll } from "./useScroll";
import Scene from "./scene";
import { ArrowLeft, Moon, Sun, X, ExternalLink } from "lucide-react";

export default function ReelFlux() {
    const wrapperRef = useRef<HTMLElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const [isLightMode, setIsLightMode] = useState(false);
    const [selectedItem, setSelectedItem] = useState<ImageData | null>(null);

    useLenisScroll(wrapperRef, contentRef);

    return (
        <main
            ref={wrapperRef}
            className={`${styles.container} ${isLightMode ? styles.lightTheme : ""}`}
        >
            <div
                ref={contentRef}
                className={styles.scrollContent}
                style={{ height: `calc(100dvh + ${images.length * 60}vh)` }}
            />

            <div className={styles.canvasWrapper}>
                <Scene onSelectImage={(img) => setSelectedItem(img)} />
            </div>

            <div className={styles.overlay}>
                <header className={styles.header}>
                    <div className={styles.brandGroup}>
                        <div className={styles.brand}>KLENZO</div>
                        <span className={styles.badge}>Shopify Showcase</span>
                    </div>

                    <span className={styles.crossMark}>+</span>

                    <div className={styles.navLinks}>
                        <button
                            type="button"
                            onClick={() => setIsLightMode(!isLightMode)}
                            className={styles.backBtn}
                            title="Toggle Light / Dark mode"
                        >
                            {isLightMode ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5" />}
                            <span>{isLightMode ? "Dark" : "Light"}</span>
                        </button>

                        <Link to="/" className={styles.backBtn}>
                            <ArrowLeft className="w-3.5 h-3.5" />
                            <span>Back to Home</span>
                        </Link>
                    </div>
                </header>

                <footer className={styles.footer}>
                    <div className={styles.instruction}>
                        <span className={styles.scrollDot}></span>
                        <span>Scroll or swipe to explore showcase</span>
                    </div>

                    <div className={styles.counter}>
                        <span>/{images.length} Featured Shopify Stores</span>
                    </div>

                    <div className={styles.statusLive}>
                        <span className={styles.statusLiveDot}></span>
                        <span>3D Interactive Reel</span>
                    </div>
                </footer>
            </div>

            {/* Click Preview Modal */}
            {selectedItem && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fadeIn"
                    onClick={() => setSelectedItem(null)}
                >
                    <div
                        className="relative max-w-2xl w-full bg-zinc-900 border border-zinc-700/60 rounded-2xl p-6 shadow-2xl text-white overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            type="button"
                            onClick={() => setSelectedItem(null)}
                            className="absolute top-4 right-4 p-2 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="relative aspect-[16/10] w-full rounded-xl overflow-hidden mb-5 border border-zinc-800">
                            <img
                                src={selectedItem.src}
                                alt={selectedItem.title}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold bg-black/60 backdrop-blur-md border border-white/20 text-white">
                                {selectedItem.category || "Shopify Store"}
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-xl font-bold">{selectedItem.title}</h3>
                                <p className="text-sm text-zinc-400 mt-0.5">
                                    Crafted with high-performance Liquid templates and AI Section Hub
                                </p>
                            </div>

                            <a
                                href="https://apps.shopify.com/ai-section-hub"
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-sm transition shadow-lg shadow-emerald-500/20"
                            >
                                <span>Install App</span>
                                <ExternalLink className="w-4 h-4" />
                            </a>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}
