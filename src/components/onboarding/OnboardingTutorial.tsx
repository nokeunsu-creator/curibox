import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { PanInfo } from 'framer-motion';

interface Slide {
  emoji: string;
  title: string;
  body: string;
  bg: string;
}

const SLIDES: Slide[] = [
  {
    emoji: '📦',
    title: '호기심상자에 오신 걸 환영해요',
    body: '우주, 인체, 역사, 동물, 자연, 과학, 문화\n7가지 카테고리의 흥미로운 사실을\n무한 스와이프로 만나보세요.',
    bg: 'linear-gradient(160deg, #7C5BD9 0%, #5240A8 100%)',
  },
  {
    emoji: '👆',
    title: '위/아래로 스와이프',
    body: '카드를 위로 밀면 다음 카드,\n아래로 밀면 이전 카드로 이동해요.\n탭한 위치는 자동으로 저장됩니다.',
    bg: 'linear-gradient(160deg, #2D7FA8 0%, #1A5878 100%)',
  },
  {
    emoji: '❤️',
    title: '마음에 드는 사실은 저장',
    body: '카드 우상단의 하트 버튼으로 저장하면\n언제든 다시 꺼내볼 수 있어요.\n상단 하트 배지로 한 번에 모아 보기.',
    bg: 'linear-gradient(160deg, #E55A82 0%, #B8345C 100%)',
  },
  {
    emoji: '⚙️',
    title: '내 취향대로 골라보기',
    body: '우상단 설정에서 보고 싶은\n카테고리만 선택할 수 있어요.\n진행도와 즐겨찾기도 초기화 가능.',
    bg: 'linear-gradient(160deg, #3D9962 0%, #1F6E3D 100%)',
  },
];

interface Props {
  onClose: () => void;
}

const SWIPE_OFFSET = 80;
const SWIPE_VELOCITY = 400;

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? '60%' : '-60%',
    opacity: 0,
  }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({
    x: direction > 0 ? '-60%' : '60%',
    opacity: 0,
  }),
};

export default function OnboardingTutorial({ onClose }: Props) {
  const [idx, setIdx] = useState(0);
  const [direction, setDirection] = useState(1);
  const slide = SLIDES[idx];
  const isLast = idx === SLIDES.length - 1;

  const goNext = () => {
    if (isLast) {
      onClose();
      return;
    }
    setDirection(1);
    setIdx((i) => i + 1);
  };

  const goPrev = () => {
    if (idx <= 0) return;
    setDirection(-1);
    setIdx((i) => i - 1);
  };

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -SWIPE_OFFSET || info.velocity.x < -SWIPE_VELOCITY) {
      goNext();
    } else if (
      info.offset.x > SWIPE_OFFSET ||
      info.velocity.x > SWIPE_VELOCITY
    ) {
      goPrev();
    }
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex flex-col text-white"
      style={{ background: slide.bg, transition: 'background 0.4s ease' }}
    >
      <div className="flex justify-end px-5 pt-5">
        {!isLast && (
          <button
            type="button"
            onClick={onClose}
            className="rounded-full bg-white/15 px-4 py-1.5 text-xs font-medium text-white/90 backdrop-blur-sm hover:bg-white/25"
          >
            건너뛰기
          </button>
        )}
      </div>

      <div className="relative flex flex-1 items-center justify-center overflow-hidden">
        <AnimatePresence custom={direction} initial={false} mode="wait">
          <motion.div
            key={idx}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: 'spring', stiffness: 320, damping: 32 },
              opacity: { duration: 0.18 },
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.4}
            onDragEnd={handleDragEnd}
            className="flex w-full max-w-md flex-col items-center px-8 text-center"
          >
            <div className="mb-8 text-8xl drop-shadow-md">{slide.emoji}</div>
            <h2 className="mb-5 text-2xl font-extrabold leading-tight">
              {slide.title}
            </h2>
            <p className="whitespace-pre-line text-base leading-relaxed text-white/85">
              {slide.body}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex flex-col items-center gap-6 px-6 pb-8">
        <div className="flex gap-2">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => {
                setDirection(i > idx ? 1 : -1);
                setIdx(i);
              }}
              aria-label={`${i + 1}번째 슬라이드`}
              className="h-2 rounded-full transition-all"
              style={{
                width: i === idx ? '24px' : '8px',
                background:
                  i === idx ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.4)',
              }}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={goNext}
          className="w-full max-w-xs rounded-full bg-white px-6 py-3.5 text-base font-bold text-neutral-900 shadow-lg transition-transform active:scale-95"
        >
          {isLast ? '시작하기' : '다음'}
        </button>
      </div>
    </div>
  );
}
