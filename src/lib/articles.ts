import fs from "fs";
import path from "path";
import { Article, ArticleInput } from "@/types/article";

const DATA_FILE = path.join(process.cwd(), "data", "articles.json");

function ensureDataFile() {
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2));
}

export function getAllArticles(): Article[] {
  ensureDataFile();
  const raw = fs.readFileSync(DATA_FILE, "utf-8");
  return JSON.parse(raw) as Article[];
}

export function getPublishedArticles(): Article[] {
  const now = new Date();
  return getAllArticles().filter(
    (a) => a.published && (!a.publishAt || new Date(a.publishAt) <= now)
  );
}

export function getArticleById(id: string): Article | undefined {
  return getAllArticles().find((a) => a.id === id);
}

export function getArticleBySlug(slug: string): Article | undefined {
  return getAllArticles().find((a) => a.slug === slug);
}

export function createArticle(input: ArticleInput): Article {
  const articles = getAllArticles();
  const now = new Date().toISOString();
  const article: Article = {
    ...input,
    id: crypto.randomUUID(),
    createdAt: now,
    updatedAt: now,
  };
  articles.push(article);
  save(articles);
  return article;
}

export function updateArticle(id: string, input: Partial<ArticleInput>): Article | null {
  const articles = getAllArticles();
  const idx = articles.findIndex((a) => a.id === id);
  if (idx === -1) return null;
  articles[idx] = { ...articles[idx], ...input, updatedAt: new Date().toISOString() };
  save(articles);
  return articles[idx];
}

export function deleteArticle(id: string): boolean {
  const articles = getAllArticles();
  const next = articles.filter((a) => a.id !== id);
  if (next.length === articles.length) return false;
  save(next);
  return true;
}

function save(articles: Article[]) {
  ensureDataFile();
  fs.writeFileSync(DATA_FILE, JSON.stringify(articles, null, 2));
}
