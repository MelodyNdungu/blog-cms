import { getArticleById } from "@/lib/articles";
import { notFound } from "next/navigation";
import EditArticleClient from "./EditArticleClient";

export const dynamic = "force-dynamic";

export default async function EditArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const article = getArticleById(id);
  if (!article) notFound();
  return <EditArticleClient article={article} />;
}
