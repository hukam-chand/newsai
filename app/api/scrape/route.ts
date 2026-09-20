import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET ?? "dev-secret";
  const provided = request.headers.get("x-cron-secret");

  if (process.env.NODE_ENV === "production" && provided !== secret) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 },
    );
  }

  return NextResponse.json({
    scraped: 0,
    sites: 0,
    time: new Date().toISOString(),
    details: {},
  });
}
