import { promises as fs } from "fs";
import path from "path";
import { createClient } from "@supabase/supabase-js";

export type NewsItem = {
  id: string;
  title: string;
  summary: string;
  source: string;
  publishedAt: string;
  image: string;
  url: string;
  category: string;
};

const STORAGE_DIR =
  process.env.NEWS_STORAGE_DIR ||
  (process.platform === "win32" ? "C:\\tmp\\uhnews" : "/tmp/uhnews");
const STORAGE_FILE = path.join(STORAGE_DIR, "news.json");
const FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1547347298-4074fc3086f0?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1495020689067-958852a7765e?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=900&q=80",
];

const FALLBACK_ITEMS: NewsItem[] = [
  {
    id: "fallback-1",
    title: "Global leaders unveil a bold new vision for cleaner cities and smarter futures.",
    summary: "An emerging coalition of municipal leaders is defining a new standard for resilient urban policy.",
    source: "Google News",
    publishedAt: new Date().toISOString(),
    image: FALLBACK_IMAGES[0],
    url: "https://news.google.com/",
    category: "World Affairs",
  },
  {
    id: "fallback-2",
    title: "AI startups race to build practical tools for everyday life and work.",
    summary: "Builders are shifting focus from research ambitions to products that improve real daily workflows.",
    source: "Google News",
    publishedAt: new Date().toISOString(),
    image: FALLBACK_IMAGES[1],
    url: "https://news.google.com/",
    category: "Technology",
  },
  {
    id: "fallback-3",
    title: "Markets rebound as investors focus on resilient sectors and long-term growth.",
    summary: "The latest signal from global markets shows renewed confidence in supply chains and diversified growth.",
    source: "Google News",
    publishedAt: new Date().toISOString(),
    image: FALLBACK_IMAGES[2],
    url: "https://news.google.com/",
    category: "Business",
  },
  {
    id: "fallback-4",
    title: "A new generation of artists is redefining the future of design and storytelling.",
    summary: "Creative communities are using digital-first storytelling to widen access and experiment in public space.",
    source: "Google News",
    publishedAt: new Date().toISOString(),
    image: FALLBACK_IMAGES[3],
    url: "https://news.google.com/",
    category: "Culture",
  },
  {
    id: "fallback-5",
    title: "Remote escapes and slow travel are driving a new era of global exploration.",
    summary: "Tourism patterns are shifting toward richer local experiences and more intentional time away.",
    source: "Google News",
    publishedAt: new Date().toISOString(),
    image: FALLBACK_IMAGES[4],
    url: "https://news.google.com/",
    category: "Travel",
  },
  {
    id: "fallback-6",
    title: "Wellness programs are reshaping how employers support long-term productivity.",
    summary: "Workforces are demanding support systems that improve energy, resilience and daily quality of life.",
    source: "Google News",
    publishedAt: new Date().toISOString(),
    image: FALLBACK_IMAGES[5],
    url: "https://news.google.com/",
    category: "Health",
  },
  {
    id: "fallback-7",
    title: "Championship hopes rise as teams prepare for a high-stakes late season push.",
    summary: "Performance, planning and depth are defining the final stretch of the year’s most competitive leagues.",
    source: "Google News",
    publishedAt: new Date().toISOString(),
    image: FALLBACK_IMAGES[6],
    url: "https://news.google.com/",
    category: "Sports",
  },
  {
    id: "fallback-8",
    title: "Researchers uncover promising methods to improve climate resilience in cities.",
    summary: "Public infrastructure and risk planning are moving toward adaptive, low-carbon systems.",
    source: "Google News",
    publishedAt: new Date().toISOString(),
    image: FALLBACK_IMAGES[7],
    url: "https://news.google.com/",
    category: "Science",
  },
  {
    id: "fallback-9",
    title: "Regional councils move to reshape policy frameworks for a more connected future.",
    summary: "Draft policy reforms are focusing on transparency, local resilience and economic flexibility.",
    source: "Google News",
    publishedAt: new Date().toISOString(),
    image: FALLBACK_IMAGES[8],
    url: "https://news.google.com/",
    category: "Politics",
  },
  {
    id: "fallback-10",
    title: "Design-led living spaces are becoming the new benchmark for modern routines.",
    summary: "Home design is shifting to support focus, comfort and healthier everyday habits.",
    source: "Google News",
    publishedAt: new Date().toISOString(),
    image: FALLBACK_IMAGES[9],
    url: "https://news.google.com/",
    category: "Lifestyle",
  },
];

function categoryFromTitle(title: string): string {
  const lower = title.toLowerCase();
  if (/(ai|tech|software|startup|app|data|cyber|digital)/.test(lower)) return "Technology";
  if (/(market|finance|stocks|economy|business|trade|investment)/.test(lower)) return "Business";
  if (/(climate|energy|science|research|health|medical|lab)/.test(lower)) return "Science";
  if (/(travel|tour|flight|hotel|destination)/.test(lower)) return "Travel";
  if (/(sport|league|team|match|championship|cup)/.test(lower)) return "Sports";
  if (/(policy|government|election|minister|parliament|country)/.test(lower)) return "Politics";
  if (/(culture|art|music|film|fashion|design)/.test(lower)) return "Culture";
  if (/(world|global|international|diplomacy|government)/.test(lower)) return "World Affairs";
  return "World Affairs";
}

