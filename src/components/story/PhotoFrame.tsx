import type { CSSProperties } from "react";
import Image from "next/image";
import type { StoryPhoto } from "@/data/story";
import { InkDrop } from "@/components/animation/InkDrop";
import { cn } from "@/lib/utils";

/**
 * An archival print in an aged paper mount. Desktop placement is absolute, in
 * vw, read from the data; below md the frames fall back into the flow and
 * stagger left/right so the band still reads as a loose pile of prints.
 *
 * `data-speed` is picked up by the chapter's parallax pass.
 */
export function PhotoFrame({
  photo,
  className,
  sizes = "(min-width: 768px) 32vw, 78vw",
  positioned = true,
}: {
  photo: StoryPhoto;
  className?: string;
  sizes?: string;
  positioned?: boolean;
}) {
  const vars = {
    "--x": `${photo.x}vw`,
    "--y": `${photo.y}vw`,
    "--w": `${photo.w}vw`,
    "--r": `${photo.rotate}deg`,
  } as CSSProperties;

  return (
    <figure
      data-speed={photo.speed}
      style={vars}
      className={cn(
        "story-photo m-0",
        positioned &&
          "relative mx-auto w-[74vw] max-md:odd:-translate-x-[8vw] max-md:even:translate-x-[8vw] max-md:[&+&]:-mt-[10vw] md:absolute md:left-(--x) md:top-(--y) md:mx-0 md:w-(--w)",
        className,
      )}
    >
      <div className="story-mount rotate-(--r)">
        <Image
          src={photo.src}
          alt={photo.alt}
          width={photo.width}
          height={photo.height}
          sizes={sizes}
          className="story-print block h-auto w-full"
        />
        <InkDrop />
      </div>
    </figure>
  );
}
