"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import Masthead from "@/components/Masthead";
import StoryBlock from "@/components/StoryBlock";
import StoryRow from "@/components/StoryRow";
import Timeline from "@/components/Timeline";
import Intelligence from "@/components/Intelligence";
import Footer from "@/components/Footer";
import OverlayProvider from "@/components/OverlayProvider";
import type { NewsArticle } from "@/lib/types";
import { issueDate, issueNumber, keyFacts, keyPoints, pullQuote } from "@/lib/editorial";
import { sourceStyle } from "@/lib/sources";

const sampleArticles: NewsArticle[] = [
  {
    id: 1,
    title: "India widens public data access while regulators push for tighter oversight",
    content:
      "Officials said the next phase of digital governance will expand open datasets for researchers and public agencies while maintaining safeguards around sensitive personal information. The move follows a wider policy debate over transparency, public trust and the limits of automated decision-making.",
    url: "/article/1",
    source: "NDTV",
    published_at: "2026-09-20T08:40:00.000Z",
    scraped_at: "2026-09-20T09:05:00.000Z",
  },
  {
    id: 2,
    title: "Global shipping lanes face a sharper late-season squeeze after freight disruption",
    content:
      "Shipping executives described a renewed pinch in capacity as delivery windows tightened and fuel costs accelerated. Importers said the pressure raised costs for goods moving through major ports and kept new orders under review through the end of the quarter.",
    url: "/article/2",
    source: "TOI",
    published_at: "2026-09-20T07:55:00.000Z",
    scraped_at: "2026-09-20T08:30:00.000Z",
  },
  {
    id: 3,
    title: "Cities trial sensor-led traffic systems to cut congestion without widening roads",
    content:
      "Transport authorities said a new round of pilot programmes would use adaptive traffic lights and parking sensors to smooth urban movement. Engineers said the approach could reduce delays in dense corridors without building new road capacity.",
    url: "/article/3",
    source: "HT",
    published_at: "2026-09-20T06:25:00.000Z",
    scraped_at: "2026-09-20T06:40:00.000Z",
  },
  {
    id: 4,
    title: "Farm communities report crop pressure as rainfall swings become harder to predict",
    content:
      "Agricultural groups said erratic rainfall has made sowing decisions more difficult for smallholders and cooperatives. Analysts warned that shorter planning horizons could raise food-price volatility in regions already under climate stress.",
    url: "/article/4",
    source: "BBC Hindi",
    published_at: "2026-09-20T05:10:00.000Z",
    scraped_at: "2026-09-20T05:45:00.000Z",
  },
  {
    id: 5,
    title: "Startups bet on local manufacturing as supply chain resilience becomes a strategy issue",
    content:
      "Founders said a sharper focus on domestic assembly and component sourcing could reduce exposure to global bottlenecks. Investors described the shift as a mix of operational planning and strategic risk management rather than a broad return to protectionism.",
    url: "/article/5",
    source: "The Wire",
    published_at: "2026-09-20T04:15:00.000Z",
    scraped_at: "2026-09-20T04:40:00.000Z",
  },
];

