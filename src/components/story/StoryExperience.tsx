"use client";

import { useRef } from "react";
import type { Story } from "@/lib/content/defaults";
import type { StoryPhoto } from "@/data/story";
import { useGsap } from "@/hooks/useGsap";
import { animateScrubText } from "./motion";
import { SkyHero } from "./hero/SkyHero";
import { Chapter } from "./Chapter";
import { KineticMura } from "./KineticMura";
import { Recognition } from "./Affiliations";
import { HomeFaq } from "./HomeFaq";
import type { FaqItem } from "@/data/faq";
import { ProgrammeStrip } from "./ProgrammeStrip";
import { YearCounter } from "./YearCounter";
import { StoryTrail } from "./StoryTrail";
import { StoryProse, type ProseItem } from "./StoryProse";

/**
 * The homepage chronicle, 1960 → 2026.
 *
 * The ground colour belongs to this wrapper, not to the chapters: as each
 * chapter enters, the wrapper's background is scrubbed from the previous
 * chapter's colour to its own, so the whole page slowly changes era.
 */
export function StoryExperience({
  story,
  portrait = null,
  recognition,
  faq = [],
  founder,
  academy,
}: {
  story: Story;
  portrait?: StoryPhoto | null;
  /** The About page's recognition & affiliations list. */
  recognition: { title: string; items: string[] };
  /** Answered questions from the inner pages' FAQs. */
  faq?: FaqItem[];
  /** The founder's own story, told after the 1960 chapter. */
  founder: { items: ProseItem[]; highlights: string[] };
  /** Lineage, leadership and authenticity, told after the present day. */
  academy: { items: ProseItem[]; highlights: string[] };
}) {
  const { intro, chapters, laterChapters } = story;
  const scope = useRef<HTMLDivElement>(null);

  // Each dated chapter's year counts up from the dated chapter before it.
  const countFrom = new Map<string, number>();
  let previous: number | undefined;
  for (const chapter of [...chapters, ...laterChapters]) {
    const marker = chapter.marker.trim();
    if (!/^\d{4}$/.test(marker)) continue;
    if (previous !== undefined) countFrom.set(chapter.id, previous);
    previous = Number(marker);
  }

  useGsap(
    ({ gsap, root }) => {
      animateScrubText({ gsap, root });

      const sections = Array.from(
        root.querySelectorAll<HTMLElement>("[data-bg]"),
      );
      sections.forEach((section, i) => {
        if (i === 0) return;
        const from = sections[i - 1]?.dataset.bg;
        const to = section.dataset.bg;
        if (!from || !to || from === to) return;
        const scrollTrigger = {
          trigger: section,
          start: "top 85%",
          end: "top 25%",
          scrub: true,
        };
        gsap.fromTo(
          root,
          { backgroundColor: from },
          { backgroundColor: to, ease: "none", immediateRender: false, scrollTrigger },
        );
      });
    },
    [],
    { scope, skipOnReducedMotion: true },
  );

  return (
    <div
      ref={scope}
      className="story relative"
      style={{ backgroundColor: intro.bg }}
    >
      <StoryTrail scope={scope} />
      <SkyHero intro={intro} />
      {chapters.map((chapter, i) => (
        <Chapter
          key={chapter.id}
          chapter={chapter}
          // The first chapter rises over the hero's last, settled viewport.
          overlapHero={i === 0}
          portrait={i === 0 ? portrait : null}
        />
      ))}
      <StoryProse
        id="founder"
        heading="A journey of learning"
        items={founder.items}
        highlights={founder.highlights}
        counter={intro.counter}
        trail="right"
        bg={intro.bg}
        tight
      />
      <KineticMura mura={story.mura} />
      {laterChapters.map((chapter) => (
        <Chapter key={chapter.id} chapter={chapter} countFrom={countFrom.get(chapter.id)} />
      ))}
      <StoryProse
        id="academy"
        heading="Who carries it now"
        items={academy.items}
        highlights={academy.highlights}
        counter={story.range.end}
        trail="right"
        bg={intro.bg}
      />
      <KineticMura mura={story.values} id="values" label="What training builds" />
      <Recognition title={recognition.title} items={recognition.items} />
      <HomeFaq items={faq} />
      <ProgrammeStrip programmes={story.programmes} />

      <div
        aria-hidden="true"
        className="story-grain pointer-events-none fixed inset-0 z-[110]"
      />
      <YearCounter range={story.range} />
    </div>
  );
}
