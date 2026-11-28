"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { brand } from "@/lib/site";
import LoadingScreen from "./loading-screen";
import { useHomeIntro } from "./home-intro-context";
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
import { useSiteReducedMotion } from "./use-media-query";
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
  const stage = useRef<HTMLDivElement>(null);
  const illumination = useRef<HTMLDivElement>(null);
  const pointer = useRef({ x: 0, y: 0 });
  const [visible, setVisible] = useState(true);
  const [powered, setPowered] = useState(true);
  const [brightness, setBrightness] = useState(0);
  const [failed, setFailed] = useState(false);
  const [ready, setReady] = useState(false);
  const [introTimedOut, setIntroTimedOut] = useState(false);
  const wake = useRef<(() => void) | null>(null);
  const reduced = useSiteReducedMotion();
  const markReady = useCallback(() => setReady(true), []);
  const handleSceneFailure = useCallback(() => {
    setFailed(true);
    setReady(false);
    illumination.current?.style.removeProperty("--lens-x");
    illumination.current?.style.removeProperty("--lens-y");
  }, []);

  useEffect(() => {
    const element = stage.current;
    if (!element) return;
    if (typeof IntersectionObserver === "undefined") return;
    const visibility = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting));
    visibility.observe(element);
    return () => visibility.disconnect();
  }, []);

  // Reveal immediately after the first rendered frames, or if rendering fails.
  // The watchdog is only a recovery path for a stalled renderer.
  const allowIntro = useHomeIntro();
  const introDismissed = !allowIntro || ready || failed || introTimedOut;

  useEffect(() => {
    if (introDismissed) return;
    const watchdog = window.setTimeout(() => setIntroTimedOut(true), 1800);
    return () => window.clearTimeout(watchdog);
  }, [introDismissed]);

  useEffect(() => {
    if (introDismissed) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previous; };
  }, [introDismissed]);

  const power = powered ? brightness / 100 : 0;
  return (
    <>
    {allowIntro && <LoadingScreen dismissed={introDismissed} />}
    <section
      className={styles.hero}
      style={{
        "--hero-light-power": power,
        "--bg": `color-mix(in srgb, #1F73BD, #14202E ${power * 100}%)`,
        transition: reduced ? "none" : "background-color 250ms ease",
      } as CSSProperties}
      onPointerMove={(event) => {
        if (reduced || event.pointerType !== "mouse") return;
        const rect = event.currentTarget.getBoundingClientRect();
        pointer.current = { x: (event.clientX - rect.left) / rect.width - 0.5, y: (event.clientY - rect.top) / rect.height - 0.5 };
        wake.current?.();
      }}
      onPointerLeave={() => { pointer.current = { x: 0, y: 0 }; wake.current?.(); }}
    >
      <div className={styles.heroIllumination} ref={illumination} data-ready={ready} aria-hidden="true">
        <div className={styles.heroGlow} />
      </div>
      <div className={styles.heroInner}>
        <div className={styles.heroLead}>
          <p className={styles.heroKicker} data-hero-enter>
            Powering a Brighter Tomorrow
          </p>
          <h1 data-hero-enter>
            <span>LED lighting</span>{" "}
            <span>solutions<span className={styles.heroDot}>.</span></span>
          </h1>
          <p className={styles.heroSummary} data-hero-enter>
            Compare lighting for roads, industrial facilities and commercial
            interiors. Browse the catalogue or discuss your project with Bharat Lums.
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
              <a className={styles.heroLink} href="/contact?catalogue=1">
                Request Catalogue <ArrowUpRight size={17} aria-hidden="true" />
              </a>
            )}
            <a
              className={`${styles.heroLink} ${styles.heroWhatsapp}`}
              href={`https://wa.me/${brand.phoneHref.replace(/\D/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Chat with Bharat Lums on WhatsApp"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.174.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.447-.52.148-.174.198-.298.297-.496.1-.199.05-.372-.025-.521-.074-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479s1.065 2.875 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.262.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347M12.05 21.785h-.004a9.87 9.87 0 0 1-5.031-1.377l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.25c.002-5.45 4.437-9.884 9.888-9.884a9.82 9.82 0 0 1 6.99 2.9 9.83 9.83 0 0 1 2.893 6.994c-.002 5.45-4.437 9.884-9.887 9.884M20.46 3.488A11.82 11.82 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.9 11.9 0 0 0 5.683 1.447h.005c6.554 0 11.89-5.335 11.893-11.891a11.82 11.82 0 0 0-3.483-8.414Z" />
              </svg>
              WhatsApp
            </a>
          </div>
        </div>
        <div
          className={styles.heroStage}
          ref={stage}
          data-hero-stage
          data-testid="streetlight-stage"
          data-fixed-hero="true"
          data-ready={ready}
          aria-hidden="true"
        >
          <div className={styles.heroMotion} data-testid="streetlight-motion" data-motion-paused={!powered || !visible || reduced}>
            <div className={styles.heroVisual} data-testid="streetlight-visual">
              {!failed && (
                <div className={styles.heroCanvas}>
                  <SceneBoundary fallback={handleSceneFailure}>
                    <StreetlightScene
                      power={power}
                      reduced={reduced}
                      active={visible}
                      wakeRef={wake}
                      pointer={pointer}
                      illumination={illumination}
                      onReady={markReady}
                      onFailure={handleSceneFailure}
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
    </>
  );
}
