import { APP_STORAGE_KEY } from "@/lib/constants";
import type { AppData } from "@/types";

export function createEmptyAppData(): AppData {
  return {
    profile: null,
    subjects: [],
    plans: [],
    logs: [],
    lastGeneratedAt: null,
  };
}

export function loadAppData(): AppData | null {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = window.localStorage.getItem(APP_STORAGE_KEY);

  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as AppData;
    return {
      ...createEmptyAppData(),
      ...parsed,
      profile: parsed.profile ?? null,
      subjects: parsed.subjects ?? [],
      plans: parsed.plans ?? [],
      logs: parsed.logs ?? [],
      lastGeneratedAt: parsed.lastGeneratedAt ?? null,
    };
  } catch {
    return null;
  }
}

export function saveAppData(data: AppData) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(APP_STORAGE_KEY, JSON.stringify(data));
}

export function clearAppData() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(APP_STORAGE_KEY);
}

