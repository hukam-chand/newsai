"use client";

import Link from "next/link";
import type { NewsArticle } from "@/lib/types";
import { sourceStyle } from "@/lib/sources";
import { cleanTitle, dayStamp, standfirst } from "@/lib/editorial";
import { cn, timeAgo } from "@/lib/utils";

/**
 * A single filing set as an editorial row: category, headline, date and
 * description separated by hairlines — never a boxed card.
 */
export default function StoryRow({
  article,
  active = false,
  withSummary = true,
}: {
  article: NewsArticle;
  /** Highlights the row while it is the keyboard target. */
  active?: boolean;
  withSummary?: boolean;
}) {
  const desk = sourceStyle(article.source);
  const summary = withSummary ? standfirst(article.content, 160, article.source) : "";

  return (
    <li className="border-b border-line">
      <Link
        id={`filing-${article.id}`}
        href={`/article/${article.id}`}
        className={cn(
          "group grid-editorial py-6 transition-colors duration-300",
          active && "bg-surface",
        )}
      >
        <div className="col-span-12 md:col-span-2">
          <span className="t-meta block text-accent">{desk.short}</span>
          <span className="t-micro mt-1 block">{desk.topic} DESK</span>
        </div>

        <div className="col-span-12 mt-3 md:col-span-7 md:mt-0">
          <h3 className="t-title-sm transition-colors duration-300 group-hover:text-accent">
            {cleanTitle(article.title, article.source)}
          </h3>
          {summary ? (
            <p className="t-body mt-2 line-clamp-2">{summary}</p>
          ) : null}
        </div>

        <div className="col-span-12 mt-3 flex items-center gap-4 md:col-span-3 md:mt-0 md:block md:text-right">
          <span className="t-meta block">{dayStamp(article.published_at)}</span>
          <span className="t-micro mt-1 block">{timeAgo(article.published_at)}</span>
        </div>
      </Link>
    </li>
  );
}
