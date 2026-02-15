// src/lib/types.ts
export type TmdbMovieSearchResult = {
  id: number;
  title: string;
  overview: string;
  release_date?: string;
  poster_path?: string | null;
};

export type MovieSummary = {
  id: number;
  title: string;
  overview: string;
  releaseDate?: string;
  posterPath?: string | null;
};

export type TmdbMovieDetails = {
  id: number;
  title: string;
  overview: string;
  release_date?: string;
  runtime?: number | null;
  poster_path?: string | null;
};

export type MovieDetails = {
  id: number;
  title: string;
  overview: string;
  releaseDate?: string;
  runtime?: number | null;
  posterPath?: string | null;
};

export type FavoriteItem = {
  id: number;
  title: string;
  posterPath?: string | null;
  releaseDate?: string;
  rating?: 1 | 2 | 3 | 4 | 5;
  note?: string;
  updatedAt: number;
};

export type FavoritesState = {
  items: Record<string, FavoriteItem>;
};
