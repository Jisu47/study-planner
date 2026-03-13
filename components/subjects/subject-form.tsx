"use client";

import { addDays, formatISO, startOfDay } from "date-fns";
import { useEffect, useState } from "react";
import { DIFFICULTY_OPTIONS, IMPORTANCE_OPTIONS, SUBJECT_COLORS } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import type { SubjectFormValues } from "@/types";

const defaultValues: SubjectFormValues = {
  name: "",
  examDate: formatISO(addDays(startOfDay(new Date()), 7), { representation: "date" }),
  targetStudyHours: 6,
  importance: 3,
  difficulty: 3,
  color: SUBJECT_COLORS[0],
};

export function SubjectForm({
  initialValues,
  onSubmit,
  onCancel,
}: {
  initialValues?: SubjectFormValues | null;
  onSubmit: (values: SubjectFormValues) => void;
  onCancel?: () => void;
}) {
  const [values, setValues] = useState<SubjectFormValues>(initialValues ?? defaultValues);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setValues(initialValues ?? defaultValues);
  }, [initialValues]);

  return (
    <Card className="space-y-4">
      <div>
        <p className="text-sm font-semibold text-[var(--muted)]">과목 등록</p>
        <h2 className="mt-1 text-xl font-bold text-[var(--foreground)]">
          {initialValues ? "과목 수정" : "새 과목 추가"}
        </h2>
      </div>

      <div className="grid gap-3">
        <label className="grid gap-2 text-sm font-medium text-[var(--foreground)]">
          과목명
          <Input
            value={values.name}
            onChange={(event) => setValues((previous) => ({ ...previous, name: event.target.value }))}
            placeholder="예: 자료구조"
          />
        </label>

        <label className="grid gap-2 text-sm font-medium text-[var(--foreground)]">
          시험일
          <Input
            type="date"
            value={values.examDate}
            onChange={(event) => setValues((previous) => ({ ...previous, examDate: event.target.value }))}
          />
        </label>

        <label className="grid gap-2 text-sm font-medium text-[var(--foreground)]">
          목표 공부 시간
          <Input
            type="number"
            min={1}
            max={200}
            value={values.targetStudyHours}
            onChange={(event) =>
              setValues((previous) => ({ ...previous, targetStudyHours: Number(event.target.value) }))
            }
          />
        </label>

        <div className="grid grid-cols-2 gap-3">
          <label className="grid gap-2 text-sm font-medium text-[var(--foreground)]">
            중요도
            <Select
              value={values.importance}
              onChange={(event) =>
                setValues((previous) => ({ ...previous, importance: Number(event.target.value) }))
              }
            >
              {IMPORTANCE_OPTIONS.map((value) => (
                <option key={value} value={value}>
                  {value}점
                </option>
              ))}
            </Select>
          </label>

          <label className="grid gap-2 text-sm font-medium text-[var(--foreground)]">
            난이도
            <Select
              value={values.difficulty}
              onChange={(event) =>
                setValues((previous) => ({ ...previous, difficulty: Number(event.target.value) }))
              }
            >
              {DIFFICULTY_OPTIONS.map((value) => (
                <option key={value} value={value}>
                  {value}점
                </option>
              ))}
            </Select>
          </label>
        </div>

        <label className="grid gap-3 text-sm font-medium text-[var(--foreground)]">
          강조 색상
          <div className="grid grid-cols-6 gap-2">
            {SUBJECT_COLORS.map((color) => (
              <button
                key={color}
                type="button"
                aria-label={`색상 ${color}`}
                onClick={() => setValues((previous) => ({ ...previous, color }))}
                className="h-10 rounded-2xl border-2 transition"
                style={{
                  backgroundColor: color,
                  borderColor: values.color === color ? "#122033" : "rgba(255,255,255,0.8)",
                }}
              />
            ))}
          </div>
        </label>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {onCancel ? (
          <Button variant="ghost" className="w-full" onClick={onCancel}>
            취소
          </Button>
        ) : null}
        <Button
          className="w-full"
          onClick={() => {
            if (!values.name.trim()) {
              return;
            }

            onSubmit({ ...values, name: values.name.trim() });
            setValues(defaultValues);
          }}
        >
          {initialValues ? "과목 저장" : "과목 추가"}
        </Button>
      </div>
    </Card>
  );
}

