-- 001_init.sql
-- News aggregator: initial schema
-- Run in the Supabase SQL editor or via `supabase db push`.

-- ---------------------------------------------------------------------------
-- Table
-- ---------------------------------------------------------------------------
create table if not exists public.news (
  id           bigint generated always as identity primary key,
  title        text not null,
  content      text default '',
  url          text not null unique,
  source       text not null,
  published_at timestamptz default now(),
  scraped_at   timestamptz default now()
);

-- ---------------------------------------------------------------------------
-- Indexes
-- ---------------------------------------------------------------------------
create index if not exists idx_news_source    on public.news (source);
create index if not exists idx_news_published on public.news (published_at desc);

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
alter table public.news enable row level security;

-- Public read access (anon + authenticated). Writes happen only through the
-- service role key (used by /api/scrape), which bypasses RLS.
drop policy if exists "Allow public read access" on public.news;
create policy "Allow public read access"
  on public.news
  for select
  to anon, authenticated
  using (true);
