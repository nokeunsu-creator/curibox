import { useCallback, useEffect, useRef, useState } from 'react';
import type { Category } from '../models/types';
import { ALL_CATEGORIES } from '../models/types';

const STORAGE_KEY = 'curibox:enabledCategories';
const DEBOUNCE_MS = 500;

function readStored(): Set<Category> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return new Set(ALL_CATEGORIES);
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return new Set(ALL_CATEGORIES);
    const valid = parsed.filter(
      (s): s is Category =>
        typeof s === 'string' &&
        (ALL_CATEGORIES as readonly string[]).includes(s)
    );
    return valid.length > 0 ? new Set(valid) : new Set(ALL_CATEGORIES);
  } catch {
    return new Set(ALL_CATEGORIES);
  }
}

function writeStored(set: Set<Category>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...set]));
  } catch {
    // localStorage may be unavailable; ignore
  }
}

export interface UseCategoryFilterResult {
  enabled: Set<Category>;
  isEnabled: (cat: Category) => boolean;
  toggleCategory: (cat: Category) => void;
  enableAll: () => void;
  disableAll: () => void;
  count: number;
}

export function useCategoryFilter(): UseCategoryFilterResult {
  const [enabled, setEnabled] = useState<Set<Category>>(() => readStored());
  const timerRef = useRef<number | null>(null);
  const pendingRef = useRef<Set<Category> | null>(null);

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
    (next: Set<Category>) => {
      pendingRef.current = next;
      if (timerRef.current !== null) clearTimeout(timerRef.current);
      timerRef.current = window.setTimeout(() => flush(), DEBOUNCE_MS);
    },
    [flush]
  );

  const toggleCategory = useCallback(
    (cat: Category) => {
      setEnabled((prev) => {
        const next = new Set(prev);
        if (next.has(cat)) next.delete(cat);
        else next.add(cat);
        schedule(next);
        return next;
      });
    },
    [schedule]
  );

  const enableAll = useCallback(() => {
    const all = new Set(ALL_CATEGORIES);
    setEnabled(all);
    schedule(all);
  }, [schedule]);

  const disableAll = useCallback(() => {
    const empty = new Set<Category>();
    setEnabled(empty);
    schedule(empty);
  }, [schedule]);

  const isEnabled = useCallback(
    (cat: Category) => enabled.has(cat),
    [enabled]
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
    enabled,
    isEnabled,
    toggleCategory,
    enableAll,
    disableAll,
    count: enabled.size,
  };
}
