import type { Metadata } from "next";
import { access } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

import { StoryExperience } from "@/components/story/StoryExperience";
import { JsonLd } from "@/components/layout/JsonLd";
import { faqSchema, personSchema } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";
import { getContent } from "@/lib/content";
import { founderPortrait, type StoryPhoto } from "@/data/story";

/** The founder's portrait, if its file has been added to public/images/founder. */
async function findFounderPortrait(): Promise<StoryPhoto | null> {
  for (const ext of ["jpg", "jpeg", "png", "webp"]) {
    const file = `/images/founder/${founderPortrait.basename}.${ext}`;
    const disk = path.join(process.cwd(), "public", file);
    try {
      await access(disk);
      const { width = 1200, height = 1500 } = await sharp(disk).metadata();
      return { src: file, alt: founderPortrait.alt, width, height, x: 0, y: 0, w: 0, rotate: -2, speed: 0.2 };
    } catch {
      /* not this extension */
    }
  }
  return null;
}

export async function generateMetadata(): Promise<Metadata> {
  const { site } = await getContent();
  return buildMetadata(
    {
      title: `${site.name} — Kalarippayattu in Kozhikode, Kerala since ${site.foundedYear}`,
      description: site.description,
      path: "/",
    },
    site,
  );
}

/**
 * Home — a single scrolling chronicle of the academy, 1960 to 2026.
 *
 * The previous section-based homepage components remain in
 * src/components/home and are still used by other routes where relevant.
 */
export default async function HomePage() {
  const [{ site, story, about, founder, faq }, portrait] = await Promise.all([getContent(), findFounderPortrait()]);

  // Every FAQ on the site lives here, joining questions first; only answered
  // ones, and each question once. Left out: questions whose answer the page
  // already tells (branches → "Who carries it now", events → "Beyond
  // Kerala", "Can children train?" → "What age can students join?"), and the
  // address and timings, which the Contact page holds.
  const seen = new Set<string>([
    "Can children train?",
    "Are other Choorakkodi kalaris branches of this academy?",
    "Does the academy perform at events?",
    "Where is the academy?",
    "What are the class timings and fees?",
  ]);
  const homeFaq = [...faq.admissions, ...faq.kalarippayattu, ...faq.marma].filter(
    (item) => !item.pending && !seen.has(item.question) && Boolean(seen.add(item.question)),
  );
  const faqJson = faqSchema(homeFaq);

  return (
    <>
      <StoryExperience
        story={story}
        portrait={portrait}
        recognition={about.recognition}
        faq={homeFaq}
        // The founder's journey; his founding of the kalari and the treatment
        // centre (the rest of his story) are the chapters around it.
        founder={{
          items: founder.intro.split(/\n\s*\n/).slice(0, 2).map((text) => ({ text })),
          highlights: founder.highlights,
        }}
        academy={{
          items: about.sections.map((section) => ({ label: section.title, text: section.body })),
          highlights: about.highlights,
        }}
      />
      <JsonLd schema={personSchema(site)} />
      {faqJson ? <JsonLd schema={faqJson} /> : null}
    </>
  );
}
