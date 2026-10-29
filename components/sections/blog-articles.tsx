"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { LuArrowRight, LuBookOpen, LuCalendarDays, LuClock3, LuSearch } from "react-icons/lu";
import { getPublishedNews, resolveImageUrl, type News } from "@/lib/admin-api";
import { DEMO_NEWS } from "@/lib/demo-news";

type BlogArticlesProps = {
  variant: "preview" | "page";
  initialArticles?: News[];
};

function articleDate(article: News): string {
  const date = new Date(article.publishedAt || article.createdAt);
  if (Number.isNaN(date.getTime())) return "Recently published";
  return new Intl.DateTimeFormat("en-BD", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Dhaka",
  }).format(date);
}

function readingTime(content: string): number {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

function articleSummary(article: News): string {
  const contentPreview = article.content.replace(/\s+/g, " ").trim();
  return article.excerpt?.trim() || (contentPreview.length > 170
    ? `${contentPreview.slice(0, 167).trimEnd()}…`
    : contentPreview);
}

function ArticleCard({ article }: { article: News }) {
  const imageUrl = article.coverImageUrl ? resolveImageUrl(article.coverImageUrl) : null;

  return (
    <article className="group h-full overflow-hidden rounded-2xl border border-store-border bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-store-light hover:shadow-lg">
      <Link
        href={`/blog/${encodeURIComponent(article.slug)}`}
        aria-label={`Read article: ${article.title}`}
        className="flex h-full flex-col focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-store-primary"
      >
        <div className="relative aspect-[16/10] overflow-hidden bg-store-surface">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={article.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
              unoptimized
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-gradient-to-br from-store-surface via-white to-store-surface-strong">
              <LuBookOpen className="h-10 w-10 text-store-primary/50" aria-hidden="true" />
            </div>
          )}
          <span className="absolute left-4 top-4 rounded-full border border-white/70 bg-white/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-store-deep shadow-sm backdrop-blur">
            Journal
          </span>
        </div>

        <div className="flex flex-1 flex-col p-5 sm:p-6">
          <div className="mb-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-store-accent">
            <span className="inline-flex items-center gap-1.5">
              <LuCalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
              {articleDate(article)}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <LuClock3 className="h-3.5 w-3.5" aria-hidden="true" />
              {readingTime(article.content)} min read
            </span>
          </div>

          <h2 className="line-clamp-2 text-lg font-semibold leading-snug tracking-tight text-store-ink transition-colors group-hover:text-store-primary sm:text-xl">
            {article.title}
          </h2>
          <p className="mt-3 line-clamp-3 text-sm leading-6 text-zinc-600">
            {articleSummary(article)}
          </p>

          <span className="mt-auto inline-flex items-center gap-2 pt-5 text-sm font-semibold text-store-primary">
            Read article
            <LuArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
          </span>
        </div>
      </Link>
    </article>
  );
}

function ArticleSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-store-border bg-white" aria-hidden="true">
      <div className="aspect-[16/10] animate-pulse bg-store-surface" />
      <div className="space-y-3 p-5 sm:p-6">
        <div className="h-3 w-1/2 animate-pulse rounded bg-store-surface" />
        <div className="h-5 w-4/5 animate-pulse rounded bg-store-surface" />
        <div className="h-4 w-full animate-pulse rounded bg-store-surface" />
        <div className="h-4 w-2/3 animate-pulse rounded bg-store-surface" />
      </div>
    </div>
  );
}

export default function BlogArticles({ variant, initialArticles }: BlogArticlesProps) {
  const [articles, setArticles] = useState<News[]>(initialArticles ?? []);
  const [isLoading, setIsLoading] = useState(initialArticles === undefined);
  const [search, setSearch] = useState("");
  const isPreview = variant === "preview";
  const Heading = isPreview ? "h2" : "h1";

  useEffect(() => {
    if (initialArticles !== undefined) return;

    let cancelled = false;
    setIsLoading(true);
    getPublishedNews()
      .then((result) => {
        if (!cancelled) {
          const publishedArticles = Array.isArray(result)
            ? result
                .filter((item) => item.isPublished)
                .sort((a, b) => new Date(b.publishedAt || b.createdAt).getTime() - new Date(a.publishedAt || a.createdAt).getTime())
            : [];
          setArticles(publishedArticles.length > 0 ? publishedArticles : DEMO_NEWS);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setArticles(DEMO_NEWS);
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [initialArticles]);

  const filteredArticles = useMemo(() => {
    const cleanSearch = search.trim().toLowerCase();
    const filtered = cleanSearch
      ? articles.filter((article) =>
          `${article.title} ${article.excerpt ?? ""}`.toLowerCase().includes(cleanSearch),
        )
      : articles;
    return isPreview ? filtered.slice(0, 3) : filtered;
  }, [articles, isPreview, search]);

  return (
    <section className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 md:px-10 lg:px-16">
      <div className="mb-5 flex flex-col gap-4 sm:mb-7 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Heading className={`${isPreview ? "text-xl sm:text-2xl" : "text-3xl sm:text-4xl"} font-semibold tracking-tight text-store-ink`}>
            {isPreview ? "Ideas for better everyday living" : "Stories, guides & inspiration"}
          </Heading>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-600">
            Practical tips, thoughtful product guides, and fresh ideas from the NovaMart team.
          </p>
        </div>

        {isPreview ? (
          <Link
            href="/blog"
            className="inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-store-primary transition-colors hover:text-store-hover"
          >
            Explore the journal
            <LuArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        ) : (
          <label className="relative block w-full sm:max-w-xs">
            <LuSearch className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-store-accent" aria-hidden="true" />
            <span className="sr-only">Search journal articles</span>
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search articles"
              className="h-11 w-full rounded-xl border border-store-border bg-white pl-10 pr-4 text-sm text-store-ink outline-none transition focus:border-store-primary focus:ring-4 focus:ring-store-primary/10"
            />
          </label>
        )}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 sm:gap-6">
          {[0, 1, 2].map((item) => <ArticleSkeleton key={item} />)}
        </div>
      ) : filteredArticles.length > 0 ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 sm:gap-6">
          {filteredArticles.map((article) => <ArticleCard key={article.id} article={article} />)}
        </div>
      ) : isPreview ? (
        <div className="flex flex-col items-start justify-between gap-5 rounded-2xl border border-store-border bg-gradient-to-r from-store-surface to-white p-6 sm:flex-row sm:items-center sm:p-8">
          <div>
            <h2 className="text-lg font-semibold text-store-ink">The journal is taking shape</h2>
            <p className="mt-1 text-sm leading-6 text-zinc-600">
              New buying guides and useful ideas will be shared here soon.
            </p>
          </div>
          <Link href="/blog" className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-store-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-store-hover">
            Visit the journal <LuArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-store-light bg-white px-6 py-14 text-center">
          <LuBookOpen className="mx-auto h-9 w-9 text-store-accent/60" aria-hidden="true" />
          <h2 className="mt-4 text-lg font-semibold text-store-ink">
            {search.trim() ? "No matching articles" : "New stories are on the way"}
          </h2>
          <p className="mt-2 text-sm text-zinc-600">
            {search.trim() ? "Try another search term." : "Check back soon for useful guides and fresh ideas."}
          </p>
        </div>
      )}
    </section>
  );
}
