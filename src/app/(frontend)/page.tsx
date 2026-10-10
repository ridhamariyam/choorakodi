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
  const [{ site, story, about, faq }, portrait] = await Promise.all([getContent(), findFounderPortrait()]);

  // The inner pages' FAQs, joining questions first; only answered ones, and
  // each question once. "Can children train?" is left out here: on the
  // homepage it repeats "What age can students join?" just above it.
  const seen = new Set<string>(["Can children train?"]);
  const homeFaq = [...faq.admissions, ...faq.kalarippayattu, ...faq.marma].filter(
    (item) => !item.pending && !seen.has(item.question) && Boolean(seen.add(item.question)),
  );
  const faqJson = faqSchema(homeFaq);

  return (
    <>
      <StoryExperience story={story} portrait={portrait} recognition={about.recognition} faq={homeFaq} />
      <JsonLd schema={personSchema(site)} />
      {faqJson ? <JsonLd schema={faqJson} /> : null}
    </>
  );
}
