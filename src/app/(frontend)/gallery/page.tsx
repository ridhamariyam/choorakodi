import type { Metadata } from "next";

import { PageHeader } from "@/components/layout/PageHeader";
import { PageContainer } from "@/components/layout/PageContainer";
import { SectionReveal } from "@/components/animation/SectionReveal";
import { GalleryGrid } from "@/components/gallery/GalleryGrid";
import { CTASection } from "@/components/content/CTASection";
import { JsonLd } from "@/components/layout/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";
import { getContent } from "@/lib/content";

export async function generateMetadata(): Promise<Metadata> {
  const { site } = await getContent();
  return buildMetadata(
    {
      title: "Gallery",
      description:
        "Training, weapons, the kalari, marma, heritage and people — photography from Choorakkodi Martial Arts Academy, Kozhikode.",
      path: "/gallery",
    },
    site,
  );
}

export default async function GalleryPage() {
  const { gallery } = await getContent();
  return (
    <>
      <PageHeader
        eyebrow="Images"
        lines={["Gallery."]}
        standfirst="Six categories, one archive. Every slot below is composed and captioned, waiting on the academy's own photography."
        meta={`${gallery.length} slots`}
      />

      <SectionReveal tone="bone" spacing="md">
        <PageContainer width="wide">
          <GalleryGrid gallery={gallery} />
        </PageContainer>
      </SectionReveal>

      <CTASection
        eyebrow="Visit"
        lines={["See it", "in person."]}
        body="Photographs only carry so much. The floor is the argument."
        message="Hello Choorakkodi — I would like to visit the kalari."
        secondary={{ label: "Admissions", href: "/admissions" }}
      />

      <JsonLd
        schema={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Gallery", path: "/gallery" },
        ])}
      />
    </>
  );
}
