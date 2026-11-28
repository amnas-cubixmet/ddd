"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import type { ProductImage } from "@/lib/catalogue";
import { CatalogueImage } from "./catalogue-image";
import styles from "./gallery.module.css";

export function Gallery({
  images,
}: {
  images: [ProductImage, ...ProductImage[]];
}) {
  const [index, setIndex] = useState(0);
  const rail = useRef<HTMLDivElement>(null);
  const gesture = useRef<{ id: number; x: number; y: number } | null>(null);
  const image = images[index];
  const multiple = images.length > 1;

  useEffect(() => {
    const track = rail.current;
    const selected = track?.querySelector<HTMLElement>('[aria-pressed="true"]');
    if (!track || !selected) return;
    const viewport = track.getBoundingClientRect();
    const item = selected.getBoundingClientRect();
    if (item.left < viewport.left || item.right > viewport.right) {
      track.scrollTo({
        left: track.scrollLeft + item.left - viewport.left - (track.clientWidth - item.width) / 2,
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
      });
    }
  }, [index]);

  function move(delta: number) {
    setIndex(current => (current + delta + images.length) % images.length);
  }

  function handleKeys(event: KeyboardEvent<HTMLElement>) {
    if (!multiple || (event.key !== "ArrowLeft" && event.key !== "ArrowRight")) return;
    event.preventDefault();
    move(event.key === "ArrowRight" ? 1 : -1);
  }

  function startSwipe(event: PointerEvent<HTMLDivElement>) {
    if (!multiple || event.pointerType === "mouse" || !event.isPrimary) return;
    gesture.current = { id: event.pointerId, x: event.clientX, y: event.clientY };
  }

  function endSwipe(event: PointerEvent<HTMLDivElement>) {
    const start = gesture.current;
    gesture.current = null;
    if (!start || start.id !== event.pointerId) return;
    const dx = event.clientX - start.x;
    const dy = event.clientY - start.y;
    if (Math.abs(dx) >= 36 && Math.abs(dx) > Math.abs(dy) * 1.25) {
      move(dx < 0 ? 1 : -1);
    }
  }

  return (
    <div className={`product-gallery ${styles.gallery}`} role="region" aria-label="Product image slider" onKeyDown={handleKeys}>
      <div className={styles.stage}>
        <div
          className={`detail-image product-gallery-image ${styles.mainImage}`}
          onPointerDown={startSwipe}
          onPointerUp={endSwipe}
          onPointerCancel={() => { gesture.current = null; }}
        >
          <span className="gallery-image-transition" key={image.src}>
            <CatalogueImage {...image} eager={index === 0} sizes="(max-width: 805px) 94vw, (max-width: 1450px) 50vw, 690px" />
          </span>
        </div>
        {multiple && <>
          <button type="button" className={`${styles.arrow} ${styles.previous}`} aria-label="Previous image" onClick={() => move(-1)}>
            <ChevronLeft size={20} aria-hidden="true" />
          </button>
          <button type="button" className={`${styles.arrow} ${styles.next}`} aria-label="Next image" onClick={() => move(1)}>
            <ChevronRight size={20} aria-hidden="true" />
          </button>
          <span className={styles.counter} aria-hidden="true">{index + 1} / {images.length}</span>
        </>}
      </div>
      <span className="sr-only" aria-live="polite">Image {index + 1} of {images.length}: {image.label}</span>
      {image.representative && <p className="product-photo-caption">Representative imagery</p>}
      {multiple && (
        <div className={`gallery-controls ${styles.rail}`} ref={rail} role="group" aria-label="Image gallery">
          {images.map((view, position) => (
            <button
              type="button"
              key={`${view.src}-${position}`}
              aria-label={`Show ${view.label.toLowerCase()}`}
              aria-pressed={position === index}
              onClick={() => setIndex(position)}
            >
              <CatalogueImage src={view.src} alt="" sizes="110px" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
