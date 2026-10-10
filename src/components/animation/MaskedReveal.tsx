"use client";

import { useRef, type ReactNode } from "react";
import { useGsap } from "@/hooks/useGsap";
import { cn } from "@/lib/utils";

export type MaskedRevealProps = {
  children: ReactNode;
  className?: string;
  /** Edge the mask retreats towards. */
  direction?: "up" | "down" | "left" | "right";
  duration?: number;
  delay?: number;
  start?: string;
};

const closed: Record<NonNullable<MaskedRevealProps["direction"]>, string> = {
  up: "inset(100% 0% 0% 0%)",
  down: "inset(0% 0% 100% 0%)",
  left: "inset(0% 0% 0% 100%)",
  right: "inset(0% 100% 0% 0%)",
};

/**
 * Wipes content into view behind a clip-path mask. Used for images and for
 * any block where a fade would feel insubstantial.
 */
export function MaskedReveal({
  children,
  className,
  direction = "up",
  duration = 1.3,
  delay = 0,
  start = "top 85%",
}: MaskedRevealProps) {
  const scope = useRef<HTMLDivElement>(null);

  useGsap(
    ({ gsap, root, reduced }) => {
      if (reduced) return;
      gsap.set(root, { clipPath: closed[direction] });
      gsap.to(root, {
        clipPath: "inset(0% 0% 0% 0%)",
        duration,
        delay,
        ease: "power3.inOut",
        scrollTrigger: { trigger: root, start, once: true },
      });
    },
    [direction, duration, delay, start],
    { scope },
  );

  return (
    <div ref={scope} className={cn(className)}>
      {children}
    </div>
  );
}
