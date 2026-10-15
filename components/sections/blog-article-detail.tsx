import Image from "next/image";
import Link from "next/link";
import { LuArrowLeft, LuArrowRight, LuBookOpen, LuCalendarDays, LuClock3 } from "react-icons/lu";
import { resolveImageUrl, type News } from "@/lib/admin-api";

function articleDate(article: News): string {
  const date = new Date(article.publishedAt || article.createdAt);
  if (Number.isNaN(date.getTime())) return "Recently published";
  return new Intl.DateTimeFormat("en-BD", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Dhaka",
  }).format(date);
}

function readingTime(content: string): number {
  return Math.max(1, Math.ceil(content.trim().split(/\s+/).filter(Boolean).length / 200));
}

export default function BlogArticleDetail({ article }: { article: News }) {
  const imageUrl = article.coverImageUrl ? resolveImageUrl(article.coverImageUrl) : null;
  const paragraphs = article.content.trim().split(/\n\s*\n/).filter(Boolean);

  return (
    <main className="min-h-[60vh] bg-store-page pb-16 sm:pb-20">
      <div className="mx-auto max-w-[1120px] px-4 pt-6 sm:px-6 sm:pt-10">
        <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-2 text-xs font-medium text-store-accent sm:mb-8 sm:text-sm">
          <Link href="/" className="transition hover:text-store-primary">Home</Link>
          <span aria-hidden="true">/</span>
          <Link href="/blog" className="transition hover:text-store-primary">Journal</Link>
          <span aria-hidden="true">/</span>
          <span className="max-w-[55vw] truncate text-zinc-500" aria-current="page">{article.title}</span>
        </nav>

        <article>
          <header className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-store-border bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wider text-store-accent">
              <LuBookOpen className="h-3.5 w-3.5" aria-hidden="true" />
              NovaMart Journal
            </span>
            <h1 className="mt-5 text-3xl font-semibold leading-tight tracking-tight text-store-ink sm:text-4xl md:text-5xl">
              {article.title}
            </h1>
            {article.excerpt?.trim() && (
              <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-zinc-600 sm:text-lg">
                {article.excerpt}
              </p>
            )}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm text-store-accent">
              <span className="inline-flex items-center gap-2">
                <LuCalendarDays className="h-4 w-4" aria-hidden="true" />
                {articleDate(article)}
              </span>
              <span className="inline-flex items-center gap-2">
                <LuClock3 className="h-4 w-4" aria-hidden="true" />
                {readingTime(article.content)} min read
              </span>
              <span>By {article.author?.trim() || "NovaMart Editorial Team"}</span>
            </div>
          </header>

          <div className="relative mx-auto mt-8 aspect-[16/9] max-w-5xl overflow-hidden rounded-2xl bg-gradient-to-br from-store-surface via-white to-store-surface-strong shadow-lg shadow-store-deep/10 sm:mt-10 sm:rounded-3xl">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={article.title}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 1024px"
                className="object-cover"
                unoptimized
              />
            ) : (
              <div className="flex h-full items-center justify-center">
                <LuBookOpen className="h-14 w-14 text-store-primary/35 sm:h-20 sm:w-20" aria-hidden="true" />
              </div>
            )}
          </div>

          <div className="mx-auto mt-9 max-w-3xl sm:mt-12">
            <div className="space-y-5 text-[15px] leading-8 text-zinc-700 sm:text-base sm:leading-8">
              {paragraphs.map((paragraph, index) => (
                <p key={index} className="whitespace-pre-wrap break-words">{paragraph}</p>
              ))}
            </div>

            <div className="mt-10 flex flex-col gap-4 border-t border-store-border pt-6 sm:flex-row sm:items-center sm:justify-between">
              <Link href="/blog" className="inline-flex items-center gap-2 text-sm font-semibold text-store-primary transition hover:text-store-hover">
                <LuArrowLeft className="h-4 w-4" aria-hidden="true" />
                Back to all stories
              </Link>
              <Link href="/products" className="inline-flex items-center justify-center gap-2 rounded-lg bg-store-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-store-hover">
                Explore the store
                <LuArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </article>
      </div>
    </main>
  );
}
