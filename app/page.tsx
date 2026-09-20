"use client";

import { useEffect, useState } from "react";
import { NewsItem } from "@/lib/news-store";

export default function HomePage() {
  const [stories, setStories] = useState<NewsItem[]>([]);
  const [visibleCount, setVisibleCount] = useState(10);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStories() {
      try {
        const response = await fetch("/api/news");
        if (!response.ok) {
          throw new Error("Failed to load news");
        }
        const data = (await response.json()) as NewsItem[];
        setStories(data);
      } catch {
        setStories([]);
      } finally {
        setLoading(false);
      }
    }

    loadStories();
  }, []);

  const featuredStory = stories[0] ?? null;
  const visibleStories = stories.slice(1, visibleCount);
  const hasMore = visibleCount < stories.length;

  return (
    <div className="news-shell">
      <div className="news-page">
        <header className="masthead">
          <div className="brand-group">
            <span className="live-pill">Live</span>
            <span className="brand-name">NEWSAI</span>
          </div>
          <div className="brand-note">Latest headlines • global brief</div>
        </header>

        {loading ? (
          <div className="loading-state">Loading top stories…</div>
        ) : featuredStory ? (
          <>
            <main
              className="feature-hero"
              style={{
                backgroundImage: `linear-gradient(90deg, rgba(8, 10, 14, 0.82) 0%, rgba(8, 10, 14, 0.28) 38%, rgba(8, 10, 14, 0.62) 100%), url(${featuredStory.image})`,
              }}
            >
              <div className="hero-content-panel">
                <span className="hero-tag">{featuredStory.category}</span>
                <h1>{featuredStory.title}</h1>
                <div className="hero-meta">
                  <span>{featuredStory.source}</span>
                  <span className="meta-divider">•</span>
                  <span>{new Date(featuredStory.publishedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                </div>
                <button type="button" className="read-more-button">
                  Read full story
                </button>
              </div>
            </main>

            <section className="news-section" aria-label="Latest news stories">
              <div className="section-label-row">
                <span className="section-label">Top Stories</span>
                <span className="section-count">{visibleStories.length} stories</span>
              </div>

              <div className="story-grid">
                {visibleStories.map((story) => (
                  <article key={story.id} className="story-card">
                    <div
                      className="story-image"
                      style={{ backgroundImage: `url(${story.image})` }}
                      aria-label={story.title}
                    />
                    <div className="story-body">
                      <span className="story-category">{story.category}</span>
                      <h2>{story.title}</h2>
                      <p className="story-summary">{story.summary}</p>
                      <div className="story-footer">
                        <span>{story.source}</span>
                        <span>{new Date(story.publishedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              {hasMore ? (
                <div className="load-more-row">
                  <button
                    type="button"
                    className="load-more-button"
                    onClick={() => setVisibleCount((current) => Math.min(current + 4, stories.length))}
                  >
                    Load more
                  </button>
                </div>
              ) : null}
            </section>
          </>
        ) : (
          <div className="loading-state">No stories available right now.</div>
        )}
      </div>
    </div>
  );
}
