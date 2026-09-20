# NEWSAI — A Magazine That Thinks

A premium editorial intelligence issue. It reads the latest verified filings
from the desk store, sets them the way a magazine would — one featured story,
an asymmetric day-in-stories grid, a timeline of how the issue moved, an
intelligence section and a question surface — and refreshes every 10 minutes.

- **Framework:** Next.js 15 (App Router) + TypeScript
- **Data:** Anonymous store reads via the existing client (300-row window)
- **Styling:** Tailwind CSS v4, warm-paper editorial tokens, DM Serif Display +
  Inter + Space Grotesk
- **Imagery:** self-contained generative editorial plates (inline SVG, no
  external images)
- **Scheduling:** Cloudflare Worker cron (every 10 minutes)

---

## Branding policy (important)

NEWSAI presents itself as a single, independent publication. The visible UI
contains **no third-party names, logos, badges, provider names, external URLs
or clickable external links**:

- Upstream homepages are scraped and stored **internally only**. The raw
  `source` value never reaches the UI.
- Instead of a third-party name, each item shows a neutral internal desk:
  **National / World / Business / Regional / Analysis Desk**.
- Attribution is shown only as **"Source verified"**.
- Article cards and titles link to **internal reader pages** (`/article/[id]`)
  — never off-site.
- Backend/data services are not named anywhere in the interface (they appear
  only in server-side environment configuration).

The upstream list below is kept here for **maintainers only** and is not
exposed by the application.

| Internal key | Homepage (internal) |
| --- | --- |
| NDTV | https://www.ndtv.com |
| TOI | https://timesofindia.indiatimes.com |
| HT | https://www.hindustantimes.com |
| BBC Hindi | https://www.bbc.com/hindi |
| The Wire | https://thewire.in |

Each run extracts up to **10 articles per site** (title + URL) using simple
`fetch` + regex parsing — no headless browser — and skips any URL already
present in the database.

---

## Project structure

```
.
├── app/
│   ├── api/scrape/route.ts   # GET scraper endpoint (secret-protected)
│   ├── article/[id]/page.tsx # Internal reader (no external links)
│   ├── globals.css           # Editorial tokens + type + grid + motion
│   ├── layout.tsx            # Root layout + metadata + theme script
│   └── page.tsx              # Front-page issue (client component)
├── components/
│   ├── StoryPlate.tsx        # Generative editorial plate (inline SVG)
│   ├── Skeleton.tsx          # Paper loading plates
├── lib/
│   ├── sources.ts            # Internal desk labels + filter config
│   ├── supabase.ts           # Browser Supabase client
│   ├── types.ts              # Shared TypeScript types
│   └── utils.ts              # cn(), relative timestamps
├── supabase/migrations/
│   └── 001_init.sql          # Table + indexes + RLS
├── cloudflare-worker/
│   ├── src/index.js          # Cron trigger
│   ├── wrangler.toml         # Cron schedule + vars
│   └── package.json
├── vercel.json               # maxDuration for /api/scrape (no crons)
└── .env.local.example
```

---

## 1. Create the Supabase project and schema

