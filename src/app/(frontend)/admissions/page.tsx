import type { Metadata } from "next";
import Link from "next/link";

import { PageHeader } from "@/components/layout/PageHeader";
import { NextChapter } from "@/components/story/NextChapter";
import { chapterLabel } from "@/data/navigation";
import { PageContainer } from "@/components/layout/PageContainer";
import { SectionReveal } from "@/components/animation/SectionReveal";
import { SectionHeading } from "@/components/content/SectionHeading";
import { PendingCopy } from "@/components/content/PendingCopy";
import { EditorialText } from "@/components/content/EditorialText";
import { ParallaxImage } from "@/components/animation/ParallaxImage";
import { TextReveal } from "@/components/animation/TextReveal";
import { WhatsAppButton } from "@/components/contact/WhatsAppButton";
import { Button } from "@/components/ui/Button";
import { JsonLd } from "@/components/layout/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";
import { formatLocality } from "@/data/site";
import { getContent } from "@/lib/content";

export async function generateMetadata(): Promise<Metadata> {
  const { site } = await getContent();
  return buildMetadata(
    {
      title: "Admissions",
      description:
        "Join Choorakkodi Martial Arts Academy in Kozhikode. Message on WhatsApp, book a trial, visit the kalari and begin training.",
      path: "/admissions",
    },
    site,
  );
}

/**
 * The conversion page. Deliberately the least decorated route on the site:
 * one clear path, four steps, and the WhatsApp channel never more than a
 * screen away.
 */
