import { TransitionLink } from "@/components/animation/PageTransition";
import { Figure } from "@/components/content/Figure";
import { ArrowSlot } from "@/components/ui/ArrowLink";
import { formatPostDate, type BlogPost } from "@/data/blog";
import { cn } from "@/lib/utils";

export type BlogCardProps = {
  post: BlogPost;
  variant?: "feature" | "row" | "compact";
  tone?: "light" | "dark";
};

/**
 * Journal entry. No card chrome — no border, no shadow, no rounded box. The
 * image, the rule and the type do the separating.
 */
export function BlogCard({ post, variant = "row", tone = "light" }: BlogCardProps) {
  const dark = tone === "dark";
  const href = `/blog/${post.slug}`;

  const meta = (
    <p
      className={cn(
        "flex flex-wrap items-center gap-x-4 gap-y-1 text-meta uppercase tracking-[0.18em]",
        dark ? "text-bone/62" : "text-muted",
      )}
    >
      <span className="text-soil-ink">{post.category}</span>
      <span aria-hidden="true">·</span>
      <time dateTime={post.publishedAt}>{formatPostDate(post.publishedAt)}</time>
      <span aria-hidden="true">·</span>
      <span>{post.readingMinutes} min read</span>
    </p>
  );

  if (variant === "feature") {
    return (
      <article className="group/card">
        <TransitionLink href={href} className="group/arrow block">
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-7">
              <Figure
                slot={post.image}
                ratio="16 / 10"
                tone={dark ? "ink" : "bone"}
                interactive
                priority
                sizes="(max-width: 1024px) 92vw, 56vw"
              />
            </div>

            <div className="lg:col-span-5 lg:self-center">
              <p className="eyebrow mb-7 text-soil-ink">Featured</p>
              {meta}
              <h2
                className={cn(
                  "mt-6 text-headline font-semibold tracking-[-0.033em]",
                  "transition-transform duration-[0.7s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/card:translate-x-2",
                  dark ? "text-bone" : "text-ink",
                )}
              >
                {post.title}
              </h2>
              <p className={cn("measure mt-6 text-lead", dark ? "text-bone/62" : "text-ink/72")}>
                {post.excerpt}
              </p>
              <span
                className={cn(
                  "mt-9 inline-flex items-center gap-3 text-meta font-medium uppercase tracking-[0.18em]",
                  dark ? "text-bone" : "text-ink",
                )}
              >
                Read more
                <ArrowSlot />
              </span>
            </div>
          </div>
        </TransitionLink>
      </article>
    );
  }

  if (variant === "compact") {
    return (
      <article className="group/card">
        <TransitionLink href={href} className="group/arrow block">
          <Figure
            slot={post.image}
            ratio="4 / 3"
            tone={dark ? "ink" : "bone"}
            interactive
            sizes="(max-width: 768px) 92vw, 30vw"
          />
          <div className="mt-6">
            {meta}
            <h3
              className={cn(
                "mt-4 text-xl font-semibold tracking-[-0.022em] sm:text-2xl",
                dark ? "text-bone" : "text-ink",
              )}
            >
              {post.title}
            </h3>
          </div>
        </TransitionLink>
      </article>
    );
  }

  return (
    <article className="group/card">
      <TransitionLink
        href={href}
        className={cn(
          "group/arrow grid items-center gap-8 border-t py-10 md:grid-cols-12",
          dark ? "border-bone/14" : "border-ink/12",
        )}
      >
        <div className="md:col-span-3">
          <Figure
            slot={post.image}
            ratio="4 / 3"
            tone={dark ? "ink" : "bone"}
            interactive
            sizes="(max-width: 768px) 92vw, 22vw"
          />
        </div>

        <div className="md:col-span-8">
          {meta}
          <h3
            className={cn(
              "mt-4 text-title font-semibold tracking-[-0.024em]",
              "transition-transform duration-[0.7s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/card:translate-x-2",
              dark ? "text-bone" : "text-ink",
            )}
          >
            {post.title}
          </h3>
          <p
            className={cn(
              "measure mt-4 text-[0.9375rem] leading-relaxed",
              dark ? "text-bone/58" : "text-ink/68",
            )}
          >
            {post.excerpt}
          </p>
        </div>

        <div className="hidden justify-end md:col-span-1 md:flex">
          <span className={cn("text-2xl", dark ? "text-bone/62" : "text-ink/62")}>
            <ArrowSlot />
          </span>
        </div>
      </TransitionLink>
    </article>
  );
}
