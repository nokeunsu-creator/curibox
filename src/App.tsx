import SwipeDeck from './components/deck/SwipeDeck';
import { loadAllTrivia, buildDeck } from './data/triviaLoader';
import { useLastIndex } from './hooks/useLastIndex';

const DECK = buildDeck(loadAllTrivia(), 10);
const MAX_INDEX = DECK.length - 1;

export default function App() {
  const [index, setIndex] = useLastIndex(MAX_INDEX);

  return (
    <div className="flex h-full w-full flex-col bg-neutral-50">
      <header className="flex items-center justify-between px-5 pt-5 pb-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">📦</span>
          <h1 className="text-base font-bold text-neutral-800">호기심상자</h1>
        </div>
        <span className="text-xs text-neutral-400">
          {index + 1} / {DECK.length}
        </span>
      </header>

      <main className="flex flex-1 items-center justify-center px-5 pb-3">
        <div className="aspect-[3/4] h-full w-full max-w-md">
          <SwipeDeck deck={DECK} index={index} onChangeIndex={setIndex} />
        </div>
      </main>

      <footer className="flex justify-center pb-4">
        <p className="text-xs text-neutral-400">
          위/아래로 스와이프 — 카드 넘기기
        </p>
      </footer>
    </div>
  );
}
