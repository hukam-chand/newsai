"use client";

import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import {
  TRENDING_TOPICS,
  issueDate,
  issueNumber,
  searchArticles,
} from "@/lib/editorial";
import { useOverlays } from "./OverlayProvider";
import StoryRow from "./StoryRow";

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Search as a full-screen editorial surface: giant type, one field, and
 * results set as hairline-separated rows rather than boxed cards.
 */
export default function SearchOverlay({
  initialQuery,
  onClose,
}: {
  initialQuery: string;
  onClose: () => void;
}) {
  const { articles } = useOverlays();
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);
  const [cursor, setCursor] = useState(0);
  const panelRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const active = query.trim().length >= 2;
  const results = useMemo(
    () => (active ? searchArticles(articles, query, 40) : []),
    [articles, query, active],
  );

  useEffect(() => {
    const input = inputRef.current;
    if (!input) return;
    input.focus();
    input.select();
  }, []);

  useEffect(() => {
    setCursor(0);
  }, [query]);

  useEffect(() => {
    const id = results[cursor]?.id;
    if (id === undefined) return;
    document.getElementById(`filing-${id}`)?.scrollIntoView({ block: "nearest" });
  }, [cursor, results]);

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Escape") {
      event.preventDefault();
      onClose();
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setCursor((current) =>
        Math.min(current + 1, Math.max(results.length - 1, 0)),
      );
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setCursor((current) => Math.max(current - 1, 0));
      return;
    }

    if (event.key === "Enter") {
      const target = results[cursor];
      if (target) {
        event.preventDefault();
        onClose();
        router.push(`/article/${target.id}`);
      }
      return;
    }

    if (event.key === "Tab") {
      const nodes = panelRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE);
      if (!nodes || nodes.length === 0) return;
      const list = Array.from(nodes).filter((node) => node.offsetParent !== null);
      const first = list[0];
      const last = list[list.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  }

  return (
    <div
      ref={panelRef}
      role="dialog"
      aria-modal="true"
      aria-label="Search NEWSAI"
      className="overlay page-fade"
      onKeyDown={onKeyDown}
    >
      <div className="shell pb-24 pt-8 md:pt-12">
        <div className="flex items-start justify-between gap-6">
          <h1 className="t-hero">
            Search
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

        <form
          role="search"
          className="mt-12 md:mt-16"
          onSubmit={(event) => {
            event.preventDefault();
            const target = results[cursor] ?? results[0];
            if (target) {
              onClose();
              router.push(`/article/${target.id}`);
            }
          }}
        >
          <label htmlFor="newsai-search" className="t-meta">
            What are you looking for?
          </label>
          <input
            id="newsai-search"
            ref={inputRef}
            type="search"
            autoComplete="off"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="field-editorial mt-4"
            placeholder="Headlines, desks, topics, dates…"
            aria-describedby="newsai-search-help"
          />
          <p id="newsai-search-help" className="t-micro mt-3">
            ↑ ↓ to move · ↵ to open · Esc to close
          </p>
        </form>

        <div className="mt-10 flex flex-wrap items-baseline justify-between gap-4 border-b border-line pb-4">
          <span className="t-meta">
            {active
              ? `${results.length} matching ${
                  results.length === 1 ? "report" : "reports"
                }`
              : `${articles.length} filings in this issue`}
          </span>
          <span className="t-meta">
            Issue {issueNumber()} · {issueDate()}
          </span>
        </div>

        {!active ? (
          <div className="mt-12">
            <p className="t-meta">Start with a topic</p>
            <div className="mt-6 flex flex-wrap gap-3">
              {TRENDING_TOPICS.map((topic) => (
                <button
                  key={topic.label}
                  type="button"
                  className="pill"
                  onClick={() => setQuery(topic.label)}
                >
                  {topic.label}
                </button>
              ))}
            </div>
            {articles.length > 0 ? (
              <ul className="mt-12">
                {articles.slice(0, 6).map((article) => (
                  <StoryRow key={article.id} article={article} />
                ))}
              </ul>
            ) : null}
          </div>
        ) : results.length === 0 ? (
          <p className="t-sub measure mt-14">
            Nothing is filed under “{query}” in this issue. Try a shorter term, a
            desk name, or one of the topics above.
          </p>
        ) : (
          <ul className="mt-2">
            {results.map((article, index) => (
              <StoryRow
                key={article.id}
                article={article}
                active={index === cursor}
              />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

