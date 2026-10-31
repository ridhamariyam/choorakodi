import type { CSSProperties } from "react";
import { Anton, Archivo_Black, Cinzel, Inconsolata } from "next/font/google";
import type { StoryChapter } from "@/data/story";

/**
 * Faces of the chronicle. Every heading on the homepage and the rest of the
 * site is set in one face, Archivo Black; body text is the mono. The anton
 * face survives only as the condensed odometer and stamp face.
 */
const mono = Inconsolata({ subsets: ["latin"], weight: ["500", "700"], variable: "--font-story-mono", display: "swap" });
const anton = Anton({ subsets: ["latin"], weight: "400", variable: "--font-story-anton", display: "swap" });
const archivo = Archivo_Black({ subsets: ["latin"], weight: "400", variable: "--font-story-archivo", display: "swap" });
/** Engraved capitals of the sky hero and the preloader (which reads --font-sky-serif). */
const skySerif = Cinzel({ subsets: ["latin"], weight: ["600", "700"], variable: "--font-sky-serif", display: "swap" });

export const storyFontVariables = [mono, anton, archivo, skySerif]
  .map((font) => font.variable)
  .join(" ");

export const monoStyle: CSSProperties = { fontFamily: "var(--font-story-mono), ui-monospace, monospace" };

/** The one heading face, used for every era (as on "The kalari takes shape"). */
const headingStyle: CSSProperties = { fontFamily: "var(--font-story-archivo), sans-serif", fontWeight: 400, letterSpacing: "-0.05em" };

/**
 * Era faces as chapters and pages name them. Every heading is now set in the
 * one face; the names are kept so content and pages need not change.
 */
export const faceStyle: Record<StoryChapter["face"], CSSProperties> = {
  bodoni: headingStyle,
  anton: headingStyle,
  shrikhand: headingStyle,
  archivo: headingStyle,
  unbounded: headingStyle,
  syne: headingStyle,
};

export const serifStyle: CSSProperties = { fontFamily: "var(--font-sky-serif), Georgia, serif" };

/** Condensed face for the odometer and the rubber stamp, which are not headings. */
export const condensedStyle: CSSProperties = { fontFamily: "var(--font-story-anton), sans-serif", fontWeight: 400, letterSpacing: "-0.01em" };

export type StoryFace = StoryChapter["face"];

const FACES: StoryFace[] = ["bodoni", "anton", "shrikhand", "archivo", "unbounded", "syne"];

/** A stable era face for any heading, picked from its text. */
export function faceFor(seed: string): StoryFace {
  let sum = 0;
  for (const char of seed) sum += char.charCodeAt(0);
  return FACES[sum % FACES.length] ?? "bodoni";
}
