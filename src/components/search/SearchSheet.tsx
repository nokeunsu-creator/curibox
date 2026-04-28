import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { TriviaItem } from '../../models/types';
import { CATEGORY_EMOJI } from '../../theme/categoryColors';

interface Props {
  open: boolean;
  onClose: () => void;
  items: TriviaItem[];
  onPickItem: (id: number) => void;
}

const MAX_RESULTS = 50;

function searchTrivia(query: string, items: TriviaItem[]): TriviaItem[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const scored: Array<{ item: TriviaItem; score: number }> = [];
  for (const item of items) {
    const titleLower = item.title.toLowerCase();
    const contentLower = item.content.toLowerCase();
    const titleMatch = titleLower.includes(q);
    const contentMatch = contentLower.includes(q);
    if (!titleMatch && !contentMatch) continue;
    scored.push({ item, score: titleMatch ? 2 : 1 });
  }
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, MAX_RESULTS).map((x) => x.item);
}

export default function SearchSheet({
  open,
  onClose,
  items,
  onPickItem,
}: Props) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      const t = setTimeout(() => inputRef.current?.focus(), 50);
      return () => clearTimeout(t);
    }
    setQuery('');
  }, [open]);

  const results = useMemo(() => searchTrivia(query, items), [query, items]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="search"
          role="dialog"
          aria-modal="true"
          aria-label="검색"
          className="fixed inset-0 z-50 flex flex-col bg-white dark:bg-neutral-950"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.18 }}
        >
          <div className="flex items-center gap-2 border-b border-neutral-200 px-4 py-3 dark:border-neutral-800">
            <button
              type="button"
              onClick={onClose}
              aria-label="검색 닫기"
              className="flex h-9 w-9 items-center justify-center rounded-full text-neutral-500 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800"
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
                <line x1="19" y1="12" x2="5" y2="12" />
                <polyline points="12 19 5 12 12 5" />
              </svg>
            </button>
            <div className="relative flex-1">
              <svg
                viewBox="0 0 24 24"
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                ref={inputRef}
                type="search"
                inputMode="search"
                placeholder="제목·내용에서 검색..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full rounded-full bg-neutral-100 py-2 pl-10 pr-4 text-sm outline-none placeholder:text-neutral-400 focus:ring-2 focus:ring-violet-500 dark:bg-neutral-800 dark:text-neutral-100 dark:placeholder:text-neutral-500"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-2 py-2">
            {query.trim() === '' ? (
              <div className="flex h-full flex-col items-center justify-center px-6 text-center">
                <div className="mb-3 text-5xl">🔎</div>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  궁금한 키워드를 입력해 보세요
                </p>
                <p className="mt-1 text-xs text-neutral-400 dark:text-neutral-600">
                  예: 블랙홀, 김치, 다윈, 베토벤
                </p>
              </div>
            ) : results.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center px-6 text-center">
                <div className="mb-3 text-5xl">🤔</div>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  '{query}'에 해당하는 카드가 없어요
                </p>
              </div>
            ) : (
              <ul className="space-y-1">
                {results.map((item) => (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => onPickItem(item.id)}
                      className="flex w-full items-start gap-3 rounded-2xl px-3 py-2.5 text-left transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-800"
                    >
                      <span className="mt-0.5 text-xl leading-none">
                        {CATEGORY_EMOJI[item.category]}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-violet-600 dark:text-violet-400">
                            {item.category}
                          </span>
                          <span className="text-xs text-neutral-400">·</span>
                          <span className="text-xs text-neutral-400">
                            #{item.id}
                          </span>
                        </div>
                        <p className="mt-0.5 truncate text-sm font-bold text-neutral-800 dark:text-neutral-100">
                          {item.title}
                        </p>
                        <p className="mt-0.5 line-clamp-2 text-xs text-neutral-500 dark:text-neutral-400">
                          {item.content}
                        </p>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {results.length > 0 && (
            <div className="border-t border-neutral-200 px-4 py-2 text-center text-xs text-neutral-400 dark:border-neutral-800 dark:text-neutral-600">
              {results.length}개 결과
              {results.length === MAX_RESULTS && ' (상위 50개)'}
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
