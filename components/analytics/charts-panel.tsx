"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card } from "@/components/ui/card";
import { formatMinutes, toPercentage } from "@/lib/utils";
import type { AnalyticsSummary } from "@/types";

function tooltipFormatter(value: unknown) {
  return formatMinutes(Number(value ?? 0));
}

export function ChartsPanel({ analytics }: { analytics: AnalyticsSummary }) {
  return (
    <div className="grid gap-4">
      <Card className="space-y-4">
        <div>
          <p className="text-sm font-semibold text-[var(--muted)]">과목별 누적 공부 시간</p>
          <h2 className="mt-1 text-xl font-bold text-[var(--foreground)]">과목별 학습량</h2>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={analytics.subjectTotals} layout="vertical" margin={{ left: 8, right: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#d6deeb" horizontal={false} />
              <XAxis type="number" hide />
              <YAxis
                dataKey="subjectName"
                type="category"
                axisLine={false}
                tickLine={false}
                width={78}
                tick={{ fontSize: 12, fill: "#66768d" }}
              />
              <Tooltip formatter={tooltipFormatter} />
              <Bar dataKey="studiedMinutes" radius={[10, 10, 10, 10]}>
                {analytics.subjectTotals.map((entry) => (
                  <Cell key={entry.subjectId} fill={entry.subjectColor} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card className="space-y-4">
        <div>
          <p className="text-sm font-semibold text-[var(--muted)]">최근 7일 학습량 변화</p>
          <h2 className="mt-1 text-xl font-bold text-[var(--foreground)]">주간 트렌드</h2>
        </div>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={analytics.weeklyTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#d6deeb" />
              <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#66768d" }} />
              <YAxis hide />
              <Tooltip formatter={tooltipFormatter} />
              <Line type="monotone" dataKey="minutes" stroke="#0F5BD7" strokeWidth={3} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card className="space-y-4">
        <div>
          <p className="text-sm font-semibold text-[var(--muted)]">시간대별 집중 패턴</p>
          <h2 className="mt-1 text-xl font-bold text-[var(--foreground)]">언제 공부가 잘 되는지</h2>
        </div>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={analytics.focusPattern}>
              <CartesianGrid strokeDasharray="3 3" stroke="#d6deeb" vertical={false} />
              <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#66768d" }} />
              <YAxis hide />
              <Tooltip formatter={tooltipFormatter} />
              <Bar dataKey="minutes" fill="#0D9F9A" radius={[12, 12, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card className="space-y-3">
        <div>
          <p className="text-sm font-semibold text-[var(--muted)]">과목별 달성률</p>
          <h2 className="mt-1 text-xl font-bold text-[var(--foreground)]">목표 진행률</h2>
        </div>
        <div className="space-y-3">
          {analytics.subjectTotals.map((subject) => (
            <div key={subject.subjectId} className="rounded-2xl bg-[var(--surface-alt)] px-4 py-3">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-[var(--foreground)]">{subject.subjectName}</p>
                  <p className="mt-1 text-xs text-[var(--muted)]">
                    {formatMinutes(subject.studiedMinutes)} / {formatMinutes(subject.targetMinutes)}
                  </p>
                </div>
                <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-[var(--foreground)]">
                  {toPercentage(subject.completionRate)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
