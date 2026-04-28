interface Props {
  emoji: string;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export default function EmptyState({
  emoji,
  title,
  description,
  actionLabel,
  onAction,
}: Props) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center rounded-3xl bg-white p-8 text-center shadow-sm">
      <div className="mb-4 text-6xl">{emoji}</div>
      <h2 className="mb-2 text-lg font-bold text-neutral-800">{title}</h2>
      {description && (
        <p className="text-sm text-neutral-500 leading-relaxed">{description}</p>
      )}
      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="mt-6 rounded-full bg-violet-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition-colors hover:bg-violet-700"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
