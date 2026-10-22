import type { Metadata } from "next";
import { Info } from "lucide-react";

import { PageHeader } from "@/components/layout/PageHeader";
import { NextChapter } from "@/components/story/NextChapter";
import { chapterLabel } from "@/data/navigation";
import { PageContainer } from "@/components/layout/PageContainer";
import { SectionReveal } from "@/components/animation/SectionReveal";
import { SectionHeading } from "@/components/content/SectionHeading";
import { EditorialText } from "@/components/content/EditorialText";
import { PendingCopy } from "@/components/content/PendingCopy";
import { TextReveal } from "@/components/animation/TextReveal";
import { ParallaxImage } from "@/components/animation/ParallaxImage";
import { MaskedReveal } from "@/components/animation/MaskedReveal";
import { CTASection } from "@/components/content/CTASection";
import { BodyMap } from "@/components/marma/BodyMap";
import { JsonLd } from "@/components/layout/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";
import { getContent } from "@/lib/content";

export async function generateMetadata(): Promise<Metadata> {
  const { site } = await getContent();
  return buildMetadata(
    {
      title: "Kalari Marma Healing",
      description:
        "Marma — the classical map of the body's vital points — and the hands-on kalari healing tradition that shares it, at Choorakkodi Martial Arts Academy, Kozhikode.",
      path: "/kalari-marma-healing",
    },
    site,
  );
}

export default async function MarmaPage() {
  const { marma } = await getContent();
  return (
    <>
      <PageHeader
        chapter={chapterLabel("/kalari-marma-healing")}
        eyebrow={marma.eyebrow}
        lines={marma.heading}
        standfirst={marma.standfirst}
        tone="bone"
        meta="Tradition · Wellbeing"
      />

      {/* What is marma ----------------------------------------------------- */}
      <SectionReveal tone="bone" spacing="lg" aria-labelledby="marma-what">
        <PageContainer>
          <div className="grid gap-14 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <SectionHeading
                id="marma-what"
                index="01"
                eyebrow="Definition"
                lines={["What is", "marma?"]}
                size="headline"
              />
              <div className="mt-14">
                <ParallaxImage
                  slot={marma.image}
                  ratio="4 / 5"
                  index="Marma"
                  wrapperClassName="w-full"
                  sizes="(max-width: 1024px) 92vw, 38vw"
                  strength={8}
                />
              </div>
            </div>

            <div className="lg:col-span-6 lg:col-start-7">
              <EditorialText paragraphs={marma.what.body} lead />

              <div className="mt-16 border-t border-ink/12 pt-10">
                <h3 className="text-title font-semibold tracking-[-0.024em]">
                  {marma.tradition.title}
                </h3>
                <EditorialText paragraphs={marma.tradition.body} className="mt-6" size="body" />
              </div>
            </div>
          </div>
        </PageContainer>
      </SectionReveal>

      {/* The 107 points ---------------------------------------------------- */}
      <SectionReveal tone="green" spacing="lg" grain aria-labelledby="marma-points">
        <PageContainer>
          <div className="mb-16 grid gap-10 md:mb-24 lg:grid-cols-12">
            <div className="lg:col-span-6">
              <SectionHeading
                id="marma-points"
                index="02"
                eyebrow="The classical enumeration"
                lines={["The 107", "vital points."]}
                size="headline"
                tone="dark"
              />
            </div>
            <TextReveal delay={0.15} className="lg:col-span-4 lg:col-start-9 lg:self-end">
              <p className="measure text-lead text-bone/68">{marma.points.body}</p>
              <p className="eyebrow mt-7 text-bone/40">{marma.points.note}</p>
            </TextReveal>
          </div>

          <BodyMap regions={marma.points.regions} />
        </PageContainer>
      </SectionReveal>

      {/* Healing + consultation -------------------------------------------- */}
      <SectionReveal tone="bone" spacing="lg" aria-labelledby="marma-healing">
        <PageContainer>
          <div className="grid gap-14 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <SectionHeading
                id="marma-healing"
                index="03"
                eyebrow="Practice"
                lines={["Healing."]}
                size="headline"
              />
              <ParallaxImage
                slot={marma.campus}
                ratio="3 / 4"
                index="Vaidyasala"
                wrapperClassName="mt-14 w-full lg:max-w-[26rem]"
                sizes="(max-width: 1024px) 92vw, 34vw"
                strength={8}
              />
            </div>

            <div className="lg:col-span-6 lg:col-start-7">
              <EditorialText paragraphs={marma.healing.body} />

              <div className="mt-16 border-t border-ink/12 pt-10">
                <h3 className="text-title font-semibold tracking-[-0.024em]">
                  {marma.consultation.title}
                </h3>
                <p className="measure mt-6 text-lead text-ink/75">{marma.consultation.body}</p>
                <PendingCopy className="mt-8">{marma.consultation.pending}</PendingCopy>
              </div>

              {/* Health disclaimer, given the same weight as the copy. A wipe
                  rather than a fade so it arrives deliberately. */}
              <MaskedReveal direction="up" className="mt-14">
                <aside className="flex gap-5 border-l-2 border-green bg-bone-dim/70 p-7">
                  <Info className="mt-0.5 h-5 w-5 shrink-0 text-green" strokeWidth={1.6} />
                  <div>
                    <p className="eyebrow mb-3 text-green">Important</p>
                    <p className="text-[0.9375rem] leading-relaxed text-ink/78">
                      {marma.disclaimer}
                    </p>
                  </div>
                </aside>
              </MaskedReveal>
            </div>
          </div>
        </PageContainer>
      </SectionReveal>

      <CTASection
        eyebrow="Consultation"
        lines={["Book a marma", "consultation."]}
        body="Sessions begin with a conversation about what is appropriate — and with declining what is not."
        message="Hello Choorakkodi — I would like to ask about a marma consultation."
        whatsappLabel="Book a consultation"
        secondary={{ label: "Contact", href: "/contact" }}
      />

      <NextChapter from="/kalari-marma-healing" />

      <JsonLd
        schema={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Kalari Marma Healing", path: "/kalari-marma-healing" },
        ])}
      />
    </>
  );
}
