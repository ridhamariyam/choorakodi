import Image from "next/image";
import { affiliationLogo } from "@/data/affiliations";
import { monoStyle } from "./fonts";
import { ScrollWords } from "./Caption";
import { cn } from "@/lib/utils";

/** "Affiliated to the District Sports Council" → "District Sports Council". */
const AFFILIATED = /^affiliated to (the )?/i;

/**
 * Closing list of the 2026 chapter: the academy's affiliations and
 * recognition, as listed on the About page. The bodies it is affiliated to
 * are gathered under one label, so the word is said once rather than on
 * every row, each beside its crest; everything else is recognition. Each
 * group is two even columns; an odd last entry is centred on its own row.
 */
export function Recognition({ title, items }: { title: string; items: string[] }) {
  if (items.length === 0) return null;

  const groups = [
    { label: "Affiliated to", items: items.filter((item) => AFFILIATED.test(item)).map((item) => item.replace(AFFILIATED, "")) },
    { label: "Recognition", items: items.filter((item) => !AFFILIATED.test(item)) },
  ].filter((group) => group.items.length > 0);

  return (
    <section
      data-nav-theme="light"
      aria-labelledby="home-recognition"
      className="gutter relative pb-[16vw] text-[#1f1d1e] md:pb-[10vw]"
      style={monoStyle}
    >
      <h2
        id="home-recognition"
        data-scrub-text
        className="m-0 text-center text-[max(15px,3.6vw)] font-bold uppercase tracking-[0.32em] md:text-[max(12px,1.1vw)]"
      >
        <ScrollWords text={title} bold />
      </h2>
      {groups.map((group) => (
        <div key={group.label} className="mx-auto mt-[10vw] max-w-[88vw] first-of-type:mt-[6vw] md:mt-[4vw] md:max-w-[70vw] md:first-of-type:mt-[3vw]">
          <h3
            data-scrub-text
            className="m-0 mb-[3vw] text-[max(11px,3vw)] font-medium uppercase tracking-[0.28em] opacity-60 md:mb-[1vw] md:text-[max(12px,0.8vw)]"
          >
            <ScrollWords text={group.label} />
          </h3>
          <ul data-scrub-text className="m-0 grid list-none grid-cols-1 gap-x-[4vw] p-0 md:grid-cols-2">
            {group.items.map((item, i) => {
              const logo = affiliationLogo(item);
              const lastAlone = group.items.length % 2 === 1 && i === group.items.length - 1;
              return (
                <li
                  key={item}
                  className={cn(
                    "flex items-center gap-[0.8em] py-[3vw] text-[max(15px,4.4vw)] leading-snug font-bold md:py-[1.2vw] md:text-[max(15px,1.35vw)]",
                    lastAlone && "md:col-span-2 md:justify-center md:text-center",
                  )}
                >
                  {logo ? (
                    <Image
                      src={logo.src}
                      alt=""
                      width={logo.width}
                      height={logo.height}
                      sizes="64px"
                      className="h-[2.6em] w-[2.6em] shrink-0 object-contain mix-blend-multiply"
                    />
                  ) : null}
                  <span>
                    <ScrollWords text={item} bold />
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </section>
  );
}
