import { TextReveal } from "@/components/animation/TextReveal";
import { SectionReveal } from "@/components/animation/SectionReveal";
import { WhatsAppButton } from "@/components/contact/WhatsAppButton";
import { Button } from "@/components/ui/Button";
import { ScrollWords } from "@/components/story/Caption";
import { Trail } from "@/components/story/Trail";
import { faceStyle } from "@/components/story/fonts";

export type CTASectionProps = {
  eyebrow?: string;
  lines: string[];
  body?: string;
  /** WhatsApp message body, written for the page it sits on. */
  message?: string;
  whatsappLabel?: string;
  secondary?: { label: string; href: string };
};

/**
 * The closing call to action, ending each page the way the homepage
 * chronicle ends: the trail comes in, mega type slides in from both sides,
 * and a typewriter note sits over two choices. Repeated at the foot of every
 * page so the conversion path is never more than one scroll away.
 */
export function CTASection({
  eyebrow = "Begin",
  lines,
  body,
  message,
  whatsappLabel = "WhatsApp us",
  secondary = { label: "Book a free trial", href: "/admissions" },
}: CTASectionProps) {
  return (
    // "green" is the flipped tone: white ground, dark buttons.
    <SectionReveal
      tone="green"
      spacing="none"
      aria-labelledby="cta-heading"
      className="overflow-hidden pb-[18vw] text-[#1f1d1e] md:pb-[10vw]"
    >
      <Trail id="cta" side="left" />

      <h2
        id="cta-heading"
        className="relative z-[1] m-0 pt-[30vw] font-normal md:pt-[20vw]"
        style={faceStyle.unbounded}
      >
        <span className="sr-only">{lines.join(" ")}</span>
        {lines.map((line, i) => (
          <span
            key={`${line}-${i}`}
            aria-hidden="true"
            data-mega
            className={`block text-[11vw] leading-[0.92] uppercase md:text-[7.5vw] ${i % 2 === 0 ? "pl-[5vw]" : "pl-[5vw] md:pl-[16vw]"}`}
          >
            {line}
          </span>
        ))}
      </h2>

      <div className="gutter relative z-[1] mt-[6vw] md:mt-[3vw] md:pl-[22vw]">
        <p className="text-[3.4vw] uppercase tracking-[0.2em] opacity-70 md:text-[1vw]">{eyebrow}</p>

        {body ? (
          <p data-scrub-text className="measure mt-[4vw] text-[4.4vw] leading-[1.25] font-medium md:mt-[1.6vw] md:text-[1.75vw] md:leading-[1.2]">
            <ScrollWords text={body} />
          </p>
        ) : null}

        <TextReveal delay={0.1} className="mt-[8vw] flex flex-wrap gap-4 md:mt-[3vw]">
          <WhatsAppButton label={whatsappLabel} message={message} variant="bone" size="lg" magnetic />
          <Button href={secondary.href} variant="outline" size="lg" className="text-bone">
            {secondary.label}
          </Button>
        </TextReveal>
      </div>
    </SectionReveal>
  );
}
