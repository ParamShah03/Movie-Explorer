// src/components/FavoritesPanel.tsx
"use client";

import { useMemo } from "react";
import { useFavorites } from "@/context/FavoritesContext";
import { MovieSummary } from "@/lib/types";
import { posterUrl, yearFromReleaseDate } from "@/lib/tmdb";

export default function FavoritesPanel({
  onOpenDetails
}: {
  onOpenDetails: (m: MovieSummary) => void;
}) {
  const { ready, favorites, setRating, setNote, removeFavorite, clearAll } = useFavorites();

  const count = favorites.length;

  const header = useMemo(() => {
    if (!ready) return "Favorites (loading…)";
    return `Favorites (${count})`;
  }, [ready, count]);

  return (
    <div className="panel" aria-label="Favorites panel">
      <div className="rowBetween">
        <div>
          <div style={{ fontWeight: 650 }}>{header}</div>
          <div className="muted" style={{ fontSize: 12.5, marginTop: 4 }}>Rate 1–5 and add an optional note.</div>
        </div>
        <button className="btn smallBtn" onClick={clearAll} disabled={!ready || count === 0} aria-disabled={!ready || count === 0}>
          Clear
        </button>
      </div>

      <div className="hr" />

      {!ready ? (
        <div className="notice">Loading favorites…</div>
      ) : null}

      {ready && favorites.length === 0 ? (
        <div className="notice">No favorites yet. Add some from search results.</div>
      ) : null}

      {ready && favorites.length > 0 ? (
        <div className="list">
          {favorites.map((f) => {
            const year = yearFromReleaseDate(f.releaseDate);
            const img = posterUrl(f.posterPath, "w342");

            const summary: MovieSummary = {
              id: f.id,
              title: f.title,
              overview: "",
              releaseDate: f.releaseDate,
              posterPath: f.posterPath ?? null
            };

            return (
              <div key={f.id} className="card" style={{ gridTemplateColumns: "68px 1fr" }}>
                <button
                  className="poster"
                  onClick={() => onOpenDetails(summary)}
                  aria-label={`Open details for ${f.title}`}
                  style={{ padding: 0, cursor: "pointer" }}
                >
                  {img ? <img src={img} alt={`${f.title} poster`} /> : <span className="muted" style={{ fontSize: 12 }}>No poster</span>}
                </button>

                <div>
                  <div className="rowBetween">
                    <button
                      onClick={() => onOpenDetails(summary)}
                      className="btn"
                      style={{ padding: 0, background: "transparent", border: "none", textAlign: "left" }}
                      aria-label={`Open details for ${f.title}`}
                    >
                      <p className="title" style={{ margin: 0 }}>{f.title}</p>
                    </button>
                    {year ? <span className="tag">{year}</span> : <span className="tag">—</span>}
                  </div>

                  <div className="row" style={{ marginTop: 8, alignItems: "center", flexWrap: "wrap" }}>
                    <span className="muted" style={{ fontSize: 12.5 }}>Rating</span>
                    <select
                      className="select"
                      value={f.rating ?? ""}
                      onChange={(e) => {
                        const v = e.target.value;
                        if (!v) setRating(f.id, undefined);
                        else setRating(f.id, Number(v) as 1 | 2 | 3 | 4 | 5);
                      }}
                      aria-label={`Rating for ${f.title}`}
                    >
                      <option value="">—</option>
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                      <option value="5">5</option>
                    </select>

                    <button className="btn smallBtn btnDanger" onClick={() => removeFavorite(f.id)} style={{ marginLeft: "auto" }}>
                      Remove
                    </button>
                  </div>

                  <div style={{ marginTop: 8 }}>
                    <textarea
                      className="textarea"
                      value={f.note ?? ""}
                      onChange={(e) => setNote(f.id, e.target.value)}
                      placeholder="Optional note…"
                      aria-label={`Note for ${f.title}`}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
