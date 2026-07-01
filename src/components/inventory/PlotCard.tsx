import type { Inventory } from "../../types/inventory";

interface Props {
  plot: Inventory;

  onClick: (
    plot: Inventory
  ) => void;
}

const statusStyles = {
  available: {
    card: "bg-green-500 border-green-600 hover:bg-green-600",
    text: "text-white",
    sub: "text-green-50",
  },
  hold: {
    card: "bg-amber-400 border-amber-500 hover:bg-amber-500",
    text: "text-amber-950",
    sub: "text-amber-900",
  },
  sold: {
    card: "bg-red-500 border-red-600 hover:bg-red-600",
    text: "text-white",
    sub: "text-red-50",
  },
};

export default function PlotCard({
  plot,
  onClick,
}: Props) {
  const styles =
    statusStyles[plot.status];

  return (
    <button
      type="button"
      onClick={() =>
        onClick(plot)
      }
      className={`w-full rounded-lg border-2 shadow-sm transition transform hover:scale-105 hover:shadow-md p-2 min-h-[72px] flex flex-col items-center justify-center ${styles.card}`}
    >
      <span
        className={`text-sm font-bold leading-tight ${styles.text}`}
      >
        {plot.plotNo}
      </span>

      <span
        className={`text-[11px] font-medium mt-1 ${styles.sub}`}
      >
        {plot.area}
        {" "}
        {plot.areaUnit ||
          (plot.phase === 2
            ? "Sq.Ft"
            : "Sq.Yd")}
      </span>
    </button>
  );
}
