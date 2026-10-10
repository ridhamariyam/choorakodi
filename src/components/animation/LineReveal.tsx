"use client";

import { useRef } from "react";
import { useGsap } from "@/hooks/useGsap";
import { cn } from "@/lib/utils";

export type LineRevealProps = {
  className?: string;
  /** Matches the surrounding ground. */
  tone?: "light" | "dark";
  delay?: number;
  duration?: number;
};

/**
 * A hairline rule that draws itself in from the left. Used as a section
 * divider — the smallest unit of motion on the site.
 */
export function LineReveal({
  className,
  tone = "light",
  delay = 0,
  duration = 1.4,
}: LineRevealProps) {
  const scope = useRef<HTMLDivElement>(null);

  useGsap(
    ({ gsap, root, reduced }) => {
      if (reduced) return;
      gsap.set(root, { scaleX: 0, transformOrigin: "left center" });
      gsap.to(root, {
        scaleX: 1,
        duration,
        delay,
        ease: "power3.inOut",
        scrollTrigger: { trigger: root, start: "top 92%", once: true },
      });
    },
    [delay, duration],
    { scope },
  );

  return (
    <div
      ref={scope}
      aria-hidden="true"
      className={cn("h-px w-full", tone === "light" ? "bg-ink/14" : "bg-bone/18", className)}
    />
  );
}
