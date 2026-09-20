"use client";

import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { X } from "lucide-react";
import { ASK_PROMPTS, composeBrief, issueDate, issueNumber, searchArticles } from "@/lib/editorial";
import { useOverlays } from "./OverlayProvider";
import StoryRow from "./StoryRow";
/**
 * ASK NEWSAI — the signature interaction. Every answer is assembled from the
 * filings already stored in this issue: counts, desks and timestamps are
 * counted, never invented.
 */
export default function AskOverlay({
  initialQuery,
  onClose,
}: {
  initialQuery: string;
  onClose: () => void;
}) {
  const { articles } = useOverlays();
  const [query, setQuery] = useState(initialQuery);
  const [asked, setAsked] = useState(initialQuery.trim().length > 1 ? initialQuery : "");
  const inputRef = useRef<HTMLInputElement>(null);

  const matches = useMemo(
    () => (asked ? searchArticles(articles, asked, 12) : []),
    [articles, asked],
  );

  const brief = useMemo(
    () => (asked ? composeBrief(matches, asked, articles.length) : null),
    [asked, matches, articles.length],
  );

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  function ask(subject: string) {
    setQuery(subject);
    setAsked(subject);
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Escape") {
      event.preventDefault();
      onClose();
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Ask NEWSAI"
      className="overlay page-fade"
      onKeyDown={onKeyDown}
    >
      <div className="shell pb-24 pt-8 md:pt-12">
        <div className="flex items-start justify-between gap-6">
          <h1 className="t-hero">
            Ask
            <span className="block text-accent">NEWSAI</span>
          </h1>
          <button
            type="button"
            onClick={onClose}
            className="btn-secondary mt-2 shrink-0"
          >
            <X className="h-3.5 w-3.5" aria-hidden="true" />
            Close
          </button>
        </div>

        <p className="t-section mt-10 md:mt-14">What do you want to understand?</p>

        <form
          className="mt-10 max-w-4xl"
          onSubmit={(event) => {
            event.preventDefault();
            if (query.trim().length > 1) ask(query);
          }}
        >
          <label htmlFor="newsai-ask" className="sr-only">
            Ask NEWSAI a question about this issue
          </label>
          <input
            id="newsai-ask"
            ref={inputRef}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="field-editorial"
            placeholder="Type a question…"
            autoComplete="off"
          />
          <div className="mt-6 flex flex-wrap items-center gap-5">
            <button type="submit" className="btn-primary">
              Ask NEWSAI →
            </button>
            <span className="t-note">
              Answers are drawn only from filings already verified in this issue.
            </span>
          </div>
        </form>

        <div className="mt-10 flex flex-wrap gap-3">
          {ASK_PROMPTS.map((prompt) => (
            <button
              key={prompt}
              type="button"
              className="pill"
              onClick={() => ask(prompt)}
            >
              {prompt}
            </button>
          ))}
        </div>

        {brief ? (
          <section
            aria-live="polite"
            className="mt-16 border-t border-line pt-12"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-4">
              <p className="t-meta text-accent">Intelligence brief</p>
              <p className="t-meta">
                Issue {issueNumber()} · {issueDate()}
              </p>
            </div>

            <h2 className="t-title-lg measure mt-6">{brief.headline}</h2>
            <p className="t-sub measure mt-5">{brief.standfirst}</p>
            <p className="t-micro mt-6">{brief.meta}</p>

            <div className="grid-editorial mt-12">
              {brief.paragraphs.map((paragraph, index) => (
                <div
                  key={paragraph.label}
                  className="col-span-12 border-t border-line pt-6 md:col-span-4"
                >
                  <span className="t-meta text-accent">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="t-title-sm mt-3 uppercase">
                    {paragraph.label}
                  </h3>
                  <p className="t-body mt-3">{paragraph.body}</p>
                </div>
              ))}
            </div>

            {matches.length > 0 ? (
              <>
                <p className="t-meta mt-16">Filings behind this brief</p>
                <ul className="mt-6">
                  {matches.map((article) => (
                    <StoryRow key={article.id} article={article} />
                  ))}
                </ul>
              </>
            ) : null}
          </section>
        ) : (
          <p className="t-note mt-14 max-w-2xl">
            NEWSAI {articles.length === 1 ? "holds" : "holds"}{" "}
            {articles.length} {articles.length === 1 ? "filing" : "filings"} in
            this issue right now. Ask about any of them, or pick one of the
            prompts above.
          </p>
        )}
      </div>
    </div>
  );
}

