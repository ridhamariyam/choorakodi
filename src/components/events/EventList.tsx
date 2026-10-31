"use client";

import { useMemo, useRef, useState } from "react";
import { CalendarX } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { EventCard } from "./EventCard";
import { WhatsAppButton } from "@/components/contact/WhatsAppButton";
import { LineReveal } from "@/components/animation/LineReveal";
import type { AcademyEvent } from "@/data/events";
import { cn } from "@/lib/utils";

type Filter = "Upcoming" | "Past";

export type EventListProps = {
  upcoming: AcademyEvent[];
  past: AcademyEvent[];
};

/**
 * Event listing with Upcoming / Past filters.
 *
 * Upcoming is the default and the first entry gets the feature treatment,
 * because a listing where the next event looks the same as one from two years
 * ago is a listing that has stopped doing its job.
 */
export function EventList({ upcoming, past }: EventListProps) {
  const [filter, setFilter] = useState<Filter>(upcoming.length > 0 ? "Upcoming" : "Past");
  const scope = useRef<HTMLDivElement>(null);

  const items = useMemo(() => (filter === "Upcoming" ? upcoming : past), [filter, upcoming, past]);

  // `revision` re-runs the reveal when the filter swaps the list.
  useScrollReveal(scope, { selector: "[data-event]", y: 26, revision: filter });

  return (
    <div>
      <div
        role="group"
        aria-label="Filter events"
        className="flex flex-wrap items-center gap-1 border-y border-ink/12 py-4"
      >
        {(["Upcoming", "Past"] as Filter[]).map((option) => {
          const count = option === "Upcoming" ? upcoming.length : past.length;
          const isActive = filter === option;
          return (
            <button
              key={option}
              type="button"
              onClick={() => setFilter(option)}
              aria-pressed={isActive}
              className={cn(
                "px-4 py-2 text-meta font-medium uppercase tracking-[0.18em] transition-colors duration-500",
                isActive ? "bg-ink text-bone" : "text-muted hover:text-ink",
              )}
            >
              {option}
              <span className={cn("ml-2", isActive ? "text-bone/62" : "text-muted/60")}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      <div ref={scope} className="mt-16">
        {items.length === 0 ? (
          <EmptyState filter={filter} />
        ) : (
          <>
            {filter === "Upcoming" && items[0] ? (
              <div data-event className="mb-20">
                <EventCard event={items[0]} variant="feature" />
              </div>
            ) : null}

            <div>
              {(filter === "Upcoming" ? items.slice(1) : items).map((event) => (
                <div key={event.slug} data-event>
                  <EventCard event={event} variant="row" />
                </div>
              ))}
              <LineReveal />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/** Elegant rather than apologetic — an empty calendar is a normal state. */
function EmptyState({ filter }: { filter: Filter }) {
  return (
    <div className="border-y border-ink/12 py-24 text-center md:py-32">
      <CalendarX className="mx-auto h-8 w-8 text-soil-ink" strokeWidth={1.2} />
      <p className="eyebrow mt-8 text-muted">
        {filter === "Upcoming" ? "Nothing scheduled" : "No past events recorded"}
      </p>
      <p className="mx-auto mt-6 max-w-md text-lead text-ink/70">
        {filter === "Upcoming"
          ? "There are no events on the calendar at the moment. Demonstrations and gatherings are announced here first."
          : "Past events will be archived here once the academy has held and recorded them."}
      </p>
      <div className="mt-10 flex justify-center">
        <WhatsAppButton
          label="Ask about events"
          message="Hello Choorakkodi — I would like to hear about upcoming events."
          variant="outline"
          size="md"
          className="text-ink"
        />
      </div>
    </div>
  );
}
