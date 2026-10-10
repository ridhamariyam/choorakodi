import { SplitHeading } from "@/components/animation/SplitHeading";
import { TextReveal } from "@/components/animation/TextReveal";
import { LineReveal } from "@/components/animation/LineReveal";
import { faceFor } from "@/components/story/fonts";
import { cn } from "@/lib/utils";

export type SectionHeadingProps = {
  eyebrow?: string;
  /** Section number, e.g. "01". Printed opposite the eyebrow. */
  index?: string;
  lines: string[];
  /** Reading text, when the visual line breaks differ from it. */
  label?: string;
  as?: "h1" | "h2";
  id?: string;
  size?: "display" | "headline" | "mega";
  tone?: "light" | "dark";
  className?: string;
  headingClassName?: string;
  /** Hairline rule above the block. */
  rule?: boolean;
  align?: "left" | "right";
};

const sizeClasses = {
  mega: "text-mega",
  display: "text-display",
  headline: "text-headline",
} as const;

/**
 * The standard section opening: metadata line, hairline, oversized heading.
 * Keeping it in one component is what makes the pages feel like one site.
 */
export function SectionHeading({
  eyebrow,
  index,
  lines,
  label,
  as = "h2",
  id,
  size = "display",
  tone = "light",
  className,
  headingClassName,
  rule = true,
  align = "left",
}: SectionHeadingProps) {
  return (
    <div className={cn(align === "right" && "text-right", className)}>
      {rule ? <LineReveal tone={tone} className="mb-6" /> : null}

      {(eyebrow || index) && (
        <TextReveal
          className={cn(
            "mb-10 flex items-baseline gap-6 sm:mb-14",
            align === "right" && "justify-end",
          )}
          y={16}
        >
          {index ? (
            <span className={cn("eyebrow", tone === "light" ? "text-soil" : "text-soil/85")}>
              {index}
            </span>
          ) : null}
          {eyebrow ? (
            <span className={cn("eyebrow", tone === "light" ? "text-muted" : "text-bone/55")}>
              {eyebrow}
            </span>
          ) : null}
        </TextReveal>
      )}

      <SplitHeading
        as={as}
        face={faceFor(index ?? lines.join(" "))}
        id={id}
        lines={lines}
        label={label}
        className={cn(sizeClasses[size], headingClassName)}
      />
    </div>
  );
}
