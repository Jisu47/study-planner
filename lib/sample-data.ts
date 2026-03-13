import { addDays, formatISO, startOfDay } from "date-fns";
import { PLAN_HORIZON_DAYS, SUBJECT_COLORS } from "@/lib/constants";
import { generateStudyPlan } from "@/lib/planner";
import { createId } from "@/lib/utils";
import type { AppData, StudyLog, Subject, UserProfile } from "@/types";

function dateStringFromToday(offset: number) {
  return formatISO(addDays(startOfDay(new Date()), offset), { representation: "date" });
}

export function createSampleProfile(): UserProfile {
  return {
    nickname: "김스터디",
    dailyStudyHours: 4.5,
    createdAt: new Date().toISOString(),
  };
}

export function createSampleSubjects(): Subject[] {
  const now = new Date().toISOString();

  return [
    {
      id: "subject_algo",
      name: "알고리즘",
      examDate: dateStringFromToday(5),
      targetStudyHours: 14,
      importance: 5,
      difficulty: 4,
      color: SUBJECT_COLORS[0],
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "subject_db",
      name: "데이터베이스",
      examDate: dateStringFromToday(9),
      targetStudyHours: 12,
      importance: 4,
      difficulty: 3,
      color: SUBJECT_COLORS[1],
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "subject_english",
      name: "영어 발표",
      examDate: dateStringFromToday(3),
      targetStudyHours: 8,
      importance: 4,
      difficulty: 2,
      color: SUBJECT_COLORS[2],
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "subject_capstone",
      name: "캡스톤 설계",
      examDate: dateStringFromToday(12),
      targetStudyHours: 16,
      importance: 5,
      difficulty: 5,
      color: SUBJECT_COLORS[3],
      createdAt: now,
      updatedAt: now,
    },
  ];
}

export function createSampleLogs(): StudyLog[] {
  return [
    {
      id: createId("log"),
      subjectId: "subject_algo",
      date: dateStringFromToday(-1),
      minutes: 80,
      startHour: 20,
      memo: "기출문제 2세트 풀이",
    },
    {
      id: createId("log"),
      subjectId: "subject_db",
      date: dateStringFromToday(-2),
      minutes: 90,
      startHour: 10,
      memo: "정규화 파트 복습",
    },
    {
      id: createId("log"),
      subjectId: "subject_capstone",
      date: dateStringFromToday(-2),
      minutes: 70,
      startHour: 15,
      memo: "발표 자료 구조 정리",
    },
    {
      id: createId("log"),
      subjectId: "subject_english",
      date: dateStringFromToday(-3),
      minutes: 55,
      startHour: 9,
      memo: "스크립트 수정",
    },
    {
      id: createId("log"),
      subjectId: "subject_algo",
      date: dateStringFromToday(-4),
      minutes: 65,
      startHour: 22,
      memo: "그래프 문제 풀이",
    },
    {
      id: createId("log"),
      subjectId: "subject_capstone",
      date: dateStringFromToday(-5),
      minutes: 110,
      startHour: 13,
      memo: "UI 초안 정리",
    },
    {
      id: createId("log"),
      subjectId: "subject_db",
      date: dateStringFromToday(-6),
      minutes: 50,
      startHour: 8,
      memo: "트랜잭션 요약",
    },
  ];
}

export function createSampleAppData(): AppData {
  const profile = createSampleProfile();
  const subjects = createSampleSubjects();
  const logs = createSampleLogs();
  const plans = generateStudyPlan({
    profile,
    subjects,
    logs,
    days: PLAN_HORIZON_DAYS,
  });

  plans.push({
    id: createId("plan"),
    subjectId: "subject_algo",
    date: dateStringFromToday(-1),
    plannedMinutes: 60,
    status: "planned",
    priorityScore: 98,
    source: "auto",
  });

  return {
    profile,
    subjects,
    plans,
    logs,
    lastGeneratedAt: new Date().toISOString(),
  };
}

