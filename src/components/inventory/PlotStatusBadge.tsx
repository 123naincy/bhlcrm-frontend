interface Props {
  status:
    | "available"
    | "hold"
    | "sold";
}

export default function PlotStatusBadge({
  status,
}: Props) {
  const colors = {
    available:
      "bg-green-500",

    hold:
      "bg-yellow-500",

    sold:
      "bg-red-500",
  };

  return (
    <span
      className={`text-white text-xs px-2 py-1 rounded ${colors[status]}`}
    >
      {status.toUpperCase()}
    </span>
  );
}