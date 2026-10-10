import { SectionReveal } from "@/components/animation/SectionReveal";
import { SectionHeading } from "@/components/content/SectionHeading";
import { TextReveal } from "@/components/animation/TextReveal";
import { PageContainer } from "@/components/layout/PageContainer";
import { DisciplineRows } from "@/components/disciplines/DisciplineRows";
import { ArrowLink } from "@/components/ui/ArrowLink";
import { getContent } from "@/lib/content";

/** Section 03 — what is taught, as rows rather than cards. */
export async function DisciplinesSection() {
  const { disciplines } = await getContent();
  return (
    <SectionReveal tone="wenge" spacing="lg" grain aria-labelledby="disciplines-heading">
      <PageContainer>
        <div className="mb-16 grid gap-10 md:mb-24 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <SectionHeading
              id="disciplines-heading"
              index="03"
              eyebrow="What we teach"
              lines={["Four ways", "into the", "same work."]}
              size="headline"
              tone="dark"
            />
          </div>
          <TextReveal delay={0.15} className="lg:col-span-4 lg:col-start-9 lg:self-end">
            <p className="measure text-lead text-bone/60">
              The martial syllabus and the healing tradition are halves of one body of knowledge.
              They are listed separately because they are entered separately.
            </p>
          </TextReveal>
        </div>

        <DisciplineRows items={disciplines} tone="dark" />

        <TextReveal delay={0.1} className="mt-16">
          <ArrowLink href="/disciplines" tone="bone" size="md">
            All disciplines
          </ArrowLink>
        </TextReveal>
      </PageContainer>
    </SectionReveal>
  );
}
