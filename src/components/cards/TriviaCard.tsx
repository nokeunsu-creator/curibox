import { useState } from 'react';
import { motion } from 'framer-motion';
import { getCategoryTheme, CATEGORY_EMOJI } from '../../theme/categoryColors';
import type { TriviaItem } from '../../models/types';
import { useTheme } from '../../hooks/useTheme';

interface Props {
  item: TriviaItem;
  position?: number;
  total?: number;
  isFavorite?: boolean;
  onToggleFavorite?: (id: number) => void;
}

const SHARE_URL = 'https://curibox.vercel.app';

export default function TriviaCard({
  item,
  position,
  total,
  isFavorite = false,
  onToggleFavorite,
}: Props) {
  const { resolvedTheme } = useTheme();
  const theme = getCategoryTheme(item.category, resolvedTheme === 'dark');
  const emoji = CATEGORY_EMOJI[item.category];
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const shareText = `${item.title}\n\n${item.content}`;
    const shareData = {
      title: '호기심상자',
      text: shareText,
      url: SHARE_URL,
    };
    const nav = navigator as Navigator & {
      share?: (data: ShareData) => Promise<void>;
    };
    try {
      if (typeof nav.share === 'function') {
        await nav.share(shareData);
        return;
      }
      if (nav.clipboard) {
        await nav.clipboard.writeText(`${shareText}\n\n${SHARE_URL}`);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }
    } catch {
      // user canceled or unavailable; ignore
    }
  };

  return (
    <div
      className="relative flex h-full w-full flex-col justify-between overflow-hidden rounded-3xl px-7 py-9 shadow-xl"
      style={{ background: theme.bgGradient, color: theme.text }}
    >
      <div className="flex items-center justify-between">
        <span
          className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold"
          style={{ background: theme.chip, color: theme.chipText }}
        >
          <span className="text-sm">{emoji}</span>
          <span>{item.category}</span>
        </span>
        <div className="flex items-center gap-2">
          {position !== undefined && total !== undefined && (
            <span
              className="mr-1 text-xs font-medium tabular-nums"
              style={{ color: theme.subtext }}
            >
              {position} / {total}
            </span>
          )}
          <ShareButton
            chipColor={theme.chip}
            subtextColor={theme.subtext}
            copied={copied}
            onPress={(e) => {
              e.stopPropagation();
              handleShare();
            }}
          />
          {onToggleFavorite && (
            <FavoriteButton
              isFavorite={isFavorite}
              chipColor={theme.chip}
              subtextColor={theme.subtext}
              onPress={(e) => {
                e.stopPropagation();
                onToggleFavorite(item.id);
              }}
            />
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col justify-center py-6">
        <div className="mb-5 text-7xl opacity-20">{emoji}</div>
        <h2
          className="text-3xl font-extrabold leading-tight tracking-tight"
          style={{ color: theme.text }}
        >
          {item.title}
        </h2>
      </div>

      <p
        className="text-base leading-relaxed"
        style={{ color: theme.subtext }}
      >
        {item.content}
      </p>
    </div>
  );
}

interface FavoriteButtonProps {
  isFavorite: boolean;
  chipColor: string;
  subtextColor: string;
  onPress: (e: React.PointerEvent) => void;
}

function FavoriteButton({
  isFavorite,
  chipColor,
  subtextColor,
  onPress,
}: FavoriteButtonProps) {
  return (
    <motion.button
      type="button"
      onPointerDown={(e) => e.stopPropagation()}
      onPointerUp={onPress}
      whileTap={{ scale: 0.85 }}
      animate={
        isFavorite
          ? { scale: [1, 1.25, 1], transition: { duration: 0.32 } }
          : { scale: 1 }
      }
      aria-label={isFavorite ? '즐겨찾기 해제' : '즐겨찾기 추가'}
      className="flex h-9 w-9 items-center justify-center rounded-full bg-white/40 backdrop-blur-sm transition-colors hover:bg-white/60"
      style={{
        color: isFavorite ? chipColor : subtextColor,
      }}
    >
      <svg
        viewBox="0 0 24 24"
        className="h-5 w-5"
        fill={isFavorite ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth={2.2}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    </motion.button>
  );
}

interface ShareButtonProps {
  chipColor: string;
  subtextColor: string;
  copied: boolean;
  onPress: (e: React.PointerEvent) => void;
}

function ShareButton({
  chipColor,
  subtextColor,
  copied,
  onPress,
}: ShareButtonProps) {
  return (
    <motion.button
      type="button"
      onPointerDown={(e) => e.stopPropagation()}
      onPointerUp={onPress}
      whileTap={{ scale: 0.85 }}
      animate={
        copied
          ? { scale: [1, 1.25, 1], transition: { duration: 0.32 } }
          : { scale: 1 }
      }
      aria-label={copied ? '복사됨' : '공유'}
      className="flex h-9 w-9 items-center justify-center rounded-full bg-white/40 backdrop-blur-sm transition-colors hover:bg-white/60"
      style={{ color: copied ? chipColor : subtextColor }}
    >
      {copied ? (
        <svg
          viewBox="0 0 24 24"
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.4}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
      ) : (
        <svg
          viewBox="0 0 24 24"
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.2}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="18" cy="5" r="3" />
          <circle cx="6" cy="12" r="3" />
          <circle cx="18" cy="19" r="3" />
          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
          <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
        </svg>
      )}
    </motion.button>
  );
}
