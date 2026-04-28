import { useEffect, useMemo, useRef, useState } from 'react';
import SwipeDeck from './components/deck/SwipeDeck';
import SettingsSheet from './components/settings/SettingsSheet';
import EmptyState from './components/common/EmptyState';
import OnboardingTutorial from './components/onboarding/OnboardingTutorial';
import SearchSheet from './components/search/SearchSheet';
import { loadAllTrivia, shuffleDeterministic } from './data/triviaLoader';
import { useLastIndex } from './hooks/useLastIndex';
import { useFavorites } from './hooks/useFavorites';
import { useCategoryFilter } from './hooks/useCategoryFilter';
import { useViewMode } from './hooks/useViewMode';
import { useOnboardingSeen } from './hooks/useOnboardingSeen';
import { useTheme } from './hooks/useTheme';
import { ALL_CATEGORIES } from './models/types';
import type { DeckItem } from './models/types';

const SHUFFLE_SEED = 20260428;
const SHUFFLED_TRIVIA = shuffleDeterministic(loadAllTrivia(), SHUFFLE_SEED);

export default function App() {
  const { isFavorite, toggleFavorite, clearFavorites, favorites, count } =
    useFavorites();
  const filter = useCategoryFilter();
  const [viewMode, setViewMode] = useViewMode();
  const [showSettings, setShowSettings] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const onboarding = useOnboardingSeen();
  const [forceShowOnboarding, setForceShowOnboarding] = useState(false);
  const showOnboarding = !onboarding.seen || forceShowOnboarding;
  const { theme, resolvedTheme, setTheme } = useTheme();

  const deck = useMemo<DeckItem[]>(() => {
    if (viewMode === 'favorites') {
      return SHUFFLED_TRIVIA.filter((item) => favorites.has(item.id));
    }
    return SHUFFLED_TRIVIA.filter((item) => filter.enabled.has(item.category));
  }, [viewMode, favorites, filter.enabled]);

  const maxIndex = Math.max(0, deck.length - 1);
  const [index, setIndex] = useLastIndex(maxIndex);
  const safeIndex = Math.min(index, maxIndex);

  const filterKey = `${viewMode}:${[...filter.enabled].sort().join(',')}`;
  const prevKeyRef = useRef(filterKey);
  const pendingJumpRef = useRef<number | null>(null);
  useEffect(() => {
    if (prevKeyRef.current !== filterKey) {
      if (pendingJumpRef.current !== null) {
        setIndex(pendingJumpRef.current);
        pendingJumpRef.current = null;
      } else {
        setIndex(0);
      }
      prevKeyRef.current = filterKey;
    }
  }, [filterKey, setIndex]);

  const handleResetProgress = () => setIndex(0);

  const isFavoritesMode = viewMode === 'favorites';
  const toggleFavoritesView = () =>
    setViewMode(isFavoritesMode ? 'all' : 'favorites');

  const handlePickSearchResult = (itemId: number) => {
    setShowSearch(false);
    const idx = SHUFFLED_TRIVIA.findIndex((item) => item.id === itemId);
    if (idx < 0) return;
    const targetKey = `all:${[...ALL_CATEGORIES].sort().join(',')}`;
    if (filterKey === targetKey) {
      setIndex(idx);
      return;
    }
    pendingJumpRef.current = idx;
    filter.enableAll();
    setViewMode('all');
  };

  return (
    <div className="flex h-full w-full flex-col bg-neutral-50 dark:bg-neutral-950">
      <header className="flex items-center justify-between px-5 pt-5 pb-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">📦</span>
          <h1 className="text-base font-bold text-neutral-800 dark:text-neutral-100">호기심상자</h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleFavoritesView}
            className={
              'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium transition-colors ' +
              (isFavoritesMode
                ? 'bg-rose-500 text-white'
                : 'bg-rose-50 text-rose-500 hover:bg-rose-100 dark:bg-rose-950 dark:text-rose-300 dark:hover:bg-rose-900')
            }
            aria-label={isFavoritesMode ? '전체 보기' : '즐겨찾기 보기'}
          >
            <svg
              viewBox="0 0 24 24"
              className="h-3.5 w-3.5"
              fill="currentColor"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            {count}
          </button>
          {deck.length > 0 && (
            <span className="text-xs tabular-nums text-neutral-400 dark:text-neutral-500">
              {safeIndex + 1} / {deck.length}
            </span>
          )}
          <button
            type="button"
            onClick={() => setShowSearch(true)}
            className="rounded-full p-1.5 text-neutral-500 hover:bg-neutral-200 dark:text-neutral-400 dark:hover:bg-neutral-800"
            aria-label="검색"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => setShowSettings(true)}
            className="rounded-full p-1.5 text-neutral-500 hover:bg-neutral-200 dark:text-neutral-400 dark:hover:bg-neutral-800"
            aria-label="설정"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
          </button>
        </div>
      </header>

      <main className="flex flex-1 items-center justify-center px-5 pb-3">
        <div className="aspect-[3/4] h-full w-full max-w-md">
          {deck.length === 0 ? (
            isFavoritesMode ? (
              <EmptyState
                emoji="💝"
                title="아직 즐겨찾은 카드가 없어요"
                description="카드 우상단의 하트 버튼을 눌러 마음에 드는 사실을 모아보세요."
                actionLabel="전체 보기로 돌아가기"
                onAction={() => setViewMode('all')}
              />
            ) : (
              <EmptyState
                emoji="🔍"
                title="선택된 카테고리가 없어요"
                description="설정에서 보고 싶은 카테고리를 골라주세요."
                actionLabel="설정 열기"
                onAction={() => setShowSettings(true)}
              />
            )
          ) : (
            <SwipeDeck
              deck={deck}
              index={safeIndex}
              onChangeIndex={setIndex}
              isFavorite={isFavorite}
              onToggleFavorite={toggleFavorite}
            />
          )}
        </div>
      </main>

      <footer className="flex justify-center pb-4">
        <p className="text-xs text-neutral-400 dark:text-neutral-600">
          위/아래로 스와이프 — 카드 넘기기
        </p>
      </footer>

      <SettingsSheet
        open={showSettings}
        onClose={() => setShowSettings(false)}
        enabledCategories={filter.enabled}
        onToggleCategory={filter.toggleCategory}
        onEnableAllCategories={filter.enableAll}
        favoritesCount={count}
        onClearFavorites={clearFavorites}
        onResetProgress={handleResetProgress}
        onReplayOnboarding={() => {
          setShowSettings(false);
          setForceShowOnboarding(true);
        }}
        theme={theme}
        resolvedTheme={resolvedTheme}
        onSetTheme={setTheme}
      />

      <SearchSheet
        open={showSearch}
        onClose={() => setShowSearch(false)}
        items={SHUFFLED_TRIVIA}
        onPickItem={handlePickSearchResult}
      />

      {showOnboarding && (
        <OnboardingTutorial
          onClose={() => {
            onboarding.markSeen();
            setForceShowOnboarding(false);
          }}
        />
      )}
    </div>
  );
}
