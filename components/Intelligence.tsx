"use client";

import { useMemo } from "react";
import type { NewsArticle } from "@/lib/types";
import { sourceStyle } from "@/lib/sources";
import { clockTime, issueNumber } from "@/lib/editorial";
import { pad2 } from "@/lib/utils";
import Reveal from "./Reveal";

interface Column {
  title: string;
  value: string;
  body: string;
}

/**
 * NEWSAI INTELLIGENCE — the signature three-column reading of the issue.
 *
 * Every figure below is counted from the filings actually stored (how many, how
 * many desks, first and last arrival). Nothing is invented: when the issue is
 * empty, the columns say so plainly.
 */
export default function Intelligence({ articles }: { articles: NewsArticle[] }) {
  const columns = useMemo<Column[]>(() => {
    const desks = new Map<string, number>();
    for (const article of articles) {
      const desk = sourceStyle(article.source).short;
      desks.set(desk, (desks.get(desk) ?? 0) + 1);
    }

    const ranked = [...desks.entries()].sort((a, b) => b[1] - a[1]);
    const stamps = articles
      .map((article) => new Date(article.published_at))
      .filter((date) => !Number.isNaN(date.getTime()))
      .sort((a, b) => a.getTime() - b.getTime());

    const total = articles.length;
    const first = stamps[0];
    const last = stamps[stamps.length - 1];

    if (total === 0) {
      return [
        {
          title: "What happened",
          value: "00",
          body: "No filing has landed in this cycle yet. The desk re-reads every wire every ten minutes and publishes only what it can verify.",
        },
        {
          title: "Why it matters",
          value: "—",
          body: "There is nothing to weigh yet. NEWSAI would rather print an empty issue than fill one with anything unverified.",
        },
        {
          title: "What's next",
          value: "10",
          body: "Minutes is the filing cycle. The next pass promotes new reporting into this issue and extends the timeline below.",
        },
      ];
    }

    const topDesk = ranked[0];
    const topCount = topDesk ? topDesk[1] : 0;
    const remainder = total - topCount;

    return [
      {
        title: "What happened",
        value: String(total),
        body: `Verified ${
          total === 1 ? "filing" : "filings"
        } in issue ${issueNumber()}, filed across ${ranked.length} ${
          ranked.length === 1 ? "desk" : "desks"
        }. The window opened at ${clockTime(first)} GMT and the latest arrival was logged at ${clockTime(
          last,
        )} GMT.`,
      },
      {
        title: "Why it matters",
        value: String(topCount),
        body: topDesk
          ? `of those filings carry the ${topDesk[0]} desk — the heaviest single line of reporting right now, with a further ${remainder} spread across the other desks. That distribution is where the day is moving fastest.`
          : "The day's reporting sits evenly across the desks.",
      },
      {
        title: "What's next",
        value: "10",
        body: "Minutes is the filing cycle. The next pass re-reads every desk, promotes new filings into this issue and extends the timeline below, newest development first.",
      },
    ];
  }, [articles]);

  return (
    <section className="section-pad" aria-labelledby="newsai-intelligence">
      <div className="shell">
        <p className="t-meta">Signature reading</p>
        <h2 id="newsai-intelligence" className="t-hero mt-6">
          NEWSAI
          <span className="block text-accent">Intelligence</span>
        </h2>

        <div className="grid-editorial mt-16">
          {columns.map((column, index) => (
            <Reveal
              key={column.title}
              className="col-span-12 md:col-span-4"
              delay={index * 80}
            >
              <div className="border-t border-line pt-6">
                <div className="flex items-baseline justify-between gap-4">
                  <span className="t-meta text-accent">{pad2(index + 1)}</span>
                  <span className="t-num text-ink">{column.value}</span>
                </div>
                <h3 className="t-title mt-6 uppercase">{column.title}</h3>
                <p className="t-body mt-4">{column.body}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <p className="t-micro mt-12">
          Synthesised from {articles.length} verified{" "}
          {articles.length === 1 ? "filing" : "filings"} in issue {issueNumber()}{" "}
          · recomputed on every update
        </p>
      </div>
    </section>
  );
}
