import { SectionReveal } from "@/components/animation/SectionReveal";
import { SectionHeading } from "@/components/content/SectionHeading";
import { PageContainer } from "@/components/layout/PageContainer";
import { cn } from "@/lib/utils";
import { getContent } from "@/lib/content";

/**
 * Section 05 — why Choorakkodi.
 *
 * Five entries in a staggered two-column arrangement rather than a five-up
 * grid: an odd number in an even grid always leaves a hole, and the offset
 * reads as composition instead of an accident.
 */
export async function PillarsSection() {
  const { pillars } = await getContent();
  return (
    <SectionReveal tone="bone" spacing="xl" aria-labelledby="pillars-heading">
      <PageContainer>
        <div className="grid gap-16 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-32">
              <SectionHeading
                id="pillars-heading"
                index="05"
                eyebrow={pillars.eyebrow}
                lines={pillars.heading}
                size="headline"
              />
            </div>
          </div>

          <ul className="m-0 list-none p-0 lg:col-span-6 lg:col-start-7">
            {pillars.items.map((item, index) => (
              <li
                key={item.index}
                data-reveal
                className={cn(
                  "border-t border-ink/12 py-10 md:py-12",
                  // Alternating indent gives the column a rhythm without
                  // needing a second grid track.
                  index % 2 === 1 && "lg:pl-16",
                )}
              >
                <div className="flex items-baseline gap-6">
                  <span className="eyebrow shrink-0 text-soil">{item.index}</span>
                  <div>
                    <h3 className="text-title font-semibold tracking-[-0.024em]">{item.title}</h3>
                    <p className="measure mt-4 text-lead text-ink/72">{item.body}</p>
                  </div>
                </div>
              </li>
            ))}
            <li aria-hidden="true" className="border-t border-ink/12" />
          </ul>
        </div>
      </PageContainer>
    </SectionReveal>
  );
}
