"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { NewsArticle } from "@/lib/types";
import { sourceStyle } from "@/lib/sources";
import { cleanTitle, standfirst } from "@/lib/editorial";
import { cn, pad2, timeAgo } from "@/lib/utils";
import StoryPlate from "./StoryPlate";
import type { PlateRatio } from "./StoryPlate";
import Reveal from "./Reveal";

export type StorySize = "lead" | "wide" | "standard" | "compact";

const TITLE_CLASS: Record<StorySize, string> = {
  lead: "t-title-lg",
  wide: "t-title",
  standard: "t-title",
  compact: "t-title-sm",
};

/**
 * One story, set as an editorial block — index, desk, headline, summary and
 * time. Never a rounded card, never a shadow: scale and hairlines do the work.
 */
export default function StoryBlock({
  article,
  index,
  size = "standard",
  ratio = "feature",
  showPlate = true,
  showSummary = true,
  showCta = false,
  delay = 0,
  className,
}: {
  article: NewsArticle;
  /** Position in the issue, used for the printed story number. */
  index: number;
  size?: StorySize;
  ratio?: PlateRatio;
  showPlate?: boolean;
  showSummary?: boolean;
  showCta?: boolean;
  /** Reveal stagger in milliseconds. */
  delay?: number;
  className?: string;
}) {
  const desk = sourceStyle(article.source);
  const title = cleanTitle(article.title, article.source);
  const summary = showSummary
    ? standfirst(article.content, 170, article.source)
    : "";

  return (
    <Reveal delay={delay} className={className}>
      <Link href={`/article/${article.id}`} className="group lift block">
        {showPlate ? (
          <StoryPlate
            seed={article.id}
            label={title}
            ratio={ratio}
            className="mb-6"
          />
        ) : null}

        <div className="flex items-baseline gap-4">
          <span className="t-meta tabular-nums text-accent">{pad2(index)}</span>
          <span className="t-meta">{desk.short}</span>
          <span className="t-micro ml-auto">{timeAgo(article.published_at)}</span>
        </div>

        <h3
          className={cn(
            TITLE_CLASS[size],
            "mt-4 transition-colors duration-300 group-hover:text-accent",
          )}
        >
          {title}
        </h3>

        {summary ? <p className="t-body mt-3 line-clamp-2">{summary}</p> : null}

        {showCta ? (
          <span className="t-meta mt-5 inline-flex items-center gap-2 text-ink">
            Read story
            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
          </span>
        ) : null}
      </Link>
    </Reveal>
  );
}
