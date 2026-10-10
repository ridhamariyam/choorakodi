"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/hooks/useReducedMotion";
import { TransitionLink } from "@/components/animation/PageTransition";
import { BrandMark, Wordmark } from "@/components/brand/BrandMark";
import { MenuOverlay } from "./MenuOverlay";
import { cn } from "@/lib/utils";

type NavTheme = "light" | "dark";

/** Vertical point at which the bar samples the section beneath it. */
const SAMPLE_Y = 42;

/**
 * Fixed navigation.
 *
 * The bar has no background of its own — it reads the tone of whatever
 * section is passing beneath it and inverts. A 1px sampling band at the bar's
 * own height, watched with IntersectionObserver, is enough: no scroll
 * listener, no layout reads per frame.
 */
export function Navbar() {
  const pathname = usePathname();
  const [theme, setTheme] = useState<NavTheme>("dark");
  const [menuOpen, setMenuOpen] = useState(false);
  const [condensed, setCondensed] = useState(false);
  const barRef = useRef<HTMLElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // --- tone sampling -----------------------------------------------------
  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>("[data-nav-theme]"));

    // Defensive only: every top-level section carries data-nav-theme. Deferred
    // to the next frame so it is not a synchronous set-state cascade.
    if (sections.length === 0) {
      const id = window.requestAnimationFrame(() => setTheme("light"));
      return () => window.cancelAnimationFrame(id);
    }

    const build = () => {
      const bottom = Math.max(0, window.innerHeight - SAMPLE_Y - 1);
      return new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (!entry.isIntersecting) continue;
            const value = entry.target.getAttribute("data-nav-theme");
            if (value === "light" || value === "dark") setTheme(value);
          }
        },
        { rootMargin: `-${SAMPLE_Y}px 0px -${bottom}px 0px`, threshold: 0 },
      );
    };

    let observer = build();
    for (const section of sections) observer.observe(section);

    // The band is expressed in px, so it has to be rebuilt on resize.
    let resizeTimer: number;
    const onResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        observer.disconnect();
        observer = build();
        for (const section of sections) observer.observe(section);
      }, 180);
    };

    window.addEventListener("resize", onResize);
    return () => {
      window.clearTimeout(resizeTimer);
      window.removeEventListener("resize", onResize);
      observer.disconnect();
    };
  }, [pathname]);

  // --- condense on scroll ------------------------------------------------
  useEffect(() => {
    const onScroll = () => setCondensed(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // --- entrance ----------------------------------------------------------
  useEffect(() => {
    const bar = barRef.current;
    if (!bar || prefersReducedMotion()) return;
    // fromTo, not from: a `from` re-run (Strict Mode, Fast Refresh) reads
    // the half-hidden bar as its end state and leaves it off-screen.
    gsap.set(bar, { yPercent: -100 });
    let tween: gsap.core.Tween | undefined;
    const enter = (delay: number) => {
      tween = gsap.fromTo(bar, { yPercent: -100 }, { yPercent: 0, duration: 1, delay, ease: "power3.out" });
    };
    // On a first visit the bar arrives as the logo preloader dissolves.
    const preloader = document.querySelector("ck-preloader");
    const onLeaving = () => enter(0.35);
    if (preloader) window.addEventListener("ck-leaving", onLeaving, { once: true });
    else enter(0.25);
    // If the preloader is skipped outright, it never sends ck-leaving.
    const onFinished = () => {
      if (!tween) enter(0);
    };
    window.addEventListener("ck-finished", onFinished, { once: true });
    return () => {
      window.removeEventListener("ck-leaving", onLeaving);
      window.removeEventListener("ck-finished", onFinished);
      tween?.kill();
      gsap.set(bar, { yPercent: 0 });
    };
  }, []);

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  const dark = theme === "dark" && !menuOpen;
  const text = dark ? "text-bone" : "text-ink";

  return (
    <>
      <header
        ref={barRef}
        className={cn(
          "fixed inset-x-0 top-0 z-[140] transition-[background-color,backdrop-filter] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]",
          // A whisper of ground once scrolled, so the wordmark never fights a
          // busy photograph. Not a glass panel.
          // The homepage chronicle changes ground colour as it scrolls, so a
          // tinted band would read as a stripe; the bar stays bare there.
          condensed && !menuOpen && pathname !== "/" && (dark ? "bg-ink/35 backdrop-blur-[6px]" : "bg-bone/70 backdrop-blur-[6px]"),
          menuOpen && "bg-transparent",
        )}
      >
        <div
          className={cn(
            "gutter mx-auto flex w-full max-w-[110rem] items-center justify-between transition-[padding] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]",
            condensed ? "py-4" : "py-6",
          )}
        >
          <TransitionLink
            href="/"
            aria-label="Choorakkodi Martial Arts Academy — home"
            className={cn(
              "transition-colors duration-700",
              menuOpen ? "pointer-events-none opacity-0" : text,
            )}
          >
            {/* The homepage opens on the film alone: mark only, no lettering. */}
            {pathname === "/" ? (
              <BrandMark tone={dark ? "reverse" : "brand"} className="h-11 w-11 sm:h-12 sm:w-12" />
            ) : (
              <Wordmark
                tone={dark ? "reverse" : "brand"}
                className={cn(
                  "w-auto transition-[height] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]",
                  condensed ? "h-8 sm:h-9" : "h-9 sm:h-11",
                )}
              />
            )}
          </TransitionLink>

          {/* WhatsApp lives in the floating icon, not up here — the bar stays
              down to the wordmark and one control. */}
          <div className={cn("flex items-center", menuOpen && "pointer-events-none opacity-0")}>
            <button
              ref={triggerRef}
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-expanded={menuOpen}
              aria-haspopup="dialog"
              className={cn(
                "group flex items-center gap-3 px-2 py-2.5 transition-colors duration-700",
                text,
              )}
            >
              <span className="text-meta font-medium uppercase tracking-[0.18em]">Menu</span>
              <span aria-hidden="true" className="flex w-6 flex-col gap-[5px]">
                <span className="h-px w-full bg-current transition-transform duration-[0.55s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1" />
                <span className="h-px w-full bg-current transition-transform duration-[0.55s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-x-1" />
              </span>
            </button>
          </div>
        </div>
      </header>

      <MenuOverlay open={menuOpen} onClose={closeMenu} />
    </>
  );
}
