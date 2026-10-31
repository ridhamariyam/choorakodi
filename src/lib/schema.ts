import { siteLanguage, siteUrl, type Site } from "@/data/site";
import type { AcademyEvent } from "@/data/events";
import type { BlogPost } from "@/data/blog";
import type { FaqItem } from "@/data/faq";

/**
 * Structured data builders.
 *
 * Governing rule: a property is emitted only when a real value exists. Every
 * optional field below is conditional, so filling in `site.contact` is what
 * turns a bare Organization record into a complete LocalBusiness one. Nothing
 * here invents an address, a phone number, a rating, a review, an award or a
 * credential — and placeholder events and draft articles are refused outright.
 */

type Json = Record<string, unknown>;

function compact(input: Json): Json {
  return Object.fromEntries(
    Object.entries(input).filter(([, value]) => {
      if (value === null || value === undefined) return false;
      if (Array.isArray(value) && value.length === 0) return false;
      return true;
    }),
  );
}

function postalAddress(site: Site): Json | null {
  const { street, locality, region, postalCode, countryCode } = site.contact.address;
  // Without a street address this is a region, not a postal address. We still
  // publish locality/region because those were supplied and are accurate.
  return compact({
    "@type": "PostalAddress",
    streetAddress: street,
    addressLocality: locality,
    addressRegion: region,
    postalCode,
    addressCountry: countryCode,
  });
}

/**
 * SportsActivityLocation is a LocalBusiness subtype and the closest accurate
 * match for a martial arts academy with a physical training hall.
 */
export function organizationSchema(site: Site): Json {
  return compact({
    "@context": "https://schema.org",
    "@type": ["Organization", "SportsActivityLocation"],
    "@id": `${siteUrl}/#organization`,
    name: site.name,
    // Official name and the names people search for, per the onboarding sheet.
    legalName: "CMM Gurukkal's Choorakkodi Martial Arts Academy",
    alternateName: [site.shortName, "Choorakodi", "Choorakkodi Kalari Sangam", "Choorakkodi Kalari", "CKS Chelavoor"],
    url: siteUrl,
    logo: `${siteUrl}/brand/logo-square.png`,
    image: `${siteUrl}/images/training/crossed-swords.webp`,
    description: site.description,
    address: postalAddress(site),
    areaServed: `${site.contact.address.locality}, ${site.contact.address.region}`,
    hasMap: site.contact.mapDirectionsUrl,
    telephone: site.contact.phone,
    email: site.contact.email,
    sameAs: site.social.map((s) => s.href),
    // foundingDate is a year the brief supplies; it is not invented here.
    foundingDate: String(site.foundedYear),
    founder: { "@id": `${siteUrl}/#founder` },
    knowsAbout: ["Kalarippayattu", "Kalaripayattu", "Kerala martial arts", "Marma", "Self defence"],
  });
}

export function personSchema(site: Site): Json {
  return compact({
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${siteUrl}/#founder`,
    name: site.founder.name,
    alternateName: site.founder.fullName,
    jobTitle: site.founder.role,
    knowsAbout: ["Kalarippayattu", "Kalari chikitsa", "Marma", "Ayurveda"],
    worksFor: { "@id": `${siteUrl}/#organization` },
  });
}

export function websiteSchema(site: Site): Json {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    url: siteUrl,
    name: site.name,
    inLanguage: siteLanguage,
    publisher: { "@id": `${siteUrl}/#organization` },
  };
}

export function breadcrumbSchema(trail: { name: string; path: string }[]): Json {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: `${siteUrl}${crumb.path === "/" ? "" : crumb.path}`,
    })),
  };
}

/** Returns null for placeholder events — a fabricated Event is a policy breach. */
export function eventSchema(event: AcademyEvent, site: Site): Json | null {
  if (event.isPlaceholder) return null;

  return compact({
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.title,
    startDate: event.date,
    endDate: event.endDate ?? event.date,
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    description: event.summary,
    url: `${siteUrl}/events/${event.slug}`,
    location: compact({
      "@type": "Place",
      name: event.location,
      address: postalAddress(site),
    }),
    organizer: { "@id": `${siteUrl}/#organization` },
  });
}

/** Returns null for drafts, so unreviewed copy is never published as Article. */
export function articleSchema(post: BlogPost): Json | null {
  if (post.isDraft) return null;

  return compact({
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt ?? post.publishedAt,
    articleSection: post.category,
    inLanguage: siteLanguage,
    mainEntityOfPage: `${siteUrl}/blog/${post.slug}`,
    author: { "@type": "Organization", name: post.author },
    publisher: { "@id": `${siteUrl}/#organization` },
  });
}

/**
 * FAQPage schema. Answers still awaiting academy confirmation are excluded —
 * marking up "to be confirmed" as an answer would be misleading in results.
 */
export function faqSchema(items: FaqItem[]): Json | null {
  const answered = items.filter((item) => !item.pending);
  if (answered.length === 0) return null;

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: answered.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}
