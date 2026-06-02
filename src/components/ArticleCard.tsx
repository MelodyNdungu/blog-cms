import Link from "next/link";
import Image from "next/image";
import { Article } from "@/types/article";

export default function ArticleCard({ article }: { article: Article }) {
  return (
    <article
      className="rounded-2xl overflow-hidden hover:shadow-lg transition-shadow flex flex-col"
      style={{
        backgroundColor: "var(--bg-surface)",
        border: "1px solid var(--border)",
        boxShadow: "0 1px 4px 0 rgb(0 0 0 / 0.06)",
      }}
    >
      {article.coverImage && (
        <div className="relative h-48 w-full">
          <Image
            src={article.coverImage}
            alt={article.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        </div>
      )}
      <div className="p-5 flex flex-col flex-1">
        <div className="flex flex-wrap gap-2 mb-3">
          {article.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs font-semibold px-2.5 py-0.5 rounded-full"
              style={{
                backgroundColor: "var(--accent-light)",
                color: "var(--accent)",
              }}
            >
              {tag}
            </span>
          ))}
        </div>

        <h2 className="text-lg font-bold mb-2 leading-snug" style={{ color: "var(--text-primary)" }}>
          <Link
            href={`/blog/${article.slug}`}
            className="transition-colors hover:underline decoration-[var(--accent)] underline-offset-2"
            style={{ color: "var(--text-primary)" }}
          >
            {article.title}
          </Link>
        </h2>

        <p className="text-sm mb-4 line-clamp-3 flex-1" style={{ color: "var(--text-secondary)", lineHeight: "1.7" }}>
          {article.excerpt}
        </p>

        <div
          className="flex items-center justify-between mt-auto pt-3"
          style={{ borderTop: "1px solid var(--border)" }}
        >
          <span className="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>
            By{" "}
            <span className="font-semibold" style={{ color: "var(--text-primary)" }}>
              {article.author}
            </span>
          </span>
          <span className="text-xs" style={{ color: "var(--text-muted)" }}>
            {new Date(article.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </span>
        </div>
      </div>
    </article>
  );
}
