import type { Metadata } from "next";

import { PageHeader } from "@/components/layout/PageHeader";
import { NextChapter } from "@/components/story/NextChapter";
import { chapterLabel } from "@/data/navigation";
import { PageContainer } from "@/components/layout/PageContainer";
import { SectionReveal } from "@/components/animation/SectionReveal";
import { BlogList } from "@/components/blog/BlogList";
import { CTASection } from "@/components/content/CTASection";
import { JsonLd } from "@/components/layout/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";
import { featuredPost } from "@/data/blog";
import { getContent } from "@/lib/content";

export async function generateMetadata(): Promise<Metadata> {
  const { site, posts } = await getContent();
  return buildMetadata(
    {
      title: "The Choorakkodi Journal",
      description:
        "Writing on Kalarippayattu, marma, heritage and training from Choorakkodi Martial Arts Academy, Kozhikode.",
      path: "/blog",
      // Every article is currently an unreviewed draft.
      noindex: posts.every((post) => post.isDraft),
    },
    site,
  );
}

export default async function BlogPage() {
  const { posts } = await getContent();
  const featured = featuredPost(posts);
  const rest = posts.filter((post) => post.slug !== featured?.slug);

  return (
    <>
      <PageHeader
        chapter={chapterLabel("/blog")}
        eyebrow="Writing"
        lines={["The", "Choorakkodi", "Journal."]}
        standfirst="Notes on the art, the archive and the practice — written for people who want to understand what they are looking at."
        meta={`${posts.length} articles`}
      />

      <SectionReveal tone="bone" spacing="md">
        <PageContainer>
          {posts.length > 0 ? (
            <BlogList featured={featured} posts={rest} />
          ) : (
            <p className="measure text-lead text-muted">The first articles are being written. Check back soon.</p>
          )}
        </PageContainer>
      </SectionReveal>

      <CTASection
        eyebrow="Questions"
        lines={["Ask us", "anything."]}
        body="Reading about the art is a start. The rest happens on the floor."
        message="Hello Choorakkodi — I have a question after reading the journal."
        secondary={{ label: "Admissions", href: "/admissions" }}
      />

      <NextChapter from="/blog" />

      <JsonLd
        schema={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Journal", path: "/blog" },
        ])}
      />
    </>
  );
}
