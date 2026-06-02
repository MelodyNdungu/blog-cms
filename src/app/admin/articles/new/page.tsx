"use client";

import ArticleForm from "@/components/ArticleForm";
import { ArticleInput } from "@/types/article";
import { useRouter } from "next/navigation";

export default function NewArticlePage() {
  const router = useRouter();

  async function handleCreate(data: ArticleInput) {
    const res = await fetch("/api/articles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error ?? "Failed to create article");
    }
    router.push("/admin");
    router.refresh();
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold" style={{ color: "var(--text-primary)" }}>New Article</h1>
        <p className="mt-1 text-sm" style={{ color: "var(--text-secondary)" }}>Fill in the details below to create a new article.</p>
      </div>
      <div className="rounded-2xl shadow-sm p-8" style={{ backgroundColor: "var(--bg-surface)", border: "1px solid var(--border)" }}>
        <ArticleForm onSubmit={handleCreate} />
      </div>
    </div>
  );
}
