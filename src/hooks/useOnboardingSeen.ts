import { useCallback, useState } from 'react';

const STORAGE_KEY = 'curibox:onboardingSeen';

function readStored(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) === '1';
  } catch {
    return false;
  }
}

function writeStored(seen: boolean) {
  try {
    if (seen) localStorage.setItem(STORAGE_KEY, '1');
    else localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}

export function useOnboardingSeen(): {
  seen: boolean;
  markSeen: () => void;
  reset: () => void;
} {
  const [seen, setSeen] = useState<boolean>(() => readStored());

  const markSeen = useCallback(() => {
    setSeen(true);
    writeStored(true);
  }, []);

  const reset = useCallback(() => {
    setSeen(false);
    writeStored(false);
  }, []);

  return { seen, markSeen, reset };
}
