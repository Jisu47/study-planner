import { isSameDay, parseISO, startOfDay } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatDateLabel, formatMinutes } from "@/lib/utils";
import type { DailyPlanGroup } from "@/types";

export function PlanBoard({
  groups,
  onToggle,
}: {
  groups: DailyPlanGroup[];
  onToggle: (planId: string) => void;
}) {
  const today = startOfDay(new Date());

  return (
    <div className="grid gap-4">
      {groups.map((group) => {
        const isToday = isSameDay(parseISO(group.date), today);

        return (
          <Card key={group.date} className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-[var(--muted)]">
                  {isToday ? "오늘" : "계획"}
                </p>
                <h2 className="mt-1 text-xl font-bold text-[var(--foreground)]">
                  {formatDateLabel(group.date, "M월 d일 (E)")}
                </h2>
              </div>
              <span className="rounded-full bg-[var(--surface-alt)] px-3 py-1 text-xs font-semibold text-[var(--foreground)]">
                총 {formatMinutes(group.totalMinutes)}
              </span>
            </div>

            <div className="space-y-3">
              {group.items.map((plan) => (
                <div
                  key={plan.id}
                  className="rounded-2xl border border-[var(--line)] bg-white px-4 py-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <span className="mt-1 h-3 w-3 rounded-full" style={{ backgroundColor: plan.subject.color }} />
                      <div>
                        <p className="text-sm font-semibold text-[var(--foreground)]">{plan.subject.name}</p>
                        <p className="mt-1 text-xs text-[var(--muted)]">
                          추천 학습량 {formatMinutes(plan.plannedMinutes)} · 우선순위 {plan.priorityScore.toFixed(0)}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        plan.status === "completed"
                          ? "bg-[rgba(13,159,154,0.14)] text-[var(--accent)]"
                          : plan.status === "missed"
                            ? "bg-[rgba(217,72,95,0.12)] text-[var(--danger)]"
                            : "bg-[var(--primary-soft)] text-[var(--primary)]"
                      }`}
                    >
                      {plan.status === "completed"
                        ? "완료"
                        : plan.status === "missed"
                          ? "미완료"
                          : plan.source === "rescheduled"
                            ? "재배치"
                            : "예정"}
                    </span>
                  </div>
                  <Button variant="ghost" className="mt-3 w-full" onClick={() => onToggle(plan.id)}>
                    {plan.status === "completed" ? "완료 해제" : "완료로 체크"}
                  </Button>
                </div>
              ))}
            </div>
          </Card>
        );
      })}
    </div>
  );
}

