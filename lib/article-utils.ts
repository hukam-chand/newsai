export type NewsItem = {
  id: string;
  title: string;
  summary: string;
  content?: string;
  source: string;
  publishedAt: string;
  image: string;
  url: string;
  category: string;
};

export function toArticleSlug(item: Pick<NewsItem, "id" | "title">): string {
  const slug = item.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 90)
    .replace(/-+$/g, "");

  return slug ? `${slug}-${item.id}` : String(item.id);
}
