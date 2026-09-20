"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Moon, Search, Sun } from "lucide-react";
import { issueDate, issueNumber } from "@/lib/editorial";
import { useOverlays } from "./OverlayProvider";

/**
 * The masthead replaces conventional navigation entirely. It carries only the
 * wordmark, the issue line, and two quiet utility controls plus the edition
 * switch. Wayfinding happens through stories, topics, search and ask.
 */
export default function Masthead({
  section,
  back = false,
}: {
  /** Desk or section label, e.g. "Analysis" — printed beside the issue line. */
  section?: string;
  /** Show the return-to-index control (used on filing pages). */
  back?: boolean;
}) {
  const { openSearch, openAsk } = useOverlays();
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const current = document.documentElement.getAttribute("data-theme");
    setTheme(current === "dark" ? "dark" : "light");
  }, []);

  function toggleTheme() {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    try {
      window.localStorage.setItem("newsai-theme", next);
    } catch {
      /* storage unavailable — the edition simply resets next visit */
    }
  }

  const issue = issueNumber();
  const date = issueDate();

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper">
      <div className="shell">
        <div className="flex items-center justify-between gap-4 py-4 md:py-5">
          <div className="flex items-baseline gap-6">
            <Link
              href="/"
              aria-label="NEWSAI — front page"
              className="t-wordmark transition-colors duration-300 hover:text-accent"
            >
              NEWSAI
            </Link>
            {back ? (
              <Link
                href="/"
                className="t-meta link-editorial hidden hover:text-ink sm:inline-block"
              >
                ← Index
              </Link>
            ) : null}
          </div>

          <div className="hidden items-baseline gap-6 md:flex">
            <span className="t-meta">Issue {issue}</span>
            <span className="t-meta text-stone">{date}</span>
            {section ? <span className="t-meta text-accent">{section}</span> : null}
          </div>

          <div className="flex items-center gap-5">
            <button
              type="button"
              onClick={() => openSearch()}
              className="btn-quiet"
              aria-label="Search NEWSAI"
            >
              <Search className="h-3.5 w-3.5" aria-hidden="true" />
              Search
              <kbd className="kbd hidden lg:inline-block" aria-hidden="true">
                ⌘K
              </kbd>
            </button>

            <button
              type="button"
              onClick={() => openAsk()}
              className="btn-quiet hidden lg:inline-flex"
            >
              Ask NEWSAI
            </button>

            <button
              type="button"
              onClick={toggleTheme}
              className="text-stone transition-colors duration-300 hover:text-ink"
              aria-label={
                theme === "dark"
                  ? "Switch to light edition"
                  : "Switch to dark edition"
              }
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4" aria-hidden="true" />
              ) : (
                <Moon className="h-4 w-4" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 pb-3 md:hidden">
          <span className="t-micro">
            Issue {issue} · {date}
          </span>
          {section ? <span className="t-micro text-accent">{section}</span> : null}
        </div>
      </div>
    </header>
  );
}
