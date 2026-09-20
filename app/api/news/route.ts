import { NextResponse } from "next/server";
import { getLatestNews } from "@/lib/news-store";

export async function GET() {
  const items = await getLatestNews();
  return NextResponse.json(items);
}
