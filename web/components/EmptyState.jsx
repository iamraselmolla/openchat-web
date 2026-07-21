export function EmptyState({ icon: Icon, title, description }) {
  return (
    <div className="flex h-full flex-col items-center justify-center px-6 text-center">
      {Icon && <Icon size={28} className="mb-3 text-ink-soft" strokeWidth={1.5} />}
      <p className="font-display text-lg text-ink">{title}</p>
      {description && <p className="mt-1 max-w-xs text-sm text-ink-soft">{description}</p>}
    </div>
  );
}
