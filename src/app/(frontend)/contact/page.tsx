import type { Metadata } from "next";

import { PageHeader } from "@/components/layout/PageHeader";
import { PageContainer } from "@/components/layout/PageContainer";
import { SectionReveal } from "@/components/animation/SectionReveal";
import { TextReveal } from "@/components/animation/TextReveal";
import { ContactBlock } from "@/components/contact/ContactBlock";
import { MapBlock } from "@/components/contact/MapBlock";
import { WhatsAppButton } from "@/components/contact/WhatsAppButton";
import { Button } from "@/components/ui/Button";
import { JsonLd } from "@/components/layout/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";
import { formatLocality, telHref } from "@/data/site";
import { getContent } from "@/lib/content";

export async function generateMetadata(): Promise<Metadata> {
  const { site } = await getContent();
  return buildMetadata(
    {
      title: "Contact",
      description:
        "Visit Choorakkodi Martial Arts Academy in Kozhikode, Kerala. WhatsApp, call or get directions to the kalari.",
      path: "/contact",
    },
    site,
  );
}

/**
 * Contact. The cleanest page on the site by design — three actions, one
 * address block, one map. NAP data comes from data/site.ts so it stays
 * identical here, in the footer and in the structured data.
 */
export default async function ContactPage() {
  const { site, contact } = await getContent();
  return (
    <>
      <PageHeader
        eyebrow={contact.eyebrow}
        lines={contact.heading}
        standfirst={contact.standfirst}
        meta={formatLocality(site)}
      >
        <TextReveal delay={0.35} className="mt-14 flex flex-wrap gap-4">
          <WhatsAppButton
            label="WhatsApp us"
            message="Hello Choorakkodi — I would like to get in touch."
            size="lg"
            magnetic
          />
          {site.contact.phone ? (
            <Button href={telHref(site)} external variant="outline" size="lg" className="text-ink">
              Call the academy
            </Button>
          ) : null}
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
          <div className="grid gap-16 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-5">
              <h2 className="eyebrow mb-10 text-muted">Academy details</h2>
              <ContactBlock />
            </div>

            <div className="lg:col-span-6 lg:col-start-7">
              <h2 className="eyebrow mb-10 text-muted">Find the kalari</h2>
              <MapBlock />
            </div>
          </div>
        </PageContainer>
      </SectionReveal>

      {/* Closing panel — quieter than a full CTA section, which would be
          redundant on the page people already came to in order to get in touch. */}
      <SectionReveal tone="green" spacing="md" grain aria-labelledby="contact-close">
        <PageContainer>
          <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7">
              <h2
                id="contact-close"
                className="text-headline font-semibold tracking-[-0.033em] text-bone"
              >
                The fastest reply is on WhatsApp.
              </h2>
              <p className="measure mt-6 text-lead text-bone/70">
                Timings, directions and trial sessions are all arranged there.
              </p>
            </div>
            <TextReveal delay={0.1} className="lg:col-span-4 lg:col-start-9 lg:justify-self-end">
              <WhatsAppButton
                label="Message the academy"
                message="Hello Choorakkodi — I would like to arrange a visit."
                variant="bone"
                size="lg"
                magnetic
              />
            </TextReveal>
          </div>
        </PageContainer>
      </SectionReveal>

      {/* Organization is emitted once site-wide from the root layout; repeating
          it here would ship the same @id node twice on this page. */}
      <JsonLd
        schema={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Contact", path: "/contact" },
        ])}
      />
    </>
  );
}
