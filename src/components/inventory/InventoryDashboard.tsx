import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { RefreshCw } from "lucide-react";

import useInventory from "../../hooks/useInventory";
import { getBookingByInventory } from "../../api/bookingApi";
import { releaseHold } from "../../api/inventoryApi";

import InventorySummary from "../../components/inventory/InventorySummary";
import InventoryFilters from "../../components/inventory/InventoryFilters";
import PhaseTabs from "../../components/inventory/PhaseTabs";
import PlotGrid from "../../components/inventory/PlotGrid";
import Phase2InventoryView from "../../components/inventory/Phase2InventoryView";
import LoadingSkeleton from "../../components/inventory/LoadingSkeleton";
import EmptyState from "../../components/inventory/EmptyState";
import PlotStatusLegend from "./PlotStatusLegend";

import type { Inventory } from "../../types/inventory";
import PlotDetailDrawer from "./PlotDetailDrawer";
import HoldModal from "./HoldModal";
import SoldModal from "./sold/SoldModal";

export default function InventoryDashboard() {
  const navigate = useNavigate();

  const {
    loading,
    dashboard,
    error,
    reload,
    reloadSilent,
  } = useInventory();

  const [phase, setPhase] =
    useState(1);

  const [status, setStatus] =
    useState("");

  const [selectedPlot, setSelectedPlot] =
    useState<Inventory | null>(null);

  const [showHoldModal, setShowHoldModal] =
    useState(false);

  const [showSoldModal, setShowSoldModal] =
    useState(false);

  const handleReleaseHold = async () => {
    if (!selectedPlot?.holdId) {
      window.alert(
        "Hold record not found for this unit."
      );
      return;
    }

    const confirmed = window.confirm(
      "Release hold and mark this unit as available?"
    );

    if (!confirmed) return;

    try {
      await releaseHold(
        selectedPlot.holdId
      );

      setSelectedPlot(null);
      reloadSilent();
    } catch {
      window.alert(
        "Failed to release hold. Please try again."
      );
    }
  };

  const handleViewBooking = async () => {
    if (!selectedPlot) return;

    const plot = selectedPlot;

    setSelectedPlot(null);

    if (plot.bookingId) {
      navigate(`/bookings/${plot.bookingId}`);
      return;
    }

    try {
      const res =
        await getBookingByInventory(
          plot._id
        );

      navigate(
        `/bookings/${res.data.data._id}`
      );
    } catch {
      window.alert(
        "Booking not found for this plot."
      );
    }
  };

  const activeSummary = useMemo(() => {
    if (!dashboard) return null;

    return phase === 1
      ? dashboard.phase1Summary
      : dashboard.phase2Summary;
  }, [dashboard, phase]);

  const plots = useMemo(() => {
    if (!dashboard) return [];

    let data =
      phase === 1
        ? dashboard.phase1
        : dashboard.phase2;

    if (status) {
      data = data.filter(
        (item: Inventory) =>
          item.status === status
      );
    }

    return data;
  }, [
    dashboard,
    phase,
    status,
  ]);

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (error || !dashboard) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4">
          {error ||
            "Unable to load inventory dashboard."}
        </div>

        <button
          onClick={reload}
          className="mt-4 px-4 py-2 border rounded-lg"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-2 md:p-0">

      <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Inventory Management
          </h1>
          <p className="text-slate-500 mt-1">
            View and manage Phase 1 plots and Phase 2 buildings, apartments, and units
          </p>
        </div>

        <button
          type="button"
          onClick={reload}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      <InventorySummary
        summary={
          activeSummary ||
          dashboard.summary
        }
        phase={phase}
        phaseLabel={
          phase === 1
            ? "Phase 1"
            : "Phase 2"
        }
      />

      <PhaseTabs
        phase={phase}
        phase1Count={
          dashboard.phase1.length
        }
        phase2Count={
          dashboard.phase2.length
        }
        onChange={setPhase}
      />

      <PlotDetailDrawer
        open={!!selectedPlot}
        plot={selectedPlot ?? undefined}
        onClose={() =>
          setSelectedPlot(null)
        }
        onHold={() =>
          setShowHoldModal(true)
        }
        onSold={() =>
          setShowSoldModal(true)
        }
        onReleaseHold={
          handleReleaseHold
        }
        onViewBooking={
          handleViewBooking
        }
      />

      <HoldModal
        open={showHoldModal}
        inventoryId={
          selectedPlot?._id || ""
        }
        plotNo={
          selectedPlot?.plotNo || ""
        }
        onClose={() =>
          setShowHoldModal(false)
        }
        onSuccess={() => {
          setShowHoldModal(false);
          setSelectedPlot(null);
          reloadSilent();
        }}
      />

      <SoldModal
        open={showSoldModal}
        plot={selectedPlot}
        onClose={() =>
          setShowSoldModal(false)
        }
        onSuccess={() => {
          setShowSoldModal(false);
          setSelectedPlot(null);
          reloadSilent();
        }}
      />

      <InventoryFilters
        status={status}
        setStatus={setStatus}
      />

      {phase === 1 && activeSummary && (
        <p className="text-sm text-slate-500 mb-2">
          Showing
          {" "}
          {plots.length}
          {" "}
          of
          {" "}
          {activeSummary.totalUnits}
          {" "}
          Phase 1 plots
          {" "}
          ·
          {" "}
          {activeSummary.available}
          {" "}
          available,
          {" "}
          {activeSummary.hold}
          {" "}
          hold,
          {" "}
          {activeSummary.sold}
          {" "}
          sold
        </p>
      )}

      {phase === 2 && activeSummary && (
        <p className="text-sm text-slate-500 mb-2">
          Showing
          {" "}
          {plots.length}
          {" "}
          of
          {" "}
          {activeSummary.totalUnits}
          {" "}
          Phase 2 units
          {" "}
          ·
          {" "}
          {activeSummary.available}
          {" "}
          available,
          {" "}
          {activeSummary.hold}
          {" "}
          hold,
          {" "}
          {activeSummary.sold}
          {" "}
          sold
        </p>
      )}

      <PlotStatusLegend />

      {phase === 1 && (
        plots.length ? (
          <PlotGrid
            plots={plots}
            onSelect={(plot) =>
              setSelectedPlot(plot)
            }
          />
        ) : (
          <EmptyState />
        )
      )}

      {phase === 2 && (
        plots.length ? (
          <Phase2InventoryView
            units={plots}
            onSelect={(unit) =>
              setSelectedPlot(unit)
            }
          />
        ) : (
          <EmptyState />
        )
      )}

    </div>
  );
}
