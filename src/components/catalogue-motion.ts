"use client";

import { useCallback, useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { useSiteReducedMotion } from "./use-media-query";

const selector = "[data-catalogue-item]";
const inView = (rect: DOMRect) => rect.bottom > 0 && rect.top < window.innerHeight && rect.right > 0 && rect.left < window.innerWidth;
const keyFor = (node: HTMLElement) => node.dataset.catalogueItem ?? "";

/**
 * Animate the grid item wrapper, never the image or interactive card itself.
 * Capture current visual bounds before a filter change, then invert the new
 * layout after React commits. Keeping stable keys preserves surviving cards.
 */
export function useCatalogueMotion<T extends HTMLElement>(signature: string) {
  const grid = useRef<T>(null);
  const previous = useRef<Map<string, DOMRect> | null>(null);
  const seen = useRef(new Set<string>());
  const lastSignature = useRef<string | null>(null);
  const reduced = useSiteReducedMotion();

  const capture = useCallback(() => {
    if (!grid.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    previous.current = new Map(
      Array.from(grid.current.querySelectorAll<HTMLElement>(selector), node => [keyFor(node), node.getBoundingClientRect()]),
    );
  }, []);

  useLayoutEffect(() => {
    const root = grid.current;
    if (!root) return;
    const nodes = Array.from(root.querySelectorAll<HTMLElement>(selector));
    const first = lastSignature.current === null;
    const changed = lastSignature.current !== signature;
    const before = changed ? previous.current : null;
    previous.current = null;
    lastSignature.current = signature;

    if (reduced || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const bounds = new Map<HTMLElement, DOMRect>(nodes.map(node => [node, node.getBoundingClientRect()]));
    const entering: HTMLElement[] = [];
    const pending: HTMLElement[] = [];
    const reveal = (items: HTMLElement[]) => {
      items.forEach((node, index) => {
        seen.current.add(keyFor(node));
        gsap.fromTo(node,
          { y: 24, scale: 0.97, opacity: 0 },
          { y: 0, scale: 1, opacity: 1, duration: 0.58, delay: Math.min(index, 3) * 0.08, ease: "power2.out", overwrite: "auto", clearProps: "transform,opacity" },
        );
      });
    };

    for (const node of nodes) {
      const id = keyFor(node);
      const rect = bounds.get(node)!;
      const old = before?.get(id);
      // Keep already painted initial cards visible, avoiding a hydration flash.
      if (first && inView(rect)) {
        seen.current.add(id);
        continue;
      }
      if (old && inView(rect) && inView(old)) {
        const x = old.left - rect.left;
        const y = old.top - rect.top;
        seen.current.add(id);
        if (Math.abs(x) > 1 || Math.abs(y) > 1) {
          gsap.fromTo(node, { x, y }, { x: 0, y: 0, duration: 0.38, ease: "power2.out", overwrite: "auto", clearProps: "transform" });
        }
      } else if (inView(rect)) {
        if (changed && (!old || !seen.current.has(id))) entering.push(node);
        else seen.current.add(id);
      } else if (!seen.current.has(id)) {
        pending.push(node);
      }
    }
    reveal(entering);

    // Off-screen cards stay visible in the DOM until they enter the viewport.
    // If IntersectionObserver is unavailable, the catalogue remains static.
    let active = true;
    const observer = typeof IntersectionObserver === "undefined" ? null :
      new IntersectionObserver(entries => {
        if (!active) return;
        const visible = entries.filter(entry => entry.isIntersecting).map(entry => entry.target as HTMLElement);
        visible.sort((a, b) => nodes.indexOf(a) - nodes.indexOf(b));
        visible.forEach(node => observer?.unobserve(node));
        reveal(visible.filter(node => !seen.current.has(keyFor(node))));
      }, { threshold: 0.08 });
    pending.forEach(node => observer?.observe(node));

    return () => {
      active = false;
      observer?.disconnect();
      if (nodes.length) {
        gsap.killTweensOf(nodes);
        gsap.set(nodes, { clearProps: "transform,opacity" });
      }
    };
  }, [signature, reduced]);

  return { grid, capture };
}
