import { ArrowUpRight, MapPin } from "lucide-react";
import { TransitionLink } from "@/components/animation/PageTransition";
import { Figure } from "@/components/content/Figure";
import { formatEventDate, type AcademyEvent } from "@/data/events";
import { cn } from "@/lib/utils";

export type EventCardProps = {
  event: AcademyEvent;
  /** "feature" is the large treatment used for the next upcoming event. */
  variant?: "feature" | "row";
  tone?: "light" | "dark";
};

/**
 * One event. The date is set as a typographic block rather than a badge — day
 * over month, which is how a poster would print it.
 */
export function EventCard({ event, variant = "row", tone = "light" }: EventCardProps) {
  const { day, month, year } = formatEventDate(event.date);
  const dark = tone === "dark";
  const href = `/events/${event.slug}`;

  if (variant === "feature") {
    return (
      <article className="group/card">
        <TransitionLink href={href} className="block">
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-7">
              <Figure
                slot={event.image}
                ratio="16 / 10"
                tone={dark ? "ink" : "bone"}
                interactive
                sizes="(max-width: 1024px) 92vw, 56vw"
              />
            </div>

            <div className="lg:col-span-5 lg:self-center">
              <DateBlock day={day} month={month} year={year} dark={dark} size="lg" />

              <h3
                className={cn(
                  "mt-8 text-headline font-semibold tracking-[-0.033em]",
                  "transition-transform duration-[0.7s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/card:translate-x-2",
                  dark ? "text-bone" : "text-ink",
                )}
              >
                {event.title}
              </h3>

              <Meta location={event.location} dark={dark} className="mt-6" />

              <p className={cn("measure mt-7 text-lead", dark ? "text-bone/62" : "text-ink/72")}>
                {event.summary}
              </p>

              {event.isPlaceholder ? <PlaceholderTag dark={dark} /> : null}

              <span
                className={cn(
                  "group/arrow mt-9 inline-flex items-center gap-3 text-meta font-medium uppercase tracking-[0.18em]",
                  dark ? "text-bone" : "text-ink",
                )}
              >
                View event
                <ArrowUpRight
                  className="h-4 w-4 transition-transform duration-[0.55s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/card:translate-x-1 group-hover/card:-translate-y-1"
                  strokeWidth={1.7}
                />
              </span>
            </div>
          </div>
        </TransitionLink>
      </article>
    );
  }

  return (
    <article className="group/card">
      <TransitionLink
        href={href}
        className={cn(
          "grid items-center gap-8 border-t py-10 md:grid-cols-12 md:gap-8",
          dark ? "border-bone/14" : "border-ink/12",
        )}
      >
        <div className="md:col-span-2">
          <DateBlock day={day} month={month} year={year} dark={dark} size="sm" />
        </div>

        <div className="md:col-span-3">
          <Figure
            slot={event.image}
            ratio="4 / 3"
            tone={dark ? "ink" : "bone"}
            interactive
            sizes="(max-width: 768px) 92vw, 22vw"
          />
        </div>

        <div className="md:col-span-6">
          <h3
            className={cn(
              "text-title font-semibold tracking-[-0.024em]",
              "transition-transform duration-[0.7s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/card:translate-x-2",
              dark ? "text-bone" : "text-ink",
            )}
          >
            {event.title}
          </h3>
          <Meta location={event.location} dark={dark} className="mt-4" />
          <p
            className={cn(
              "measure mt-4 text-[0.9375rem] leading-relaxed",
              dark ? "text-bone/58" : "text-ink/68",
            )}
          >
            {event.summary}
          </p>
          {event.isPlaceholder ? <PlaceholderTag dark={dark} /> : null}
        </div>

        <div className="hidden justify-end md:col-span-1 md:flex">
          <ArrowUpRight
            className={cn(
              "h-6 w-6 transition-transform duration-[0.7s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/card:translate-x-1 group-hover/card:-translate-y-1",
              dark ? "text-bone/62" : "text-ink/62",
            )}
            strokeWidth={1.3}
          />
        </div>
      </TransitionLink>
    </article>
  );
}

function DateBlock({
  day,
  month,
  year,
  dark,
  size,
}: {
  day: string;
  month: string;
  year: string;
  dark: boolean;
  size: "sm" | "lg";
}) {
  return (
    <p className={cn("flex items-baseline gap-3", size === "lg" && "flex-col gap-1")}>
      <span
        className={cn(
          "font-semibold leading-none tracking-[-0.045em]",
          size === "lg" ? "text-display" : "text-[2.25rem]",
          dark ? "text-bone" : "text-ink",
        )}
      >
        {day}
      </span>
      <span className={cn("eyebrow", dark ? "text-soil-ink" : "text-soil-ink")}>
        {month} {year}
      </span>
    </p>
  );
}

function Meta({
  location,
  dark,
  className,
}: {
  location: string;
  dark: boolean;
  className?: string;
}) {
  return (
    <p
      className={cn(
        "flex items-center gap-2.5 text-meta uppercase tracking-[0.18em]",
        dark ? "text-bone/62" : "text-muted",
        className,
      )}
    >
      <MapPin className="h-3.5 w-3.5 shrink-0" strokeWidth={1.7} />
      {location}
    </p>
  );
}

/** Placeholder events must never be mistaken for scheduled ones. */
function PlaceholderTag({ dark }: { dark: boolean }) {
  return (
    <span
      className={cn(
        "mt-5 inline-block border-l pl-4 text-meta uppercase tracking-[0.18em]",
        dark ? "border-soil/45 text-soil-ink" : "border-soil/60 text-soil-ink",
      )}
    >
      Placeholder — not a scheduled event
    </span>
  );
}
