"use client";

import { createContext, useContext } from "react";
import type Lenis from "lenis";

export type LenisApi = {
  /** The live instance, or null when Lenis is not running. */
  getLenis: () => Lenis | null;
  /** Jump to the top with no animation — used between page transitions. */
  scrollToTop: (immediate?: boolean) => void;
  /** Freeze scrolling, e.g. while the fullscreen menu is open. */
  stop: () => void;
  start: () => void;
};

const fallback: LenisApi = {
  getLenis: () => null,
  scrollToTop: (immediate = true) => {
    if (typeof window === "undefined") return;
    window.scrollTo({ top: 0, behavior: immediate ? "auto" : "smooth" });
  },
  stop: () => {},
  start: () => {},
};

export const LenisContext = createContext<LenisApi>(fallback);

/**
 * Access to the shared Lenis instance. Falls back to native scrolling when
 * Lenis is not running (reduced motion, or before the provider mounts), so
 * callers never need to null-check.
 */
export function useLenis(): LenisApi {
  return useContext(LenisContext);
}
