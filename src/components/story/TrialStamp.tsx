import { useId } from "react";

const SCALLOPS = 44;
const RIM = 95;

/** Perforated postage-stamp edge: small arcs bulging out round a circle. */
const scallopPath = (() => {
  const step = (Math.PI * 2) / SCALLOPS;
  const bump = RIM * Math.sin(step / 2) * 1.08;
  const point = (i: number) =>
    `${(100 + RIM * Math.cos(i * step)).toFixed(2)} ${(100 + RIM * Math.sin(i * step)).toFixed(2)}`;
  let d = `M ${point(0)}`;
  for (let i = 1; i <= SCALLOPS; i++) d += ` A ${bump.toFixed(2)} ${bump.toFixed(2)} 0 0 1 ${point(i)}`;
  return `${d} Z`;
})();

/**
 * Round rubber stamp in the manner of a commemorative postmark: a scalloped
 * ink rim, the offer lettered round the band, and an archive photograph
 * pressed into the centre as a single ink tone.
 */
export function TrialStamp({ image }: { image: string }) {
  const id = useId().replace(/:/g, "");
  const top = `${id}-top`;
  const bottom = `${id}-bottom`;
  const ink = `${id}-ink`;
  const clip = `${id}-clip`;

  return (
    <svg viewBox="0 0 200 200" className="block h-auto w-full" role="img" aria-label="Trial classes available">
      <defs>
        {/* Both arcs run left to right so the lettering reads upright. */}
        <path id={top} d="M 33 100 A 67 67 0 0 1 167 100" />
        <path id={bottom} d="M 19 100 A 81 81 0 0 0 181 100" />
        <clipPath id={clip}>
          <circle cx="100" cy="100" r="58" />
        </clipPath>
        {/* Dark areas of the photo become solid ink, light areas paper. */}
        <filter id={ink} colorInterpolationFilters="sRGB">
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  -0.9 -1.8 -0.3 0 1.65"
            result="tone"
          />
          <feComponentTransfer in="tone" result="press">
            <feFuncA type="discrete" tableValues="0 0.6 1 1" />
          </feComponentTransfer>
          <feFlood floodColor="currentColor" />
          <feComposite operator="in" in2="press" />
        </filter>
      </defs>

      <path d={scallopPath} fill="currentColor" />
      <circle cx="100" cy="100" r="88" fill="#efe6d6" />
      <circle cx="100" cy="100" r="86" fill="none" stroke="currentColor" strokeWidth="3" />
      <circle cx="100" cy="100" r="62" fill="none" stroke="currentColor" strokeWidth="2.5" />

      <text fill="currentColor" fontSize="19" letterSpacing="2" textAnchor="middle">
        <textPath href={`#${top}`} startOffset="50%">
          TRIAL CLASSES
        </textPath>
      </text>
      <text fill="currentColor" fontSize="19" letterSpacing="2" textAnchor="middle">
        <textPath href={`#${bottom}`} startOffset="50%">
          AVAILABLE
        </textPath>
      </text>
      <text fill="currentColor" fontSize="13" textAnchor="middle" dominantBaseline="central">
        <tspan x="25" y="100">★</tspan>
        <tspan x="175" y="100">★</tspan>
      </text>

      <g clipPath={`url(#${clip})`} filter={`url(#${ink})`}>
        <image
          href={image}
          x="40"
          y="40"
          width="120"
          height="120"
          preserveAspectRatio="xMidYMid slice"
        />
      </g>
    </svg>
  );
}
