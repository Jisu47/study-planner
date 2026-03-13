"use client";

import { EmptyState } from "@/components/ui/empty-state";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { useAppData } from "@/hooks/use-app-data";

export function ProfileRequired({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  const { hydrated, state } = useAppData();

  if (!hydrated) {
    return (
      <main className="app-page page-stack">
        <PageHeader eyebrow="loading" title={title} description={description} />
        <Card>
          <p className="text-sm text-[var(--muted)]">학습 데이터를 불러오는 중입니다.</p>
        </Card>
      </main>
    );
  }

  if (!state.profile) {
    return (
      <main className="app-page page-stack">
        <PageHeader eyebrow="setup" title={title} description={description} />
        <EmptyState
          title="먼저 사용자 정보를 입력해 주세요"
          description="닉네임과 하루 공부 가능 시간을 입력하면 모바일 플래너 화면이 바로 준비됩니다."
          actionLabel="온보딩 시작하기"
          actionHref="/onboarding"
        />
      </main>
    );
  }

  return <>{children}</>;
}

