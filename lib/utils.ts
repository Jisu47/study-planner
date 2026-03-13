import { format, isValid, parseISO } from "date-fns";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function createId(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

export function hoursToMinutes(hours: number) {
  return Math.round(hours * 60);
}

export function minutesToHours(minutes: number) {
  return Number((minutes / 60).toFixed(1));
}

export function formatMinutes(minutes: number) {
  if (minutes <= 0) {
    return "0분";
  }

  const hour = Math.floor(minutes / 60);
  const minute = minutes % 60;

  if (hour > 0 && minute > 0) {
    return `${hour}시간 ${minute}분`;
  }

  if (hour > 0) {
    return `${hour}시간`;
  }

  return `${minute}분`;
}

export function formatDateLabel(dateString: string, pattern = "M월 d일") {
  const date = parseISO(dateString);
  return isValid(date) ? format(date, pattern) : dateString;
}

export function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function toPercentage(value: number) {
  return Math.round(value * 100);
}

export function getInitials(name: string) {
  return name.slice(0, 2);
}
