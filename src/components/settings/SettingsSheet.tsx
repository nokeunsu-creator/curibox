import { AnimatePresence, motion } from 'framer-motion';
import { ALL_CATEGORIES } from '../../models/types';
import type { Category } from '../../models/types';
import { CATEGORY_THEME, CATEGORY_EMOJI } from '../../theme/categoryColors';

interface Props {
  open: boolean;
  onClose: () => void;
  enabledCategories: Set<Category>;
  onToggleCategory: (cat: Category) => void;
  onEnableAllCategories: () => void;
  favoritesCount: number;
  onClearFavorites: () => void;
  onResetProgress: () => void;
  onReplayOnboarding: () => void;
}

export default function SettingsSheet({
  open,
  onClose,
  enabledCategories,
  onToggleCategory,
  onEnableAllCategories,
  favoritesCount,
  onClearFavorites,
  onResetProgress,
  onReplayOnboarding,
}: Props) {
  const handleClearFavorites = () => {
    if (favoritesCount === 0) return;
    if (window.confirm(`즐겨찾기 ${favoritesCount}개를 모두 삭제할까요?`)) {
      onClearFavorites();
    }
  };

  const handleResetProgress = () => {
    if (window.confirm('처음 카드부터 다시 시작할까요?')) {
      onResetProgress();
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="backdrop"
            className="fixed inset-0 z-40 bg-black/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={onClose}
            aria-hidden
          />
          <motion.div
            key="sheet"
            role="dialog"
            aria-modal="true"
            aria-label="설정"
            className="fixed inset-x-0 bottom-0 z-50 max-h-[85vh] overflow-y-auto rounded-t-3xl bg-white px-6 pb-8 pt-3 shadow-2xl"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 32 }}
          >
            <div className="mx-auto mb-4 h-1.5 w-10 rounded-full bg-neutral-300" />

            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-bold text-neutral-800">설정</h2>
              <button
                type="button"
                onClick={onClose}
                className="rounded-full px-3 py-1 text-sm text-neutral-500 hover:bg-neutral-100"
                aria-label="닫기"
              >
                닫기
              </button>
            </div>

            <section className="mb-6">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-sm font-bold text-neutral-700">
                  카테고리
                </h3>
                <button
                  type="button"
                  onClick={onEnableAllCategories}
                  className="text-xs font-medium text-violet-600 hover:underline"
                >
                  전체 선택
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {ALL_CATEGORIES.map((cat) => {
                  const enabled = enabledCategories.has(cat);
                  const theme = CATEGORY_THEME[cat];
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => onToggleCategory(cat)}
                      className="flex items-center gap-2 rounded-2xl border-2 px-3 py-2.5 text-sm font-medium transition-all"
                      style={{
                        borderColor: enabled ? theme.chip : '#E5E5E5',
                        background: enabled ? theme.bg : '#FFFFFF',
                        color: enabled ? theme.text : '#9CA3AF',
                      }}
                      aria-pressed={enabled}
                    >
                      <span className="text-lg">{CATEGORY_EMOJI[cat]}</span>
                      <span className="flex-1 text-left">{cat}</span>
                      {enabled && (
                        <svg
                          viewBox="0 0 24 24"
                          className="h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      )}
                    </button>
                  );
                })}
              </div>
            </section>

            <section className="space-y-2">
              <h3 className="mb-3 text-sm font-bold text-neutral-700">
                초기화
              </h3>
              <button
                type="button"
                onClick={handleResetProgress}
                className="flex w-full items-center justify-between rounded-2xl bg-neutral-100 px-4 py-3 text-sm font-medium text-neutral-700 hover:bg-neutral-200"
              >
                <span>진행도 초기화</span>
                <span className="text-xs text-neutral-400">처음부터</span>
              </button>
              <button
                type="button"
                onClick={handleClearFavorites}
                disabled={favoritesCount === 0}
                className="flex w-full items-center justify-between rounded-2xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-600 hover:bg-rose-100 disabled:opacity-40"
              >
                <span>즐겨찾기 모두 삭제</span>
                <span className="text-xs text-rose-400">
                  {favoritesCount}개
                </span>
              </button>
              <button
                type="button"
                onClick={onReplayOnboarding}
                className="flex w-full items-center justify-between rounded-2xl bg-violet-50 px-4 py-3 text-sm font-medium text-violet-700 hover:bg-violet-100"
              >
                <span>튜토리얼 다시 보기</span>
                <span className="text-xs text-violet-400">4슬라이드</span>
              </button>
            </section>

            <p className="mt-6 text-center text-xs text-neutral-400">
              호기심상자 · 잡학 무한 스와이프
            </p>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
