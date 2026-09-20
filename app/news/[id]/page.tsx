import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { toArticleSlug } from "@/lib/article-utils";
import { getLatestNews } from "@/lib/news-store";

function matchArticle(stories: Awaited<ReturnType<typeof getLatestNews>>, id: string) {
  const decodedId = decodeURIComponent(id);
  const numericId = Number(decodedId.split("-").pop() ?? decodedId);

  return (
    stories.find((item) => toArticleSlug(item) === decodedId) ??
    stories.find((item) => String(item.id) === decodedId) ??
    stories.find((item) => Number(item.id) === numericId) ??
    stories.find((item) => item.url === decodedId || item.url === decodeURIComponent(id))
  );
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const stories = await getLatestNews();
  const article = matchArticle(stories, id);

  if (!article) {
    return {
      title: "Article not found | UHNEWS",
      description: "The requested UHNEWS article could not be found.",
    };
  }

  return {
    title: article.title,
    description: article.summary,
    alternates: {
      canonical: `/news/${toArticleSlug(article)}`,
    },
    openGraph: {
      title: article.title,
      description: article.summary,
      siteName: "UHNEWS",
      type: "article",
      images: [article.image],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.summary,
    },
  };
}

export default async function NewsDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const stories = await getLatestNews();
  const article = matchArticle(stories, id);

  if (!article) {
    notFound();
  }

  const related = stories.filter((item) => item.id !== article.id).slice(0, 3);
  const bodyText = article.content || article.summary;
  const paragraphs = bodyText
    .split(/\n\s*\n|(?<=[.!?])\s+(?=[A-Z0-9])/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  return (
    <div className="detail-shell">
      <header className="masthead detail-masthead">
        <div className="brand-group">
          <span className="live-pill">Live</span>
          <span className="brand-name">UHNEWS</span>
        </div>
        <div className="brand-note">Latest headlines • global brief</div>
      </header>

      <article className="detail-card">
        <div
          className="detail-cover"
          style={{
            backgroundImage: `linear-gradient(180deg, rgba(8,10,14,0.12), rgba(8,10,14,0.6)), url(${article.image})`,
          }}
        />

        <div className="detail-body">
          <div className="detail-topline">
            <span>{article.category}</span>
            <span>•</span>
            <span>{article.source}</span>
            <span>•</span>
            <time dateTime={article.publishedAt}>
              {new Date(article.publishedAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </time>
          </div>

          <h1>{article.title}</h1>
          <div className="detail-summary">
            {paragraphs.map((paragraph, index) => (
              <p key={`${article.id}-paragraph-${index}`}>{paragraph.trim()}</p>
            ))}
          </div>

          <div className="detail-actions">
            <a href={article.url} target="_blank" rel="noreferrer" className="detail-primary">
              Read original
            </a>
            <Link href="/" className="detail-secondary">
              Back to home
            </Link>
          </div>
        </div>
      </article>

      {related.length ? (
        <section aria-label="Related stories" style={{ marginTop: 28 }}>
          <div className="section-label-row">
            <span className="section-label">Related stories</span>
            <span className="section-count">More from UHNEWS</span>
          </div>

          <div className="related-grid">
            {related.map((story) => (
              <article key={story.id} className="related-card">
                <div
                  className="story-image"
                  style={{ backgroundImage: `url(${story.image})` }}
                  aria-label={story.title}
                />
                <div className="story-body">
                  <span className="story-category">{story.category}</span>
                  <h2>{story.title}</h2>
                  <div className="story-footer">
                    <span>{story.source}</span>
                    <span>{new Date(story.publishedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                  </div>
                  <Link href={`/news/${toArticleSlug(story)}`} className="story-link">
                    Read article
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
