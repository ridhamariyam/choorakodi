import { SectionReveal } from "@/components/animation/SectionReveal";
import { ParallaxImage } from "@/components/animation/ParallaxImage";
import { ImageReveal } from "@/components/animation/ImageReveal";
import { SectionHeading } from "@/components/content/SectionHeading";
import { EditorialText } from "@/components/content/EditorialText";
import { PendingCopy } from "@/components/content/PendingCopy";
import { PageContainer } from "@/components/layout/PageContainer";
import { SectionSlope } from "@/components/layout/SectionSlope";
import { ArrowLink } from "@/components/ui/ArrowLink";
import { getContent } from "@/lib/content";

/**
 * Section 01 — the statement that sets the register for the whole site.
 *
 * Carries the page's only <h1>: the hero above it is a wordless plate, so the
 * first words on the page are here.
 *
 * The top edge is a diagonal rather than a flat join. The hero's closing sword
 * zoom drives into this cut, and the wedge continues the hero's black down
 * past the boundary so the two read as one movement.
 */
export async function LegacyIntro() {
  const { homeIntro } = await getContent();
  return (
    <SectionReveal id="legacy" tone="bone" spacing="xl" aria-labelledby="legacy-heading">
      <SectionSlope tone="ink" direction="down-right" />

      <PageContainer className="relative z-10">
        <div className="grid gap-16 lg:grid-cols-12 lg:gap-10">
          {/* Eight columns, not seven: at the display size "of discipline."
              needs the extra track or it breaks onto a third line. */}
          <div className="lg:col-span-8">
            <SectionHeading
              as="h1"
              id="legacy-heading"
              index="01"
              eyebrow={homeIntro.eyebrow}
              lines={homeIntro.heading}
              size="display"
            />
          </div>

          <div className="lg:col-span-4 lg:col-start-9 lg:pt-4">
            <EditorialText paragraphs={homeIntro.body} />
            <PendingCopy className="mt-10">{homeIntro.pending}</PendingCopy>
            <div className="mt-12">
              <ArrowLink href="/about" size="md">
                Explore the legacy
              </ArrowLink>
            </div>
          </div>
        </div>

        {/* Offset pair: a tall plate and a small counterweight. */}
        <div className="mt-24 grid grid-cols-12 gap-4 sm:gap-6 md:mt-36">
          <ParallaxImage
            slot={homeIntro.image}
            ratio="16 / 10"
            index="Kalari"
            wrapperClassName="col-span-12 md:col-span-8"
            sizes="(max-width: 768px) 92vw, 62vw"
            strength={10}
          />
          <ImageReveal
            slot={homeIntro.secondaryImage}
            ratio="3 / 4"
            index="Training"
            wrapperClassName="col-span-7 md:col-span-3 md:col-start-10 md:mt-24"
            sizes="(max-width: 768px) 56vw, 24vw"
            delay={0.15}
          />
        </div>
      </PageContainer>
    </SectionReveal>
  );
}
