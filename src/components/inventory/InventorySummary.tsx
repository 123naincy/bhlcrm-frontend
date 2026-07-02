import type { DashboardSummary } from "../../types/inventory";

interface Props {
  summary: DashboardSummary;
  phaseLabel?: string;
  phase?: number;
}

const statusCards = [
  {
    key: "totalUnits",
    title: "Total Plots",
    phase2Title: "Total Units",
    color: "bg-slate-700",
  },
  {
    key: "available",
    title: "Available",
    color: "bg-green-600",
  },
  {
    key: "hold",
    title: "Hold",
    color: "bg-amber-500",
  },
  {
    key: "sold",
    title: "Sold",
    color: "bg-red-600",
  },
] as const;

export default function InventorySummary({
  summary,
  phaseLabel,
  phase,
}: Props) {
  const areaUnit =
    summary.areaUnit ||
    (phase === 2 ? "Sq.Ft" : "Sq.Yd");

  const financeCards = [
    {
      key: "totalSales" as const,
      title: "Total Sales",
      color: "bg-indigo-600",
      format: (value: number) =>
        `₹ ${value.toLocaleString()}`,
    },
    {
      key: "totalReceived" as const,
      title: "Received",
      color: "bg-emerald-600",
      format: (value: number) =>
        `₹ ${value.toLocaleString()}`,
    },
    {
      key: "totalPending" as const,
      title: "Pending",
      color: "bg-orange-500",
      format: (value: number) =>
        `₹ ${value.toLocaleString()}`,
    },
    {
      key: "totalArea" as const,
      title: "Total Area",
      color: "bg-sky-600",
      format: (value: number) => {
        if (
          summary.areaUnit ===
            "Mixed" ||
          value == null
        ) {
          return "—";
        }

        return `${value.toLocaleString()} ${areaUnit}`;
      },
    },
  ];

  return (
    <div className="space-y-4 mb-6">

      {phaseLabel && (
        <h2 className="text-lg font-semibold text-slate-800">
          {phaseLabel}
          {" "}
          Overview
        </h2>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statusCards.map((card) => (
          <div
            key={card.key}
            className={`${card.color} text-white rounded-xl p-4 shadow`}
          >
            <h4 className="text-sm opacity-90">
              {phase === 2 &&
              "phase2Title" in card
                ? card.phase2Title
                : card.title}
            </h4>

            <h2 className="text-3xl font-bold mt-1">
              {summary[card.key]}
            </h2>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {financeCards.map((card) => (
          <div
            key={card.key}
            className={`${card.color} text-white rounded-xl p-4 shadow`}
          >
            <h4 className="text-sm opacity-90">
              {card.title}
            </h4>

            <h2 className="text-xl font-bold mt-1">
              {card.format(
                summary[card.key] || 0
              )}
            </h2>
          </div>
        ))}
      </div>

    </div>
  );
}
