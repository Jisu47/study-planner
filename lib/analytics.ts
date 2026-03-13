import { addDays, endOfDay, format, isWithinInterval, parseISO, startOfDay } from "date-fns";
import { TIME_BUCKETS } from "@/lib/constants";
import { calculatePriorityScore, getSubjectProgress } from "@/lib/planner";
import { clamp, formatMinutes, hoursToMinutes } from "@/lib/utils";
import type {
  AnalyticsSummary,
  AppData,
  RecommendationItem,
  StudyLog,
  StudyPlanItem,
  Subject,
} from "@/types";

function getDateKey(date: Date) {
  return format(date, "yyyy-MM-dd");
}

function sumLogMinutes(logs: StudyLog[]) {
  return logs.reduce((total, log) => total + log.minutes, 0);
}

function getRecommendationReason(
  subject: Subject,
  remainingMinutes: number,
  daysUntilExam: number,
  missedMinutes: number,
) {
  if (missedMinutes > 0) {
    return `미완료 ${formatMinutes(missedMinutes)}가 남아 있어요`;
  }

  if (daysUntilExam <= 3) {
    return "시험이 임박해 우선 확보가 필요해요";
  }

  if (remainingMinutes >= 180) {
    return "목표 대비 부족 시간이 커요";
  }

  return `${subject.importance}점 중요도와 ${subject.difficulty}점 난이도를 반영했어요`;
}

export function getRecommendedSubjects({
  subjects,
  logs,
  plans,
  referenceDate = new Date(),
}: {
  subjects: Subject[];
  logs: StudyLog[];
  plans: StudyPlanItem[];
  referenceDate?: Date;
}) {
  const today = startOfDay(referenceDate);
  const todayKey = getDateKey(today);

  return subjects
    .map((subject) => {
      const progress = getSubjectProgress(subject, logs, plans, today);
      const missedMinutes = plans
        .filter((plan) => plan.subjectId === subject.id && plan.date < todayKey && plan.status !== "completed")
        .reduce((total, plan) => total + plan.plannedMinutes, 0);

      const score =
        calculatePriorityScore(subject, {
          referenceDate: todayKey,
          actualMinutes: progress.actualMinutes,
          plannedMinutes: progress.plannedMinutes,
          remainingMinutes: progress.remainingMinutes,
          recentMinutes: progress.recentMinutes,
        }) + missedMinutes / 20;

      return {
        subjectId: subject.id,
        subjectName: subject.name,
        score,
        reason: getRecommendationReason(
          subject,
          progress.remainingMinutes,
          Math.max(0, Math.ceil((parseISO(subject.examDate).getTime() - today.getTime()) / 86400000)),
          missedMinutes,
        ),
      } satisfies RecommendationItem;
    })
    .sort((left, right) => right.score - left.score)
    .slice(0, 3);
}

export function buildAnalytics({
  subjects,
  logs,
  plans,
  referenceDate = new Date(),
}: Omit<AppData, "profile" | "lastGeneratedAt"> & { referenceDate?: Date }): AnalyticsSummary {
  const today = startOfDay(referenceDate);
  const totalStudiedMinutes = sumLogMinutes(logs);

  const subjectTotals = subjects.map((subject) => {
    const studiedMinutes = logs
      .filter((log) => log.subjectId === subject.id)
      .reduce((total, log) => total + log.minutes, 0);
    const targetMinutes = hoursToMinutes(subject.targetStudyHours);

    return {
      subjectId: subject.id,
      subjectName: subject.name,
      subjectColor: subject.color,
      studiedMinutes,
      targetMinutes,
      completionRate: targetMinutes === 0 ? 1 : clamp(studiedMinutes / targetMinutes, 0, 1),
    };
  });

  const weeklyTrend = Array.from({ length: 7 }, (_, index) => {
    const currentDate = addDays(today, index - 6);
    const currentKey = getDateKey(currentDate);
    const minutes = logs
      .filter((log) => log.date === currentKey)
      .reduce((total, log) => total + log.minutes, 0);

    return {
      date: currentKey,
      label: format(currentDate, "M/d"),
      minutes,
    };
  });

  const focusPattern = TIME_BUCKETS.map((bucket) => ({
    bucket: bucket.key,
    label: bucket.label,
    minutes: logs
      .filter((log) => log.startHour >= bucket.startHour && log.startHour < bucket.endHour)
      .reduce((total, log) => total + log.minutes, 0),
  }));

  const relevantPlans = plans.filter((plan) =>
    isWithinInterval(parseISO(plan.date), {
      start: addDays(today, -14),
      end: endOfDay(today),
    }),
  );
  const plannedMinutes = relevantPlans.reduce((total, plan) => total + plan.plannedMinutes, 0);
  const completedMinutes = relevantPlans
    .filter((plan) => plan.status === "completed")
    .reduce((total, plan) => total + plan.plannedMinutes, 0);

  return {
    subjectTotals,
    weeklyTrend,
    focusPattern,
    planCompletionRate: plannedMinutes === 0 ? 0 : clamp(completedMinutes / plannedMinutes, 0, 1),
    totalStudiedMinutes,
    todayRecommended: getRecommendedSubjects({ subjects, logs, plans, referenceDate }),
  };
}

