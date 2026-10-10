import type { CaptionLine } from "@/data/story";

/**
 * Conversions between the admin's plain-text fields and the structures the
 * components render. Each pair round-trips, which is what lets the seed script
 * write today's content into the CMS and read it back unchanged.
 */

/** "one\ntwo" ⇄ ["one", "two"] — headings split over lines, bullet lists. */
export function toLines(text: string | null | undefined): string[] {
  return (text ?? "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

export function fromLines(lines: readonly string[]): string {
  return lines.join("\n");
}

/** Paragraphs separated by a blank line. */
export function toParagraphs(text: string | null | undefined): string[] {
  return (text ?? "")
    .split(/\n\s*\n/)
    .map((p) => p.replace(/\s*\n\s*/g, " ").trim())
    .filter(Boolean);
}

export function fromParagraphs(paragraphs: readonly string[]): string {
  return paragraphs.join("\n\n");
}

/** One caption line per row; **double asterisks** mark bold runs. */
export function toCaption(text: string | null | undefined): CaptionLine[] {
  return (text ?? "")
    .split("\n")
    .filter((line) => line.trim().length > 0)
    .map((line) =>
      line
        .split(/(\*\*[^*]+\*\*)/)
        .filter(Boolean)
        .map((part) =>
          part.startsWith("**") && part.endsWith("**")
            ? { text: part.slice(2, -2), bold: true }
            : { text: part },
        ),
    );
}

export function fromCaption(caption: readonly CaptionLine[]): string {
  return caption
    .map((line) => line.map((seg) => (seg.bold ? `**${seg.text}**` : seg.text)).join(""))
    .join("\n");
}

/** Empty admin fields come back as null; the components expect strings. */
export function str(value: string | null | undefined, fallback = ""): string {
  return value ?? fallback;
}
