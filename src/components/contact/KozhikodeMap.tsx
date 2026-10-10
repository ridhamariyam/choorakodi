import type { ReactNode } from "react";
import { IBM_Plex_Mono } from "next/font/google";
import { kozhikodeDistrict as district } from "@/data/kozhikode";
import { cn } from "@/lib/utils";

const plexMono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "600"], display: "swap" });

/**
 * Kozhikode district cut from charcoal paper and laid on a blush ground, the
 * statement printed across it and a dot on Chelavoor, where the kalari is.
 *
 * The section is a fixed-aspect canvas per breakpoint (2:3 below md, 16:10
 * above), so the oversized, cropped map, the type and the dot are all placed
 * in percentages of it and stay locked together at any width.
 *
 * `transparent` drops the blush ground and grain so the cutout sits straight
 * on the page. `children` are laid over the map: in the open space east of
 * the district on desktop, over its foot below md.
 */
export function KozhikodeMap({
  className,
  transparent = false,
  children,
}: {
  className?: string;
  transparent?: boolean;
  children?: ReactNode;
}) {
  return (
    <section
      aria-labelledby="kozhikode-roots"
      data-nav-theme="light"
      className={cn(
        "relative w-full overflow-hidden",
        !transparent && "grain bg-[#D8C9C5]",
        plexMono.className,
        className,
      )}
    >
      <div className="relative aspect-[2/3] w-full md:aspect-[16/10]">
        <svg
          viewBox={`0 0 ${district.width} ${district.height}`}
          aria-hidden="true"
          className="absolute -left-[42%] -top-[11.87%] h-auto w-[160%] max-w-none drop-shadow-[0_1px_1px_rgb(48_30_24_/_0.22)] md:-left-[21.875%] md:-top-[53.2%] md:w-[93.75%]"
        >
          <defs>
            <filter id="kozhikode-paper" x="-3%" y="-3%" width="106%" height="106%" colorInterpolationFilters="sRGB">
              {/* A torn, hand-cut edge rather than a vector-perfect one. */}
              <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="3" seed="7" result="warp" />
              <feDisplacementMap in="SourceGraphic" in2="warp" scale="5" xChannelSelector="R" yChannelSelector="G" result="cut" />
              {/* Fine fibres: pale flecks, kept inside the cut. */}
              <feTurbulence type="fractalNoise" baseFrequency="1.1" numOctaves="2" seed="3" result="fine" />
              <feColorMatrix in="fine" type="matrix" values="0 0 0 0 0.91  0 0 0 0 0.88  0 0 0 0 0.84  0 0 0 2.4 -1.5" result="flecks" />
              <feComposite in="flecks" in2="cut" operator="in" result="fibres" />
              {/* Soft mottling across the sheet, the way thick paper takes ink unevenly. */}
              <feTurbulence type="fractalNoise" baseFrequency="0.008" numOctaves="2" seed="11" result="broad" />
              <feColorMatrix in="broad" type="matrix" values="0 0 0 0 0.3  0 0 0 0 0.28  0 0 0 0 0.27  0 0 0 0.5 -0.18" result="mottle" />
              <feComposite in="mottle" in2="cut" operator="in" result="mottled" />
              <feMerge>
                <feMergeNode in="cut" />
                <feMergeNode in="mottled" />
                <feMergeNode in="fibres" />
              </feMerge>
            </filter>
          </defs>
          <path d={district.path} fill="#2e2c2c" filter="url(#kozhikode-paper)" />
          <circle cx={district.kalari.x} cy={district.kalari.y} r="6.5" fill="#121111" stroke="#E7E0D5" strokeOpacity="0.16" strokeWidth="1" />
        </svg>

        <h2
          id="kozhikode-roots"
          className="absolute left-[14%] top-[46%] m-0 max-w-[62vw] -translate-y-1/2 text-[5.6vw] font-normal leading-[1.6] tracking-[0.01em] text-[#E7E0D5] opacity-95 md:left-[25%] md:top-[48%] md:max-w-none md:text-[2.2vw] md:leading-[1.7]"
        >
          Rooted in <strong className="font-semibold">Kozhikode</strong>,
          <br className="hidden md:block" /> building <strong className="font-semibold">beyond boundaries.</strong>
        </h2>

        {/* Beside the dot: where the kalari is. */}
        <p className="absolute left-[calc(40.6%+3.2vw)] top-[79.95%] m-0 -translate-y-1/2 text-[2.8vw] uppercase leading-[1.5] tracking-[0.18em] text-[#E7E0D5]/70 md:left-[calc(26.5%+1.4vw)] md:top-[75.9%] md:text-[0.72vw]">
          Chelavoor, Kozhikode
          <span className="block text-[#E7E0D5]/45">11.29° N · 75.85° E</span>
        </p>

        <p className="absolute right-[4%] top-[2%] m-0 text-right text-[2.2vw] leading-[1.5] tracking-[0.08em] text-[#1f1d1e]/45 md:bottom-[1.6%] md:right-[3%] md:top-auto md:text-[0.6vw]">
          Boundary © <br className="md:hidden" />
          OpenStreetMap contributors
        </p>
      </div>

      {children ? (
        <div className="relative z-[2] -mt-[20vw] mr-[6vw] flex justify-end pb-[6vw] md:absolute md:right-[6%] md:top-[12%] md:mr-0 md:mt-0 md:block md:w-[26vw] md:pb-0">
          {children}
        </div>
      ) : null}
    </section>
  );
}
