import { notFound } from "next/navigation";

/**
 * The site and the admin are separate root layouts, so there is no single
 * layout for Next.js to wrap an unmatched URL in. This catch-all claims every
 * URL no other route matches and hands it to ./not-found.tsx, which renders
 * the branded 404 inside the site's own navigation and footer.
 */
export default function Unmatched() {
  notFound();
}
