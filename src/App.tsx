import SwipeDeck from './components/deck/SwipeDeck';
import {
  loadAllTrivia,
  buildDeck,
  shuffleDeterministic,
} from './data/triviaLoader';
import { useLastIndex } from './hooks/useLastIndex';
import { useFavorites } from './hooks/useFavorites';

const SHUFFLE_SEED = 20260428;
const SHUFFLED_TRIVIA = shuffleDeterministic(loadAllTrivia(), SHUFFLE_SEED);
const DECK = buildDeck(SHUFFLED_TRIVIA, 10);
const MAX_INDEX = DECK.length - 1;

export default function App() {
  const [index, setIndex] = useLastIndex(MAX_INDEX);
  const { isFavorite, toggleFavorite, count } = useFavorites();

  return (
    <div className="flex h-full w-full flex-col bg-neutral-50">
      <header className="flex items-center justify-between px-5 pt-5 pb-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">📦</span>
          <h1 className="text-base font-bold text-neutral-800">호기심상자</h1>
        </div>
        <div className="flex items-center gap-3 text-xs text-neutral-400">
          {count > 0 && (
            <span className="inline-flex items-center gap-1 text-rose-500">
              <svg
                viewBox="0 0 24 24"
                className="h-3.5 w-3.5"
                fill="currentColor"
              >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
              {count}
            </span>
          )}
          <span className="tabular-nums">
            {index + 1} / {DECK.length}
          </span>
        </div>
      </header>

      <main className="flex flex-1 items-center justify-center px-5 pb-3">
        <div className="aspect-[3/4] h-full w-full max-w-md">
          <SwipeDeck
            deck={DECK}
            index={index}
            onChangeIndex={setIndex}
            isFavorite={isFavorite}
            onToggleFavorite={toggleFavorite}
          />
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
