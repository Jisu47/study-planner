import { Card } from "@/components/ui/card";

export function MetricCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <Card className="space-y-2">
      <p className="text-sm font-medium text-[var(--muted)]">{label}</p>
      <p className="text-2xl font-extrabold text-[var(--foreground)]">{value}</p>
      <p className="text-xs text-[var(--muted)]">{hint}</p>
    </Card>
  );
}

