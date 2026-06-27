import PlotCard from "./PlotCard";
import type { Inventory } from "../../types/inventory";

interface Props {
  plots: Inventory[];

  onSelect: (
    plot: Inventory
  ) => void;
}

export default function PlotGrid({
  plots,
  onSelect,
}: Props) {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-7 xl:grid-cols-9 gap-2">
      {plots.map((plot) => (
        <PlotCard
          key={plot._id}
          plot={plot}
          onClick={onSelect}
        />
      ))}
    </div>
  );
}
