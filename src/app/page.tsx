import { getPublishedArticles } from "@/lib/articles";
import ArticleCard from "@/components/ArticleCard";

export const dynamic = "force-dynamic";

export default function HomePage() {
  const articles = getPublishedArticles().sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-14">
      {/* Hero */}
      <div className="mb-12">
        <h1 className="text-5xl font-bold mb-4 leading-tight" style={{ color: "var(--text-primary)" }}>
          The Blog
        </h1>
        <p className="text-xl max-w-xl" style={{ color: "var(--text-secondary)" }}>
          Thoughts on web development, design, and more.
        </p>
      </div>

      {articles.length === 0 ? (
        <div
          className="text-center py-28 rounded-2xl border-2 border-dashed"
          style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}
        >
          <p className="text-2xl mb-2 font-semibold" style={{ color: "var(--text-secondary)" }}>
            No articles yet.
          </p>
          <p className="text-sm">
            Head to{" "}
            <a href="/admin" style={{ color: "var(--accent)" }} className="hover:underline font-medium">
              Admin
            </a>{" "}
            to publish your first post.
          </p>
        </div>
      ) : (
        <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      )}
    </div>
  );
}
