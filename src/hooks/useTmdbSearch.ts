// src/hooks/useTmdbSearch.ts
"use client";

import { useEffect, useMemo, useState } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { MovieSummary, TmdbMovieSearchResult } from "@/lib/types";

type SearchResponse = {
  results: TmdbMovieSearchResult[];
};

export function useTmdbSearch(query: string) {
  const q = useDebounce(query, 300);

  const [results, setResults] = useState<MovieSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const normalized = useMemo(() => q.trim(), [q]);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      if (!normalized) {
        setResults([]);
        setLoading(false);
        setError(null);
        setHasSearched(false);
        return;
      }

      setLoading(true);
      setError(null);
      setHasSearched(true);

      try {
        const res = await fetch(`/api/tmdb/search?query=${encodeURIComponent(normalized)}`, {
          method: "GET",
          headers: { "Accept": "application/json" }
        });

        const data = (await res.json()) as unknown;

        if (!res.ok) {
          const message = (data && typeof data === "object" && "error" in data && typeof (data as any).error === "string")
            ? (data as any).error
            : "Search failed. Please try again.";
          throw new Error(message);
        }

        const parsed = data as SearchResponse;

        const mapped: MovieSummary[] = (parsed.results || []).map((m) => ({
          id: m.id,
          title: m.title,
          overview: m.overview || "",
          releaseDate: m.release_date,
          posterPath: m.poster_path ?? null
        }));

        if (!cancelled) {
          setResults(mapped);
          setLoading(false);
        }
      } catch (e) {
        if (cancelled) return;
        setResults([]);
        setLoading(false);
        setError(e instanceof Error ? e.message : "Network error. Please try again.");
      }
    }

    run();

    return () => {
      cancelled = true;
    };
  }, [normalized]);

  return { results, loading, error, hasSearched };
}
