import type { ReactNode } from "react";
import { SplitHeading } from "@/components/animation/SplitHeading";
import { TextReveal } from "@/components/animation/TextReveal";
import { SectionReveal, type SectionTone } from "@/components/animation/SectionReveal";
import { ScrollWords } from "@/components/story/Caption";
import { Trail } from "@/components/story/Trail";
import { faceFor } from "@/components/story/fonts";
import { PageContainer } from "./PageContainer";

export type PageHeaderProps = {
  eyebrow: string;
  lines: string[];
  /** Reading text, when the visual line breaks differ from it. */
  label?: string;
  standfirst?: string;
  tone?: SectionTone;
  /** Printed under the title, e.g. "Kozhikode, Kerala". */
  meta?: string;
  size?: "display" | "mega";
  children?: ReactNode;
  grain?: boolean;
};

/**
 * The opening of every page below the home page, built like one of the
 * homepage chronicle's chapters: the trail comes in, the academy mark and a
 * letterspaced kicker, a giant title in an era face over a taupe disc, then
 * the standfirst as a typewriter caption that lights up as you scroll.
 */
export function PageHeader({
  eyebrow,
  lines,
  label,
  standfirst,
  tone = "bone",
  meta,
  size = "mega",
  children,
  grain = false,
}: PageHeaderProps) {
  const seed = lines.join(" ");
  const face = faceFor(seed);

  return (
    <SectionReveal tone={tone} grain={grain} spacing="none" className="overflow-hidden pb-[14vw] text-[#1f1d1e] md:pb-[7vw]">
      <Trail id="page-header" side={seed.length % 2 === 0 ? "left" : "right"} />

      <PageContainer className="relative z-[1] pt-[34vw] md:pt-[15vw]">
        <TextReveal y={14}>
          <div className="flex flex-col items-center gap-[1.6vw] md:gap-[0.6vw]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/brand/logo-square.svg" alt="" aria-hidden="true" className="story-knockout h-auto w-[10vw] md:w-[4.2vw]" />
            <span className="text-center text-[2.6vw] uppercase tracking-[0.32em] md:text-[0.8vw]">{eyebrow}</span>
          </div>
        </TextReveal>

        <div className="relative mt-[3vw] md:mt-[1.2vw]">
          <span
            aria-hidden="true"
            className="story-disc absolute left-1/2 top-1/2 -z-10 size-[46vw] rounded-full bg-[#c4a487] md:size-[26vw]"
          />
          <SplitHeading
            as="h1"
            lines={lines}
            label={label}
            face={face}
            immediate
            stagger={0.09}
            className="text-center leading-[0.9]"
            style={{
              fontSize: size === "mega" ? "clamp(3.5rem, 13vw, 14rem)" : "clamp(3rem, 9vw, 10rem)",
            }}
          />
        </div>

        {meta ? (
          <p className="mt-[5vw] text-center text-[2.6vw] uppercase tracking-[0.32em] opacity-60 md:mt-[2vw] md:text-[0.8vw]">
            {meta}
          </p>
        ) : null}

        {standfirst ? (
          <p
            data-scrub-text
            className="mx-auto mt-[8vw] max-w-[88vw] text-center text-[4.4vw] leading-[1.25] font-medium md:mt-[4vw] md:max-w-[52vw] md:text-[1.75vw] md:leading-[1.2]"
          >
            <ScrollWords text={standfirst} />
          </p>
        ) : null}

        {children}
      </PageContainer>
    </SectionReveal>
  );
}
