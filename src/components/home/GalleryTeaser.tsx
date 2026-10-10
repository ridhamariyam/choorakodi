import { ImageReveal } from "@/components/animation/ImageReveal";
import { ParallaxImage } from "@/components/animation/ParallaxImage";
import { getContent } from "@/lib/content";

/**
 * Asymmetric six-image composition. The grid is hand-placed rather than
 * generated: an even grid of six would read as a contact sheet, and the
 * offsets are what make it feel like a spread.
 */
export async function GalleryTeaser() {
  const { galleryTeaser } = await getContent();
  const [a, b, c, d, e, f] = galleryTeaser;

  return (
    <div className="grid grid-cols-12 gap-x-4 gap-y-10 sm:gap-x-6 md:gap-y-16">
      {a ? (
        <ParallaxImage
          slot={a.image}
          ratio="4 / 5"
          index="01"
          caption={a.caption}
          wrapperClassName="col-span-7 md:col-span-4"
          sizes="(max-width: 768px) 58vw, 30vw"
          strength={9}
        />
      ) : null}

      {b ? (
        <ImageReveal
          slot={b.image}
          ratio="3 / 4"
          index="02"
          wrapperClassName="col-span-5 md:col-span-3 md:mt-28"
          sizes="(max-width: 768px) 42vw, 22vw"
        />
      ) : null}

      {c ? (
        <ImageReveal
          slot={c.image}
          ratio="16 / 11"
          index="03"
          caption={c.caption}
          wrapperClassName="col-span-12 md:col-span-5 md:mt-12"
          sizes="(max-width: 768px) 92vw, 38vw"
        />
      ) : null}

      {d ? (
        <ImageReveal
          slot={d.image}
          ratio="4 / 5"
          index="04"
          wrapperClassName="col-span-6 md:col-span-3 md:col-start-2"
          sizes="(max-width: 768px) 46vw, 22vw"
        />
      ) : null}

      {e ? (
        <ParallaxImage
          slot={e.image}
          ratio="3 / 4"
          index="05"
          caption={e.caption}
          wrapperClassName="col-span-6 md:col-span-4 md:-mt-16"
          sizes="(max-width: 768px) 46vw, 30vw"
          strength={11}
        />
      ) : null}

      {f ? (
        <ImageReveal
          slot={f.image}
          ratio="16 / 10"
          index="06"
          wrapperClassName="col-span-12 md:col-span-3 md:mt-20"
          sizes="(max-width: 768px) 92vw, 22vw"
        />
      ) : null}
    </div>
  );
}
