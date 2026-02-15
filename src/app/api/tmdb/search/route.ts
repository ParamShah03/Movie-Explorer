// src/app/api/tmdb/search/route.ts
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const TMDB_BASE = "https://api.themoviedb.org/3";

function getKey() {
  const k = process.env.TMDB_API_KEY;
  if (!k) throw new Error("Missing TMDB_API_KEY on server.");
  return k;
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = (searchParams.get("query") ?? "").trim();

    if (!query || query.length < 2) {
      return NextResponse.json({ results: [] }, { status: 200 });
    }

    const key = getKey();

    const url = new URL(`${TMDB_BASE}/search/movie`);
    url.searchParams.set("api_key", key);
    url.searchParams.set("query", query);
    url.searchParams.set("include_adult", "false");
    url.searchParams.set("language", "en-US");
    url.searchParams.set("page", "1");

    const tmdbRes = await fetch(url.toString(), {
      method: "GET",
      headers: { "Accept": "application/json" },
      cache: "no-store"
    });

    const data = await tmdbRes.json();

    if (!tmdbRes.ok) {
      const msg = typeof data?.status_message === "string" ? data.status_message : "TMDB search failed.";
      return NextResponse.json({ error: msg }, { status: 502 });
    }

    const results = Array.isArray(data?.results) ? data.results : [];

    return NextResponse.json({ results }, { status: 200 });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Server error.";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
