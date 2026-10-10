/**
 * Crests of the bodies the academy is affiliated to, matched against the
 * About page's "Affiliated to …" lines so the CMS text stays the source of
 * truth. Files live in public/images/affiliations.
 */
export const affiliationLogos: { match: RegExp; src: string; width: number; height: number }[] = [
  { match: /district sports council/i, src: "/images/affiliations/district-sports-council.png", width: 414, height: 349 },
  { match: /kalar[iy]+p+ayattu association/i, src: "/images/affiliations/kalarippayattu-association.png", width: 185, height: 185 },
  { match: /taekwondo association/i, src: "/images/affiliations/taekwondo-association-kerala.png", width: 526, height: 538 },
  { match: /yoga association/i, src: "/images/affiliations/yoga-association-kerala.png", width: 438, height: 429 },
];

export function affiliationLogo(name: string) {
  return affiliationLogos.find((logo) => logo.match.test(name)) ?? null;
}
