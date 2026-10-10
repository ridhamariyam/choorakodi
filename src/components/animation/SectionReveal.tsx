"use client";

import { useRef, type ReactNode } from "react";
import { useScrollReveal, type ScrollRevealOptions } from "@/hooks/useScrollReveal";
import { useGsap } from "@/hooks/useGsap";
import { animateStorySection } from "@/components/story/motion";
import { cn } from "@/lib/utils";

export type SectionTone = "bone" | "ink" | "green" | "wenge";

const toneClasses: Record<SectionTone, string> = {
  bone: "bg-bone text-ink",
  // The whole site is set on white: former dark tones flip to dark-on-white.
  ink: "tone-flip",
  green: "tone-flip",
  wenge: "tone-flip",
};

/** The navigation reads this to decide whether to render light or dark. */
const navTheme: Record<SectionTone, "light" | "dark"> = {
  bone: "light",
  ink: "light",
  green: "light",
  wenge: "light",
};

export type SectionRevealProps = {
  children: ReactNode;
  tone?: SectionTone;
  id?: string;
  className?: string;
  /** Vertical rhythm. "none" when the section manages its own spacing. */
  spacing?: "none" | "sm" | "md" | "lg" | "xl";
  /** Apply the film grain. Dark and archival surfaces only. */
  grain?: boolean;
  reveal?: ScrollRevealOptions;
  /** Rendered as <div> when the section is nested inside another <section>. */
  as?: "section" | "div";
  "aria-labelledby"?: string;
};

const spacingClasses = {
  none: "",
  sm: "py-14 md:py-20",
  md: "py-20 md:py-32",
  lg: "py-24 md:py-40",
  xl: "py-28 md:py-52",
} as const;

/**
 * The standard section shell: ground tone, vertical rhythm, the nav-theme
 * signal, and one batched scroll reveal for every `data-reveal` descendant.
 * It also carries the homepage chronicle into every page: typewriter type,
 * scroll-lit words, drawn trails and sliding mega lines.
 *
 * Children stay server-rendered — this component only wraps them.
 */
export function SectionReveal({
  children,
  tone = "bone",
  id,
  className,
  spacing = "lg",
  grain = false,
  reveal,
  as: Tag = "section",
  ...rest
}: SectionRevealProps) {
  const scope = useRef<HTMLElement>(null);
  useScrollReveal(scope, reveal);
  useGsap(({ gsap, root }) => animateStorySection({ gsap, root }), [], {
    scope,
    skipOnReducedMotion: true,
  });

  return (
    <Tag
      ref={scope as React.Ref<HTMLElement & HTMLDivElement>}
      id={id}
      data-nav-theme={navTheme[tone]}
      data-theme={navTheme[tone]}
      data-story-scope
      className={cn(
        "story-type relative w-full",
        toneClasses[tone],
        spacingClasses[spacing],
        grain && "grain",
        className,
      )}
      {...rest}
    >
      {children}
    </Tag>
  );
}
