import type { Tables } from "@/integrations/supabase/types";

export type ScheduleItem = Tables<"schedule_items">;

export const DAY_NAMES = [
  "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday",
];

export function todayDow(): number {
  return new Date().getDay();
}

export function nowHHMM(): string {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

export function fmtTime(t: string): string {
  // "HH:MM:SS" or "HH:MM"
  const [h, m] = t.split(":");
  const hh = parseInt(h, 10);
  const period = hh >= 12 ? "pm" : "am";
  const display = ((hh + 11) % 12) + 1;
  return `${display}:${m} ${period}`;
}

export function sortByStart(items: ScheduleItem[]): ScheduleItem[] {
  return [...items].sort((a, b) => a.start_time.localeCompare(b.start_time));
}

export function summariseDay(items: ScheduleItem[], dayName: string): string {
  if (items.length === 0) return `No class, no study today (${dayName}). Free day for you!`;
  const list = sortByStart(items)
    .map((i) => `- ${i.kind === "class" ? "Class" : "Study"}: ${i.title} (${fmtTime(i.start_time)}–${fmtTime(i.end_time)})`)
    .join("\n");
  return `Plan for ${dayName}:\n${list}`;
}