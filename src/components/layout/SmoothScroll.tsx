"use client";

import { useCallback, useEffect, useMemo, useRef, type ReactNode } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { LenisContext, type LenisApi } from "@/hooks/useLenis";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * Owns the single Lenis instance and wires it to GSAP's ticker so that Lenis
 * and ScrollTrigger share one rAF loop instead of competing for frames.
 *
 * Under prefers-reduced-motion Lenis is never constructed: smooth scrolling is
 * itself a motion effect, and hijacking the scroll wheel is exactly what that
 * preference asks us not to do. Native scrolling takes over and every consumer
 * falls back through the context default.
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const reducedMotion = useReducedMotion();
  // Held in a ref, not state: nothing renders differently once Lenis exists,
  // so putting it in state would re-render the entire tree for no visual
  // change. Consumers read it through getLenis() when they actually need it.
  const lenisRef = useRef<Lenis | null>(null);
  /** Nested stop() calls (menu + lightbox) must not unlock each other. */
  const stopCount = useRef(0);

  useEffect(() => {
    if (reducedMotion) return;

    const instance = new Lenis({
      // Slow and weighted. The brief asks for "controlled, not chaotic".
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.6,
      // Native momentum on touch is better than anything we can emulate.
      syncTouch: false,
      // Hash links are handled by Lenis; otherwise a native jump fights the
      // smooth-scroll loop and lands in the wrong place.
      anchors: true,
    });

    lenisRef.current = instance;
    stopCount.current = 0;

    instance.on("scroll", ScrollTrigger.update);

    const tick = (time: number) => instance.raf(time * 1000);
    gsap.ticker.add(tick);
    // lagSmoothing causes GSAP to fast-forward after a stall, which makes
    // scrub animations jump. Off, so scroll-linked motion stays 1:1.
    gsap.ticker.lagSmoothing(0);

    const refresh = window.requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => {
      window.cancelAnimationFrame(refresh);
      gsap.ticker.remove(tick);
      gsap.ticker.lagSmoothing(500, 33);
      instance.destroy();
      lenisRef.current = null;
    };
  }, [reducedMotion]);

  const scrollToTop = useCallback((immediate = true) => {
    const instance = lenisRef.current;
    if (instance) {
      instance.scrollTo(0, { immediate });
      return;
    }
    window.scrollTo({ top: 0, behavior: immediate ? "auto" : "smooth" });
  }, []);

  const stop = useCallback(() => {
    stopCount.current += 1;
    if (stopCount.current > 1) return;
    lenisRef.current?.stop();
    // Without Lenis, lock the document instead so the page behind a modal
    // cannot scroll. Padding compensates for the removed scrollbar.
    if (!lenisRef.current) {
      const width = window.innerWidth - document.documentElement.clientWidth;
      document.documentElement.style.overflow = "hidden";
      document.documentElement.style.paddingRight = width > 0 ? `${width}px` : "";
    }
  }, []);

  const start = useCallback(() => {
    stopCount.current = Math.max(0, stopCount.current - 1);
    if (stopCount.current > 0) return;
    lenisRef.current?.start();
    if (!lenisRef.current) {
      document.documentElement.style.overflow = "";
      document.documentElement.style.paddingRight = "";
    }
  }, []);

  const getLenis = useCallback(() => lenisRef.current, []);

  // Every member is stable, so the context value never changes identity and
  // no consumer re-renders because of this provider.
  const api = useMemo<LenisApi>(
    () => ({ getLenis, scrollToTop, stop, start }),
    [getLenis, scrollToTop, stop, start],
  );

  return <LenisContext.Provider value={api}>{children}</LenisContext.Provider>;
}
