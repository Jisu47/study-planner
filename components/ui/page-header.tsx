export function PageHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <header className="space-y-2 px-1">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--primary)]">
        {eyebrow}
      </p>
      <div className="space-y-1">
        <h1 className="text-[1.75rem] font-extrabold text-[var(--foreground)]">
          {title}
        </h1>
        <p className="text-sm leading-6 text-[var(--muted)]">{description}</p>
      </div>
    </header>
  );
}

