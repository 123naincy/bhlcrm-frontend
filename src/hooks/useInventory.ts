import { useEffect, useState } from "react";

import type { DashboardResponse } from "../types/inventory";
import {
  getDashboard,
} from "../api/inventoryApi";

export default function useInventory() {
  const [loading, setLoading] =
    useState(true);

  const [dashboard, setDashboard] =
    useState<DashboardResponse | null>(
      null
    );

  const [error, setError] = useState("");

  const loadDashboard =
    async () => {
      setLoading(true);
      setError("");

      try {
        const res =
          await getDashboard();

        setDashboard(
          res.data.data
        );
      } catch (err: any) {
        setDashboard(null);
        setError(
          err?.response?.data?.message ||
            err?.message ||
            "Failed to load inventory dashboard."
        );
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    loadDashboard();
  }, []);

  return {
    loading,

    dashboard,

    error,

    reload:
      loadDashboard,
  };
}