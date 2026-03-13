import { MetricCard } from "@/components/ui/metric-card";
import { formatMinutes, toPercentage } from "@/lib/utils";

export function SummaryCards({
  dailyCapacityMinutes,
  totalStudiedMinutes,
  completionRate,
  subjectCount,
}: {
  dailyCapacityMinutes: number;
  totalStudiedMinutes: number;
  completionRate: number;
  subjectCount: number;
}) {
  return (
    <section className="grid grid-cols-2 gap-3">
      <MetricCard
        label="오늘 가능 시간"
        value={formatMinutes(dailyCapacityMinutes)}
        hint="온보딩 설정 기준"
      />
      <MetricCard
        label="누적 공부 시간"
        value={formatMinutes(totalStudiedMinutes)}
        hint="기록된 전체 학습량"
      />
      <MetricCard
        label="계획 이행률"
        value={`${toPercentage(completionRate)}%`}
        hint="최근 완료된 계획 비율"
      />
      <MetricCard
        label="관리 과목 수"
        value={`${subjectCount}개`}
        hint="시험 일정이 등록된 과목"
      />
    </section>
  );
}

