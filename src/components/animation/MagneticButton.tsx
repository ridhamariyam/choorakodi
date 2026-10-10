"use client";

import { useRef, type ReactNode } from "react";
import { useGsap } from "@/hooks/useGsap";
import { cn } from "@/lib/utils";

export type MagneticButtonProps = {
  children: ReactNode;
  className?: string;
  /** How far the element may be pulled from rest, in px. */
  strength?: number;
};

/**
 * Pulls its child a little towards the cursor and releases it on exit.
 *
 * Uses gsap.quickTo, which reuses one tween instead of allocating a new one
 * per pointer event — the difference is visible on a 120Hz trackpad. Skipped
 * on coarse pointers, where there is no cursor to be magnetic towards.
 */
export function MagneticButton({ children, className, strength = 14 }: MagneticButtonProps) {
  const scope = useRef<HTMLSpanElement>(null);

  useGsap(
    ({ gsap, root, cleanup }) => {
      if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

      const inner = root.firstElementChild as HTMLElement | null;
      if (!inner) return;

      const xTo = gsap.quickTo(inner, "x", { duration: 0.5, ease: "power3.out" });
      const yTo = gsap.quickTo(inner, "y", { duration: 0.5, ease: "power3.out" });

      const onMove = (event: PointerEvent) => {
        const rect = root.getBoundingClientRect();
        const dx = event.clientX - (rect.left + rect.width / 2);
        const dy = event.clientY - (rect.top + rect.height / 2);
        xTo(gsap.utils.clamp(-strength, strength, dx * 0.35));
        yTo(gsap.utils.clamp(-strength, strength, dy * 0.45));
      };

      const onLeave = () => {
        xTo(0);
        yTo(0);
      };

      root.addEventListener("pointermove", onMove);
      root.addEventListener("pointerleave", onLeave);
      // A keyboard user never fires pointerleave; reset on blur too.
      root.addEventListener("focusout", onLeave);

      cleanup(() => {
        root.removeEventListener("pointermove", onMove);
        root.removeEventListener("pointerleave", onLeave);
        root.removeEventListener("focusout", onLeave);
      });
    },
    [strength],
    { scope, skipOnReducedMotion: true },
  );

  return (
    <span ref={scope} className={cn("inline-block", className)}>
      <span className="inline-block will-change-transform">{children}</span>
    </span>
  );
}
