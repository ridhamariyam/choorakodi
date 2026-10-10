"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/hooks/useReducedMotion";
import { useLenis } from "@/hooks/useLenis";
import { TransitionLink } from "@/components/animation/PageTransition";
import { Figure } from "@/components/content/Figure";
import { WhatsAppButton } from "@/components/contact/WhatsAppButton";
import { formatLocality } from "@/data/site";
import { usePrimaryNav, useSite } from "@/components/content/ContentProvider";
import { slot } from "@/data/assets";
import { cn } from "@/lib/utils";

const menuImage = slot("KALARI IMAGE", "The Choorakkodi kalari", {
  brief: "public/images/hero — the menu's standing image",
});

const FOCUSABLE =
  'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])';

export type MenuOverlayProps = {
  open: boolean;
  onClose: () => void;
};

/**
 * Fullscreen menu.
 *
 * Reveal is a clip-path wipe with the items staggering up out of their masks;
 * closing runs the same movement in reverse rather than a separate effect, so
 * open and close feel like one gesture.
 *
 * Accessibility: modal dialog semantics, Escape to close, a focus trap, focus
 * restored to the trigger on close, and `inert` while hidden so the twelve
 * links are not reachable by keyboard behind the page.
 */
export function MenuOverlay({ open, onClose }: MenuOverlayProps) {
  const pathname = usePathname();
  const site = useSite();
  const primaryNav = usePrimaryNav();
  const rootRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const previousFocus = useRef<HTMLElement | null>(null);
  const { stop, start } = useLenis();
  /** Guards the paired stop()/start() so they can never fall out of balance. */
  const lockedRef = useRef(false);

  // --- open / close animation -------------------------------------------
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const items = gsap.utils.toArray<HTMLElement>("[data-menu-item] > span", root);
    const meta = gsap.utils.toArray<HTMLElement>("[data-menu-meta]", root);
    const reduced = prefersReducedMotion();

    timelineRef.current?.kill();

    if (open) {
      previousFocus.current = document.activeElement as HTMLElement | null;

      if (reduced) {
        gsap.set(root, { autoAlpha: 1, clipPath: "none" });
        gsap.set([...items, ...meta], { autoAlpha: 1, yPercent: 0 });
      } else {
        const tl = gsap.timeline();
        timelineRef.current = tl;
        gsap.set(root, { autoAlpha: 1 });
        tl.fromTo(
          root,
          { clipPath: "inset(0% 0% 100% 0%)" },
          { clipPath: "inset(0% 0% 0% 0%)", duration: 0.85, ease: "power4.inOut" },
        )
          .fromTo(
            items,
            { yPercent: 112 },
            { yPercent: 0, duration: 0.9, stagger: 0.045, ease: "power4.out" },
            0.28,
          )
          .fromTo(meta, { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.06 }, 0.5);
      }

      // Focus the panel itself, not the first link — announcing the dialog
      // before its contents is the expected behaviour.
      window.requestAnimationFrame(() => panelRef.current?.focus());
      return;
    }

    // Closing. Skip the animation entirely on first render.
    if (root.style.visibility !== "visible") {
      gsap.set(root, { autoAlpha: 0 });
      return;
    }

    if (reduced) {
      gsap.set(root, { autoAlpha: 0 });
      return;
    }

    const tl = gsap.timeline();
    timelineRef.current = tl;
    tl.to(items, { yPercent: -112, duration: 0.5, stagger: 0.025, ease: "power3.in" })
      .to(meta, { autoAlpha: 0, duration: 0.3 }, 0)
      .to(
        root,
        {
          clipPath: "inset(0% 0% 100% 0%)",
          duration: 0.7,
          ease: "power4.inOut",
          onComplete: () => gsap.set(root, { autoAlpha: 0 }),
        },
        0.18,
      );
  }, [open]);

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

  // Release the lock if the component unmounts while open.
  useEffect(
    () => () => {
      if (lockedRef.current) {
        lockedRef.current = false;
        start();
      }
      timelineRef.current?.kill();
    },
    [start],
  );

  // --- keyboard ----------------------------------------------------------
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== "Tab") return;

      const root = rootRef.current;
      if (!root) return;
      const focusable = Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (el) => el.offsetParent !== null,
      );
      if (focusable.length === 0) return;

      const first = focusable[0]!;
      const last = focusable[focusable.length - 1]!;
      const active = document.activeElement;

      if (event.shiftKey && (active === first || active === panelRef.current)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  // Restore focus to whatever opened the menu.
  useEffect(() => {
    if (open) return;
    previousFocus.current?.focus?.();
  }, [open]);

  return (
    <div
      ref={rootRef}
      className="tone-flip fixed inset-0 z-[150] invisible opacity-0"
      style={{ clipPath: "inset(0% 0% 100% 0%)" }}
      // `inert` keeps the twelve links out of the tab order while hidden.
      {...(!open ? { inert: true } : {})}
      aria-hidden={!open}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        tabIndex={-1}
        data-lenis-prevent
        className="h-full w-full overflow-y-auto overscroll-contain outline-none"
      >
        <div className="gutter mx-auto flex min-h-full w-full max-w-[110rem] flex-col pb-14 pt-6">
          {/* Bar matching the navbar, so the close button lands where MENU was. */}
          <div className="flex items-center justify-between py-4">
            <span className="eyebrow text-bone/45">{formatLocality(site)}</span>
            <button
              type="button"
              onClick={onClose}
              className="group/arrow -mr-2 flex items-center gap-2.5 px-2 py-2 text-bone"
            >
              <span className="text-meta font-medium uppercase tracking-[0.18em]">Close</span>
              <X
                className="h-4 w-4 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/arrow:rotate-90"
                strokeWidth={1.6}
              />
            </button>
          </div>

          <div className="grid flex-1 items-center gap-12 py-10 lg:grid-cols-12 lg:gap-16 lg:py-6">
            {/* Navigation list */}
            <nav aria-label="Main" className="lg:col-span-7 xl:col-span-6">
              <ul className="m-0 list-none p-0">
                {primaryNav.map((item, index) => {
                  const isActive =
                    item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

                  return (
                    <li key={item.href} className="group/item">
                      <TransitionLink
                        href={item.href}
                        onClick={onClose}
                        aria-current={isActive ? "page" : undefined}
                        className="flex items-baseline gap-5 py-[0.28em] sm:gap-8"
                      >
                        <span className="eyebrow w-7 shrink-0 text-soil/55 transition-colors duration-500 group-hover/item:text-soil">
                          {String(index + 1).padStart(2, "0")}
                        </span>

                        <span
                          data-menu-item
                          className="line-mask relative flex-1 overflow-hidden"
                        >
                          <span
                            className={cn(
                              "block text-[clamp(1.6rem,4.1vw,3.1rem)] font-medium leading-[1.06] tracking-[-0.03em]",
                              "transition-[color,transform] duration-[0.6s] ease-[cubic-bezier(0.22,1,0.36,1)]",
                              "group-hover/item:translate-x-2 group-hover/item:text-soil",
                              isActive ? "text-bone" : "text-bone/78",
                            )}
                          >
                            {item.label}
                          </span>
                        </span>

                        {item.meta ? (
                          <span className="eyebrow hidden shrink-0 text-bone/25 transition-colors duration-500 group-hover/item:text-bone/55 sm:block">
                            {item.meta}
                          </span>
                        ) : null}
                      </TransitionLink>
                    </li>
                  );
                })}
              </ul>
            </nav>

            {/* Standing image + contact */}
            <div className="lg:col-span-5 lg:col-start-8">
              <div data-menu-meta>
                <Figure
                  slot={menuImage}
                  ratio="4 / 5"
                  tone="ink"
                  sizes="(max-width: 1024px) 90vw, 32vw"
                  className="hidden lg:block"
                />
              </div>

              <div data-menu-meta className="mt-0 lg:mt-10">
                <p className="eyebrow mb-4 text-bone/40">Get in touch</p>
                <p className="text-lead text-bone/70">
                  {site.name}
                  <span className="block text-bone/45">{formatLocality(site)}</span>
                </p>
                <div className="mt-7">
                  <WhatsAppButton
                    label="WhatsApp us"
                    message="Hello Choorakkodi — I would like to know more about training."
                    variant="bone"
                    size="md"
                  />
                </div>
              </div>
            </div>
          </div>

          <div
            data-menu-meta
            className="flex flex-wrap items-center justify-between gap-4 border-t border-bone/12 pt-7"
          >
            <span className="eyebrow text-bone/35">
              © {new Date().getFullYear()} {site.name}
            </span>
            <span className="eyebrow text-bone/35">{site.tagline}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
