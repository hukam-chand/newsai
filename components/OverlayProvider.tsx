"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { NewsArticle } from "@/lib/types";
import SearchOverlay from "./SearchOverlay";
import AskOverlay from "./AskOverlay";
import AskFab from "./AskFab";

type OverlayMode = "search" | "ask" | null;

interface OverlayApi {
  /** Every filing currently loaded, shared by search and ask. */
  articles: NewsArticle[];
  openSearch: (initialQuery?: string) => void;
  openAsk: (initialQuery?: string) => void;
  close: () => void;
}

const OverlayContext = createContext<OverlayApi>({
  articles: [],
  openSearch: () => {},
  openAsk: () => {},
  close: () => {},
});

/** Any client component can open the search / ask surfaces from anywhere. */
export function useOverlays(): OverlayApi {
  return useContext(OverlayContext);
}

/**
 * Navigation in NEWSAI is editorial rather than menu-driven: these two
 * full-screen surfaces (plus the topics rail and story links) are the whole
 * wayfinding system. The provider also owns the global shortcuts.
 */
export default function OverlayProvider({
  articles,
  children,
}: {
  articles: NewsArticle[];
  children: ReactNode;
}) {
  const [mode, setMode] = useState<OverlayMode>(null);
  const [query, setQuery] = useState("");

  const openSearch = useCallback((initialQuery = "") => {
    setQuery(initialQuery);
    setMode("search");
  }, []);

  const openAsk = useCallback((initialQuery = "") => {
    setQuery(initialQuery);
    setMode("ask");
  }, []);

  const close = useCallback(() => setMode(null), []);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null;
      const typing = Boolean(
        target &&
          (target.tagName === "INPUT" ||
            target.tagName === "TEXTAREA" ||
            target.isContentEditable),
      );

      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setQuery("");
        setMode("search");
        return;
      }

      if (event.key === "/" && !typing && mode === null) {
        event.preventDefault();
        setQuery("");
        setMode("search");
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [mode]);

  useEffect(() => {
    if (mode === null) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [mode]);

  const api = useMemo<OverlayApi>(
    () => ({ articles, openSearch, openAsk, close }),
    [articles, openSearch, openAsk, close],
  );

  return (
    <OverlayContext.Provider value={api}>
      {children}
      {mode === "search" ? (
        <SearchOverlay initialQuery={query} onClose={close} />
      ) : null}
      {mode === "ask" ? (
        <AskOverlay initialQuery={query} onClose={close} />
      ) : null}
      <AskFab onOpen={() => openAsk()} hidden={mode !== null} />
    </OverlayContext.Provider>
  );
}
