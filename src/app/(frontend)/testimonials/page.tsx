import type { Metadata } from "next";

import { PageHeader } from "@/components/layout/PageHeader";
import { NextChapter } from "@/components/story/NextChapter";
import { chapterLabel } from "@/data/navigation";
import { PageContainer } from "@/components/layout/PageContainer";
import { SectionReveal } from "@/components/animation/SectionReveal";
import { Quote } from "@/components/content/Quote";
import { TextReveal } from "@/components/animation/TextReveal";
import { ImageReveal } from "@/components/animation/ImageReveal";
import { CTASection } from "@/components/content/CTASection";
import { JsonLd } from "@/components/layout/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";
import { publishableTestimonials } from "@/data/testimonials";
import { cn } from "@/lib/utils";
import { getContent } from "@/lib/content";

export async function generateMetadata(): Promise<Metadata> {
  const { site, testimonials } = await getContent();
  return buildMetadata(
    {
      title: "Testimonials",
      description:
        "Student accounts from Choorakkodi Martial Arts Academy, Kozhikode — voices from inside the kalari.",
      path: "/testimonials",
      // Every record is currently a marked placeholder. Nothing here should be
      // indexed until real, attributable testimonials exist.
      noindex: publishableTestimonials(testimonials).length === 0,
    },
    site,
  );
}

/**
 * Long-form testimonial stories rather than review cards.
 *
 * No Review or AggregateRating structured data is emitted anywhere on this
 * page: fabricating either would be a direct policy violation, and the
 * records below are all placeholders.
 */
export default async function TestimonialsPage() {
  const { testimonials } = await getContent();
  return (
    <>
      <PageHeader
        chapter={chapterLabel("/testimonials")}
        eyebrow="Voices"
        lines={["Voices", "from the", "kalari."]}
        standfirst="Accounts from people who train here. Collected on the record, with permission to publish the name and the photograph."
        tone="ink"
        grain
      />

      {publishableTestimonials(testimonials).length === 0 ? (
        <SectionReveal tone="ink" spacing="sm" grain>
          <PageContainer>
            <p className="measure text-lead text-bone/70">
              Accounts are being collected from students and families at the academy.
            </p>
          </PageContainer>
        </SectionReveal>
      ) : null}

      {testimonials.map((item, index) => {
        const dark = index % 2 === 0;
        const flip = index % 2 === 1;

        return (
          <SectionReveal
            key={item.id}
            tone={dark ? "ink" : "bone"}
            grain={dark}
            spacing="lg"
            aria-labelledby={`voice-${item.id}`}
          >
            <PageContainer>
              <div className="grid gap-12 lg:grid-cols-12 lg:gap-14">
                <div
                  className={cn(
                    "lg:col-span-4",
                    flip ? "lg:order-2 lg:col-start-9" : "lg:order-1",
                  )}
                >
                  <ImageReveal
                    slot={item.image}
                    ratio="4 / 5"
                    tone={dark ? "ink" : "bone"}
                    index={String(index + 1).padStart(2, "0")}
                    wrapperClassName="w-full"
                    sizes="(max-width: 1024px) 92vw, 30vw"
                  />
                </div>

                <div
                  className={cn(
                    "lg:col-span-7",
                    flip ? "lg:order-1 lg:col-start-1" : "lg:order-2 lg:col-start-6",
                  )}
                >
                  <span id={`voice-${item.id}`} className="sr-only">
                    {`Testimonial from ${item.name}`}
                  </span>

                  <Quote
                    quote={item.quote}
                    attribution={item.name}
                    meta={item.meta}
                    tone={dark ? "dark" : "light"}
                  />

                  {item.story ? (
                    <TextReveal delay={0.2} className="mt-12">
                      <p
                        className={cn(
                          "measure text-lead",
                          dark ? "text-bone/62" : "text-ink/72",
                        )}
                      >
                        {item.story}
                      </p>
                    </TextReveal>
                  ) : null}

                  {/* The page says once, at the top, that these are placeholders. */}
                </div>
              </div>
            </PageContainer>
          </SectionReveal>
        );
      })}

      <CTASection
        eyebrow="Your turn"
        lines={["Train, then", "tell us."]}
        body="Students who have trained here and would like to contribute a testimonial are welcome to get in touch."
        message="Hello Choorakkodi — I train at the academy and would like to share my experience."
        whatsappLabel="Share your story"
        secondary={{ label: "Admissions", href: "/admissions" }}
      />

      <NextChapter from="/testimonials" />

      <JsonLd
        schema={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Testimonials", path: "/testimonials" },
        ])}
      />
    </>
  );
}
