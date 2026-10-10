"use client";

import { useEffect, useLayoutEffect, type DependencyList, type RefObject } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { prefersReducedMotion } from "./useReducedMotion";

/** useLayoutEffect warns during SSR; swap it out on the server. */
const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

export type GsapContextArgs = {
  gsap: typeof gsap;
  ScrollTrigger: typeof ScrollTrigger;
  /** The scope element, already narrowed to non-null. */
  root: HTMLElement;
  /** True when the user has asked for reduced motion. */
  reduced: boolean;
  /** Registers extra teardown, run before the context reverts. */
  cleanup: (fn: () => void) => void;
  /**
   * The gsap.Context itself. Animations created asynchronously (after a font
   * or image has loaded) must be wrapped in `context.add(fn)`, otherwise the
   * context cannot revert them.
   */
  context: gsap.Context;
};

export type UseGsapOptions = {
  /** Scopes every selector inside the callback. Strongly recommended. */
  scope: RefObject<HTMLElement | null>;
  /** Skip the callback entirely (e.g. while data is still loading). */
  disabled?: boolean;
  /**
   * When true the callback is skipped under prefers-reduced-motion. Use for
   * scrub-heavy, parallax and pinning work. Leave false for callbacks that
   * handle the reduced case themselves via `reduced`.
   */
  skipOnReducedMotion?: boolean;
};

/**
 * Runs GSAP work inside a scoped `gsap.context`, so every tween, timeline and
 * ScrollTrigger created in the callback is reverted together on unmount or
 * when `deps` change. This is what keeps route changes from leaking triggers.
 */
export function useGsap(
  callback: (args: GsapContextArgs) => void,
  deps: DependencyList,
  { scope, disabled = false, skipOnReducedMotion = false }: UseGsapOptions,
): void {
  useIsomorphicLayoutEffect(() => {
    const root = scope.current;
    if (!root || disabled) return;

    const reduced = prefersReducedMotion();
    if (reduced && skipOnReducedMotion) return;

    const extraCleanups: (() => void)[] = [];

    const ctx = gsap.context(function (this: gsap.Context) {
      callback({
        gsap,
        ScrollTrigger,
        root,
        reduced,
        cleanup: (fn) => extraCleanups.push(fn),
        context: this,
      });
    }, root);

    return () => {
      for (const fn of extraCleanups) fn();
      ctx.revert();
    };
    // The callback is intentionally excluded: callers pass `deps` explicitly so
    // an inline arrow function doesn't re-run the context on every render.
  }, [scope, disabled, skipOnReducedMotion, ...deps]);
}
