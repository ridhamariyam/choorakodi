import { SectionReveal } from "@/components/animation/SectionReveal";
import { SectionHeading } from "@/components/content/SectionHeading";
import { TextReveal } from "@/components/animation/TextReveal";
import { PageContainer } from "@/components/layout/PageContainer";
import { Timeline } from "@/components/content/Timeline";
import { getContent } from "@/lib/content";

/** Section 02 — six decades, read left to right. */
export async function LegacyTimeline() {
  const { timeline } = await getContent();
  return (
    <SectionReveal tone="ink" spacing="none" grain aria-labelledby="timeline-heading" className="py-24 md:py-32">
      <PageContainer className="pb-6 md:pb-10">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <SectionHeading
              id="timeline-heading"
              index="02"
              eyebrow="The line of years"
              lines={["A tradition", "measured in", "decades."]}
              size="headline"
              tone="dark"
            />
          </div>
          <TextReveal delay={0.15} className="lg:col-span-4 lg:col-start-9 lg:self-end">
            <p className="measure text-lead text-bone/60">
              Five chapters, from the founding to the present. The years are the academy&apos;s own;
              the account of each one is supplied by the academy rather than assumed here.
            </p>
            <p className="eyebrow mt-8 text-bone/35">Scroll sideways →</p>
          </TextReveal>
        </div>
      </PageContainer>

      <Timeline entries={timeline} tone="dark" />
    </SectionReveal>
  );
}
