"use client";

import { useMemo, useState } from "react";
import { ProfileRequired } from "@/components/layout/profile-required";
import { SubjectForm } from "@/components/subjects/subject-form";
import { SubjectList } from "@/components/subjects/subject-list";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { useAppData } from "@/hooks/use-app-data";
import type { Subject, SubjectFormValues } from "@/types";

export default function SubjectsPage() {
  const { analytics, deleteSubject, state, upsertSubject } = useAppData();
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);

  const initialValues = useMemo<SubjectFormValues | null>(() => {
    if (!editingSubject) {
      return null;
    }

    return {
      id: editingSubject.id,
      name: editingSubject.name,
      examDate: editingSubject.examDate,
      targetStudyHours: editingSubject.targetStudyHours,
      importance: editingSubject.importance,
      difficulty: editingSubject.difficulty,
      color: editingSubject.color,
    };
  }, [editingSubject]);

  return (
    <ProfileRequired
      title="과목 관리"
      description="시험 일정과 목표 학습량을 등록해 자동 계획의 기준을 만듭니다."
    >
      <main className="app-page page-stack">
        <PageHeader
          eyebrow="subjects"
          title="과목 입력 및 수정"
          description="과목 정보가 바뀌면 다음 주 계획과 추천 순서도 함께 다시 계산됩니다."
        />

        <SubjectForm
          initialValues={initialValues}
          onSubmit={(values) => {
            upsertSubject(values);
            setEditingSubject(null);
          }}
          onCancel={editingSubject ? () => setEditingSubject(null) : undefined}
        />

        {state.subjects.length ? (
          <SubjectList
            subjects={state.subjects}
            analytics={analytics.subjectTotals}
            onEdit={(subject) => setEditingSubject(subject)}
            onDelete={(subjectId) => {
              if (window.confirm("이 과목과 관련된 계획/기록도 함께 삭제됩니다. 계속할까요?")) {
                deleteSubject(subjectId);
                setEditingSubject(null);
              }
            }}
          />
        ) : (
          <EmptyState
            title="아직 등록된 과목이 없습니다"
            description="과목을 하나만 추가해도 오늘 추천과 주간 계획이 바로 만들어집니다."
          />
        )}
      </main>
    </ProfileRequired>
  );
}

