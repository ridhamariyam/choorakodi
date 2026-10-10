import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ArticleLayout } from "@/components/blog/ArticleLayout";
import { CTASection } from "@/components/content/CTASection";
import { JsonLd } from "@/components/layout/JsonLd";
import { articleSchema, breadcrumbSchema } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";
import { getPost, relatedPosts } from "@/data/blog";
import { getContent } from "@/lib/content";

type Params = { slug: string };

/** Pre-renders the articles that exist at build time; ones added later in the admin render on first visit. */
export async function generateStaticParams(): Promise<Params[]> {
  const { posts } = await getContent();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const { site, posts } = await getContent();
  const post = getPost(posts, slug);

  if (!post) {
    return buildMetadata(
      {
        title: "Article not found",
        description: "This article could not be found.",
        path: "/blog",
        noindex: true,
      },
      site,
    );
  }

  return buildMetadata(
    {
        title: post.title,
        description: post.excerpt,
        path: `/blog/${post.slug}`,
        type: "article",
        publishedTime: `${post.publishedAt}T00:00:00.000Z`,
        modifiedTime: `${post.updatedAt ?? post.publishedAt}T00:00:00.000Z`,
        // Unreviewed drafts stay out of the index.
        noindex: post.isDraft,
    },
    site,
  );
}

export default async function BlogPostPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const { posts } = await getContent();
  const post = getPost(posts, slug);
  if (!post) notFound();

  const related = relatedPosts(posts, slug);

  return (
    <>
      <ArticleLayout post={post} related={related} />

      <CTASection
        eyebrow="Next step"
        lines={["Read less,", "train more."]}
        body="The syllabus does not translate to the page. Come and stand on the floor."
        message={`Hello Choorakkodi — I read "${post.title}" and would like to ask about training.`}
        secondary={{ label: "Admissions", href: "/admissions" }}
      />

      {/* articleSchema() returns null while the post is an unreviewed draft. */}
      <JsonLd schema={articleSchema(post)} />
      <JsonLd
        schema={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Journal", path: "/blog" },
          { name: post.title, path: `/blog/${post.slug}` },
        ])}
      />
    </>
  );
}
