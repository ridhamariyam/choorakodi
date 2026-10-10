import { FAQ } from "@/components/content/FAQ";
import type { FaqItem } from "@/data/faq";
import { monoStyle } from "./fonts";
import { ScrollWords } from "./Caption";

/**
 * Questions a first-time visitor asks before joining, set after the
 * recognition list in the same ruled, centred, monospaced manner.
 */
export function HomeFaq({ items }: { items: FaqItem[] }) {
  if (items.length === 0) return null;

  return (
    <section
      data-nav-theme="light"
      aria-labelledby="home-faq"
      className="gutter relative pb-[16vw] text-[#1f1d1e] md:pb-[10vw]"
      style={monoStyle}
    >
      <h2
        id="home-faq"
        data-scrub-text
        className="m-0 text-center text-[3.6vw] font-bold uppercase tracking-[0.32em] md:text-[1.1vw]"
      >
        <ScrollWords text="Frequently asked questions" bold />
      </h2>
      <FAQ items={items} className="mx-auto mt-[6vw] max-w-[88vw] md:mt-[3vw] md:max-w-[70vw]" />
    </section>
  );
}
