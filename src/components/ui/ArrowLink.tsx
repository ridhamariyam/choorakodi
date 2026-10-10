"use client";

import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";
import { TransitionLink } from "@/components/animation/PageTransition";
import { cn } from "@/lib/utils";

export type ArrowLinkProps = {
  href: string;
  children: ReactNode;
  className?: string;
  /** Larger type for standalone section CTAs. */
  size?: "sm" | "md" | "lg";
  tone?: "ink" | "bone" | "soil" | "green";
};

const sizeClasses = {
  sm: "text-meta gap-2.5",
  md: "text-meta-lg gap-3",
  lg: "text-sm gap-3.5 sm:text-base",
} as const;

const toneClasses = {
  ink: "text-ink",
  bone: "text-bone",
  soil: "text-soil",
  green: "text-green",
} as const;

/**
 * The site's standard forward link.
 *
 * On hover the arrow travels right out of its slot while a second arrow
 * arrives from the left — one continuous rightward motion rather than a
 * bounce. The slot is `overflow-hidden` and exactly one character wide, so
 * nothing around the link shifts.
 */
export function ArrowLink({
  href,
  children,
  className,
  size = "md",
  tone = "ink",
}: ArrowLinkProps) {
  return (
    <TransitionLink
      href={href}
      className={cn(
        "group/arrow inline-flex items-center font-medium uppercase",
        sizeClasses[size],
        toneClasses[tone],
        className,
      )}
    >
      <span className="relative">
        {children}
        <span
          aria-hidden="true"
          className="absolute -bottom-1 left-0 h-px w-full origin-right scale-x-0 bg-current transition-transform duration-[0.55s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/arrow:origin-left group-hover/arrow:scale-x-100 group-focus-visible/arrow:origin-left group-focus-visible/arrow:scale-x-100"
        />
      </span>
      <ArrowSlot />
    </TransitionLink>
  );
}

/** The two-arrow slot, shared by ArrowLink and Button. */
export function ArrowSlot({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn("relative block w-[1em] shrink-0 overflow-hidden", className)}
    >
      <span className="flex w-[2em] -translate-x-[1em] transition-transform duration-[0.55s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/arrow:translate-x-0 group-focus-visible/arrow:translate-x-0">
        <ArrowRight className="h-[1em] w-[1em] shrink-0" strokeWidth={1.75} />
        <ArrowRight className="h-[1em] w-[1em] shrink-0" strokeWidth={1.75} />
      </span>
    </span>
  );
}
