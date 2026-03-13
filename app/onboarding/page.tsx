"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/ui/page-header";
import { useAppData } from "@/hooks/use-app-data";

export default function OnboardingPage() {
  const router = useRouter();
  const { state, saveProfile } = useAppData();
  const [nickname, setNickname] = useState("");
  const [dailyStudyHours, setDailyStudyHours] = useState(4);

  useEffect(() => {
    if (state.profile) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setNickname(state.profile.nickname);
      setDailyStudyHours(state.profile.dailyStudyHours);
    }
  }, [state.profile]);

  return (
    <main className="app-page page-stack">
      <PageHeader
        eyebrow="onboarding"
        title="기본 설정 입력"
        description="닉네임과 하루 공부 가능 시간을 입력하면 모바일 대시보드와 자동 계획 기능이 활성화됩니다."
      />

      <Card className="space-y-4">
        <label className="grid gap-2 text-sm font-medium text-[var(--foreground)]">
          닉네임
          <Input value={nickname} onChange={(event) => setNickname(event.target.value)} placeholder="예: 김스터디" />
        </label>

        <label className="grid gap-2 text-sm font-medium text-[var(--foreground)]">
          하루 공부 가능 시간(시간)
          <Input
            type="number"
            min={1}
            max={12}
            step={0.5}
            value={dailyStudyHours}
            onChange={(event) => setDailyStudyHours(Number(event.target.value))}
          />
        </label>

        <div className="rounded-2xl bg-[var(--surface-alt)] px-4 py-3 text-sm leading-6 text-[var(--muted)]">
          입력한 시간은 자동 계획 생성과 미완료 계획 재배치의 기준으로 사용됩니다.
        </div>
      </Card>

      <div className="mt-auto grid gap-3">
        <Button
          className="w-full"
          onClick={() => {
            if (!nickname.trim()) {
              return;
            }

            saveProfile({ nickname: nickname.trim(), dailyStudyHours });
            router.push("/dashboard");
          }}
        >
          설정 저장하고 시작하기
        </Button>
      </div>
    </main>
  );
}

