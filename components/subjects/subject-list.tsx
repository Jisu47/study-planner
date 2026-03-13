import { differenceInCalendarDays, parseISO, startOfDay } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { formatDateLabel, formatMinutes, toPercentage } from "@/lib/utils";
import type { Subject, SubjectAnalyticsItem } from "@/types";

export function SubjectList({
  subjects,
  analytics,
  onEdit,
  onDelete,
}: {
  subjects: Subject[];
  analytics: SubjectAnalyticsItem[];
  onEdit: (subject: Subject) => void;
  onDelete: (subjectId: string) => void;
}) {
  const today = startOfDay(new Date());
  const analyticsMap = new Map(analytics.map((item) => [item.subjectId, item]));

  return (
    <div className="grid gap-3">
      {subjects.map((subject) => {
        const item = analyticsMap.get(subject.id);
        const dDay = differenceInCalendarDays(parseISO(subject.examDate), today);

        return (
          <Card key={subject.id} className="space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <span className="mt-1 h-3 w-3 rounded-full" style={{ backgroundColor: subject.color }} />
                <div>
                  <p className="text-base font-bold text-[var(--foreground)]">{subject.name}</p>
                  <p className="mt-1 text-xs text-[var(--muted)]">
                    시험일 {formatDateLabel(subject.examDate, "M월 d일")} · D-{dDay}
                  </p>
                </div>
              </div>
              <span className="rounded-full bg-[var(--primary-soft)] px-3 py-1 text-xs font-semibold text-[var(--primary)]">
                목표 {subject.targetStudyHours}시간
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 rounded-2xl bg-[var(--surface-alt)] p-3 text-center text-xs">
              <div>
                <p className="text-[var(--muted)]">중요도</p>
                <p className="mt-1 font-bold text-[var(--foreground)]">{subject.importance}점</p>
              </div>
              <div>
                <p className="text-[var(--muted)]">난이도</p>
                <p className="mt-1 font-bold text-[var(--foreground)]">{subject.difficulty}점</p>
              </div>
              <div>
                <p className="text-[var(--muted)]">누적 시간</p>
                <p className="mt-1 font-bold text-[var(--foreground)]">
                  {item ? formatMinutes(item.studiedMinutes) : "0분"}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-[var(--muted)]">
                <span>목표 대비 달성률</span>
                <span>{item ? `${toPercentage(item.completionRate)}%` : "0%"}</span>
              </div>
              <Progress value={item ? toPercentage(item.completionRate) : 0} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button variant="secondary" className="w-full" onClick={() => onEdit(subject)}>
                수정
              </Button>
              <Button variant="danger" className="w-full" onClick={() => onDelete(subject.id)}>
                삭제
              </Button>
            </div>
          </Card>
        );
      })}
    </div>
  );
}

