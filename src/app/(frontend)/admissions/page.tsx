import type { Metadata } from "next";

import { PageHeader } from "@/components/layout/PageHeader";
import { PageContainer } from "@/components/layout/PageContainer";
import { SectionReveal } from "@/components/animation/SectionReveal";
import { SectionHeading } from "@/components/content/SectionHeading";
import { PendingCopy } from "@/components/content/PendingCopy";
import { TextReveal } from "@/components/animation/TextReveal";
import { FAQ } from "@/components/content/FAQ";
import { WhatsAppButton } from "@/components/contact/WhatsAppButton";
import { Button } from "@/components/ui/Button";
import { ContactBlock } from "@/components/contact/ContactBlock";
import { MapBlock } from "@/components/contact/MapBlock";
import { JsonLd } from "@/components/layout/JsonLd";
import { breadcrumbSchema, faqSchema } from "@/lib/schema";
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
  const { site, admissions, faq } = await getContent();
  return (
    <>
      <PageHeader
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

      {/* Practical detail --------------------------------------------------- */}
      <SectionReveal tone="bone" spacing="lg" aria-labelledby="admissions-detail">
        <PageContainer>
          <SectionHeading
            id="admissions-detail"
            index="02"
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
                {admissions.scheduleTitle}
              </h3>
              {admissions.scheduleItems.length > 0 ? (
                <ul className="mt-6 space-y-3 text-lead text-ink/72">
                  {admissions.scheduleItems.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              ) : null}
              <PendingCopy className="mt-7" label="Timings pending">
                {admissions.schedulePending}
              </PendingCopy>
            </div>

            <div data-reveal className="border-t border-ink/12 pt-8">
              <h3 className="text-title font-semibold tracking-[-0.024em]">
                {admissions.feesTitle}
              </h3>
              <PendingCopy className="mt-7" label="Fees pending">
                {admissions.feesPending}
              </PendingCopy>
            </div>
          </div>
        </PageContainer>
      </SectionReveal>

      {/* Location ----------------------------------------------------------- */}
      <SectionReveal tone="bone" spacing="lg" aria-labelledby="admissions-location">
        <PageContainer>
          <div className="grid gap-14 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <SectionHeading
                id="admissions-location"
                index="03"
                eyebrow="Location"
                lines={["Where to", "find us."]}
                size="headline"
                className="mb-12"
              />
              <ContactBlock />
            </div>
            <div className="lg:col-span-6 lg:col-start-7 lg:pt-6">
              <MapBlock />
            </div>
          </div>
        </PageContainer>
      </SectionReveal>

      {/* FAQ ----------------------------------------------------------------- */}
      <SectionReveal tone="bone" spacing="lg" aria-labelledby="admissions-faq">
        <PageContainer>
          <div className="grid gap-14 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <div className="lg:sticky lg:top-32">
                <SectionHeading
                  id="admissions-faq"
                  index="04"
                  eyebrow="Questions"
                  lines={["Common", "questions."]}
                  size="headline"
                />
              </div>
            </div>
            <div className="lg:col-span-7 lg:col-start-6">
              <FAQ items={faq.admissions} defaultOpen={0} />
            </div>
          </div>
        </PageContainer>
      </SectionReveal>

      <JsonLd schema={faqSchema(faq.admissions)} />
      <JsonLd
        schema={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Admissions", path: "/admissions" },
        ])}
      />
    </>
  );
}
