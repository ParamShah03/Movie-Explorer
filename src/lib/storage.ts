// src/lib/storage.ts
import { FavoritesState } from "@/lib/types";

const KEY = "movie-explorer:favorites:v1";

export function loadFavorites(): FavoritesState {
  if (typeof window === "undefined") return { items: {} };
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return { items: {} };
    const parsed = JSON.parse(raw) as FavoritesState;
    if (!parsed || typeof parsed !== "object" || !parsed.items || typeof parsed.items !== "object") {
      return { items: {} };
    }
    return parsed;
  } catch {
    return { items: {} };
  }
}

export function saveFavorites(state: FavoritesState) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    // ignore
  }
}
