import Image from "next/image";
import Link from "next/link";
import {
  ArrowDownRight, ArrowRight, ArrowUpRight, BookOpen, CalendarDays,
  Check, Clock3, FileText, HeartHandshake, House, Images, Landmark,
  MessageSquareQuote, PanelTop, Plus, Settings2, Sparkles,
  Swords, Upload, type LucideIcon,
} from "lucide-react";
import type { CollectionSlug, GlobalSlug, ServerProps } from "payload";
import { BrandMark } from "@/components/brand/BrandMark";

const pages: { slug: GlobalSlug; label: string; description: string; icon: LucideIcon }[] = [
  { slug: "homepage", label: "Homepage", description: "The first impression", icon: House },
  { slug: "about-page", label: "About & legacy", description: "The people and the story", icon: Landmark },
  { slug: "kalarippayattu-page", label: "Kalarippayattu", description: "The art and its practice", icon: Swords },
  { slug: "marma-page", label: "Marma healing", description: "Care, rooted in tradition", icon: HeartHandshake },
  { slug: "admissions-page", label: "Admissions", description: "Welcome the next generation", icon: FileText },
  { slug: "disciplines-page", label: "Disciplines", description: "What the academy teaches", icon: BookOpen },
  { slug: "contact-page", label: "Contact", description: "Help people find you", icon: MessageSquareQuote },
  { slug: "shared-sections", label: "Shared sections", description: "Content used across the site", icon: PanelTop },
  { slug: "site-settings", label: "Academy details", description: "Contacts, timings and menus", icon: Settings2 },
];

const libraries = [
  { slug: "posts", label: "Journal stories", singular: "Journal", icon: BookOpen, tone: "sand", description: "Words from the academy" },
  { slug: "events", label: "Academy events", singular: "Event", icon: CalendarDays, tone: "sage", description: "Moments that bring us together" },
  { slug: "gallery", label: "Gallery photos", singular: "Gallery", icon: Images, tone: "rose", description: "Your visual archive" },
  { slug: "testimonials", label: "Testimonials", singular: "Testimonial", icon: MessageSquareQuote, tone: "lilac", description: "Voices of the community" },
] as const;

type RecentItem = { id: number; title: string; updatedAt: string; collection: string; label: string; icon: LucideIcon };

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", timeZone: "Asia/Kolkata" }).format(new Date(value));
}

