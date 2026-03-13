"use client";

import {
  addDays,
  isAfter,
  isBefore,
  parseISO,
  startOfDay,
} from "date-fns";
import {
  createContext,
  startTransition,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { PLAN_HORIZON_DAYS } from "@/lib/constants";
import { buildAnalytics } from "@/lib/analytics";
import { generateStudyPlan, mergePlansByDate, rescheduleIncompletePlans } from "@/lib/planner";
import { createSampleAppData } from "@/lib/sample-data";
import { createEmptyAppData, loadAppData, saveAppData } from "@/lib/storage";
import { createId } from "@/lib/utils";
import type {
  AnalyticsSummary,
  AppData,
  DailyPlanGroup,
  StudyLogFormValues,
  SubjectFormValues,
} from "@/types";

function sortPlans(plans: AppData["plans"]) {
  return [...plans].sort((left, right) =>
    left.date === right.date
      ? right.priorityScore - left.priorityScore
      : left.date.localeCompare(right.date),
  );
}

function sortLogs(logs: AppData["logs"]) {
  return [...logs].sort((left, right) =>
    left.date === right.date ? right.startHour - left.startHour : right.date.localeCompare(left.date),
  );
}

function regeneratePlanSet(data: AppData, days = PLAN_HORIZON_DAYS) {
  if (!data.profile) {
    return data;
  }

  const start = startOfDay(new Date());
  const end = addDays(start, days - 1);
  const generatedPlans = generateStudyPlan({
    profile: data.profile,
    subjects: data.subjects,
    logs: data.logs,
    startDate: start,
    days,
  });

  const preservedPlans = data.plans.filter((plan) => {
    const planDate = startOfDay(parseISO(plan.date));
    if (isBefore(planDate, start)) {
      return true;
    }

    if (isAfter(planDate, end)) {
      return true;
    }

    return plan.status === "completed";
  });

  return {
    ...data,
    plans: sortPlans([...preservedPlans, ...generatedPlans]),
    lastGeneratedAt: new Date().toISOString(),
  };
}

type AppDataContextValue = {
  state: AppData;
  hydrated: boolean;
  analytics: AnalyticsSummary;
  groupedPlans: DailyPlanGroup[];
  saveProfile: (values: { nickname: string; dailyStudyHours: number }) => void;
  upsertSubject: (values: SubjectFormValues) => void;
  deleteSubject: (subjectId: string) => void;
  addStudyLog: (values: StudyLogFormValues) => void;
  togglePlanStatus: (planId: string) => void;
  regeneratePlans: () => void;
  reschedulePlans: () => void;
  loadSampleData: () => void;
  resetData: () => void;
};

export const AppDataContext = createContext<AppDataContextValue | null>(null);

export function AppDataProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppData>(createEmptyAppData());
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored = loadAppData();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setState(stored ?? createEmptyAppData());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    saveAppData(state);
  }, [hydrated, state]);

  const analytics = useMemo(
    () =>
      buildAnalytics({
        subjects: state.subjects,
        logs: state.logs,
        plans: state.plans,
      }),
    [state.logs, state.plans, state.subjects],
  );

  const groupedPlans = useMemo(
    () => mergePlansByDate(state.plans, state.subjects),
    [state.plans, state.subjects],
  );

  const saveProfile = (values: { nickname: string; dailyStudyHours: number }) => {
    startTransition(() => {
      setState((previous) =>
        regeneratePlanSet({
          ...previous,
          profile: {
            nickname: values.nickname,
            dailyStudyHours: values.dailyStudyHours,
            createdAt: previous.profile?.createdAt ?? new Date().toISOString(),
          },
        }),
      );
    });
  };

  const upsertSubject = (values: SubjectFormValues) => {
    startTransition(() => {
      setState((previous) => {
        const now = new Date().toISOString();
        const nextSubjects = values.id
          ? previous.subjects.map((subject) =>
              subject.id === values.id
                ? {
                    ...subject,
                    ...values,
                    updatedAt: now,
                  }
                : subject,
            )
          : [
              ...previous.subjects,
              {
                id: createId("subject"),
                name: values.name,
                examDate: values.examDate,
                targetStudyHours: values.targetStudyHours,
                importance: values.importance,
                difficulty: values.difficulty,
                color: values.color,
                createdAt: now,
                updatedAt: now,
              },
            ];

        const nextData = {
          ...previous,
          subjects: nextSubjects,
        };

        return previous.profile ? regeneratePlanSet(nextData) : nextData;
      });
    });
  };

  const deleteSubject = (subjectId: string) => {
    startTransition(() => {
      setState((previous) => {
        const nextData = {
          ...previous,
          subjects: previous.subjects.filter((subject) => subject.id !== subjectId),
          logs: previous.logs.filter((log) => log.subjectId !== subjectId),
          plans: previous.plans.filter((plan) => plan.subjectId !== subjectId),
        };

        return previous.profile ? regeneratePlanSet(nextData) : nextData;
      });
    });
  };

  const addStudyLog = (values: StudyLogFormValues) => {
    startTransition(() => {
      setState((previous) => {
        const nextLogs = sortLogs([
          {
            id: createId("log"),
            subjectId: values.subjectId,
            date: values.date,
            minutes: values.minutes,
            startHour: values.startHour,
            memo: values.memo,
            linkedPlanId: values.linkedPlanId,
          },
          ...previous.logs,
        ]);

        const nextPlans = previous.plans.map((plan) =>
          values.markLinkedPlanComplete && plan.id === values.linkedPlanId
            ? { ...plan, status: "completed" as const }
            : plan,
        );

        const nextData = {
          ...previous,
          logs: nextLogs,
          plans: nextPlans,
        };

        return previous.profile ? regeneratePlanSet(nextData) : nextData;
      });
    });
  };

  const togglePlanStatus = (planId: string) => {
    startTransition(() => {
      setState((previous) => ({
        ...previous,
        plans: previous.plans.map((plan) =>
          plan.id === planId
            ? {
                ...plan,
                status: plan.status === "completed" ? "planned" : "completed",
              }
            : plan,
        ),
      }));
    });
  };

  const regeneratePlans = () => {
    startTransition(() => {
      setState((previous) => regeneratePlanSet(previous));
    });
  };

  const reschedulePlans = () => {
    startTransition(() => {
      setState((previous) => {
        if (!previous.profile) {
          return previous;
        }

        return {
          ...previous,
          plans: sortPlans(
            rescheduleIncompletePlans({
              profile: previous.profile,
              subjects: previous.subjects,
              plans: previous.plans,
            }),
          ),
          lastGeneratedAt: new Date().toISOString(),
        };
      });
    });
  };

  const loadSampleData = () => {
    startTransition(() => {
      setState(createSampleAppData());
      setHydrated(true);
    });
  };

  const resetData = () => {
    startTransition(() => {
      setState(createEmptyAppData());
      setHydrated(true);
    });
  };

  return (
    <AppDataContext.Provider
      value={{
        state,
        hydrated,
        analytics,
        groupedPlans,
        saveProfile,
        upsertSubject,
        deleteSubject,
        addStudyLog,
        togglePlanStatus,
        regeneratePlans,
        reschedulePlans,
        loadSampleData,
        resetData,
      }}
    >
      {children}
    </AppDataContext.Provider>
  );
}

