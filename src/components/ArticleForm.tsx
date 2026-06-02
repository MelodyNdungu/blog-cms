"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Article, ArticleInput } from "@/types/article";

interface ArticleFormProps {
  initial?: Partial<Article>;
  onSubmit?: (data: ArticleInput) => Promise<void>;
}

type PublishMode = "draft" | "publish" | "scheduled";

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getInitialPublishMode(initial?: Partial<Article>): PublishMode {
  if (!initial?.published) return "draft";
  if (initial.publishAt && new Date(initial.publishAt) > new Date()) return "scheduled";
  return "publish";
}

export default function ArticleForm({ initial, onSubmit }: ArticleFormProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    title: initial?.title ?? "",
    slug: initial?.slug ?? "",
    excerpt: initial?.excerpt ?? "",
    content: initial?.content ?? "",
    author: initial?.author ?? "",
    coverImage: initial?.coverImage ?? "",
    tags: initial?.tags ?? [] as string[],
  });

  const [tagInput, setTagInput] = useState("");
  const [publishMode, setPublishMode] = useState<PublishMode>(getInitialPublishMode(initial));
  const [scheduledFor, setScheduledFor] = useState<string>(
    initial?.publishAt
      ? new Date(initial.publishAt).toISOString().slice(0, 16)
      : new Date(Date.now() + 3_600_000).toISOString().slice(0, 16)
  );

  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleTitleChange(value: string) {
    set("title", value);
    if (!initial?.slug) set("slug", slugify(value));
  }

  function addTag() {
    const t = tagInput.trim();
    if (t && !form.tags.includes(t)) set("tags", [...form.tags, t]);
    setTagInput("");
  }

  function removeTag(tag: string) {
    set("tags", form.tags.filter((t) => t !== tag));
  }

  function handleFileImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      if (file.name.endsWith(".json")) {
        try {
          const data = JSON.parse(text);
          setForm((prev) => ({
            ...prev,
            title: data.title ?? prev.title,
            slug: data.slug ?? (data.title ? slugify(data.title) : prev.slug),
            excerpt: data.excerpt ?? prev.excerpt,
            content: data.content ?? prev.content,
            author: data.author ?? prev.author,
            coverImage: data.coverImage ?? prev.coverImage,
            tags: Array.isArray(data.tags) ? data.tags : prev.tags,
          }));
          if (data.publishAt) {
            setPublishMode("scheduled");
            setScheduledFor(new Date(data.publishAt).toISOString().slice(0, 16));
          }
        } catch {
          setError("Invalid JSON file — could not parse.");
        }
      } else if (file.name.endsWith(".md") || file.name.endsWith(".mdx")) {
        const fmMatch = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)/);
        if (fmMatch) {
          const fm = fmMatch[1];
          const content = fmMatch[2].trim();
          const get = (key: string) =>
            fm.match(new RegExp(`^${key}:\\s*(.+)$`, "m"))?.[1]?.trim().replace(/^['"]|['"]$/g, "");
          const tagsMatch = fm.match(/^tags:\s*\[(.+)\]$/m);
          setForm((prev) => ({
            ...prev,
            title: get("title") ?? prev.title,
            slug: get("slug") ?? (get("title") ? slugify(get("title")!) : prev.slug),
            excerpt: get("excerpt") ?? prev.excerpt,
            author: get("author") ?? prev.author,
            tags: tagsMatch
              ? tagsMatch[1].split(",").map((t) => t.trim().replace(/^['"]|['"]$/g, ""))
              : prev.tags,
            content,
          }));
        } else {
          const baseName = file.name.replace(/\.(mdx?)$/, "");
          setForm((prev) => ({
            ...prev,
            title: prev.title || baseName,
            slug: prev.slug || slugify(baseName),
            content: text.trim(),
          }));
        }
      }
    };
    reader.readAsText(file);
    e.target.value = ""; // allow re-importing the same file
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    if (!form.title || !form.slug || !form.content) {
      setError("Title, slug, and content are required.");
      return;
    }
    if (publishMode === "scheduled" && !scheduledFor) {
      setError("Please pick a date and time for scheduled publication.");
      return;
    }
    setSaving(true);
    try {
      const data: ArticleInput = {
        ...form,
        published: publishMode !== "draft",
        publishAt: publishMode === "scheduled" ? new Date(scheduledFor).toISOString() : null,
      };
      if (onSubmit) await onSubmit(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSaving(false);
    }
  }

  const inputClass =
    "w-full rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500";
  const inputStyle = {
    border: "1px solid var(--border)",
    color: "var(--text-primary)",
    backgroundColor: "var(--bg-page)",
  };
  const labelClass = "block text-sm font-semibold mb-1.5";
  const labelStyle = { color: "var(--text-primary)" };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="px-4 py-3 rounded-lg text-sm font-medium" style={{ backgroundColor: "#FEF2F2", border: "1px solid #FECACA", color: "#B91C1C" }}>
          {error}
        </div>
      )}

      {/* ── File Import ────────────────────────────────── */}
      <div className="border border-dashed rounded-xl p-4" style={{ borderColor: "var(--border)", backgroundColor: "var(--accent-light)" }}>
        <p className="text-sm font-semibold mb-1" style={{ color: "var(--text-primary)" }}>Import from file</p>
        <p className="text-xs mb-3" style={{ color: "var(--text-secondary)" }}>
          Upload a <code className="px-1 rounded font-mono" style={{ backgroundColor: "#E0E7FF" }}>.md</code> or{" "}
          <code className="px-1 rounded font-mono" style={{ backgroundColor: "#E0E7FF" }}>.json</code> file to pre-fill the form.
        </p>
        <label className="inline-flex items-center gap-2 cursor-pointer text-sm font-medium px-4 py-2 rounded-lg transition-colors" style={{ backgroundColor: "var(--bg-surface)", border: "1px solid var(--border)", color: "var(--text-primary)" }}>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: "var(--text-secondary)" }}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
          </svg>
          Choose file
          <input type="file" accept=".md,.mdx,.json" onChange={handleFileImport} className="hidden" />
        </label>
      </div>

      {/* ── Title ─────────────────────────────────────── */}
      <div>
        <label className={labelClass} style={labelStyle}>
          Title <span style={{ color: "#DC2626" }}>*</span>
        </label>
        <input
          type="text"
          value={form.title}
          onChange={(e) => handleTitleChange(e.target.value)}
          placeholder="My Awesome Article"
          className={inputClass}
          style={inputStyle}
          required
        />
      </div>

      {/* ── Slug ──────────────────────────────────────── */}
      <div>
        <label className={labelClass} style={labelStyle}>
          Slug <span style={{ color: "#DC2626" }}>*</span>
        </label>
        <input
          type="text"
          value={form.slug}
          onChange={(e) => set("slug", e.target.value)}
          placeholder="my-awesome-article"
          className={inputClass + " font-mono"}
          style={inputStyle}
          required
        />
        <p className="text-xs mt-1" style={{ color: "var(--text-secondary)" }}>URL: /blog/{form.slug || "…"}</p>
      </div>

      {/* ── Excerpt ───────────────────────────────────── */}
      <div>
        <label className={labelClass} style={labelStyle}>Excerpt</label>
        <textarea
          value={form.excerpt}
          onChange={(e) => set("excerpt", e.target.value)}
          rows={2}
          placeholder="A short summary shown in article listings…"
          className={inputClass + " resize-none"}
          style={inputStyle}
        />
      </div>

      {/* ── Content ───────────────────────────────────── */}
      <div>
        <label className={labelClass} style={labelStyle}>
          Content (Markdown) <span style={{ color: "#DC2626" }}>*</span>
        </label>
        <textarea
          value={form.content}
          onChange={(e) => set("content", e.target.value)}
          rows={14}
          placeholder="Write your article in Markdown…"
          className={inputClass + " font-mono resize-y"}
          style={inputStyle}
          required
        />
      </div>

      {/* ── Author ────────────────────────────────────── */}
      <div>
        <label className={labelClass} style={labelStyle}>Author</label>
        <input
          type="text"
          value={form.author}
          onChange={(e) => set("author", e.target.value)}
          placeholder="Jane Smith"
          className={inputClass}
          style={inputStyle}
        />
      </div>

      {/* ── Cover Image ───────────────────────────────── */}
      <div>
        <label className={labelClass} style={labelStyle}>Cover Image URL</label>
        <input
          type="url"
          value={form.coverImage ?? ""}
          onChange={(e) => set("coverImage", e.target.value)}
          placeholder="https://example.com/image.jpg"
          className={inputClass}
          style={inputStyle}
        />
        {form.coverImage && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={form.coverImage}
            alt="Cover preview"
            className="mt-2 h-32 w-full object-cover rounded-lg"
            style={{ border: "1px solid var(--border)" }}
          />
        )}
      </div>

      {/* ── Tags ──────────────────────────────────────── */}
      <div>
        <label className={labelClass} style={labelStyle}>Tags</label>
        <div className="flex gap-2 mb-2 flex-wrap">
          {form.tags.map((tag) => (
            <span
              key={tag}
              className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-semibold"
              style={{ backgroundColor: "var(--accent-light)", color: "var(--accent)", border: "1px solid #C7D2FE" }}
            >
              {tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                aria-label={`Remove ${tag}`}
                className="ml-0.5 leading-none hover:opacity-70"
                style={{ color: "var(--accent)" }}
              >
                ×
              </button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
            placeholder="Add a tag…"
            className={inputClass}
            style={inputStyle}
          />
          <button
            type="button"
            onClick={addTag}
            className="text-sm px-4 py-2.5 rounded-lg font-semibold transition-colors"
            style={{ border: "1px solid var(--border)", color: "var(--text-primary)", backgroundColor: "var(--bg-surface)" }}
          >
            Add
          </button>
        </div>
      </div>

      {/* ── Publishing ────────────────────────────────── */}
      <div>
        <p className="text-sm font-semibold mb-3" style={{ color: "var(--text-primary)" }}>Publishing</p>
        <div className="space-y-2.5">
          {(["draft", "publish", "scheduled"] as PublishMode[]).map((mode) => (
            <label key={mode} className="flex items-center gap-3 cursor-pointer group">
              <input
                type="radio"
                name="publishMode"
                value={mode}
                checked={publishMode === mode}
                onChange={() => setPublishMode(mode)}
                className="h-4 w-4 text-indigo-600 border-gray-400 focus:ring-indigo-500"
              />
              <span className="text-sm font-medium transition-colors" style={{ color: "var(--text-primary)" }}>
                {mode === "draft" && "Save as draft"}
                {mode === "publish" && "Publish immediately"}
                {mode === "scheduled" && "Schedule for later"}
              </span>
            </label>
          ))}
        </div>
        {publishMode === "scheduled" && (
          <div className="mt-3 ml-7">
            <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-primary)" }}>
              Publish date &amp; time <span style={{ color: "#DC2626" }}>*</span>
            </label>
            <input
              type="datetime-local"
              value={scheduledFor}
              onChange={(e) => setScheduledFor(e.target.value)}
              min={new Date().toISOString().slice(0, 16)}
              className="rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              style={inputStyle}
              required
            />
            <p className="text-xs mt-1" style={{ color: "var(--text-secondary)" }}>
              The article will become visible to readers at this time.
            </p>
          </div>
        )}
      </div>

      {/* ── Actions ───────────────────────────────────── */}
      <div className="flex justify-end gap-3 pt-4" style={{ borderTop: "1px solid var(--border)" }}>
        <button
          type="button"
          onClick={() => router.back()}
          className="text-sm px-5 py-2.5 rounded-lg font-medium transition-colors"
          style={{ border: "1px solid var(--border)", color: "var(--text-primary)", backgroundColor: "var(--bg-surface)" }}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={saving}
          className="text-sm px-5 py-2.5 text-white rounded-lg disabled:opacity-60 transition-colors font-semibold"
          style={{ backgroundColor: "var(--accent)" }}
        >
          {saving ? "Saving…" : initial?.id ? "Update Article" : "Create Article"}
        </button>
      </div>
    </form>
  );
}
