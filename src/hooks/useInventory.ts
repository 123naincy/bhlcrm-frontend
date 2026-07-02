import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import type { DashboardResponse } from "../types/inventory";
import {
  getDashboard,
} from "../api/inventoryApi";

let cachedDashboard:
  DashboardResponse | null = null;

export default function useInventory() {
  const [loading, setLoading] =
    useState(!cachedDashboard);

  const [dashboard, setDashboard] =
    useState<DashboardResponse | null>(
      cachedDashboard
    );

  const [error, setError] = useState("");

  const loadingRef = useRef(false);

  const loadDashboard = useCallback(
    async (options?: {
      silent?: boolean;
      force?: boolean;
    }) => {
      if (loadingRef.current) {
        return;
      }

      const hasCache =
        !!cachedDashboard;

      if (
        hasCache &&
        !options?.force
      ) {
        setDashboard(
          cachedDashboard
        );
        setLoading(false);
        return;
      }

      loadingRef.current = true;

      if (
        !options?.silent &&
        !hasCache
      ) {
        setLoading(true);
      }

      setError("");

      try {
        const res =
          await getDashboard();

        cachedDashboard =
          res.data.data;

        setDashboard(
          cachedDashboard
        );
      } catch (err: any) {
        if (!options?.silent) {
          setDashboard(null);
        }

        setError(
          err?.response?.data?.message ||
            err?.message ||
            "Failed to load inventory dashboard."
        );
      } finally {
        loadingRef.current = false;
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    void loadDashboard();
  }, [loadDashboard]);

  const reload = useCallback(
    () =>
      loadDashboard({
        force: true,
      }),
    [loadDashboard]
  );

  const reloadSilent = useCallback(
    () =>
      loadDashboard({
        silent: true,
        force: true,
      }),
    [loadDashboard]
  );

  return {
    loading,
    dashboard,
    error,
    reload,
    reloadSilent,
  };
}
