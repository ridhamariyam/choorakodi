import { SectionReveal } from "@/components/animation/SectionReveal";
import { SectionHeading } from "@/components/content/SectionHeading";
import { TextReveal } from "@/components/animation/TextReveal";
import { PageContainer } from "@/components/layout/PageContainer";
import { TestimonialRail } from "@/components/testimonials/TestimonialRail";
import { ArrowLink } from "@/components/ui/ArrowLink";
import { getContent } from "@/lib/content";

/** Section 06 — voices, as spreads on a rail. */
export async function TestimonialsSection() {
  const { testimonials } = await getContent();
  return (
    <SectionReveal
      tone="ink"
      spacing="none"
      grain
      aria-labelledby="testimonials-heading"
      className="py-24 md:py-32"
    >
      <PageContainer className="pb-8 md:pb-14">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <SectionHeading
              id="testimonials-heading"
              index="06"
              eyebrow="Voices from the kalari"
              lines={["What the", "floor gives", "back."]}
              size="headline"
              tone="dark"
            />
          </div>
          <TextReveal delay={0.15} className="lg:col-span-4 lg:col-start-9 lg:self-end">
            <p className="measure text-lead text-bone/60">
              Student accounts, in their own words. Every entry below is a marked placeholder
              until real, attributable testimonials are collected.
            </p>
            <div className="mt-8">
              <ArrowLink href="/testimonials" tone="bone" size="sm">
                All voices
              </ArrowLink>
            </div>
          </TextReveal>
        </div>
      </PageContainer>

      <TestimonialRail items={testimonials} tone="dark" />
    </SectionReveal>
  );
}
