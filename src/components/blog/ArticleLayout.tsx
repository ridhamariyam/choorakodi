import { PageContainer } from "@/components/layout/PageContainer";
import { SectionReveal } from "@/components/animation/SectionReveal";
import { SplitHeading } from "@/components/animation/SplitHeading";
import { TextReveal } from "@/components/animation/TextReveal";
import { ScaleImage } from "@/components/animation/ScaleImage";
import { ImageReveal } from "@/components/animation/ImageReveal";
import { LineReveal } from "@/components/animation/LineReveal";
import { PendingCopy } from "@/components/content/PendingCopy";
import { WhatsAppButton } from "@/components/contact/WhatsAppButton";
import { BlogCard } from "./BlogCard";
import { formatPostDate, type ArticleBlock, type BlogPost } from "@/data/blog";

/**
 * Long-form article template.
 *
 * The body is rendered from typed blocks rather than an HTML string, so the
 * heading hierarchy stays correct (one h1, h2s beneath it), images keep their
 * alt text and lazy loading, and a CMS can later emit the same shape.
 */
export function ArticleLayout({ post, related }: { post: BlogPost; related: BlogPost[] }) {
  return (
    <>
      {/* Header ----------------------------------------------------------- */}
      <SectionReveal
        tone="bone"
        spacing="none"
        className="pb-16 pt-40 md:pb-20 md:pt-52"
        aria-labelledby="article-title"
      >
        <PageContainer width="narrow">
          <TextReveal y={14}>
            <p className="eyebrow mb-10 text-soil">{post.category}</p>
          </TextReveal>

          <SplitHeading
            as="h1"
            id="article-title"
            lines={[post.title]}
            immediate
            className="text-display font-semibold"
          />

          <TextReveal delay={0.2} className="mt-10">
            <p className="measure text-lead text-ink/72">{post.excerpt}</p>
          </TextReveal>

          <TextReveal delay={0.3} className="mt-12">
            <dl className="m-0 flex flex-wrap items-baseline gap-x-10 gap-y-4 border-t border-ink/12 pt-7">
              <div>
                <dt className="eyebrow text-muted">Author</dt>
                <dd className="m-0 mt-2 text-[0.9375rem] font-medium">{post.author}</dd>
              </div>
              <div>
                <dt className="eyebrow text-muted">Published</dt>
                <dd className="m-0 mt-2 text-[0.9375rem] font-medium">
                  <time dateTime={post.publishedAt}>{formatPostDate(post.publishedAt)}</time>
                </dd>
              </div>
              {post.updatedAt ? (
                <div>
                  <dt className="eyebrow text-muted">Updated</dt>
                  <dd className="m-0 mt-2 text-[0.9375rem] font-medium">
                    <time dateTime={post.updatedAt}>{formatPostDate(post.updatedAt)}</time>
                  </dd>
                </div>
              ) : null}
              <div>
                <dt className="eyebrow text-muted">Reading time</dt>
                <dd className="m-0 mt-2 text-[0.9375rem] font-medium">
                  {post.readingMinutes} minutes
                </dd>
              </div>
            </dl>
          </TextReveal>
        </PageContainer>
      </SectionReveal>

      {/* Hero image -------------------------------------------------------- */}
      <SectionReveal tone="bone" spacing="none" className="pb-20 md:pb-28">
        <PageContainer width="wide">
          <ScaleImage
            slot={post.image}
            ratio="16 / 9"
            wrapperClassName="w-full"
            sizes="100vw"
            from={1.1}
          />
        </PageContainer>
      </SectionReveal>

      {/* Body --------------------------------------------------------------- */}
      <SectionReveal tone="bone" spacing="none" className="pb-24 md:pb-32">
        <PageContainer width="narrow">
          {post.isDraft ? (
            <PendingCopy className="mb-14" label="Unreviewed draft">
              This article is general cultural writing prepared as editorial scaffolding. It has
              not been reviewed by the academy, carries no claim about Choorakkodi specifically,
              and is served <code>noindex</code> with no Article structured data until it is
              approved.
            </PendingCopy>
          ) : null}

          <div className="prose-kalari">
            {post.body.map((block, index) => (
              <Block key={index} block={block} />
            ))}
          </div>
        </PageContainer>
      </SectionReveal>

      {/* Related ------------------------------------------------------------ */}
      {related.length > 0 ? (
        <SectionReveal tone="ink" spacing="lg" grain aria-labelledby="related-articles">
          <PageContainer>
            <h2 id="related-articles" className="eyebrow mb-12 text-bone/40">
              Keep reading
            </h2>
            <div className="grid gap-12 md:grid-cols-3 md:gap-8">
              {related.map((item) => (
                <div key={item.slug} data-reveal>
                  <BlogCard post={item} variant="compact" tone="dark" />
                </div>
              ))}
            </div>
          </PageContainer>
        </SectionReveal>
      ) : null}
    </>
  );
}

function Block({ block }: { block: ArticleBlock }) {
  switch (block.type) {
    case "p":
      return <p>{block.text}</p>;

    case "h2":
      return <h2>{block.text}</h2>;

    case "h3":
      return <h3>{block.text}</h3>;

    case "list":
      return block.ordered ? (
        <ol>
          {block.items.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ol>
      ) : (
        <ul>
          {block.items.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      );

    case "quote":
      return (
        <figure className="my-14 border-l-2 border-soil pl-7">
          <blockquote className="m-0">
            <p className="text-title font-medium leading-[1.2] tracking-[-0.022em] text-ink">
              {block.text}
            </p>
          </blockquote>
          {block.attribution ? (
            <figcaption className="eyebrow mt-5 text-muted">{block.attribution}</figcaption>
          ) : null}
        </figure>
      );

    case "image":
      return (
        <div className="my-14">
          <ImageReveal
            slot={block.image}
            ratio="16 / 10"
            caption={block.caption}
            wrapperClassName="w-full"
            sizes="(max-width: 1024px) 92vw, 56rem"
          />
        </div>
      );

    case "cta":
      // Placed mid-article by the content itself rather than injected at a
      // fixed scroll depth, so it always lands at a sensible break.
      return (
        <aside className="my-16 border-y border-ink/12 py-12">
          <LineReveal className="mb-8" />
          <p className="text-title font-semibold tracking-[-0.024em]">{block.heading}</p>
          <div className="mt-8">
            <WhatsAppButton label={block.label} message={block.message} size="md" />
          </div>
        </aside>
      );

    default: {
      // Exhaustiveness guard: adding a block type without a case fails here.
      const exhaustive: never = block;
      return exhaustive;
    }
  }
}