export default async function AdmissionsPage() {
  const { site, admissions } = await getContent();
  return (
    <>
      <PageHeader
        chapter={chapterLabel("/admissions")}
        eyebrow={admissions.eyebrow}
        lines={admissions.heading}
        standfirst={admissions.standfirst}
        meta={formatLocality(site)}
      >
        <TextReveal delay={0.35} className="mt-14 flex flex-wrap gap-4">
          <WhatsAppButton
            label="WhatsApp us"
            message="Hello Choorakkodi — I would like to book a free trial class."
            size="lg"
            magnetic
          />
          <Button
            href={site.contact.mapDirectionsUrl ?? undefined}
            external
            variant="outline"
            size="lg"
            className="text-ink"
          >
            Get directions
          </Button>
        </TextReveal>
      </PageHeader>

      {/* Four steps -------------------------------------------------------- */}
      <SectionReveal tone="ink" spacing="lg" grain aria-labelledby="admissions-steps">
        <PageContainer>
          <SectionHeading
            id="admissions-steps"
            index="01"
            eyebrow="The process"
            lines={["Four steps", "to the floor."]}
            size="headline"
            tone="dark"
            className="mb-16 md:mb-24"
          />

          <ol className="m-0 grid list-none gap-px bg-bone/12 p-0 sm:grid-cols-2 lg:grid-cols-4">
            {admissions.steps.map((step) => (
              <li key={step.index} data-reveal className="bg-ink p-8 lg:p-9">
                <span className="text-[clamp(2.75rem,6vw,4.5rem)] font-semibold leading-none tracking-[-0.045em] text-bone/14">
                  {step.index}
                </span>
                <h3 className="mt-8 text-title font-semibold tracking-[-0.024em] text-bone">
                  {step.title}
                </h3>
                <p className="mt-5 text-[0.9375rem] leading-relaxed text-bone/60">{step.body}</p>
              </li>
            ))}
          </ol>

          <TextReveal delay={0.15} className="mt-14">
            <WhatsAppButton
              label="Start on WhatsApp"
              message="Hello Choorakkodi — I would like to begin the admissions process."
              variant="bone"
              size="lg"
            />
          </TextReveal>
        </PageContainer>
      </SectionReveal>

      {/* A new student's journey --------------------------------------------- */}
      <SectionReveal tone="bone" spacing="lg" aria-labelledby="admissions-journey">
        <PageContainer>
          <div className="grid gap-14 lg:grid-cols-12">
            <div className="lg:col-span-6">
              <SectionHeading
                id="admissions-journey"
                index="02"
                eyebrow="The first years"
                lines={["A new", "student's", "journey."]}
                label={admissions.journey.title}
                size="headline"
              />
              <TextReveal delay={0.12} className="mt-10">
                <p className="measure text-lead text-ink/72">{admissions.journey.intro}</p>
              </TextReveal>

              <ol className="m-0 mt-12 list-none p-0">
                {admissions.journey.items.map((item, index) => (
                  <li
                    key={item.name}
                    data-reveal
                    className="flex items-baseline gap-6 border-t border-ink/12 py-5"
                  >
                    <span className="eyebrow shrink-0 text-soil">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="text-lead text-ink/80">
                      <strong className="font-semibold text-ink">{item.name}</strong>
                      {" — "}
                      {item.detail}
                    </span>
                  </li>
                ))}
                <li aria-hidden="true" className="border-t border-ink/12" />
              </ol>

              <TextReveal delay={0.1} className="mt-10">
                <p className="measure text-[0.9375rem] leading-relaxed text-ink/65">
                  {admissions.journey.note}
                </p>
              </TextReveal>
            </div>

            <div className="lg:col-span-5 lg:col-start-8 lg:pt-6">
              <ParallaxImage
                slot={admissions.journey.image}
                ratio="4 / 5"
                index="Sub-juniors"
                wrapperClassName="w-full"
                sizes="(max-width: 1024px) 92vw, 40vw"
                strength={9}
              />
            </div>
          </div>
        </PageContainer>
      </SectionReveal>

      {/* Practical detail --------------------------------------------------- */}
      <SectionReveal tone="bone" spacing="lg" aria-labelledby="admissions-detail">
        <PageContainer>
          <SectionHeading
            id="admissions-detail"
            index="03"
            eyebrow="Practicalities"
            lines={["What to", "know first."]}
            size="headline"
            className="mb-16 md:mb-20"
          />

          <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
            <div data-reveal className="border-t border-ink/12 pt-8">
              <h3 className="text-title font-semibold tracking-[-0.024em]">
                {admissions.who.title}
              </h3>
              <p className="mt-5 text-[0.9375rem] leading-relaxed text-ink/72">
                {admissions.who.body}
              </p>
              <PendingCopy className="mt-7" label="Age bands pending">
                {admissions.who.pending}
              </PendingCopy>
            </div>

            <div data-reveal className="border-t border-ink/12 pt-8">
              <h3 className="text-title font-semibold tracking-[-0.024em]">
                {admissions.bring.title}
              </h3>
              <ul className="m-0 mt-5 list-none p-0">
                {admissions.bring.items.map((item) => (
                  <li key={item} className="relative py-2 pl-7 text-[0.9375rem] text-ink/72">
                    <span
                      aria-hidden="true"
                      className="absolute left-0 top-[1.15em] h-px w-4 bg-soil"
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div data-reveal className="border-t border-ink/12 pt-8">
              <h3 className="text-title font-semibold tracking-[-0.024em]">
                {admissions.feesTitle}
              </h3>
              <PendingCopy className="mt-7" label="Fees pending">
                {admissions.feesPending}
              </PendingCopy>
            </div>

            {/* Batch timings and the address are kept on the Contact page only. */}
            <div data-reveal className="border-t border-ink/12 pt-8">
              <h3 className="text-title font-semibold tracking-[-0.024em]">
                {admissions.scheduleTitle}
              </h3>
              <Link href="/contact#contact-schedule" className="mt-6 inline-block border-b border-current text-lead text-ink/72 hover:text-ink">
                Timings and directions →
              </Link>
            </div>
          </div>
        </PageContainer>
      </SectionReveal>

      {/* Food and recovery -------------------------------------------------- */}
      <SectionReveal tone="bone" spacing="md" aria-labelledby="admissions-recovery">
        <PageContainer>
          <div className="grid gap-10 border-t border-ink/12 pt-12 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <p className="eyebrow text-soil">Off the floor</p>
              <h3
                id="admissions-recovery"
                className="mt-5 text-title font-semibold tracking-[-0.024em]"
              >
                {admissions.recovery.title}
              </h3>
            </div>
            <div className="lg:col-span-7 lg:col-start-6">
              <EditorialText paragraphs={admissions.recovery.body} size="body" />
            </div>
          </div>
        </PageContainer>
      </SectionReveal>

      <NextChapter from="/admissions" />

      <JsonLd
        schema={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Admissions", path: "/admissions" },
        ])}
      />
    </>
  );
}
