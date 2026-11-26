"use client";

import { useEffect, useRef, type ReactNode } from "react";
import type { gsap } from "gsap";
import { useSiteReducedMotion } from "./use-media-query";

export type MotionTools = { gsap: typeof gsap; media: gsap.MatchMedia };

export function useMotion<T extends HTMLElement>(
  setup: (element: T, tools: MotionTools) => void,
  keepMotion = false,
) {
  const ref = useRef<T>(null);
  const reduced = useSiteReducedMotion() && !keepMotion;
  useEffect(() => {
    const element = ref.current;
    if (!element || reduced) return;
    let cancelled = false;
    let media: gsap.MatchMedia | undefined;

    async function animate(target: T) {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (cancelled || !target.isConnected) return;
      gsap.registerPlugin(ScrollTrigger);
      media = gsap.matchMedia();
      setup(target, { gsap, media });
    }

    void animate(element);
    return () => {
      cancelled = true;
      media?.revert();
    };
  }, [reduced, setup]);
  return ref;
}

function animateReveal(element: HTMLElement, { gsap, media }: MotionTools) {
  media.add("all", () => {
    if (element.getBoundingClientRect().top < innerHeight * 0.96) return;
    gsap.from(element, {
      y: 22,
      opacity: 0,
      duration: 0.65,
      clearProps: "all",
      scrollTrigger: { trigger: element, start: "top 96%", once: true },
    });
  });
}

export function Reveal({
  as: Tag = "div",
  className,
  children,
}: {
  as?: "div" | "article" | "section";
  className: string;
  children: ReactNode;
}) {
  const ref = useMotion<HTMLElement>(animateReveal);

  return (
    <Tag
      className={className}
      ref={(element) => {
        ref.current = element;
      }}
    >
      {children}
    </Tag>
  );
}
