import { CalendarDays, Clock, MapPin } from "lucide-react";

import { PageContainer } from "@/components/layout/PageContainer";
import { SectionReveal } from "@/components/animation/SectionReveal";
import { SplitHeading } from "@/components/animation/SplitHeading";
import { TextReveal } from "@/components/animation/TextReveal";
import { ScaleImage } from "@/components/animation/ScaleImage";
import { ImageReveal } from "@/components/animation/ImageReveal";
import { LineReveal } from "@/components/animation/LineReveal";
import { PendingCopy } from "@/components/content/PendingCopy";
import { WhatsAppButton } from "@/components/contact/WhatsAppButton";
import { EventCard } from "./EventCard";
import { formatEventDate, type AcademyEvent } from "@/data/events";

export function EventDetail({
  event,
  related,
}: {
  event: AcademyEvent;
  related: AcademyEvent[];
}) {
  const { day, month, year } = formatEventDate(event.date);

  return (
    <>
      {/* Hero ------------------------------------------------------------- */}
      <SectionReveal
        tone="ink"
        grain
        spacing="none"
        className="pb-16 pt-40 md:pb-20 md:pt-52"
        aria-labelledby="event-title"
      >
        <PageContainer>
          <TextReveal y={14}>
            <div className="mb-12 flex flex-wrap items-baseline gap-x-8 gap-y-3">
              <span className="eyebrow text-soil">Event</span>
              <span className="eyebrow text-bone/45">
                {day} {month} {year}
              </span>
            </div>
          </TextReveal>

          <SplitHeading
            as="h1"
            id="event-title"
            lines={[event.title]}
            immediate
            className="text-display font-semibold text-bone"
          />

          {event.isPlaceholder ? (
            <PendingCopy tone="dark" className="mt-10" label="Placeholder event">
              This is not a scheduled occasion. No date, venue or programme below has been
              confirmed by the academy, and no Event structured data is published for it.
            </PendingCopy>
          ) : null}
        </PageContainer>
      </SectionReveal>

      <SectionReveal tone="ink" spacing="none" grain className="pb-24 md:pb-32">
        <ScaleImage
          slot={event.image}
          ratio="21 / 9"
          tone="ink"
          wrapperClassName="w-full"
          sizes="100vw"
          from={1.12}
        />
      </SectionReveal>

      {/* Body + facts ------------------------------------------------------ */}
      <SectionReveal tone="bone" spacing="lg">
        <PageContainer>
          <div className="grid gap-14 lg:grid-cols-12 lg:gap-12">
            {/* Facts rail */}
            <aside className="lg:col-span-4">
              <div className="lg:sticky lg:top-32">
                <dl className="m-0 border-t border-ink/12">
                  <Fact
                    icon={<CalendarDays className="h-4 w-4" strokeWidth={1.6} />}
                    label="Date"
                    value={`${day} ${month} ${year}`}
                  />
                  {event.time ? (
                    <Fact
                      icon={<Clock className="h-4 w-4" strokeWidth={1.6} />}
                      label="Time"
                      value={event.time}
                    />
                  ) : null}
                  <Fact
                    icon={<MapPin className="h-4 w-4" strokeWidth={1.6} />}
                    label="Location"
                    value={event.location}
                  />
                  {event.info.map((item) => (
                    <Fact key={item.label} label={item.label} value={item.value} />
                  ))}
                </dl>

                <div className="mt-10">
                  <WhatsAppButton
                    label="RSVP on WhatsApp"
                    message={`Hello Choorakkodi — I would like to RSVP for "${event.title}".`}
                    size="md"
                  />
                </div>
              </div>
            </aside>

            {/* Description + schedule */}
            <div className="lg:col-span-7 lg:col-start-6">
              <div className="space-y-6">
                {event.description.map((paragraph, index) => (
                  <TextReveal key={index} delay={index * 0.08}>
                    <p className="measure text-lead text-ink/78">{paragraph}</p>
                  </TextReveal>
                ))}
              </div>

              {event.schedule.length > 0 ? (
                <div className="mt-16">
                  <LineReveal />
                  <h2 className="mt-8 text-title font-semibold tracking-[-0.024em]">Schedule</h2>
                  <dl className="m-0 mt-8">
                    {event.schedule.map((item, index) => (
                      <div
                        key={`${item.time}-${index}`}
                        data-reveal
                        className="flex items-baseline gap-8 border-t border-ink/12 py-5"
                      >
                        <dt className="eyebrow w-20 shrink-0 text-soil">{item.time}</dt>
                        <dd className="m-0 text-lead text-ink/78">{item.label}</dd>
                      </div>
                    ))}
                    <div aria-hidden="true" className="border-t border-ink/12" />
                  </dl>
                </div>
              ) : null}

              {event.gallery.length > 0 ? (
                <div className="mt-16">
                  <LineReveal />
                  <h2 className="mt-8 text-title font-semibold tracking-[-0.024em]">Gallery</h2>
                  <div className="mt-8 grid grid-cols-2 gap-4 sm:gap-6">
                    {event.gallery.map((image, index) => (
                      <ImageReveal
                        key={index}
                        slot={image}
                        ratio="4 / 3"
                        index={String(index + 1).padStart(2, "0")}
                        wrapperClassName={index === 0 ? "col-span-2" : undefined}
                        sizes="(max-width: 768px) 46vw, 30vw"
                        delay={index * 0.06}
                      />
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </PageContainer>
      </SectionReveal>

      {/* Related ------------------------------------------------------------ */}
      {related.length > 0 ? (
        <SectionReveal tone="bone" spacing="lg" aria-labelledby="related-events">
          <PageContainer>
            <h2 id="related-events" className="eyebrow mb-10 text-muted">
              Other events
            </h2>
            {related.map((item) => (
              <EventCard key={item.slug} event={item} variant="row" />
            ))}
            <LineReveal />
          </PageContainer>
        </SectionReveal>
      ) : null}
    </>
  );
}

function Fact({
  icon,
  label,
  value,
}: {
  icon?: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-baseline justify-between gap-6 border-b border-ink/12 py-5">
      <dt className="flex items-center gap-2.5 text-soil">
        {icon}
        <span className="eyebrow">{label}</span>
      </dt>
      <dd className="m-0 text-right text-[0.9375rem] font-medium text-ink">{value}</dd>
    </div>
  );
}
