import {
  formatLeadStatusLabel,
} from "../../constants/leadStatuses";

interface Props {
  status: string;
}

function StatusBadge({ status }: Props) {
  const styles: Record<string, string> = {
    new: "bg-sky-100 text-sky-700",
    assigned: "bg-indigo-100 text-indigo-700",
    contacted: "bg-blue-100 text-blue-700",
    follow_up: "bg-orange-100 text-orange-700",
    interested: "bg-violet-100 text-violet-700",
    site_visit_scheduled:
      "bg-cyan-100 text-cyan-700",
    site_visit_done:
      "bg-teal-100 text-teal-700",
    office_meeting_scheduled:
      "bg-emerald-100 text-emerald-700",
    office_meeting_done:
      "bg-emerald-100 text-emerald-700",
    virtual_meeting_scheduled:
      "bg-lime-100 text-lime-700",
    virtual_meeting_done:
      "bg-lime-100 text-lime-700",
    negotiation:
      "bg-amber-100 text-amber-700",
    won: "bg-green-100 text-green-700",
    lost: "bg-slate-200 text-slate-700",
    duplicate:
      "bg-purple-100 text-purple-700",
    junk: "bg-red-100 text-red-700",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
        styles[status] ||
        "bg-slate-100 text-slate-700"
      }`}
    >
      {formatLeadStatusLabel(
        status
      ).toUpperCase()}
    </span>
  );
}

export default StatusBadge;
