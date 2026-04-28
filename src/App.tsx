import { useState } from 'react';
import TriviaCard from './components/cards/TriviaCard';
import AdCard from './components/cards/AdCard';
import { loadAllTrivia, buildDeck } from './data/triviaLoader';
import { isAdItem } from './models/types';

const DECK = buildDeck(loadAllTrivia(), 10);

export default function App() {
  const [index, setIndex] = useState(0);
  const item = DECK[index];

  return (
    <div className="flex h-full w-full flex-col bg-neutral-50">
      <header className="flex items-center justify-between px-5 pt-5 pb-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">📦</span>
          <h1 className="text-base font-bold text-neutral-800">호기심상자</h1>
        </div>
        <span className="text-xs text-neutral-400">미리보기 모드</span>
      </header>

      <main className="flex flex-1 items-center justify-center px-5 pb-5">
        <div className="aspect-[3/4] w-full max-w-md">
          {isAdItem(item) ? (
            <AdCard item={item} />
          ) : (
            <TriviaCard item={item} position={index + 1} total={DECK.length} />
          )}
        </div>
      </main>

      <footer className="flex items-center justify-between gap-3 px-5 pb-6">
        <button
          onClick={() => setIndex((i) => Math.max(0, i - 1))}
          disabled={index === 0}
          className="flex-1 rounded-2xl bg-white py-3 text-sm font-bold text-neutral-700 shadow-sm disabled:opacity-40"
        >
          ← 이전
        </button>
        <button
          onClick={() => setIndex((i) => Math.min(DECK.length - 1, i + 1))}
          disabled={index === DECK.length - 1}
          className="flex-1 rounded-2xl bg-violet-600 py-3 text-sm font-bold text-white shadow-sm disabled:opacity-40"
        >
          다음 →
        </button>
      </footer>
    </div>
  );
}
