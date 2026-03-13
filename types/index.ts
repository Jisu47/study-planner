export type PlanStatus = "planned" | "completed" | "missed";
export type PlanSource = "auto" | "rescheduled";

export interface UserProfile {
  nickname: string;
  dailyStudyHours: number;
  createdAt: string;
}

export interface Subject {
  id: string;
  name: string;
  examDate: string;
  targetStudyHours: number;
  importance: number;
  difficulty: number;
  color: string;
  createdAt: string;
  updatedAt: string;
}

export interface StudyPlanItem {
  id: string;
  subjectId: string;
  date: string;
  plannedMinutes: number;
  status: PlanStatus;
  priorityScore: number;
  source: PlanSource;
}

export interface StudyLog {
  id: string;
  subjectId: string;
  date: string;
  minutes: number;
  startHour: number;
  memo: string;
  linkedPlanId?: string;
}

export interface AppData {
  profile: UserProfile | null;
  subjects: Subject[];
  plans: StudyPlanItem[];
  logs: StudyLog[];
  lastGeneratedAt: string | null;
}

export interface SubjectProgress {
  subjectId: string;
  actualMinutes: number;
  plannedMinutes: number;
  remainingMinutes: number;
  recentMinutes: number;
  completionRate: number;
}

export interface PriorityContext {
  referenceDate: string;
  actualMinutes: number;
  plannedMinutes: number;
  remainingMinutes: number;
  recentMinutes: number;
}

export interface PrioritizedSubject extends SubjectProgress {
  subject: Subject;
  priorityScore: number;
  daysUntilExam: number;
}

export interface DailyPlanGroup {
  date: string;
  totalMinutes: number;
  items: Array<StudyPlanItem & { subject: Subject }>;
}

export interface WeeklyTrendPoint {
  date: string;
  label: string;
  minutes: number;
}

export interface FocusPatternPoint {
  bucket: string;
  label: string;
  minutes: number;
}

export interface RecommendationItem {
  subjectId: string;
  subjectName: string;
  score: number;
  reason: string;
}

export interface SubjectAnalyticsItem {
  subjectId: string;
  subjectName: string;
  subjectColor: string;
  studiedMinutes: number;
  targetMinutes: number;
  completionRate: number;
}

export interface AnalyticsSummary {
  subjectTotals: SubjectAnalyticsItem[];
  weeklyTrend: WeeklyTrendPoint[];
  focusPattern: FocusPatternPoint[];
  planCompletionRate: number;
  totalStudiedMinutes: number;
  todayRecommended: RecommendationItem[];
}

export interface SubjectFormValues {
  id?: string;
  name: string;
  examDate: string;
  targetStudyHours: number;
  importance: number;
  difficulty: number;
  color: string;
}

export interface StudyLogFormValues {
  subjectId: string;
  date: string;
  minutes: number;
  startHour: number;
  memo: string;
  linkedPlanId?: string;
  markLinkedPlanComplete?: boolean;
}

