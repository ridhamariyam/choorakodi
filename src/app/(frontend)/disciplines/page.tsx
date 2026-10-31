import type { Metadata } from "next";

import { PageHeader } from "@/components/layout/PageHeader";
import { NextChapter } from "@/components/story/NextChapter";
import { chapterLabel } from "@/data/navigation";
import { PageContainer } from "@/components/layout/PageContainer";
import { SectionReveal } from "@/components/animation/SectionReveal";
import { SplitHeading } from "@/components/animation/SplitHeading";
import { TextReveal } from "@/components/animation/TextReveal";
import { ParallaxImage } from "@/components/animation/ParallaxImage";
import { PendingCopy } from "@/components/content/PendingCopy";
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
      title: "Kalarippayattu, Self-Defence and Marma",
      description:
        "What Choorakkodi Martial Arts Academy teaches in Kozhikode: traditional Kalarippayattu, structured martial arts, self-defence and kalari marma healing.",
      path: "/disciplines",
    },
    site,
  );
}

/**
 * Each discipline occupies its own near-viewport block with an alternating
 * image side, so scrolling the page feels like turning plates rather than
 * scanning a list. Only the four disciplines named in the supplied brief
 * appear — no offering is invented.
 */
export default async function DisciplinesPage() {
  const { disciplines } = await getContent();
  return (
    <>
      <PageHeader
        chapter={chapterLabel("/disciplines")}
        eyebrow="What we teach"
        lines={["Disciplines."]}
        size="display"
        label="Disciplines."
        standfirst="Four entries into one body of knowledge. The martial syllabus and the healing tradition share a map of the body; they are listed apart because they are entered apart."
        meta={`${disciplines.length} disciplines`}
      />

      {disciplines.map((discipline, index) => {
        const dark = index % 2 === 1;
        const imageLeft = index % 2 === 0;

        return (
          <SectionReveal
            key={discipline.slug}
            id={discipline.slug}
            tone={dark ? "ink" : "bone"}
            grain={dark}
            spacing="lg"
            className="scroll-mt-24"
            aria-labelledby={`discipline-${discipline.slug}`}
          >
            <PageContainer>
              <div className="grid items-center gap-14 lg:grid-cols-12 lg:gap-14">
                <div
                  className={cn(
                    "lg:col-span-5",
                    imageLeft ? "lg:order-1" : "lg:order-2 lg:col-start-8",
                  )}
                >
                  <ParallaxImage
                    slot={discipline.image}
                    ratio="4 / 5"
                    tone={dark ? "ink" : "bone"}
                    index={discipline.index}
                    wrapperClassName="w-full"
                    sizes="(max-width: 1024px) 92vw, 40vw"
                    strength={9}
                  />
                </div>

                <div
                  className={cn(
                    "lg:col-span-6",
                    imageLeft ? "lg:order-2 lg:col-start-7" : "lg:order-1 lg:col-start-1",
                  )}
                >
                  <TextReveal y={14}>
                    <div className="mb-8 flex items-baseline gap-6">
                      <span className="eyebrow text-soil-ink">{discipline.index}</span>
                      <span className={cn("eyebrow", dark ? "text-bone/62" : "text-muted")}>
                        {discipline.eyebrow}
                      </span>
                    </div>
                  </TextReveal>

                  <SplitHeading
                    as="h2"
                    id={`discipline-${discipline.slug}`}
                    lines={[discipline.title]}
                    className={cn(
                      // Sized for "Kalarippayattu" to fit its half of the row.
                      "text-[clamp(1.875rem,3.6vw,3.25rem)] leading-[1] font-semibold",
                      dark ? "text-bone" : "text-ink",
                    )}
                  />

                  <TextReveal delay={0.12} className="mt-6">
                    <p className={cn("eyebrow", dark ? "text-bone/62" : "text-muted")}>
                      {discipline.subtitle}
                    </p>
                  </TextReveal>

                  <TextReveal delay={0.18} className="mt-10">
                    <p
                      className={cn(
                        "measure text-lead",
                        dark ? "text-bone/68" : "text-ink/75",
                      )}
                    >
                      {discipline.summary}
                    </p>
                  </TextReveal>

                  {discipline.highlights.length > 0 ? (
                    <ul className="m-0 mt-12 list-none p-0">
                      {discipline.highlights.map((item) => (
                        <li
                          key={item}
                          data-reveal
                          className={cn(
                            "border-t py-4 text-[0.9375rem]",
                            dark ? "border-bone/14 text-bone/65" : "border-ink/12 text-ink/72",
                          )}
                        >
                          {item}
                        </li>
                      ))}
                      <li
                        aria-hidden="true"
                        className={cn("border-t", dark ? "border-bone/14" : "border-ink/12")}
                      />
                    </ul>
                  ) : null}

                  <PendingCopy tone={dark ? "dark" : "light"} className="mt-10">
                    {discipline.pending}
                  </PendingCopy>
                </div>
              </div>
            </PageContainer>
          </SectionReveal>
        );
      })}

      <CTASection
        eyebrow="Admissions"
        lines={["Choose", "your entry."]}
        body="Tell us which discipline interests you and we will point you at the batch that fits."
        message="Hello Choorakkodi — I would like to ask about the disciplines you teach."
        secondary={{ label: "Admissions", href: "/admissions" }}
      />

      <NextChapter from="/disciplines" />

      <JsonLd
        schema={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Disciplines", path: "/disciplines" },
        ])}
      />
    </>
  );
}
