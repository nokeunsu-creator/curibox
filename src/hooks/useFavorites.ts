import { useCallback, useEffect, useRef, useState } from 'react';

const STORAGE_KEY = 'curibox:favorites';
const DEBOUNCE_MS = 500;

function readStored(): Set<number> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return new Set();
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return new Set();
    return new Set(parsed.filter((n) => typeof n === 'number'));
  } catch {
    return new Set();
  }
}

function writeStored(set: Set<number>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...set]));
  } catch {
    // localStorage may be unavailable; ignore
  }
}

export interface UseFavoritesResult {
  favorites: Set<number>;
  isFavorite: (id: number) => boolean;
  toggleFavorite: (id: number) => void;
  clearFavorites: () => void;
  count: number;
}

export function useFavorites(): UseFavoritesResult {
  const [favorites, setFavorites] = useState<Set<number>>(() => readStored());
  const timerRef = useRef<number | null>(null);
  const pendingRef = useRef<Set<number> | null>(null);

  const flush = useCallback(() => {
    if (pendingRef.current !== null) {
      writeStored(pendingRef.current);
      pendingRef.current = null;
    }
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const schedule = useCallback(
    (next: Set<number>) => {
      pendingRef.current = next;
      if (timerRef.current !== null) clearTimeout(timerRef.current);
      timerRef.current = window.setTimeout(() => flush(), DEBOUNCE_MS);
    },
    [flush]
  );

  const toggleFavorite = useCallback(
    (id: number) => {
      setFavorites((prev) => {
        const next = new Set(prev);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        schedule(next);
        return next;
      });
    },
    [schedule]
  );

  const clearFavorites = useCallback(() => {
    const empty = new Set<number>();
    setFavorites(empty);
    schedule(empty);
  }, [schedule]);

  const isFavorite = useCallback(
    (id: number) => favorites.has(id),
    [favorites]
  );

  useEffect(() => {
    const handler = () => flush();
    window.addEventListener('beforeunload', handler);
    document.addEventListener('visibilitychange', handler);
    return () => {
      window.removeEventListener('beforeunload', handler);
      document.removeEventListener('visibilitychange', handler);
      flush();
    };
  }, [flush]);

  return {
    favorites,
    isFavorite,
    toggleFavorite,
    clearFavorites,
    count: favorites.size,
  };
}
