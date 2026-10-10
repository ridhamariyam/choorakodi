import { ScrollWords } from "@/components/story/Caption";
import { faceStyle, monoStyle } from "@/components/story/fonts";
import { cn } from "@/lib/utils";

export type EditorialTextProps = {
  paragraphs: string[];
  className?: string;
  tone?: "light" | "dark";
  size?: "body" | "lead";
  /** Drop cap on the first paragraph. Used sparingly, on page openings. */
  lead?: boolean;
  /** Kept for existing callers; words now light in reading order instead. */
  stagger?: number;
};

/**
 * Body copy at a comfortable measure, set in the chronicle's typewriter face.
 * Words start dim and light up in reading order as the paragraph scrolls
 * through the viewport (driven by the enclosing SectionReveal).
 */
export function EditorialText({
  paragraphs,
  className,
  tone = "light",
  size = "lead",
  lead = false,
}: EditorialTextProps) {
  return (
    <div className={cn("measure space-y-6", className)} style={monoStyle}>
      {paragraphs.map((text, index) => (
        <p
          key={index}
          data-scrub-text
          className={cn(
            size === "lead" ? "text-lead" : "text-body",
            "font-medium",
            tone === "light" ? "text-[#1f1d1e]" : "text-bone",
          )}
        >
          {lead && index === 0 ? (
            // ::first-letter can't reach into the word spans, so the drop cap
            // is its own element, set in the chronicle's Bodoni.
            <>
              <span
                style={faceStyle.bodoni}
                className="float-left mr-3 mt-[0.06em] text-[3.4em] leading-[0.78] text-green"
              >
                {text.charAt(0)}
              </span>
              <ScrollWords text={text.slice(1)} />
            </>
          ) : (
            <ScrollWords text={text} />
          )}
        </p>
      ))}
    </div>
  );
}
