import {
  addDays,
  differenceInCalendarDays,
  endOfDay,
  formatISO,
  isAfter,
  isWithinInterval,
  parseISO,
  startOfDay,
} from "date-fns";
import { PLAN_HORIZON_DAYS } from "@/lib/constants";
import { clamp, createId, hoursToMinutes } from "@/lib/utils";
import type {
  DailyPlanGroup,
  PrioritizedSubject,
  PriorityContext,
  StudyLog,
  StudyPlanItem,
  Subject,
  SubjectProgress,
  UserProfile,
} from "@/types";

function toDateOnly(date: Date) {
  return formatISO(startOfDay(date), { representation: "date" });
}

function sumLogMinutes(logs: StudyLog[], subjectId: string, dateRange?: { start: Date; end: Date }) {
  return logs
    .filter((log) => {
      if (log.subjectId !== subjectId) {
        return false;
      }

      if (!dateRange) {
        return true;
      }

      const logDate = parseISO(log.date);
      return isWithinInterval(logDate, dateRange);
    })
    .reduce((total, log) => total + log.minutes, 0);
}

function sumPlannedMinutes(plans: StudyPlanItem[], subjectId: string) {
  return plans
    .filter((plan) => plan.subjectId === subjectId && plan.status !== "missed")
    .reduce((total, plan) => total + plan.plannedMinutes, 0);
}

export function getSubjectProgress(
  subject: Subject,
  logs: StudyLog[],
  plans: StudyPlanItem[],
  referenceDate = new Date(),
): SubjectProgress {
  const today = startOfDay(referenceDate);
  const actualMinutes = sumLogMinutes(logs, subject.id);
  const plannedMinutes = sumPlannedMinutes(plans, subject.id);
  const recentMinutes = sumLogMinutes(logs, subject.id, {
    start: addDays(today, -6),
    end: endOfDay(today),
  });
  const targetMinutes = hoursToMinutes(subject.targetStudyHours);
  const remainingMinutes = Math.max(0, targetMinutes - actualMinutes);
  const completionRate = targetMinutes === 0 ? 1 : clamp(actualMinutes / targetMinutes, 0, 1);

  return {
    subjectId: subject.id,
    actualMinutes,
    plannedMinutes,
    remainingMinutes,
    recentMinutes,
    completionRate,
  };
}

export function calculatePriorityScore(subject: Subject, context: PriorityContext) {
  const daysUntilExam = differenceInCalendarDays(
    startOfDay(parseISO(subject.examDate)),
    startOfDay(parseISO(context.referenceDate)),
  );
  const examUrgency = daysUntilExam <= 0 ? 120 : clamp(28 - daysUntilExam, 0, 28) * 3;
  const remainingStudyNeed = context.remainingMinutes / 30;
  const importanceWeight = subject.importance * 8;
  const difficultyWeight = subject.difficulty * 6;
  const recentStudyPenalty = (context.recentMinutes / 60) * 4;
  const plannedPenalty = (context.plannedMinutes / 60) * 1.5;

  return Number(
    (
      examUrgency +
      remainingStudyNeed +
      importanceWeight +
      difficultyWeight -
      recentStudyPenalty -
      plannedPenalty
    ).toFixed(2),
  );
}

export function rankSubjects(
  subjects: Subject[],
  logs: StudyLog[],
  plans: StudyPlanItem[],
  referenceDate = new Date(),
): PrioritizedSubject[] {
  const referenceDateOnly = toDateOnly(referenceDate);

  return subjects
    .map((subject) => {
      const progress = getSubjectProgress(subject, logs, plans, referenceDate);
      const priorityScore = calculatePriorityScore(subject, {
        referenceDate: referenceDateOnly,
        actualMinutes: progress.actualMinutes,
        plannedMinutes: progress.plannedMinutes,
        remainingMinutes: progress.remainingMinutes,
        recentMinutes: progress.recentMinutes,
      });

      return {
        ...progress,
        subject,
        priorityScore,
        daysUntilExam: differenceInCalendarDays(
          startOfDay(parseISO(subject.examDate)),
          startOfDay(referenceDate),
        ),
      };
    })
    .sort((left, right) => right.priorityScore - left.priorityScore);
}