export async function Dashboard({ payload, user, permissions, visibleEntities }: ServerProps) {
  const adminPath = payload.config.routes.admin;
  const canRead = (slug: CollectionSlug) => visibleEntities?.collections.includes(slug) ?? false;
  const canEditPage = (slug: GlobalSlug) => visibleEntities?.globals.includes(slug) ?? false;
  const visibleLibraries = libraries.filter((library) => canRead(library.slug));
  const results = await Promise.allSettled(visibleLibraries.map((library) => payload.find({
    collection: library.slug,
    limit: 4,
    sort: "-updatedAt",
    depth: 0,
    overrideAccess: false,
    user,
  })));
  const recent: RecentItem[] = [];
  const counts = new Map<string, number | null>();

  results.forEach((result, index) => {
    const library = visibleLibraries[index]!;
    if (result.status === "rejected") {
      counts.set(library.slug, null);
      payload.logger.error({ err: result.reason, msg: `Could not load dashboard collection: ${library.slug}` });
      return;
    }
    counts.set(library.slug, result.value.totalDocs);
    for (const doc of result.value.docs) {
      const title = "title" in doc ? doc.title : "caption" in doc ? doc.caption : "name" in doc ? doc.name : library.singular;
      recent.push({ id: doc.id, title, updatedAt: doc.updatedAt, collection: library.slug, label: library.singular, icon: library.icon });
    }
  });
  recent.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

  const firstName = user?.name?.trim().split(/\s+/)[0];
  const editablePages = pages.filter((page) => canEditPage(page.slug));
  const quickActions = [
    { slug: "posts", label: "Write a story", detail: "Share something worth telling", icon: Plus, href: `${adminPath}/collections/posts/create` },
    { slug: "media", label: "Upload photos", detail: "Add to your image library", icon: Upload, href: `${adminPath}/collections/media/create` },
    { slug: "events", label: "Add an event", detail: "Give people a reason to gather", icon: CalendarDays, href: `${adminPath}/collections/events/create` },
  ] as const satisfies { slug: CollectionSlug; label: string; detail: string; icon: LucideIcon; href: string }[];
  const visibleActions = quickActions.filter((action) => canRead(action.slug) && permissions?.collections?.[action.slug]?.create);

  return (
    <div className="studio-dashboard">
      <header className="studio-page-heading">
        <div>
          <span className="studio-eyebrow">THE ACADEMY, AT A GLANCE</span>
          <h1>Good to see you{firstName ? `, ${firstName}` : ""}<span>.</span></h1>
          <p>A space to keep your stories, people and traditions connected.</p>
        </div>
        <a className="studio-button studio-button--outline" href="/" target="_blank" rel="noopener noreferrer">
          Visit your website <ArrowUpRight size={17} aria-hidden="true" />
          <span className="studio-sr-only"> (opens in a new tab)</span>
        </a>
      </header>

      <section className="studio-feature" aria-labelledby="studio-feature-title">
        <div className="studio-feature__copy">
          <span className="studio-eyebrow"><span className="studio-status-dot" /> CHOORAKKODI CONTENT STUDIO</span>
          <h2 id="studio-feature-title">Keep the story<br />moving<span>.</span></h2>
          <p>Every photograph, every word, every new beginning.<br className="studio-desktop-break" /> This is where your academy’s story grows.</p>
          {canEditPage("homepage") && <Link className="studio-button studio-button--dark" href={`${adminPath}/globals/homepage`}>Edit the homepage <ArrowRight size={17} aria-hidden="true" /></Link>}
          <ArrowDownRight className="studio-feature__flourish" size={50} strokeWidth={1} aria-hidden="true" />
        </div>
        <div className="studio-feature__art">
          <Image src="/images/training/aerial-sword-leap.webp" alt="A Kalarippayattu practitioner in an aerial sword leap" fill sizes="(max-width: 700px) 100vw, 35vw" priority />
          <div className="studio-feature__art-overlay" />
          <BrandMark className="studio-feature__emblem" tone="reverse" />
          <span className="studio-feature__caption">ROOTED IN TRADITION. ALWAYS IN MOTION.</span>
        </div>
      </section>

      {visibleLibraries.length > 0 && <section className="studio-stats" aria-label="Your content library">
        {visibleLibraries.map(({ slug, label, description, icon: Icon, tone }) => (
          <Link className="studio-stat" href={`${adminPath}/collections/${slug}`} key={slug}>
            <div className="studio-stat__top"><span className={`studio-icon-tile studio-icon-tile--${tone}`}><Icon size={19} strokeWidth={1.6} aria-hidden="true" /></span><ArrowUpRight size={16} aria-hidden="true" /></div>
            <strong className="studio-stat__number">{counts.get(slug)?.toString().padStart(2, "0") ?? "—"}</strong>
            <span className="studio-stat__label">{label}</span>
            <span className="studio-stat__description">{description}</span>
          </Link>
        ))}
      </section>}

      <div className="studio-content-grid">
        <section className="studio-panel studio-pages" aria-labelledby="studio-pages-title">
          <div className="studio-section-heading"><div><span className="studio-eyebrow">MAKE IT YOURS</span><h2 id="studio-pages-title">Your website pages</h2></div><span className="studio-count">{editablePages.length} sections</span></div>
          <p className="studio-section-intro">A fresh detail or a whole new chapter. Start here.</p>
          <div className="studio-page-list">
            {editablePages.map(({ slug, label, description, icon: Icon }) => (
              <Link className="studio-page-row" href={`${adminPath}/globals/${slug}`} key={slug}>
                <span className="studio-page-row__icon"><Icon size={19} strokeWidth={1.6} aria-hidden="true" /></span>
                <span className="studio-page-row__text"><strong>{label}</strong><span>{description}</span></span>
                <ArrowUpRight className="studio-page-row__arrow" size={17} aria-hidden="true" />
              </Link>
            ))}
            {!editablePages.length && <p className="studio-empty">Your account has no editable pages assigned.</p>}
          </div>
        </section>

        <div className="studio-side-stack">
          {visibleActions.length > 0 && <section className="studio-panel studio-quick-actions" aria-labelledby="studio-actions-title">
            <div className="studio-section-heading"><h2 id="studio-actions-title">A little something new</h2><Sparkles size={18} strokeWidth={1.5} aria-hidden="true" /></div>
            {visibleActions.map(({ label, detail, icon: Icon, href }) => <Link className="studio-quick-action" href={href} key={href}>
              <span className="studio-quick-action__icon"><Icon size={18} strokeWidth={1.7} aria-hidden="true" /></span><span><strong>{label}</strong><small>{detail}</small></span><ArrowRight size={15} aria-hidden="true" />
            </Link>)}
          </section>}

          <section className="studio-panel studio-recent" aria-labelledby="studio-recent-title">
            <div className="studio-section-heading"><h2 id="studio-recent-title">Recently touched</h2><Clock3 size={18} strokeWidth={1.5} aria-hidden="true" /></div>
            <p className="studio-section-intro">Pick up where you left off.</p>
            <div className="studio-recent-list">{recent.slice(0, 4).map(({ id, title, updatedAt, collection, label, icon: Icon }) => <Link className="studio-recent-item" href={`${adminPath}/collections/${collection}/${id}`} key={`${collection}-${id}`}>
              <span className="studio-recent-item__icon"><Icon size={17} strokeWidth={1.5} aria-hidden="true" /></span><span><strong>{title}</strong><small>{label} <span aria-hidden="true">·</span> <time dateTime={updatedAt}>{formatDate(updatedAt)}</time></small></span><ArrowUpRight size={14} aria-hidden="true" />
            </Link>)}</div>
            {!recent.length && <p className="studio-empty">{results.some((result) => result.status === "rejected") ? "Recent updates couldn’t be loaded. Refresh to try again." : "Your next story starts here. Add some content to get going."}</p>}
          </section>

          <aside className="studio-tip"><span className="studio-tip__icon"><Check size={17} aria-hidden="true" /></span><div><strong>A small tip for a good story</strong><p>Add a short description to every photo. It helps everyone enjoy the academy’s story.</p></div></aside>
        </div>
      </div>
      <footer className="studio-dashboard-footer"><span>CHOORAKKODI <span aria-hidden="true">/</span> CONTENT STUDIO</span><span>Made for a living legacy.</span></footer>
    </div>
  );
}
