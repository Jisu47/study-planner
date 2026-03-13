"use client";

import { ProfileRequired } from "@/components/layout/profile-required";
import { ChartsPanel } from "@/components/analytics/charts-panel";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { useAppData } from "@/hooks/use-app-data";
import { formatMinutes, toPercentage } from "@/lib/utils";

export default function AnalyticsPage() {
  const { analytics, state } = useAppData();

  return (
    <ProfileRequired
      title="학습 분석"
      description="누적 공부 시간과 최근 패턴을 시각적으로 확인할 수 있습니다."
    >
      <main className="app-page page-stack">
        <PageHeader
          eyebrow="analytics"
          title="학습 분석 리포트"
          description="과목별 달성률, 최근 7일 변화, 시간대별 공부 패턴을 모바일 카드로 정리했습니다."
        />

        <div className="grid grid-cols-2 gap-3">
          <Card className="space-y-2">
            <p className="text-sm font-medium text-[var(--muted)]">총 공부 시간</p>
            <p className="text-2xl font-extrabold text-[var(--foreground)]">{formatMinutes(analytics.totalStudiedMinutes)}</p>
            <p className="text-xs text-[var(--muted)]">모든 기록 합계</p>
          </Card>
          <Card className="space-y-2">
            <p className="text-sm font-medium text-[var(--muted)]">계획 이행률</p>
            <p className="text-2xl font-extrabold text-[var(--foreground)]">{toPercentage(analytics.planCompletionRate)}%</p>
            <p className="text-xs text-[var(--muted)]">최근 2주 기준</p>
          </Card>
        </div>

        {state.subjects.length ? (
          <ChartsPanel analytics={analytics} />
        ) : (
          <EmptyState
            title="분석할 데이터가 없습니다"
            description="과목과 공부 기록이 쌓이면 차트와 추천 분석이 자동으로 표시됩니다."
          />
        )}
      </main>
    </ProfileRequired>
  );
}