export function generateStudyPlan({
  profile,
  subjects,
  logs,
  startDate = new Date(),
  days = PLAN_HORIZON_DAYS,
}: {
  profile: UserProfile;
  subjects: Subject[];
  logs: StudyLog[];
  startDate?: Date;
  days?: number;
}) {
  const today = startOfDay(startDate);
  const dailyCapacity = hoursToMinutes(profile.dailyStudyHours);

  if (!subjects.length || dailyCapacity <= 0) {
    return [] as StudyPlanItem[];
  }

  const subjectState = new Map(
    subjects.map((subject) => {
      const progress = getSubjectProgress(subject, logs, [], today);
      return [
        subject.id,
        {
          subject,
          recentMinutes: progress.recentMinutes,
          actualMinutes: progress.actualMinutes,
          plannedMinutes: 0,
          remainingMinutes: progress.remainingMinutes,
        },
      ];
    }),
  );

  const planMap = new Map<string, StudyPlanItem>();

  for (let dayOffset = 0; dayOffset < days; dayOffset += 1) {
    const currentDate = addDays(today, dayOffset);
    let remainingDailyMinutes = dailyCapacity;

    while (remainingDailyMinutes >= 15) {
      const prioritized = subjects
        .filter((subject) => {
          const examDate = startOfDay(parseISO(subject.examDate));
          const currentState = subjectState.get(subject.id);
          return Boolean(currentState && currentState.remainingMinutes > 0 && !isAfter(currentDate, examDate));
        })
        .map((subject) => {
          const currentState = subjectState.get(subject.id)!;
          const priorityScore = calculatePriorityScore(subject, {
            referenceDate: toDateOnly(currentDate),
            actualMinutes: currentState.actualMinutes,
            plannedMinutes: currentState.plannedMinutes,
            remainingMinutes: currentState.remainingMinutes,
            recentMinutes: currentState.recentMinutes,
          });

          return {
            subject,
            priorityScore,
          };
        })
        .sort((left, right) => right.priorityScore - left.priorityScore);

      if (!prioritized.length) {
        break;
      }

      let allocatedInCycle = false;

      for (const rankedSubject of prioritized) {
        if (remainingDailyMinutes < 15) {
          break;
        }

        const currentState = subjectState.get(rankedSubject.subject.id);
        if (!currentState || currentState.remainingMinutes <= 0) {
          continue;
        }

        const preferredChunk =
          remainingDailyMinutes >= 60 && currentState.remainingMinutes >= 60 ? 60 : 30;
        const allocatedMinutes = Math.min(
          currentState.remainingMinutes,
          remainingDailyMinutes,
          preferredChunk,
        );

        if (allocatedMinutes < 15) {
          continue;
        }

        const key = `${toDateOnly(currentDate)}_${rankedSubject.subject.id}`;
        const existing = planMap.get(key);

        if (existing) {
          existing.plannedMinutes += allocatedMinutes;
          existing.priorityScore = Math.max(existing.priorityScore, rankedSubject.priorityScore);
        } else {
          planMap.set(key, {
            id: createId("plan"),
            subjectId: rankedSubject.subject.id,
            date: toDateOnly(currentDate),
            plannedMinutes: allocatedMinutes,
            status: "planned",
            priorityScore: rankedSubject.priorityScore,
            source: "auto",
          });
        }

        currentState.remainingMinutes -= allocatedMinutes;
        currentState.plannedMinutes += allocatedMinutes;
        remainingDailyMinutes -= allocatedMinutes;
        allocatedInCycle = true;
      }

      if (!allocatedInCycle) {
        break;
      }
    }
  }

  return Array.from(planMap.values()).sort((left, right) =>
    left.date === right.date
      ? right.priorityScore - left.priorityScore
      : left.date.localeCompare(right.date),
  );
}

