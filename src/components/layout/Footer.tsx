import { MapPin } from "lucide-react";
import { TransitionLink } from "@/components/animation/PageTransition";
import { Wordmark } from "@/components/brand/BrandMark";
import { WhatsAppIcon } from "@/components/contact/WhatsAppIcon";
import { addressLines, formatLocality, hasWhatsApp, telHref, whatsAppHref } from "@/data/site";
import { getContent } from "@/lib/content";
import styles from "./Footer.module.css";

/** The Instagram glyph from noahlesage.com's footer (Feather, 1.5 stroke). */
function InstagramIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

/**
 * Site footer, after noahlesage.com: a compact black band revealed from under
 * the page as it ends (see RevealFooter). Present on every page so the
 * navigation, the location and the contact channels are always one scroll away.
 */
export async function Footer() {
  const { site, navigation } = await getContent();
  const year = new Date().getFullYear();
  const address = addressLines(site) ?? [`${formatLocality(site)}, India`];

  // Two short columns read like the source's; the split follows the nav order.
  const half = Math.ceil(navigation.footer.length / 2);
  const columns = [
    { title: "Academy", items: navigation.footer.slice(0, half) },
    { title: "Discover", items: navigation.footer.slice(half) },
  ].filter((column) => column.items.length > 0);

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.top}>
          <TransitionLink href="/" className={styles.brand} aria-label={`${site.wordmark} — home`}>
            <Wordmark tone="reverse" className={styles.brandMark} />
          </TransitionLink>

          <div className={styles.cols}>
            <nav aria-label="Footer" className={styles.nav}>
              {columns.map((column) => (
                <div key={column.title} className={styles.col}>
                  <h2 className={styles.colHead}>{column.title}</h2>
                  <ul className={styles.list}>
                    {column.items.map((item) => (
                      <li key={item.href}>
                        <TransitionLink href={item.href} className={styles.link}>
                          {item.label}
                        </TransitionLink>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </nav>

            <address className={`${styles.col} not-italic`}>
              <h2 className={styles.colHead}>Contact</h2>
              {site.contact.phone ? (
                <a href={telHref(site)} className={styles.link}>
                  {site.contact.phone}
                </a>
              ) : null}
              {site.contact.email ? (
                <a href={`mailto:${site.contact.email}`} className={styles.link}>
                  {site.contact.email}
                </a>
              ) : null}
              {address.map((line) => (
                <span key={line} className={styles.link}>
                  {line}
                </span>
              ))}
            </address>
          </div>

          <div className={styles.socials}>
            {site.social.map((link) => (
              <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer" className={styles.social}>
                <InstagramIcon />
                <span>{link.label}</span>
              </a>
            ))}
            {hasWhatsApp(site) ? (
              <a
                href={whatsAppHref(site, "Hello Choorakkodi — I found you through your website.")}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.social}
              >
                <WhatsAppIcon />
                <span>WhatsApp</span>
              </a>
            ) : null}
            {site.contact.mapDirectionsUrl ? (
              <a href={site.contact.mapDirectionsUrl} target="_blank" rel="noopener noreferrer" className={styles.social}>
                <MapPin strokeWidth={1.5} aria-hidden="true" />
                <span>Directions</span>
              </a>
            ) : null}
          </div>
        </div>

        <div className={styles.bottom}>
          <span>
            ©{year} {site.name}
          </span>
          <div className={styles.bottomRight}>
            <span>{site.tagline}</span>
            <span>Est. {site.foundedYear}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
