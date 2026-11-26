"use client";

import { useCallback, useSyncExternalStore } from "react";

const reducedMotionQuery = "(prefers-reduced-motion: reduce)";
export const compactSceneQuery = "(max-width: 650px)";

function serverSnapshot() {
  return false;
}

export function useMediaQuery(query: string, fallback = serverSnapshot) {
  const subscribe = useCallback(
    (update: () => void) => {
      const media = window.matchMedia(query);
      media.addEventListener("change", update);
      return () => media.removeEventListener("change", update);
    },
    [query],
  );
  const getSnapshot = useCallback(
    () => window.matchMedia(query).matches || fallback(),
    [query, fallback],
  );
  return useSyncExternalStore(subscribe, getSnapshot, serverSnapshot);
}

export function useSiteReducedMotion() {
  return useMediaQuery(reducedMotionQuery);
}

function isAndroidOrIPhone() {
  return /\b(?:Android|iPhone)\b/i.test(window.navigator.userAgent);
}

export function useTouchHomepageMotion() {
  // The pointer media query describes input hardware, so fall back to the mobile platform when needed.
  return useMediaQuery("(any-pointer: coarse) and (max-width: 1024px)", isAndroidOrIPhone);
}
