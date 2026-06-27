import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { getInventory } from "../../api/inventoryApi";
import type { Inventory } from "../../types/inventory";
import PlotStatusBadge from "../../components/inventory/PlotStatusBadge";
import LoadingSkeleton from "../../components/inventory/LoadingSkeleton";

export default function InventoryUnitDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [plot, setPlot] = useState<Inventory | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    const loadPlot = async () => {
      setLoading(true);

      try {
        const res = await getInventory(id);
        setPlot(res.data.data);
      } catch {
        setError("Failed to load inventory unit.");
      } finally {
        setLoading(false);
      }
    };

    loadPlot();
  }, [id]);

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (error || !plot) {
    return (
      <div className="p-6">
        <p className="text-red-600">
          {error || "Inventory unit not found."}
        </p>

        <button
          onClick={() => navigate("/inventory")}
          className="mt-4 px-4 py-2 border rounded-lg"
        >
          Back to Inventory
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl">
      <button
        onClick={() => navigate("/inventory")}
        className="mb-4 text-blue-600"
      >
        Back to Inventory
      </button>

      <div className="bg-white rounded-xl shadow border p-6 space-y-5">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold">
              Plot {plot.plotNo}
            </h1>

            <p className="text-gray-500 mt-1">
              Inventory No: {plot.inventoryNo}
            </p>
          </div>

          <PlotStatusBadge status={plot.status} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Detail label="Phase" value={`Phase ${plot.phase}`} />
          <Detail label="Type" value={plot.type} />
          <Detail
            label="Area"
            value={`${plot.area} ${plot.areaUnit}`}
          />
          {plot.block && (
            <Detail label="Block" value={plot.block} />
          )}
          {plot.tower && (
            <Detail label="Tower" value={plot.tower} />
          )}
        </div>
      </div>
    </div>
  );
}

function Detail({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <div className="text-sm text-gray-500">{label}</div>
      <div className="font-semibold">{value}</div>
    </div>
  );
}
