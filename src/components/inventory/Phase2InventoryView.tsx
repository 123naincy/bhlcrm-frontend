import { useMemo, useState } from "react";

import UnitCard from "./UnitCard";
import type { Inventory } from "../../types/inventory";
import {
  PHASE2_FLOORS,
  PHASE2_SECTIONS,
} from "../../types/inventory";

interface Props {
  units: Inventory[];

  onSelect: (
    unit: Inventory
  ) => void;
}

export default function Phase2InventoryView({
  units,
  onSelect,
}: Props) {
  const [
    activeSection,
    setActiveSection,
  ] = useState<string>(
    PHASE2_SECTIONS[0].id
  );

  const [
    activeFloor,
    setActiveFloor,
  ] = useState<string>(
    PHASE2_FLOORS[0]
  );

  const sectionConfig =
    PHASE2_SECTIONS.find(
      (section) =>
        section.id ===
        activeSection
    ) || PHASE2_SECTIONS[0];

  const sectionFloors = useMemo(() => {
    return "floors" in sectionConfig &&
      sectionConfig.floors
      ? [...sectionConfig.floors]
      : [...PHASE2_FLOORS];
  }, [sectionConfig]);

  const sectionUnits =
    useMemo(() => {
      return units.filter(
        (unit) =>
          unit.block ===
          sectionConfig.block
      );
    }, [units, sectionConfig.block]);

  const floorUnits =
    useMemo(() => {
      if (
        !sectionConfig.hasFloors
      ) {
        return sectionUnits;
      }

      return sectionUnits.filter(
        (unit) =>
          unit.floor === activeFloor
      );
    }, [
      sectionUnits,
      sectionConfig.hasFloors,
      activeFloor,
    ]);

  const groupedUnits =
    useMemo(() => {
      const groupBy =
        "groupBy" in sectionConfig
          ? sectionConfig.groupBy
          : null;

      if (!groupBy) {
        return null;
      }

      const groups = new Map<
        string,
        Inventory[]
      >();

      for (const unit of floorUnits) {
        const key =
          groupBy === "tower"
            ? unit.tower ||
              unit.plotNo
            : unit.category ||
              "Other";

        if (!groups.has(key)) {
          groups.set(key, []);
        }

        groups.get(key)!.push(unit);
      }

      return Array.from(
        groups.entries()
      ).sort(([a], [b]) =>
        a.localeCompare(b, undefined, {
          numeric: true,
        })
      );
    }, [
      floorUnits,
      sectionConfig,
    ]);

  const isCTypeSection =
    sectionConfig.id === "c-type";

  const isETypeSection =
    sectionConfig.id === "e-type";

  const isRowVillaSection =
    isCTypeSection || isETypeSection;

  const isCommercialSection =
    sectionConfig.id === "commercial";

  const groupedUnitsSorted =
    useMemo(() => {
      if (!groupedUnits) {
        return null;
      }

      return groupedUnits.map(
        ([tower, towerUnits]) => [
          tower,
          [...towerUnits].sort(
            (a, b) =>
              a.plotNo.localeCompare(
                b.plotNo,
                undefined,
                { numeric: true }
              )
          ),
        ] as [string, Inventory[]]
      );
    }, [groupedUnits]);

  const sectionStats = useMemo(() => {
    const available =
      sectionUnits.filter(
        (unit) =>
          unit.status ===
          "available"
      ).length;

    const hold =
      sectionUnits.filter(
        (unit) =>
          unit.status === "hold"
      ).length;

    const sold =
      sectionUnits.filter(
        (unit) =>
          unit.status === "sold"
      ).length;

    const cTypeBlocks = isCTypeSection
      ? new Set(
          sectionUnits
            .map(
              (unit) =>
                unit.tower || ""
            )
            .filter(Boolean)
        ).size
      : 0;

    return {
      total: sectionUnits.length,
      available,
      hold,
      sold,
      cTypeBlocks,
    };
  }, [sectionUnits, isCTypeSection]);

  const getSectionTabCount = (
    sectionId: string,
    block: string
  ) => {
    const blockUnits = units.filter(
      (unit) => unit.block === block
    );

    if (sectionId === "c-type") {
      return (
        new Set(
          blockUnits
            .map(
              (unit) =>
                unit.tower || ""
            )
            .filter(Boolean)
        ).size || 13
      );
    }

    return blockUnits.length;
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {PHASE2_SECTIONS.map(
          (section) => {
            const count =
              getSectionTabCount(
                section.id,
                section.block
              );

            return (
              <button
                key={section.id}
                type="button"
                onClick={() => {
                  setActiveSection(
                    section.id
                  );

                  const floors =
                    "floors" in section &&
                    section.floors
                      ? section.floors[0]
                      : PHASE2_FLOORS[0];

                  setActiveFloor(floors);
                }}
                className={`px-4 py-2 rounded-lg border text-sm font-medium transition ${
                  activeSection ===
                  section.id
                    ? "bg-slate-900 text-white border-slate-900"
                    : "bg-white text-slate-700 border-slate-200 hover:border-slate-400"
                }`}
              >
                {section.label}

                <span className="ml-2 opacity-80">
                  ({count})
                </span>
              </button>
            );
          }
        )}
      </div>

      <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="font-semibold text-slate-900">
              {sectionConfig.label}
            </h3>

            {"description" in
              sectionConfig &&
              !!sectionConfig.description && (
                <p className="text-sm text-slate-500 mt-1">
                  {
                    sectionConfig.description as string
                  }
                </p>
              )}
          </div>

          <p className="text-sm text-slate-600">
            {isCTypeSection ? (
              <>
                {sectionStats.cTypeBlocks}
                {" "}
                C-type blocks ·
                {" "}
                {sectionStats.total}
                {" "}
                flats (2 BHK) ·
                {" "}
                {sectionStats.available}
                {" "}
                available
              </>
            ) : (
              <>
                {sectionStats.total}
                {" "}
                units ·
                {" "}
                {sectionStats.available}
                {" "}
                available ·
                {" "}
                {sectionStats.hold}
                {" "}
                hold ·
                {" "}
                {sectionStats.sold}
                {" "}
                sold
              </>
            )}
          </p>
        </div>

        {sectionConfig.hasFloors && (
          <div className="flex flex-wrap gap-2 mt-4">
            {sectionFloors.map(
              (floor) => {
                const count =
                  sectionUnits.filter(
                    (unit) =>
                      unit.floor ===
                      floor
                  ).length;

                return (
                  <button
                    key={floor}
                    type="button"
                    onClick={() =>
                      setActiveFloor(
                        floor
                      )
                    }
                    className={`px-3 py-1.5 rounded-md text-sm border ${
                      activeFloor ===
                      floor
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white text-slate-700 border-slate-200"
                    }`}
                  >
                    {floor}

                    <span className="ml-1 opacity-80">
                      ({count})
                    </span>
                  </button>
                );
              }
            )}
          </div>
        )}
      </div>

      {!floorUnits.length && (
        <div className="text-center py-12 text-slate-500 border rounded-lg bg-white">
          No units in this section yet.
          Run
          {" "}
          <code className="text-xs bg-slate-100 px-1 py-0.5 rounded">
            node scripts/seedPhase2Units.mjs --force
          </code>
          {" "}
          to seed Phase 2 inventory.
        </div>
      )}

      {groupedUnitsSorted &&
        groupedUnitsSorted.map(
          ([tower, towerUnits]) => (
            <div
              key={tower}
              className="rounded-xl border border-slate-200 bg-white p-4 space-y-3"
            >
              <div className="flex items-center justify-between gap-2">
                <h4 className="text-base font-bold text-slate-800">
                  {tower}
                </h4>

                <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
                  {isCTypeSection
                    ? "5 × 2 BHK"
                    : `${towerUnits.length} units`}
                </span>
              </div>

              <div
                className={
                  isRowVillaSection
                    ? isCTypeSection
                      ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2"
                      : "grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-2"
                    : "grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2"
                }
              >
                {towerUnits.map(
                  (unit) => (
                    <UnitCard
                      key={unit._id}
                      unit={unit}
                      cTypeMode={
                        isRowVillaSection
                      }
                      onClick={onSelect}
                    />
                  )
                )}
              </div>
            </div>
          )
        )}

      {!groupedUnitsSorted &&
        floorUnits.length > 0 && (
          <div
            className={
              isCommercialSection
                ? "grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-2"
                : "grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 xl:grid-cols-12 gap-2"
            }
          >
            {floorUnits.map((unit) => (
              <UnitCard
                key={unit._id}
                unit={unit}
                shopMode={
                  isCommercialSection
                }
                onClick={onSelect}
              />
            ))}
          </div>
        )}

      {sectionConfig.hasFloors &&
        floorUnits.length > 0 &&
        !isCommercialSection && (
          <p className="text-xs text-slate-500">
            {activeFloor}
            :
            {" "}
            {floorUnits.filter(
              (unit) =>
                unit.category ===
                "1 BHK"
            ).length}
            {" "}
            × 1 BHK,
            {" "}
            {floorUnits.filter(
              (unit) =>
                unit.category ===
                "1 BLK"
            ).length}
            {" "}
            × 1 BLK
          </p>
        )}
    </div>
  );
}
