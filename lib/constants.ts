export const APP_STORAGE_KEY = "study-planner-prototype:v1";
export const PLAN_HORIZON_DAYS = 7;

export const SUBJECT_COLORS = [
  "#0F5BD7",
  "#0D9F9A",
  "#FF8A3D",
  "#8F56E8",
  "#E84D87",
  "#2C7A4B",
];

export const IMPORTANCE_OPTIONS = [1, 2, 3, 4, 5];
export const DIFFICULTY_OPTIONS = [1, 2, 3, 4, 5];

export const TIME_BUCKETS = [
  { key: "dawn", label: "새벽", startHour: 0, endHour: 6 },
  { key: "morning", label: "오전", startHour: 6, endHour: 12 },
  { key: "afternoon", label: "오후", startHour: 12, endHour: 18 },
  { key: "evening", label: "저녁", startHour: 18, endHour: 24 },
] as const;

export const MOBILE_NAV_ITEMS = [
  { href: "/dashboard", label: "대시보드" },
  { href: "/subjects", label: "과목" },
  { href: "/planner", label: "플래너" },
  { href: "/record", label: "기록" },
  { href: "/analytics", label: "분석" },
];
