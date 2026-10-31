import type { Metadata } from "next";
import type { ReactNode } from "react";

import { PageHeader } from "@/components/layout/PageHeader";
import { NextChapter } from "@/components/story/NextChapter";
import { chapterLabel } from "@/data/navigation";
import { PageContainer } from "@/components/layout/PageContainer";
import { SectionReveal } from "@/components/animation/SectionReveal";
import { TextReveal } from "@/components/animation/TextReveal";
import { MapBlock } from "@/components/contact/MapBlock";
import { WhatsAppButton } from "@/components/contact/WhatsAppButton";
import { Button } from "@/components/ui/Button";
import { faceStyle, monoStyle } from "@/components/story/fonts";
import { JsonLd } from "@/components/layout/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";
import { addressLines, formatLocality } from "@/data/site";
import { getContent } from "@/lib/content";

export async function generateMetadata(): Promise<Metadata> {
  const { site } = await getContent();
  return buildMetadata(
    {
      title: "Contact and Directions",
      description:
        "Find Choorakkodi Martial Arts Academy on State Highway 29, Chelavoor, Kozhikode. Phone, batch timings, office hours and directions to the kalari.",
      path: "/contact",
    },
    site,
  );
}

/**
 * Contact. WhatsApp and directions, then what the academy offers, when it
 * trains and where. This is the one page that holds the services, the batch
 * timings and the address; the other pages link here rather than repeat them.
 */
export default async function ContactPage() {
  const { site, contact, story, kalarippayattu } = await getContent();
  const address = addressLines(site) ?? [`${formatLocality(site)}, India`];

  return (
    <>
      <PageHeader
        chapter={chapterLabel("/contact")}
        eyebrow={contact.eyebrow}
        lines={contact.heading}
        standfirst={contact.standfirst}
        meta={formatLocality(site)}
      >
        <TextReveal delay={0.35} className="mt-14 flex flex-wrap justify-center gap-4">
          <WhatsAppButton
            label="WhatsApp us"
            message="Hello Choorakkodi — I would like to get in touch."
            size="lg"
            magnetic
          />
          <Button
            href={site.contact.mapDirectionsUrl ?? undefined}
            external
            variant="outline"
            size="lg"
            className="text-ink"
          >
            Get directions
          </Button>
        </TextReveal>
      </PageHeader>

      <SectionReveal tone="bone" spacing="lg">
        <PageContainer>
          <Block id="contact-services" title="Services">
            <List
              items={story.programmes.items.map((item) => ({ name: item.title, detail: item.detail }))}
            />
          </Block>

          <Block id="contact-schedule" title="Training schedule">
            <List items={kalarippayattu.schedule.items.map((item) => ({ name: item }))} />
          </Block>

          <Block id="contact-location" title="Location" last>
            <div style={monoStyle} className="text-lead font-medium">
              <p className="font-bold">{site.name}</p>
              <address className="mt-2 not-italic">
                {address.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </address>
              <p className="mt-6 text-ink/72">{contact.landmark.body}</p>
            </div>
            <MapBlock className="mt-10" />
          </Block>
        </PageContainer>
      </SectionReveal>

      {/* Organization is emitted once site-wide from the root layout; repeating
          it here would ship the same @id node twice on this page. */}
      <NextChapter from="/contact" />

      <JsonLd
        schema={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Contact", path: "/contact" },
        ])}
      />
    </>
  );
}

/** One labelled block: the title in the homepage's heading face, the list beside it. */
function Block({ id, title, last = false, children }: { id: string; title: string; last?: boolean; children: ReactNode }) {
  return (
    <section
      aria-labelledby={id}
      data-reveal
      className={`grid gap-8 border-t border-ink/12 py-[10vw] md:grid-cols-12 md:gap-[2vw] md:py-[4vw] ${last ? "border-b" : ""}`}
    >
      <h2
        id={id}
        style={faceStyle.archivo}
        className="m-0 text-[9vw] leading-[0.95] font-normal uppercase md:col-span-4 md:text-[2.8vw]"
      >
        {title}
      </h2>
      <div className="md:col-span-7 md:col-start-6">{children}</div>
    </section>
  );
}

function List({ items }: { items: { name: string; detail?: string }[] }) {
  return (
    <ul style={monoStyle} className="m-0 list-none p-0">
      {items.map((item) => (
        <li key={item.name} className="flex flex-col gap-1 border-b border-ink/10 py-4 first:pt-0 last:border-b-0 md:flex-row md:gap-8">
          <span className={`text-lead font-bold ${item.detail ? "md:w-[40%] md:shrink-0" : ""}`}>{item.name}</span>
          {item.detail ? <span className="text-lead font-medium text-ink/72">{item.detail}</span> : null}
        </li>
      ))}
    </ul>
  );
}
