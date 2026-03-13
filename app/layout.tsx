import type { Metadata } from "next";
import "./globals.css";
import { AppDataProvider } from "@/components/providers/app-data-provider";
import { AppShell } from "@/components/layout/app-shell";

export const metadata: Metadata = {
  title: "학습 분석 기반 개인 맞춤형 공부 플래너",
  description: "모바일 웹 우선 학습 계획 및 분석 프로토타입",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="bg-[var(--background)] antialiased">
        <AppDataProvider>
          <AppShell>{children}</AppShell>
        </AppDataProvider>
      </body>
    </html>
  );
}

