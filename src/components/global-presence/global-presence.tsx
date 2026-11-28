"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { ArrowRight, MapPin, RotateCcw } from "lucide-react";
import {
  Component,
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { countries, origin, type Country } from "@/lib/global-presence";
import { useMotion, type MotionTools } from "../motion";
import { useSiteReducedMotion, useTouchHomepageMotion } from "../use-media-query";
import styles from "./presence.module.css";

const InteractiveGlobe = dynamic(() => import("./interactive-globe"), {
  ssr: false,
});

class GlobeBoundary extends Component<
  { children: ReactNode; onFailure: () => void },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.onFailure();
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}

function animatePresence(section: HTMLElement, { gsap, media }: MotionTools) {
  const stage = section.querySelector("[data-presence-stage]");
  media.add("all", () => {
    if (stage) {
      gsap.from(stage, {
        opacity: 0,
        y: 28,
        duration: 0.8,
        clearProps: "opacity,transform",
        scrollTrigger: { trigger: stage, start: "top 90%", once: true },
      });
    }
  });
}

function CountryDetails({ country }: { country: Country }) {
  return (
    <div
      className={styles.details}
      id="presence-country-details"
      aria-live="polite"
      aria-atomic="true"
    >
      <p className={styles.kicker}>
        <MapPin size={14} aria-hidden="true" /> {country.region}
      </p>
      <h3>{country.name}</h3>
      <p>
        {country.code === origin.code
          ? "Starting point for the routes shown on this map."
          : `Map connection from ${origin.name} to ${country.name}.`}
      </p>
    </div>
  );
}

function RegionalMap({ country }: { country: Country }) {
  const position = (point: Country) => [
    (point.longitude - 12) * 10,
    (44 - point.latitude) * 10,
  ];
  const [x, y] = position(origin);
  const [destX, destY] = position(country);
  return (
    <div
      className={styles.fallback}
      role="img"
      aria-label={`Regional map with ${country.name} highlighted`}
    >
      <div className={styles.fallbackMap}>
        <Image
          src="/maps/region.webp"
          alt=""
          fill
          loading="lazy"
          sizes="(max-width: 980px) 92vw, (max-width: 1450px) 60vw, 870px"
        />
        <svg viewBox="0 0 1000 560" aria-hidden="true">
          {country.code !== origin.code && (
            <path
              d={`M ${x} ${y} Q ${(x + destX) / 2} ${Math.min(y, destY) - 42} ${destX} ${destY}`}
              fill="none"
              stroke="#79C6FF"
              strokeWidth="3"
              strokeDasharray="8 6"
            />
          )}
          {countries.map((point) => {
            const [cx, cy] = position(point);
            const selected = point.code === country.code;
            return (
              <g key={point.code}>
                {selected && (
                  <circle
                    cx={cx}
                    cy={cy}
                    r="15"
                    fill="none"
                    stroke="#79C6FF"
                    strokeWidth="2"
                  />
                )}
                <circle
                  cx={cx}
                  cy={cy}
                  r={selected ? 8 : 5}
                  fill={selected ? "#79C6FF" : "#A7BFD5"}
                  stroke="#14202E"
                  strokeWidth="2"
                />
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}

export function GlobalPresenceSection() {
  const [country, setCountry] = useState<Country>(origin);
  const [focusRequest, setFocusRequest] = useState(0);
  const [status, setStatus] = useState<
    "waiting" | "loading" | "ready" | "fallback"
  >("waiting");
  const stage = useRef<HTMLDivElement>(null);
  const touchMotion = useTouchHomepageMotion();
  const reduced = useSiteReducedMotion() && !touchMotion;
  const section = useMotion<HTMLElement>(animatePresence, touchMotion);

  useEffect(() => {
    const element = stage.current;
    if (!element) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        try {
          const gl = document.createElement("canvas").getContext("webgl2");
          setStatus(gl ? "loading" : "fallback");
          gl?.getExtension("WEBGL_lose_context")?.loseContext();
        } catch {
          setStatus("fallback");
        }
      },
      { rootMargin: "160px" },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const ready = useCallback(() => setStatus("ready"), []);
  const fallback = useCallback(() => setStatus("fallback"), []);

  function select(next: Country) {
    setCountry(next);
    setFocusRequest((value) => value + 1);
  }

  return (
    <section
      id="global-presence"
      aria-label="Interactive regional map"
      className={styles.section}
      data-touch-home-motion={touchMotion || undefined}
      ref={section}
    >
      <div className="shell">
        <div className={styles.console}>
          <div ref={stage} className={styles.stage} data-presence-stage>
            {status !== "ready" && <RegionalMap country={country} />}
            {(status === "loading" || status === "ready") && (
              <GlobeBoundary onFailure={fallback}>
                <InteractiveGlobe
                  country={country}
                  focusRequest={focusRequest}
                  reduced={reduced}
                  onSelect={select}
                  onReady={ready}
                  onFailure={fallback}
                />
              </GlobeBoundary>
            )}
          </div>

          <div className={styles.controls}>
            <CountryDetails country={country} />
            <p className={styles.instruction}>
              {status === "ready"
                ? "Drag to rotate, or select a country to focus the globe."
                : "Select a country to highlight it on the map."}
            </p>
            <p className={styles.instruction}>Illustrative map. Contact us about service availability for your project location.</p>
            <div
              className={styles.countries}
              role="group"
              aria-label="Countries on the map"
            >
              {countries.map((point) => (
                <button
                  key={point.code}
                  type="button"
                  aria-pressed={point.code === country.code}
                  aria-controls="presence-country-details"
                  onClick={() => select(point)}
                >
                  <span aria-hidden="true">{point.code}</span>
                  <span className={styles.countryName}>{point.name}</span>
                  <ArrowRight size={14} aria-hidden="true" />
                </button>
              ))}
            </div>
            <button
              className={styles.reset}
              type="button"
              onClick={() => select(origin)}
            >
              <RotateCcw size={14} aria-hidden="true" />
              Return to India
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
