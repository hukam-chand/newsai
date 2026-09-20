// Editorial derivations for NEWSAI.
//
// Everything here is pure, synchronous and framework-agnostic so it can run on
// the server and in the browser with identical output (no hydration drift, no
// I/O). The magazine's issue identity, reading system and the deterministic
// "intelligence" surfaces (key points, briefs, search ranking) are all derived
// from the stored reporting itself — nothing is invented.

import type { NewsArticle } from "./types";

/* ---------------------------------------------------------------------------
 * Issue identity
 * ------------------------------------------------------------------------- */

/** Editions are numbered daily; anchor chosen so 20 Sep 2026 reads ISSUE 042. */
const EDITIONS_EPOCH_UTC = Date.UTC(2026, 7, 10);
const MS_PER_DAY = 86_400_000;

/** Zero-padded edition number for the masthead, e.g. "042". */
export function issueNumber(date: Date = new Date()): string {
  const today = Date.UTC(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate(),
  );
  const edition = Math.floor((today - EDITIONS_EPOCH_UTC) / MS_PER_DAY) + 1;
  return String(Math.max(1, edition)).padStart(3, "0");
}

/** Uppercase issue date, e.g. "20 SEPTEMBER 2026". Timezone-stable. */
export function issueDate(date: Date = new Date()): string {
  return date
    .toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      timeZone: "UTC",
    })
    .toUpperCase();
}

/** Short stamp for editorial rows, e.g. "20 SEP". */
export function dayStamp(value: string | Date): string {
  const date = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return "—";
  return date
    .toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      timeZone: "UTC",
    })
    .toUpperCase();
}

/** 24-hour clock stamp used by the timeline ("09:10"). Timezone-stable. */
export function clockTime(value: string | Date): string {
  const date = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return "--:--";
  return date.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "UTC",
  });
}

/* ---------------------------------------------------------------------------
 * Branding safety
 *
 * Stored excerpts come from upstream pages, so they can carry an upstream
 * publication name or domain. The interface must never show one, therefore all
 * displayable text passes through `sanitizeText`.
 * ------------------------------------------------------------------------- */

const GENERIC_MARKERS = [
  "Hindustan Times",
  "Times of India",
  "TimesOfIndia",
  "IndiaTimes",
  "BBC Hindi",
  "BBC News",
  "NDTV",
  "The Wire",
];

const SOURCE_MARKERS: Record<string, string[]> = {
  NDTV: ["NDTV"],
  TOI: ["TOI", "Times of India", "TimesOfIndia", "IndiaTimes"],
  HT: ["HT", "Hindustan Times"],
  "BBC Hindi": ["BBC Hindi", "BBC News", "BBC"],
  "The Wire": ["The Wire", "thewire"],
};

const DOMAIN_RE =
  /\b(?:[a-z0-9][a-z0-9-]*\.)+(?:com|in|net|org|co|io|uk|news|media|tv)\b/gi;
const ARTIFACT_RE =
  /\b(?:read more|read the full (?:story|article)|continue reading|click here(?: to read more)?|full coverage|for more updates?)\b[^.!?]*\.?/gi;

