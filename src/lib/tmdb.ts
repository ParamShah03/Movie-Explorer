// src/lib/tmdb.ts
export const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/";

export function posterUrl(posterPath?: string | null, size: "w154" | "w342" | "w500" = "w342") {
  if (!posterPath) return "";
  return `${TMDB_IMAGE_BASE}${size}${posterPath}`;
}

export function yearFromReleaseDate(releaseDate?: string) {
  if (!releaseDate) return "";
  const y = releaseDate.slice(0, 4);
  return /^\d{4}$/.test(y) ? y : "";
}

export function shortOverview(text: string, max = 140) {
  const t = (text || "").trim();
  if (t.length <= max) return t;
  return t.slice(0, max).trimEnd() + "…";
}
