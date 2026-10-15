import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BlogArticleDetail from "@/components/sections/blog-article-detail";
import { resolveImageUrl } from "@/lib/admin-api";
import { fetchShopNewsBySlug } from "@/lib/shop-api";

type BlogArticlePageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: BlogArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await fetchShopNewsBySlug(slug);
  if (!article) return { title: "Story Not Found | NovaMart" };

  const description = article.excerpt?.trim() || article.content.replace(/\s+/g, " ").slice(0, 160);
  const image = article.coverImageUrl ? resolveImageUrl(article.coverImageUrl) : undefined;

  return {
    title: `${article.title} | NovaMart Journal`,
    description,
    openGraph: {
      type: "article",
      title: article.title,
      description,
      publishedTime: article.publishedAt ?? article.createdAt,
      authors: article.author ? [article.author] : undefined,
      images: image ? [{ url: image }] : undefined,
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      title: article.title,
      description,
      images: image ? [image] : undefined,
    },
  };
}

export default async function BlogArticlePage({ params }: BlogArticlePageProps) {
  const { slug } = await params;
  const article = await fetchShopNewsBySlug(slug);
  if (!article) notFound();
  return <BlogArticleDetail article={article} />;
}
