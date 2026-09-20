// Internal editorial categorisation for the NEWSAI feed.
//
// NOTE: the raw DB `source` values are kept internal. The UI never exposes
// them — it only shows neutral NEWSAI desk labels, so the product reads as a
// single, self-contained publication. There is deliberately no per-desk colour:
// the visual system is paper, ink and one editorial red.

export interface DeskStyle {
  /** Full desk name shown in metadata, e.g. "National Desk". */
  label: string;
  /** Short desk name used in story furniture. */
  short: string;
  /** Editorial topic the desk files under. */
  topic: string;
  /** Desk number, printed with the desk label. */
  code: string;
}

/**
 * Ordered list of internal keys. These match the values stored in the
 * database (set by the scraper) and are never rendered directly.
 */
export const SOURCE_KEYS = [
  "NDTV",
  "TOI",
  "HT",
  "BBC Hindi",
  "The Wire",
] as const;

export type SourceKey = (typeof SOURCE_KEYS)[number];

const DESKS: Record<string, DeskStyle> = {
  NDTV: { label: "National Desk", short: "National", topic: "INDIA", code: "01" },
  TOI: { label: "World Desk", short: "World", topic: "WORLD", code: "02" },
  HT: { label: "Business Desk", short: "Business", topic: "BUSINESS", code: "03" },
  "BBC Hindi": {
    label: "Regional Desk",
    short: "Regional",
    topic: "REGIONAL",
    code: "04",
  },
  "The Wire": {
    label: "Analysis Desk",
    short: "Analysis",
    topic: "ANALYSIS",
    code: "05",
  },
};

const DEFAULT_DESK: DeskStyle = {
  label: "General Desk",
  short: "General",
  topic: "GENERAL",
  code: "00",
};

/** Resolve the neutral, public-facing desk for an internal source key. */
export function sourceStyle(key: string): DeskStyle {
  return DESKS[key] ?? DEFAULT_DESK;
}

/** Filter rail shown above the story grid: "All Desks" plus every desk. */
export function deskFilters(): Array<{ key: string; label: string }> {
  return [
    { key: "All", label: "All Desks" },
    ...SOURCE_KEYS.map((key) => ({
      key,
      label: sourceStyle(key).short,
    })),
  ];
}

export type FilterValue = string | "All";
