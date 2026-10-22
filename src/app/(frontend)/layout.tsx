import type { Metadata, Viewport } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { PageTransition } from "@/components/animation/PageTransition";
import { Navbar } from "@/components/navigation/Navbar";
import { Footer } from "@/components/layout/Footer";
import { RevealFooter } from "@/components/layout/RevealFooter";
import { FloatingWhatsApp } from "@/components/contact/FloatingWhatsApp";
import { JsonLd } from "@/components/layout/JsonLd";
import { InkFilterDefs } from "@/components/content/InkFilterDefs";
import { ContentProvider } from "@/components/content/ContentProvider";
import { CursorDot } from "@/components/story/CursorDot";
import { storyFontVariables } from "@/components/story/fonts";
import { organizationSchema, websiteSchema } from "@/lib/schema";
import { getContent } from "@/lib/content";
import { siteLocale, siteUrl } from "@/data/site";

/**
 * Poppins is the brand typeface. Only the four weights the design uses are
 * loaded, `display: swap` keeps text painting immediately, and the CSS
 * variable is what the Tailwind theme points `--font-sans` at.
 */
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
  preload: true,
});

export async function generateMetadata(): Promise<Metadata> {
  const { site } = await getContent();
  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: `${site.name} — Kalarippayattu in Kozhikode, Kerala`,
      template: `%s — ${site.shortName}`,
    },
    description: site.description,
    applicationName: site.name,
    alternates: { canonical: "/" },
    openGraph: {
      type: "website",
      siteName: site.name,
      locale: siteLocale,
      url: siteUrl,
    },
    twitter: { card: "summary_large_image" },
    robots: { index: true, follow: true },
    formatDetection: { telephone: false },
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#E6D9C6" },
    { media: "(prefers-color-scheme: dark)", color: "#101312" },
  ],
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { site, navigation } = await getContent();

  return (
    // suppressHydrationWarning: the preloader locks scroll on <html> and sets
    // aria-busy on <body> before React hydrates.
    <html lang="en-IN" className={`${poppins.variable} ${storyFontVariables}`} suppressHydrationWarning>
      <body className="antialiased" suppressHydrationWarning>
        {/*
         * Logo preloader (public/preloader.js), drawn on the hero's own sky. Runs during HTML parse so the
         * overlay covers the first paint. The element is attached to <html>,
         * outside React's tree, so hydration never sees it remove itself.
         * On the homepage it waits for the sky hero to report its first
         * scene ("hero:ready") so its clouds open onto the hero's; other
         * pages finish on window load. Client-side navigations keep this
         * layout, so it only plays once per visit.
         */}
        {/* eslint-disable-next-line @next/next/no-sync-scripts */}
        <script src="/preloader.js" />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var l=document.createElement("ck-preloader");l.setAttribute("label",${JSON.stringify(site.name)});l.setAttribute("background","#fbf8ef");l.setAttribute("accent","#c4a487");l.setAttribute("foreground","#0d6f6b");l.setAttribute("max-wait","3500");l.setAttribute("min-duration","800");if(location.pathname==="/"){l.setAttribute("mode","manual");window.addEventListener("hero:ready",function(){l.finish&&l.finish();},{once:true});}document.documentElement.appendChild(l);})();`,
          }}
        />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-5 focus:top-5 focus:z-[300] focus:bg-ink focus:px-5 focus:py-3 focus:text-meta focus:uppercase focus:tracking-[0.18em] focus:text-bone"
        >
          Skip to content
        </a>

        <ContentProvider value={{ site, primaryNav: navigation.primary }}>
          <SmoothScroll>
            <PageTransition>
              <Navbar />
              {/* The footer is revealed from under the page as it ends (noahlesage.com). */}
              <RevealFooter footer={<Footer />}>{children}</RevealFooter>
              <FloatingWhatsApp />
              <CursorDot />
            </PageTransition>
          </SmoothScroll>
        </ContentProvider>

        <InkFilterDefs />

        <JsonLd schema={organizationSchema(site)} />
        <JsonLd schema={websiteSchema(site)} />
      </body>
    </html>
  );
}
