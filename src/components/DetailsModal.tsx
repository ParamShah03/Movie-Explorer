// src/components/DetailsModal.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { useFavorites } from "@/context/FavoritesContext";
import { MovieDetails, MovieSummary } from "@/lib/types";
import { posterUrl, yearFromReleaseDate } from "@/lib/tmdb";

type DetailsResponse = { movie: MovieDetails };

export default function DetailsModal({
  open,
  movie,
  onClose
}: {
  open: boolean;
  movie: MovieSummary | null;
  onClose: () => void;
}) {
  const { isFavorite, addFavorite, removeFavorite, getFavorite, setRating, setNote } = useFavorites();

  const [details, setDetails] = useState<MovieDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const id = movie?.id ?? null;
  const fav = id ? isFavorite(id) : false;
  const favItem = id ? getFavorite(id) : undefined;

  const display = useMemo(() => {
    if (!movie) return null;
    return {
      id: movie.id,
      title: movie.title,
      posterPath: movie.posterPath,
      releaseDate: movie.releaseDate,
      overview: movie.overview
    };
  }, [movie]);

  useEffect(() => {
    if (!open || !id) {
      setDetails(null);
      setLoading(false);
      setError(null);
      return;
    }

    let cancelled = false;

    async function run() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/tmdb/movie/${id}`, {
          method: "GET",
          headers: { "Accept": "application/json" }
        });

        const data = (await res.json()) as any;

        if (!res.ok) {
          const message = data?.error && typeof data.error === "string" ? data.error : "Failed to load details.";
          throw new Error(message);
        }

        const parsed = data as DetailsResponse;

        if (!cancelled) {
          setDetails(parsed.movie);
          setLoading(false);
        }
      } catch (e) {
        if (cancelled) return;
        setDetails(null);
        setLoading(false);
        setError(e instanceof Error ? e.message : "Network error.");
      }
    }

    run();

    return () => {
      cancelled = true;
    };
  }, [open, id]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open || !display) return null;

  const year = yearFromReleaseDate(details?.releaseDate ?? display.releaseDate);
  const img = posterUrl(details?.posterPath ?? display.posterPath, "w500");
  const runtime = details?.runtime ?? null;

  const effectiveOverview = (details?.overview ?? display.overview ?? "").trim();

  const summaryForFav: MovieSummary = {
    id: display.id,
    title: details?.title ?? display.title,
    overview: effectiveOverview,
    releaseDate: details?.releaseDate ?? display.releaseDate,
    posterPath: details?.posterPath ?? display.posterPath ?? null
  };

  return (
    <div className="modalOverlay" role="dialog" aria-modal="true" aria-label="Movie details">
      <div className="modal">
        <div className="modalHeader">
          <div className="rowBetween">
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <div style={{ fontWeight: 700, fontSize: 15 }}>{details?.title ?? display.title}</div>
              <div className="kv">
                <span className="tag">{year || "—"}</span>
                <span className="tag">{runtime ? `${runtime} min` : "Runtime —"}</span>
                <span className="tag">{fav ? "Favorited" : "Not favorited"}</span>
              </div>
            </div>

            <div className="row" style={{ justifyContent: "flex-end" }}>
              <button
                className={`btn smallBtn ${fav ? "btnDanger" : "btnPrimary"}`}
                onClick={() => (fav ? removeFavorite(display.id) : addFavorite(summaryForFav))}
              >
                {fav ? "Remove" : "Favorite"}
              </button>
              <button className="btn smallBtn" onClick={onClose}>Close</button>
            </div>
          </div>
        </div>

        <div className="modalBody">
          <div>
            <div className="bigPoster">
              {img ? <img src={img} alt={`${display.title} poster`} /> : null}
              {!img ? <div className="muted" style={{ padding: 12 }}>No poster available.</div> : null}
            </div>

            <div style={{ marginTop: 10 }}>
              <div className="muted" style={{ fontSize: 12.5, marginBottom: 6 }}>Your favorite info</div>
              {!fav ? (
                <div className="notice">Favorite this movie to add a rating and note.</div>
              ) : (
                <div className="panel" style={{ padding: 10, borderRadius: 14 }}>
                  <div className="row" style={{ flexWrap: "wrap" }}>
                    <span className="muted" style={{ fontSize: 12.5 }}>Rating</span>
                    <select
                      className="select"
                      value={favItem?.rating ?? ""}
                      onChange={(e) => {
                        const v = e.target.value;
                        if (!v) setRating(display.id, undefined);
                        else setRating(display.id, Number(v) as 1 | 2 | 3 | 4 | 5);
                      }}
                      aria-label="Favorite rating"
                    >
                      <option value="">—</option>
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                      <option value="5">5</option>
                    </select>
                  </div>

                  <div style={{ marginTop: 8 }}>
                    <textarea
                      className="textarea"
                      value={favItem?.note ?? ""}
                      onChange={(e) => setNote(display.id, e.target.value)}
                      placeholder="Optional note…"
                      aria-label="Favorite note"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          <div>
            {loading ? <div className="notice">Loading details…</div> : null}
            {error ? <div className="notice error">{error}</div> : null}

            <div className="panel" style={{ background: "rgba(0,0,0,.18)" }}>
              <div style={{ fontWeight: 650, marginBottom: 8 }}>Overview</div>
              <div className="muted" style={{ whiteSpace: "pre-wrap", lineHeight: 1.5 }}>
                {effectiveOverview ? effectiveOverview : "No overview available."}
              </div>
            </div>

            <div style={{ marginTop: 10 }} className="notice">
              Tip: we proxy TMDB via Next.js API routes so your TMDB key stays server-side.
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={onClose}
        aria-label="Close details"
        style={{
          position: "fixed",
          inset: 0,
          background: "transparent",
          border: "none",
          cursor: "default",
          zIndex: -1
        }}
        tabIndex={-1}
      />
    </div>
  );
}
