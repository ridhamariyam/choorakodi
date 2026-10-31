import Image from "next/image";
import type { ImageSlot } from "@/data/assets";
import { cn } from "@/lib/utils";

type Tone = "bone" | "ink" | "green" | "wenge";

const toneStyles: Record<Tone, { surface: string; rule: string; text: string }> = {
  bone: { surface: "bg-bone-dim", rule: "border-ink/12", text: "text-muted" },
  ink: { surface: "bg-ink-soft", rule: "border-bone/14", text: "text-bone/62" },
  green: { surface: "bg-green-deep", rule: "border-bone/16", text: "text-bone/62" },
  wenge: { surface: "bg-wenge", rule: "border-bone/14", text: "text-soil-ink" },
};

export type FigureProps = {
  slot: ImageSlot;
  /** CSS aspect-ratio, e.g. "3 / 4". Ignored when the parent sets a height. */
  ratio?: string;
  tone?: Tone;
  className?: string;
  /** next/image `sizes`. Always pass a real value — it drives the srcset. */
  sizes?: string;
  priority?: boolean;
  /** Scale-on-hover, for interactive contexts only. */
  interactive?: boolean;
  caption?: string;
  /** Small archival index printed in the corner, e.g. "01" or "1972". */
  index?: string;
};

/**
 * One image slot.
 *
 * With `slot.src` set it renders an optimised next/image. Without one it
 * renders a composed placeholder that belongs to the design rather than
 * looking like a failure — bracketed label, hairline frame, corner index.
 *
 * Dropping a file into /public/images and setting `src` in the data layer is
 * the whole migration path. No component changes.
 */
export function Figure({
  slot,
  ratio,
  tone = "bone",
  className,
  sizes = "(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 40vw",
  priority = false,
  interactive = false,
  caption,
  index,
}: FigureProps) {
  const styles = toneStyles[tone];
  const hasImage = Boolean(slot.src);

  return (
    <figure className={cn("group/fig relative m-0", className)}>
      <div
        className={cn(
          "relative isolate overflow-hidden",
          !hasImage && styles.surface,
          ratio ? undefined : "h-full",
        )}
        style={ratio ? { aspectRatio: ratio } : undefined}
      >
        {hasImage ? (
          <Image
            src={slot.src as string}
            alt={slot.alt}
            fill
            sizes={sizes}
            priority={priority}
            loading={priority ? undefined : "lazy"}
            className={cn(
              "story-print object-cover",
              interactive &&
                "transition-transform duration-[1.2s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/fig:scale-[1.04]",
            )}
          />
        ) : (
          <Placeholder slot={slot} styles={styles} index={index} />
        )}
      </div>

      {caption ? (
        <figcaption className="mt-4 flex items-baseline gap-4">
          {index ? <span className="eyebrow text-soil-ink shrink-0">{index}</span> : null}
          <span className="text-sm leading-relaxed text-muted measure-tight">{caption}</span>
        </figcaption>
      ) : null}
    </figure>
  );
}

function Placeholder({
  slot,
  styles,
  index,
}: {
  slot: ImageSlot;
  styles: { surface: string; rule: string; text: string };
  index?: string;
}) {
  return (
    <div
      className={cn("grain absolute inset-0 flex flex-col justify-between p-4 sm:p-6", styles.text)}
      // Announced to assistive tech as an image slot, with the intended alt
      // text, so screen-reader users are told what will eventually be here.
      role="img"
      aria-label={`Image placeholder — ${slot.alt}`}
    >
      {/* Hairline frame, inset from the edge. */}
      <span
        aria-hidden="true"
        className={cn("pointer-events-none absolute inset-3 border sm:inset-4", styles.rule)}
      />
      {/* Very low-contrast diagonal ruling, so a large empty block still has
          surface rather than reading as a missing asset. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.55]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(135deg, currentColor 0 1px, transparent 1px 14px)",
          maskImage: "radial-gradient(ellipse at center, transparent 30%, black 100%)",
          WebkitMaskImage: "radial-gradient(ellipse at center, transparent 30%, black 100%)",
          opacity: 0.12,
        }}
      />

      <span className="eyebrow relative z-10">{index ?? ""}</span>

      <span className="relative z-10 self-center text-center">
        <span className="eyebrow block">[ {slot.label} ]</span>
      </span>

      <span className="eyebrow relative z-10 self-end">Pending</span>
    </div>
  );
}
