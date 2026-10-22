import type { Metadata } from "next";

import { PageHeader } from "@/components/layout/PageHeader";
import { NextChapter } from "@/components/story/NextChapter";
import { chapterLabel } from "@/data/navigation";
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
  // Heritage and Kalari prints are shown on the Heritage page, not twice.
  const gallery = (await getContent()).gallery.filter((item) => item.category !== "Heritage" && item.category !== "Kalari" && item.image.src);
  return (
    <>
      <PageHeader
        chapter={chapterLabel("/gallery")}
        eyebrow="Images"
        lines={["Gallery."]}
        standfirst="Six decades on one floor: the old prints from the academy's albums beside the kalari as it trains today. Every photograph is the academy's own."
        meta={`${gallery.length} photographs`}
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

      <NextChapter from="/gallery" />

      <JsonLd
        schema={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Gallery", path: "/gallery" },
        ])}
      />
    </>
  );
}
