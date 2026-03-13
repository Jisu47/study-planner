"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { BookOpenText, ChartNoAxesCombined, Clock3, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAppData } from "@/hooks/use-app-data";

const highlights = [
  {
    title: "과목 기반 계획 생성",
    description: "시험일, 목표 학습량, 중요도와 난이도를 반영해 우선순위 계획을 만듭니다.",
    icon: BookOpenText,
  },
  {
    title: "모바일 기록 중심",
    description: "휴대폰에서 바로 공부 시간을 입력하고 계획 완료 여부를 체크할 수 있습니다.",
    icon: Clock3,
  },
  {
    title: "대시보드 분석",
    description: "과목별 누적 시간, 최근 7일 변화, 집중 시간대를 한 화면에서 보여줍니다.",
    icon: ChartNoAxesCombined,
  },
];

export default function HomePage() {
  const router = useRouter();
  const { hydrated, state, loadSampleData, resetData } = useAppData();

  return (
    <main className="app-page page-stack pt-8">
      <Card className="space-y-5 overflow-hidden bg-[linear-gradient(135deg,#0f2038_0%,#16345c_52%,#0d5bd7_100%)] text-white">
        <div className="inline-flex w-fit items-center gap-2 rounded-full bg-white/12 px-3 py-1 text-xs font-semibold tracking-[0.2em] uppercase">
          <Sparkles size={14} />
          Study Planner Prototype
        </div>
        <div className="space-y-3">
          <h1 className="text-3xl font-extrabold leading-tight">
            학습 분석 기반
            <br />
            개인 맞춤형 공부 플래너
          </h1>
          <p className="text-sm leading-6 text-white/80">
            캡스톤 시연용 모바일 웹 프로토타입입니다. 과목을 등록하면 오늘 할 공부 순서와 주간 계획,
            공부 기록과 간단한 분석 리포트를 바로 확인할 수 있습니다.
          </p>
        </div>
        <div className="grid gap-3">
          {state.profile ? (
            <Button className="w-full bg-white text-[#122033]" onClick={() => router.push("/dashboard")}>
              이어서 대시보드 보기
            </Button>
          ) : (
            <Link href="/onboarding">
              <Button className="w-full bg-white text-[#122033]">처음부터 시작하기</Button>
            </Link>
          )}
          <Button
            variant="secondary"
            className="w-full bg-white/12 text-white hover:bg-white/18"
            onClick={() => {
              loadSampleData();
              router.push("/dashboard");
            }}
          >
            샘플 데이터로 바로 체험하기
          </Button>
          {hydrated && state.profile ? (
            <Button variant="ghost" className="w-full text-white hover:bg-white/12" onClick={resetData}>
              저장 데이터 초기화
            </Button>
          ) : null}
        </div>
      </Card>

      {highlights.map((item) => {
        const Icon = item.icon;
        return (
          <Card key={item.title} className="space-y-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--primary-soft)] text-[var(--primary)]">
              <Icon size={22} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[var(--foreground)]">{item.title}</h2>
              <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{item.description}</p>
            </div>
          </Card>
        );
      })}
    </main>
  );
}

