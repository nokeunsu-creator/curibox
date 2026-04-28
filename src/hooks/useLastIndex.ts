import { useCallback, useEffect, useRef, useState } from 'react';

const STORAGE_KEY = 'curibox:lastIndex';
const DEBOUNCE_MS = 500;

function readStoredIndex(maxIndex: number): number {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === null) return 0;
    const parsed = parseInt(raw, 10);
    if (!Number.isFinite(parsed)) return 0;
    return Math.max(0, Math.min(parsed, maxIndex));
  } catch {
    return 0;
  }
}

function writeIndex(value: number) {
  try {
    localStorage.setItem(STORAGE_KEY, String(value));
  } catch {
    // localStorage may be unavailable (Safari private mode, quota); ignore
  }
}

export function useLastIndex(
  maxIndex: number
): [number, (next: number) => void] {
  const [index, setIndexState] = useState(() => readStoredIndex(maxIndex));
  const timerRef = useRef<number | null>(null);
  const pendingRef = useRef<number | null>(null);

  const flush = useCallback(() => {
    if (pendingRef.current !== null) {
      writeIndex(pendingRef.current);
      pendingRef.current = null;
    }
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const setIndex = useCallback(
    (next: number) => {
      const clamped = Math.max(0, Math.min(next, maxIndex));
      setIndexState(clamped);
      pendingRef.current = clamped;
      if (timerRef.current !== null) clearTimeout(timerRef.current);
      timerRef.current = window.setTimeout(() => {
        flush();
      }, DEBOUNCE_MS);
    },
    [maxIndex, flush]
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

  return [index, setIndex];
}
