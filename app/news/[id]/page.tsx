import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getLatestNews } from "@/lib/news-store";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const article = (await getLatestNews()).find((item) => item.id === decodeURIComponent(id));

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
      canonical: `/news/${article.id}`,
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
  const article = stories.find((item) => item.id === decodeURIComponent(id));

  if (!article) {
    notFound();
  }

  const related = stories.filter((item) => item.id !== article.id).slice(0, 3);

  return (
    <div className="detail-shell">
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
          <p className="detail-summary">{article.summary}</p>

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
                  <Link href={`/news/${story.id}`} className="story-link">
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
