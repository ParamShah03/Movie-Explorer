// src/app/page.tsx
"use client";

import { useMemo, useState } from "react";
import SearchBar from "@/components/SearchBar";
import MovieList from "@/components/MovieList";
import FavoritesPanel from "@/components/FavoritesPanel";
import DetailsModal from "@/components/DetailsModal";
import { useTmdbSearch } from "@/hooks/useTmdbSearch";
import { MovieSummary } from "@/lib/types";

export default function HomePage() {
  const [query, setQuery] = useState<string>("");
  const [selected, setSelected] = useState<MovieSummary | null>(null);

  const trimmed = useMemo(() => query.trim(), [query]);
  const canSearch = trimmed.length >= 2;

  const { results, loading, error, hasSearched } = useTmdbSearch(canSearch ? trimmed : "");

  return (
    <div className="container">
      <div className="header">
        <div>
          <h1 className="h1">Movie Explorer</h1>
          <p className="sub">Search movies. Save favorites. Add your rating and notes.</p>
        </div>
        <span className="tag">Next.js • TypeScript • TMDB Proxy</span>
      </div>

      <div className="grid">
        <div className="panel">
          <SearchBar
            value={query}
            onChange={setQuery}
            hint={!canSearch && trimmed.length > 0 ? "Type at least 2 characters to search." : undefined}
          />

          <div className="hr" />

          {!canSearch && trimmed.length === 0 ? (
            <div className="notice">Start typing a movie title to search.</div>
          ) : null}

          {!canSearch && trimmed.length > 0 ? (
            <div className="notice">Type at least 2 characters to search.</div>
          ) : null}

          {error ? <div className="notice error">{error}</div> : null}

          <MovieList
            movies={results}
            loading={loading}
            hasSearched={hasSearched}
            onOpenDetails={(m) => setSelected(m)}
          />
        </div>

        <FavoritesPanel onOpenDetails={(m) => setSelected(m)} />
      </div>

      <DetailsModal
        open={!!selected}
        movie={selected}
        onClose={() => setSelected(null)}
      />
    </div>
  );
}
