"use client";

import { ChevronLeft, ChevronRight, ZoomIn, X } from "lucide-react";
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
  const [opened, setOpened] = useState(false);
  const [zoom, setZoom] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const rail = useRef<HTMLDivElement>(null);
  const gesture = useRef<{ id: number; x: number; y: number } | null>(null);
  const suppressClick = useRef(false);
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
    setZoom(false);
  }

  function handleKeys(event: KeyboardEvent<HTMLElement>) {
    if (!multiple || (event.key !== "ArrowLeft" && event.key !== "ArrowRight")) return;
    event.preventDefault();
    move(event.key === "ArrowRight" ? 1 : -1);
  }

  function startSwipe(event: PointerEvent<HTMLButtonElement>) {
    suppressClick.current = false;
    if (!multiple || event.pointerType === "mouse" || !event.isPrimary) return;
    gesture.current = { id: event.pointerId, x: event.clientX, y: event.clientY };
  }

  function endSwipe(event: PointerEvent<HTMLButtonElement>) {
    const start = gesture.current;
    gesture.current = null;
    if (!start || start.id !== event.pointerId) return;
    const dx = event.clientX - start.x;
    const dy = event.clientY - start.y;
    if (Math.abs(dx) >= 36 && Math.abs(dx) > Math.abs(dy) * 1.25) {
      suppressClick.current = true;
      move(dx < 0 ? 1 : -1);
    }
  }

  function openImage() {
    if (suppressClick.current) {
      suppressClick.current = false;
      return;
    }
    setZoom(false);
    setOpened(true);
    dialog.current?.showModal();
  }

  return (
    <div className={`product-gallery ${styles.gallery}`} role="region" aria-label="Product image slider" onKeyDown={handleKeys}>
      <div className={styles.stage}>
        <button
          className={`detail-image product-gallery-image ${styles.mainImage}`}
          type="button"
          onClick={openImage}
          onPointerDown={startSwipe}
          onPointerUp={endSwipe}
          onPointerCancel={() => { gesture.current = null; suppressClick.current = false; }}
          aria-label="Open full-size fixture image"
        >
          <span className="gallery-image-transition" key={image.src}>
            <CatalogueImage {...image} sizes="(max-width: 805px) 94vw, 55vw" />
          </span>
          <span className="card-icon">
            <ZoomIn size={19} aria-hidden="true" />
          </span>
        </button>
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
      <dialog
        className="product-lightbox"
        ref={dialog}
        onClose={() => setOpened(false)}
        onKeyDown={event => { if (event.key === "ArrowLeft" || event.key === "ArrowRight") event.stopPropagation(); }}
        aria-labelledby="product-image-title"
      >
        <header>
          <h2 id="product-image-title">{image.label}</h2>
          <button type="button" className="icon-button" aria-label="Close fixture image" onClick={() => dialog.current?.close()}>
            <X size={20} />
          </button>
        </header>
        <button type="button" className="lightbox-image" aria-pressed={zoom} aria-label="Magnify fixture" onClick={() => setZoom(!zoom)}>
          <span className={zoom ? "image-magnified" : undefined}>
            {opened && <CatalogueImage src={image.src} alt={image.alt} sizes="(max-width: 700px) 94vw, 850px" />}
          </span>
        </button>
        {multiple && <div className={styles.lightboxNavigation}>
          <button type="button" aria-label="Previous full-size image" onClick={() => move(-1)}><ChevronLeft size={20} /></button>
          <span>{index + 1} / {images.length}</span>
          <button type="button" aria-label="Next full-size image" onClick={() => move(1)}><ChevronRight size={20} /></button>
        </div>}
      </dialog>
    </div>
  );
}
