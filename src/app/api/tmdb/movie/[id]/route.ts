// src/app/api/tmdb/movie/[id]/route.ts
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const TMDB_BASE = "https://api.themoviedb.org/3";

function getKey() {
  const k = process.env.TMDB_API_KEY;
  if (!k) throw new Error("Missing TMDB_API_KEY on server.");
  return k;
}

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    // unwrap params (Next expects this now)
    const { id: raw } = await params;

    const id = Number(raw);

    if (!Number.isFinite(id) || id <= 0) {
      return NextResponse.json({ error: "Invalid movie id." }, { status: 400 });
    }

    const key = getKey();

    const url = new URL(`${TMDB_BASE}/movie/${id}`);
    url.searchParams.set("api_key", key);
    url.searchParams.set("language", "en-US");

    const tmdbRes = await fetch(url.toString(), {
      method: "GET",
      headers: { Accept: "application/json" },
      cache: "no-store"
    });

    const data = await tmdbRes.json();

    if (!tmdbRes.ok) {
      const msg = typeof data?.status_message === "string" ? data.status_message : "TMDB details failed.";
      return NextResponse.json({ error: msg }, { status: 502 });
    }

    const movie = {
      id: data.id,
      title: data.title,
      overview: data.overview ?? "",
      releaseDate: data.release_date,
      runtime: data.runtime ?? null,
      posterPath: data.poster_path ?? null
    };

    return NextResponse.json({ movie }, { status: 200 });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Server error.";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
