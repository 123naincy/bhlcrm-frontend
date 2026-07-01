import type { Inventory } from "../../types/inventory";

interface Props {
  unit: Inventory;

  onClick: (
    unit: Inventory
  ) => void;

  /** C-type / E-type cards show 2 BHK as the main label */
  cTypeMode?: boolean;

  /** Commercial shop cards show shop number and area */
  shopMode?: boolean;
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

export default function UnitCard({
  unit,
  onClick,
  cTypeMode = false,
  shopMode = false,
}: Props) {
  const styles =
    statusStyles[unit.status];

  const unitIndex =
    unit.plotNo.split("-").pop() ||
    unit.plotNo;

  const usesFloorPosition =
    typeof unit.floorPosition ===
    "number";

  const primaryLabel = shopMode
    ? String(
        unit.floorPosition ??
          unitIndex
      )
    : cTypeMode
      ? "2 BHK"
      : usesFloorPosition
        ? String(unit.floorPosition)
        : unitIndex;

  const secondaryLabel = shopMode
    ? unit.category || "Shop"
    : cTypeMode
      ? `Unit ${unitIndex}`
      : usesFloorPosition
        ? unit.category || ""
        : unit.category || "";

  const areaLabel =
    usesFloorPosition ||
    cTypeMode ||
    shopMode
      ? `${unit.area} sq/ft`
      : "";

  return (
    <button
      type="button"
      onClick={() =>
        onClick(unit)
      }
      title={unit.title || unit.plotNo}
      className={`w-full rounded-lg border-2 shadow-sm transition transform hover:scale-105 hover:shadow-md p-2 min-h-[72px] flex flex-col items-center justify-center ${styles.card}`}
    >
      <span
        className={`text-xs font-bold leading-tight text-center ${styles.text}`}
      >
        {primaryLabel}
      </span>

      {secondaryLabel && (
        <span
          className={`text-[10px] font-medium mt-1 text-center ${styles.sub}`}
        >
          {secondaryLabel}
        </span>
      )}

      {areaLabel && (
        <span
          className={`text-[10px] font-semibold mt-0.5 text-center ${styles.sub}`}
        >
          {areaLabel}
        </span>
      )}
    </button>
  );
}
