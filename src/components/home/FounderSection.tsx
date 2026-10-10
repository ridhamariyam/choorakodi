import { SectionReveal } from "@/components/animation/SectionReveal";
import { ParallaxImage } from "@/components/animation/ParallaxImage";
import { SectionHeading } from "@/components/content/SectionHeading";
import { EditorialText } from "@/components/content/EditorialText";
import { PendingCopy } from "@/components/content/PendingCopy";
import { TextReveal } from "@/components/animation/TextReveal";
import { PageContainer } from "@/components/layout/PageContainer";
import { ArrowLink } from "@/components/ui/ArrowLink";
import { getContent } from "@/lib/content";

/** Section 04 — the gurukkal. Portrait-led, text set against it. */
export async function FounderSection() {
  const { founder } = await getContent();
  return (
    <SectionReveal tone="bone" spacing="xl" aria-labelledby="founder-heading">
      <PageContainer>
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-12">
          {/* Portrait */}
          <div className="lg:col-span-5">
            <ParallaxImage
              slot={founder.image}
              ratio="3 / 4"
              index="Gurukkal"
              wrapperClassName="w-full"
              sizes="(max-width: 1024px) 92vw, 40vw"
              strength={8}
            />

            <TextReveal delay={0.2} className="mt-10">
              <dl className="m-0 divide-y divide-ink/12 border-y border-ink/12">
                {founder.facts.map((fact) => (
                  <div key={fact.label} className="flex items-baseline justify-between gap-6 py-4">
                    <dt className="eyebrow text-muted">{fact.label}</dt>
                    <dd className="text-[0.9375rem] font-medium">{fact.value}</dd>
                  </div>
                ))}
              </dl>
            </TextReveal>
          </div>

          {/* Editorial column */}
          <div className="lg:col-span-6 lg:col-start-7">
            <SectionHeading
              id="founder-heading"
              index="04"
              eyebrow={founder.eyebrow}
              lines={founder.heading}
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

            <div className="mt-12">
              <ArrowLink href="/about" size="md">
                The full legacy
              </ArrowLink>
            </div>
          </div>
        </div>
      </PageContainer>
    </SectionReveal>
  );
}
