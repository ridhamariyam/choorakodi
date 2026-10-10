"use client";

import { useRef, type CSSProperties, type ElementType } from "react";
import { SplitText } from "@/lib/gsap";
import { useGsap } from "@/hooks/useGsap";
import { faceFor, faceStyle, monoStyle, type StoryFace } from "@/components/story/fonts";
import { cn } from "@/lib/utils";

export type SplitHeadingProps = {
  /** Explicit line breaks. Each entry becomes its own visual line. */
  lines: string[];
  /**
   * The heading as it should be *read*, when that differs from how the lines
   * are arranged — e.g. lines `["Kalari", "ppayattu."]` reads "Kalarippayattu.".
   * Defaults to the lines joined with spaces.
   */
  label?: string;
  as?: ElementType;
  className?: string;
  id?: string;
  /** Play on mount rather than on scroll. For above-the-fold headings. */
  immediate?: boolean;
  start?: string;
  stagger?: number;
  delay?: number;
  /**
   * Display face, borrowed from the homepage chronicle. Defaults to an era
   * face picked from the text, so each heading keeps the same face on every
   * render; "mono" sets it in the typewriter face.
   */
  face?: StoryFace | "mono";
  style?: CSSProperties;
};

/**
 * The site's display-heading reveal: each line rises out of its own mask.
 *
 * SplitText re-splits on resize (`autoSplit`), so a heading that rewraps at a
 * new breakpoint stays correctly masked. The split is deferred until fonts
 * have settled, because splitting against a fallback face produces line boxes
 * in the wrong places.
 */
export function SplitHeading({
  lines,
  label,
  as: Tag = "h2",
  className,
  id,
  immediate = false,
  start = "top 88%",
  stagger = 0.11,
  delay = 0,
  face,
  style,
}: SplitHeadingProps) {
  const resolved = face ?? faceFor(lines.join(" "));
  const fontStyle = resolved === "mono" ? { ...monoStyle, fontWeight: 500 } : faceStyle[resolved];
  const scope = useRef<HTMLDivElement>(null);

  useGsap(
    ({ gsap, root, reduced, cleanup, context }) => {
      const target = root.querySelector<HTMLElement>("[data-split]");
      if (!target || reduced) return;

      // Hidden before first paint so the un-split text never flashes.
      gsap.set(target, { autoAlpha: 0 });

      let split: SplitText | null = null;
      let cancelled = false;

      const run = () => {
        if (cancelled || !target.isConnected) return;
        context.add(() => {
          gsap.set(target, { autoAlpha: 1 });
          split = SplitText.create(target, {
            type: "lines",
            mask: "lines",
            linesClass: "split-line",
            autoSplit: true,
            onSplit: (self) =>
              gsap.from(self.lines, {
                yPercent: 108,
                duration: 1.15,
                ease: "power4.out",
                stagger,
                delay,
                ...(immediate
                  ? {}
                  : { scrollTrigger: { trigger: target, start, once: true } }),
              }),
          });
        });
      };

      // Don't let a stalled font request keep the heading invisible.
      const timeout = window.setTimeout(run, 1200);
      const fonts = document.fonts;
      if (fonts?.ready) {
        void fonts.ready.then(() => {
          window.clearTimeout(timeout);
          run();
        });
      }

      cleanup(() => {
        cancelled = true;
        window.clearTimeout(timeout);
        split?.revert();
        gsap.set(target, { clearProps: "visibility,opacity" });
      });
    },
    [lines.join("|"), immediate, start, stagger, delay],
    { scope },
  );

  return (
    <div ref={scope} className={cn("relative", className)} style={{ ...fontStyle, ...style }}>
      {/*
        The visual line arrangement is not the reading text: lines break for
        composition, sometimes mid-word. So the heading carries the real
        sentence for assistive tech, and the stack of lines — which would
        otherwise be announced as "What isKalari ppayattu?" — is decorative.
      */}
      <Tag id={id}>
        <span className="sr-only">{label ?? lines.join(" ")}</span>
        <span
          aria-hidden="true"
          data-split
          className="block [&_.split-line]:will-change-transform"
        >
          {lines.map((line, i) => (
            <span key={`${line}-${i}`} className="block">
              {line}
            </span>
          ))}
        </span>
      </Tag>
    </div>
  );
}
