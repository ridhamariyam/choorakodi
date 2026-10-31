"use client";

import { useCallback, useEffect, useRef } from "react";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/hooks/useReducedMotion";
import { useLenis } from "@/hooks/useLenis";
import { Figure } from "@/components/content/Figure";
import type { GalleryItem } from "@/data/gallery";

const FOCUSABLE = "button:not([disabled]), a[href]";

export type GalleryLightboxProps = {
  items: GalleryItem[];
  /** Index into `items`, or null when closed. */
  index: number | null;
  onClose: () => void;
  onNavigate: (nextIndex: number) => void;
};

/**
 * Fullscreen image viewer.
 *
 * Accessibility: modal dialog semantics, focus trapped inside, focus returned
 * to the thumbnail that opened it, Escape to close, arrow keys to page, and a
 * live region announcing the current position in the set.
 */
export function GalleryLightbox({ items, index, onClose, onNavigate }: GalleryLightboxProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);
  const { stop, start } = useLenis();
  const lockedRef = useRef(false);

  const open = index !== null;
  const item = open ? items[index] : undefined;
  const count = items.length;

  const goNext = useCallback(() => {
    if (index === null || count === 0) return;
    onNavigate((index + 1) % count);
  }, [index, count, onNavigate]);

  const goPrev = useCallback(() => {
    if (index === null || count === 0) return;
    onNavigate((index - 1 + count) % count);
  }, [index, count, onNavigate]);

  // --- open / close ------------------------------------------------------
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const reduced = prefersReducedMotion();

    if (open) {
      previousFocus.current = document.activeElement as HTMLElement | null;
      gsap.set(root, { autoAlpha: 1 });

      if (!reduced) {
        gsap.fromTo(root, { opacity: 0 }, { opacity: 1, duration: 0.45, ease: "power2.out" });
        gsap.fromTo(
          frameRef.current,
          { scale: 0.94, y: 24, opacity: 0 },
          { scale: 1, y: 0, opacity: 1, duration: 0.8, ease: "power3.out" },
        );
      }

      window.requestAnimationFrame(() => closeRef.current?.focus());
      return;
    }

    if (root.style.visibility !== "visible") {
      gsap.set(root, { autoAlpha: 0 });
      return;
    }

    if (reduced) {
      gsap.set(root, { autoAlpha: 0 });
    } else {
      gsap.to(frameRef.current, { scale: 0.96, opacity: 0, duration: 0.3, ease: "power2.in" });
      gsap.to(root, {
        opacity: 0,
        duration: 0.35,
        delay: 0.05,
        onComplete: () => gsap.set(root, { autoAlpha: 0 }),
      });
    }

    previousFocus.current?.focus?.();
  }, [open]);

  // --- image change ------------------------------------------------------
  useEffect(() => {
    if (!open || prefersReducedMotion()) return;
    gsap.fromTo(
      frameRef.current,
      { opacity: 0.35 },
      { opacity: 1, duration: 0.45, ease: "power2.out" },
    );
  }, [index, open]);

  // --- scroll lock -------------------------------------------------------
  useEffect(() => {
    if (open && !lockedRef.current) {
      lockedRef.current = true;
      stop();
    } else if (!open && lockedRef.current) {
      lockedRef.current = false;
      start();
    }
  }, [open, stop, start]);

  useEffect(
    () => () => {
      if (lockedRef.current) {
        lockedRef.current = false;
        start();
      }
    },
    [start],
  );

  // --- keyboard ----------------------------------------------------------
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case "Escape":
          event.preventDefault();
          onClose();
          break;
        case "ArrowRight":
          event.preventDefault();
          goNext();
          break;
        case "ArrowLeft":
          event.preventDefault();
          goPrev();
          break;
        case "Tab": {
          const root = rootRef.current;
          if (!root) return;
          const focusable = Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE));
          if (focusable.length === 0) return;
          const first = focusable[0]!;
          const last = focusable[focusable.length - 1]!;
          if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last.focus();
          } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first.focus();
          }
          break;
        }
        default:
          break;
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose, goNext, goPrev]);

  return (
    <div
      ref={rootRef}
      role="dialog"
      aria-modal="true"
      aria-label="Gallery viewer"
      aria-hidden={!open}
      {...(!open ? { inert: true } : {})}
      className="invisible fixed inset-0 z-[180] bg-ink/97 opacity-0 grain"
    >
      <div className="gutter mx-auto flex h-full w-full max-w-[110rem] flex-col py-6">
        {/* Bar */}
        <div className="flex items-center justify-between gap-6 border-b border-bone/12 pb-5">
          <p className="eyebrow text-soil-ink">{item?.category}</p>
          <div className="flex items-center gap-6">
            <p aria-live="polite" className="eyebrow text-bone/62">
              {index !== null ? `${index + 1} / ${count}` : ""}
            </p>
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              className="group flex items-center gap-2.5 px-1 py-1 text-bone"
            >
              <span className="text-meta font-medium uppercase tracking-[0.18em]">Close</span>
              <X
                className="h-4 w-4 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:rotate-90"
                strokeWidth={1.6}
              />
            </button>
          </div>
        </div>

        {/* Frame */}
        <div className="flex min-h-0 flex-1 items-center justify-center py-8">
          <div ref={frameRef} className="flex h-full w-full max-w-5xl items-center justify-center">
            {item ? (
              <Figure
                slot={item.image}
                tone="ink"
                ratio={item.ratio === "portrait" || item.ratio === "tall" ? "3 / 4" : "3 / 2"}
                sizes="(max-width: 1024px) 92vw, 64rem"
                className="max-h-full w-auto [&>div]:max-h-[62vh] [&>div]:w-auto [&>div]:min-w-[min(92vw,42rem)]"
              />
            ) : null}
          </div>
        </div>

        {/* Caption + controls */}
        <div className="flex flex-wrap items-end justify-between gap-6 border-t border-bone/12 pt-5">
          <p className="measure-tight text-[0.9375rem] leading-relaxed text-bone/60">
            {item?.caption}
            {item?.year ? <span className="ml-3 text-bone/62">{item.year}</span> : null}
          </p>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={goPrev}
              aria-label="Previous image"
              className="group flex h-12 w-12 items-center justify-center border border-bone/20 text-bone transition-colors duration-500 hover:border-bone/60"
            >
              <ArrowLeft
                className="h-4 w-4 transition-transform duration-[0.55s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-x-1"
                strokeWidth={1.6}
              />
            </button>
            <button
              type="button"
              onClick={goNext}
              aria-label="Next image"
              className="group flex h-12 w-12 items-center justify-center border border-bone/20 text-bone transition-colors duration-500 hover:border-bone/60"
            >
              <ArrowRight
                className="h-4 w-4 transition-transform duration-[0.55s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1"
                strokeWidth={1.6}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
