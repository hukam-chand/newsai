import { NextResponse } from "next/server";
import { refreshNewsFromGoogle } from "@/lib/news-store";

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET ?? "dev-secret";
  const provided = request.headers.get("x-cron-secret");

  if (process.env.NODE_ENV === "production" && provided !== secret) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 },
    );
  }

  try {
    const items = await refreshNewsFromGoogle();

    return NextResponse.json({
      scraped: items.length,
      sites: 1,
      time: new Date().toISOString(),
      details: { "Google News": items.length },
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unknown scrape error",
        scraped: 0,
        sites: 0,
        time: new Date().toISOString(),
        details: {},
      },
      { status: 500 },
    );
  }
}
