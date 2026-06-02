export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  coverImage?: string;
  tags: string[];
  published: boolean;
  publishAt?: string | null; // ISO date — if set, article only shows publicly after this time
  createdAt: string;
  updatedAt: string;
}

export type ArticleInput = Omit<Article, "id" | "createdAt" | "updatedAt">;
