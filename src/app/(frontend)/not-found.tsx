import type { Metadata } from "next";

import { PageContainer } from "@/components/layout/PageContainer";
import { SectionReveal } from "@/components/animation/SectionReveal";
import { SplitHeading } from "@/components/animation/SplitHeading";
import { TextReveal } from "@/components/animation/TextReveal";
import { LineReveal } from "@/components/animation/LineReveal";
import { MaskedReveal } from "@/components/animation/MaskedReveal";
import { Button } from "@/components/ui/Button";
import { ArrowLink } from "@/components/ui/ArrowLink";
import { getContent } from "@/lib/content";

export const metadata: Metadata = {
  title: "Page not found",
  description: "This page could not be found.",
  robots: { index: false, follow: true },
};

export default async function NotFound() {
  const { notFound: copy, navigation } = await getContent();
  return (
    <SectionReveal
      tone="ink"
      grain
      spacing="none"
      className="flex min-h-[100svh] items-center py-40"
      aria-labelledby="notfound-heading"
    >
      <PageContainer>
        <TextReveal y={14}>
          <p className="eyebrow mb-12 text-soil-ink">Error 404</p>
        </TextReveal>

        <SplitHeading
          as="h1"
          id="notfound-heading"
          lines={copy.heading}
          immediate
          className="text-mega font-semibold text-bone"
        />

        <div className="mt-16 grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <LineReveal tone="dark" />
            <TextReveal delay={0.25} className="mt-8">
              <p className="text-title font-medium tracking-[-0.024em] text-soil-ink">{copy.sub}</p>
              <p className="measure mt-6 text-lead text-bone/62">{copy.body}</p>
            </TextReveal>

            <TextReveal delay={0.35} className="mt-12 flex flex-wrap gap-4">
              <Button href="/" variant="bone" size="lg">
                Back home
              </Button>
              <Button href="/contact" variant="outline" size="lg" className="text-bone">
                Contact us
              </Button>
            </TextReveal>
          </div>

          {/* A wrong turn is a good moment to show the map of the building. */}
          <nav aria-label="Site sections" className="lg:col-span-6 lg:col-start-7">
            <LineReveal tone="dark" />
            <p className="eyebrow mt-8 text-bone/62">Or try one of these</p>
            <MaskedReveal direction="up" delay={0.2}>
              <ul className="m-0 mt-8 grid list-none grid-cols-2 gap-x-8 gap-y-4 p-0">
                {navigation.footer.map((item) => (
                  <li key={item.href}>
                    <ArrowLink href={item.href} tone="bone" size="sm">
                      {item.label}
                    </ArrowLink>
                  </li>
                ))}
              </ul>
            </MaskedReveal>
          </nav>
        </div>
      </PageContainer>
    </SectionReveal>
  );
}
