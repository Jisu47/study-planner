"use client";

import Link from "next/link";
import { formatISO, startOfDay } from "date-fns";
import { ProfileRequired } from "@/components/layout/profile-required";
import { SummaryCards } from "@/components/dashboard/summary-cards";
import { TodayRecommendation } from "@/components/dashboard/today-recommendation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { useAppData } from "@/hooks/use-app-data";
import { hoursToMinutes } from "@/lib/utils";

export default function DashboardPage() {
  const { analytics, groupedPlans, regeneratePlans, state } = useAppData();
  const todayKey = formatISO(startOfDay(new Date()), { representation: "date" });
  const todayGroup = groupedPlans.find((group) => group.date === todayKey);

  return (
    <ProfileRequired
      title="대시보드"
      description="오늘 해야 할 공부와 과목별 우선순위를 한 번에 확인합니다."
    >
      <main className="app-page page-stack">
        <PageHeader
          eyebrow="dashboard"
          title={`${state.profile?.nickname ?? "사용자"}님의 오늘 계획`}
          description="우선순위 점수와 최근 학습 기록을 반영한 추천 결과입니다."
        />

        <Card className="space-y-4 bg-[linear-gradient(135deg,#122033_0%,#17396b_100%)] text-white">
          <div className="space-y-1">
            <p className="text-sm font-semibold text-white/70">오늘의 한 줄 가이드</p>
            <h2 className="text-2xl font-extrabold">시험이 가까운 과목부터 짧고 자주 배치하세요.</h2>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-2xl bg-white/10 px-4 py-3">
              <p className="text-white/70">추천 과목 수</p>
              <p className="mt-1 text-xl font-bold">{analytics.todayRecommended.length}개</p>
            </div>
            <div className="rounded-2xl bg-white/10 px-4 py-3">
              <p className="text-white/70">오늘 계획 총량</p>
              <p className="mt-1 text-xl font-bold">{todayGroup?.totalMinutes ?? 0}분</p>
            </div>
          </div>
        </Card>

        <SummaryCards
          dailyCapacityMinutes={hoursToMinutes(state.profile?.dailyStudyHours ?? 0)}
          totalStudiedMinutes={analytics.totalStudiedMinutes}
          completionRate={analytics.planCompletionRate}
          subjectCount={state.subjects.length}
        />

        {!state.subjects.length ? (
          <EmptyState
            title="등록된 과목이 없습니다"
            description="과목을 먼저 추가해야 자동 계획과 추천이 생성됩니다."
            actionLabel="과목 등록하러 가기"
            actionHref="/subjects"
          />
        ) : (
          <>
            <div className="grid grid-cols-2 gap-3">
              <Link href="/subjects">
                <Button variant="secondary" className="w-full">
                  과목 관리
                </Button>
              </Link>
              <Button className="w-full" onClick={regeneratePlans}>
                계획 다시 생성
              </Button>
            </div>
            <TodayRecommendation
              recommendations={analytics.todayRecommended}
              subjects={state.subjects}
              todayPlans={todayGroup?.items ?? []}
            />
          </>
        )}
      </main>
    </ProfileRequired>
  );
}

