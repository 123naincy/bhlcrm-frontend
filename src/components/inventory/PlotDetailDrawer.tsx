import { X } from "lucide-react";
import type { Inventory } from "../../types/inventory";
import PlotStatusBadge from "./PlotStatusBadge";

interface Props {
  open: boolean;

  plot?: Inventory;

  onClose: () => void;

  onHold: () => void;

  onSold: () => void;

  onViewBooking: () => void;
}

export default function PlotDetailDrawer({
  open,
  plot,
  onClose,
  onHold,
  onSold,
  onViewBooking,
}: Props) {
  if (!open || !plot) return null;

  const isPlot =
    plot.isPlot ?? plot.phase === 1;

  const unitLabel = isPlot
    ? `Plot ${plot.plotNo}`
    : plot.title || plot.plotNo;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/40 z-40"
        onClick={onClose}
      />

      <div className="fixed right-0 top-0 h-full w-[480px] bg-white shadow-2xl z-50 overflow-y-auto">
        <div className="flex justify-between items-center p-5 border-b">
          <div>
            <h2 className="text-xl font-bold">
              {unitLabel}
            </h2>

            <div className="mt-2">
              <PlotStatusBadge
                status={plot.status}
              />
            </div>
          </div>

          <button onClick={onClose}>
            <X />
          </button>
        </div>

        <div className="p-5 space-y-5">
          <DetailField
            label="Unit No"
            value={
              plot.floorPosition
                ? String(plot.floorPosition)
                : plot.plotNo
            }
          />

          {plot.floorPosition && (
            <DetailField
              label="Inventory ID"
              value={plot.plotNo}
            />
          )}

          <DetailField
            label="Phase"
            value={`Phase ${plot.phase}`}
          />

          {plot.block && (
            <DetailField
              label="Section"
              value={plot.block}
            />
          )}

          {plot.floor && (
            <DetailField
              label="Floor"
              value={plot.floor}
            />
          )}

          {plot.tower && (
            <DetailField
              label="Tower / Cluster"
              value={plot.tower}
            />
          )}

          {plot.category && (
            <DetailField
              label="Unit Type"
              value={plot.category}
            />
          )}

          <DetailField
            label="Area"
            value={`${plot.area} ${plot.areaUnit}`}
          />

          <DetailField
            label="Inventory Type"
            value={plot.type}
          />
        </div>

        <div className="sticky bottom-0 left-0 w-full border-t bg-white p-4 flex gap-3">
          {plot.status === "available" && (
            <>
              <button
                onClick={onHold}
                className="flex-1 bg-yellow-500 text-white rounded-lg py-3"
              >
                Mark Hold
              </button>

              <button
                onClick={onSold}
                className="flex-1 bg-green-600 text-white rounded-lg py-3"
              >
                Mark Sold
              </button>
            </>
          )}

          {plot.status === "hold" && (
            <button
              onClick={onSold}
              className="w-full bg-green-600 text-white rounded-lg py-3"
            >
              Convert To Sold
            </button>
          )}

          {plot.status === "sold" && (
            <button
              onClick={onViewBooking}
              className="w-full bg-blue-600 text-white rounded-lg py-3"
            >
              View Booking
            </button>
          )}
        </div>
      </div>
    </>
  );
}

function DetailField({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <label className="text-sm text-gray-500">
        {label}
      </label>

      <h3 className="font-semibold">
        {value}
      </h3>
    </div>
  );
}
