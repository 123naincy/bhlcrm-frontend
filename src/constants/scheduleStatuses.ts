export const SCHEDULE_STATUSES = [
  "site_visit_scheduled",
  "office_meeting_scheduled",
  "virtual_meeting_scheduled",
] as const;

export type ScheduleStatus =
  (typeof SCHEDULE_STATUSES)[number];

export function requiresScheduleDate(
  status?: string
) {
  if (!status) return false;

  return SCHEDULE_STATUSES.includes(
    status as ScheduleStatus
  );
}

export function formatScheduleStatusLabel(
  status?: string
) {
  switch (status) {
    case "site_visit_scheduled":
      return "Site Visit";
    case "office_meeting_scheduled":
      return "Office Meeting";
    case "virtual_meeting_scheduled":
      return "Virtual Meeting";
    default:
      return "Schedule";
  }
}
