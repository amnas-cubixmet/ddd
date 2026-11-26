"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { useLayoutEffect, useRef } from "react";
import type { CatalogueCategory } from "@/lib/catalogue";
import { useTouchHomepageMotion } from "../use-media-query";
import styles from "./catalogue-slider.module.css";

const copies = [-1, 0, 1] as const;

function slideOffset(track: HTMLUListElement, index: number) {
  return track.children[index].getBoundingClientRect().left -
    track.children[0].getBoundingClientRect().left;
}

export function CatalogueSlider({
  slides,
}: {
  slides: readonly (Pick<CatalogueCategory, "slug" | "name" | "image"> & { href: string })[];
}) {
  const trackRef = useRef<HTMLUListElement>(null);
  const touchMotion = useTouchHomepageMotion();
  const canLoop = slides.length > 1;
  const count = slides.length;

  useLayoutEffect(() => {
    const track = trackRef.current;
    if (!track || !canLoop) return;

    // Start in the middle copy so both directions have a matching neighbour.
    track.scrollTo({ left: slideOffset(track, count), behavior: "instant" });

    let timer: number | undefined;
    let touching = false;
    let activeIndex = 0;
    let measuredWidth = track.clientWidth;

    function settle() {
      window.clearTimeout(timer);
      if (!track || touching) return;

      const start = slideOffset(track, count);
      const end = slideOffset(track, count * 2);
      const position = track.scrollLeft;
      const itemWidth = slideOffset(track, count + 1) - start;
      if (itemWidth > 0) {
        // Preserve the visible category during resize and iPhone rotation.
        activeIndex = ((Math.round((position - start) / itemWidth) % count) + count) % count;
      }
      // Keep the visible cards in place when moving back to the middle copy.
      if (position < start - 1) {
        track.scrollTo({ left: position + end - start, behavior: "instant" });
      } else if (position >= end - 1) {
        track.scrollTo({ left: position - (end - start), behavior: "instant" });
      }
    }

    function scheduleSettle() {
      window.clearTimeout(timer);
      timer = window.setTimeout(settle, 160);
    }

    function beginTouch() {
      touching = true;
    }

    function endTouch() {
      touching = false;
      scheduleSettle();
    }

    const resizeObserver = new ResizeObserver(() => {
      const nextWidth = track.clientWidth;
      if (Math.abs(nextWidth - measuredWidth) < 1) return;
      measuredWidth = nextWidth;
      window.clearTimeout(timer);
      track.scrollTo({
        left: slideOffset(track, count + activeIndex),
        behavior: "instant",
      });
    });
    resizeObserver.observe(track);
    track.addEventListener("scroll", scheduleSettle, { passive: true });
    track.addEventListener("scrollend", settle);
    track.addEventListener("touchstart", beginTouch, { passive: true });
    track.addEventListener("touchend", endTouch, { passive: true });
    track.addEventListener("touchcancel", endTouch, { passive: true });
    return () => {
      window.clearTimeout(timer);
      resizeObserver.disconnect();
      track.removeEventListener("scroll", scheduleSettle);
      track.removeEventListener("scrollend", settle);
      track.removeEventListener("touchstart", beginTouch);
      track.removeEventListener("touchend", endTouch);
      track.removeEventListener("touchcancel", endTouch);
    };
  }, [canLoop, count]);

  function step(direction: -1 | 1) {
    const track = trackRef.current;
    if (!track || !canLoop) return;
    const distance = slideOffset(track, 1);
    const current = Math.round(track.scrollLeft / distance);
    const target = Math.max(0, Math.min(track.children.length - 1, current + direction));
    track.scrollTo({ left: slideOffset(track, target) });
  }

  return (
    <section
      className={`shell ${styles.section}`}
      aria-labelledby="catalogue-slider-title"
      data-touch-home-motion={touchMotion || undefined}
    >
      <div className={styles.heading}>
        <h2 id="catalogue-slider-title">LED Lighting</h2>
        <Link href="/products" className={styles.allProducts}>
          All Products <ArrowUpRight size={17} aria-hidden="true" />
        </Link>
      </div>
      <ul
        id="catalogue-slider-track"
        ref={trackRef}
        className={styles.track}
        role="list"
        aria-label="LED lighting categories"
        tabIndex={0}
        onKeyDown={(event) => {
          if (!canLoop || event.target !== event.currentTarget) return;
          if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
          event.preventDefault();
          step(event.key === "ArrowLeft" ? -1 : 1);
        }}
      >
        {(canLoop ? copies : [0]).flatMap((copy) =>
          slides.map(({ slug, name, image, href }) => (
            <li key={`${copy}-${slug}`} aria-hidden={copy !== 0 || undefined}>
              <Link
                href={href}
                prefetch={false}
                tabIndex={copy === 0 ? undefined : -1}
                className={styles.card}
              >
                <span className={styles.image}>
                  <Image
                    src={image}
                    alt=""
                    fill
                    loading="lazy"
                    sizes="(max-width: 560px) 82vw, (max-width: 900px) 43vw, (max-width: 1450px) 29vw, 425px"
                  />
                </span>
                <span className={styles.label}>
                  {name} <ArrowUpRight size={18} aria-hidden="true" />
                </span>
              </Link>
            </li>
          )),
        )}
      </ul>
      <div className={styles.controls}>
        <button
          type="button"
          aria-label="Previous category"
          aria-controls="catalogue-slider-track"
          disabled={!canLoop}
          onClick={() => step(-1)}
        >
          <ArrowLeft size={19} aria-hidden="true" />
        </button>
        <button
          type="button"
          aria-label="Next category"
          aria-controls="catalogue-slider-track"
          disabled={!canLoop}
          onClick={() => step(1)}
        >
          <ArrowRight size={19} aria-hidden="true" />
        </button>
      </div>
    </section>
  );
}
