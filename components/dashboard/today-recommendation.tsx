import { differenceInCalendarDays, parseISO, startOfDay } from "date-fns";
import { Card } from "@/components/ui/card";
import { formatDateLabel, formatMinutes } from "@/lib/utils";
import type { RecommendationItem, Subject, StudyPlanItem } from "@/types";

export function TodayRecommendation({
  recommendations,
  subjects,
  todayPlans,
}: {
  recommendations: RecommendationItem[];
  subjects: Subject[];
  todayPlans: Array<StudyPlanItem & { subject?: Subject }>;
}) {
  const today = startOfDay(new Date());
  const upcomingSubjects = [...subjects]
    .sort((left, right) => left.examDate.localeCompare(right.examDate))
    .slice(0, 3);

  return (
    <div className="grid gap-4">
      <Card className="space-y-4">
        <div>
          <p className="text-sm font-semibold text-[var(--muted)]">오늘 추천 과목</p>
          <h2 className="mt-1 text-xl font-bold text-[var(--foreground)]">우선순위 기반 추천</h2>
        </div>
        <div className="space-y-3">
          {recommendations.length ? (
            recommendations.map((item, index) => (
              <div key={item.subjectId} className="rounded-2xl bg-[var(--surface-alt)] px-4 py-3">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-[var(--foreground)]">
                      {index + 1}. {item.subjectName}
                    </p>
                    <p className="mt-1 text-xs leading-5 text-[var(--muted)]">{item.reason}</p>
                  </div>
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-[var(--primary)]">
                    {item.score.toFixed(0)}점
                  </span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-[var(--muted)]">추천할 과목이 아직 없습니다.</p>
          )}
        </div>
      </Card>

      <Card className="space-y-4">
        <div>
          <p className="text-sm font-semibold text-[var(--muted)]">다가오는 시험</p>
          <h2 className="mt-1 text-xl font-bold text-[var(--foreground)]">시험 일정 요약</h2>
        </div>
        <div className="space-y-3">
          {upcomingSubjects.map((subject) => {
            const dDay = differenceInCalendarDays(parseISO(subject.examDate), today);

            return (
              <div key={subject.id} className="flex items-center justify-between rounded-2xl bg-[var(--surface-alt)] px-4 py-3">
                <div className="flex items-center gap-3">
                  <span className="h-3 w-3 rounded-full" style={{ backgroundColor: subject.color }} />
                  <div>
                    <p className="text-sm font-semibold text-[var(--foreground)]">{subject.name}</p>
                    <p className="text-xs text-[var(--muted)]">시험일 {formatDateLabel(subject.examDate, "M월 d일 (E)")}</p>
                  </div>
                </div>
                <span className="text-sm font-bold text-[var(--primary)]">D-{dDay}</span>
              </div>
            );
          })}
        </div>
      </Card>

      <Card className="space-y-4">
        <div>
          <p className="text-sm font-semibold text-[var(--muted)]">오늘 계획</p>
          <h2 className="mt-1 text-xl font-bold text-[var(--foreground)]">바로 실행할 순서</h2>
        </div>
        <div className="space-y-3">
          {todayPlans.length ? (
            todayPlans.map((plan) => (
              <div key={plan.id} className="flex items-center justify-between rounded-2xl border border-[var(--line)] bg-white px-4 py-3">
                <div>
                  <p className="text-sm font-semibold text-[var(--foreground)]">{plan.subject?.name ?? "과목"}</p>
                  <p className="mt-1 text-xs text-[var(--muted)]">추천 학습량 {formatMinutes(plan.plannedMinutes)}</p>
                </div>
                <span className="rounded-full bg-[var(--primary-soft)] px-3 py-1 text-xs font-semibold text-[var(--primary)]">
                  우선순위 {plan.priorityScore.toFixed(0)}
                </span>
              </div>
            ))
          ) : (
            <p className="text-sm text-[var(--muted)]">오늘 생성된 계획이 없습니다.</p>
          )}
        </div>
      </Card>
    </div>
  );
}

