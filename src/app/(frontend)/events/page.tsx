import type { Metadata } from "next";

import { PageHeader } from "@/components/layout/PageHeader";
import { PageContainer } from "@/components/layout/PageContainer";
import { SectionReveal } from "@/components/animation/SectionReveal";
import { EventList } from "@/components/events/EventList";
import { CTASection } from "@/components/content/CTASection";
import { JsonLd } from "@/components/layout/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";
import { pastEvents, upcomingEvents } from "@/data/events";
import { getContent } from "@/lib/content";

export async function generateMetadata(): Promise<Metadata> {
  const { site, events } = await getContent();
  return buildMetadata(
    {
      title: "Events",
      description:
        "Demonstrations, gatherings and consultation days at Choorakkodi Martial Arts Academy, Kozhikode.",
      path: "/events",
      // Every record is a placeholder today; nothing here should be indexed as a
      // real calendar until at least one confirmed event exists.
      noindex: events.every((event) => event.isPlaceholder),
    },
    site,
  );
}

export default async function EventsPage() {
  const { events } = await getContent();
  const upcoming = upcomingEvents(events);
  const past = pastEvents(events);

  return (
    <>
      <PageHeader
        eyebrow="Calendar"
        lines={["Events."]}
        standfirst="Demonstrations, gatherings and consultation days. Upcoming occasions are announced here first."
        meta={`${upcoming.length} upcoming`}
      />

      <SectionReveal tone="bone" spacing="md">
        <PageContainer>
          <EventList upcoming={upcoming} past={past} />
        </PageContainer>
      </SectionReveal>

      <CTASection
        eyebrow="Stay in touch"
        lines={["Hear it", "here first."]}
        body="Message the academy to be told about demonstrations and open sessions before they are announced."
        message="Hello Choorakkodi — please let me know about upcoming events."
        whatsappLabel="Ask about events"
        secondary={{ label: "Contact", href: "/contact" }}
      />

      <JsonLd
        schema={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Events", path: "/events" },
        ])}
      />
    </>
  );
}
