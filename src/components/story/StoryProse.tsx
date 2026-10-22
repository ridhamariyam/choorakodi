import { highlight } from "@/lib/highlight";
import { ScrollWords } from "./Caption";
import { faceStyle, monoStyle } from "./fonts";

export type ProseItem = {
  /** Small label over the text, as the recognition list sets its groups. */
  label?: string;
  text: string;
};

/**
 * A stretch of the chronicle told as prose rather than captions: a heading
 * in the chapter face, then paragraphs down the middle that light up word by
 * word, their key phrases bold. It takes part in the trail and the year
 * counter like any chapter.
 */
export function StoryProse({
  id,
  heading,
  items,
  highlights,
  counter,
  trail,
  bg,
}: {
  id: string;
  heading: string;
  items: ProseItem[];
  highlights: string[];
  counter: string;
  trail: "left" | "right";
  bg: string;
}) {
  if (items.length === 0) return null;

  return (
    <section
      id={id}
      data-chapter
      data-bg={bg}
      data-trail-side={trail}
      data-counter={counter}
      data-nav-theme="light"
      aria-labelledby={`${id}-heading`}
      className="gutter relative z-[1] pb-[16vw] pt-[30vw] text-[#1f1d1e] md:pb-[10vw] md:pt-[22vw]"
    >
      <h2
        id={`${id}-heading`}
        data-scrub-text
        style={faceStyle.archivo}
        className="m-0 text-center text-[11vw] leading-[0.95] uppercase md:text-[4.6vw]"
      >
        <ScrollWords text={heading} />
      </h2>

      <div style={monoStyle} className="mx-auto mt-[10vw] max-w-[88vw] space-y-[10vw] text-center md:mt-[4vw] md:max-w-[52vw] md:space-y-[4vw]">
        {items.map((item) =>
          item.text.split(/\n\s*\n/).map((text, i) => (
            <div key={`${item.label ?? ""}${i}`}>
              {item.label && i === 0 ? (
                <h3
                  data-scrub-text
                  className="m-0 mb-[3vw] text-[3vw] font-medium uppercase tracking-[0.28em] opacity-60 md:mb-[1vw] md:text-[0.8vw]"
                >
                  <ScrollWords text={item.label} />
                </h3>
              ) : null}
              <p data-scrub-text className="m-0 text-[4.4vw] leading-[1.3] font-medium md:text-[1.45vw] md:leading-[1.35]">
                {highlight(text, highlights).map((part, j) => (
                  <ScrollWords key={j} text={part.text} bold={part.bold} />
                ))}
              </p>
            </div>
          )),
        )}
      </div>
    </section>
  );
}