1. Create a project at [supabase.com](https://supabase.com).
2. Open the **SQL Editor**, paste the contents of
   [`supabase/migrations/001_init.sql`](supabase/migrations/001_init.sql) and run
   it. This creates:

   - the `news` table (`id, title, content, url, source, published_at, scraped_at`),
   - indexes `idx_news_source` and `idx_news_published`,
   - row-level security with a public **read-only** policy.

3. From **Project Settings -> API**, note:
   - **Project URL** -> `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public key** -> `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role key** -> `SUPABASE_SERVICE_KEY` (server-side only!)

---

## 2. Configure environment variables

Copy the example file and fill it in:

```bash
cp .env.local.example .env.local
```

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_KEY=
CRON_SECRET=any-random-string
```

- `SUPABASE_SERVICE_KEY` is used **only** by `/api/scrape` to insert rows and
  bypass RLS. Never expose it to the browser.
- `CRON_SECRET` is the shared secret checked against the `x-cron-secret`
  header. Pick any random string.

---

## 3. Run the app locally

```bash
npm install
npm run dev
```

Open <http://localhost:3000>. On first load you will see the empty state,
*"No news yet. First scrape will appear in 10 minutes."*

### Trigger a scrape manually

```bash
curl -H "x-cron-secret: any-random-string" http://localhost:3000/api/scrape
```

Response:

```json
{
  "scraped": 42,
  "sites": 5,
  "time": "2026-09-20T13:15:00.000Z",
  "details": { "NDTV": 10, "TOI": 10, "HT": 10, "BBC Hindi": 8, "The Wire": 4 }
}
```

Refresh the page to see the articles.

---

## 4. Deploy the web app (Vercel)

```bash
vercel
```

Add the same four environment variables in the Vercel dashboard
(**Project -> Settings -> Environment Variables**), then redeploy.

`vercel.json` sets `maxDuration: 300` for the scrape route and intentionally
declares **no crons** — scheduling is handled by the Cloudflare Worker so you
stay on the free tier.

---

## 5. Deploy the Cloudflare Worker (cron)

```bash
cd cloudflare-worker
npm install

# Point the worker at your deployed app
#   edit wrangler.toml -> [vars] SCRAPE_URL = "https://your-app.vercel.app/api/scrape"

# Store the shared secret (same value as CRON_SECRET in Vercel)
npx wrangler secret put CRON_SECRET

# Deploy
npm run deploy
```

The worker runs on the schedule defined in `wrangler.toml`:

```toml
[triggers]
crons = ["*/10 * * * *"]   # every 10 minutes
```

### Test the worker locally

```bash
cd cloudflare-worker
cp .dev.vars.example .dev.vars   # fill in CRON_SECRET + SCRAPE_URL
npm run dev
# then, in another terminal:
curl "http://localhost:8787/?secret=any-random-string"
```

---

## How the scraper works

`app/api/scrape/route.ts`:

1. Verifies the `x-cron-secret` header equals `CRON_SECRET` (401 otherwise).
2. Fetches all five homepages **in parallel** with a 25s timeout and a desktop
   `User-Agent`; a failure on one site does not abort the others.
3. Parses `<a href="...">title</a>` tags with regex and keeps only URLs matching
   each site's article pattern (e.g. TOI `.../articleshow/<id>.cms`).
4. Normalizes URLs (strips `#` and tracking params such as `utm_*`) and drops
   duplicate/short titles.
5. Keeps the first **10** unique articles per site.
6. Queries Supabase for existing URLs and keeps only the new ones
   (`upsert` with `ignoreDuplicates` protects against races on the unique
   `url` constraint).
7. Fetches a short summary for each new item (via page metadata) so reports
   can be read **inside NEWSAI** without leaving the app.
8. Returns `{ scraped, sites, time, details }`.

---

## Notes & limitations

- **Internal summaries.** The scraper stores a short `content` excerpt per
  item (from page metadata). If an excerpt can't be retrieved, the field stays
  `''` and the reader shows a graceful note.
- **All navigation is internal.** No external links, source names, logos or
  provider names appear in the interface; items open at `/article/[id]`.
- **Regex scraping is best-effort.** If a site changes its markup or URL scheme,
  tweak the `articlePattern` / `SITES` array in `app/api/scrape/route.ts`.
- Some homepages may block datacenter IPs (403). Sites that fail are reported as
  `0` in `details` and simply retried on the next run.
- The cron is 5-field (`minute hour day month weekday`); `*/10 * * * *` means
  every 10 minutes.

---

## Scripts

| Location | Command | Description |
| --- | --- | --- |
| root | `npm run dev` | Start the Next.js dev server |
| root | `npm run build` | Production build |
| root | `npm run start` | Serve the production build |
| cloudflare-worker | `npm run dev` | Run the worker locally |
| cloudflare-worker | `npm run deploy` | Deploy the worker + cron |