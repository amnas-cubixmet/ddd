"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { ArrowDown, ArrowDownRight, ArrowUpRight, Power } from "lucide-react";
import {
  Component,
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { useSiteReducedMotion, useTouchHomepageMotion } from "./use-media-query";
import styles from "./home/home.module.css";

const StreetlightScene = dynamic(() => import("./home/streetlight-scene"), {
  ssr: false,
});

class SceneBoundary extends Component<
  { children: ReactNode; fallback: () => void },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.fallback();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

export function HomeHero({ catalogue }: { catalogue?: string }) {
  const root = useRef<HTMLElement>(null);
  const illumination = useRef<HTMLDivElement>(null);
  const pointer = useRef({ x: 0, y: 0 });
  const [visible, setVisible] = useState(false);
  const [motionPaused, setMotionPaused] = useState(false);
  const [powered, setPowered] = useState(true);
  const [brightness, setBrightness] = useState(80);
  const [enabled, setEnabled] = useState(false);
  const [ready, setReady] = useState(false);
  const touchMotion = useTouchHomepageMotion();
  const reduced = (useSiteReducedMotion() && !touchMotion) || motionPaused;
  const markReady = useCallback(() => setReady(true), []);
  const useFallback = useCallback(() => {
    setEnabled(false);
    setReady(false);
    illumination.current?.style.removeProperty("--lens-x");
    illumination.current?.style.removeProperty("--lens-y");
  }, []);

  useEffect(() => {
    const element = root.current;
    if (!element) return;
    const loader = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      loader.disconnect();
      try {
        const context = document.createElement("canvas").getContext("webgl2");
        setEnabled(Boolean(context));
        context?.getExtension("WEBGL_lose_context")?.loseContext();
      } catch {
        setEnabled(false);
      }
    }, { rootMargin: "120px" });
    const visibility = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting));
    loader.observe(element);
    visibility.observe(element);
    return () => {
      loader.disconnect();
      visibility.disconnect();
    };
  }, [root]);

  const power = powered ? brightness / 100 : 0;
  return (
    <section
      className={styles.hero}
      data-touch-home-motion={touchMotion || undefined}
      style={{ "--hero-light-power": power } as CSSProperties}
      ref={root}
      onPointerMove={(event) => {
        if (reduced || event.pointerType !== "mouse") return;
        const rect = event.currentTarget.getBoundingClientRect();
        pointer.current = { x: (event.clientX - rect.left) / rect.width - 0.5, y: (event.clientY - rect.top) / rect.height - 0.5 };
      }}
      onPointerLeave={() => { pointer.current = { x: 0, y: 0 }; }}
    >
      <div className={`shell ${styles.heroInner}`}>
        <div className={styles.heroLead}>
          <p className={styles.heroKicker} data-hero-enter>
            Powering a Brighter Tomorrow
          </p>
          <h1 data-hero-enter>
            <span>Light up</span>
            <span>
              the future<span className={styles.heroDot}>.</span>
            </span>
          </h1>
          <p className={styles.heroSummary} data-hero-enter>
            Advanced LED lighting solutions for commercial, industrial and
            outdoor environments.
          </p>
          <div className={styles.heroActions} data-hero-enter>
            <Link className={styles.heroPrimary} href="/products">
              Explore Products <ArrowDownRight size={19} aria-hidden="true" />
            </Link>
            {catalogue ? (
              <a className={styles.heroLink} href={catalogue} download>
                Download Catalogue <ArrowDown size={17} aria-hidden="true" />
              </a>
            ) : (
              <a className={styles.heroLink} href="/request-quote?catalogue=1">
                Request Catalogue <ArrowUpRight size={17} aria-hidden="true" />
              </a>
            )}
          </div>
        </div>
        <div
          className={styles.heroStage}
          data-hero-stage
          data-testid="streetlight-stage"
          data-fixed-hero="true"
          data-ready={ready}
          aria-hidden="true"
        >
          <div className={styles.heroMotion} data-testid="streetlight-motion" data-motion-paused={!powered || !visible || reduced}>
            <div className={styles.heroIllumination} ref={illumination}>
              <div className={styles.heroGlow} />
            </div>
            <div className={styles.heroVisual} data-testid="streetlight-visual">
              <picture className={styles.heroFallback}>
                <source
                  media="(max-width: 650px) and (orientation: portrait), (max-width: 650px) and (min-height: 501px)"
                  srcSet="/images/streetlight-fixed-mobile.webp"
                />
                {/* Captured directly from the fixed camera; no optimizer resizing or cropping. */}
                <img
                  src="/images/streetlight-fixed-wide.webp"
                  alt=""
                  width={936}
                  height={780}
                  fetchPriority="high"
                  loading="eager"
                  decoding="sync"
                  data-testid="streetlight-poster"
                />
              </picture>
              {enabled && (
                <div className={styles.heroCanvas}>
                  <SceneBoundary fallback={useFallback}>
                    <StreetlightScene
                      power={power}
                      reduced={reduced}
                      active={visible}
                      pointer={pointer}
                      illumination={illumination}
                      onReady={markReady}
                      onFailure={useFallback}
                    />
                  </SceneBoundary>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className={styles.heroPanel} data-hero-panel>
          <span className={styles.modelCaption}>Streetlight concept</span>
          <div className={styles.lightControls}>
            <button type="button" aria-pressed={motionPaused} onClick={() => setMotionPaused(!motionPaused)}>
              {motionPaused ? "Resume motion" : "Pause motion"}
            </button>
            <button
              type="button"
              aria-pressed={powered}
              aria-label="Fixture power"
              onClick={() => setPowered(!powered)}
            >
              <Power size={16} aria-hidden="true" />{" "}
              {powered ? "Light on" : "Light off"}
            </button>
            <label>
              <span>Brightness</span>
              <input
                type="range"
                min="0"
                max="100"
                value={brightness}
                onChange={(event) => setBrightness(Number(event.target.value))}
                disabled={!powered}
              />
            </label>
          </div>
        </div>
      </div>
    </section>
  );
}
