// src/context/FavoritesContext.tsx
"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { FavoriteItem, FavoritesState, MovieSummary } from "@/lib/types";
import { loadFavorites, saveFavorites } from "@/lib/storage";

type FavoritesContextValue = {
  ready: boolean;
  favorites: FavoriteItem[];
  isFavorite: (id: number) => boolean;
  getFavorite: (id: number) => FavoriteItem | undefined;
  addFavorite: (movie: MovieSummary) => void;
  removeFavorite: (id: number) => void;
  setRating: (id: number, rating?: 1 | 2 | 3 | 4 | 5) => void;
  setNote: (id: number, note: string) => void;
  clearAll: () => void;
};

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [state, setState] = useState<FavoritesState>({ items: {} });

  useEffect(() => {
    const s = loadFavorites();
    setState(s);
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    saveFavorites(state);
  }, [ready, state]);

  const favorites = useMemo(() => {
    const all = Object.values(state.items);
    all.sort((a, b) => b.updatedAt - a.updatedAt);
    return all;
  }, [state.items]);

  const isFavorite = useCallback((id: number) => {
    return !!state.items[String(id)];
  }, [state.items]);

  const getFavorite = useCallback((id: number) => {
    return state.items[String(id)];
  }, [state.items]);

  const addFavorite = useCallback((movie: MovieSummary) => {
    setState((prev) => {
      const key = String(movie.id);
      const existing = prev.items[key];
      const next: FavoriteItem = {
        id: movie.id,
        title: movie.title,
        posterPath: movie.posterPath ?? null,
        releaseDate: movie.releaseDate,
        rating: existing?.rating,
        note: existing?.note ?? "",
        updatedAt: Date.now()
      };
      return { items: { ...prev.items, [key]: next } };
    });
  }, []);

  const removeFavorite = useCallback((id: number) => {
    setState((prev) => {
      const key = String(id);
      const copy = { ...prev.items };
      delete copy[key];
      return { items: copy };
    });
  }, []);

  const setRating = useCallback((id: number, rating?: 1 | 2 | 3 | 4 | 5) => {
    setState((prev) => {
      const key = String(id);
      const item = prev.items[key];
      if (!item) return prev;
      return {
        items: {
          ...prev.items,
          [key]: { ...item, rating, updatedAt: Date.now() }
        }
      };
    });
  }, []);

  const setNote = useCallback((id: number, note: string) => {
    setState((prev) => {
      const key = String(id);
      const item = prev.items[key];
      if (!item) return prev;
      return {
        items: {
          ...prev.items,
          [key]: { ...item, note, updatedAt: Date.now() }
        }
      };
    });
  }, []);

  const clearAll = useCallback(() => {
    setState({ items: {} });
  }, []);

  const value: FavoritesContextValue = {
    ready,
    favorites,
    isFavorite,
    getFavorite,
    addFavorite,
    removeFavorite,
    setRating,
    setNote,
    clearAll
  };

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error("useFavorites must be used within FavoritesProvider");
  return ctx;
}
