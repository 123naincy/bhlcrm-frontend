export type InventoryStatus =
  | "available"
  | "hold"
  | "sold";

export type InventoryType =
  | "plot"
  | "shop"
  | "apartment";

export interface Inventory {
  _id: string;

  inventoryNo: number;

  phase: number;

  block?: string;

  tower?: string;

  floor?: string;

  plotNo: string;

  title?: string;

  category?: string;

  type: InventoryType | string;

  area: number;

  areaUnit: string;

  status: InventoryStatus;

  bookingId?: string;

  holdId?: string;

  isPlot?: boolean;
}

export interface DashboardSummary {
  totalUnits: number;

  available: number;

  hold: number;

  sold: number;

  totalArea?: number;

  totalSales: number;

  totalReceived: number;

  totalPending: number;
}

export interface DashboardResponse {
  summary: DashboardSummary;

  phase1Summary: DashboardSummary;

  phase2Summary: DashboardSummary;

  phase1: Inventory[];

  phase2: Inventory[];
}

export const PHASE2_SECTIONS = [
  {
    id: "building-one",
    label: "Building One",
    block: "Building One",
    hasFloors: true,
  },
  {
    id: "building-two",
    label: "Building Two",
    block: "Building Two",
    hasFloors: true,
  },
  {
    id: "c-type",
    label: "C Type",
    block: "C Type",
    hasFloors: false,
    groupBy: "tower",
    description:
      "13 C-type blocks · 5 cards (2 BHK) in each block",
  },
  {
    id: "e-type",
    label: "E Type",
    block: "E Type",
    hasFloors: false,
    groupBy: "tower",
    description:
      "4 clusters · 8 units each · 2 BHK",
  },
  {
    id: "commercial",
    label: "Commercial",
    block: "Commercial",
    hasFloors: false,
    description: "9 commercial shops",
  },
  {
    id: "bunglow",
    label: "Bunglow",
    block: "Bunglow",
    hasFloors: false,
    groupBy: "category",
    description:
      "1 Single Bunglow · 1 Twin Bunglow",
  },
] as const;

export const PHASE2_FLOORS = [
  "Ground Floor",
  "First Floor",
  "Second Floor",
  "Third Floor",
] as const;
