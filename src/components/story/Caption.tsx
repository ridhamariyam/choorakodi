import { Fragment } from "react";
import type { CaptionLine } from "@/data/story";
import { monoStyle } from "./fonts";
import { cn } from "@/lib/utils";

/**
 * Splits text into word spans for the scroll highlight. Spaces stay as plain
 * text between spans so wrapping and copy/paste behave normally.
 */
export function ScrollWords({ text, bold = false }: { text: string; bold?: boolean }) {
  const Tag = bold ? "strong" : "span";
  return (
    <>
      {text.split(/(\s+)/).map((part, i) =>
        part.trim() === "" ? (
          <Fragment key={i}>{part}</Fragment>
        ) : (
          <Tag key={i} data-word className={cn("inline-block", bold && "font-bold")}>
            {part}
          </Tag>
        ),
      )}
    </>
  );
}

/**
 * Typewriter caption. Words start dim and are lit one after another as the
 * caption scrolls through the viewport; key phrases are set bold, as in the
 * reference's period captions.
 */
export function Caption({ lines, className }: { lines: CaptionLine[]; className?: string }) {
  return (
    <p
      data-scrub-text
      style={monoStyle}
      className={cn(
        "mx-auto text-center text-[max(15px,4.4vw)] leading-[1.3] font-medium md:text-[max(15px,1.45vw)] md:leading-[1.35]",
        className,
      )}
    >
      {lines.map((line, i) => (
        <span key={i} className="block">
          {line.map((segment, j) => (
            <ScrollWords key={j} text={segment.text} bold={segment.bold} />
          ))}
        </span>
      ))}
    </p>
  );
}
