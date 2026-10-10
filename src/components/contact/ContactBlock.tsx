import { MapPin, Phone, Clock, Mail } from "lucide-react";
import { addressLines, formatLocality, telHref } from "@/data/site";
import { getContent } from "@/lib/content";
import { PendingCopy } from "@/components/content/PendingCopy";
import { cn } from "@/lib/utils";

type Tone = "light" | "dark";

/**
 * The academy's NAP block.
 *
 * Every line is conditional on real data. Where the brief supplied only the
 * city, only the city is printed — the missing street address is surfaced as
 * a pending note rather than filled with something plausible.
 */
export async function ContactBlock({ tone = "light", className }: { tone?: Tone; className?: string }) {
  const { site } = await getContent();
  const lines = addressLines(site);
  const muted = tone === "light" ? "text-muted" : "text-bone/50";
  const strong = tone === "light" ? "text-ink" : "text-bone";

  return (
    <div className={cn("space-y-10", className)}>
      <Row icon={<MapPin className="h-4 w-4" strokeWidth={1.6} />} label="Address" tone={tone}>
        <p className={cn("text-lead", strong)}>{site.name}</p>
        {lines ? (
          <address className={cn("mt-2 not-italic leading-relaxed", muted)}>
            {lines.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </address>
        ) : (
          <>
            <p className={cn("mt-2", muted)}>{formatLocality(site)}, India</p>
            <PendingCopy tone={tone} className="mt-5" label="Street address pending">
              The full street address has not been supplied yet.
            </PendingCopy>
          </>
        )}
      </Row>

      <Row icon={<Phone className="h-4 w-4" strokeWidth={1.6} />} label="Phone" tone={tone}>
        {site.contact.phone ? (
          <a href={telHref(site)} className={cn("link-underline text-lead", strong)}>
            {site.contact.phone}
          </a>
        ) : (
          <PendingCopy tone={tone} label="Number pending">
            No telephone number has been supplied. Contact runs through WhatsApp until one is.
          </PendingCopy>
        )}
      </Row>

      {site.contact.email ? (
        <Row icon={<Mail className="h-4 w-4" strokeWidth={1.6} />} label="Email" tone={tone}>
          <a href={`mailto:${site.contact.email}`} className={cn("link-underline text-lead", strong)}>
            {site.contact.email}
          </a>
        </Row>
      ) : null}

      <Row icon={<Clock className="h-4 w-4" strokeWidth={1.6} />} label="Hours" tone={tone}>
        {site.contact.openingHours ? (
          <dl className="space-y-2">
            {site.contact.openingHours.map((entry) => (
              <div key={entry.days} className="flex flex-wrap gap-x-6">
                <dt className={cn("w-28 shrink-0", muted)}>{entry.days}</dt>
                <dd className={strong}>{entry.hours}</dd>
              </div>
            ))}
          </dl>
        ) : (
          <PendingCopy tone={tone} label="Timings pending">
            Batch timings are confirmed on WhatsApp so nobody is given an out-of-date schedule.
          </PendingCopy>
        )}
      </Row>
    </div>
  );
}

function Row({
  icon,
  label,
  tone,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  tone: Tone;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "border-t pt-7",
        tone === "light" ? "border-ink/12" : "border-bone/15",
      )}
    >
      <div
        className={cn(
          "mb-4 flex items-center gap-3",
          tone === "light" ? "text-soil" : "text-soil/85",
        )}
      >
        {icon}
        <span className="eyebrow">{label}</span>
      </div>
      {children}
    </div>
  );
}
