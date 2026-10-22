import type { Metadata } from "next";
import Link from "next/link";

import { PageHeader } from "@/components/layout/PageHeader";
import { NextChapter } from "@/components/story/NextChapter";
import { KineticMura } from "@/components/story/KineticMura";
import { chapterLabel } from "@/data/navigation";
import { PageContainer } from "@/components/layout/PageContainer";
import { SectionReveal } from "@/components/animation/SectionReveal";
import { SectionHeading } from "@/components/content/SectionHeading";
import { EditorialText } from "@/components/content/EditorialText";
import { PendingCopy } from "@/components/content/PendingCopy";
import { TextReveal } from "@/components/animation/TextReveal";
import { ImageReveal } from "@/components/animation/ImageReveal";
import { ParallaxImage } from "@/components/animation/ParallaxImage";
import { ScaleImage } from "@/components/animation/ScaleImage";
import { HorizontalScroll } from "@/components/animation/HorizontalScroll";
import { LineReveal } from "@/components/animation/LineReveal";
import { CTASection } from "@/components/content/CTASection";
import { JsonLd } from "@/components/layout/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";
import { formatLocality } from "@/data/site";
import { getContent } from "@/lib/content";

export async function generateMetadata(): Promise<Metadata> {
  const { site } = await getContent();
  return buildMetadata(
    {
      title: "Kalarippayattu",
      description:
        "Kalarippayattu at Choorakkodi, Chelavoor: Meythari, Kolthari, Angathari and Verumkai. Sub-junior training for ages 6–14 and championship coaching.",
      path: "/kalarippayattu",
    },
    site,
  );
}

