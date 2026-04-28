import type { AdItem } from '../../models/types';

interface Props {
  item: AdItem;
}

export default function AdCard({ item }: Props) {
  return (
    <div
      className="relative flex h-full w-full flex-col justify-between overflow-hidden rounded-3xl px-7 py-9 shadow-xl"
      style={{
        background:
          'linear-gradient(160deg, #2A2A35 0%, #1A1A22 100%)',
        color: '#F5F5F7',
      }}
    >
      <div className="flex items-center justify-between">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-xs font-bold text-white/80">
          <span>📣</span>
          <span>광고</span>
        </span>
        <span className="text-xs font-medium tabular-nums text-white/40">
          {item.id}
        </span>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center text-center">
        <div className="mb-6 text-6xl">✨</div>
        <h2 className="mb-3 text-2xl font-extrabold leading-tight">
          잠시 광고를 보고
          <br />
          호기심을 응원해 주세요
        </h2>
        <p className="text-sm leading-relaxed text-white/60">
          광고 수익은 더 많은 잡학 콘텐츠
          <br />
          제작에 사용됩니다.
        </p>
      </div>

      <div className="flex justify-center">
        <div className="rounded-full bg-white/10 px-6 py-3 text-sm font-medium text-white/70">
          AdSlot · 실 광고 연동 예정
        </div>
      </div>
    </div>
  );
}
