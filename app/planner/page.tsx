"use client";

import { isAfter, parseISO, startOfDay } from "date-fns";
import { ProfileRequired } from "@/components/layout/profile-required";
import { PlanBoard } from "@/components/planner/plan-board";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { useAppData } from "@/hooks/use-app-data";

export default function PlannerPage() {
  const { groupedPlans, regeneratePlans, reschedulePlans, state, togglePlanStatus } = useAppData();
  const today = startOfDay(new Date());
  const upcomingGroups = groupedPlans.filter((group) => !isAfter(today, parseISO(group.date)));

  return (
    <ProfileRequired
      title="플래너"
      description="일간/주간 계획을 확인하고 미완료 항목을 다시 배치합니다."
    >
      <main className="app-page page-stack">
        <PageHeader
          eyebrow="planner"
          title="이번 주 학습 계획"
          description="하루 공부 가능 시간을 넘지 않도록 우선순위 기반으로 자동 분배했습니다."
        />

        <div className="grid grid-cols-2 gap-3">
          <Button variant="secondary" className="w-full" onClick={regeneratePlans}>
            계획 다시 생성
          </Button>
          <Button className="w-full" onClick={reschedulePlans}>
            미완료 재배치
          </Button>
        </div>

        {!state.subjects.length ? (
          <EmptyState
            title="먼저 과목을 등록해 주세요"
            description="과목 정보가 있어야 우선순위 점수를 계산해 계획을 만들 수 있습니다."
            actionLabel="과목 등록하기"
            actionHref="/subjects"
          />
        ) : upcomingGroups.length ? (
          <PlanBoard groups={upcomingGroups} onToggle={togglePlanStatus} />
        ) : (
          <EmptyState
            title="생성된 계획이 없습니다"
            description="과목 정보와 하루 가능 시간을 기준으로 계획을 새로 생성해 보세요."
          />
        )}
      </main>
    </ProfileRequired>
  );
}

