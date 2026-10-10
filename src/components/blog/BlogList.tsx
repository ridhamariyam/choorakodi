"use client";

import { useMemo, useRef, useState } from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { BlogCard } from "./BlogCard";
import { LineReveal } from "@/components/animation/LineReveal";
import { blogCategories, type BlogPost, type BlogCategory } from "@/data/blog";
import { cn } from "@/lib/utils";

type Filter = BlogCategory | "All";

/**
 * The journal index: one featured article, then a filterable list. Categories
 * with no articles are not offered — an empty filter is a dead end.
 */
export function BlogList({ featured, posts }: { featured?: BlogPost; posts: BlogPost[] }) {
  const [filter, setFilter] = useState<Filter>("All");
  const scope = useRef<HTMLDivElement>(null);

  const available = useMemo(
    () => blogCategories.filter((category) => posts.some((post) => post.category === category)),
    [posts],
  );

  const items = useMemo(
    () => (filter === "All" ? posts : posts.filter((post) => post.category === filter)),
    [filter, posts],
  );

  useScrollReveal(scope, { selector: "[data-post]", y: 26, revision: filter });

  return (
    <div>
      {featured ? (
        <div className="mb-20 md:mb-28">
          <BlogCard post={featured} variant="feature" />
        </div>
      ) : null}

      <div
        role="group"
        aria-label="Filter articles by category"
        className="flex flex-wrap items-center gap-1 border-y border-ink/12 py-4"
      >
        {(["All", ...available] as Filter[]).map((category) => {
          const isActive = filter === category;
          return (
            <button
              key={category}
              type="button"
              onClick={() => setFilter(category)}
              aria-pressed={isActive}
              className={cn(
                "px-4 py-2 text-meta font-medium uppercase tracking-[0.18em] transition-colors duration-500",
                isActive ? "bg-ink text-bone" : "text-muted hover:text-ink",
              )}
            >
              {category}
            </button>
          );
        })}
        <span className="ml-auto pl-4 text-meta uppercase tracking-[0.18em] text-muted">
          {items.length} {items.length === 1 ? "article" : "articles"}
        </span>
      </div>

      <div ref={scope} className="mt-12">
        {items.map((post) => (
          <div key={post.slug} data-post>
            <BlogCard post={post} variant="row" />
          </div>
        ))}
        <LineReveal />
      </div>
    </div>
  );
}
