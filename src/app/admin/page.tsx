import { getAllArticles } from "@/lib/articles";
import { Article } from "@/types/article";
import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";
import MagicLinkButton from "@/components/MagicLinkButton";

export const dynamic = "force-dynamic";

function getStatus(article: Article): "published" | "scheduled" | "draft" {
  if (!article.published) return "draft";
  if (article.publishAt && new Date(article.publishAt) > new Date()) return "scheduled";
  return "published";
}

type StatusKey = "published" | "scheduled" | "draft";

const statusChip: Record<StatusKey, { bg: string; color: string; border: string; label: string }> = {
  published: { bg: "#F0FDF4", color: "#166534", border: "#BBF7D0", label: "Published" },
  scheduled: { bg: "#EFF6FF", color: "#1E40AF", border: "#BFDBFE", label: "Scheduled" },
  draft:     { bg: "#FFFBEB", color: "#92400E", border: "#FDE68A", label: "Draft" },
};

export default function AdminPage() {
  const articles = getAllArticles().sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="flex items-start justify-between mb-8 gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: "var(--text-primary)" }}>
            Articles
          </h1>
          <p className="mt-1 text-sm" style={{ color: "var(--text-secondary)" }}>
            {articles.length} article{articles.length !== 1 ? "s" : ""} total
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <MagicLinkButton />
          <LogoutButton />
          <Link
            href="/admin/articles/new"
            className="text-white px-5 py-2 rounded-lg text-sm font-semibold transition-colors"
            style={{ backgroundColor: "var(--accent)" }}
          >
            + New Article
          </Link>
        </div>
      </div>

      {articles.length === 0 ? (
        <div
          className="text-center py-24 rounded-2xl border-2 border-dashed"
          style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}
        >
          <p className="text-xl mb-2 font-semibold" style={{ color: "var(--text-secondary)" }}>
            No articles yet
          </p>
          <Link
            href="/admin/articles/new"
            className="text-sm font-medium hover:underline"
            style={{ color: "var(--accent)" }}
          >
            Create your first article \u2192
          </Link>
        </div>
      ) : (
        <div
          className="rounded-2xl overflow-hidden shadow-sm"
          style={{ border: "1px solid var(--border)", backgroundColor: "var(--bg-surface)" }}
        >
          {articles.map((article, i) => {
            const status = getStatus(article);
            const chip = statusChip[status];
            return (
              <div
                key={article.id}
                className="flex items-center justify-between px-6 py-4 transition-colors"
                style={{
                  borderTop: i > 0 ? "1px solid var(--border)" : "none",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--accent-light)")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "")}
              >
                <div className="min-w-0 flex-1">
                  <h2 className="font-semibold truncate" style={{ color: "var(--text-primary)" }}>
                    {article.title}
                  </h2>
                  <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                    <span
                      className="text-xs px-2 py-0.5 rounded-full font-semibold"
                      style={{ backgroundColor: chip.bg, color: chip.color, border: `1px solid ${chip.border}` }}
                    >
                      {chip.label}
                    </span>
                    {status === "scheduled" && article.publishAt && (
                      <span className="text-xs" style={{ color: "var(--text-secondary)" }}>
                        {new Date(article.publishAt).toLocaleString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    )}
                    <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                      Updated{" "}
                      {new Date(article.updatedAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                    {article.author && (
                      <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                        By {article.author}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 ml-4 shrink-0">
                  {status === "published" && (
                    <Link
                      href={`/blog/${article.slug}`}
                      target="_blank"
                      className="text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors"
                      style={{ color: "var(--text-secondary)", borderColor: "var(--border)" }}
                    >
                      View
                    </Link>
                  )}
                  <Link
                    href={`/admin/articles/${article.id}/edit`}
                    className="text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors"
                    style={{ color: "var(--accent)", borderColor: "#C7D2FE", backgroundColor: "var(--accent-light)" }}
                  >
                    Edit
                  </Link>
                  <Link
                    href={`/admin/articles/${article.id}/delete`}
                    className="text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors"
                    style={{ color: "#B91C1C", borderColor: "#FECACA", backgroundColor: "#FEF2F2" }}
                  >
                    Delete
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
