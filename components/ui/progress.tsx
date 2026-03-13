import { cn } from "@/lib/utils";

export function Progress({
  value,
  className,
}: {
  value: number;
  className?: string;
}) {
  return (
    <div className={cn("h-2.5 w-full rounded-full bg-[var(--surface-alt)]", className)}>
      <div
        className="h-full rounded-full bg-[var(--primary)] transition-all"
        style={{ width: `${Math.max(4, Math.min(100, value))}%` }}
      />
    </div>
  );
}