export default function HomePage() {
  const [articles, setArticles] = useState<NewsArticle[]>(sampleArticles);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setArticles((current) => {
        if (current.length >= sampleArticles.length + 1) return current;
        return [...current, { ...sampleArticles[current.length % sampleArticles.length], id: Date.now() + current.length }];
      });
    }, 15000);

    return () => window.clearInterval(timer);
  }, []);

  const hero = useMemo(() => articles[0] ?? sampleArticles[0], [articles]);
  const secondary = useMemo(() => articles.slice(1, 4), [articles]);
  const quote = useMemo(() => pullQuote(hero.content, hero.source), [hero]);
  const facts = useMemo(() => keyFacts(hero.content, 3, hero.source), [hero]);
  const points = useMemo(() => keyPoints(hero.content, 3, hero.source), [hero]);

  const timeline = useMemo(
    () =>
      articles.slice(0, 4).map((article, index) => ({
        time: article.published_at.slice(11, 16),
        title: article.title,
        note: sourceStyle(article.source).label,
        href: `/article/${article.id}`,
        active: index === 0,
      })),
    [articles],
  );

  return (
    <OverlayProvider articles={articles}>
      <Masthead />

      <main id="main" className="page-fade">
        <section className="shell pb-12 pt-10 md:pb-16 md:pt-16">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line pb-5">
            <div>
              <p className="t-meta text-accent">Issue {issueNumber()}</p>
            </div>
            <p className="t-meta">{issueDate()}</p>
          </div>

          <div className="mt-10 grid gap-8 xl:grid-cols-[1.4fr_0.75fr]">
            <div>
              <Link href={`/article/${hero.id}`} className="group block">
                <div className="relative overflow-hidden rounded-[2rem] border border-line bg-soft p-3 md:p-5">
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <span className="t-meta text-accent">Lead story</span>
                    <span className="t-micro uppercase tracking-[0.2em] text-stone">
                      {sourceStyle(hero.source).short}
                    </span>
                  </div>

                  <div className="rounded-[1.5rem] border border-line bg-paper p-4 md:p-6">
                    <div className="mb-5 flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-stone">
                      <span>{sourceStyle(hero.source).label}</span>
                      <span>•</span>
                      <span>Verified</span>
                    </div>

                    <h1 className="max-w-3xl text-[clamp(2.8rem,5vw,5.2rem)] font-semibold leading-[0.96] tracking-[-0.06em] text-ink">
                      {hero.title}
                    </h1>

                    <p className="mt-6 max-w-2xl text-lg text-stone md:text-xl">
                      {hero.content.slice(0, 180)}
                    </p>

                    <div className="mt-8 flex items-center gap-4">
                      <span className="inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 text-sm font-medium text-ink">
                        Read the brief
                        <ArrowRight className="h-4 w-4" />
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </div>

            <aside className="space-y-4 rounded-[1.8rem] border border-line bg-soft p-4 md:p-6">
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-accent">
                <Sparkles className="h-3.5 w-3.5" />
                Editor’s note
              </div>
              <p className="text-xl font-medium leading-snug text-ink">
                The day’s signal is smaller, cleaner and easier to trust.
              </p>
              <p className="text-base leading-7 text-stone">
                NEWSAI distills the issue into a premium editorial flow: one lead story, a measured context rail, and a live timeline that updates as new filing arrives.
              </p>

              <div className="space-y-3 border-t border-line pt-4">
                {points.map((point, idx) => (
                  <div key={point} className="flex gap-3">
                    <span className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-accent/10 text-[10px] font-semibold text-accent">
                      {idx + 1}
                    </span>
                    <p className="text-sm leading-6 text-stone">{point}</p>
                  </div>
                ))}
              </div>
            </aside>
          </div>
        </section>

        <section className="shell pb-10 md:pb-14">
          <div className="mb-6 flex items-end justify-between gap-4 border-b border-line pb-4">
            <p className="t-meta text-accent">What’s moving</p>
            <span className="t-micro uppercase tracking-[0.2em] text-stone">Live desk brief</span>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {secondary.map((article, index) => (
              <StoryBlock
                key={article.id}
                article={article}
                index={index + 1}
                size={index === 0 ? "lead" : "standard"}
                ratio={index === 0 ? "feature" : "small"}
                showSummary
                showCta
                delay={index * 100}
              />
            ))}
          </div>
        </section>

        <section className="shell pb-12 md:pb-18">
          <div className="rounded-[2rem] border border-line bg-soft p-5 md:p-8">
            <div className="flex items-center justify-between gap-4 pb-4">
              <p className="t-meta text-accent">Reading the issue</p>
              <span className="t-micro uppercase tracking-[0.2em] text-stone">No refresh required</span>
            </div>

            <div className="grid gap-8 lg:grid-cols-[1.25fr_0.75fr]">
              <div>
                <div className="mb-4 flex items-center justify-between gap-4 border-b border-line pb-3">
                  <p className="t-meta">Latest filing</p>
                  <span className="t-micro uppercase tracking-[0.2em] text-stone">Updated live</span>
                </div>

                <ul className="space-y-0">
                  {articles.map((article) => (
                    <StoryRow key={article.id} article={article} withSummary />
                  ))}
                </ul>
              </div>

              <div className="space-y-6">
                <div className="rounded-[1.4rem] border border-line bg-paper p-5">
                  <p className="t-meta text-accent">Signal</p>
                  <p className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-ink">
                    {facts[0]?.value ?? "01"}
                  </p>
                  <p className="mt-3 text-sm leading-6 text-stone">{facts[0]?.label ?? "Key figures from the lead filing."}</p>
                </div>

                {quote ? (
                  <blockquote className="rounded-[1.4rem] border border-line bg-paper p-5 italic text-lg leading-8 text-ink">
                    “{quote}”
                  </blockquote>
                ) : null}
              </div>
            </div>
          </div>
        </section>

        <Intelligence articles={articles} />

        <section className="shell pb-12 md:pb-20">
          <div className="mb-8 flex items-end justify-between gap-4 border-b border-line pb-4">
            <p className="t-meta text-accent">The story so far</p>
            <span className="t-micro uppercase tracking-[0.2em] text-stone">Timeline</span>
          </div>
          <Timeline events={timeline} />
        </section>
      </main>

      <Footer />
    </OverlayProvider>
  );
}
