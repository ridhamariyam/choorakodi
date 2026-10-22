import type { Metadata } from "next";

import { PageHeader } from "@/components/layout/PageHeader";
import { NextChapter } from "@/components/story/NextChapter";
import { chapterLabel } from "@/data/navigation";
import { PageContainer } from "@/components/layout/PageContainer";
import { SectionReveal } from "@/components/animation/SectionReveal";
import { SectionHeading } from "@/components/content/SectionHeading";
import { StoryParagraphs } from "@/components/content/StoryParagraphs";
import { ScrollWords } from "@/components/story/Caption";
import { monoStyle } from "@/components/story/fonts";
import { PendingCopy } from "@/components/content/PendingCopy";
import { TextReveal } from "@/components/animation/TextReveal";
import { ParallaxImage } from "@/components/animation/ParallaxImage";
import { ScaleImage } from "@/components/animation/ScaleImage";
import { CTASection } from "@/components/content/CTASection";
import { JsonLd } from "@/components/layout/JsonLd";
import { breadcrumbSchema, personSchema } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";
import { formatLocality } from "@/data/site";
import { getContent } from "@/lib/content";
import { highlight } from "@/lib/highlight";

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
  const { site, about, founder } = await getContent();
  return (
    <>
      <PageHeader
        chapter={chapterLabel("/about")}
        eyebrow={about.eyebrow}
        lines={about.heading}
        standfirst={about.standfirst}
        meta={`${formatLocality(site)} · Est. ${site.foundedYear}`}
      />

      {/* Founder ---------------------------------------------------------- */}
      <SectionReveal tone="bone" spacing="lg" aria-labelledby="about-founder">
        <PageContainer>
          <SectionHeading
            id="about-founder"
            index="01"
            eyebrow={founder.eyebrow}
            lines={["The hand", "that taught", "the hands."]}
            size="headline"
            align="center"
          />

          <div className="mx-auto mt-[12vw] w-[72vw] md:mt-[5vw] md:w-[28vw]">
            <ParallaxImage
              slot={about.portrait}
              ratio="3 / 4"
              index="Gurukkal"
              wrapperClassName="w-full"
              sizes="(max-width: 768px) 72vw, 28vw"
              strength={8}
            />
          </div>

          {/* His story down the middle, large, lighting up as it scrolls. */}
          <div className="mx-auto mt-[16vw] max-w-[88vw] text-center md:mt-[8vw] md:max-w-[56vw]">
            <TextReveal>
              <p style={monoStyle} className="text-[3vw] uppercase tracking-[0.32em] text-green md:text-[0.9vw]">
                {founder.name}
              </p>
            </TextReveal>
            <div style={monoStyle} className="mt-[8vw] space-y-[8vw] md:mt-[3vw] md:space-y-[3vw]">
              {founder.intro.split(/\n\s*\n/).map((text) => (
                <p
                  key={text.slice(0, 24)}
                  data-scrub-text
                  className="text-[4.4vw] leading-[1.35] font-medium text-[#1f1d1e] md:text-[1.6vw] md:leading-[1.4]"
                >
                  {highlight(text, founder.highlights).map((part, i) => (
                    <ScrollWords key={i} text={part.text} bold={part.bold} />
                  ))}
                </p>
              ))}
            </div>
            <PendingCopy className="mt-10" label="Biography pending">
              {founder.pending}
            </PendingCopy>
          </div>
        </PageContainer>
      </SectionReveal>

      {/* History down the middle, its photos popping up at the sides ----- */}
      <SectionReveal tone="bone" spacing="lg" aria-labelledby="about-timeline">
        <PageContainer>
          <SectionHeading
            id="about-timeline"
            index="02"
            eyebrow="Our history"
            lines={["From 1960", "to the", "present floor."]}
            size="headline"
            className="mb-16 md:mb-24"
          />
          <StoryParagraphs paragraphs={about.history} />
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
                <ParallaxImage
                  slot={about.team}
                  ratio="4 / 3"
                  tone="ink"
                  index="Today"
                  wrapperClassName="mt-14 w-full"
                  sizes="(max-width: 1024px) 92vw, 30vw"
                  strength={6}
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
      </SectionReveal>

      <CTASection
        eyebrow="Visit"
        lines={["Come and", "see the floor."]}
        body="The clearest way to understand a lineage is to stand in the room it is taught in."
        message="Hello Choorakkodi — I read about the academy's legacy and would like to visit."
        secondary={{ label: "Admissions", href: "/admissions" }}
      />

      <NextChapter from="/about" />

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
