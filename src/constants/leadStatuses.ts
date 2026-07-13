export const LEAD_STATUS_OPTIONS = [
  { value: "new", label: "New" },
  { value: "assigned", label: "Assigned" },
  { value: "contacted", label: "Contacted" },
  { value: "follow_up", label: "Follow Up" },
  {
    value: "site_visit_scheduled",
    label: "Site Visit Scheduled",
  },
  {
    value: "site_visit_done",
    label: "Site Visit Done",
  },
  {
    value: "office_meeting_done",
    label: "Office Meeting Done",
  },
  {
    value: "virtual_meeting_done",
    label: "Virtual Meeting Done",
  },
  { value: "won", label: "Won" },
  { value: "lost", label: "Lost" },
  { value: "duplicate", label: "Duplicate" },
  { value: "junk", label: "Junk" },
] as const;

export function formatLeadStatusLabel(
  status?: string
) {
  if (!status) return "-";

  const match =
    LEAD_STATUS_OPTIONS.find(
      (item) =>
        item.value === status
    );

  if (match) {
    return match.label;
  }

  return status
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) =>
      char.toUpperCase()
    );
}
