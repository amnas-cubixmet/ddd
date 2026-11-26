"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
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
import { useMotion, type MotionTools } from "./motion";
import { compactSceneQuery, useMediaQuery, useSiteReducedMotion, useTouchHomepageMotion } from "./use-media-query";
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

function animateHero(root: HTMLElement, { gsap, media }: MotionTools) {
  const items = root.querySelectorAll("[data-hero-enter]");
  const stage = root.querySelector("[data-hero-stage]");
  media.add("all", () => {
    gsap.from(items, {
      opacity: 0,
      y: 20,
      duration: 0.68,
      stagger: 0.1,
      ease: "power3.out",
      clearProps: "opacity,transform",
    });
  });
  media.add(
    "(min-width: 901px)",
    () => {
      if (!stage) return;
      gsap.to(stage, {
        y: 100,
        scale: 0.94,
        ease: "none",
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    },
  );
  media.add(
    "(max-width: 900px)",
    () => {
      if (!stage) return;
      gsap.to(stage, {
        "--hero-scroll-y": "22px",
        ease: "none",
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    },
  );
}

export function HomeHero({ catalogue }: { catalogue?: string }) {
  const touchMotion = useTouchHomepageMotion();
  const root = useMotion<HTMLElement>(animateHero, touchMotion);
  const illumination = useRef<HTMLDivElement>(null);
  const pointer = useRef({ x: 0, y: 0 });
  const [powered, setPowered] = useState(true);
  const [brightness, setBrightness] = useState(80);
  const [enabled, setEnabled] = useState(false);
  const [ready, setReady] = useState(false);
  const reduced = useSiteReducedMotion() && !touchMotion;
  const compact = useMediaQuery(compactSceneQuery);
  const [visible, setVisible] = useState(false);
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
    const visibility = new IntersectionObserver(([entry]) =>
      setVisible(entry.isIntersecting),
    );
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
        pointer.current = {
          x: (event.clientX - rect.left) / rect.width - 0.5,
          y: (event.clientY - rect.top) / rect.height - 0.5,
        };
      }}
      onPointerLeave={() => {
        pointer.current = { x: 0, y: 0 };
      }}
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
          data-ready={ready}
          aria-hidden="true"
        >
          <div className={styles.heroIllumination} ref={illumination}>
            <div className={styles.heroGlow} />
          </div>
          <Image
            className={styles.heroFallback}
            src="/images/streetlight-concept.webp"
            alt=""
            fill
            preload
            sizes="(max-width: 900px) 100vw, 64vw"
          />
          {enabled && (
            <div className={styles.heroCanvas}>
              <SceneBoundary fallback={useFallback}>
                <StreetlightScene
                  power={power}
                  reduced={reduced}
                  compactLayout={compact}
                  paused={!visible}
                  renderOnDemand={touchMotion}
                  pointer={pointer}
                  illumination={illumination}
                  onReady={markReady}
                  onFailure={useFallback}
                />
              </SceneBoundary>
            </div>
          )}
        </div>
        <div className={styles.heroPanel}>
          <span className={styles.modelCaption}>Streetlight concept</span>
          <div className={styles.lightControls}>
            <button
              type="button"
              aria-pressed={powered}
              aria-label="Streetlight power"
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
