import { SectionReveal } from "@/components/animation/SectionReveal";
import { SectionHeading } from "@/components/content/SectionHeading";
import { TextReveal } from "@/components/animation/TextReveal";
import { PageContainer } from "@/components/layout/PageContainer";
import { GalleryTeaser } from "./GalleryTeaser";
import { ArrowLink } from "@/components/ui/ArrowLink";

/** Section 07 — the gallery, as a composed spread rather than a grid. */
export function GalleryTeaserSection() {
  return (
    <SectionReveal tone="bone" spacing="xl" aria-labelledby="gallery-heading">
      <PageContainer>
        <div className="mb-20 grid gap-10 md:mb-28 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <SectionHeading
              id="gallery-heading"
              index="07"
              eyebrow="Images"
              lines={["The kalari,", "photographed."]}
              size="headline"
            />
          </div>
          <TextReveal delay={0.15} className="lg:col-span-4 lg:col-start-9 lg:self-end">
            <p className="measure text-lead text-ink/72">
              Training, weapons, the hall itself and the people in it. Image slots are composed
              and waiting for the academy&apos;s own photography.
            </p>
          </TextReveal>
        </div>

        <GalleryTeaser />

        <TextReveal delay={0.1} className="mt-20">
          <ArrowLink href="/gallery" size="lg">
            View the gallery
          </ArrowLink>
        </TextReveal>
      </PageContainer>
    </SectionReveal>
  );
}