function stripHtml(value: string): string {
  return value
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeTitle(value: string): string {
  return stripHtml(value).replace(/^\s*[-–—]\s*/, "").trim();
}

function toId(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

const RSS_SOURCES = [
  { name: "Google News", url: "https://news.google.com/rss?hl=en-US&gl=US&ceid=US:en" },
  { name: "BBC News", url: "https://feeds.bbci.co.uk/news/world/rss.xml" },
  { name: "The Hindu", url: "https://www.thehindu.com/feeder/default.rss" },
  { name: "NPR", url: "https://feeds.npr.org/1001/rss.xml" },
];

function parseRssXml(xml: string, sourceName: string): NewsItem[] {
  const itemPattern =
    /<item>[\s\S]*?<title>(?:<!\[CDATA\[)?(.*?)?(?:\]\]>)?<\/title>[\s\S]*?<link>(.*?)<\/link>[\s\S]*?(?:<pubDate>(.*?)<\/pubDate>|<published>(.*?)<\/published>|<dc:date>(.*?)<\/dc:date>)[\s\S]*?(?:<description>(?:<!\[CDATA\[)?(.*?)?(?:\]\]>)?<\/description>|<content:encoded>(?:<!\[CDATA\[)?(.*?)?(?:\]\]>)?<\/content:encoded>)/gi;
  const entries: NewsItem[] = [];

  for (const match of xml.matchAll(itemPattern)) {
    const title = normalizeTitle(match[1] ?? "");
    const url = stripHtml(match[2] ?? "").trim();
    const publishedAt = stripHtml(match[3] ?? match[4] ?? match[5] ?? "").trim();
    const description = stripHtml(match[6] ?? match[7] ?? "").trim();

    if (!title || !url) continue;

    const cleanTitle = title.replace(new RegExp(`\\s*\\|\\s*${sourceName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}.*$`, "i"), "").trim();
    const isoDate = new Date(publishedAt || Date.now()).toISOString();
    const category = categoryFromTitle(cleanTitle);

    entries.push({
      id: toId(`${cleanTitle}-${url}`),
      title: cleanTitle,
      summary: description || `${cleanTitle} — a timely update from the current news cycle.`,
      source: sourceName,
      publishedAt: isoDate,
      image: FALLBACK_IMAGES[entries.length % FALLBACK_IMAGES.length],
      url,
      category,
    });
  }

  return entries.slice(0, 12);
}

function parseGoogleNewsXml(xml: string): NewsItem[] {
  return parseRssXml(xml, "Google News");
}

function getSupabaseClient() {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE ||
    process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !serviceKey) {
    return null;
  }

  return createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

function mapSupabaseRow(row: {
  id: number | string;
  title: string;
  url: string;
  source: string;
  published_at?: string | null;
  scraped_at?: string | null;
  content?: string | null;
}): NewsItem {
  const publishedAt = row.published_at || row.scraped_at || new Date().toISOString();
  const summary = row.content && row.content.trim() ? row.content : `${row.title} — a timely update from the current news cycle.`;

  return {
    id: String(row.id),
    title: row.title,
    summary,
    source: row.source,
    publishedAt,
    image: FALLBACK_IMAGES[Number(String(row.id).slice(-1)) % FALLBACK_IMAGES.length],
    url: row.url,
    category: categoryFromTitle(row.title),
  };
}

async function ensureDirectory(): Promise<void> {
  await fs.mkdir(path.dirname(STORAGE_FILE), { recursive: true });
}

async function readStoredNews(): Promise<NewsItem[]> {
  const supabase = getSupabaseClient();

  if (supabase) {
    const { data, error } = await supabase
      .from("news")
      .select("id, title, content, url, source, published_at, scraped_at")
      .order("scraped_at", { ascending: false })
      .limit(30);

    if (!error && data && data.length) {
      return data.map(mapSupabaseRow);
    }
  }

  try {
    await ensureDirectory();
    const raw = await fs.readFile(STORAGE_FILE, "utf-8");
    const parsed = JSON.parse(raw) as NewsItem[];
    return Array.isArray(parsed) && parsed.length ? parsed : FALLBACK_ITEMS;
  } catch {
    return FALLBACK_ITEMS;
  }
}

async function writeStoredNews(items: NewsItem[]): Promise<void> {
  await ensureDirectory();
  await fs.writeFile(STORAGE_FILE, JSON.stringify(items, null, 2), "utf-8");
}

export async function getLatestNews(): Promise<NewsItem[]> {
  return readStoredNews();
}

export async function refreshNewsFromGoogle(): Promise<NewsItem[]> {
  const byUrl = new Map<string, NewsItem>();
  const details: Record<string, number> = {};

  for (const source of RSS_SOURCES) {
    try {
      const response = await fetch(source.url, {
        headers: {
          "User-Agent": "Mozilla/5.0",
          Accept: "application/rss+xml, application/xml, text/xml, */*",
        },
        next: { revalidate: 600 },
      });

      if (!response.ok) {
        details[source.name] = 0;
        continue;
      }

      const xml = await response.text();
      const items = parseRssXml(xml, source.name);
      details[source.name] = items.length;

      for (const item of items) {
        if (!byUrl.has(item.url)) {
          byUrl.set(item.url, item);
        }
      }
    } catch {
      details[source.name] = 0;
    }
  }

  const result = byUrl.size
    ? Array.from(byUrl.values()).sort(
        (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
      )
    : FALLBACK_ITEMS;

  const supabase = getSupabaseClient();

  if (supabase) {
    const rows = result.map((item) => ({
      title: item.title,
      content: item.summary,
      url: item.url,
      source: item.source,
      published_at: item.publishedAt,
      scraped_at: new Date().toISOString(),
    }));

    const { error } = await supabase.from("news").upsert(rows, {
      onConflict: "url",
      ignoreDuplicates: false,
    });

    if (!error) {
      const { data, error: readError } = await supabase
        .from("news")
        .select("id, title, content, url, source, published_at, scraped_at")
        .order("scraped_at", { ascending: false })
        .limit(30);

      if (!readError && data && data.length) {
        return data.map(mapSupabaseRow);
      }
    }
  }

  await writeStoredNews(result);
  return result;
}
