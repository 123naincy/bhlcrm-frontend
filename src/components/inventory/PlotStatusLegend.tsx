export default function PlotStatusLegend() {
  const items = [
    {
      label: "Available",
      color: "bg-green-500",
    },
    {
      label: "Hold",
      color: "bg-amber-400",
    },
    {
      label: "Sold",
      color: "bg-red-500",
    },
  ];

  return (
    <div className="flex flex-wrap items-center gap-4 mb-4 text-sm text-slate-600">
      {items.map((item) => (
        <div
          key={item.label}
          className="flex items-center gap-2"
        >
          <span
            className={`w-4 h-4 rounded ${item.color}`}
          />

          <span>{item.label}</span>
        </div>
      ))}
    </div>
  );
}
