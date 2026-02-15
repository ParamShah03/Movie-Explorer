// src/components/MovieList.tsx
"use client";

import MovieCard from "@/components/MovieCard";
import { MovieSummary } from "@/lib/types";

export default function MovieList({
  movies,
  loading,
  hasSearched,
  onOpenDetails
}: {
  movies: MovieSummary[];
  loading: boolean;
  hasSearched: boolean;
  onOpenDetails: (m: MovieSummary) => void;
}) {
  if (loading) {
    return <div className="notice">Searching…</div>;
  }

  if (hasSearched && movies.length === 0) {
    return <div className="notice">No results. Try a different title.</div>;
  }

  if (!hasSearched) {
    return null;
  }

  return (
    <div className="list" aria-label="Search results">
      {movies.map((m) => (
        <MovieCard key={m.id} movie={m} onOpenDetails={() => onOpenDetails(m)} />
      ))}
    </div>
  );
}
