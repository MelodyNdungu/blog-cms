import { NextRequest, NextResponse } from "next/server";
import { getAllArticles, createArticle } from "@/lib/articles";
import { ArticleInput } from "@/types/article";

export const dynamic = "force-static";

export async function GET() {
  const articles = getAllArticles();
  return NextResponse.json(articles);
}

export async function POST(request: NextRequest) {
  const body: ArticleInput = await request.json();

  if (!body.title || !body.content || !body.slug) {
    return NextResponse.json({ error: "title, slug, and content are required" }, { status: 400 });
  }

  const article = createArticle({
    title: body.title,
    slug: body.slug,
    excerpt: body.excerpt ?? "",
    content: body.content,
    author: body.author ?? "Anonymous",
    coverImage: body.coverImage,
    tags: body.tags ?? [],
    published: body.published ?? false,
    publishAt: body.publishAt ?? null,
  });

  return NextResponse.json(article, { status: 201 });
}