export default async function KalarippayattuPage() {
  const { site, kalarippayattu: page } = await getContent();
  return (
    <>
      <PageHeader
        chapter={chapterLabel("/kalarippayattu")}
        eyebrow={page.eyebrow}
        lines={page.heading}
        label="Kalarippayattu."
        standfirst={page.standfirst}
        tone="ink"
        grain
        meta={formatLocality(site)}
      />

      {/* Full-bleed plate, scrubbed down to rest. */}
      <SectionReveal tone="ink" spacing="none" className="pb-24 md:pb-32">
        <ScaleImage
          slot={page.images.hero}
          ratio="21 / 9"
          tone="ink"
          wrapperClassName="w-full"
          sizes="100vw"
          from={1.16}
        />
      </SectionReveal>

      {/* What is it -------------------------------------------------------- */}
      <SectionReveal tone="bone" spacing="lg" aria-labelledby="kp-what">
        <PageContainer>
          <div className="grid gap-14 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <SectionHeading
                id="kp-what"
                index="01"
                eyebrow="The art"
                lines={["What is", "Kalari", "ppayattu?"]}
                label="What is Kalarippayattu?"
                size="headline"
              />
            </div>
            <div className="lg:col-span-6 lg:col-start-7">
              <EditorialText paragraphs={page.what.body} lead />

              <div className="mt-16">
                <LineReveal />
                <h3 className="mt-8 text-title font-semibold tracking-[-0.024em]">
                  {page.style.title}
                </h3>
                <p className="measure mt-5 text-lead text-ink/72">{page.style.body}</p>
                <PendingCopy className="mt-8">{page.style.pending}</PendingCopy>
              </div>
            </div>
          </div>
        </PageContainer>
      </SectionReveal>

      {/* The Four Anghanghal, sliding past like the homepage's four styles. */}
      <KineticMura mura={page.anghanghal} id="anghanghal" label="The Four Anghanghal" />

      {/* Training stages — horizontal ------------------------------------- */}
      <SectionReveal
        tone="wenge"
        spacing="none"
        grain
        aria-labelledby="kp-stages"
        className="py-24 md:py-32"
      >
        <PageContainer className="pb-10 md:pb-16">
          <div className="grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-6">
              <SectionHeading
                id="kp-stages"
                index="02"
                eyebrow="Training stages"
                lines={["Four stages,", "one order."]}
                size="headline"
                tone="dark"
              />
            </div>
            <TextReveal delay={0.15} className="lg:col-span-4 lg:col-start-9 lg:self-end">
              <p className="measure text-lead text-bone/60">
                The sequence is the safeguard. The body is built before it is armed, and the bare
                hand comes last because it is the most consequential.
              </p>
              <p className="eyebrow mt-8 text-bone/35">Scroll sideways →</p>
            </TextReveal>
          </div>
        </PageContainer>

        <HorizontalScroll railClassName="items-stretch lg:items-center">
          {page.stages.map((stage) => (
            <article
              key={stage.name}
              className="flex w-[82vw] shrink-0 snap-start flex-col justify-center px-[clamp(1.25rem,5vw,5.5rem)] py-10 sm:w-[58vw] lg:w-[40vw] lg:py-0 xl:w-[34vw]"
            >
              <span className="text-[clamp(4rem,11vw,9rem)] font-semibold leading-[0.8] tracking-[-0.05em] text-bone/12">
                {stage.index}
              </span>
              <h3 className="mt-8 text-headline font-semibold tracking-[-0.033em] text-bone">
                {stage.name}
              </h3>
              <p className="eyebrow mt-4 text-soil">{stage.translation}</p>
              <p className="measure mt-7 text-lead text-bone/62">{stage.body}</p>
            </article>
          ))}
        </HorizontalScroll>
      </SectionReveal>

      {/* What training builds --------------------------------------------- */}
      <SectionReveal tone="bone" spacing="lg" aria-labelledby="kp-philosophy">
        <PageContainer>
          <div className="grid gap-14 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <SectionHeading
                id="kp-philosophy"
                index="03"
                eyebrow="Training philosophy"
                lines={["What the", "floor builds."]}
                label={page.philosophy.title}
                size="headline"
              />
              <TextReveal delay={0.12} className="mt-10">
                <p className="measure text-lead text-ink/72">{page.philosophy.intro}</p>
              </TextReveal>
              <ParallaxImage
                slot={page.philosophy.image}
                ratio="4 / 3"
                index="Flexibility"
                wrapperClassName="mt-12 w-full"
                sizes="(max-width: 1024px) 92vw, 40vw"
                strength={8}
              />
            </div>

            <ol className="m-0 grid list-none content-start gap-x-10 p-0 sm:grid-cols-2 lg:col-span-6 lg:col-start-7">
              {page.philosophy.items.map((item, index) => (
                <li key={item.title} data-reveal className="border-t border-ink/12 py-8">
                  <span className="eyebrow text-soil">{String(index + 1).padStart(2, "0")}</span>
                  <h3 className="mt-5 text-title font-semibold tracking-[-0.024em]">{item.title}</h3>
                  <p className="mt-3 text-[0.9375rem] leading-relaxed text-ink/72">{item.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </PageContainer>
      </SectionReveal>

      {/* What students learn ---------------------------------------------- */}
      <SectionReveal tone="bone" spacing="lg" aria-labelledby="kp-learn">
        <PageContainer>
          <div className="grid gap-14 lg:grid-cols-12">
            <div className="lg:col-span-6">
              <SectionHeading
                id="kp-learn"
                index="04"
                eyebrow="Training"
                lines={[page.learn.title]}
                size="headline"
              />

              <ul className="m-0 mt-14 list-none p-0">
                {page.learn.items.map((item, index) => (
                  <li
                    key={item}
                    data-reveal
                    className="flex items-baseline gap-6 border-t border-ink/12 py-6"
                  >
                    <span className="eyebrow shrink-0 text-soil">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="text-lead text-ink/80">{item}</span>
                  </li>
                ))}
                <li aria-hidden="true" className="border-t border-ink/12" />
              </ul>
            </div>

            <div className="lg:col-span-5 lg:col-start-8">
              <ParallaxImage
                slot={page.images.stage}
                ratio="3 / 4"
                index="Training"
                wrapperClassName="w-full"
                sizes="(max-width: 1024px) 92vw, 40vw"
                strength={9}
              />
              <ImageReveal
                slot={page.images.detail}
                ratio="4 / 3"
                index="Weapons"
                wrapperClassName="mt-6 w-full"
                sizes="(max-width: 1024px) 92vw, 40vw"
                delay={0.1}
              />
            </div>
          </div>
        </PageContainer>
      </SectionReveal>

      {/* Who, schedules, fees --------------------------------------------- */}
      <SectionReveal tone="green" spacing="lg" grain aria-labelledby="kp-join">
        <PageContainer>
          <SectionHeading
            id="kp-join"
            index="05"
            eyebrow="Practicalities"
            lines={["Who can join,", "and when."]}
            size="headline"
            tone="dark"
            className="mb-16 md:mb-24"
          />

          <div className="grid gap-12 md:grid-cols-3">
            <div data-reveal className="border-t border-bone/20 pt-8">
              <h3 className="text-title font-semibold text-bone">{page.who.title}</h3>
              <p className="mt-5 text-lead text-bone/70">{page.who.body}</p>
              <PendingCopy tone="dark" className="mt-7">
                {page.who.pending}
              </PendingCopy>
            </div>

            <div data-reveal className="border-t border-bone/20 pt-8">
              <h3 className="text-title font-semibold text-bone">{page.fees.title}</h3>
              <PendingCopy tone="dark" className="mt-7" label="Fees pending">
                {page.fees.pending}
              </PendingCopy>
            </div>

            {/* Batch timings are kept on the Contact page only. */}
            <div data-reveal className="border-t border-bone/20 pt-8">
              <h3 className="text-title font-semibold text-bone">{page.schedule.title}</h3>
              <Link href="/contact#contact-schedule" className="mt-5 inline-block border-b border-current text-lead text-bone/70 hover:text-bone">
                See the batch timings →
              </Link>
            </div>
          </div>
        </PageContainer>
      </SectionReveal>

      {/* Wide training plate ---------------------------------------------- */}
      <SectionReveal tone="bone" spacing="none" className="py-24 md:py-32">
        <ScaleImage
          slot={page.images.wide}
          ratio="21 / 9"
          wrapperClassName="w-full"
          sizes="100vw"
          from={1.12}
        />
      </SectionReveal>

      <CTASection
        eyebrow="Admissions"
        lines={["Book a", "free trial."]}
        body="Start where everyone starts: conditioning, barefoot, on the floor."
        message="Hello Choorakkodi — I would like to book a free Kalarippayattu trial class."
        whatsappLabel="Book a free trial"
        secondary={{ label: "Admissions", href: "/admissions" }}
      />

      <NextChapter from="/kalarippayattu" />

      <JsonLd
        schema={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Kalarippayattu", path: "/kalarippayattu" },
        ])}
      />
    </>
  );
}
