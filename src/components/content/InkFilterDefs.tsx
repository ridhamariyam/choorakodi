/**
 * Watercolour-ink filters, defined once for the whole document.
 *
 * Every stamp references these by id rather than carrying its own
 * copy — one definition instead of one per blot, and no duplicate ids in the
 * DOM. Rendered from the root layout. If they were ever missing the filter
 * references are simply ignored and the blots render with clean edges, so
 * nothing breaks.
 *
 * There are two on purpose. `ink-bleed` roughens an edge but leaves the fill
 * solid, and is used for the body a year's numerals sit on — mottling that
 * would thin the ink under the text and wreck its contrast on a light ground.
 * `ink-wash` adds the pigment mottling and is used only for the translucent
 * bleed around the outside, where nothing has to stay readable.
 */
export function InkFilterDefs() {
  return (
    <svg aria-hidden="true" focusable="false" className="pointer-events-none absolute h-0 w-0">
      <defs>
        {/* Solid body: edge bleed only. */}
        <filter
          id="ink-bleed"
          x="-20%"
          y="-25%"
          width="140%"
          height="150%"
          colorInterpolationFilters="sRGB"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.013 0.02"
            numOctaves="4"
            seed="11"
            result="warp"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="warp"
            scale="22"
            xChannelSelector="R"
            yChannelSelector="G"
            result="bled"
          />
          <feGaussianBlur in="bled" stdDeviation="0.7" />
        </filter>

        {/* Outer wash: edge bleed plus uneven pigment density. */}
        <filter
          id="ink-wash"
          x="-25%"
          y="-30%"
          width="150%"
          height="160%"
          colorInterpolationFilters="sRGB"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.011 0.018"
            numOctaves="4"
            seed="23"
            result="warp"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="warp"
            scale="30"
            xChannelSelector="R"
            yChannelSelector="G"
            result="bled"
          />
          {/* Pigment settles unevenly: modulate alpha with finer noise, with a
              floor so the wash thins but never breaks into holes. */}
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.05"
            numOctaves="5"
            seed="4"
            result="pigment"
          />
          <feColorMatrix in="pigment" type="luminanceToAlpha" result="pigmentA" />
          <feComponentTransfer in="pigmentA" result="pigmentSoft">
            <feFuncA type="linear" slope="0.62" intercept="0.42" />
          </feComponentTransfer>
          <feComposite in="bled" in2="pigmentSoft" operator="in" result="mottled" />
          <feGaussianBlur in="mottled" stdDeviation="2.2" />
        </filter>
      </defs>
    </svg>
  );
}
