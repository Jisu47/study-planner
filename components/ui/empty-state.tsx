import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function EmptyState({
  title,
  description,
  actionLabel,
  actionHref,
}: {
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
}) {
  return (
    <Card className="text-center">
      <div className="space-y-2">
        <p className="text-lg font-bold text-[var(--foreground)]">{title}</p>
        <p className="text-sm leading-6 text-[var(--muted)]">{description}</p>
      </div>
      {actionLabel && actionHref ? (
        <Link href={actionHref} className="mt-4 block">
          <Button className="w-full">{actionLabel}</Button>
        </Link>
      ) : null}
    </Card>
  );
}

