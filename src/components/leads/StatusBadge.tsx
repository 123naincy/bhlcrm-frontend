interface Props {
  status: string;
}

function StatusBadge({ status }: Props) {
  const styles: Record<string, string> = {
    assigned: "bg-indigo-100 text-indigo-700",
    contacted: "bg-blue-100 text-blue-700",
    follow_up: "bg-orange-100 text-orange-700",
    won: "bg-green-100 text-green-700",
    lost: "bg-slate-200 text-slate-700",
    junk: "bg-red-100 text-red-700",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-semibold ${
        styles[status] || "bg-slate-100 text-slate-700"
      }`}
    >
      {status.replace("_", " ").toUpperCase()}
    </span>
  );
}

export default StatusBadge;