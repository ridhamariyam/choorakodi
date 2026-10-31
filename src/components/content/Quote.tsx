import { TextReveal } from "@/components/animation/TextReveal";
import { SplitHeading } from "@/components/animation/SplitHeading";
import { cn } from "@/lib/utils";

export type QuoteProps = {
  quote: string;
  attribution?: string;
  meta?: string;
  tone?: "light" | "dark";
  className?: string;
  size?: "md" | "lg";
};

/**
 * A pull quote set at display scale. Deliberately not a card — no border, no
 * background, no quotation-mark graphic. The scale does the work.
 */
export function Quote({
  quote,
  attribution,
  meta,
  tone = "light",
  className,
  size = "lg",
}: QuoteProps) {
  return (
    <figure className={cn("m-0", className)}>
      <blockquote>
        <SplitHeading
          as="p"
          face="mono"
          lines={[`“${quote}”`]}
          className={cn(
            size === "lg" ? "text-title sm:text-headline" : "text-title",
            "font-medium tracking-[-0.025em]",
            tone === "light" ? "text-ink" : "text-bone",
          )}
        />
      </blockquote>

      {(attribution || meta) && (
        <TextReveal delay={0.15} y={14}>
          <figcaption className="mt-8 flex flex-wrap items-baseline gap-x-5 gap-y-2">
            {attribution ? (
              <span
                className={cn(
                  "text-meta-lg font-medium uppercase",
                  tone === "light" ? "text-ink" : "text-bone",
                )}
              >
                {attribution}
              </span>
            ) : null}
            {meta ? (
              <span className={cn("eyebrow", tone === "light" ? "text-muted" : "text-bone/62")}>
                {meta}
              </span>
            ) : null}
          </figcaption>
        </TextReveal>
      )}
    </figure>
  );
}
