import { useCallback, useState } from 'react';

const STORAGE_KEY = 'curibox:viewMode';

export type ViewMode = 'all' | 'favorites';

function readStored(): ViewMode {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'favorites'
      ? 'favorites'
      : 'all';
  } catch {
    return 'all';
  }
}

export function useViewMode(): [ViewMode, (next: ViewMode) => void] {
  const [mode, setModeState] = useState<ViewMode>(() => readStored());

  const setMode = useCallback((next: ViewMode) => {
    setModeState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // ignore storage errors
    }
  }, []);

  return [mode, setMode];
}
