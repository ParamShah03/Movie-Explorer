// src/components/MovieCard.tsx
"use client";

import { useFavorites } from "@/context/FavoritesContext";
import { MovieSummary } from "@/lib/types";
import { posterUrl, shortOverview, yearFromReleaseDate } from "@/lib/tmdb";

export default function MovieCard({
  movie,
  onOpenDetails
}: {
  movie: MovieSummary;
  onOpenDetails: () => void;
}) {
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();

  const fav = isFavorite(movie.id);
  const year = yearFromReleaseDate(movie.releaseDate);
  const img = posterUrl(movie.posterPath, "w342");

  return (
    <div className="card">
      <button
        className="poster"
        onClick={onOpenDetails}
        aria-label={`Open details for ${movie.title}`}
        style={{ padding: 0, cursor: "pointer" }}
      >
        {img ? <img src={img} alt={`${movie.title} poster`} /> : <span className="muted" style={{ fontSize: 12 }}>No poster</span>}
      </button>

      <div>
        <div className="rowBetween">
          <button
            onClick={onOpenDetails}
            className="btn"
            style={{ padding: 0, background: "transparent", border: "none", textAlign: "left" }}
            aria-label={`Open details for ${movie.title}`}
          >
            <p className="title" style={{ margin: 0 }}>{movie.title}</p>
          </button>
          {year ? <span className="tag">{year}</span> : <span className="tag">—</span>}
        </div>
        <p className="desc">{shortOverview(movie.overview, 140) || <span className="muted">No description available.</span>}</p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "flex-end" }}>
        <button className={`btn smallBtn ${fav ? "btnDanger" : "btnPrimary"}`} onClick={() => (fav ? removeFavorite(movie.id) : addFavorite(movie))}>
          {fav ? "Remove" : "Favorite"}
        </button>
        <button className="btn smallBtn" onClick={onOpenDetails}>
          Details
        </button>
      </div>
    </div>
  );
}
