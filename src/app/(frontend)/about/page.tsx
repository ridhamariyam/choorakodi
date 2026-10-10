import type { Metadata } from "next";

import { PageHeader } from "@/components/layout/PageHeader";
import { PageContainer } from "@/components/layout/PageContainer";
import { SectionReveal } from "@/components/animation/SectionReveal";
import { SectionHeading } from "@/components/content/SectionHeading";
import { EditorialText } from "@/components/content/EditorialText";
import { PendingCopy } from "@/components/content/PendingCopy";
import { TextReveal } from "@/components/animation/TextReveal";
import { ParallaxImage } from "@/components/animation/ParallaxImage";
import { ScaleImage } from "@/components/animation/ScaleImage";
import { PinnedTimeline } from "@/components/content/Timeline";
import { CTASection } from "@/components/content/CTASection";
import { JsonLd } from "@/components/layout/JsonLd";
import { breadcrumbSchema, personSchema } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";
import { formatLocality } from "@/data/site";
import { getContent } from "@/lib/content";

export async function generateMetadata(): Promise<Metadata> {
  const { site } = await getContent();
  return buildMetadata(
    {
      title: "Our Legacy",
      description:
        "The Choorakkodi lineage: the founder, the succession, and an academy teaching Kalarippayattu in Kozhikode since 1960.",
      path: "/about",
    },
    site,
  );
}

export default async function AboutPage() {
  const { site, about, founder, timeline } = await getContent();
  return (
    <>
      <PageHeader
        eyebrow={about.eyebrow}
        lines={about.heading}
        standfirst={about.standfirst}
        meta={`${formatLocality(site)} · Est. ${site.foundedYear}`}
      />

      {/* Founder ---------------------------------------------------------- */}
      <SectionReveal tone="bone" spacing="lg" aria-labelledby="about-founder">
        <PageContainer>
          <div className="grid gap-14 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-5">
              <ParallaxImage
                slot={about.portrait}
                ratio="3 / 4"
                index="Gurukkal"
                wrapperClassName="w-full"
                sizes="(max-width: 1024px) 92vw, 40vw"
                strength={8}
              />
            </div>

            <div className="lg:col-span-6 lg:col-start-7">
              <SectionHeading
                id="about-founder"
                index="01"
                eyebrow={founder.eyebrow}
                lines={["The hand", "that taught", "the hands."]}
                size="headline"
              />
              <TextReveal delay={0.12} className="mt-12">
                <p className="text-title font-medium tracking-[-0.024em] text-green">
                  {founder.name}
                </p>
              </TextReveal>
              <EditorialText paragraphs={founder.intro.split(/\n\s*\n/)} className="mt-8" />
              <PendingCopy className="mt-10" label="Biography pending">
                {founder.pending}
              </PendingCopy>
            </div>
          </div>
        </PageContainer>
      </SectionReveal>

      {/* Pinned timeline -------------------------------------------------- */}
      <SectionReveal tone="bone" spacing="lg" aria-labelledby="about-timeline">
        <PageContainer>
          <div className="mb-20 grid gap-10 lg:grid-cols-12 md:mb-28">
            <div className="lg:col-span-7">
              <SectionHeading
                id="about-timeline"
                index="02"
                eyebrow="Historical timeline"
                lines={["From 1960", "to the", "present floor."]}
                size="headline"
              />
            </div>
            <TextReveal delay={0.15} className="lg:col-span-4 lg:col-start-9 lg:self-end">
              <p className="measure text-lead text-ink/72">
                The milestones below are the academy&apos;s own. Where a date has not been
                confirmed, the entry says so rather than filling the gap.
              </p>
            </TextReveal>
          </div>

          <PinnedTimeline entries={timeline} />
        </PageContainer>
      </SectionReveal>

      {/* Lineage, leadership, authenticity -------------------------------- */}
      <SectionReveal tone="ink" spacing="lg" grain aria-labelledby="about-lineage">
        <PageContainer>
          <div className="grid gap-16 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <div className="lg:sticky lg:top-32">
                <SectionHeading
                  id="about-lineage"
                  index="03"
                  eyebrow="The lineage"
                  lines={["What is", "carried", "forward."]}
                  size="headline"
                  tone="dark"
                />
              </div>
            </div>

            <div className="lg:col-span-7 lg:col-start-6">
              {about.sections.map((section, index) => (
                <article
                  key={section.title}
                  data-reveal
                  className={index > 0 ? "mt-16 border-t border-bone/12 pt-16" : undefined}
                >
                  <h3 className="text-title font-semibold tracking-[-0.024em] text-bone">
                    {section.title}
                  </h3>
                  <p className="measure mt-6 text-lead text-bone/68">{section.body}</p>
                  <PendingCopy tone="dark" className="mt-8">
                    {section.pending}
                  </PendingCopy>
                </article>
              ))}
            </div>
          </div>
        </PageContainer>
      </SectionReveal>

      {/* Historical imagery ----------------------------------------------- */}
      <SectionReveal tone="bone" spacing="lg" aria-labelledby="about-imagery">
        <PageContainer>
          <SectionHeading
            id="about-imagery"
            index="04"
            eyebrow="Historical imagery"
            lines={["The archive,", "in part."]}
            size="headline"
            className="mb-16 md:mb-24"
          />
        </PageContainer>

        <ScaleImage
          slot={about.wide}
          ratio="21 / 9"
          index="Kalari"
          wrapperClassName="w-full"
          sizes="100vw"
          from={1.14}
        />

        <PageContainer className="mt-16">
          <div className="grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <ParallaxImage
                slot={about.archival}
                ratio="4 / 5"
                index="Archive"
                wrapperClassName="w-full"
                sizes="(max-width: 1024px) 92vw, 40vw"
                strength={9}
              />
            </div>
            <div className="lg:col-span-6 lg:col-start-7 lg:self-center">
              <h3 className="text-title font-semibold tracking-[-0.024em]">
                {about.recognition.title}
              </h3>
              {about.recognition.items.length > 0 ? (
                <ul className="mt-8 space-y-4">
                  {about.recognition.items.map((item) => (
                    <li key={item} className="flex gap-4 text-lead text-ink/78">
                      <span aria-hidden="true" className="mt-[0.7em] h-px w-6 shrink-0 bg-soil" />
                      {item}
                    </li>
                  ))}
                </ul>
              ) : null}
              <PendingCopy className="mt-8" label="Nothing supplied">
                {about.recognition.pending}
              </PendingCopy>
            </div>
          </div>
        </PageContainer>
      </SectionReveal>

      <CTASection
        eyebrow="Visit"
        lines={["Come and", "see the floor."]}
        body="The clearest way to understand a lineage is to stand in the room it is taught in."
        message="Hello Choorakkodi — I read about the academy's legacy and would like to visit."
        secondary={{ label: "Admissions", href: "/admissions" }}
      />

      <JsonLd schema={personSchema(site)} />
      <JsonLd
        schema={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Our Legacy", path: "/about" },
        ])}
      />
    </>
  );
}
