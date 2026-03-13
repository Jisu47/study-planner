"use client";

import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { StudyLogForm } from "@/components/record/study-log-form";
import { ProfileRequired } from "@/components/layout/profile-required";
import { useAppData } from "@/hooks/use-app-data";
import { formatDateLabel, formatMinutes } from "@/lib/utils";

export default function RecordPage() {
  const { addStudyLog, state } = useAppData();

  return (
    <ProfileRequired
      title="공부 기록"
      description="실제 공부 시간을 입력해 대시보드와 분석 수치를 업데이트합니다."
    >
      <main className="app-page page-stack">
        <PageHeader
          eyebrow="record"
          title="공부 기록 입력"
          description="타이머 대신 수동 기록 방식으로 빠르게 시연할 수 있도록 단순화했습니다."
        />

        {state.subjects.length ? (
          <>
            <StudyLogForm
              subjects={state.subjects}
              plans={state.plans}
              onSubmit={addStudyLog}
            />

            <Card className="space-y-4">
              <div>
                <p className="text-sm font-semibold text-[var(--muted)]">최근 기록</p>
                <h2 className="mt-1 text-xl font-bold text-[var(--foreground)]">최신 학습 로그</h2>
              </div>
              <div className="space-y-3">
                {state.logs.slice(0, 8).map((log) => {
                  const subject = state.subjects.find((item) => item.id === log.subjectId);

                  return (
                    <div key={log.id} className="rounded-2xl bg-[var(--surface-alt)] px-4 py-3">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold text-[var(--foreground)]">{subject?.name ?? "과목"}</p>
                          <p className="mt-1 text-xs text-[var(--muted)]">
                            {formatDateLabel(log.date, "M월 d일")} · {log.startHour.toString().padStart(2, "0")}:00
                          </p>
                        </div>
                        <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-[var(--primary)]">
                          {formatMinutes(log.minutes)}
                        </span>
                      </div>
                      {log.memo ? <p className="mt-2 text-xs leading-5 text-[var(--muted)]">{log.memo}</p> : null}
                    </div>
                  );
                })}
              </div>
            </Card>
          </>
        ) : (
          <EmptyState
            title="기록할 과목이 아직 없습니다"
            description="먼저 과목을 등록한 뒤 공부 시간을 기록해 보세요."
            actionLabel="과목 등록하기"
            actionHref="/subjects"
          />
        )}
      </main>
    </ProfileRequired>
  );
}

