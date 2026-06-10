const RELATIVE_UNITS: Array<{ unit: Intl.RelativeTimeFormatUnit; seconds: number }> = [
  { unit: "year", seconds: 31536000 },
  { unit: "month", seconds: 2592000 },
  { unit: "week", seconds: 604800 },
  { unit: "day", seconds: 86400 },
  { unit: "hour", seconds: 3600 },
  { unit: "minute", seconds: 60 },
];

const relativeFormatter = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
const dateFormatter = new Intl.DateTimeFormat("en", { dateStyle: "medium" });

/**
 * Formats a date as a relative string (e.g. "3 days ago") for recent dates,
 * falling back to an absolute date for anything older than a month.
 */
export function formatRelativeDate(date: string | null | undefined): string {
  if (!date) return "";

  const target = new Date(date);
  if (Number.isNaN(target.getTime())) return "";

  const diffSeconds = (target.getTime() - Date.now()) / 1000;
  const absSeconds = Math.abs(diffSeconds);

  if (absSeconds < 60) {
    return "just now";
  }

  for (const { unit, seconds } of RELATIVE_UNITS) {
    if (absSeconds >= seconds || unit === "minute") {
      const value = Math.round(diffSeconds / seconds);
      if (unit === "month" || unit === "year") {
        return dateFormatter.format(target);
      }
      return relativeFormatter.format(value, unit);
    }
  }

  return dateFormatter.format(target);
}
