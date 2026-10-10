import { Navigation } from "lucide-react";
import { formatLocality } from "@/data/site";
import { getContent } from "@/lib/content";
import { cn } from "@/lib/utils";

/**
 * Map embed.
 *
 * Loaded lazily — a third-party iframe is the single heaviest thing on a
 * contact page and nothing above it depends on it. Until an exact pin is
 * supplied the embed is centred on the supplied city rather than on an
 * invented address.
 */
export async function MapBlock({ className, tone = "light" }: { className?: string; tone?: "light" | "dark" }) {
  const { site } = await getContent();
  const hasExactPin = Boolean(site.contact.address.street);

  return (
    <div className={cn("w-full", className)}>
      <div
        className={cn(
          "relative aspect-[4/3] w-full overflow-hidden sm:aspect-[16/10] lg:aspect-[3/2]",
          tone === "light" ? "bg-bone-dim" : "bg-ink-soft",
        )}
      >
        <iframe
          src={site.contact.mapEmbedSrc ?? undefined}
          title={`Map showing ${formatLocality(site)}`}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen={false}
          className="absolute inset-0 h-full w-full border-0 grayscale-[0.35] contrast-[1.05]"
        />
      </div>

      <div
        className={cn(
          "mt-5 flex flex-wrap items-center justify-between gap-x-8 gap-y-3",
          tone === "light" ? "text-muted" : "text-bone/50",
        )}
      >
        <p className="eyebrow">
          {hasExactPin ? formatLocality(site) : `${formatLocality(site)} — exact pin pending`}
        </p>
        <a
          href={site.contact.mapDirectionsUrl ?? undefined}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            "group/arrow inline-flex items-center gap-2.5 text-meta font-medium uppercase tracking-[0.18em]",
            tone === "light" ? "text-ink" : "text-bone",
          )}
        >
          <Navigation className="h-3.5 w-3.5" strokeWidth={1.7} />
          <span className="link-underline">Get directions</span>
        </a>
      </div>
    </div>
  );
}
