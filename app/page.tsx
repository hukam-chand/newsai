const navItems = [
  "EDITORIAL PICKS",
  "SPORTS & HEALTH",
  "ARTS",
  "CULTURE",
  "CULTURE",
  "OPINION",
  "LIFESTYLE",
  "TRAVEL",
  "BUSINESS",
  "TECHNOLOGY",
];

const sideStories = [
  "Scientists Achieve Major Milestone, Paving the Way for Unprecedented Technological Advancements",
  "Scientists Achieve Major Milestone, Paving the Way for Unprecedented Technological Advancements",
  "Scientists Achieve Major Milestone, Paving the Way for Unprecedented Technological Advancements",
  "Scientists Achieve Major Milestone, Paving the Way for Unprecedented Technological Advancements",
  "Scientists Achieve Major Milestone, Paving the Way for Unprecedented Technological Advancements",
];

const cards = [
  {
    date: "02 JAN 2024",
    title: "Record-breaking Triumphs at the International Marathon Challenge",
  },
  {
    date: "02 JAN 2024",
    title: "Stock Market Hits All-Time High as Investors Rally Behind New Economic Forecasts",
  },
  {
    date: "02 JAN 2024",
    title: "Discover the Top Trending Destinations for a Sustainable Travel Experience in 2024",
  },
  {
    date: "02 JAN 2024",
    title: "Discover the Top Trending Destinations for a Sustainable Travel Experience in 2024",
  },
];

export default function HomePage() {
  return (
    <div className="publisher-shell">
      <div className="publisher-frame">
        <header className="topbar">
          <div className="brand-block">
            <span className="brand-mark">the</span>
            <span className="brand-name">ONTARION</span>
          </div>

          <div className="top-actions">
            <button type="button" className="ghost-button">
              Get Involved
            </button>
            <button type="button" className="ghost-button subtle">
              About
            </button>
            <button type="button" className="solid-button">
              Subscribe
            </button>
          </div>
        </header>

        <nav className="category-bar" aria-label="Main navigation">
          {navItems.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </nav>

        <main className="hero-section">
          <div className="hero-visual" />

          <div className="hero-content">
            <div className="lead-copy">
              <span className="eyebrow">POLITICS</span>
              <h1>
                Global Leaders Convene for
                <br />
                Historic Meeting, Paving the Way
                <br />
                for a Unified Future!
              </h1>
              <div className="meta-row">
                <span>Sean Paulia</span>
                <span>|</span>
                <span>January 01, 2024</span>
              </div>
              <button type="button" className="hero-button">
                Read Full News
                <span aria-hidden="true">›</span>
              </button>
            </div>

            <aside className="rail-panel" aria-label="Latest headlines">
              {sideStories.map((story, index) => (
                <div key={`${story}-${index}`} className="rail-item">
                  <span className="rail-date">Sean Paulia | January 01, 2024</span>
                  <p>{story}</p>
                  <span className="rail-tag">Technology</span>
                </div>
              ))}
            </aside>
          </div>
        </main>

        <section className="story-grid" aria-label="Latest stories">
          {cards.map((card, index) => (
            <article key={`${card.title}-${index}`} className="story-card">
              <div className="story-thumb" />
              <div className="story-body">
                <span className="story-date">{card.date}</span>
                <h2>{card.title}</h2>
              </div>
            </article>
          ))}
        </section>
      </div>
    </div>
  );
}
