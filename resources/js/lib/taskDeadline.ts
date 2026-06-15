import type { Task } from "@/types";

export type DeadlineState = "overdue" | "due-soon" | null;

const DAY_MS = 24 * 60 * 60 * 1000;
const RELATIVE_DAY_LIMIT = 6;

const relativeDayFormatter = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
const absoluteDateFormatter = new Intl.DateTimeFormat("en", { dateStyle: "medium" });

function dateOnly(value: string): string {
  return value.slice(0, 10);
}

/** Whole-day difference between a deadline's date and today's date (UTC-based). */
function daysFromToday(value: string): number | null {
  const deadline = Date.parse(`${dateOnly(value)}T00:00:00Z`);
  if (Number.isNaN(deadline)) return null;

  const today = Date.parse(`${dateOnly(new Date().toISOString())}T00:00:00Z`);

  return Math.round((deadline - today) / DAY_MS);
}

/**
 * "due-soon" covers today and tomorrow; "overdue" means the date has passed.
 * Completed tasks never get a state, regardless of their deadline.
 */
export function getDeadlineState(task: Pick<Task, "deadline" | "complete">): DeadlineState {
  if (!task.deadline || task.complete) return null;

  const days = daysFromToday(task.deadline);
  if (days === null) return null;
  if (days < 0) return "overdue";
  if (days <= 1) return "due-soon";

  return null;
}

export function compareByDeadline(a: Pick<Task, "deadline">, b: Pick<Task, "deadline">): number {
  const aTime = a.deadline ? new Date(a.deadline).getTime() : null;
  const bTime = b.deadline ? new Date(b.deadline).getTime() : null;

  if (aTime === null && bTime === null) return 0;
  if (aTime === null) return 1;
  if (bTime === null) return -1;

  return aTime - bTime;
}

/** Returns a new array, sorted by deadline ascending (tasks without a deadline go last). */
export function sortByDeadline<T extends Pick<Task, "deadline">>(tasks: T[]): T[] {
  return [...tasks].sort(compareByDeadline);
}

/** Converts an ISO date string to the `YYYY-MM-DD` format expected by <input type="date">. */
export function toDateInputValue(value?: string | null): string {
  if (!value) return "";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  return dateOnly(value);
}

/** Formats a deadline at day granularity (e.g. "today", "tomorrow", "in 3 days"). */
export function formatDeadlineDate(value: string): string {
  const days = daysFromToday(value);
  if (days === null) return "";

  if (Math.abs(days) <= RELATIVE_DAY_LIMIT) {
    return relativeDayFormatter.format(days, "day");
  }

  return absoluteDateFormatter.format(new Date(`${dateOnly(value)}T00:00:00Z`));
}
