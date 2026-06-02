import { getArticleBySlug, getPublishedArticles } from "@/lib/articles";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  return getPublishedArticles().map((a) => ({ slug: a.slug }));
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article || !article.published) notFound();

  return (
    <div className="max-w-2xl mx-auto px-4 py-14">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm font-medium mb-8 transition-colors hover:opacity-80"
        style={{ color: "var(--accent)" }}
      >
        ← Back to Blog
      </Link>

      {article.coverImage && (
        <div className="relative h-72 w-full mb-10 rounded-2xl overflow-hidden shadow-md">
          <Image src={article.coverImage} alt={article.title} fill className="object-cover" />
        </div>
      )}

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-5">
        {article.tags.map((tag) => (
          <span
            key={tag}
            className="text-xs font-semibold px-2.5 py-0.5 rounded-full"
            style={{ backgroundColor: "var(--accent-light)", color: "var(--accent)" }}
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Title */}
      <h1
        className="text-4xl font-bold mb-5 leading-tight"
        style={{ color: "var(--text-primary)", letterSpacing: "-0.01em" }}
      >
        {article.title}
      </h1>

      {/* Meta */}
      <div
        className="flex flex-wrap items-center gap-4 text-sm mb-10 pb-8"
        style={{ color: "var(--text-secondary)", borderBottom: "1px solid var(--border)" }}
      >
        <span>
          By{" "}
          <strong style={{ color: "var(--text-primary)" }}>{article.author}</strong>
        </span>
        <span style={{ color: "var(--border)" }}>·</span>
        <span>
          {new Date(article.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </span>
      </div>

      {/* Content — comfortable reading width + line height */}
      <article
        className="prose max-w-none"
        style={{ color: "var(--text-body)", fontSize: "1.0625rem", lineHeight: "1.85" }}
      >
        <div className="whitespace-pre-wrap">{article.content}</div>
      </article>
    </div>
  );
}
