"use client";

import { useState } from "react";

type Story = {
  id: number;
  category: string;
  title: string;
  author: string;
  date: string;
  image: string;
};

const stories: Story[] = [
  {
    id: 1,
    category: "World Affairs",
    title: "Global leaders unveil a bold new vision for cleaner cities and smarter futures.",
    author: "Alicia Morgan",
    date: "12 Aug 2026",
    image:
      "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&w=1600&q=80",
  },
  {
    id: 2,
    category: "Technology",
    title: "AI startups race to build practical tools for everyday life and work.",
    author: "Daniel Brooks",
    date: "11 Aug 2026",
    image:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 3,
    category: "Business",
    title: "Markets rebound as investors focus on resilient sectors and long-term growth.",
    author: "Harper Lee",
    date: "10 Aug 2026",
    image:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 4,
    category: "Culture",
    title: "A new generation of artists is redefining the future of design and storytelling.",
    author: "Noah Carter",
    date: "09 Aug 2026",
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 5,
    category: "Travel",
    title: "Remote escapes and slow travel are driving a new era of global exploration.",
    author: "Leah Turner",
    date: "08 Aug 2026",
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 6,
    category: "Health",
    title: "Wellness programs are reshaping how employers support long-term productivity.",
    author: "Sofia Bennett",
    date: "07 Aug 2026",
    image:
      "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 7,
    category: "Sports",
    title: "Championship hopes rise as teams prepare for a high-stakes late season push.",
    author: "Mason Bell",
    date: "06 Aug 2026",
    image:
      "https://images.unsplash.com/photo-1547347298-4074fc3086f0?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 8,
    category: "Science",
    title: "Researchers uncover promising methods to improve climate resilience in cities.",
    author: "Emma Ortiz",
    date: "05 Aug 2026",
    image:
      "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 9,
    category: "Politics",
    title: "Regional councils move to reshape policy frameworks for a more connected future.",
    author: "Lucas Grant",
    date: "04 Aug 2026",
    image:
      "https://images.unsplash.com/photo-1495020689067-958852a7765e?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 10,
    category: "Lifestyle",
    title: "Design-led living spaces are becoming the new benchmark for modern routines.",
    author: "Jasmine Hill",
    date: "03 Aug 2026",
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 11,
    category: "World Affairs",
    title: "Infrastructure investment sparks fresh debate across major growth corridors.",
    author: "Henry Price",
    date: "02 Aug 2026",
    image:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 12,
    category: "Innovation",
    title: "New financial tools are making sustainable investing more accessible to young founders.",
    author: "Olivia Young",
    date: "01 Aug 2026",
    image:
      "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=900&q=80",
  },
];

export default function HomePage() {
  const [visibleCount, setVisibleCount] = useState(10);

  const featuredStory = stories[0];
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
              <span>{featuredStory.author}</span>
              <span className="meta-divider">•</span>
              <span>{featuredStory.date}</span>
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
                  <div className="story-footer">
                    <span>{story.author}</span>
                    <span>{story.date}</span>
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
      </div>
    </div>
  );
}
