export type DateParts = { month: string; day: string; year: string };

export function isDateComplete(parts: DateParts): boolean {
  return parts.month.length > 0 && parts.day.length > 0 && parts.year.length > 0;
}

export function isDateEmpty(parts: DateParts): boolean {
  return parts.month.length === 0 && parts.day.length === 0 && parts.year.length === 0;
}

/**
 * Combines month/day/year strings into an ISO "YYYY-MM-DD" date, or null if
 * the parts don't form a real calendar date (e.g. month 13, Feb 30).
 */
export function toIsoDate(parts: DateParts): string | null {
  if (!isDateComplete(parts) || parts.year.length !== 4) return null;

  const month = Number(parts.month);
  const day = Number(parts.day);
  const year = Number(parts.year);

  const date = new Date(year, month - 1, day);
  const isRealDate =
    date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
  if (!isRealDate) return null;

  return `${String(year).padStart(4, "0")}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

export function fromIsoDate(iso: string | null | undefined): DateParts {
  const match = iso ? iso.match(/^(\d{4})-(\d{2})-(\d{2})/) : null;
  if (!match) return { month: "", day: "", year: "" };
  const [, year, month, day] = match;
  return { month, day, year };
}

export function onlyDigits(text: string, maxLength: number): string {
  return text.replace(/[^0-9]/g, "").slice(0, maxLength);
}
