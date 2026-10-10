import type { Metadata } from "next";

import { PageHeader } from "@/components/layout/PageHeader";
import { PageContainer } from "@/components/layout/PageContainer";
import { SectionReveal } from "@/components/animation/SectionReveal";
import { SectionHeading } from "@/components/content/SectionHeading";
import { PendingCopy } from "@/components/content/PendingCopy";
import { TextReveal } from "@/components/animation/TextReveal";
import { ParallaxImage } from "@/components/animation/ParallaxImage";
import { LineReveal } from "@/components/animation/LineReveal";
import { HorizontalScroll } from "@/components/animation/HorizontalScroll";
import { Figure } from "@/components/content/Figure";
import { CTASection } from "@/components/content/CTASection";
import { JsonLd } from "@/components/layout/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";
import { cn } from "@/lib/utils";
import { getContent } from "@/lib/content";

export async function generateMetadata(): Promise<Metadata> {
  const { site } = await getContent();
  return buildMetadata(
    {
      title: "Heritage",
      description:
        "The Choorakkodi archive — photographs, decades and captions recorded as honestly as the material allows.",
      path: "/heritage",
    },
    site,
  );
}

/**
 * The heritage archive.
 *
 * Grain on every dark surface, oversized years set behind the plates, and
 * captions that state uncertainty rather than resolving it. Nothing here
 * claims a date or a name that has not been confirmed.
 */
export default async function HeritagePage() {
  const { site, heritage, gallery } = await getContent();
  const archivalStrip = gallery.filter((item) => item.category === "Heritage" || item.category === "Kalari");

  return (
    <>
      <PageHeader
        eyebrow={heritage.eyebrow}
        lines={heritage.heading}
        standfirst={heritage.standfirst}
        tone="ink"
        grain
        meta={`Est. ${site.foundedYear}`}
      />

      {/* Method note ------------------------------------------------------ */}
      <SectionReveal tone="ink" spacing="sm" grain>
        <PageContainer>
          <div className="grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-3">
              <p className="eyebrow text-soil">Method</p>
            </div>
            <TextReveal className="lg:col-span-7 lg:col-start-5">
              <p className="measure text-lead text-bone/68">{heritage.method}</p>
            </TextReveal>
          </div>
        </PageContainer>
      </SectionReveal>

      {/* Archive entries -------------------------------------------------- */}
      {heritage.entries.map((entry, index) => {
        const flip = index % 2 === 1;

        return (
          <SectionReveal
            key={entry.id}
            tone={index % 2 === 0 ? "wenge" : "ink"}
            spacing="lg"
            grain
            aria-labelledby={`archive-${entry.id}`}
          >
            <PageContainer width="wide">
              <div className="relative">
                {/* The year, set as a ground rather than a label. */}
                <span
                  aria-hidden="true"
                  className={cn(
                    "pointer-events-none absolute -top-6 select-none text-[clamp(5rem,18vw,16rem)] font-bold leading-[0.75] tracking-[-0.06em] text-bone/[0.055]",
                    flip ? "right-0" : "left-0",
                  )}
                >
                  {entry.year}
                </span>

                <div className="relative grid items-center gap-12 lg:grid-cols-12 lg:gap-14">
                  <div
                    className={cn(
                      "lg:col-span-7",
                      flip ? "lg:order-2 lg:col-start-6" : "lg:order-1",
                    )}
                  >
                    <ParallaxImage
                      slot={entry.image}
                      ratio="4 / 3"
                      tone="ink"
                      index={entry.index}
                      wrapperClassName="w-full"
                      sizes="(max-width: 1024px) 92vw, 56vw"
                      strength={11}
                    />
                  </div>

                  <div
                    className={cn(
                      "lg:col-span-4",
                      flip ? "lg:order-1 lg:col-start-1" : "lg:order-2 lg:col-start-9",
                    )}
                  >
                    <TextReveal y={14}>
                      <p className="eyebrow text-soil">{entry.index}</p>
                    </TextReveal>

                    <TextReveal delay={0.08} className="mt-7">
                      <p className="text-display font-semibold leading-none tracking-[-0.045em] text-bone">
                        {entry.year}
                      </p>
                    </TextReveal>

                    <TextReveal delay={0.14} className="mt-8">
                      <h2
                        id={`archive-${entry.id}`}
                        className="text-title font-medium tracking-[-0.024em] text-bone"
                      >
                        {entry.title}
                      </h2>
                      <p className="measure mt-5 text-lead text-bone/62">{entry.caption}</p>
                    </TextReveal>

                    {entry.pending ? (
                      <PendingCopy tone="dark" className="mt-9" label="Material pending">
                        {entry.pending}
                      </PendingCopy>
                    ) : null}

                    <LineReveal tone="dark" className="mt-10" />
                  </div>
                </div>
              </div>
            </PageContainer>
          </SectionReveal>
        );
      })}

      {/* Contact sheet ----------------------------------------------------- */}
      <SectionReveal
        tone="ink"
        spacing="none"
        grain
        aria-labelledby="archive-sheet"
        className="py-24 md:py-32"
      >
        <PageContainer className="pb-10 md:pb-14">
          <div className="grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-6">
              <SectionHeading
                id="archive-sheet"
                index="05"
                eyebrow="Contact sheet"
                lines={["Everything", "else in", "the box."]}
                size="headline"
                tone="dark"
              />
            </div>
            <TextReveal delay={0.15} className="lg:col-span-4 lg:col-start-9 lg:self-end">
              <p className="measure text-lead text-bone/60">
                Unsorted material, laid out as it arrives. Slots are captioned before they are
                filled so no photograph is ever published without one.
              </p>
              <p className="eyebrow mt-8 text-bone/35">Scroll sideways →</p>
            </TextReveal>
          </div>
        </PageContainer>

        <HorizontalScroll railClassName="items-center gap-6 pl-[clamp(1.25rem,5vw,5.5rem)]">
          {archivalStrip.map((item, index) => (
            <figure
              key={item.id}
              className="m-0 w-[72vw] shrink-0 snap-start sm:w-[42vw] lg:w-[26vw] xl:w-[22vw]"
            >
              <Figure
                slot={item.image}
                ratio="4 / 5"
                tone="ink"
                index={String(index + 1).padStart(2, "0")}
                sizes="(max-width: 640px) 72vw, (max-width: 1024px) 42vw, 24vw"
              />
              <figcaption className="mt-4 flex items-baseline gap-4">
                <span className="eyebrow shrink-0 text-soil">{item.category}</span>
                <span className="text-[0.8125rem] leading-relaxed text-bone/45">
                  {item.caption}
                </span>
              </figcaption>
            </figure>
          ))}
        </HorizontalScroll>
      </SectionReveal>

      <CTASection
        eyebrow="The archive"
        lines={["Do you hold", "part of this?"]}
        body="Photographs, programmes and printed material connected to the kalari are welcome. Undated is fine — that is what the archive is for."
        message="Hello Choorakkodi — I have material that may belong in the academy archive."
        whatsappLabel="Contribute to the archive"
        secondary={{ label: "Contact", href: "/contact" }}
      />

      <JsonLd
        schema={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Heritage", path: "/heritage" },
        ])}
      />
    </>
  );
}