export function mergePlansByDate(
  plans: StudyPlanItem[],
  subjects: Subject[],
): DailyPlanGroup[] {
  const subjectMap = new Map(subjects.map((subject) => [subject.id, subject]));
  const dateMap = new Map<string, DailyPlanGroup>();

  for (const plan of plans) {
    const subject = subjectMap.get(plan.subjectId);
    if (!subject) {
      continue;
    }

    const existing = dateMap.get(plan.date);

    if (existing) {
      existing.totalMinutes += plan.plannedMinutes;
      existing.items.push({ ...plan, subject });
      continue;
    }

    dateMap.set(plan.date, {
      date: plan.date,
      totalMinutes: plan.plannedMinutes,
      items: [{ ...plan, subject }],
    });
  }

  return Array.from(dateMap.values())
    .map((group) => ({
      ...group,
      items: group.items.sort((left, right) => right.priorityScore - left.priorityScore),
    }))
    .sort((left, right) => left.date.localeCompare(right.date));
}

export function rescheduleIncompletePlans({
  profile,
  subjects,
  plans,
  startDate = new Date(),
}: {
  profile: UserProfile;
  subjects: Subject[];
  plans: StudyPlanItem[];
  startDate?: Date;
}) {
  const today = startOfDay(startDate);
  const todayString = toDateOnly(today);
  const dailyCapacity = hoursToMinutes(profile.dailyStudyHours);
  const subjectMap = new Map(subjects.map((subject) => [subject.id, subject]));

  const carryTargets = plans
    .filter((plan) => plan.date < todayString && plan.status !== "completed")
    .sort((left, right) => right.priorityScore - left.priorityScore);

  if (!carryTargets.length) {
    return plans;
  }

  const updatedPlans = plans.map((plan) =>
    plan.date < todayString && plan.status !== "completed"
      ? { ...plan, status: "missed" as const }
      : plan,
  );

  const occupancy = new Map<string, number>();

  for (const plan of updatedPlans) {
    if (plan.date < todayString || plan.status === "missed") {
      continue;
    }

    occupancy.set(plan.date, (occupancy.get(plan.date) ?? 0) + plan.plannedMinutes);
  }

  const newPlans: StudyPlanItem[] = [];

  for (const carriedPlan of carryTargets) {
    let remainingMinutes = carriedPlan.plannedMinutes;
    let offset = 0;
    const subject = subjectMap.get(carriedPlan.subjectId);

    if (!subject) {
      continue;
    }

    while (remainingMinutes > 0 && offset < PLAN_HORIZON_DAYS + 7) {
      const targetDate = addDays(today, offset);
      const targetDateString = toDateOnly(targetDate);
      const examDate = startOfDay(parseISO(subject.examDate));

      if (isAfter(targetDate, examDate)) {
        break;
      }

      const usedMinutes = occupancy.get(targetDateString) ?? 0;
      const availableMinutes = Math.max(0, dailyCapacity - usedMinutes);

      if (availableMinutes < 15) {
        offset += 1;
        continue;
      }

      const allocatedMinutes = Math.min(remainingMinutes, availableMinutes, availableMinutes >= 60 ? 60 : 30);

      if (allocatedMinutes < 15) {
        offset += 1;
        continue;
      }

      const existing = newPlans.find(
        (plan) => plan.date === targetDateString && plan.subjectId === carriedPlan.subjectId,
      );

      if (existing) {
        existing.plannedMinutes += allocatedMinutes;
      } else {
        newPlans.push({
          id: createId("plan"),
          subjectId: carriedPlan.subjectId,
          date: targetDateString,
          plannedMinutes: allocatedMinutes,
          status: "planned",
          priorityScore: carriedPlan.priorityScore + 5,
          source: "rescheduled",
        });
      }

      occupancy.set(targetDateString, usedMinutes + allocatedMinutes);
      remainingMinutes -= allocatedMinutes;

      if (occupancy.get(targetDateString)! >= dailyCapacity) {
        offset += 1;
      }
    }
  }

  return [...updatedPlans, ...newPlans].sort((left, right) =>
    left.date === right.date
      ? right.priorityScore - left.priorityScore
      : left.date.localeCompare(right.date),
  );
}

