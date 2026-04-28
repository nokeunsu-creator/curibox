import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { PanInfo } from 'framer-motion';
import type { DeckItem } from '../../models/types';
import { isAdItem } from '../../models/types';
import TriviaCard from '../cards/TriviaCard';
import AdCard from '../cards/AdCard';

interface Props {
  deck: DeckItem[];
  index: number;
  onChangeIndex: (next: number) => void;
  isFavorite?: (id: number) => boolean;
  onToggleFavorite?: (id: number) => void;
}

const SWIPE_OFFSET = 100;
const SWIPE_VELOCITY = 500;

const variants = {
  enter: (direction: number) => ({
    y: direction > 0 ? '100%' : '-100%',
    opacity: 0,
  }),
  center: { y: 0, opacity: 1 },
  exit: (direction: number) => ({
    y: direction > 0 ? '-100%' : '100%',
    opacity: 0,
  }),
};

export default function SwipeDeck({
  deck,
  index,
  onChangeIndex,
  isFavorite,
  onToggleFavorite,
}: Props) {
  const [direction, setDirection] = useState(1);
  const item = deck[index];

  const goNext = () => {
    if (index >= deck.length - 1) return;
    setDirection(1);
    onChangeIndex(index + 1);
  };

  const goPrev = () => {
    if (index <= 0) return;
    setDirection(-1);
    onChangeIndex(index - 1);
  };

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    const { offset, velocity } = info;
    if (offset.y < -SWIPE_OFFSET || velocity.y < -SWIPE_VELOCITY) {
      goNext();
    } else if (offset.y > SWIPE_OFFSET || velocity.y > SWIPE_VELOCITY) {
      goPrev();
    }
  };

  if (!item) return null;

  return (
    <div className="relative h-full w-full overflow-hidden">
      <AnimatePresence custom={direction} initial={false} mode="popLayout">
        <motion.div
          key={index}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            y: { type: 'spring', stiffness: 320, damping: 32 },
            opacity: { duration: 0.18 },
          }}
          drag="y"
          dragConstraints={{ top: 0, bottom: 0 }}
          dragElastic={0.4}
          onDragEnd={handleDragEnd}
          className="absolute inset-0 cursor-grab touch-none active:cursor-grabbing"
        >
          {isAdItem(item) ? (
            <AdCard item={item} />
          ) : (
            <TriviaCard
              item={item}
              position={index + 1}
              total={deck.length}
              isFavorite={isFavorite?.(item.id)}
              onToggleFavorite={onToggleFavorite}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
