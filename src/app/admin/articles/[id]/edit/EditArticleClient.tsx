"use client";

import { Article, ArticleInput } from "@/types/article";
import ArticleForm from "@/components/ArticleForm";
import { useRouter } from "next/navigation";

export default function EditArticleClient({ article }: { article: Article }) {
  const router = useRouter();

  async function handleUpdate(data: ArticleInput) {
    const res = await fetch(`/api/articles/${article.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error ?? "Failed to update article");
    }
    router.push("/admin");
    router.refresh();
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold" style={{ color: "var(--text-primary)" }}>Edit Article</h1>
        <p className="mt-1 text-sm" style={{ color: "var(--text-secondary)" }}>Update the article details below.</p>
      </div>
      <div className="rounded-2xl shadow-sm p-8" style={{ backgroundColor: "var(--bg-surface)", border: "1px solid var(--border)" }}>
        <ArticleForm draftKey={article.id} initial={article} onSubmit={handleUpdate} />
      </div>
    </div>
  );
}
