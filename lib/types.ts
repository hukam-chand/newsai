export interface NewsArticle {
  id: number;
  title: string;
  content: string;
  url: string;
  source: string;
  published_at: string;
  scraped_at: string;
}

export interface ScrapedArticle {
  title: string;
  url: string;
  source: string;
}