function escapeRe(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Strip upstream names, domains and scrape artifacts from displayable text. */
export function sanitizeText(text: string, sourceKey?: string): string {
  if (!text) return "";
  let out = text;

  const markers = [
    ...(sourceKey ? (SOURCE_MARKERS[sourceKey] ?? []) : []),
    ...GENERIC_MARKERS,
  ];
  for (const marker of markers) {
    out = out.replace(new RegExp(`\\b${escapeRe(marker)}\\b`, "gi"), " ");
  }

  out = out.replace(DOMAIN_RE, " ");
  out = out.replace(ARTIFACT_RE, " ");
  out = out.replace(/\s*[|·•]\s*\./g, ".");
  out = out.replace(/\s*[|·•]\s*$/g, " ");
  out = out.replace(/\(\s*\)/g, " ").replace(/\[\s*\]/g, " ");
  out = out.replace(/\s{2,}/g, " ");
  out = out.replace(/\s+([,.;:!?])/g, "$1");
  out = out.replace(/^[\s\-–—|,:;.]+/, "");
  out = out.replace(/[\s\-–—|,;:]+$/, "");
  return out.trim();
}

/** Headline safe for display. */
export function cleanTitle(title: string, sourceKey?: string): string {
  const cleaned = sanitizeText(title, sourceKey);
  return cleaned || sanitizeText(title);
}

/* ---------------------------------------------------------------------------
 * Reading system
 * ------------------------------------------------------------------------- */

const MIN_SENTENCE_LENGTH = 12;

/** Split stored prose into displayable sentences. */
export function sentences(text: string, sourceKey?: string): string[] {
  const clean = sanitizeText(text, sourceKey).replace(/\s+/g, " ").trim();
  if (!clean) return [];
  const parts = clean.match(/[^.!?]+[.!?]+["')\]]*|[^.!?]+$/g) ?? [];
  return parts
    .map((part) => part.trim())
    .filter((part) => part.length >= MIN_SENTENCE_LENGTH);
}

function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  const space = cut.lastIndexOf(" ");
  return `${cut.slice(0, space > max * 0.6 ? space : max).trimEnd()}…`;
}

/** Opening line of a filing, used as the standfirst. */
export function standfirst(
  content: string,
  max = 190,
  sourceKey?: string,
): string {
  const list = sentences(content, sourceKey);
  const first = list[0] ?? sanitizeText(content, sourceKey);
  return first ? truncate(first, max) : "";
}

/** Remaining prose, grouped into paragraph-sized blocks. */
export function bodyParagraphs(
  content: string,
  perParagraph = 2,
  sourceKey?: string,
): string[] {
  const list = sentences(content, sourceKey);
  if (list.length === 0) {
    const whole = sanitizeText(content, sourceKey);
    return whole ? [whole] : [];
  }
  const rest = list.length > 1 ? list.slice(1) : list;
  const out: string[] = [];
  for (let i = 0; i < rest.length; i += perParagraph) {
    out.push(rest.slice(i, i + perParagraph).join(" "));
  }
  return out;
}

/** Estimated reading time in whole minutes. */
export function readingTime(
  content: string,
  title = "",
  sourceKey?: string,
): number {
  const words = `${sanitizeText(title, sourceKey)} ${sanitizeText(
    content,
    sourceKey,
  )}`
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

/** Three salient points, chosen deterministically (figures rank highest). */
export function keyPoints(
  content: string,
  limit = 3,
  sourceKey?: string,
): string[] {
  const list = sentences(content, sourceKey);
  if (list.length === 0) return [];
  const scored = list.map((sentence, index) => {
    let score = Math.min(sentence.length, 220) / 12;
    if (/\d/.test(sentence)) score += 8;
    if (index === 0) score += 4;
    return { sentence, score, index };
  });
  return scored
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .slice(0, limit)
    .sort((a, b) => a.index - b.index)
    .map((entry) => entry.sentence);
}

/** A sentence strong enough to run as an editorial pull quote, if any. */
export function pullQuote(content: string, sourceKey?: string): string {
  const list = sentences(content, sourceKey);
  if (list.length === 0) return "";
  const quoted = list.find(
    (sentence) => /["\u201c\u201d']/.test(sentence) && sentence.length >= 60,
  );
  if (quoted) return quoted;
  const longest = [...list].sort((a, b) => b.length - a.length)[0];
  return longest && longest.length >= 60 ? longest : "";
}

export interface KeyFact {
  value: string;
  label: string;
}

const FIGURE_RE =
  /((?:[₹$€£]\s?)?\d[\d,.]*\s?(?:%|percent|per cent|crore|lakh|million|billion|trillion|bn|mn|km|kg|degrees|years?|days?|hours?|minutes?|people|deaths?|injuries|seats?|votes?|points?|tonnes?|times)?)/i;

/** Editors' figures block: the numbers already present in the filing. */
export function keyFacts(
  content: string,
  limit = 3,
  sourceKey?: string,
): KeyFact[] {
  const out: KeyFact[] = [];
  for (const sentence of sentences(content, sourceKey)) {
    const match = sentence.match(FIGURE_RE);
    if (!match) continue;
    const value = match[1].trim();
    if (!/\d/.test(value)) continue;
    const label = sentence.replace(match[1], " ").replace(/\s{2,}/g, " ").trim();
    out.push({ value, label: truncate(label, 104) });
    if (out.length >= limit) break;
  }
  return out;
}

/* ---------------------------------------------------------------------------
 * Deterministic artwork seed
 * ------------------------------------------------------------------------- */

/** Stable 32-bit hash used to generate each story's editorial plate. */
export function plateSeed(key: string | number): number {
  const input = `newsai:${key}`;
  let hash = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return Math.abs(hash);
}

/** Seeded PRNG so a given plate renders identically everywhere, always. */
export function mulberry(seed: number): () => number {
  let a = seed >>> 0;
  return function next(): number {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* ---------------------------------------------------------------------------
 * Topics — the editorial "What's moving" rail
 * ------------------------------------------------------------------------- */

export interface Topic {
  label: string;
  keywords: string[];
}

export const TRENDING_TOPICS: Topic[] = [
  {
    label: "AI",
    keywords: [
      " ai ",
      "artificial intelligence",
      "machine learning",
      "chatbot",
      "algorithm",
      "neural",
      "automation",
      "मशीन",
    ],
  },
  {
    label: "WORLD",
    keywords: [
      "world",
      "global",
      "united nations",
      "foreign",
      "diplomat",
      "treaty",
      "summit",
      "ceasefire",
      "sanction",
      "border",
    ],
  },
  {
    label: "INDIA",
    keywords: [
      "india",
      "delhi",
      "parliament",
      "lok sabha",
      "rajya sabha",
      "supreme court",
      "भारत",
      "दिल्ली",
      "मंत्री",
    ],
  },
  {
    label: "SCIENCE",
    keywords: [
      "science",
      "research",
      "study",
      "space",
      "satellite",
      "climate",
      "probe",
      "quantum",
      "vaccine",
      "species",
    ],
  },
  {
    label: "TECH",
    keywords: [
      "tech",
      "technology",
      "software",
      "chip",
      "semiconductor",
      "startup",
      "smartphone",
      "internet",
      "cyber",
      "data",
    ],
  },
  {
    label: "BUSINESS",
    keywords: [
      "market",
      "economy",
      "gdp",
      "inflation",
      "rupee",
      "sensex",
      "revenue",
      "profit",
      "trade",
      "tariff",
      "bank",
    ],
  },
  {
    label: "CULTURE",
    keywords: [
      "culture",
      "film",
      "cinema",
      "art",
      "music",
      "festival",
      "book",
      "literature",
      "fashion",
      "theatre",
    ],
  },
];

/** Lowercased, brand-safe haystack for matching and search. */
export function articleHaystack(article: NewsArticle): string {
  return `${cleanTitle(article.title, article.source)} ${sanitizeText(
    article.content,
    article.source,
  )}`.toLowerCase();
}

export function topicMatch(article: NewsArticle, topic: Topic): boolean {
  const haystack = ` ${articleHaystack(article)} `;
  return topic.keywords.some((keyword) => haystack.includes(keyword));
}

/* ---------------------------------------------------------------------------
 * Search and briefs
 * ------------------------------------------------------------------------- */

/** Rank the issue's reporting against a query. Deterministic, no I/O. */
export function searchArticles(
  articles: NewsArticle[],
  query: string,
  limit = 40,
): NewsArticle[] {
  const q = query.trim().toLowerCase();
  if (q.length < 2) return [];

  const words = q.split(/\s+/).filter((word) => word.length > 1);

  return articles
    .map((article) => {
      const title = cleanTitle(article.title, article.source).toLowerCase();
      const body = sanitizeText(article.content, article.source).toLowerCase();
      let score = 0;
      if (title.includes(q)) score += 60;
      if (body.includes(q)) score += 18;
      for (const word of words) {
        if (title.includes(word)) score += 12;
        else if (body.includes(word)) score += 4;
      }
      return { article, score };
    })
    .filter((entry) => entry.score > 0)
    .sort(
      (a, b) =>
        b.score - a.score ||
        new Date(b.article.published_at).getTime() -
          new Date(a.article.published_at).getTime(),
    )
    .slice(0, limit)
    .map((entry) => entry.article);
}

export interface Brief {
  headline: string;
  standfirst: string;
  paragraphs: { label: string; body: string }[];
  meta: string;
}

/** The five editorial prompts that seed the Ask NEWSAI surface. */
export const ASK_PROMPTS = [
  "Explain this story",
  "Compare developments",
  "What changed?",
  "Why does it matter?",
  "What happened before?",
];

/**
 * Compose an editorial brief from real matching reports only. Every number and
 * claim below is counted from the stored filings — nothing is generated beyond
 * what the issue already contains.
 */
export function composeBrief(
  matches: NewsArticle[],
  query: string,
  poolSize: number,
): Brief {
  const subject = query.trim() || "this issue";
  const meta = `${matches.length} matching ${
    matches.length === 1 ? "report" : "reports"
  } · ${matches.length} of ${poolSize} filings scanned`;

  if (matches.length === 0) {
    return {
      headline: "No verified filing on this yet",
      standfirst: `NEWSAI holds ${poolSize} ${
        poolSize === 1 ? "report" : "reports"
      } in the current window, and none of them address “${subject}”.`,
      paragraphs: [
        {
          label: "What happened",
          body: `Nothing has been filed on “${subject}” in the current issue window. The desk re-reads the wire every ten minutes, so a filing can still land here.`,
        },
        {
          label: "Why it matters",
          body: "NEWSAI only reports what it can verify internally. An empty answer is shown as an empty answer rather than a guess.",
        },
        {
          label: "What's next",
          body: `Try a narrower subject, or search the desk directly. The next filing cycle will refresh all ${poolSize} reports in this window.`,
        },
      ],
      meta,
    };
  }

  const [lead, ...rest] = matches;
  const desks = Array.from(
    new Set(matches.map((article) => article.source)),
  ).length;
  const latest = matches.reduce((newest, article) =>
    new Date(article.published_at).getTime() >
    new Date(newest.published_at).getTime()
      ? article
      : newest,
  );

  return {
    headline: cleanTitle(lead.title, lead.source),
    standfirst: standfirst(lead.content, 220, lead.source) || "Filing recorded without a summary.",
    paragraphs: [
      {
        label: "What happened",
        body: `${standfirst(lead.content, 240, lead.source) || "This filing arrived without an excerpt."} Recorded at ${clockTime(
          lead.published_at,
        )} GMT.`,
      },
      {
        label: "Why it matters",
        body: `${
          matches.length
        } matching ${
          matches.length === 1 ? "report sits" : "reports sit"
        } in the current window, filed across ${desks} ${
          desks === 1 ? "desk" : "desks"
        }. ${
          rest.length > 0
            ? `Related movement continues in “${cleanTitle(
                rest[0].title,
                rest[0].source,
              )}”.`
            : "No related thread has formed yet."
        }`,
      },
      {
        label: "What's next",
        body: `The most recent movement on this subject was recorded at ${clockTime(
          latest.published_at,
        )} GMT. The desk refreshes every ten minutes, and new filings will extend this brief automatically.`,
      },
    ],
    meta,
  };
}




