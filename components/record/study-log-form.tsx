"use client";

import { formatISO, startOfDay } from "date-fns";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { StudyLogFormValues, StudyPlanItem, Subject } from "@/types";

const initialValues: StudyLogFormValues = {
  subjectId: "",
  date: formatISO(startOfDay(new Date()), { representation: "date" }),
  minutes: 60,
  startHour: 20,
  memo: "",
  linkedPlanId: undefined,
  markLinkedPlanComplete: false,
};

export function StudyLogForm({
  subjects,
  plans,
  onSubmit,
}: {
  subjects: Subject[];
  plans: StudyPlanItem[];
  onSubmit: (values: StudyLogFormValues) => void;
}) {
  const [values, setValues] = useState<StudyLogFormValues>({
    ...initialValues,
    subjectId: subjects[0]?.id ?? "",
  });

  const matchingPlans = useMemo(
    () => plans.filter((plan) => plan.subjectId === values.subjectId && plan.status !== "completed"),
    [plans, values.subjectId],
  );

  return (
    <Card className="space-y-4">
      <div>
        <p className="text-sm font-semibold text-[var(--muted)]">공부 기록</p>
        <h2 className="mt-1 text-xl font-bold text-[var(--foreground)]">수동 학습 기록 입력</h2>
      </div>

      <div className="grid gap-3">
        <label className="grid gap-2 text-sm font-medium text-[var(--foreground)]">
          과목 선택
          <Select
            value={values.subjectId}
            onChange={(event) => setValues((previous) => ({ ...previous, subjectId: event.target.value, linkedPlanId: undefined }))}
          >
            {subjects.map((subject) => (
              <option key={subject.id} value={subject.id}>
                {subject.name}
              </option>
            ))}
          </Select>
        </label>

        <div className="grid grid-cols-2 gap-3">
          <label className="grid gap-2 text-sm font-medium text-[var(--foreground)]">
            날짜
            <Input
              type="date"
              value={values.date}
              onChange={(event) => setValues((previous) => ({ ...previous, date: event.target.value }))}
            />
          </label>
          <label className="grid gap-2 text-sm font-medium text-[var(--foreground)]">
            공부 시간(분)
            <Input
              type="number"
              min={10}
              step={5}
              value={values.minutes}
              onChange={(event) => setValues((previous) => ({ ...previous, minutes: Number(event.target.value) }))}
            />
          </label>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <label className="grid gap-2 text-sm font-medium text-[var(--foreground)]">
            시작 시각
            <Select
              value={values.startHour}
              onChange={(event) => setValues((previous) => ({ ...previous, startHour: Number(event.target.value) }))}
            >
              {Array.from({ length: 24 }, (_, hour) => (
                <option key={hour} value={hour}>
                  {hour.toString().padStart(2, "0")}:00
                </option>
              ))}
            </Select>
          </label>
          <label className="grid gap-2 text-sm font-medium text-[var(--foreground)]">
            연결 계획
            <Select
              value={values.linkedPlanId ?? ""}
              onChange={(event) =>
                setValues((previous) => ({
                  ...previous,
                  linkedPlanId: event.target.value || undefined,
                }))
              }
            >
              <option value="">선택 안 함</option>
              {matchingPlans.map((plan) => (
                <option key={plan.id} value={plan.id}>
                  {plan.date} · {plan.plannedMinutes}분
                </option>
              ))}
            </Select>
          </label>
        </div>

        <label className="grid gap-2 text-sm font-medium text-[var(--foreground)]">
          메모
          <Textarea
            value={values.memo}
            onChange={(event) => setValues((previous) => ({ ...previous, memo: event.target.value }))}
            placeholder="예: 알고리즘 기출 3문제 풀이"
          />
        </label>

        <label className="flex items-center gap-3 rounded-2xl bg-[var(--surface-alt)] px-4 py-3 text-sm text-[var(--foreground)]">
          <input
            type="checkbox"
            checked={Boolean(values.markLinkedPlanComplete)}
            onChange={(event) =>
              setValues((previous) => ({
                ...previous,
                markLinkedPlanComplete: event.target.checked,
              }))
            }
          />
          연결된 계획도 함께 완료 처리
        </label>
      </div>

      <Button
        className="w-full"
        onClick={() => {
          if (!values.subjectId || values.minutes <= 0) {
            return;
          }

          onSubmit(values);
          setValues({
            ...initialValues,
            subjectId: values.subjectId,
          });
        }}
      >
        기록 저장
      </Button>
    </Card>
  );
}

