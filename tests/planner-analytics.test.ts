import { describe, expect, it } from "vitest";
import { buildAnalytics } from "@/lib/analytics";
import {
  calculatePriorityScore,
  generateStudyPlan,
  mergePlansByDate,
  rescheduleIncompletePlans,
} from "@/lib/planner";
import type { StudyLog, StudyPlanItem, Subject, UserProfile } from "@/types";

const profile: UserProfile = {
  nickname: "테스터",
  dailyStudyHours: 4,
  createdAt: "2026-03-13T00:00:00.000Z",
};

const subjects: Subject[] = [
  {
    id: "algo",
    name: "알고리즘",
    examDate: "2026-03-15",
    targetStudyHours: 10,
    importance: 5,
    difficulty: 4,
    color: "#0F5BD7",
    createdAt: "2026-03-13T00:00:00.000Z",
    updatedAt: "2026-03-13T00:00:00.000Z",
  },
  {
    id: "db",
    name: "데이터베이스",
    examDate: "2026-03-25",
    targetStudyHours: 10,
    importance: 5,
    difficulty: 4,
    color: "#0D9F9A",
    createdAt: "2026-03-13T00:00:00.000Z",
    updatedAt: "2026-03-13T00:00:00.000Z",
  },
];

const logs: StudyLog[] = [
  {
    id: "log_1",
    subjectId: "algo",
    date: "2026-03-12",
    minutes: 90,
    startHour: 20,
    memo: "기출 풀이",
  },
  {
    id: "log_2",
    subjectId: "db",
    date: "2026-03-11",
    minutes: 60,
    startHour: 9,
    memo: "개념 복습",
  },
];

describe("planner utilities", () => {
  it("시험일이 더 가까운 과목에 더 높은 우선순위를 부여한다", () => {
    const nearScore = calculatePriorityScore(subjects[0], {
      referenceDate: "2026-03-13",
      actualMinutes: 0,
      plannedMinutes: 0,
      remainingMinutes: 300,
      recentMinutes: 0,
    });
    const farScore = calculatePriorityScore(subjects[1], {
      referenceDate: "2026-03-13",
      actualMinutes: 0,
      plannedMinutes: 0,
      remainingMinutes: 300,
      recentMinutes: 0,
    });

    expect(nearScore).toBeGreaterThan(farScore);
  });

  it("일별 계획 총량이 하루 공부 가능 시간을 초과하지 않는다", () => {
    const plans = generateStudyPlan({
      profile,
      subjects,
      logs: [],
      startDate: new Date("2026-03-13T00:00:00.000Z"),
      days: 3,
    });

    const groups = mergePlansByDate(plans, subjects);

    expect(groups.length).toBeGreaterThan(0);
    groups.forEach((group) => {
      expect(group.totalMinutes).toBeLessThanOrEqual(240);
    });
  });

  it("미완료 계획을 이후 날짜로 재배치한다", () => {
    const plans: StudyPlanItem[] = [
      {
        id: "plan_old",
        subjectId: "algo",
        date: "2026-03-12",
        plannedMinutes: 120,
        status: "planned",
        priorityScore: 100,
        source: "auto",
      },
      {
        id: "plan_today",
        subjectId: "db",
        date: "2026-03-13",
        plannedMinutes: 180,
        status: "planned",
        priorityScore: 80,
        source: "auto",
      },
    ];

    const rescheduled = rescheduleIncompletePlans({
      profile,
      subjects,
      plans,
      startDate: new Date("2026-03-13T00:00:00.000Z"),
    });

    expect(rescheduled.find((plan) => plan.id === "plan_old")?.status).toBe("missed");
    expect(
      rescheduled.some(
        (plan) => plan.source === "rescheduled" && plan.subjectId === "algo" && plan.date >= "2026-03-13",
      ),
    ).toBe(true);
  });
});

describe("analytics utilities", () => {
  it("누적 시간, 주간 추이, 추천 과목을 계산한다", () => {
    const plans: StudyPlanItem[] = [
      {
        id: "plan_1",
        subjectId: "algo",
        date: "2026-03-12",
        plannedMinutes: 90,
        status: "completed",
        priorityScore: 90,
        source: "auto",
      },
      {
        id: "plan_2",
        subjectId: "db",
        date: "2026-03-12",
        plannedMinutes: 60,
        status: "planned",
        priorityScore: 60,
        source: "auto",
      },
    ];

    const analytics = buildAnalytics({
      subjects,
      logs,
      plans,
      referenceDate: new Date("2026-03-13T00:00:00.000Z"),
    });

    expect(analytics.totalStudiedMinutes).toBe(150);
    expect(analytics.weeklyTrend).toHaveLength(7);
    expect(analytics.focusPattern.find((bucket) => bucket.bucket === "evening")?.minutes).toBe(90);
    expect(analytics.subjectTotals.find((item) => item.subjectId === "algo")?.studiedMinutes).toBe(90);
    expect(analytics.todayRecommended[0]?.subjectId).toBe("algo");
  });
});
