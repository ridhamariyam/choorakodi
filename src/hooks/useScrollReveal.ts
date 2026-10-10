"use client";

import type { RefObject } from "react";
import { REVEAL_START } from "@/lib/gsap";
import { useGsap } from "./useGsap";

export type ScrollRevealOptions = {
  /** Which descendants to reveal. Defaults to anything marked `data-reveal`. */
  selector?: string;
  /** Vertical travel in px. Shortened automatically on small screens. */
  y?: number;
  stagger?: number;
  duration?: number;
  start?: string;
  /** Reveal each element individually rather than in one batch. */
  individually?: boolean;
  /**
   * Bump to re-run the reveal — e.g. when a filter swaps the element set.
   * Without it the hook would leave newly mounted nodes unanimated.
   */
  revision?: string | number;
};

/**
 * The single scroll-reveal implementation for the whole site.
 *
 * Elements render visible in the HTML and are hidden here inside a layout
 * effect, before the browser paints — so there is no flash, no hydration
 * mismatch, and no way for a JS failure to strand content invisible.
 */
export function useScrollReveal(
  scope: RefObject<HTMLElement | null>,
  options: ScrollRevealOptions = {},
): void {
  const {
    selector = "[data-reveal]",
    y = 28,
    stagger = 0.09,
    duration = 1.05,
    start = REVEAL_START,
    individually = false,
    revision = 0,
  } = options;

  useGsap(
    ({ gsap, ScrollTrigger, root, reduced }) => {
      const targets = gsap.utils.toArray<HTMLElement>(selector, root);
      if (targets.length === 0) return;

      if (reduced) {
        // Nothing to do: the markup is already in its resting state.
        return;
      }

      const travel = window.innerWidth < 768 ? Math.min(y, 18) : y;
      gsap.set(targets, { opacity: 0, y: travel });

      if (individually) {
        for (const target of targets) {
          gsap.to(target, {
            opacity: 1,
            y: 0,
            duration,
            scrollTrigger: { trigger: target, start, once: true },
          });
        }
        return;
      }

      // batch() groups elements entering the viewport in the same frame, so a
      // stagger reads as one considered movement instead of many small ones.
      ScrollTrigger.batch(targets, {
        start,
        once: true,
        onEnter: (batch) =>
          gsap.to(batch, { opacity: 1, y: 0, duration, stagger, overwrite: true }),
      });
    },
    [selector, y, stagger, duration, start, individually, revision],
    { scope },
  );
}
