import { CATEGORY_THEME, CATEGORY_EMOJI } from '../../theme/categoryColors';
import type { TriviaItem } from '../../models/types';

interface Props {
  item: TriviaItem;
  position?: number;
  total?: number;
}

export default function TriviaCard({ item, position, total }: Props) {
  const theme = CATEGORY_THEME[item.category];
  const emoji = CATEGORY_EMOJI[item.category];

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
        {position !== undefined && total !== undefined && (
          <span
            className="text-xs font-medium tabular-nums"
            style={{ color: theme.subtext }}
          >
            {position} / {total}
          </span>
        )}
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
