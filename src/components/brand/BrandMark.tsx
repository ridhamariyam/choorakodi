import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";
import { emblemArt, logoBox, wordmarkArt } from "./logoArt";

/**
 * `brand` is the official artwork as supplied: teal figure and lettering,
 * sand ornament — for light grounds. `reverse` swaps the teal for white so
 * the logo holds on dark photographs and the ink footer; the sand stays.
 * `mono` is all white, for sand or teal grounds where the sand would vanish.
 */
export type LogoTone = "brand" | "reverse" | "mono";

const toneStyle: Record<LogoTone, CSSProperties | undefined> = {
  brand: undefined,
  reverse: { "--logo-primary": "#ffffff" } as CSSProperties,
  mono: { "--logo-primary": "#ffffff", "--logo-accent": "#ffffff", "--logo-accent-2": "#ffffff" } as CSSProperties,
};

/**
 * The Choorakkodi emblem — crossed spears and swords around the leaping
 * figure, from the official logo. Used where the full lockup will not fit.
 *
 * Size comes from the caller. The default is set with the SVG's `width`/
 * `height` geometry attributes rather than base utility classes, because a
 * base `h-full w-full` competes with the caller's `h-10 w-10` in the
 * stylesheet and can win — which silently inflates the mark to its
 * container's full width.
 */
export function BrandMark({ className, tone = "brand" }: { className?: string; tone?: LogoTone }) {
  return (
    <svg
      viewBox={logoBox.emblem}
      width="1em"
      height="1em"
      aria-hidden="true"
      focusable="false"
      className={cn("block shrink-0", className)}
      style={toneStyle[tone]}
      dangerouslySetInnerHTML={{ __html: emblemArt }}
    />
  );
}

/**
 * The full horizontal lockup — emblem, CHOORAKKODI and MARTIAL ARTS ACADEMY —
 * exactly as the official logo-horizontal.svg. Height comes from the caller;
 * width follows the artwork's proportions.
 */
export function Wordmark({ className, tone = "brand" }: { className?: string; tone?: LogoTone }) {
  return (
    <svg
      viewBox={logoBox.lockup}
      aria-hidden="true"
      focusable="false"
      className={cn("block h-10 w-auto shrink-0", className)}
      style={toneStyle[tone]}
      dangerouslySetInnerHTML={{ __html: emblemArt + wordmarkArt }}
    />
  );
}
