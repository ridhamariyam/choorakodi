import type { Metadata } from "next";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Page not found",
  description: "This page could not be found.",
  robots: { index: false, follow: true },
};

/**
 * The site and the admin are separate root layouts, so there is no single
 * layout for Next.js to wrap an unmatched URL in. This catch-all claims every
 * URL no other route matches and hands it to ./not-found.tsx, which renders
 * the branded 404 inside the site's own navigation and footer.
 */
export default function Unmatched() {
  notFound();
}
