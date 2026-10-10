import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { EventDetail } from "@/components/events/EventDetail";
import { CTASection } from "@/components/content/CTASection";
import { JsonLd } from "@/components/layout/JsonLd";
import { breadcrumbSchema, eventSchema } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";
import { getEvent, relatedEvents, formatEventDate } from "@/data/events";
import { getContent } from "@/lib/content";

type Params = { slug: string };

/** Pre-renders the events that exist at build time; ones added later in the admin render on first visit. */
export async function generateStaticParams(): Promise<Params[]> {
  const { events } = await getContent();
  return events.map((event) => ({ slug: event.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const { site, events } = await getContent();
  const event = getEvent(events, slug);

  if (!event) {
    return buildMetadata(
      {
        title: "Event not found",
        description: "This event could not be found.",
        path: "/events",
        noindex: true,
      },
      site,
    );
  }

  const { day, month, year } = formatEventDate(event.date);

  return buildMetadata(
    {
        title: `${event.title} — ${day} ${month} ${year}`,
        description: event.summary,
        path: `/events/${event.slug}`,
        type: "article",
        publishedTime: `${event.date}T00:00:00.000Z`,
        // Placeholder events are kept out of the index, as is their Event schema.
        noindex: event.isPlaceholder,
    },
    site,
  );
}

export default async function EventPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const { site, events } = await getContent();
  const event = getEvent(events, slug);
  if (!event) notFound();

  const related = relatedEvents(events, slug);

  return (
    <>
      <EventDetail event={event} related={related} />

      <CTASection
        eyebrow="Attend"
        lines={["Reserve", "your place."]}
        body="Message the academy to confirm attendance and receive the final details."
        message={`Hello Choorakkodi — I would like to RSVP for "${event.title}".`}
        whatsappLabel="RSVP on WhatsApp"
        secondary={{ label: "All events", href: "/events" }}
      />

      {/* eventSchema() returns null for placeholder records. */}
      <JsonLd schema={eventSchema(event, site)} />
      <JsonLd
        schema={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Events", path: "/events" },
          { name: event.title, path: `/events/${event.slug}` },
        ])}
      />
    </>
  );
}
